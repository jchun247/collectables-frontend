import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const CreateCollectionDialog = ({ isOpen, onClose, type, onSubmit, isSubmitting, submissionError}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [listType, setListType] = useState("GENERAL");

  const remainingChars = 1000 - description.length;
  const isFormValid = name.trim() !== "";

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setVisibility("PRIVATE");
      setListType("GENERAL");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    onSubmit({
      name,
      description,
      visibility,
      ...(type === "list" && { listType }),
    });
  };

  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader className="mb-1">
          <DialogTitle>Create a new {type === "list" ? "List" : "Portfolio"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2 pb-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${type === "list" ? "list" : "portfolio"} name`}
              required
              autofocus
              className="text-base"
            />
            {!name.trim() && <p className="text-xs text-red-500">Name is required.</p>}
          </div>
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description (optional)"
              maxLength={1000}
              className="min-h-[100px] resize-none text-base"
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right">
              {remainingChars} characters remaining
            </p>
          </div>
          {/* Conditional List Type Radio Group */}
          {type === "list" && (
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
                ].map(lt => (
                  <div key={lt.value} className="flex items-start space-x-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                    <RadioGroupItem value={lt.value} id={`list-type-${lt.value.toLowerCase()}`} className="mt-0.5"/>
                    <Label htmlFor={`list-type-${lt.value.toLowerCase()}`} className="font-normal leading-tight -mt-0.5">
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
              ].map(v => (
                 <div key={v.value} className="flex items-start space-x-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:border-primary has-[input:checked]:bg-primary/10">
                    <RadioGroupItem value={v.value} id={`visibility-${v.value}`}  className="mt-0.5" />
                    <Label htmlFor={`visibility-${v.value}`} className="font-normal leading-tight -mt-0.5">
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
          {/* Dialog Footer */}
          <DialogFooter className="pt-6 sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="text-muted-foreground"> {/* Ghost for subtle cancel */}
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Creating..." : `Create ${type === "list" ? "List" : "Portfolio"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

CreateCollectionDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["list", "portfolio"]).isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  submissionError: PropTypes.string,
};

export default CreateCollectionDialog;
