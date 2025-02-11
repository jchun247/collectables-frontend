import { Card, CardContent } from "@/components/ui/card";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const RenderCard = ({ card }) => {

    return (
        <Link to={`/cards/${card.id}`}>
            <Card
                key={card.id}
                className="hover:border-primary transition-colors cursor-pointer"
            >
            <CardContent>
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden my-4">
                    <img 
                        src={card.imageUrl}
                        alt={card.name}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="space-y-1">
                    <div className="flex items-center">
                        <span className="text-lg font-bold">{card.name}</span>
                        <span className="px-1 text-lg font-bold">-</span>
                        <span className="text-lg font-bold">{card.setNumber}</span>
                    </div>
                    <div className="flex">
                        <span className="text-md font-medium">{card.setCode}</span>
                    </div>
                    <div className="flex">
                        <span className="text-md font-medium">{card.rarity}</span>
                    </div>
                    <div className="flex">
                        <span className="text-xl font-bold">${card.prices[0].price}</span>
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
