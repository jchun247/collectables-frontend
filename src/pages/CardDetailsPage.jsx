import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ArrowLeft, Loader2, AlertTriangle, Plus, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardDetailsTab from '@/components/CardDetailsTab';
import CardPriceHistorySection from '@/components/CardPriceHistorySection';
import CardCollectionEntryDialog from '@/components/CardCollectionEntryDialog';
import AuthPromptDialog from '@/components/AuthPromptDialog';
import { navigateToSet } from "@/utils/navigation";

function CardDetailsPage() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [cardDetails, setCardDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collectionDialogState, setCollectionDialogState] = useState({ isOpen: false, type: null });
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const fetchCardDetails = useCallback(async () => {
    if (!cardId) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiBaseUrl}/cards/${cardId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch card details');
      }
      const data = await response.json();
      setCardDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [cardId, getAccessTokenSilently, apiBaseUrl]);

  useEffect(() => {
    fetchCardDetails();
  }, [fetchCardDetails]);

  const handleAddCardToCollectionSubmit = async (formData) => {
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
      setCollectionDialogState({ isOpen: false, type: null });
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
    setCollectionDialogState({ isOpen: true, type });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-sky-600 dark:text-sky-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center flex items-center justify-center min-h-[200px]" role="alert">
          <AlertTriangle className="h-6 w-6 mr-3 shrink-0" />
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!cardDetails) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center min-h-[calc(100vh-200px)]">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <p>Card details not available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-0 -ml-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-0">
        {/* Left Column: Card Image & Flavour Text */}
        <div className="space-y-4">
          <div className="aspect-[2.5/3.5] relative rounded-lg overflow-hidden shadow-xl max-w-md mx-auto">
            <img 
              src={cardDetails.images.find(img => img.resolution === "HIGH_RES")?.url || '/placeholder-image.png'}
              alt={cardDetails.name}
              className="object-cover w-full h-full"
            />
          </div>
          {cardDetails.pokemonDetails?.flavourText && (
            <p className="text-sm text-muted-foreground italic max-w-md mx-auto">
              {cardDetails.pokemonDetails.flavourText}
            </p>
          )}
        </div>

        {/* Right Column: Details, Actions, Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:flex-wrap md:items-start md:justify-between gap-x-4 gap-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold truncate md:flex-grow md:min-w-0">{cardDetails.name}</h1>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              <Button 
                variant="secondary"
                className="w-full sm:flex-1 hover:opacity-50 transition-opacity duration-200 whitespace-nowrap flex items-center justify-center"
                onClick={() => handleCollectionAction('list')}
              >
                <Star className="mr-2 h-4 w-4"/>
                Add to List
              </Button>
              <Button 
                variant="default"
                className="w-full sm:flex-1 hover:opacity-50 transition-opacity duration-200 whitespace-nowrap flex items-center justify-center"
                onClick={() => handleCollectionAction('portfolio')}
              >
                <Plus className="mr-2 h-4 w-4"/>
                Add to Portfolio
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <button
              onClick={() => navigateToSet(navigate, cardDetails.setId)}
              className="font-medium text-muted-foreground hover:text-blue-500 hover:underline transition-colors text-left text-lg"
            >
              {cardDetails.setName}
            </button>
            <span className="font-medium text-md text-slate-600 dark:text-slate-400">#{cardDetails.setNumber}</span>
          </div>

          <Tabs defaultValue="details" className="w-full pt-2">
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

      <CardCollectionEntryDialog 
        isOpen={collectionDialogState.isOpen}
        onOpenChange={(isOpen) => setCollectionDialogState({ 
          isOpen, 
          type: isOpen ? collectionDialogState.type : null 
        })}
        type={collectionDialogState.type || "portfolio"}
        prices={cardDetails.prices}
        cardId={cardDetails.id}
        onSubmit={handleAddCardToCollectionSubmit}
      />
      <AuthPromptDialog 
        isOpen={showAuthPrompt}
        onOpenChange={setShowAuthPrompt}
        message="Please sign in or create an account to add cards to your collection"
      />
    </div>
  );
}

export default CardDetailsPage;
