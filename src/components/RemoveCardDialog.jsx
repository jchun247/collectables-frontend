import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PropTypes from 'prop-types';

export function RemoveCardDialog({
  isOpen,
  onClose,
  onConfirm,
  cardName,
  isRemoving,
  error
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Card from Collection</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {cardName} from your collection? This action cannot be undone.
            {error && (
              <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRemoving}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

RemoveCardDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  cardName: PropTypes.string.isRequired,
  isRemoving: PropTypes.bool,
  error: PropTypes.string
};

export default RemoveCardDialog;
