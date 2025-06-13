import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { SetsContext } from './SetsContextValue';

export const SetsProvider = ({ children }) => {
  const [setsData, setSetsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      // Only fetch if data is not already loaded
      if (setsData) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const seriesResponse = await axios.get(`${apiBaseUrl}/sets/series`);
        const series = seriesResponse.data;

        const setsBySeries = {};
        for (const seriesName of series) {
          const setsResponse = await axios.get(
            `${apiBaseUrl}/sets/by-series?series=${seriesName}`
          );
          setsBySeries[seriesName] = setsResponse.data;
        }

        setSetsData({ series, setsBySeries });
      } catch (err) {
        setError("Failed to fetch set data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [setsData]); // Dependency on setsData ensures it doesn't refetch once loaded

  const value = {
    setsData,
    loading,
    error,
  };

  return <SetsContext.Provider value={value}>{children}</SetsContext.Provider>;
};

SetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
