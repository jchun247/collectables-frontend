import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCardFinish, formatCardCondition } from '@/utils/textFormatters';

const SellCardDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit,
  cardCondition,
  cardFinish,
  maxQuantity,
  marketPrice,
}) => {
  const [error, setError] = useState("");
  const [useMarketPrice, setUseMarketPrice] = useState(false);
  const [costBasis, setCostBasis] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("");

  const cardConditions = ["NEAR_MINT"];
  const cardFinishes = ["HOLOFOIL", "REVERSE_HOLO", "NORMAL", "STAMP"];

  useEffect(() => {
    if (useMarketPrice) {
      setCostBasis(marketPrice.toFixed(2));
    }
  }, [useMarketPrice, marketPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) {
      return;
    }
    
    const form = new FormData(e.target);
    const quantity = parseInt(form.get('quantity'));
    
    if (quantity > maxQuantity) {
      setError(`Cannot sell more than ${maxQuantity} cards`);
      return;
    }

    onSubmit({
      quantity,
      condition: cardCondition,
      finish: cardFinish,
      saleDate: form.get('saleDate'),
      costBasis: parseFloat(costBasis) || 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Sell Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Sell</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              defaultValue="1"
              required
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > maxQuantity) {
                  setError(`Cannot sell more than ${maxQuantity} cards`);
                } else {
                  setError("");
                }
              }}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select 
              name="condition" 
              required 
              value={cardCondition || selectedCondition}
              onValueChange={setSelectedCondition}
              disabled={!!cardCondition}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {cardConditions.map((condition) => (
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
              value={cardFinish || selectedFinish}
              onValueChange={setSelectedFinish}
              disabled={!!cardFinish}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select finish" />
              </SelectTrigger>
              <SelectContent>
                {cardFinishes.map((finish) => (
                  <SelectItem key={finish} value={finish}>
                    {formatCardFinish(finish)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <Label htmlFor="costBasis">Sale Price Per Card</Label>
            
            {marketPrice > 0 && (
              <p className="text-sm text-muted-foreground pt-1">
                Current Market Price: ${marketPrice.toFixed(2)}
              </p>
            )}

            <div className="flex items-center gap-2">
              <Input 
                id="costBasis"
                name="costBasis"
                required
                type="number"
                min="0"
                placeholder="0.00"
                value={costBasis}
                step="0.01"
                onChange={(e) => {
                  const value = e.target.value;
                  // Ensure only 2 decimal places
                  if (value.includes('.') && value.split('.')[1].length > 2) {
                    const fixed = parseFloat(value).toFixed(2);
                    setCostBasis(fixed);
                  } else {
                    setCostBasis(value);
                  }
                }}
                className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                disabled={useMarketPrice}
              />
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="useMarketPrice" 
                  checked={useMarketPrice}
                  onCheckedChange={(checked) => {
                    setUseMarketPrice(checked);
                    if (!checked) {
                      setCostBasis("");
                    }
                  }}
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

          <div className="space-y-2">
            <Label htmlFor="saleDate">Sale Date</Label>
            <Input
              id="saleDate"
              name="saleDate"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              max={new Date().toISOString().split('T')[0]}
              className="text-foreground [color-scheme:normal] [&::-webkit-calendar-picker-indicator]:text-foreground [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:[filter:invert(1)]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="destructive"
            >
              Sell
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

SellCardDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  cardCondition: PropTypes.string.isRequired,
  cardFinish: PropTypes.string.isRequired,
  maxQuantity: PropTypes.number.isRequired,
  marketPrice: PropTypes.number.isRequired,
};

export default SellCardDialog;
