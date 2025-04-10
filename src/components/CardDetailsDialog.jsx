import PropTypes from 'prop-types';
import CardDetailsTab from './CardDetailsTab';
import CardPriceHistoryTab from './CardPriceHistoryTab';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CardDetailsDialog = ({ isOpen, onOpenChange, cardDetails }) => {
  if (!cardDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{cardDetails.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Card details dialog for {cardDetails.name} - {cardDetails.setName} - {cardDetails.setNumber}
        </DialogDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <div className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden max-w-[500px] mx-auto">
              <img 
                src={cardDetails.images.find(img => img.resolution === "HIGH_RES").url}
                alt={cardDetails.name}
                className="object-cover w-full h-full"
              />
            </div>
            {cardDetails.pokemonDetails?.flavourText && (
              <p className="text-sm text-muted-foreground italic max-w-[500px] mx-auto">
                {cardDetails.pokemonDetails.flavourText}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold mb-4">{cardDetails.name}</h2>
            <div className="flex flex-col space-y-1">
              <span className="font-medium">{cardDetails.setName}</span>
              <span className="font-medium">#{cardDetails.setNumber}</span>
            </div>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="prices">Price History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <CardDetailsTab cardDetails={cardDetails} />
              </TabsContent>
              
              <TabsContent value="prices" className="mt-4">
                <CardPriceHistoryTab prices={cardDetails.priceHistory} />
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

CardDetailsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  cardDetails: PropTypes.object,
};

export default CardDetailsDialog;
