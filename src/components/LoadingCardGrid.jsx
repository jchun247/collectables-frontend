import { CardSkeleton } from "@/components/ui/cardskeleton";
import PropTypes from 'prop-types';

const LoadingCardGrid = ({ count }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
            {Array(count).fill(0).map((_, index) => (
                <CardSkeleton key={index} />
            ))}
        </div>
    )
}

LoadingCardGrid.propTypes = {
    count: PropTypes.number.isRequired,
}

export default LoadingCardGrid;
