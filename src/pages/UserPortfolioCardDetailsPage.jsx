import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { ArrowLeft, AlertTriangle, TrendingUp, Hash, DollarSign, Loader2, Plus, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import CardSettingsMenu from "@/components/CardSettingsMenu";
import StatCard from "@/components/StatCard";
import TransactionLedgerTable from "@/components/TransactionLedgerTable";
import CardCollectionEntryDialog from "@/components/CardCollectionEntryDialog";
import SellCardDialog from "@/components/SellCardDialog";
import UpdateTransactionDialog from '@/components/UpdateTransactionDialog';
import DeleteTransactionDialog from '@/components/DeleteTransactionDialog';
import RemoveCardDialog from '@/components/RemoveCardDialog';
import { createTransactionLedgerColumns } from '@/components/tables/columns';
import { formatCardCondition, formatCardFinish, formatCurrency } from "@/utils/textFormatters";
import CardPriceHistorySection from "@/components/CardPriceHistorySection";

function UserPortfolioCardDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getAccessTokenSilently } = useAuth0();
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [cardDetails, setCardDetails] = useState(null);
  const [transactions, setTransactions] = useState([]); 
  const [portfolioStats, setPortfolioStats] = useState({
    currentValue: 0,
    totalCostBasis: 0,
    unrealizedGain: 0,
    realizedGain: 0,
  });
  const [isLoadingCard, setIsLoadingCard] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [cardError, setCardError] = useState(null);
  const [historyError, setHistoryError] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);

  const cardId = location.state?.cardId;

  // State for the transaction history table
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState(null);

  const condition = location.state?.condition;
  const finish = location.state?.finish;

  const fetchPortfolioStats = useCallback(async () => {
    if (!params.portfolioId || !params.collectionCardId) return;
    
    // We can share the history loading/error state for simplicity
    setIsLoadingHistory(true);
    setHistoryError(null);

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${apiBaseUrl}/collections/${params.portfolioId}/cards/${params.collectionCardId}`, 
        {
          headers: {'Authorization': `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch portfolio stats');
      
      const statsData = await response.json();
      
      setPortfolioStats({
        currentValue: statsData.currentValue ?? 0,
        totalCostBasis: statsData.totalCostBasis ?? 0,
        unrealizedGain: statsData.unrealizedGain ?? 0,
        realizedGain: statsData.realizedGain ?? 0,
      });
    } catch (err) {
      // Set a generic error as this could be one of two fetches
      setHistoryError(err.message);
    } finally {
      // Note: loading will be set to false by refreshTransactionHistory
    }
  }, [params.portfolioId, params.collectionCardId, getAccessTokenSilently, apiBaseUrl]);

  const refreshTransactionHistory = useCallback(async () => {
    if (!params.portfolioId || !params.collectionCardId) return null;
    
    try {
      setIsLoadingHistory(true);
      setHistoryError(null);
      
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${apiBaseUrl}/collections/${params.portfolioId}/cards/${params.collectionCardId}/transaction-history`, 
        {
          headers: {'Authorization': `Bearer ${token}` },
          cache: 'no-store'
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch transaction history');
      
      const transactionData = await response.json();
      
      const sortedItems = [...(transactionData.items || [])].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
      setTransactions(sortedItems);
      setRowSelection({});

    } catch (err) {
      setHistoryError(err.message);
      return null;
    } finally {
      setIsLoadingHistory(false);
    }
  }, [params.portfolioId, params.collectionCardId, getAccessTokenSilently, apiBaseUrl]);


  // Fetch card details
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
    fetchPortfolioStats();
    refreshTransactionHistory();
  }, [cardId, getAccessTokenSilently, apiBaseUrl, fetchPortfolioStats, refreshTransactionHistory]);


  const derivedStats = useMemo(() => {
      const buys = transactions.filter(t => t.transactionType === 'BUY');
      const sells = transactions.filter(t => t.transactionType === 'SELL');

      const quantityHeld = buys.reduce((sum, t) => sum + t.quantity, 0) - sells.reduce((sum, t) => sum + t.quantity, 0);
      const avgCostPerCard = quantityHeld > 0 ? (portfolioStats.totalCostBasis / quantityHeld) : 0;
      const marketPrice = cardDetails?.prices.find(p => p.condition === condition && p.finish === finish)?.price || 0;
      
      return { quantityHeld, avgCostPerCard, marketPrice };
    }, [transactions, portfolioStats.totalCostBasis, cardDetails, condition, finish]);

  const handleBuySubmit = async (formData) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${apiBaseUrl}/collections/${params.portfolioId}/cards`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add card to collection');
      }

      const newTransaction = await response.json();
      
      toast({
        title: "Success",
        description: "Card added to collection successfully"
      });
      
      // Update the transaction history state immediately
      setTransactions(prevTransactions => 
        [...prevTransactions, newTransaction].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
      );

      // Close the dialog
      setIsAddDialogOpen(false);

      await Promise.all([fetchPortfolioStats(), refreshTransactionHistory()]);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || 'Failed to add card to collection'
      });
    }
  };

  const handleSellSubmit = async (formData) => {
    // check if this is the last item being sold
    if (formData.quantity >= derivedStats.quantityHeld) {
      // if so, perform the sale and navigate back to portfolio
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${apiBaseUrl}/collections/${params.portfolioId}/cards/${params.collectionCardId}/transactions`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              condition: formData.condition,
              finish: formData.finish,
              transactionType: "SELL",
              quantity: formData.quantity,
              purchaseDate: formData.saleDate,
              costBasis: formData.costBasis
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to sell card');
        }

        toast({
          title: "Last Holding Sold",
          description: "Returning to your portfolio."
        });
        navigate(`/collections/portfolios/${params.portfolioId}`);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || 'Failed to sell card'
        });
      }
    } else {
      // Otherwise, proceed with sale as normal and refresh data
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(
          `${apiBaseUrl}/collections/${params.portfolioId}/cards/${params.collectionCardId}/transactions`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              condition: formData.condition,
              finish: formData.finish,
              transactionType: "SELL",
              quantity: formData.quantity,
              purchaseDate: formData.saleDate,
              costBasis: formData.salePrice
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to sell card');
        }

        toast({
          title: "Success",
          description: "Card sold successfully"
        });
        
        // Close the dialog
        setIsSellDialogOpen(false);

        // Refresh history and get updated data
        const updatedData = await refreshTransactionHistory();
        const quantityHeld = (updatedData?.items || []).filter(t => t.transactionType === "BUY").reduce((s,i) => s + i.quantity, 0) - (updatedData?.items || []).filter(t => t.transactionType === "SELL").reduce((s,i) => s + i.quantity, 0);

        // If the last holding was sold, navigate back to portfolio
        if (updatedData && quantityHeld <= 0) {
          toast({ 
            title: "Last Holding Sold", 
            description: "Returning to your portfolio." 
          });
          navigate(`/collections/portfolios/${params.portfolioId}`);
        }
        await Promise.all([fetchPortfolioStats(), refreshTransactionHistory()]);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || 'Failed to sell card'
        });
      }
    }
  };

  const onUpdateSubmit = async (updatedTransactionData) => {
    setIsSubmitting(true);
    setDialogError(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${apiBaseUrl}/collections/${params.portfolioId}/transactions/${selectedTransaction.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTransactionData),
        }
      );
      if (!response.ok) throw new Error('Failed to update transaction');
      
      toast({ title: "Success", description: "Transaction updated." });
      setIsUpdateDialogOpen(false);
      await Promise.all([fetchPortfolioStats(), refreshTransactionHistory()]);
    } catch (err) {
      setDialogError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConfirmDelete = async () => {
    setIsSubmitting(true);
    setDialogError(null);
    try {
      const token = await getAccessTokenSilently();
      // Loop through selected transactions and delete them
      for (const transaction of selectedTransactions) {
        const response = await fetch(`${apiBaseUrl}/collections/${params.portfolioId}/transactions/${transaction.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Failed to delete transaction ${transaction.id}. Please try again.`);
        }
      }
      
      toast({ title: "Success", description: `Deleted ${selectedTransactions.length} transaction(s).` });
      setIsDeleteDialogOpen(false);
      setSelectedTransactions([]);
      await Promise.all([fetchPortfolioStats(), refreshTransactionHistory()]);
    } catch (err) {
      setDialogError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTransaction = useCallback((transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateDialogOpen(true);
    setDialogError(null);
  }, []);

  const handleDeleteTransaction = useCallback((transaction) => {
    setSelectedTransactions([transaction]);
    setIsDeleteDialogOpen(true);
    setDialogError(null);
  }, []);
  
  const handleDeleteSelected = useCallback((transactions) => {
    setSelectedTransactions(transactions);
    setIsDeleteDialogOpen(true);
    setDialogError(null);
  }, []);

  const handleRemoveCard = useCallback(() => {
    setIsRemoveDialogOpen(true);
    setRemoveError(null);
  }, []);

  const onConfirmRemove = async () => {
    setIsRemoving(true);
    setRemoveError(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${apiBaseUrl}/collections/${params.portfolioId}/cards/${params.collectionCardId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to remove card from collection');
      }
      
      toast({
        title: "Success",
        description: "Card removed from collection"
      });
      
      navigate(`/collections/portfolios/${params.portfolioId}`);
    } catch (err) {
      setRemoveError(err.message || 'Failed to remove card from collection');
    } finally {
      setIsRemoving(false);
    }
  };

  const columns = useMemo(
    () => createTransactionLedgerColumns({
      onEdit: handleEditTransaction,
      onDelete: handleDeleteTransaction,
    }), 
    [handleEditTransaction, handleDeleteTransaction]
  );

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
        <div className="md:col-span-1 flex justify-center items-start">
          <div className="w-full max-w-sm">
            <img 
              src={cardDetails.images.find(img => img.resolution === "HIGH_RES")?.url || '/placeholder-image.png'} 
              alt={cardDetails.name} 
              className="h-auto w-full rounded-lg shadow-xl" />            
          </div>
        </div>

        {/* Right Column: Details, Actions, Stats, Graph */}
        <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold">{cardDetails.name}</h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">{cardDetails.setName} · #{cardDetails.setNumber}</p>
                  <p className="text-md font-semibold text-slate-700 dark:text-slate-300 mt-1">{formatCardCondition(condition)} · {formatCardFinish(finish)}</p>
                </div>
                <CardSettingsMenu 
                  cardId={cardId}
                  onRemove={handleRemoveCard}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-4xl font-bold text-green-500 dark:text-green-400">${derivedStats.marketPrice.toFixed(2)}</p>
                <div className="flex gap-2">
                  <Button onClick={() => setIsAddDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Buy</Button>
                  <Button variant="destructive" onClick={() => setIsSellDialogOpen(true)} disabled={derivedStats.quantityHeld <= 0}><Minus className="h-4 w-4 mr-1" />Sell</Button>
                </div>
              </div>
            </div>

          {/* Holdings Summary */}
          <div className="pt-4 border-t">
             <h3 className="text-xl font-semibold mb-3">Your Holdings</h3>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Quantity Held" value={derivedStats.quantityHeld} icon={<Hash />} />
                <StatCard title="Avg Cost / Card" value={formatCurrency(derivedStats.avgCostPerCard)} icon={<DollarSign />} />
                <StatCard title="Total Cost Basis" value={formatCurrency(portfolioStats.totalCostBasis)} icon={<DollarSign />} />
                <StatCard title="Total Market Value" value={formatCurrency(portfolioStats.currentValue)} valueColorClass="text-green-500" icon={<DollarSign />} />
             </div>
          </div>

          {/* Performance Summary */}
          <div className="pt-4 border-t">
             <h3 className="text-xl font-semibold mb-3">Performance</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard title="Unrealized Gain/Loss" value={formatCurrency(portfolioStats.unrealizedGain)} valueColorClass={portfolioStats.unrealizedGain >= 0 ? 'text-green-500' : 'text-red-500'} icon={<TrendingUp />} />
                <StatCard title="Realized Gain/Loss" value={formatCurrency(portfolioStats.realizedGain)} valueColorClass={portfolioStats.realizedGain >= 0 ? 'text-green-500' : 'text-red-500'} icon={<DollarSign />} />
             </div>
          </div>
        </div>
      </div>

      {/* Price History Section */}
      <CardPriceHistorySection cardId={cardId} />

      {/* Transaction History Section */}
      <div className="pt-2">
        <TransactionLedgerTable
          data={transactions}
          columns={columns}
          isLoading={isLoadingHistory}
          error={historyError}
          sorting={sorting}
          setSorting={setSorting}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          pagination={pagination}
          setPagination={setPagination}
          onDeleteSelected={handleDeleteSelected}
        />
      </div>

      {/* Add Card Dialog */}
      <CardCollectionEntryDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        type="portfolio"
        prices={cardDetails?.prices || []}
        cardId={cardId}
        onSubmit={handleBuySubmit}
        currentPortfolioId={params.portfolioId}
        disableCollectionSelect={true}
        selectedCardCondition={condition}
        selectedCardFinish={finish}
        disableConditionSelect={true}
        disableFinishSelect={true}
      />

      {/* Sell Card Dialog */}
      <SellCardDialog
        isOpen={isSellDialogOpen}
        onOpenChange={setIsSellDialogOpen}
        onSubmit={handleSellSubmit}
        cardCondition={condition}
        cardFinish={finish}
        maxQuantity={derivedStats.quantityHeld}
        marketPrice={derivedStats.marketPrice}
      />
      <UpdateTransactionDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        transaction={selectedTransaction}
        onSubmit={onUpdateSubmit}
        isSubmitting={isSubmitting}
        submissionError={dialogError}
      />
      <DeleteTransactionDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={onConfirmDelete}
        isDeleting={isSubmitting}
        transactionsCount={selectedTransactions.length}
        error={dialogError}
      />
      <RemoveCardDialog
        isOpen={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        onConfirm={onConfirmRemove}
        cardName={cardDetails.name}
        isRemoving={isRemoving}
        error={removeError}
      />
    </div>
  );
}

export default UserPortfolioCardDetailsPage;
