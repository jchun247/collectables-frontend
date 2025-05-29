import { MoreHorizontal } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CardSettingsMenu({ 
  cardId,
  onRemove
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(`/cards/${cardId}`)}>
          Card Details Page
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 dark:text-red-400"
          onClick={() => {
            setIsOpen(false);
            onRemove();
          }}
        >
          Remove card from collection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

CardSettingsMenu.propTypes = {
  cardId: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default CardSettingsMenu;
