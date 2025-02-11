import { useState, useEffect, useRef } from 'react'
import SearchAndFilterHeader from '../components/SearchAndFilterHeader';
import LoadingCardGrid from '../components/LoadingCardGrid';
import { Button } from "@/components/ui/button";
import RenderCard from '../components/RenderCard';

import { useAuth0 } from "@auth0/auth0-react";


const ExplorePage = () => {

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [cards, setCards] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("name");
    const [filters, setFilters] = useState({
        game: {},
        productType: 'cards',
        condition: 'NEAR_MINT'
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Reference for the intersection observer
    const observer = useRef();
    // Reference for the last card element
    const lastCardRef = useRef();

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchCards = async (pageNum = 0, isInitial = true) => {
        if (isAuthenticated) {
            if (isInitial) {
                setLoading(true);
            } else {
                setIsLoadingMore(true);
            }
            const token = await getAccessTokenSilently();
            try {
                const queryParams = {};
                // Conditionally add each parameter if it has a value
                if (pageNum != null) queryParams.page = pageNum;
                if (sortOption) queryParams.sortOption = sortOption;
                if (searchQuery) queryParams.query = searchQuery;
                // Get selected games from the game object
                const selectedGames = Object.entries(filters.game || {})
                    .filter(([_, isSelected]) => isSelected) // eslint-disable-line no-unused-vars
                    .map(([game]) => game);
                if (selectedGames.length > 0) queryParams.games = selectedGames.join(',');
                // if (filters.productType) queryParams.productType = filters.productType;
                if (filters.condition) queryParams.condition = filters.condition;

                const response = await fetch(`${apiBaseUrl}/cards?${new URLSearchParams(queryParams)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Handle response
                const data = await response.json();
                if (isInitial) {
                    setCards(data.items);
                } else {
                    setCards(prev => [...prev, ...data.items]);
                }
                setHasMore(data.items.length === 12); // Assuming 12 is the page size
                setError(null);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
                setIsLoadingMore(false);
            }
        } else {
            setError("You are not authenticated. Please login to view cards.");
        }
    }

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
                fetchCards(Math.ceil(cards.length / 12), false);
            }
        };

        const observerInstance = new IntersectionObserver(handleObserver, options);
        observer.current = observerInstance;

        return () => {
            if (observerInstance) {
                observerInstance.disconnect();
            }
        };
    }, [hasMore, loading, isLoadingMore, cards.length]);

    // Attach observer to last card
    useEffect(() => {
        if (lastCardRef.current) {
            observer.current?.observe(lastCardRef.current);
        }
    }, [cards]);

    // Effect for search/filter changes
    useEffect(() => {
        setCards([]);
        fetchCards(0, true);
    }, [searchQuery, sortOption, filters, isAuthenticated])

    return (
        <div className="container mx-auto px-4 py-8">
            <SearchAndFilterHeader 
                searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                sortBy={sortOption} setSortBy={setSortOption} 
                filters={filters} setFilters={setFilters}
                fetchCards={fetchCards}
            />

            { /* Error State */}
            {error && (
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                    <Button
                        variant="outline" onClick={() => fetchCards(1, true)}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            )}

            { /* Initial Loading State with Card Skeleton Grid */ }
            {loading && !error && <LoadingCardGrid count={12}/>}

            { /* Cards Grid*/ }
            {!loading && !error && (
                <>
                    {/* Render cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                        {cards.map((card, index) => (
                            <div 
                                key={`${card.name}-${index}`}
                                ref={index === cards.length - 1 ? lastCardRef : null}
                            >
                                <RenderCard card={card} index={index} />
                            </div>
                        ))}
                        {isLoadingMore && <LoadingCardGrid count={4}/>}
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
    )
}

export default ExplorePage;
