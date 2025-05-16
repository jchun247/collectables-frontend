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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { navigateToSet } from "@/utils/navigation";
import { Plus, Star } from 'lucide-react';
import CardCollectionEntryDialog from './CardCollectionEntryDialog';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import AuthPromptDialog from './AuthPromptDialog';

const CardDetailsDialog = ({ isOpen, onOpenChange, cardDetails }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [dialogState, setDialogState] = useState({ isOpen: false, type: null });
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  if (!cardDetails) return null;

  const handleCollectionAction = (type) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setDialogState({ isOpen: true, type });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{cardDetails.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Card details dialog for {cardDetails.name} - {cardDetails.setName} - {cardDetails.setNumber}
        </DialogDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
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
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-4xl font-bold truncate">{cardDetails.name}</h2>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button 
                  variant="secondary"
                  className="w-full md:w-auto hover:opacity-50 transition-opacity duration-200 whitespace-nowrap"
                  onClick={() => handleCollectionAction('list')}
                >
                  <Star />
                  Add to List
                </Button>
                <Button 
                  variant="default"
                  className="w-full md:w-auto hover:opacity-50 transition-opacity duration-200 whitespace-nowrap"
                  onClick={() => handleCollectionAction('portfolio')}
                >
                  <Plus />
                  Add to Portfolio
                </Button>
                <CardCollectionEntryDialog 
                  isOpen={dialogState.isOpen}
                  onOpenChange={(isOpen) => setDialogState({ 
                    isOpen, 
                    type: isOpen ? dialogState.type : null 
                  })}
                  type={dialogState.type || "portfolio"}
                  onSubmit={(data) => {
                    console.log('Collection entry:', { ...data, card: cardDetails });
                    // Here you would typically send this data to your backend
                  }}
                  prices={cardDetails.prices}
                  cardId={cardDetails.id}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => navigateToSet(navigate, cardDetails.setId)}
                className="font-medium text-muted-foreground hover:text-blue-500 hover:underline transition-colors text-left"
              >
                {cardDetails.setName}
                </button>
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
      <AuthPromptDialog 
        isOpen={showAuthPrompt}
        onOpenChange={setShowAuthPrompt}
        message="Please sign in or create an account to add cards to your collection"
      />
    </Dialog>
  );
};

CardDetailsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  cardDetails: PropTypes.object,
};

export default CardDetailsDialog;
