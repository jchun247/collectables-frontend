import FilterSection from './FilterSection';
import PropTypes from 'prop-types';

const FilterSidebar = ({ filters, setFilters }) => {

    const filterOptions = {
        productType: [
          { id: 'cards', label: 'Cards' },
          { id: 'sealed', label: 'Sealed Products' },
        ],
        game: [
          { id: 'pokemon', label: 'Pokemon' },
          { id: 'yugioh', label: 'Yu-Gi-Oh' },
          { id: 'mtg', label: 'Magic the Gathering' },
          { id: 'onepiece', label: 'One Piece' }
        ],
        condition: [
            { id: 'nm', label: 'Near Mint' },
            { id: 'lp', label: 'Lightly Played' },
            { id: 'mp', label: 'Moderately Played' }
        ]
    };

    const handleFilterChange = (category, id) => {
        setFilters(prev => ({
            ...prev,
            [category]: {
              ...prev[category],
              [id]: !prev[category]?.[id]
            }
        }));
    }

    return (
        <div className="space-y-2 py-4">
            <FilterSection title="Game" options={filterOptions.game} category="game" 
            filters={filters} handleFilterChange={handleFilterChange} />
            <FilterSection title="Condition" options={filterOptions.condition} category="condition" 
             filters={filters} handleFilterChange={handleFilterChange} />
            <FilterSection title="Product Type" options={filterOptions.productType} category="productType" 
             filters={filters} handleFilterChange={handleFilterChange} />
        </div>
    )
}

FilterSidebar.propTypes = {
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired
}

export default FilterSidebar