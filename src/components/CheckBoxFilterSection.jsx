import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import PropTypes from "prop-types";

const CheckBoxFilterSection = ({ title, options, category, filters, handleFilterChange }) => {
    return (
        <Accordion type="single" defaultValue="item-1" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className="font-bold">{title}</AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

CheckBoxFilterSection.propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    category: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
}

export default CheckBoxFilterSection;