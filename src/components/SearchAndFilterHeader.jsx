import { useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from "@/components/ui/input";
import FilterSortBy from './FilterSortBy';
import FilterSidebar from './FilterSidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PropTypes from 'prop-types';


const SearchAndFilterHeader = ({ searchQuery, setSearchQuery, 
    sortBy, setSortBy, 
    filters, setFilters,
    fetchCards }) => {
    
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    // Create a stable debounced function for API calls
    const debouncedSearchUpdate = useCallback(
        debounce((value) => {
            setSearchQuery(value);
        }, 500),
        [setSearchQuery]
    );

    // Handle search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setLocalSearchQuery(value); // Update local state immediately
        debouncedSearchUpdate(value); // Debounce the update to parent
    };


    const activeFiltersCount = Object.entries(filters).reduce((count, [category, value]) => {
      if (category === 'game') {
        // For game (checkbox), count true values
        return count + Object.values(value).filter(Boolean).length;
      } else {
        // For condition and productType (radio), count if value exists
        return count + (value ? 1 : 0);
      }
    }, 0);
  
    return (
        <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold">Explore Cards</h1>
        
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow flex">
                    <div className="relative flex-grow">
                        <Input
                            placeholder="Search any card..."
                            value={localSearchQuery}
                            onChange={handleSearchChange}
                            className="bg-background rounded-r-none"
                        />
                    </div>
                    <Button 
                        variant="outline" 
                        className="rounded-l-none border-l-0"
                        onClick={() => {
                            // For explicit search button click, update both states immediately
                            setLocalSearchQuery(localSearchQuery);
                            setSearchQuery(localSearchQuery);
                            fetchCards(0, true);
                        }}
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex gap-4">
                    <FilterSortBy sortBy={sortBy} setSortBy={setSortBy} />

                    {/* Filter sidebar button*/}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="flex gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            <FilterSidebar filters={filters} setFilters={setFilters} />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
  )
}

SearchAndFilterHeader.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    setSortBy: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    fetchCards: PropTypes.func.isRequired
}

export default SearchAndFilterHeader;
