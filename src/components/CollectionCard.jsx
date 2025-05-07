import { Star, Globe, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import PropTypes from "prop-types";
import { useState } from "react";

const CollectionCard = ({ collection }) => {
  const { name, description, isPublic, numProducts, currentValue, isFavourite: initialFavourite } = collection;
  const [isFavourite, setIsFavourite] = useState(initialFavourite);

  const toggleFavorite = () => {
    setIsFavourite(!isFavourite);
    // Here you would typically also make an API call to update the backend
    console.log('Toggling favorite status');
  };

  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg truncate">{name}</h3>
          <p className="text-sm text-gray-400 line-clamp-2 min-h-[2.5rem]">{description || " "}</p>
        </div>
        <button 
          onClick={toggleFavorite}
          className="focus:outline-none"
        >
          <Star 
            className={`w-5 h-5 ${
              isFavourite 
                ? "text-yellow-400 fill-current" 
                : "text-gray-300 hover:text-gray-400"
            }`} 
          />
        </button>
      </div>
      <div className="space-y-1">
        <p className="text-sm">Cards: {numProducts}</p>
        <p className="text-sm font-medium">
          Value: ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
      <div className="flex justify-end items-center space-x-1">
        {isPublic ? (
          <Globe className="w-4 h-4 text-gray-500" />
        ) : (
          <Lock className="w-4 h-4 text-gray-500" />
        )}
        <p className="text-sm text-gray-500">
          {isPublic ? "Public" : "Private"}
        </p>
      </div>
    </Card>
  );
};

CollectionCard.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['PORTFOLIO', 'LIST']).isRequired,
    isPublic: PropTypes.bool.isRequired,
    numProducts: PropTypes.number.isRequired,
    currentValue: PropTypes.number.isRequired,
    isFavourite: PropTypes.bool.isRequired
  }).isRequired
};

export default CollectionCard;
