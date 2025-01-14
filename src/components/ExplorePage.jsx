import { ArrowUpDown, Search, SlidersHorizontal } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/ui/cardskeleton";
import { Checkbox} from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const ExplorePage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [filters, setFilters] = useState({
        game: [],
        productType: []
    });

    const filterOptions = {
        'name': 'Name (A-Z)',
        'name-desc': 'Name (Z-A)',
        'price-asc': 'Price (Low to High)',
        'price-desc': 'Price (High to Low)',
    };

    const filterCategories = {
        game: ['Pokemon', 'Yu-Gi-Oh'],
        productType: ['Cards Only', 'Sealed Only']
    }

    const handleFilterChange = (category, value) => {
        setFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(value)
              ? prev[category].filter(item => item !== value)
              : [...prev[category], value]
          }));
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 space-y-4">
                <h1 className="text-3xl font-bold">Explore Cards</h1>
            
                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search any card..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background"
                    />
                </div>

                {/* Filter options */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Sort by options */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[200px] transition-colors hover:border-primary bg-background">
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="h-4 w-4 transition-transform group-hover:scale-110" />
                                    {sortBy ? `Sort by: ${filterOptions[sortBy]}` : 'Sort by...'}
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {[
                                { value: "name", label: "Name (A-Z)" },
                                { value: "name-desc", label: "Name (Z-A)" },
                                { value: "price-asc", label: "Price (Low to High)" },
                                { value: "price-desc", label: "Price (High to Low)" }
                                ].map((option) => (
                                <SelectItem 
                                    key={option.value} 
                                    value={option.value}
                                    className="transition-colors hover:bg-primary hover:text-primary-foreground"
                                >
                                    <div className="flex items-center gap-2 group">
                                    <ArrowUpDown className="h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:rotate-180" />
                                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                                        Sort by: {option.label}
                                    </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* Filter by product options*/}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="flex gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                                    4
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                            </SheetHeader>
                            Test
                        </SheetContent>
                    </Sheet>
                </div>

                { /* Card Grid */ }
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array(12).fill(0).map((_, index) => (
                        <CardSkeleton key={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ExplorePage;