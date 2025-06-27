import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCardFinish, formatCardCondition } from '@/utils/textFormatters';

const CardCollectionEntryDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  type = "portfolio", 
  prices = [], 
  cardId, 
  currentPortfolioId, 
  disableCollectionSelect = false,
  selectedCardCondition,
  selectedCardFinish,
  disableConditionSelect = false,
  disableFinishSelect = false
}) => {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState("");

  const collectionConfig = {
    portfolio: {
      title: "Add to Portfolio",
      label: "Portfolio"
    },
    list: {
      title: "Add to List",
      label: "List"
    }
  }[type];

  useEffect(() => {
  const fetchCollections = async () => {
    if (!isOpen || !isAuthenticated || !user?.sub) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const token = await getAccessTokenSilently();
        const queryParams = new URLSearchParams();
        if (type === 'portfolio') {
          queryParams.append('type', 'PORTFOLIO');
        } else {
          queryParams.append('type', 'LIST');
        }
        
        const response = await fetch(`${apiBaseUrl}/collections/users/${encodeURIComponent(user.sub)}?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }

        const data = await response.json();
        setCollections(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [isOpen, type, apiBaseUrl, getAccessTokenSilently, isAuthenticated, user?.sub]);

  const [useMarketPrice, setUseMarketPrice] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [marketPrice, setMarketPrice] = useState(0);
  const [unitPrice, setUnitPrice] = useState("");

  const uniqueFinishes = useMemo(() => [...new Set(prices.map(p => p.finish))], [prices]);
  const uniqueConditions = useMemo(() => [...new Set(prices.map(p => p.condition))], [prices]);

   // Effect to set the initial selected finish and condition
  useEffect(() => {
    // If selected values are provided, use those, otherwise use first available
    if (prices.length > 0) {
      const initialFinish = selectedCardFinish || uniqueFinishes[0] || "";
      setSelectedFinish(initialFinish);
      
      const initialCondition = selectedCardCondition || uniqueConditions[0] || "";
      setSelectedCondition(initialCondition);
    } else {
      // Reset if prices are cleared
      setSelectedFinish("");
      setSelectedCondition("");
    }
  }, [prices, uniqueFinishes, uniqueConditions, selectedCardFinish, selectedCardCondition]);

  // Main effect to update marketPrice and unitPrice based on selections and useMarketPrice
  useEffect(() => {
    let currentSelectedPrice = 0;
    if (selectedFinish && selectedCondition && prices.length > 0) {
      currentSelectedPrice = prices.find(p => p.finish === selectedFinish && p.condition === selectedCondition)?.price || 0;
    }
    setMarketPrice(currentSelectedPrice);

    if (useMarketPrice) {
      setUnitPrice(currentSelectedPrice > 0 ? currentSelectedPrice.toFixed(2) : "");
    }
    // If !useMarketPrice, unitPrice is managed by manual input or cleared by the checkbox handler
  }, [selectedFinish, selectedCondition, useMarketPrice, prices]);

  const handleFinishChange = (finish) => {
    setSelectedFinish(finish);
    // updateMarketPrice(finish, selectedCondition);
  };

  const handleConditionChange = (condition) => {
    setSelectedCondition(condition);
    // updateMarketPrice(selectedFinish, condition);
  };

  const handleUseMarketPriceChange = (checked) => {
    setUseMarketPrice(checked);
    if (!checked) {
      setUnitPrice(""); // Clear unit price if user unchecks "Use Market Price"
    }
    // If checked is true, the main useEffect will set the unitPrice
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dateError || error || (collections.length === 0)) {
      return;
    }
    
    const form = new FormData(e.target);
    const purchaseDate = type === 'portfolio' 
      ? form.get('purchaseDate') 
      : new Date().toISOString().split('T')[0];

    const submitData = {
      cardId,
      condition: selectedCondition,
      finish: selectedFinish,
      quantity: form.get('quantity'),
      purchaseDate,
      costBasis: type === 'portfolio' ? parseFloat(unitPrice) || 0 : 0,
      collectionId: disableCollectionSelect ? Number(currentPortfolioId) : Number(form.get('collection'))
    };

    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{collectionConfig.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              defaultValue="1"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select 
              name="condition" 
              required 
              value={selectedCondition}
              onValueChange={handleConditionChange}
              disabled={disableConditionSelect || uniqueConditions.length <= 1}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {uniqueConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {formatCardCondition(condition)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finish">Finish</Label>
            <Select 
              name="finish" 
              required 
              defaultValue={selectedFinish}
              onValueChange={handleFinishChange}
              disabled={disableFinishSelect || uniqueFinishes.length <= 1}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select finish" />
              </SelectTrigger>
              <SelectContent>
                {uniqueFinishes.map((finish) => (
                  <SelectItem key={finish} value={finish}>
                    {formatCardFinish(finish)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type == "portfolio" && (
            <div className="space-y-2 border-t border-border pt-4 mt-4">
              <Label htmlFor="unitPrice">Unit Price</Label>

              {selectedFinish && selectedCondition && prices.length > 0 && (
                <p className="text-sm text-muted-foreground pt-1">
                  Current Market Price: {marketPrice > 0 ? `$${marketPrice.toFixed(2)}` : "N/A"}
                </p>
              )}

              <div className="flex items-center gap-2">
                <Input 
                  id="unitPrice"
                  name="unitPrice"
                  required
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={unitPrice}
                  step="0.01"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Ensure only 2 decimal places
                    if (value.includes('.') && value.split('.')[1].length > 2) {
                      const fixed = parseFloat(value).toFixed(2);
                      setUnitPrice(fixed);
                    } else {
                      setUnitPrice(value);
                    }
                  }}
                  className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={useMarketPrice}
                />
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="useMarketPrice" 
                    checked={useMarketPrice}
                    onCheckedChange={handleUseMarketPriceChange}
                  />
                  <Label 
                    htmlFor="useMarketPrice"
                    className="text-sm font-normal text-muted-foreground cursor-pointer hover:text-accent-foreground transition-colors"
                  >
                    Use Market Price
                  </Label>
                </div>
              </div>
            </div>
          )}

          {type === "portfolio" && (
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                max={new Date().toISOString().split('T')[0]}
                className={`text-foreground [color-scheme:normal] [&::-webkit-calendar-picker-indicator]:text-foreground [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:[filter:invert(1)] ${dateError ? "border-red-500" : ""}`}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  if (selectedDate > today) {
                    setDateError("Purchase date cannot be in the future");
                  } else {
                    setDateError("");
                  }
                }}
              />
              {dateError && (
                <p className="text-sm text-red-500 mt-1">
                  {dateError}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="collection">{collectionConfig.label}</Label>
            <Select 
              name="collection" 
              required
              defaultValue={currentPortfolioId?.toString()}
              disabled={disableCollectionSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${collectionConfig.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Loading collections...</SelectItem>
                ) : error ? (
                  <SelectItem value="error" disabled>Error loading collections</SelectItem>
                ) : collections.length === 0 ? (
                  <SelectItem value="none" disabled>No collections found</SelectItem>
                ) : (
                  collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id.toString()}>
                      {collection.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={error || collections.length === 0}
              title={error ? "Unable to load collections" : collections.length === 0 ? "No collections available" : ""}
            >
              Add to {collectionConfig.label}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

CardCollectionEntryDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['portfolio', 'list']),
  prices: PropTypes.arrayOf(PropTypes.shape({
    condition: PropTypes.string.isRequired,
    finish: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  })),
  cardId: PropTypes.number.isRequired,
  currentPortfolioId: PropTypes.string,
  disableCollectionSelect: PropTypes.bool,
  selectedCardCondition: PropTypes.string,
  selectedCardFinish: PropTypes.string,
  disableConditionSelect: PropTypes.bool,
  disableFinishSelect: PropTypes.bool
};

export default CardCollectionEntryDialog;
