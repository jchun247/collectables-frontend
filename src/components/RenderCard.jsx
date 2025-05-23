import { Card, CardContent } from "@/components/ui/card";
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import CardDetailsDialog from './CardDetailsDialog';
import { RARITY_IMAGES } from '@/utils/rarityImages';
import { useNavigate } from "react-router-dom";
import { navigateToSet } from "@/utils/navigation";
import { formatCardCondition, formatCardFinish } from "@/utils/textFormatters";

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

const RenderCard = ({ card, showQuantity = false, quantity = null, showDetails = false, finish = null, condition = null }) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cardDetails, setCardDetails] = useState(null);

    const handleCardClick = useCallback(async (e) => {
        e.preventDefault();
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
        <>
            <div onClick={handleCardClick}>
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
                                {showQuantity && quantity !== null && (
                                    <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded font-semibold text-sm">
                                        ×{quantity}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* <div className="p-4 h-[140px]">
                            <div className="h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="pb-1 text-lg font-semibold tracking-tight leading-none truncate" title={card.name}>
                                        {card.name}
                                    </h3>
                                    <p className="text-sm font-medium mt-0.5">{card.setNumber}</p>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateToSet(navigate, card.setId);
                                        }}
                                        className="block text-left w-full relative z-20"
                                    >
                                        <p className="text-sm text-muted-foreground truncate mt-1 hover:text-blue-500 hover:underline transition-colors" title={card.setName}>
                                            {card.setName}
                                        </p>
                                    </button>
                                </div>
                                <div className="mt-auto space-y-2">
                                    {showDetails && finish && condition && (
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                            {formatCardCondition(condition)} &bull; {formatCardFinish(finish)}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1">
                                            <img 
                                                src={RARITY_IMAGES[card.rarity] || RARITY_IMAGES.COMMON}
                                                alt={card.rarity}
                                                className="h-4 w-auto"
                                            />
                                        </span>
                                        <span className="text-lg font-semibold text-green-500">
                                            ${getDisplayPrice(card.prices)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
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
                            <div className="space-y-2">
                                {showDetails && finish && condition && (
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                        {formatCardCondition(condition)} &bull; {formatCardFinish(finish)}
                                    </p>
                                )}
                                <hr className="border-slate-200 dark:border-slate-700" />
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1">
                                        <img
                                            src={RARITY_IMAGES[card.rarity] || RARITY_IMAGES.COMMON}
                                            alt={card.rarity}
                                            className="h-4 w-auto"
                                        />
                                    </span>
                                    <span className="text-lg font-semibold text-green-500">
                                        ${getDisplayPrice(card.prices)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <CardDetailsDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                cardDetails={cardDetails}
            />
        </>
    )
}

RenderCard.propTypes = {
    card: PropTypes.object.isRequired,
    showQuantity: PropTypes.bool,
    quantity: PropTypes.number,
    showDetails: PropTypes.bool,
    finish: PropTypes.string,
    condition: PropTypes.string
}

export default RenderCard;
