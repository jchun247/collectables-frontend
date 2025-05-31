import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export const usePortfolioValueHistory = (collectionId, initialPriceRange = '3m', fetchOnMount = true) => {
  const { getAccessTokenSilently } = useAuth0();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [valueHistory, setValueHistory] = useState({ items: [] });
  const [isLoadingValueHistory, setIsLoadingValueHistory] = useState(true);
  const [valueHistoryError, setValueHistoryError] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(initialPriceRange);

  const fetchValueHistory = useCallback(async () => {
    if (!collectionId) {
      setValueHistory({ items: [] });
      setIsLoadingValueHistory(false);
      return;
    }

    setIsLoadingValueHistory(true);
    setValueHistoryError(null);

    const endDate = new Date();
    let startDate = new Date();

    switch (selectedPriceRange) {
      case '1m': startDate.setMonth(endDate.getMonth() - 1); break;
      case '3m': startDate.setMonth(endDate.getMonth() - 3); break;
      case '6m': startDate.setMonth(endDate.getMonth() - 6); break;
      case '1y': startDate.setFullYear(endDate.getFullYear() - 1); break;
      default: startDate.setMonth(endDate.getMonth() - 3); // Default fallback to 3m as per CardPriceHistory
    }
  
    try {
      const token = await getAccessTokenSilently();
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`${apiBaseUrl}/collections/${collectionId}/value-history?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch portfolio value history" }));
        throw new Error(errorData.message || "Failed to fetch portfolio value history");
      }
      const historyData = await response.json();
      setValueHistory(historyData);
    } catch (err) {
      setValueHistoryError(err.message);
      setValueHistory({ items: [] });
    } finally {
      setIsLoadingValueHistory(false);
    }
  }, [collectionId, selectedPriceRange, getAccessTokenSilently, apiBaseUrl]);

  useEffect(() => {
    if (fetchOnMount && collectionId) {
      fetchValueHistory();
    } else if (!fetchOnMount) {
      setIsLoadingValueHistory(false);
    }
  }, [collectionId, selectedPriceRange, fetchValueHistory, fetchOnMount]); // Ensure selectedPriceRange triggers refetch

  return {
    valueHistory,
    isLoadingValueHistory,
    valueHistoryError,
    selectedPriceRange,
    setSelectedPriceRange,
    fetchValueHistory
  };
};
