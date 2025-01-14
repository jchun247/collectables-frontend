// import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from "@/components/ui/input";
import FilterSortBy from './FilterSortBy';
import FilterSidebar from './FilterSidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PropTypes from 'prop-types';


const SearchAndFilterHeader = ({ searchQuery, setSearchQuery, 
    // sortBy, setSortBy, 
    filters, setFilters }) => {
    // const [isOpen, setIsOpen] = useState(false);
    const activeFiltersCount = Object.values(filters).reduce(
      (count, category) => count + Object.values(category).filter(Boolean).length,
      0
    );
  
    return (
        <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold">Explore Cards</h1>
        
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search any card..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background"
                    />
                </div>

                <div className="flex gap-4">
                    {/* defaults to sorting by name */}
                    <FilterSortBy name="name"/>

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
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
}

export default SearchAndFilterHeader;