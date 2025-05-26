import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const UpdateCollectionDialog = ({
  isOpen,
  collection = null,
  collectionType, // "list" or "portfolio"
  onSubmit,
  onDelete,
  isSubmitting = false,
  isDeleting = false,
  submissionError = null,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE"); // Default to PRIVATE
  const [listType, setListType] = useState("GENERAL"); // Default for lists

  const nameMaxChars = 255;
  const descriptionMaxChars = 1000;

  const remainingNameChars = nameMaxChars - name.length;
  const remainingDescriptionChars = descriptionMaxChars - description.length;
  const isFormValid = name.trim() !== "";

  const collectionTypeLabel = collectionType.charAt(0).toUpperCase() + collectionType.slice(1);

  useEffect(() => {
    if (isOpen && collection) {
      setName(collection.name || "");
      setDescription(collection.description || "");
      setVisibility(collection.public ? "PUBLIC" : "PRIVATE");
      if (collectionType === "list") {
        setListType(collection.listType || "GENERAL");
      }
    }
  }, [isOpen, collection, collectionType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    onSubmit({
      // Only include fields that are part of the collection type
      name,
      description,
      visibility,
      ...(collectionType === "list" && { listType }),
    });
  };

  const handleDelete = () => {
    if (isDeleting) return;
    onDelete();
  }

  if (!collection) {
    return null;
  }

  return (
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader className="mb-1">
          <DialogTitle>Update {collectionTypeLabel} Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor={`update-name-${collection.id}`} className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`update-name-${collection.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${collectionType} name`}
              required
              autoFocus
              maxLength={nameMaxChars}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground text-right">
              {remainingNameChars} characters remaining
            </p>
            {!name.trim() && isOpen && ( /* Show validation only if open and invalid */
              <p className="text-xs text-red-500">Name is required.</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor={`update-description-${collection.id}`} className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id={`update-description-${collection.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description (optional)"
              maxLength={descriptionMaxChars}
              className="min-h-[100px] resize-none text-base"
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">
              {remainingDescriptionChars} characters remaining
            </p>
          </div>

          {/* Conditional List Type Radio Group */}
          {collectionType === "list" && (
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">List Type</Label>
              <RadioGroup
                value={listType}
                onValueChange={setListType}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {[
                  { value: "WISHLIST", label: "Wishlist", desc: "Items you want in your collection" },
                  { value: "WATCHLIST", label: "Watchlist", desc: "Items you want to keep an eye on" },
                  { value: "TRADE", label: "Trade", desc: "Items you want to trade" },
                  { value: "SELL", label: "Sell", desc: "Items you want to sell" },
                  { value: "GENERAL", label: "General", desc: "For any other categorization" },
                ].map((lt) => (
                  <div
                    key={lt.value}
                    className="flex items-start space-x-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:border-primary has-[input:checked]:bg-primary/10 cursor-pointer"
                  >
                    <RadioGroupItem
                      value={lt.value}
                      id={`update-list-type-${lt.value.toLowerCase()}-${collection.id}`}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor={`update-list-type-${lt.value.toLowerCase()}-${collection.id}`}
                      className="font-normal leading-tight -mt-0.5 w-full cursor-pointer"
                    >
                      {lt.label}
                      <p className="text-xs text-muted-foreground font-light">{lt.desc}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Visibility */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Visibility</Label>
            <RadioGroup
              value={visibility}
              onValueChange={setVisibility}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {[
                { value: "PRIVATE", label: "Private", desc: "Only you can see this" },
                { value: "PUBLIC", label: "Public", desc: "Visible to everyone" },
              ].map((v) => (
                <div
                  key={v.value}
                  className="flex items-start space-x-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:border-primary has-[input:checked]:bg-primary/10 cursor-pointer"
                >
                  <RadioGroupItem
                    value={v.value}
                    id={`update-visibility-${v.value.toLowerCase()}-${collection.id}`}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor={`update-visibility-${v.value.toLowerCase()}-${collection.id}`}
                    className="font-normal leading-tight -mt-0.5 w-full cursor-pointer"
                  >
                    {v.label}
                    <p className="text-xs text-muted-foreground font-light">{v.desc}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {submissionError && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-center">
              {submissionError}
            </p>
          )}

          <DialogFooter className="pt-6 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <div className="flex-grow-0 mb-2 sm:mb-0"> {/* Wrapper for delete button to align left */}
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full sm:w-auto"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : `Delete ${collectionTypeLabel}`}
                </Button>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:space-x-2"> {/* Wrapper for cancel/update buttons */}
                <DialogClose asChild>
                <Button type="button" variant="outline" className="text-muted-foreground w-full sm:w-auto mb-2 sm:mb-0">
                    Cancel
                </Button>
                </DialogClose>
                <Button type="submit" disabled={!isFormValid || isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Updating..." : `Update ${collectionTypeLabel}`}
                </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
  );
};

UpdateCollectionDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  collection: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    public: PropTypes.bool,
    listType: PropTypes.string,
  }),
  collectionType: PropTypes.oneOf(["list", "portfolio"]).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  isDeleting: PropTypes.bool,
  submissionError: PropTypes.string,
};

export default UpdateCollectionDialog;
