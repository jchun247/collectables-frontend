import CheckBoxFilterSection from './CheckBoxFilterSection';
import PropTypes from 'prop-types';
import RadioFilterSection from './RadioFilterSection';

const FilterSidebar = ({ filters, setFilters }) => {

    const filterOptions = {
        productType: [
            { id: 'cards', label: 'Cards' },
            { id: 'sealed', label: 'Sealed Products' },
        ],
        games: [
            { id: 'POKEMON', label: 'Pokemon' },
            { id: 'YUGIOH', label: 'Yu-Gi-Oh' },
            { id: 'MAGIC', label: 'Magic the Gathering' },
            { id: 'ONE_PIECE', label: 'One Piece' }
        ],
        condition: [
            { id: 'NEAR_MINT', label: 'Near Mint' },
            { id: 'LIGHTLY_PLAYED', label: 'Lightly Played' },
            { id: 'MODERATELY_PLAYED', label: 'Moderately Played' }
        ]
    };

    const handleFilterChange = (category, id) => {
        if (category === 'condition' || category === 'productType') {
            // Radio button logic, only one condition can be selected at a time
            setFilters(prev => ({
                ...prev,
                [category]: id
            }));
        } else if (category === 'game') {
            // Checkbox logic - object with boolean values
            setFilters(prev => ({
                ...prev,
                game: {
                    ...prev.game,
                    [id]: !prev.game?.[id]
                }
            }));
        }
    }

    return (
        <div className="space-y-2 py-4">
            <CheckBoxFilterSection title="Game" options={filterOptions.games} category="game" 
            filters={filters} handleFilterChange={handleFilterChange} />
            <RadioFilterSection title="Condition" options={filterOptions.condition} category="condition" 
            filters={filters} handleFilterChange={handleFilterChange} />
            <RadioFilterSection title="Product Type" options={filterOptions.productType} category="productType"
            filters={filters} handleFilterChange={handleFilterChange} />
        </div>
    )
}

FilterSidebar.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired
}

export default FilterSidebar
