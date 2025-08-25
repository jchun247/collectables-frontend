import { useState, useEffect, useRef, useCallback } from 'react'
import SearchAndFilterHeader from '../components/SearchAndFilterHeader';
import LoadingCardGrid from '../components/LoadingCardGrid';
import { Button } from "@/components/ui/button";
import RenderCard from '../components/RenderCard';
import { CardSkeleton } from "@/components/ui/cardskeleton";
import CardDetailsDialog from '../components/CardDetailsDialog';
import CardCollectionEntryDialog from '../components/CardCollectionEntryDialog';
import { useCardDialog } from '@/hooks/useCardDialog';

const ExplorePage = () => {
    const PAGE_SIZE = 15; // Match backend pagination size
    const {
        selectedCard,
        isDetailsOpen,
        setIsDetailsOpen,
        collectionEntryState,
        setCollectionEntryState,
        handleCardClick,
        handleAction,
        handleSubmit,
    } = useCardDialog();

    const [cards, setCards] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("name-asc");
    const [selectedSets, setSelectedSets] = useState([]);
    const [filters, setFilters] = useState({
        condition: 'NEAR_MINT',
        finishes: {},
        minPrice: 0,
        maxPrice: 9999,
        setIds: [],
    });

    useEffect(() => {
        const selectedIds = selectedSets.map(set => set.id);
        setFilters(prev => ({
            ...prev,
            setIds: selectedIds
        }));
    }, [selectedSets]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    // Reference for the intersection observer
    const observer = useRef();
    // Reference for the last card element
    const lastCardRef = useRef();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchCards = useCallback(async (pageNum = 0, isInitial = true) => {
        if (isInitial) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }
        try {
            const queryParams = {};
            // Conditionally add each parameter if it has a value
            if (pageNum != null) queryParams.page = pageNum;
            if (sortOption) queryParams.sortOption = sortOption;
            if (searchQuery) queryParams.searchQuery = searchQuery;
            // Get selected games from the game object
            // const selectedGames = Object.entries(filters.game || {})
            //     .filter(([_, isSelected]) => isSelected) // eslint-disable-line no-unused-vars
            //     .map(([game]) => game);
            // if (selectedGames.length > 0) queryParams.games = selectedGames.join(',');
            // if (filters.productType) queryParams.productType = filters.productType;
            if (filters.condition) queryParams.condition = filters.condition;
            if (filters.minPrice) queryParams.minPrice = filters.minPrice;
            if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
            // Get selected finishes from the finish object
            const selectedFinishes = Object.entries(filters.finishes || {})
                .filter(([_, isSelected]) => isSelected) // eslint-disable-line no-unused-vars
                .map(([finish]) => finish);
            if (selectedFinishes.length > 0) queryParams.finishes = selectedFinishes.join(',')
            if (filters.setIds && filters.setIds.length > 0) queryParams.setIds = filters.setIds.join(',');

            const response = await fetch(`${apiBaseUrl}/cards?${new URLSearchParams(queryParams)}`);

            // Check if response is ok before parsing JSON
            if (!response.ok) {
                throw new Error("Something went wrong. Please try again later.");
            }

            // Handle response
            const data = await response.json();
            if (isInitial) {
                setCards(data.items);
                setCurrentPage(0);
            } else {
                setCards(prev => [...prev, ...data.items]);
                setCurrentPage(pageNum);
            }
            setHasMore(data.items.length > 0 && data.items.length === PAGE_SIZE);
            setError(null);
        } catch {
            // Use a generic error message for all server/network errors
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [sortOption, searchQuery, filters, apiBaseUrl, PAGE_SIZE]);

    // Set up intersection observer
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 0.1,
        };

        const handleObserver = (entries) => {
            const [target] = entries;
            if (target.isIntersecting && hasMore && !loading && !isLoadingMore) {
                fetchCards(currentPage + 1, false);
            }
        };

        const observerInstance = new IntersectionObserver(handleObserver, options);
        observer.current = observerInstance;

        // Always disconnect from the previous observation
        if (observer.current) {
            observer.current.disconnect();
        }

        // Observe the new last card element
        if (lastCardRef.current) {
            observer.current.observe(lastCardRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [hasMore, loading, isLoadingMore, currentPage, fetchCards]);

    // Effect for search/filter changes
    useEffect(() => {
        setCards([]);
        setCurrentPage(0);
        fetchCards(0, true);
    }, [searchQuery, sortOption, filters, fetchCards]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 space-y-4">
                <h1 className="text-3xl font-bold">Explore Cards</h1>
                <SearchAndFilterHeader 
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                    sortBy={sortOption} setSortBy={setSortOption} 
                    filters={filters} setFilters={setFilters}
                    fetchCards={fetchCards}
                    selectedSets={selectedSets}
                    setSelectedSets={setSelectedSets}
                />

                { /* Error State */}
                {error && !isRetrying && (
                    <div className="text-center py-8">
                        <p className="text-red-500">{error}</p>
                        <Button
                            variant="outline" 
                            disabled={isRetrying}
                            onClick={() => {
                                setIsRetrying(true);
                                // Create a promise that resolves after 2 seconds
                                const delay = new Promise(resolve => setTimeout(resolve, 2000));
                                // Wait for both the delay and the fetch to complete
                                Promise.all([delay, fetchCards(1, true)]).finally(() => {
                                    setIsRetrying(false);
                                });
                            }}
                            className="mt-4"
                        >
                            {isRetrying ? "Retrying..." : "Try Again"}
                        </Button>
                    </div>
                )}

                { /* Retry Loading State */ }
                {isRetrying && <LoadingCardGrid count={PAGE_SIZE}/>}

                { /* Initial Loading State with Card Skeleton Grid */ }
                {loading && !error && <LoadingCardGrid count={PAGE_SIZE}/>}

                { /* Cards Grid*/ }
                {!loading && !error && (
                    <>
                        {/* Render cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-6">
                            {cards.map((card, index) => (
                                <div
                                    key={`${card.name}-${index}`}
                                    ref={index === cards.length - 1 ? lastCardRef : null}
                                    onClick={() => handleCardClick(card)}
                                >
                                    <RenderCard
                                        card={card}
                                        preventDialogOnCardClick={true}
                                    />
                                </div>
                            ))}
                            {/* Display loading skeletons  */}
                            {isLoadingMore && (
                                <>
                                    {[...Array(Math.min(PAGE_SIZE, 5))].map((_, i) => (
                                        <CardSkeleton key={`loading-skeleton-${i}`} />
                                    ))}
                                </>
                            )}
                        </div>

                        {/* No Results State*/}
                        {cards.length === 0 && !loading && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No cards found matching your search</p>
                            </div>
                        )}

                        {/* End of results state */}
                        {!hasMore && cards.length > 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">You&apos;ve reached the end of the list.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedCard && (
                <CardDetailsDialog
                    isOpen={isDetailsOpen}
                    onOpenChange={setIsDetailsOpen}
                    cardDetails={selectedCard}
                    onAction={handleAction}
                />
            )}

            {collectionEntryState.isOpen && (
                <CardCollectionEntryDialog
                    isOpen={collectionEntryState.isOpen}
                    onOpenChange={(isOpen) => setCollectionEntryState({ ...collectionEntryState, isOpen })}
                    type={collectionEntryState.type}
                    prices={collectionEntryState.prices}
                    cardId={collectionEntryState.cardDetails.id}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    )
}

export default ExplorePage;
