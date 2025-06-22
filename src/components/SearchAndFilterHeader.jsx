import { useState, useMemo } from 'react'
import debounce from 'lodash/debounce'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from "@/components/ui/input";
import FilterSortBy from './FilterSortBy';
import FilterSidebar from './FilterSidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PropTypes from 'prop-types';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"


const SearchAndFilterHeader = ({ 
    searchQuery, setSearchQuery, 
    sortBy, setSortBy, 
    filters, setFilters,
    hideFilters = false,
    hideSortBy = false,
    customSortOptions,
    showHideSoldCards = false,
    hideSoldCards,
    setHideSoldCards
}) => {
    
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    // Create a stable debounced function for API calls
    const debouncedSearchUpdate = useMemo(
        () => debounce((value) => {
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
        <>
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="relative flex">
                    <div className="relative w-[600px]">
                        <Input
                            placeholder="Search any card..."
                            value={localSearchQuery}
                            onChange={handleSearchChange}
                            className="bg-background pl-8"
                        />
                        <Search className="h-4 w-4 absolute left-2.5 top-3 text-muted-foreground" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {showHideSoldCards && (
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="hide-sold-cards" 
                                checked={hideSoldCards}
                                onCheckedChange={setHideSoldCards}
                            />
                            <Label htmlFor="hide-sold-cards">Hide sold cards</Label>
                        </div>
                    )}
                    {!hideSortBy && (
                        <>
                            <span className="text-sm text-muted-foreground">Sort by:</span>
                            <FilterSortBy 
                                sortBy={sortBy} 
                                setSortBy={setSortBy}
                                customSortOptions={customSortOptions}
                            />
                        </>
                    )}
                    {!hideFilters && (
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
                    )}
                </div>
            </div>
        </>
  )
}

SearchAndFilterHeader.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    setSortBy: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    fetchCards: PropTypes.func,
    hideFilters: PropTypes.bool,
    hideSortBy: PropTypes.bool,
    customSortOptions: PropTypes.objectOf(PropTypes.string),
    showHideSoldCards: PropTypes.bool,
    hideSoldCards: PropTypes.bool,
    setHideSoldCards: PropTypes.func
}

export default SearchAndFilterHeader;
