import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import LoadingCardGrid from '../components/LoadingCardGrid';
import RenderCard from '../components/RenderCard';
import { useAuth0 } from "@auth0/auth0-react";
import setsData from "@/data/sets.json";
import { CARD_SERIES_MAPPING, formatDate } from "@/utils/textFormatters"

const SetCardsPage = () => {
    const { setId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const PAGE_SIZE = 15; // Match backend pagination size
    const [cards, setCards] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    // Reference for the intersection observer
    const observer = useRef();
    // Reference for the last card element
    const lastCardRef = useRef();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Find set details from sets.json
    const setDetails = Object.values(setsData.setsBySeries)
        .flat()
        .find(set => set.id === setId);

    const fetchSetCards = useCallback(async (pageNum = 0, isInitial = true) => {
        if (isAuthenticated) {
            if (isInitial) {
                setLoading(true);
            } else {
                setIsLoadingMore(true);
            }
            
            try {
                const token = await getAccessTokenSilently();
                const queryParams = new URLSearchParams({
                    setId,
                    page: pageNum.toString(),
                });
                

                const response = await fetch(`${apiBaseUrl}/cards?${queryParams}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                if (!response.ok) {
                    throw new Error("Failed to fetch set cards");
                }

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
                setError("Something went wrong. Please try again later.");
            } finally {
                setLoading(false);
                setIsLoadingMore(false);
            }
        } else {
            setError("You are not authenticated. Please login to view cards.");
            setLoading(false);
        }
    }, [setId, isAuthenticated, getAccessTokenSilently, apiBaseUrl, PAGE_SIZE]);

    // Effect for initial load
    useEffect(() => {
        setCards([]);
        setCurrentPage(0);
        fetchSetCards(0, true);
    }, [setId, isAuthenticated, fetchSetCards]);

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
                fetchSetCards(currentPage + 1, false);
            }
        };

        const observerInstance = new IntersectionObserver(handleObserver, options);
        observer.current = observerInstance;

        if (observer.current) {
            observer.current.disconnect();
        }

        if (lastCardRef.current) {
            observer.current.observe(lastCardRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [hasMore, loading, isLoadingMore, currentPage, fetchSetCards]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Set Header */}
            {setDetails && (
                <div className="mb-8 bg-accent/50 rounded-lg p-6 shadow-md">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Logo and Name Section */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="flex flex-col items-center gap-2">
                                <img 
                                    src={setDetails.images.find(img => img.imageType === "logo")?.url}
                                    alt={`${setDetails.name} logo`}
                                    className="max-w-[200px]"
                                />
                                {/* <img 
                                    src={setDetails.images.find(img => img.imageType === "symbol")?.url}
                                    alt={`${setDetails.name} symbol`}
                                    className="w-8 h-8"
                                /> */}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{setDetails.name}</h1>
                                <p>{formatDate(setDetails.releaseDate)}</p>
                                {/* <p className="text-muted-foreground">Series: {setDetails.series.replace(/_/g, ' ')}</p> */}
                            </div>
                        </div>
                        
                        {/* Series Section */}
                        <div className="flex flex-col justify-center gap-1 min-w-[150px]">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Series</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => navigate(`/sets?series=${setDetails.series}`)}
                                    className="hover:text-muted-foreground/80 hover:underline"
                                >
                                    {CARD_SERIES_MAPPING[setDetails.series]}
                                </button>
                            </div>
                        </div>

                        {/* Symbol section */}
                        <div className="flex flex-col justify-center gap-1 min-w-[75px]">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Symbol</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <img
                                    src={setDetails.images.find(img => img.imageType === "symbol")?.url}
                                    alt={`${setDetails.name} symbol`}
                                    className="w-10 h-6"
                                />
                            </div>
                        </div>

                        {/* Total Cards Section */}
                        <div className="flex flex-col justify-center gap-1 min-w-[150px]">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Total Cards</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{setDetails.printedTotal} + {setDetails.total - setDetails.printedTotal} secret</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading && <LoadingCardGrid count={15}/>}

            {/* Cards Grid */}
            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
                        {cards.map((card, index) => (
                            <div 
                                key={`${card.name}-${index}`}
                                ref={index === cards.length - 1 ? lastCardRef : null}
                            >
                                <RenderCard 
                                    card={card} 
                                    getAccessTokenSilently={getAccessTokenSilently}
                                    apiBaseUrl={apiBaseUrl}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Loading More State */}
                    {isLoadingMore && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
                            {[...Array(Math.min(PAGE_SIZE, 5))].map((_, i) => (
                                <div key={`loading-${i}`}>
                                    <LoadingCardGrid count={1} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* End of results state */}
                    {!hasMore && cards.length > 0 && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">You&apos;ve reached the end of the list.</p>
                        </div>
                    )}

                    {/* No Results State */}
                    {cards.length === 0 && !loading && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No cards found in this set</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SetCardsPage;
