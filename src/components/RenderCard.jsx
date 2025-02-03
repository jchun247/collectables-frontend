import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PropTypes from 'prop-types';

const RenderCard = ({ card, index }) => {

    // const isLastCard = index === filtered

    return (
        <Card
            key={card.id}
            // ref={isLastCard ? }
            className="hover:border-primary transition-colors"
        >
            <CardHeader className="space-y-0 pb-3">
                <CardTitle className="text-lg">{card.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-4">
                    <img 
                        src={card.imageUrl}
                        alt={card.name}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{card.setCode}</span>
                        <span className="text-sm font-medium">{card.setNumber}</span>
                    </div>
                    <div className="flex">
                        <span className="text-sm font-medium">{card.rarity}</span>
                    </div>
                    <div className="flex">
                        <span className="text-sm font-medium">${card.prices[0].price}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

RenderCard.propTypes = {
    card: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
}

export default RenderCard;