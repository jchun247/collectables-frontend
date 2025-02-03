import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import PropTypes from "prop-types";

const RadioFilterSection = ({ title, options, category, filters, handleFilterChange }) => {
    const selectedValue = filters[category] || "";

    return (
        <Accordion type="single" defaultValue="item-1" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className="font-bold">{title}</AccordionTrigger>
                    <AccordionContent>
                    <RadioGroup value={selectedValue} onValueChange={(value) => handleFilterChange(category, value)}>
                        {options.map((option) => (
                            <div className="flex items-center space-x-2" key={option.id}>
                                <RadioGroupItem value={option.id} id={option.id} />
                                <Label htmlFor={option.id}>{option.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                    </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

RadioFilterSection.propTypes = {
    title: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    category: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    handleFilterChange: PropTypes.func.isRequired
}

export default RadioFilterSection