import { useContext } from 'react';
import { SetsContext } from '../context/SetsContextValue';

export const useSets = () => {
  return useContext(SetsContext);
};
