import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';
import UpdateTransactionDialog from './UpdateTransactionDialog';
import { Loader2, AlertTriangle, ListOrdered, ChevronsLeft, ChevronLeft, ChevronsRight, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { transactionHistoryTableColumns } from '@/components/tables/columns';

function TransactionHistoryTable({ 
  transactionHistory, 
  isLoading = false, 
  error = null,
  onEdit = () => {},
  onDelete = () => {},
  collectionId 
}) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { getAccessTokenSilently } = useAuth0();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogSubmissionError, setDialogSubmissionError] = useState(null);

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async (updatedTransaction) => {
    setIsSubmitting(true);
    setDialogSubmissionError(null);

    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${apiBaseUrl}/collections/${collectionId}/transactions/${updatedTransaction.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTransaction),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      const updatedData = await response.json();
      onEdit(updatedData);
      setIsUpdateDialogOpen(false);
    } catch (error) {
      setDialogSubmissionError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = transactionHistoryTableColumns({ 
    onEdit: handleEdit, 
    onDelete 
  });

  const tableInstance = useReactTable({
    data: transactionHistory.items || [],
    columns,
    state: {
      sorting,
      pagination,
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transaction History</h2>
        {Object.keys(rowSelection).length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="ml-4"
            onClick={() => onDelete(
              tableInstance
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)
            )}
          >
            Delete {Object.keys(rowSelection).length} transaction{Object.keys(rowSelection).length === 1 ? '' : 's'}
          </Button>
        )}
      </div>
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-700">
          {tableInstance.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-600 dark:text-sky-500" />
                  <span className="ml-2 text-slate-500 dark:text-slate-400">Loading history...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-red-500 dark:text-red-400">
                  <AlertTriangle className="h-8 w-8 mb-2 shrink-0" />
                  <span>{error}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : tableInstance.getRowModel().rows?.length > 0 ? (
            tableInstance.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <div className="py-12">
                  <ListOrdered className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    No Transactions Yet
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    There&apos;s no transaction history recorded for this card.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex-1 text-sm text-slate-500 dark:text-slate-400">
          {Object.keys(rowSelection).length} of{" "}
          {tableInstance.getPreFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${tableInstance.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                tableInstance.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={tableInstance.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {tableInstance.getState().pagination.pageIndex + 1} of{' '}
            {tableInstance.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => tableInstance.setPageIndex(0)}
              disabled={!tableInstance.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => tableInstance.previousPage()}
              disabled={!tableInstance.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => tableInstance.nextPage()}
              disabled={!tableInstance.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => tableInstance.setPageIndex(tableInstance.getPageCount() - 1)}
              disabled={!tableInstance.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <UpdateTransactionDialog
        isOpen={isUpdateDialogOpen}
        transaction={selectedTransaction}
        onSubmit={handleUpdateSubmit}
        isSubmitting={isSubmitting}
        submissionError={dialogSubmissionError}
        onClose={() => setIsUpdateDialogOpen(false)}
      />
    </div>
  );
}

TransactionHistoryTable.propTypes = {
  transactionHistory: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      quantity: PropTypes.number,
      costBasis: PropTypes.number,
    })).isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  collectionId: PropTypes.number.isRequired,
};

export default TransactionHistoryTable;
