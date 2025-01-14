import { Checkbox } from "@/components/ui/checkbox";
import React from 'react'

const FilterSection = ({ title, options, category, filters, handleFilterChange }) => {
    return (
        <div className="space-y-3">
            <h3 className="font-medium">{title}</h3>
            <div className="space-y-2">
                {options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox 
                            id={option.id}
                            checked={filters[category]?.[option.id] || false}
                            onCheckedChange={() => handleFilterChange(category, option.id)}
                        />
                        <label
                            htmlFor={option.id}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FilterSection;