import PropTypes from 'prop-types';
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
          <div className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden max-w-[500px] mx-auto">
            <img 
              src={cardDetails.images.find(img => img.resolution === "HIGH_RES").url}
              alt={cardDetails.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-bold mb-4">{cardDetails.name}</h2>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="prices">Prices</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Set:</span>
                    <span>{cardDetails.setName}</span>
                    <span className="text-muted-foreground">Number:</span>
                    <span>{cardDetails.setNumber}</span>
                    <span className="text-muted-foreground">Rarity:</span>
                    <span>{cardDetails.rarity}</span>
                    {cardDetails.hitPoints && (
                      <>
                        <span className="text-muted-foreground">HP:</span>
                        <span>{cardDetails.hitPoints}</span>
                      </>
                    )}
                    <span className="text-muted-foreground">Illustrator:</span>
                    <span>{cardDetails.illustratorName || 'N/A'}</span>
                  </div>

                  {cardDetails.abilities && cardDetails.abilities.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Abilities</h3>
                      <div className="space-y-3">
                        {cardDetails.abilities.map((ability, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{ability.name}</span>
                              <span>{ability.text}</span>
                            </div>
                          </div>
                        ))}
                        </div>
                    </div>  
                  )}

                  {cardDetails.attacks && cardDetails.attacks.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Attacks</h3>
                      <div className="space-y-3">
                        {cardDetails.attacks.map((attack, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{attack.name}</span>
                              <span>{attack.damage}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{attack.text}</p>
                            <div className="mt-1 flex gap-1">
                              {attack.cost.map((type, i) => (
                                <span key={i} className="text-xs bg-primary/10 px-2 py-1 rounded">
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="prices" className="mt-4">
                {cardDetails.prices && cardDetails.prices.length > 0 ? (
                  <div className="space-y-2">
                    {cardDetails.prices.map((price, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          {price.condition} ({price.finish})
                        </span>
                        <span className="font-medium text-green-500">
                          ${price.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No price information available.</p>
                )}
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
