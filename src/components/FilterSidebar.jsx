import PropTypes from 'prop-types';
import RadioFilterSection from './RadioFilterSection';
import SetIdDropdown from './SetIdDropdown';
import PriceSlider from './PriceSlider';
import CheckBoxFilterSection from './CheckBoxFilterSection';
import { Button } from "@/components/ui/button";

const FilterSidebar = ({ filters, setFilters, selectedSets, setSelectedSets }) => {

    const filterOptions = {
        condition: [
            { id: 'NEAR_MINT', label: 'Near Mint' },
            { id: 'LIGHTLY_PLAYED', label: 'Lightly Played' },
            { id: 'MODERATELY_PLAYED', label: 'Moderately Played' }
        ],
        finishes: [
            { id: 'HOLOFOIL', label: 'Holofoil' },
            { id: 'REVERSE_HOLO', label: 'Reverse Holo'},
            { id: 'NORMAL', label: 'Normal' },
        ]
    };

    const handleFilterChange = (category, id) => {
        if (category === 'condition') {
            // Radio button logic, only one condition can be selected at a time
            setFilters(prev => ({
                ...prev,
                [category]: id
            }));
        } else if (category === 'finishes') {
            // Checkbox logic - object with boolean values
            setFilters(prev => ({
                ...prev,
                finishes: {
                    ...prev.finishes,
                    [id]: !prev.finishes?.[id]
                }
            }));
        }
    }

    const handleClearAll = () => {
        setFilters({
            condition: 'NEAR_MINT',
            finishes: {},
            minPrice: 0,
            maxPrice: 9999
        });
        setSelectedSets([]);
    };

    return (
        <div className="space-y-2 py-4">
            <SetIdDropdown filters={filters} setFilters={setFilters} selectedSets={selectedSets} setSelectedSets={setSelectedSets} />
            <PriceSlider filters={filters} setFilters={setFilters} />
            <CheckBoxFilterSection title="Finish" options={filterOptions.finishes} category="finishes" filters={filters} handleFilterChange={handleFilterChange} />
            <RadioFilterSection title="Condition" options={filterOptions.condition} category="condition" 
            filters={filters} handleFilterChange={handleFilterChange} />
            <Button onClick={handleClearAll} className="w-full">Clear All Filters</Button>
        </div>
    )
}

FilterSidebar.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    selectedSets: PropTypes.array.isRequired,
    setSelectedSets: PropTypes.func.isRequired
}

export default FilterSidebar