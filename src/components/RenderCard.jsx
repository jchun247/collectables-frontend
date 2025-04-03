import { Card, CardContent } from "@/components/ui/card";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const getDisplayPrice = (prices) => {
    if (prices.length === 1) return prices[0].price.toFixed(2);

    const finishPriority = ["NORMAL", "HOLOFOIL", "REVERSE_HOLO", "STAMP"];
    
    const price = finishPriority.reduce((selectedPrice, finish) => {
        if (selectedPrice !== null) return selectedPrice;
        const priceObj = prices.find(p => p.finish === finish);
        return priceObj ? priceObj.price : selectedPrice;
    }, null) || prices[0].price; // Fallback to first price if no priority match

    return price.toFixed(2);
};

const RenderCard = ({ card }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <Link to={`/cards/${card.id}`}>
            <Card
                key={card.id}
                className="relative group cursor-pointer overflow-hidden"
            >
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10" />
            <CardContent className="p-0">
                <div className="relative rounded-lg overflow-hidden bg-muted/10">
                    <div className="aspect-[2.5/3.5]"> {/* Standard card aspect ratio */}
                        {!imageLoaded && (
                            <Skeleton className="absolute inset-0 w-full h-full" />
                        )}
                        <img 
                            src={card.images.find(img => img.resolution === "LOW_RES").url}
                            alt={card.name}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                setImageLoaded(true);
                                e.target.src = "/placeholder-card.png"; // Fallback image
                            }}
                            className={`object-cover w-full h-full transition-opacity duration-300 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    </div>
                </div>
                <div className="p-4 h-[140px]">
                    <div className="h-full flex flex-col justify-between">
                        <div>
                            <h3 className="pb-1 text-lg font-semibold tracking-tight leading-none truncate" title={card.name}>
                                {card.name}
                            </h3>
                            <p className="text-sm font-medium mt-0.5">{card.setNumber}</p>
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Link handler will be added later
                                }}
                                className="block text-left w-full relative z-20"
                            >
                                <p className="text-sm text-muted-foreground truncate mt-1 hover:text-muted-foreground/80 hover:underline" title={card.setName}>
                                    {card.setName}
                                </p>
                            </button>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {card.rarity}
                            </span>
                            <span className="text-lg font-semibold text-green-500">
                                ${getDisplayPrice(card.prices)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
            </Card>
        </Link>
    )
}

RenderCard.propTypes = {
    card: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default RenderCard;
