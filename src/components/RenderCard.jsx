import { Card, CardContent } from "@/components/ui/card";
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import CardDetailsDialog from './CardDetailsDialog';
import { RARITY_IMAGES } from '@/utils/rarityImages';
import { useNavigate } from "react-router-dom";
import { navigateToSet } from "@/utils/navigation";

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

const RenderCard = ({ card, getAccessTokenSilently, apiBaseUrl }) => {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cardDetails, setCardDetails] = useState(null);

    const handleCardClick = useCallback(async (e) => {
        e.preventDefault();
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${apiBaseUrl}/cards/${card.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error("Failed to fetch card details");
            }
            
            const data = await response.json();
            setCardDetails(data);
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error fetching card details:', error);
        }
    }, [apiBaseUrl, card.id, getAccessTokenSilently]);

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
                                <div className="flex items-center justify-between mt-auto">
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
    getAccessTokenSilently: PropTypes.func.isRequired,
    apiBaseUrl: PropTypes.string.isRequired
}

export default RenderCard;
