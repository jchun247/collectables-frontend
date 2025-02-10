import { useState } from 'react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from 'lucide-react';


const CardSearchCombobox = ({ onSearch, onSelect }) => {
    const [open, setOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchValue, setSearchValue] = useState("");


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // Add logic to update results based on search term
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                >
                    {searchValue || "Search cards..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search cards..."
                        onValueChange={(search => {
                            onSearch(search);
                            handleSearchChange(search);
                        })}
                    />
                    <CommandEmpty>No cards found.</CommandEmpty>
                    <CommandGroup>
                        {searchResults.map((result) => (
                            <CommandItem 
                                key={result.id} 
                                value={result.name}
                                onSelect={() => {
                                    setSearchValue(result.name);
                                    onSelect(result);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn("mr-2 h-4 w-4",
                                        searchValue === result.name ? "opacity-100" : "opacity-0"
                                      )}
                                />
                                {result.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default CardSearchCombobox;