import { Card, CardContent } from "@/components/ui/card";
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import CardDetailsDialog from './CardDetailsDialog';
import { RARITY_IMAGES } from '@/utils/rarityImages';
import { useNavigate } from "react-router-dom";
import { navigateToSet } from "@/utils/navigation";
import { formatCardCondition, formatCardFinish } from "@/utils/textFormatters";

const getDisplayPrice = (prices, finish = null, condition = null) => {
    if (!prices || prices.length === 0) return '0.00';
    // If a specific finish and condition are provided, find the exact price (used by UserCollectionDetails)
    if (finish && condition) {
        const specificPrice = prices.find(p => p.finish === finish && p.condition === condition);
        if (specificPrice) {
            return specificPrice.price.toFixed(2);
        }
    }

    if (prices.length === 1) return prices[0].price.toFixed(2);

    const finishPriority = ["NORMAL", "HOLOFOIL", "REVERSE_HOLO", "STAMP"];
    
    const price = finishPriority.reduce((selectedPrice, finish) => {
        if (selectedPrice !== null) return selectedPrice;
        const priceObj = prices.find(p => p.finish === finish);
        return priceObj ? priceObj.price : selectedPrice;
    }, null) || prices[0].price; // Fallback to first price if no priority match

    return price.toFixed(2);
};

const RenderCard = ({ card, quantity = null, showDetails = false, finish = null, condition = null, stackValue = 0 , preventDialogOnCardClick=false}) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cardDetails, setCardDetails] = useState(null);

    const openDetailsDialogHandler = useCallback(async (e) => {
        if (e) e.stopPropagation();
        if (e && e.preventDefault) e.preventDefault();
        try {
            const response = await fetch(`${apiBaseUrl}/cards/${card.id}`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch card details");
            }
            
            const data = await response.json();
            setCardDetails(data);
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error fetching card details:', error);
        }
    }, [apiBaseUrl, card.id]);

    return (
        <div>
            <Card
                key={card.id}
                className="relative group cursor-pointer overflow-hidden"
                onClick={preventDialogOnCardClick ? undefined : openDetailsDialogHandler}
            >
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-10" />
                <CardContent className="p-0">
                    <div className="relative rounded-lg overflow-hidden bg-muted/10">
                        <div className="aspect-[2.5/3.5]"> {/* Standard card aspect ratio */}
                            {!imageLoaded && (
                                <Skeleton className="absolute inset-0 w-full h-full" />
                            )}
                            <img 
                                src={card.imageUrl}
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
                            {quantity > 1 && ( // Only show quantity if it's more than 1, or if explicitly required
                                <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded font-semibold text-sm">
                                    &times;{quantity}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-4 flex flex-col justify-between h-[140px]">
                        {/* TOP GROUP: Card Name and Set Info */}
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-semibold tracking-tight leading-tight truncate" title={card.name}>
                                {card.name}
                            </h3>

                            {/* Set Name and Number */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToSet(navigate, card.setId);
                                }}
                                className="flex justify-between items-center w-full text-sm relative z-20 group/set"
                            >
                                <span className="text-muted-foreground truncate group-hover/set:text-blue-500 group-hover/set:underline transition-colors" title={card.setName}>
                                    {card.setName}
                                </span>
                                <span className="font-medium text-slate-600 dark:text-slate-400 pl-2">
                                    {card.setNumber}
                                </span>
                            </button>
                        </div>

                        {/* BOTTOM GROUP: Card Instance Details and Price */}
                        <div className="flex-grow flex flex-col justify-end space-y-1">
                            {showDetails && finish && condition && (
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                    {formatCardCondition(condition)} &bull; {formatCardFinish(finish)}
                                </p>
                            )}
                            <hr className="border-slate-200 dark:border-slate-700" />
                            <div className="flex items-start justify-between pt-1">
                                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 mt-1">
                                    <img
                                        src={RARITY_IMAGES[card.rarity] || RARITY_IMAGES.COMMON}
                                        alt={card.rarity}
                                        className="h-4 w-auto"
                                    />
                                </span>
                                <div className="text-right">
                                <span className="text-lg font-semibold text-green-500 leading-tight">
                                    {/* If quantity > 1, display stackValue. Otherwise, display per-unit price as primary. */}
                                    {(quantity && quantity > 1) ? 
                                        (stackValue ? `$${stackValue.toFixed(2)}` : '$0.00') : 
                                        `$${getDisplayPrice(card.prices, finish, condition)}`
                                    }
                                </span>
                                {(quantity && quantity > 1) && (
                                    <span className="block text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                        {quantity} &times; ${getDisplayPrice(card.prices, finish, condition)}/ea
                                    </span>
                                )}
                            </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <CardDetailsDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                cardDetails={cardDetails}
            />
        </div> 
    )
}

RenderCard.propTypes = {
    card: PropTypes.object.isRequired,
    quantity: PropTypes.number,
    showDetails: PropTypes.bool,
    finish: PropTypes.string,
    condition: PropTypes.string,
    stackValue: PropTypes.number,
    preventDialogOnCardClick: PropTypes.bool
}

export default RenderCard;
