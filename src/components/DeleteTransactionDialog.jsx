import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PropTypes from 'prop-types';

function DeleteTransactionDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting,
  transactionsCount = 1,
  error = null,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Transaction{transactionsCount > 1 ? 's' : ''}</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-center text-slate-700 dark:text-slate-300">
            Are you sure you want to delete {transactionsCount === 1 ? 'this transaction' : `these ${transactionsCount} transactions`}?
            {transactionsCount === 1 && <br />}
          <span className="text-red-600 dark:text-red-400 text-sm block mt-2">
            This action cannot be undone.
          </span>
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              {error}
            </p>
          )}
          </p>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="mt-3 sm:mt-0"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

DeleteTransactionDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  transactionsCount: PropTypes.number,
  error: PropTypes.string,
};

export default DeleteTransactionDialog;
