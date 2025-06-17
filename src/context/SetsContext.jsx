import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { SetsContext } from './SetsContextValue';

export const SetsProvider = ({ children }) => {
  const [setsData, setSetsData] = useState(() => {
    const savedData = sessionStorage.getItem('setsData');
    return savedData
      ? JSON.parse(savedData)
      : { series: [], setsBySeries: {} };
  });
  const [loading, setLoading] = useState(!setsData.series.length);
  const [error, setError] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('setsData', JSON.stringify(setsData));
  }, [setsData]);

  useEffect(() => {
    const fetchSeries = async () => {
      if (setsData.series.length > 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const seriesResponse = await axios.get(`${apiBaseUrl}/sets/series`);
        setSetsData((prevData) => ({
          ...prevData,
          series: seriesResponse.data,
        }));
      } catch (err) {
        setError('Failed to fetch series data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [setsData.series.length]);

  const getSetsForSeries = useCallback(
    async (seriesName) => {
      if (setsData.setsBySeries[seriesName]) {
        return; // Data already exists
      }

      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const setsResponse = await axios.get(
          `${apiBaseUrl}/sets/by-series?series=${seriesName}`
        );
        setSetsData((prevData) => ({
          ...prevData,
          setsBySeries: {
            ...prevData.setsBySeries,
            [seriesName]: setsResponse.data,
          },
        }));
      } catch (err) {
        console.error(`Failed to fetch sets for series ${seriesName}:`, err);
        // Optionally set an error state for this specific series
      }
    },
    [setsData.setsBySeries]
  );

  const value = {
    setsData,
    loading,
    error,
    getSetsForSeries,
  };

  return <SetsContext.Provider value={value}>{children}</SetsContext.Provider>;
};

SetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
