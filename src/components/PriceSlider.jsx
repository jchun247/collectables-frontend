import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from "react";

const PriceSlider = ({ className, filters, setFilters, ...props }) => {
    const [value, setValue] = useState([filters.minPrice || 0, filters.maxPrice || 9999]);
    const [debouncedUpdate, setDebouncedUpdate] = useState(null);

    const updateFilters = useCallback((newValue) => {
        setFilters(prev => ({
            ...prev,
            minPrice: newValue[0],
            maxPrice: newValue[1]
        }));
    }, [setFilters]);

    const handleValueChange = (newValue) => {
        setValue(newValue);
        
        // Clear any pending debounced updates
        if (debouncedUpdate) {
            clearTimeout(debouncedUpdate);
        }

        // Set a new debounced update
        setDebouncedUpdate(setTimeout(() => {
            updateFilters(newValue);
        }, 500));
    };

    const handleInputChange = (index, inputValue) => {
        const newValue = parseInt(inputValue) || 0;

        // Ensure minPrice is always less than maxPrice
        if (index === 0) {
            // Updating minPrice
            if (newValue <= value[1]) {
                handleValueChange([newValue, value[1]]);
            }
        } else {
            // Updating maxPrice
            if (newValue >= value[0]) {
                handleValueChange([value[0], newValue]);
            }
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debouncedUpdate) {
                clearTimeout(debouncedUpdate);
            }
        };
    }, [debouncedUpdate]);

    return (
        <Accordion type="single" defaultValue="item-1" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className="font-bold">Price Range</AccordionTrigger>
                <AccordionContent>
                    <div className={cn("space-y-4", className)}>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">$</span>
                                <Input
                                    type="number"
                                    value={value[0]}
                                    onChange={(e) => handleInputChange(0, e.target.value)}
                                    className="w-20"
                                    min={0}
                                    max={value[1]}
                                />
                            </div>
                            <span className="text-sm font-medium">to</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">$</span>
                                <Input
                                    type="number"
                                    value={value[1]}
                                    onChange={(e) => handleInputChange(1, e.target.value)}
                                    className="w-20"
                                    min={value[0]}
                                    max={9999}
                                />
                            </div>
                        </div>
                        <Slider
                            defaultValue={value}
                            value={value}
                            max={9999}
                            step={10}
                            onValueChange={handleValueChange}
                            className="py-4"
                            {...props}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

PriceSlider.propTypes = {
    className: PropTypes.string,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired
};

export default PriceSlider;
