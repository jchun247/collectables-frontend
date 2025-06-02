import { Button } from "@/components/ui/button";
import { formatCardText } from "@/utils/textFormatters";
import CollectionCard from "@/components/CollectionCard";
import CollectionCardSkeleton from "@/components/CollectionCardSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Loader2, FolderKanban, ListChecks, AlertTriangle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import AuthPromptDialog from "@/components/AuthPromptDialog";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const PORTFOLIO_PAGE_SIZE = 6;
const LIST_PAGE_SIZE = 6;

const UserCollection = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading, getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();

  const initialCollectionState = {
    items: [],
    currentPage: 0,
    totalPages: 1,
    totalItems: 0,
    isLoading: true,
    error: null,
  };

  const [portfoliosData, setPortfoliosData] = useState(initialCollectionState);
  const [listsData, setListsData] = useState(initialCollectionState);

  const [showPortfolioSkeletons, setShowPortfolioSkeletons] = useState(true);
  const [showListSkeletons, setShowListSkeletons] = useState(true);

  const MIN_SKELETON_DISPLAY_TIME = 300; // milliseconds

  // State for aggregated stats
  const [collectionAggregates, setCollectionAggregates] = useState({
    totalPortfoliosValue: 0,
    totalCardsInPortfolios: 0,
    isLoading: true,
    error: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showPortfolioDialog, setShowPortfolioDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);

  const fetchTypedCollections = useCallback(async (collectionType, page = 0, pageSize, setData, setLoading, setErrorState, setShowSkeletonsState) => {
    if (!isAuthenticated || !user?.sub) {
      setLoading(false);
      setShowSkeletonsState(false); // No auth, no skeletons
      return;
    }

    setLoading(true);
    setShowSkeletonsState(true); // Start showing skeletons immediately
    setErrorState(null);

    const startTime = Date.now(); // Record start time

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiBaseUrl}/collections/users/${user.sub}?type=${collectionType}&page=${page}&size=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${collectionType.toLowerCase()}s`);
      }
      const data = await response.json();

      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_SKELETON_DISPLAY_TIME - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => {
          setData({
            items: data.items || [],
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalItems: data.totalItems,
            isLoading: false,
            error: null,
          });
          setShowSkeletonsState(false);
        }, remainingTime);
      } else {
        setData({
          items: data.items || [],
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.totalItems,
          isLoading: false,
          error: null,
        });
        setShowSkeletonsState(false);
      }
    } catch (err) {
      console.error(`Error fetching ${collectionType.toLowerCase()}s:`, err);
      setData(prev => ({ ...prev, isLoading: false, error: `Failed to load ${collectionType.toLowerCase()}s. Please try again later.` }));
      setShowSkeletonsState(false); // Hide skeletons on error
    }
  }, [user?.sub, getAccessTokenSilently, isAuthenticated]);

  const fetchPortfolios = useCallback((page = 0) => {
    fetchTypedCollections('PORTFOLIO', page, PORTFOLIO_PAGE_SIZE, setPortfoliosData, (isLoading) => setPortfoliosData(prev => ({...prev, isLoading})), (error) => setPortfoliosData(prev => ({...prev, error})), setShowPortfolioSkeletons);
  }, [fetchTypedCollections]);

  const fetchLists = useCallback((page = 0) => {
    fetchTypedCollections('LIST', page, LIST_PAGE_SIZE, setListsData, (isLoading) => setListsData(prev => ({...prev, isLoading})), (error) => setListsData(prev => ({...prev, error})), setShowListSkeletons);
  }, [fetchTypedCollections]);

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      setShowAuthDialog(true);
      setPortfoliosData(prev => ({ ...prev, isLoading: false }));
      setListsData(prev => ({ ...prev, isLoading: false }));
      setCollectionAggregates(prev => ({ ...prev, isLoading: false }));
      return;
    }

    if (isAuthenticated && user?.sub) {
      fetchPortfolios(portfoliosData.currentPage);
      fetchLists(listsData.currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, isAuthLoading]); // fetchPortfolios, fetchLists, fetchCollectionAggregates added

 const handlePageChange = (type, newPage) => {
    if (type === 'portfolio') {
      if (newPage >= 0 && newPage < portfoliosData.totalPages && newPage !== portfoliosData.currentPage) {
        fetchPortfolios(newPage);
      }
    } else if (type === 'list') {
      if (newPage >= 0 && newPage < listsData.totalPages && newPage !== listsData.currentPage) {
        fetchLists(newPage);
      }
    }
  };

  const handleOpenCreateDialog = (type) => {
      setSubmissionError(null);
      if (type === 'portfolio') {
        setShowPortfolioDialog(true);
      } else if (type === 'list') {
        setShowListDialog(true);
      }
    };

  const handleCreateCollection = async (collectionData, collectionType, dialogSetter) => {
    if (!isAuthenticated || !user?.sub) {
      setSubmissionError("User not authenticated.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const token = await getAccessTokenSilently();
      let endPointUrl;
      let requestBody;

      if (collectionType === 'portfolio') {
        endPointUrl = `${apiBaseUrl}/collections/portfolios`; // Assuming separate create endpoints
        requestBody = {
          auth0Id: user.sub,
          name: collectionData.name,
          description: collectionData.description,
          type: "PORTFOLIO",
          totalCostBasis: 0.00,
          public: collectionData.visibility === 'PUBLIC'
        }
      } else {
        endPointUrl = `${apiBaseUrl}/collections/lists`; // Assuming separate create endpoints
        requestBody = {
          auth0Id: user.sub,
          name: collectionData.name,
          description: collectionData.description,
          type: "LIST",
          listType: collectionData.listType,
          public: collectionData.visibility === 'PUBLIC'
        }
      }
      
      const response = await fetch(endPointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Failed to create ${collectionType}` }));
        throw new Error(errorData.message || `Failed to create ${collectionType}`);
      }
      // After successful creation, refetch the specific type of collection and go to its first page.
      if (collectionType === 'portfolio') {
        fetchPortfolios(0);
      } else {
        fetchLists(0);
      }
      dialogSetter(false); // Close the dialog
      toast({ title: "Success!", description: `${formatCardText(collectionType)} created successfully.`, className: "bg-green-500 text-white" });
    } catch (err) {
      setSubmissionError(err.message || `Could not create ${collectionType}. Please try again.`);
      toast({ title: `Error creating ${formatCardText(collectionType)}`, description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePortfolio = (data) => handleCreateCollection(data, 'portfolio', setShowPortfolioDialog);
  const handleCreateList = (data) => handleCreateCollection(data, 'list', setShowListDialog);

  const isLoading = portfoliosData.isLoading || listsData.isLoading || collectionAggregates.isLoading;
  const globalError = portfoliosData.error || listsData.error || collectionAggregates.error; // Show first error encountered

  if (isAuthLoading || (isLoading && !showAuthDialog && portfoliosData.items.length === 0 && listsData.items.length === 0 && collectionAggregates.isLoading)) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-sky-600 dark:text-sky-500" />
      </div>
    );
  }

  if (globalError && !isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center flex items-center justify-center" role="alert">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{globalError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-10">
      <AuthPromptDialog 
        isOpen={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        message="Please sign in or create an account to view and manage your collections"
      />
      <CreateCollectionDialog
        isOpen={showPortfolioDialog}
        onClose={() => setShowPortfolioDialog(false)}
        type="portfolio"
        onSubmit={handleCreatePortfolio}
        isSubmitting={isSubmitting}
        submissionError={submissionError}
      />
      <CreateCollectionDialog
        isOpen={showListDialog}
        onClose={() => setShowListDialog(false)}
        type="list"
        onSubmit={handleCreateList}
        isSubmitting={isSubmitting}
        submissionError={submissionError}
      />

      {/* Portfolios Section */}
      {isAuthenticated && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Portfolios</h2>
            <Button onClick={() => handleOpenCreateDialog('portfolio')}>
              <Plus className="w-5 h-5 mr-2" /> Add New Portfolio
            </Button>
          </div>
          {showPortfolioSkeletons ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(PORTFOLIO_PAGE_SIZE)].map((_, i) => <CollectionCardSkeleton key={`pfskel-${i}`} />)}
            </div>
          ) : portfoliosData.error ? (
            <div className="text-red-600 dark:text-red-400 p-4 border border-red-300 dark:border-red-700 rounded-md bg-red-50 dark:bg-red-900/30">
                <AlertTriangle className="inline-block mr-2 h-5 w-5" /> {portfoliosData.error}
            </div>
          ) : portfoliosData.totalItems === 0 ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <FolderKanban className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">No Portfolios Yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Create your first portfolio to group and track your valuable items.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfoliosData.items.map(portfolio => (
                  <CollectionCard key={portfolio.id} collection={portfolio} />
                ))}
              </div>
              {portfoliosData.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange('portfolio', portfoliosData.currentPage - 1)}
                          aria-disabled={portfoliosData.currentPage === 0}
                          className={portfoliosData.currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          Page {portfoliosData.currentPage + 1} of {portfoliosData.totalPages}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange('portfolio', portfoliosData.currentPage + 1)}
                          aria-disabled={portfoliosData.currentPage >= portfoliosData.totalPages - 1}
                          className={portfoliosData.currentPage >= portfoliosData.totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* Lists Section */}
      {isAuthenticated && (
        <section className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Lists</h2>
            <Button onClick={() => handleOpenCreateDialog('list')}>
              <Plus className="w-5 h-5 mr-2" /> Add New List
            </Button>
          </div>
           {showListSkeletons ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(LIST_PAGE_SIZE)].map((_, i) => <CollectionCardSkeleton key={`listskel-${i}`} />)}
            </div>
          ) : listsData.error ? (
             <div className="text-red-600 dark:text-red-400 p-4 border border-red-300 dark:border-red-700 rounded-md bg-red-50 dark:bg-red-900/30">
                <AlertTriangle className="inline-block mr-2 h-5 w-5" /> {listsData.error}
            </div>
          ) : listsData.totalItems === 0 ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <ListChecks className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">No Lists Yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Create lists to organize items, make wishlists, or plan your collection goals.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listsData.items.map(list => (
                  <CollectionCard key={list.id} collection={list} />
                ))}
              </div>
              {listsData.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange('list', listsData.currentPage - 1)}
                          aria-disabled={listsData.currentPage === 0}
                          className={listsData.currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          Page {listsData.currentPage + 1} of {listsData.totalPages}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange('list', listsData.currentPage + 1)}
                          aria-disabled={listsData.currentPage >= listsData.totalPages - 1}
                          className={listsData.currentPage >= listsData.totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default UserCollection;
