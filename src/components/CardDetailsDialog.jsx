import PropTypes from 'prop-types';
import CardDetailsTab from './CardDetailsTab';
import { useToast } from "@/hooks/use-toast";
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
import CardPriceHistorySection from './CardPriceHistorySection';

const CardDetailsDialog = ({ isOpen, onOpenChange, cardDetails }) => {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [dialogState, setDialogState] = useState({ isOpen: false, type: null });
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  if (!cardDetails) return null;

  const handleSubmit = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${apiBaseUrl}/collections/${formData.collectionId}/cards`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add card to collection');
      }

      toast({
        title: "Success",
        description: "Card added to collection successfully"
      });
      setDialogState({ isOpen: false, type: null });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to add card to collection'
      });
    }
  };

  const handleCollectionAction = (type) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setDialogState({ isOpen: true, type });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] md:max-w-[75vw] lg:max-w-[60vw] max-h-[90vh] overflow-y-auto">
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
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-start md:justify-between gap-x-4 gap-y-2 mb-4">
              <h2 className="text-4xl font-bold truncate md:flex-grow md:min-w-0">{cardDetails.name}</h2>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                <Button 
                  variant="secondary"
                  className="w-full sm:w-auto hover:opacity-50 transition-opacity duration-200 whitespace-nowrap flex items-center justify-center"
                  onClick={() => handleCollectionAction('list')}
                >
                  <Star className="mr-2 h-4 w-4"/>
                  Add to List
                </Button>
                <Button 
                  variant="default"
                  className="w-full sm:w-auto hover:opacity-50 transition-opacity duration-200 whitespace-nowrap flex items-center justify-center"
                  onClick={() => handleCollectionAction('portfolio')}
                >
                  <Plus className="mr-2 h-4 w-4"/>
                  Add to Portfolio
                </Button>
                <CardCollectionEntryDialog 
                  isOpen={dialogState.isOpen}
                  onOpenChange={(isOpen) => setDialogState({ 
                    isOpen, 
                    type: isOpen ? dialogState.type : null 
                  })}
                  type={dialogState.type || "portfolio"}
                  prices={cardDetails.prices}
                  cardId={cardDetails.id}
                  onSubmit={handleSubmit}
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
                <CardPriceHistorySection cardId={cardDetails.id} />
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
