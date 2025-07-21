import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button } from "@/components/ui/button";
import { formatCardCondition, formatCardFinish } from '@/utils/textFormatters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function UpdateListCardDialog({ 
  isOpen, onClose, card, prices = [], 
  onSubmit, isSubmitting, submissionError, 
  formData, onFormChange, onFormSelectChange }) {

  const initialConditions = useMemo(() => [...new Set(prices.map(p => p.condition))], [prices]);
  const initialFinishes = useMemo(() => [...new Set(prices.map(p => p.finish))], [prices]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  if (!isOpen || !card) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {card.card.name}</DialogTitle>
          <DialogDescription>
            Update the details for this card in your list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={onFormChange}
              min="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select 
              name="condition" 
              value={formData.condition} 
              onValueChange={(value) => onFormSelectChange('condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {initialConditions.map(condition => (
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
              value={formData.finish} 
              onValueChange={(value) => onFormSelectChange('finish', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select finish" />
              </SelectTrigger>
              <SelectContent>
                {initialFinishes.map(finish => (
                  <SelectItem key={finish} value={finish}>
                    {formatCardFinish(finish)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {submissionError && <p className="text-red-500 text-sm">{submissionError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Card'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

UpdateListCardDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  card: PropTypes.object,
  prices: PropTypes.arrayOf(PropTypes.shape({
    condition: PropTypes.string.isRequired,
    finish: PropTypes.string.isRequired,
    price: PropTypes.number
  })),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  submissionError: PropTypes.string,
  formData: PropTypes.object.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onFormSelectChange: PropTypes.func.isRequired
};

export default UpdateListCardDialog;