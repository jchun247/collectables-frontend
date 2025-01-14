import { useState, useEffect } from 'react'
import { CardSkeleton } from "@/components/ui/cardskeleton";
import SearchAndFilterHeader from './SearchAndFilterHeader';

const ExplorePage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [filters, setFilters] = useState({
        game: [],
        productType: [],
        condition: []
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <SearchAndFilterHeader 
                searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                sortBy={sortBy} setSortBy={setSortBy} filters={filters} setFilters={setFilters} 
            />

            { /* Card Grid */ }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(12).fill(0).map((_, index) => (
                    <CardSkeleton key={index} />
                ))}
            </div>
            
        </div>
    )
}

export default ExplorePage;