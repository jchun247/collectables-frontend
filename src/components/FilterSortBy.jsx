import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

const FilterSortBy = ({ name }) => {
    const [sortBy, setSortBy] = useState(name);

    const filterOptions = {
        'name': 'Name (A-Z)',
        'name-desc': 'Name (Z-A)',
        'price-asc': 'Price (Low to High)',
        'price-desc': 'Price (High to Low)',
    };
    return (
        <>
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
        </>
    )
}

export default FilterSortBy;