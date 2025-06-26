import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import PropTypes from 'prop-types';

const SetIdDropdown = ({ selectedSets, setSelectedSets }) => {
    const [open, setOpen] = useState(false);
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

     // Fetch sets from the API when the component mounts
    useEffect(() => {
        const fetchSets = async () => {
            setLoading(true);
            setError(null);
            try {
                const cachedSets = localStorage.getItem('setsCache');
                if (cachedSets) {
                    const { data, timestamp } = JSON.parse(cachedSets);
                    const isCacheValid = (new Date() - new Date(timestamp)) < 24 * 60 * 60 * 1000; // 24 hours
                    if (isCacheValid) {
                        setSets(data || []);
                        setLoading(false);
                        return;
                    }
                }

                const response = await fetch(`${apiBaseUrl}/sets?sort=releaseDate-desc`);
                if (!response.ok) {
                    throw new Error('Failed to fetch sets');
                }
                const data = await response.json();
                setSets(data || []);
                localStorage.setItem('setsCache', JSON.stringify({ data, timestamp: new Date() }));
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSets();
    }, [apiBaseUrl]);

    

    const handleSelectSet = (set) => {
        setSelectedSets(prev => {
            const isSelected = prev.some(s => s.id === set.id);
            if (isSelected) {
                return prev.filter(s => s.id !== set.id);
            } else {
                return [...prev, set];
            }
        });
    };

    const handleRemoveSet = (setId) => {
        setSelectedSets(prev => prev.filter(s => s.id !== setId));
    };

    return (
        <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
                <AccordionTrigger>Set</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-2">
                         <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {selectedSets.length > 0 ? `${selectedSets.length} selected` : "Select sets..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search sets..." />
                                    {loading && <div className="p-4 text-sm text-center">Loading...</div>}
                                    {error && <div className="p-4 text-sm text-red-500 text-center">{error}</div>}
                                    <CommandEmpty>No sets found.</CommandEmpty>
                                    <CommandGroup>
                                        <CommandList>
                                            {sets.map((set) => (
                                                <CommandItem
                                                    key={set.id}
                                                    value={set.name} // Use name for searchability
                                                    onSelect={() => {
                                                        handleSelectSet(set);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedSets.some(s => s.id === set.id) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {set.name}
                                                </CommandItem>
                                            ))}
                                        </CommandList>
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-wrap gap-1 pt-2">
                            {selectedSets.map(set => (
                                <Badge key={set.id} variant="secondary" className="flex items-center gap-1.5">
                                    {set.name}
                                    <XCircle className="h-3.5 w-3.5 cursor-pointer hover:text-foreground/80" onClick={() => handleRemoveSet(set.id)} />
                                </Badge>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

SetIdDropdown.propTypes = {
    selectedSets: PropTypes.array.isRequired,
    setSelectedSets: PropTypes.func.isRequired
};

export default SetIdDropdown;
