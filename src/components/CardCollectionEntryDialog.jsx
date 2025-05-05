import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CONDITIONS = [
  "Near Mint",
  "Lightly Played",
  "Moderately Played",
  "Heavily Played",
];

const COLLECTION_TYPES = {
  portfolio: {
    title: "Add to Portfolio",
    options: ["Main Collection", "Trading", "Wishlist"],
    label: "Portfolio"
  },
  list: {
    title: "Add to List",
    options: ["Want", "Have", "Trading"],
    label: "List"
  }
};

const CardCollectionEntryDialog = ({ isOpen, onOpenChange, onSubmit, type = "portfolio" }) => {
  const collectionConfig = COLLECTION_TYPES[type];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      quantity: parseInt(formData.get('quantity')),
      condition: formData.get('condition'),
      collection: formData.get('collection'),
      type
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
            <Select name="condition" required defaultValue={CONDITIONS[0]}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection">{collectionConfig.label}</Label>
            <Select name="collection" required defaultValue={collectionConfig.options[0]}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${collectionConfig.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {collectionConfig.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
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
  type: PropTypes.oneOf(['portfolio', 'list'])
};

export default CardCollectionEntryDialog;
