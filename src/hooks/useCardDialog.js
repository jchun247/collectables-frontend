import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useToast } from '@/hooks/use-toast';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const useCardDialog = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { toast } = useToast();

    const [selectedCard, setSelectedCard] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [collectionEntryState, setCollectionEntryState] = useState({
        isOpen: false,
        type: null,
        cardDetails: null,
        prices: [],
    });

    const handleCardClick = async (card) => {
        try {
            const response = await fetch(`${apiBaseUrl}/cards/${card.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch card details");
            }
            const data = await response.json();
            setSelectedCard(data);
            setIsDetailsOpen(true);
        } catch (error) {
            console.error('Error fetching card details:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch card details.",
            });
        }
    };

    const handleAction = (type, cardDetails, prices) => {
        setIsDetailsOpen(false);
        setTimeout(() => {
            setCollectionEntryState({
                isOpen: true,
                type,
                cardDetails,
                prices,
            });
        }, 200);
    };

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
            setCollectionEntryState({ isOpen: false, type: null, cardDetails: null, prices: [] });
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || 'Failed to add card to collection'
            });
        }
    };

    return {
        selectedCard,
        isDetailsOpen,
        setIsDetailsOpen,
        collectionEntryState,
        setCollectionEntryState,
        handleCardClick,
        handleAction,
        handleSubmit,
    };
};
