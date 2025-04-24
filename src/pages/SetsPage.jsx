import { useState, useMemo, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import setsData from "@/data/sets.json"
import { CARD_SERIES_MAPPING, formatDate } from "@/utils/textFormatters"

const SetsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSeries, setSelectedSeries] = useState(() => 
    searchParams.get("series") || "SCARLET_AND_VIOLET"
  );

  // Update selected series when URL changes
  useEffect(() => {
    const seriesParam = searchParams.get("series");
    if (seriesParam && seriesParam !== selectedSeries) {
      setSelectedSeries(seriesParam);
    }
  }, [searchParams, selectedSeries]);
  const series = useMemo(() => {
    // Sort series from newest to oldest
    const seriesOrder = {
      "SCARLET_AND_VIOLET": 1,
      "SWORD_AND_SHIELD": 2,
      "SUN_AND_MOON": 3,
      "XY": 4,
      "BLACK_AND_WHITE": 5,
      "HEARTGOLD_AND_SOULSILVER": 6,
      "PLATINUM": 7,
      "DIAMOND_AND_PEARL": 8,
      "EX": 9,
      "E_CARD": 10,
      "NEO": 11,
      "GYM": 12,
      "BASE": 13,
      // Special series at the end
      "POP": 14,
      "NP": 15,
      "OTHER": 16
    };
    
    return [...setsData.series].sort((a, b) => seriesOrder[a] - seriesOrder[b]);
  }, []);
  const sets = selectedSeries ? 
    [...setsData.setsBySeries[selectedSeries]].sort((a, b) => 
      new Date(b.releaseDate) - new Date(a.releaseDate)
    ) : [];
 
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
