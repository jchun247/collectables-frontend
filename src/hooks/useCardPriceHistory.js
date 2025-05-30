import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export const useCardPriceHistory = (cardId, initialPriceRange = '3m', fetchOnMount = true) => {
  const { getAccessTokenSilently } = useAuth0();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [priceHistory, setPriceHistory] = useState({ items: [] });
  const [isLoadingPriceHistory, setIsLoadingPriceHistory] = useState(true);
  const [priceHistoryError, setPriceHistoryError] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialPriceRange);

  const fetchPriceHistory = useCallback(async () => {
    if (!cardId) {
      setPriceHistory({ items: [] });
      setIsLoadingPriceHistory(false);
      return;
    }

    setIsLoadingPriceHistory(true);
    setPriceHistoryError(null);

    const endDate = new Date();
    let startDate = new Date();

    switch (selectedPriceRange) {
      case '1m': startDate.setMonth(endDate.getMonth() - 1); break;
      case '3m': startDate.setMonth(endDate.getMonth() - 3); break;
      case '6m': startDate.setMonth(endDate.getMonth() - 6); break;
      case '1y': startDate.setFullYear(endDate.getFullYear() - 1); break;
      default: startDate.setMonth(endDate.getMonth() - 6); // Default fallback
    }
  
    try {
      const token = await getAccessTokenSilently();
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`${apiBaseUrl}/cards/${cardId}/price-history?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch price history");
      }
      const historyData = await response.json();
      setPriceHistory(historyData);
    } catch (err) {
      setPriceHistoryError(err.message);
      setPriceHistory({ items: [] });
    } finally {
      setIsLoadingPriceHistory(false);
    }
  }, [cardId, selectedPriceRange, getAccessTokenSilently, apiBaseUrl]);

  useEffect(() => {
    if (fetchOnMount && cardId) {
      fetchPriceHistory();
    } else if (!fetchOnMount) {
      // If not fetching on mount, ensure loading is false initially
      setIsLoadingPriceHistory(false);
    }
  }, [cardId, selectedPriceRange, fetchPriceHistory, fetchOnMount]);

  return {
    priceHistory,
    isLoadingPriceHistory,
    priceHistoryError,
    selectedPriceRange,
    setSelectedPriceRange,
    fetchPriceHistory // Expose refetch function if needed
  };
};
