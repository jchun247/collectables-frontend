import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import PropTypes from "prop-types";

const UpdateTransactionDialog = ({
  isOpen,
  transaction = null,
  onSubmit,
  isSubmitting = false,
  submissionError = null,
  onClose,
}) => {

  const [dateError, setDateError] = useState("");
  const [costBasis, setCostBasis] = useState(0);

  useEffect(() => {
    if (transaction?.costBasis !== undefined) {
      setCostBasis(transaction.costBasis);
    }
  }, [transaction]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.target);
    onSubmit({
      ...transaction,
      purchaseDate: new Date(formData.get('purchaseDate')).toISOString(),
      quantity: Number(formData.get('quantity')),
      costBasis: Number(formData.get('costBasis')),
    });
  };

  if (!transaction) {
    return null;
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && onClose) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Update Transaction</DialogTitle>
      </DialogHeader>
      <form id="update-transaction-form" onSubmit={handleSubmit} className="space-y-6 pt-2 pb-2">
        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            defaultValue={transaction.quantity || 1}
            min="1"
            required
          />
        </div>

        {/* Purchase Date */}
        <div className="space-y-2">
          <Label htmlFor="purchaseDate" className="text-sm font-medium">
            Purchase Date <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            defaultValue={transaction.purchaseDate ? new Date(transaction.purchaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
            required
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

        {/* Cost Basis */}
        <div className="space-y-2">
          <Label htmlFor="costBasis" className="text-sm font-medium">
            Cost Basis <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              id="costBasis"
              name="costBasis"
              step="0.01"
              min="0"
              required
              className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={costBasis}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || value === '-') {
                  setCostBasis(value);
                  return;
                }
                
                // Only allow numbers with up to 2 decimal places
                const regex = /^\d*\.?\d{0,2}$/;
                if (regex.test(value)) {
                  setCostBasis(value);
                }
              }}
            />
          </div>
        </div>

        {submissionError && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-center">
            {submissionError}
          </p>
        )}

        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="text-muted-foreground">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Transaction"}
          </Button>
        </DialogFooter>
      </form>
      </DialogContent>
    </Dialog>
  );
};

UpdateTransactionDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.number.isRequired,
    purchaseDate: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    costBasis: PropTypes.number.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  submissionError: PropTypes.string,
  onClose: PropTypes.func,
};

export default UpdateTransactionDialog;
