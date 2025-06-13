import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSets } from "@/hooks/useSets";
import { CARD_SERIES_MAPPING, formatDate } from "@/utils/textFormatters";

const SetsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setsData, loading, error } = useSets();
  const [selectedSeries, setSelectedSeries] = useState(null);

  // Effect to set the initial selected series once data is loaded
  useEffect(() => {
    if (setsData && !selectedSeries) {
      const seriesParam = searchParams.get("series");
      if (seriesParam && setsData.series.includes(seriesParam)) {
        setSelectedSeries(seriesParam);
      } else if (setsData.series.length > 0) {
        const sortedSeries = sortSeries(setsData.series);
        setSelectedSeries(sortedSeries[0]);
      }
    }
  }, [setsData, selectedSeries, searchParams]);

  // Effect to sync selected series with URL search params
  useEffect(() => {
    const seriesParam = searchParams.get("series");
    if (seriesParam && seriesParam !== selectedSeries) {
      setSelectedSeries(seriesParam);
    }
  }, [searchParams, selectedSeries]);
  const sortSeries = (seriesToSort) => {
    const seriesOrder = {
      "SCARLET_AND_VIOLET": 1, "SWORD_AND_SHIELD": 2, "SUN_AND_MOON": 3,
      "XY": 4, "BLACK_AND_WHITE": 5, "HEARTGOLD_AND_SOULSILVER": 6,
      "PLATINUM": 7, "DIAMOND_AND_PEARL": 8, "POP": 9, "NP": 10, "EX": 11,
      "E_CARD": 12, "NEO": 13, "GYM": 14, "BASE": 15, "OTHER": 16
    };
    return [...seriesToSort].sort((a, b) => (seriesOrder[a] || 99) - (seriesOrder[b] || 99));
  };

  const series = useMemo(() => setsData ? sortSeries(setsData.series) : [], [setsData]);
  const sets = useMemo(() => {
    if (!selectedSeries || !setsData || !setsData.setsBySeries[selectedSeries]) {
      return [];
    }
    return [...setsData.setsBySeries[selectedSeries]].sort((a, b) => 
      new Date(b.releaseDate) - new Date(a.releaseDate)
    );
  }, [selectedSeries, setsData]);
 
  const handleSeriesClick = (seriesName) => {
    setSelectedSeries(seriesName);
    setSearchParams({ series: seriesName });
  };
 
  const handleKeyDown = (e, seriesName) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSeriesClick(seriesName);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = series.indexOf(seriesName);
      const newIndex = e.key === 'ArrowDown'
        ? (currentIndex + 1) % series.length
        : (currentIndex - 1 + series.length) % series.length;
      handleSeriesClick(series[newIndex]);
    }
  };

  const handleSetClick = (setId) => {
    navigate(`/sets/${setId}`);
  };

  const handleSetKeyDown = (e, setId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSetClick(setId);
    }
  };
  
  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading sets...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sets</h1>
      </div>
      
      <div className="grid grid-cols-[230px,1fr] gap-8">
        {/* Left Panel - Series Navigation */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Series</h2>
          
          {/* Series List */}
          <div className="space-y-2" role="tablist" aria-label="Pokemon TCG Series">
            {series.map((seriesName) => (
              <button
                key={seriesName}
                onClick={() => handleSeriesClick(seriesName)}
                className={`w-full text-left p-3 rounded-lg transition-colors font-medium ${
                  selectedSeries === seriesName 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                role="tab"
                aria-selected={selectedSeries === seriesName}
                aria-controls={`${seriesName}-sets`}
                tabIndex={selectedSeries === seriesName ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, seriesName)}
              >
                {CARD_SERIES_MAPPING[seriesName]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Sets Display */}
        <div className="border rounded-lg p-4">
          {selectedSeries ? (
            <>
              <h2 className="text-xl font-semibold mb-6">
                {CARD_SERIES_MAPPING[selectedSeries]}
              </h2>
              {sets.length > 0 ? (
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  id={`${selectedSeries}-sets`}
                  role="tabpanel"
                  aria-label={`Sets in ${CARD_SERIES_MAPPING[selectedSeries]} series`}
                >
                  {sets.map(set => (
                    <button
                      key={set.id}
                      className="group border rounded-lg p-4 hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                      tabIndex={0}
                      aria-label={`${set.name} set with ${set.total} cards`}
                      onClick={() => handleSetClick(set.id)}
                      onKeyDown={(e) => handleSetKeyDown(e, set.id)}
                    >
                      <div className="flex flex-col h-full">
                        <div className="aspect-[16/9] relative rounded-lg overflow-hidden mb-2">
                          <img 
                            src={set.images.find(img => img.imageType === "logo").url} 
                            alt={set.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="font-medium mb-2">{set.name}</h3>
                        <div className="flex justify-between items-end mt-auto">
                          <p className="text-sm text-muted-foreground group-hover:text-accent-foreground/75">
                            {formatDate(set.releaseDate)}
                          </p>
                          <img 
                            src={set.images.find(img => img.imageType === "symbol")?.url} 
                            alt={`${set.name} symbol`}
                            className="w-6 h-6"
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No sets found in this series</p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">Select a series to view its sets</p>
          )}
        </div>
       </div>
     </div>
   )
 }
 
 export default SetsPage
