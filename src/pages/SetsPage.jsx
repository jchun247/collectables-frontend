import { useState, useEffect } from "react"
 import { useAuth0 } from "@auth0/auth0-react"
 import { Button } from "@/components/ui/button"
 
 const SetsPage = () => {
   const { isAuthenticated, getAccessTokenSilently } = useAuth0();
   const [series, setSeries] = useState([]);
   const [selectedSeries, setSelectedSeries] = useState(null);
   const [sets, setSets] = useState([]);
   const [loadingSets, setLoadingSets] = useState(false);
   const [loading, setLoading] = useState(true);
   const [seriesError, setSeriesError] = useState(null);
   const [setsError, setSetsError] = useState(null);
   const [isRetrying, setIsRetrying] = useState(false);
 
   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
 
   const fetchSetsForSeries = async (seriesName) => {
     if (isAuthenticated) {
       setLoadingSets(true);
       try {
         const token = await getAccessTokenSilently();
         const response = await fetch(`${apiBaseUrl}/sets/${seriesName}`, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });
 
         if (!response.ok) {
           throw new Error("Failed to load sets");
         }
 
         const data = await response.json();
         setSets(data);
       } catch {
         setSetsError("Failed to load sets. Please try again.");
         setSets([]);
       } finally {
         setLoadingSets(false);
       }
     }
   };
 
   const handleSeriesClick = (seriesName) => {
     setSelectedSeries(seriesName);
     setSetsError(null);
     setSets([]); // Clear sets before loading new ones
     fetchSetsForSeries(seriesName);
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
 
   const handleSetKeyDown = (e) => {
     if (e.key === 'Enter' || e.key === ' ') {
       e.preventDefault();
       // Future implementation: handle set selection/navigation
     }
   };
 
   const fetchSeries = async () => {
     if (isAuthenticated) {
       setSelectedSeries(null);
       setSets([]);
       try {
         const token = await getAccessTokenSilently();
         const response = await fetch(`${apiBaseUrl}/sets/series`, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });
 
         if (!response.ok) {
           throw new Error("Something went wrong. Please try again later.");
         }
 
         const data = await response.json();
         setSeries(data);
         setSeriesError(null);
         setSetsError(null);
       } catch {
         setSeriesError("Something went wrong. Please try again later.");
       } finally {
         setLoading(false);
       }
     } else {
       setSeriesError("You are not authenticated. Please login to view sets.");
       setLoading(false);
     }
   };
 
   useEffect(() => {
     if (!isAuthenticated) {
       setSelectedSeries(null);
       setSets([]);
       setSetsError(null);
     }
     fetchSeries();
   }, [isAuthenticated]); // Re-fetch when auth state changes
 
   const formatSeriesName = (name) => {
     return name
       .split('_')
       .map(word => word.charAt(0) + word.slice(1).toLowerCase())
       .join(' ')
   }
 
   return (
     <div className="container mx-auto px-4 py-8">
       <div className="mb-8">
         <h1 className="text-3xl font-bold">Sets</h1>
       </div>
       
       <div className="grid grid-cols-[300px,1fr] gap-8">
         {/* Left Panel - Series Navigation */}
         <div className="border rounded-lg p-4">
           <h2 className="text-xl font-semibold mb-4">Series</h2>
           
           {/* Error State */}
           {seriesError && !isRetrying && (
             <div className="py-4">
               <p className="text-red-500 mb-4">{seriesError}</p>
               <Button
                 variant="outline"
                 disabled={isRetrying}
                 onClick={() => {
                   setIsRetrying(true);
                   const delay = new Promise(resolve => setTimeout(resolve, 2000));
                   Promise.all([delay, fetchSeries()]).finally(() => {
                     setIsRetrying(false);
                   });
                 }}
               >
                 {isRetrying ? "Retrying..." : "Try Again"}
               </Button>
             </div>
           )}
 
           {/* Loading State */}
           {loading && (
             <div className="animate-pulse space-y-4">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="h-10 bg-muted rounded"></div>
               ))}
             </div>
           )}
 
           {/* Series List */}
           {!loading && !seriesError && (
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
                   {formatSeriesName(seriesName)}
                 </button>
               ))}
             </div>
           )}
         </div>
 
         {/* Right Panel - Sets Display */}
         <div className="border rounded-lg p-4">
           {selectedSeries ? (
             <>
               <h2 className="text-xl font-semibold mb-6">
                 {formatSeriesName(selectedSeries)} Sets
               </h2>
               {loadingSets ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className="animate-pulse">
                       <div className="h-32 bg-muted rounded-lg"></div>
                     </div>
                   ))}
                 </div>
               ) : sets.length > 0 ? (
                 <div 
                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                   id={`${selectedSeries}-sets`}
                   role="tabpanel"
                   aria-label={`Sets in ${formatSeriesName(selectedSeries)} series`}
                 >
                   {sets.map(set => (
                     <button
                       key={set.id}
                       className="group border rounded-lg p-4 hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                       tabIndex={0}
                       aria-label={`${set.name} set with ${set.total} cards`}
                       onKeyDown={handleSetKeyDown}
                     >
                       <h3 className="font-medium mb-2">{set.name}</h3>
                       <p className="text-sm text-muted-foreground group-hover:text-accent-foreground/75">
                         {set.total} cards
                       </p>
                     </button>
                   ))}
                 </div>
               ) : setsError ? (
                 <p className="text-red-500">{setsError}</p>
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