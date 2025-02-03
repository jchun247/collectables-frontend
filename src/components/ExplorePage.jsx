import { useState, useRef } from 'react'
import SearchAndFilterHeader from './SearchAndFilterHeader';
import LoadingCardGrid from './LoadingCardGrid';
import { Button } from "@/components/ui/button";
import RenderCard from './RenderCard';

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
            const token = await getAccessTokenSilently();
            try {
                const queryParams = {};
                // Conditionally add each parameter if it has a value
                if (pageNum != null) queryParams.page = pageNum;
                if (sortOption) queryParams.sortOption = sortOption;
                if (searchQuery) queryParams.query = searchQuery;
                // Get selected games from the game object
                const selectedGames = Object.entries(filters.game || {})
                    .filter(([_, isSelected]) => isSelected)
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
                setCards(data.items);
                setError(null);
            } catch (error) {
                setError(error);
            }
        } else {
            setError('You are not authenticated. Please login to view cards.');
        }
    }

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
                        {cards.map((card, index) =>
                            <RenderCard key={card.name} card={card} index={index} />)}
                    </div>

                    {/* No Results State*/}
                    {/* {filteredCards.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No cards found matching your search</p>
                        </div>
                    )} */}

                    {/* End of results state */}
                    {/* {!hasMore && filteredCards.length > 0 && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">You've reached the end of the list.</p>
                        </div>
                    )} */}
                </>
            )}
            
        </div>
    )
}

export default ExplorePage;
