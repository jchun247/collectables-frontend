import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate, formatCardCondition, formatCardFinish } from "@/utils/textFormatters";

export const createTransactionLedgerColumns = ({ onEdit, onDelete, isOwner }) => {
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    {
    accessorKey: 'transactionType',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Type
        <ArrowUpDown className={`h-4 w-4 transition-transform duration-200 ${
          column.getIsSorted() === "asc" ? "transform rotate-180" : ""
        }`} />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue('transactionType');
      return (
        <span className={type === 'SELL' ? 'text-red-500' : 'text-green-500'}>
          {type === 'SELL' ? 'Sell' : 'Buy'}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'purchaseDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Date
        <ArrowUpDown className={`h-4 w-4 transition-transform duration-200 ${
          column.getIsSorted() === "asc" ? "transform rotate-180" : ""
        }`} />
      </Button>
    ),
    cell: ({ row }) => formatDate(row.getValue('purchaseDate')),
    enableSorting: true,
  },
  {
    accessorKey: 'condition',
    header: 'Condition',
    cell: ({ row }) => formatCardCondition(row.getValue('condition')),
    enableSorting: false,
  },
  {
    accessorKey: 'finish',
    header: 'Finish',
    cell: ({ row }) => formatCardFinish(row.getValue('finish')),
    enableSorting: false,
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        Quantity
        <ArrowUpDown className={`h-4 w-4 transition-transform duration-200 ${
          column.getIsSorted() === "asc" ? "transform rotate-180" : ""
        }`} />
      </Button>
    ),
    cell: ({ row }) => {
      const quantity = Math.abs(row.getValue('quantity'));
      const type = row.getValue('transactionType');
      return `${type === 'SELL' ? '-' : '+'}${quantity}`;
    },
    enableSorting: true,
  },
  ];

  if (isOwner) {
    columns.push(
      {
        accessorKey: 'costBasis',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
          >
            Cost Basis
            <ArrowUpDown className={`h-4 w-4 transition-transform duration-200 ${
              column.getIsSorted() === "asc" ? "transform rotate-180" : ""
            }`} />
          </Button>
        ),
        cell: ({ row }) => `$${row.original.costBasis.toFixed(2)}`,
        enableSorting: true,
      },
      {
        id: 'total',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
          >
            Total
            <ArrowUpDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${
              column.getIsSorted() === "asc" ? "transform rotate-180" : ""
            }`} />
          </Button>
        ),
        accessorFn: row => row.quantity * row.costBasis,
        cell: ({ row }) => {
          const originalRow = row.original;
          return `$${(originalRow.quantity * originalRow.costBasis).toFixed(2)}`;
        },
        enableSorting: true,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
                onClick={() => onEdit(row.original)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit transaction</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete transaction</span>
              </Button>
            </div>
          );
        },
        enableSorting: false,
      }
    );
  }

  // Hide select column for non-owners
  if (!isOwner) {
    return columns.filter(c => c.id !== 'select');
  }

  return columns;
};
