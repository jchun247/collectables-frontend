import { MoreVertical } from 'lucide-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ListCardSettingsMenu({ 
  onEdit,
  onRemove
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 rounded-md bg-slate-900/50 hover:bg-slate-900/75 text-white">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => {
          setIsOpen(false);
          onEdit();
        }}>
          Edit Card
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 dark:text-red-400"
          onClick={() => {
            setIsOpen(false);
            onRemove();
          }}
        >
          Remove card from list
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

ListCardSettingsMenu.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default ListCardSettingsMenu;
