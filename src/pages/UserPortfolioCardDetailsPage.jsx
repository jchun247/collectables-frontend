import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ArrowLeft, AlertTriangle, TrendingUp, Hash, DollarSign, Loader2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import TransactionHistoryTable from "@/components/TransactionHistoryTable";
import { formatCardCondition, formatCardFinish } from "@/utils/textFormatters";

function UserPortfolioCardDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const cardId = location.state?.cardId;
  const quantity = location.state?.quantity;
  const condition = location.state?.condition;
  const finish = location.state?.finish;
  const { getAccessTokenSilently } = useAuth0();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [cardDetails, setCardDetails] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState({ items: [] });
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [cardError, setCardError] = useState(null);
  const [historyError, setHistoryError] = useState(null);

    useEffect(() => {
    const fetchCardDetails = async () => {
      if (!cardId) return;
      
      try {
        const token = await getAccessTokenSilently();
        setIsLoadingCard(true);
        setCardError(null);
        
        const response = await fetch(
          `${apiBaseUrl}/cards/${cardId}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch card details');
        }
        
        const data = await response.json();
        setCardDetails(data);
      } catch (err) {
        setCardError(err.message);
      } finally {
        setIsLoadingCard(false);
      }
    };

    fetchCardDetails();
  }, [cardId, getAccessTokenSilently, apiBaseUrl]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!params.portfolioId || !params.collectionCardId) return;
      
      try {
        const token = await getAccessTokenSilently();
        setIsLoadingHistory(true);
        setHistoryError(null);
        
        const response = await fetch(
          `${apiBaseUrl}/collections/${params.portfolioId}/cards/${params.collectionCardId}/transaction-history`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch transaction history');
        }
        
        const data = await response.json();
        setTransactionHistory(data);
      } catch (err) {
        setHistoryError(err.message);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchTransactionHistory();
  }, [params.portfolioId, params.collectionCardId, getAccessTokenSilently, apiBaseUrl]);

  // Redirect if no cardId was passed
  if (!cardId) {
    navigate(`/collections/portfolios/${params.portfolioId}`);
    return null;
  }

  if (isLoadingCard) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-sky-600 dark:text-sky-500" />
      </div>
    );
  }

  if (cardError) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-center flex items-center justify-center min-h-[200px]" role="alert">
          <AlertTriangle className="h-6 w-6 mr-3 shrink-0" />
          <span className="block sm:inline">{cardError}</span>
        </div>
      </div>
    );
  }

  if (!cardDetails) { // Should be caught by isLoadingCard or cardError, but as a fallback
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center min-h-[calc(100vh-200px)]">
            <p>Card details not available.</p>
              <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
        </div>
    );
  }

  const averageCost = transactionHistory.items.length > 0
    ? (transactionHistory.items.reduce((sum, item) => sum + (item.costBasis * item.quantity), 0) /
       transactionHistory.items.reduce((sum, item) => sum + item.quantity, 0))
    : 0;
  const marketPrice = cardDetails.prices.find(p => p.condition === condition && p.finish === finish)?.price || 0;
  const totalQuantityFromHistory = transactionHistory.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCostBasis = transactionHistory.items.reduce((sum, item) => sum + (item.costBasis * item.quantity), 0);
  const calculatedReturn = (marketPrice * totalQuantityFromHistory) - totalCostBasis;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/collections/portfolios/${params.portfolioId}`)}
        className="mb-4 -ml-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Portfolio
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Card Image */}
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <img
            src={cardDetails.images.find(img => img.resolution === "HIGH_RES")?.url || '/placeholder-image.png'} // Added fallback
            alt={cardDetails.name}
            className="w-full max-w-sm md:max-w-full rounded-lg shadow-xl object-contain max-h-[50vh] md:max-h-[70vh]"
          />
        </div>
        {/* Right Column: Details, Actions, Stats, Graph */}
        <div className="md:col-span-2 space-y-6">
          {/* Card Info */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {cardDetails.name}
              </h1>
              <Button className="w-full sm:w-auto flex-shrink-0 transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-px active:scale-95">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
              {cardDetails.setName} · #{cardDetails.setNumber}
            </p>
            <p className="text-md text-slate-600 dark:text-slate-400 mt-1">
              {formatCardCondition(condition)} · {formatCardFinish(finish)}
            </p>
            <p className="text-3xl lg:text-4xl font-bold text-green-500 dark:text-green-400 mt-3">
              ${marketPrice.toFixed(2)}
            </p>
            {/* Optional: Link to detailed sales history if different from transaction history below */}
            {/* <a href="#" className="text-sm text-sky-600 dark:text-sky-500 hover:underline mt-1 inline-flex items-center">
              View Detailed Sales History <ExternalLink className="ml-1 h-3 w-3" />
            </a> */}
          </div>

          {/* Action Buttons (Placeholder functionality) */}
          {/* <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="w-full sm:w-auto flex-grow bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white">
              <Plus className="mr-2 h-5 w-5" /> Add Copy
            </Button>
            <Button size="lg" variant="destructive" className="w-full sm:w-auto flex-grow">
              <Minus className="mr-2 h-5 w-5" /> Log Sale
            </Button>
          </div> */}

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <StatCard title="Your Quantity" value={quantity} icon={<Hash className="text-slate-500 dark:text-slate-400"/>} />
            <StatCard title="Avg Cost / Card" value={`$${averageCost.toFixed(2)}`} /*isMoney={true}*/ icon={<DollarSign className="text-slate-500 dark:text-slate-400"/>} />
            <StatCard title="Total Market Value" value={`$${(marketPrice * totalQuantityFromHistory).toFixed(2)}`} isMoney={true} valueColorClass="text-green-500 dark:text-green-400" icon={<DollarSign className="text-slate-500 dark:text-slate-400"/>} />
            <StatCard title="Est. Return" value={`$${calculatedReturn.toFixed(2)}`} /*isMoney={true}*/ valueColorClass={calculatedReturn >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'} icon={<TrendingUp className="text-slate-500 dark:text-slate-400"/>} />
          </div>

          {/* Price History Graph Placeholder */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">Market Price History</h3>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg min-h-[200px] sm:min-h-[250px] flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-center">
                <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                Price History Chart Placeholder
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="mt-12">
        <TransactionHistoryTable 
          transactionHistory={transactionHistory}
          isLoading={isLoadingHistory}
          error={historyError}
        />
      </div>
    </div>
  );
}

export default UserPortfolioCardDetailsPage;
