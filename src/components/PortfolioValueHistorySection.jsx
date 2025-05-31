import { useRef } from 'react';
import PropTypes from 'prop-types';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PortfolioValueHistoryChart } from "@/components/PortfolioValueHistoryChart"; // Changed import
import { usePortfolioValueHistory } from '@/hooks/usePortfolioValueHistory';

function PortfolioValueHistorySection({ collectionId }) {
  const valueHistoryRef = useRef(null);

  const { 
    valueHistory, 
    isLoadingValueHistory, 
    valueHistoryError, 
    selectedPriceRange, 
    setSelectedPriceRange,
    fetchValueHistory
  } = usePortfolioValueHistory(collectionId, '3m');

  return (
    <div className="pt-6 border-t" ref={valueHistoryRef}>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-3">Portfolio Value History</h3>
        <div className="flex flex-wrap gap-2">
          {['1m', '3m', '6m', '1y'].map(range => (
            <Button
              key={range}
              variant={selectedPriceRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={(e) => {
                if (selectedPriceRange !== range) {
                  setSelectedPriceRange(range);
                  e.currentTarget.focus(); // Keep focus on the clicked button
                }
              }}
              disabled={isLoadingValueHistory}
              className={`transition-all duration-150 ease-in-out ${
                selectedPriceRange === range
                  ? 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white dark:text-white'
                  : 'text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {range.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full h-[480px] flex items-center justify-center">
        {isLoadingValueHistory ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600 dark:text-sky-500" />
          </div>
        ) : valueHistoryError ? (
          <div className="flex flex-col justify-center items-center min-h-[300px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p className="font-semibold text-center">Error loading value history</p>
            <p className="text-sm text-center max-w-md mb-3">{valueHistoryError}</p>
            <Button variant="outline" size="sm" onClick={fetchValueHistory}>
              Try Again
            </Button>
          </div>
        ) : (
          <PortfolioValueHistoryChart
            data={valueHistory?.items}
            selectedPriceRange={selectedPriceRange}
          />
        )}
      </div>
    </div>
  );
}

PortfolioValueHistorySection.propTypes = {
  collectionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PortfolioValueHistorySection;
