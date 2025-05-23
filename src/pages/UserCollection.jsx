import { Button } from "@/components/ui/button";
import { formatCardText } from "@/utils/textFormatters";
import CollectionCard from "@/components/CollectionCard";
import { Plus, Loader2, FolderKanban, ListChecks, AlertTriangle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import AuthPromptDialog from "@/components/AuthPromptDialog";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const UserCollection = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading, getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();

  const [collections, setCollections] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showPortfolioDialog, setShowPortfolioDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);

  const fetchCollections = useCallback(async () => {
    if (!isAuthenticated || !user?.sub) return;

    setIsLoadingData(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiBaseUrl}/collections/users/${user.sub}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      setCollections(data.items || []);
    } catch (err) {
      setError('Failed to load collections. Please try again later.');
      console.error('Error fetching collections:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [user?.sub, getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading) {
      setShowAuthDialog(true);
      setIsLoadingData(false); // Stop loading data if not authenticated
      return;
    }

    // If authenticated, fetch collections
    if (isAuthenticated && user?.sub) {
      fetchCollections();
    }
  }, [isAuthenticated, user, getAccessTokenSilently, isAuthLoading, fetchCollections]);

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
        endPointUrl = `${apiBaseUrl}/collections/portfolios`;
        requestBody = {
          auth0Id: user.sub,
          name: collectionData.name,
          description: collectionData.description,
          type: "PORTFOLIO",
          totalCostBasis: 0.00,
          public: collectionData.visibility === 'PUBLIC'
        }
      } else {
        endPointUrl = `${apiBaseUrl}/collections/lists`;
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
      await fetchCollections(); // Re-fetch all collections
      dialogSetter(false); // Close the dialog
      toast({ title: "Success!", description: `${formatCardText(collectionType)} created successfully.`, className: "bg-green-500 text-white" });
    } catch (err) {
      setSubmissionError(err.message || `Could not create ${collectionType}. Please try again.`);
      toast({ title: `Error creating ${formatCardText(collectionType)}`, description: err.message, variant: "destructive" });
      // Note: Dialog remains open on error so user can see the error or retry.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePortfolio = (portfolioData) => {
    handleCreateCollection(portfolioData, 'portfolio', setShowPortfolioDialog);
  };

  const handleCreateList = (listData) => {
    handleCreateCollection(listData, 'list', setShowListDialog);
  };

  if (isAuthLoading || (isLoadingData && !showAuthDialog)) { // Adjusted loading condition
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-sky-600 dark:text-sky-500" />
      </div>
    );
  }

  if (error && !isLoadingData) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center flex items-center justify-center" role="alert">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  const portfolios = collections.filter(c => c.collectionType === 'PORTFOLIO');
  const lists = collections.filter(c => c.collectionType === 'LIST');
  const hasCollections = collections.length > 0;

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

      {/* My Collection Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">My Collection</h2>
        {!hasCollections && isAuthenticated ? (
          <div className="bg-sky-50 dark:bg-slate-800/60 p-8 rounded-lg text-center border border-sky-200 dark:border-slate-700 shadow-sm">
            <FolderKanban className="mx-auto h-12 w-12 text-sky-400 dark:text-sky-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Your Collection is Empty
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              It looks like you haven&apos;t created any portfolios or lists yet.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button onClick={() => handleOpenCreateDialog('portfolio')}>
                <Plus className="w-5 h-5 mr-2" />
                Create Portfolio
              </Button>
              <Button onClick={() => handleOpenCreateDialog('list')} variant="outline" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create List
              </Button>
            </div>
          </div>
        ) : hasCollections && isAuthenticated ? (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="space-y-5">
              <div>
                <div className="flex items-center text-slate-700 dark:text-slate-200">
                  <FolderKanban className="w-7 h-7 mr-3 text-sky-600 dark:text-sky-500" strokeWidth={1.5}/>
                  <h3 className="text-xl font-semibold">
                    Portfolios: <span className="font-bold text-sky-700 dark:text-sky-400">{portfolios.length}</span>
                  </h3>
                </div>
              </div>
              <hr className="border-slate-200 dark:border-slate-700"/>
              <div>
                <div className="flex items-center text-slate-700 dark:text-slate-200">
                  <ListChecks className="w-7 h-7 mr-3 text-green-600 dark:text-green-500" strokeWidth={1.5}/>
                  <h3 className="text-xl font-semibold">
                    Lists: <span className="font-bold text-green-700 dark:text-green-400">{lists.length}</span>
                  </h3>
                </div>
              </div>
            </div>
            {(portfolios.length === 0 || lists.length === 0) && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                      {portfolios.length === 0 && (
                          <Button onClick={() => handleOpenCreateDialog('portfolio')} variant="outline" size="lg">
                              <Plus className="w-4 h-4 mr-1.5" /> Create a Portfolio
                          </Button>
                      )}
                      {lists.length === 0 && (
                            <Button onClick={() => handleOpenCreateDialog('list')} variant="outline" size="lg">
                              <Plus className="w-4 h-4 mr-1.5" /> Create a List
                          </Button>
                      )}
                  </div>
                </div>
              )}
          </div>
        ): null}
      </section>

      {/* Portfolios Section (only show if user is authenticated) */}
      {isAuthenticated && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Portfolios</h2>
            <Button onClick={() => handleOpenCreateDialog('portfolio')}>
              <Plus className="w-5 h-5" />
              Add New Portfolio
            </Button>
          </div>
          {portfolios.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" /* portfolio-related icon */ fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">No Portfolios Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Create your first portfolio to group and track your valuable items.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolios.map(portfolio => (
                <CollectionCard key={portfolio.id} collection={portfolio} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Lists Section (only show if user is authenticated) */}
      {isAuthenticated && (
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Lists</h2>
            <Button onClick={() => handleOpenCreateDialog('list')}>
              <Plus className="w-5 h-5" />
              Add New List
            </Button>
          </div>
          {lists.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" /* list-related icon */ fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">No Lists Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Create lists to organize items, make wishlists, or plan your collection goals.
              </p>
            </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lists.map(list => (
                  <CollectionCard key={list.id} collection={list} />
                ))}
              </div>
            )}
        </section>
      )}
    </div>
  );
};

export default UserCollection;
