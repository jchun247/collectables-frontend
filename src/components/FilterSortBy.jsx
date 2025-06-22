import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import PropTypes from "prop-types";
// import { useState } from "react";

const FilterSortBy = ({ sortBy, setSortBy, customSortOptions }) => {
    const filterOptions = customSortOptions || {
        'name-asc': 'Name (A-Z)',
        'name-desc': 'Name (Z-A)',
        'rarity-asc': 'Rarity (Low to High)',
        'rarity-desc': 'Rarity (High to Low)',
        // 'number-asc': 'Number (Low to High)',
        // 'number-desc': 'Number (High to Low)',
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
                            {sortBy ? `${filterOptions[sortBy]}` : 'Sort by...'}
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(filterOptions).map(([value, label]) => (
                        <SelectItem 
                            key={value} 
                            value={value}
                            className="transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                            <div className="flex items-center gap-2 group">
                                <ArrowUpDown className="h-4 w-4 transition-all duration-200 group-hover:scale-110 group-hover:rotate-180" />
                                <span className="transition-transform duration-200 group-hover:translate-x-1">
                                    {label}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    )
}

FilterSortBy.propTypes = {
    sortBy: PropTypes.string.isRequired,
    setSortBy: PropTypes.func.isRequired,
    customSortOptions: PropTypes.objectOf(PropTypes.string)
}

export default FilterSortBy;
