import { useState, useEffect } from 'react'
import { useParams, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types'
import SearchAndFilterHeader from '@/components/SearchAndFilterHeader';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Settings, Star, CalendarDays, ListOrdered, Loader2, Info, Globe } from "lucide-react"
import RenderCard from "@/components/RenderCard"
import UpdateCollectionDialog from '../components/UpdateCollectionDialog'
import PortfolioValueHistorySection from '@/components/PortfolioValueHistorySection';
import { formatCurrency, formatDate } from "@/utils/textFormatters"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function UserCollectionDetails({ collectionType }) {
  // Extract ID from URL based on collection type
  const params = useParams();
  const collectionId = params[collectionType === 'portfolio' ? 'portfolioId' : 'listId'];
  const location = useLocation();
  const navigate = useNavigate();

  const [currentCollection, setCurrentCollection] = useState(null);
  const [isLoadingCollectionDetails, setIsLoadingCollectionDetails] = useState(true);
  const [collectionDetailsError, setCollectionDetailsError] = useState(null);


  // State for API call status for update/delete operations
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);
  const [dialogSubmissionError, setDialogSubmissionError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // State for search and sort
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('calculatedTotalStackValue,desc');
  const [filters, setFilters] = useState({});

  // State for fetching collection items
  const [collectionItems, setCollectionItems] = useState(null);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [fetchItemsError, setFetchItemsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);

  const { getAccessTokenSilently } = useAuth0();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!collectionId) {
        setCollectionDetailsError(`No ${collectionType} ID provided in the URL.`);
        setIsLoadingCollectionDetails(false);
        setCurrentCollection(null);
        return;
      }

      setIsLoadingCollectionDetails(true);
      setCollectionDetailsError(null);

      // Check if collection data is already in location.state and matches the current collectionId
      if (location.state?.collection && location.state.collection.id.toString() === collectionId.toString()) {
        setCurrentCollection(location.state.collection);
        setIsLoadingCollectionDetails(false);
        return; // Data found in state, no need to fetch from API
      }

      // If not in state or ID mismatch, fetch from API
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${apiBaseUrl}/collections/${collectionId}`, { // Endpoint to get a single collection's details
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`${collectionType.charAt(0).toUpperCase() + collectionType.slice(1)} with ID '${collectionId}' not found.`);
          }
          const errorData = await response.json().catch(() => ({ message: `Failed to fetch ${collectionType} details.` }));
          throw new Error(errorData.message || `Failed to fetch ${collectionType} details. Status: ${response.status}`);
        }
        const data = await response.json();
        setCurrentCollection(data);
      } catch (err) {
        setCollectionDetailsError(err.message);
        setCurrentCollection(null); // Ensure currentCollection is null on error to trigger correct UI
      } finally {
        setIsLoadingCollectionDetails(false);
      }
    };

    fetchDetails();
  }, [collectionId, collectionType, location.state?.collection, apiBaseUrl, getAccessTokenSilently]);

  // Fetch cards within the collection
  useEffect(() => {
    const fetchCollectionItems = async () => {
      if (!collectionId) return;
      try {
        const token = await getAccessTokenSilently();
        setIsLoadingItems(true);
        setFetchItemsError(null);
        const response = await fetch(`${apiBaseUrl}/collections/${collectionId}/cards?page=${currentPage}&cardName=${searchQuery}&sort=${sortBy}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch ${collectionType} items`);
        }
        const data = await response.json();
        setCollectionItems(data);
      } catch (err) {
        setFetchItemsError(err.message);
      } finally {
        setIsLoadingItems(false);
      }
    }

    fetchCollectionItems()
  }, [collectionId, collectionType, apiBaseUrl, getAccessTokenSilently, currentPage, pageSize, searchQuery, sortBy]);

  if (isLoadingCollectionDetails) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-sky-600 dark:text-sky-500" />
        <p className="mt-4 text-lg text-slate-700 dark:text-slate-300">Loading {collectionType} details...</p>
      </div>
    );
  }

  if (collectionDetailsError && !currentCollection) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6 border border-red-300 dark:border-red-700">
          <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Error Loading {collectionType.charAt(0).toUpperCase() + collectionType.slice(1)}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{collectionDetailsError}</p>
          <Button variant="outline" onClick={() => navigate('/collections', { replace: true })}>
            Back to Collections
          </Button>
        </div>
      </div>
    );
  }

  // Fallback if currentCollection is null after loading attempts without a specific error
  if (!currentCollection) {
    return <Navigate to="/collections" replace />;
  }

  const handleUpdateCollection = async (formData) => {
    setIsUpdating(true);
    setDialogSubmissionError(null);

    const requestBody = {
      ...formData,
      public: formData.visibility === 'PUBLIC',
    };

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiBaseUrl}/collections/${collectionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update collection');
      }

      const updatedCollection = await response.json();
      setCurrentCollection(updatedCollection);
      setIsSettingsOpen(false);
    } catch (error) {
      setDialogSubmissionError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCollection = async () => {
    setIsDeletingCollection(true);
    setDialogSubmissionError(null);
    setShowDeleteConfirm(false);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiBaseUrl}/collections/${collectionId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
         },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to delete ${collectionType}. Status: ${response.status}` }));
        throw new Error(errorData.message || `Failed to delete ${collectionType}.`);
      }

      setIsSettingsOpen(false);
      navigate('/collections', { replace: true });
    } catch (err) {
      setDialogSubmissionError(err.message);
    } finally {
      setIsDeletingCollection(false);
    }
  };

  const collectionTypeLabel = collectionType.charAt(0).toUpperCase() + collectionType.slice(1)

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen">
      {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/collections`)}
          className="-ml-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Collections
      </Button>
      {/* Collection Header Section */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">{currentCollection.name}</h1>
              {currentCollection.favourite && (
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" aria-label="Favorite" />
              )}
            </div>
            {currentCollection.description && (
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                {currentCollection.description}
              </p>
            )}
          </div>
          {/* Settings Dialog */}
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogDescription className="sr-only">
              Collection settings dialog for {currentCollection.name} - {currentCollection.description}
             </DialogDescription>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Settings className="h-5 w-5" />
                <span className="sr-only">{collectionTypeLabel} Settings</span>
              </Button>
            </DialogTrigger>
            {currentCollection && (
              <UpdateCollectionDialog
                isOpen={isSettingsOpen}
                collection={currentCollection}
                collectionType={collectionType}
                onSubmit={handleUpdateCollection}
                onDelete={() => setShowDeleteConfirm(true)}
                isSubmitting={isUpdating}
                isDeleting={isDeletingCollection}
                submissionError={dialogSubmissionError}
              />
            )}
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete {collectionTypeLabel}</DialogTitle>
              </DialogHeader>
              <div className="py-6">
                <p className="text-center text-slate-700 dark:text-slate-300">
                  Are you sure you want to delete <span className="font-semibold">{currentCollection.name}</span>?
                  <br />
                  <span className="text-red-600 dark:text-red-400 text-sm">This action cannot be undone.</span>
                </p>
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 sm:mt-0"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteCollection}
                  disabled={isDeletingCollection}
                >
                  {isDeletingCollection ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Collection Details Section */}
      <section aria-labelledby="collection-details-heading">
        <h2 id="collection-details-heading" className="sr-only">{collectionTypeLabel} Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {formatCurrency(currentCollection.currentValue)}
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Total estimated market value
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">Number of Cards</CardTitle>
              <ListOrdered className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {currentCollection.numProducts}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">Created On</CardTitle>
              <CalendarDays className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatDate(currentCollection.createdAt)}</div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Last updated on: {formatDate(currentCollection.updatedAt, true)}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-200">Visibility</CardTitle>
              <Globe className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{currentCollection.public ? 'Public' : 'Private'}</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Portfolio Value History Section (conditionally rendered) */}
      {collectionType === 'portfolio' && (
        <section aria-labelledby="portfolio-value-history-heading">
          <h2 id="portfolio-value-history-heading" className="sr-only">Portfolio Value History</h2>
          <PortfolioValueHistorySection collectionId={collectionId} />
        </section>
      )}

      {/* Collection Cards Section */}
      <section aria-labelledby="collection-items-heading">
        <div className="flex flex-col gap-6 mb-6">
          <h2 id="collection-items-heading" className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Cards in {collectionTypeLabel} ({isLoadingItems ? "..." : collectionItems?.totalItems ?? 0})
          </h2>
          
          <SearchAndFilterHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filters={filters}
            setFilters={setFilters}
            hideFilters={true}
            customSortOptions={{
              'calculatedTotalStackValue,desc': 'Value (High to Low)',
              'calculatedTotalStackValue,asc': 'Value (Low to High)',
              'c.name,desc': 'Name (Z-A)',
              'c.name,asc': 'Name (A-Z)'
            }}
          />
        </div>
        {isLoadingItems ? (
          <div>
            {collectionItems && collectionItems.totalPages > 1 && (
              <div className="text-center mb-6 text-sm text-slate-500 dark:text-slate-400">
                Loading page {currentPage + 1}...
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {[...Array(pageSize)].map((_, index) => (
                <div key={index} className="w-full aspect-[3/4] bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : fetchItemsError ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
            <Info className="mx-auto h-12 w-12 text-red-400 dark:text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Error Loading {collectionTypeLabel} Items
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {fetchItemsError}
            </p>
          </div>
        ) : collectionItems?.items?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {collectionItems.items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (collectionType === 'portfolio') {
                    navigate(
                      `/collections/portfolios/${collectionId}/card/${item.id}`,
                      { 
                        state: { 
                          cardId: item.card.id,
                          quantity: item.quantity,
                          condition: item.condition,
                          finish: item.finish,
                        }
                      }
                    );
                  }
                }}
              >
                <RenderCard
                  card={item.card}
                  quantity={item.quantity}
                  showDetails={true}
                  finish={item.finish}
                  condition={item.condition}
                  stackValue={item.currentValue}
                  preventDialogOnCardClick={true}
                />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
            <Info className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No Results Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              No items matched your search for &quot;{searchQuery}&quot;. Try a different search term.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
            <Info className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No Items in {collectionTypeLabel}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              This {collectionType} is currently empty. Add some items to get started!
            </p>
          </div>
        )}
        
        {/* Pagination */}
        {collectionItems && collectionItems.totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    className={!collectionItems.first ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                    aria-disabled={collectionItems.first}
                  />
                </PaginationItem>
                
                {[...Array(collectionItems.totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index)}
                      isActive={currentPage === index}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(collectionItems.totalPages - 1, prev + 1))}
                    className={!collectionItems.last ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                    aria-disabled={collectionItems.last}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    </div>
  );
}

UserCollectionDetails.propTypes = {
  collectionType: PropTypes.oneOf(['portfolio', 'list']).isRequired
}

export default UserCollectionDetails;
