import { Button } from "@/components/ui/button";
import CollectionCard from "@/components/CollectionCard";
import { Plus, Loader2 } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import AuthPromptDialog from "@/components/AuthPromptDialog";
import CreateCollectionDialog from "@/components/CreateCollectionDialog";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const UserCollection = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading, getAccessTokenSilently } = useAuth0();
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showPortfolioDialog, setShowPortfolioDialog] = useState(false);
  const [showListDialog, setShowListDialog] = useState(false);

  const portfolios = collections.filter(c => c.collectionType === 'PORTFOLIO');
  const lists = collections.filter(c => c.collectionType === 'LIST');
  const hasCollections = collections.length > 0;

  useEffect(() => {
    // If not authenticated and not in auth loading state, show auth dialog
    if (!isAuthenticated && !isAuthLoading) {
      setShowAuthDialog(true);
      setIsLoading(false);
      return;
    }

    // If authenticated, fetch collections
    if (isAuthenticated && user?.sub) {
      fetchCollections();
    }
  }, [isAuthenticated, user, apiBaseUrl, getAccessTokenSilently]);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      setError(null);
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
      setCollections(data.items);
    } catch (err) {
      setError('Failed to load collections. Please try again later.');
      console.error('Error fetching collections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPortfolio = () => {
    setShowPortfolioDialog(true);
  };

  const handleAddList = () => {
    setShowListDialog(true);
  };

  const handleCreatePortfolio = async (portfolioData) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiBaseUrl}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...portfolioData,
          collectionType: 'PORTFOLIO',
          userId: user.sub,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portfolio');
      }

      await fetchCollections();
      setShowPortfolioDialog(false);
    } catch (err) {
      console.error('Error creating portfolio:', err);
    }
  };

  const handleCreateList = async (listData) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiBaseUrl}/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...listData,
          collectionType: 'LIST',
          userId: user.sub,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      await fetchCollections();
      setShowListDialog(false);
    } catch (err) {
      console.error('Error creating list:', err);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
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
      />
      <CreateCollectionDialog
        isOpen={showListDialog}
        onClose={() => setShowListDialog(false)}
        type="list"
        onSubmit={handleCreateList}
      />
      {/* My Collection Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Collection</h2>
        {!hasCollections ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              Start creating your own portfolios and lists to track your collection!
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600">
              You have {portfolios.length} portfolios and {lists.length} lists.
            </p>
          </div>
        )}
      </section>

      {/* Portfolios Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Portfolios</h2>
          <Button onClick={handleAddPortfolio}>
            <Plus className="w-5 h-5" />
            Add New Portfolio
          </Button>
        </div>
        {portfolios.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              You don&apos;t have any portfolios yet. Create a portfolio to start tracking your collection!
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

      {/* Lists Section */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Lists</h2>
          <Button onClick={handleAddList}>
            <Plus className="w-5 h-5" />
            Add New List
          </Button>
        </div>
        {lists.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              You don&apos;t have any lists yet. Create a list to start tracking your collection!
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
    </div>
  );
};

export default UserCollection;
