import { ArrowUpDown, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ExplorePage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [filterBy, setFilterBy] = useState("cards");

    const filterOptions = {
        'name': 'Name (A-Z)',
        'name-desc': 'Name (Z-A)',
        'price-asc': 'Price (Low to High)',
        'price-desc': 'Price (High to Low)',
      };

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
                        className="pl-10"
                    />
                </div>

                {/* Filter options */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Sort by options */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[200px] transition-colors hover:border-primary">
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
                    <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                    </Select>

                </div>
            </div>
        </div>
    )
}

export default ExplorePage;