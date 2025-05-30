import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, AlertTriangle, ListOrdered } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function TransactionLedgerTable({
  data = [],
  columns,
  isLoading = false,
  error = null,
  sorting = [],
  setSorting,
  rowSelection = {},
  setRowSelection,
  pagination,
  setPagination,
  onDeleteSelected,
}) {
  const tableInstance = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedRows = tableInstance.getFilteredSelectedRowModel()?.rows || [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Transaction Ledger</h2>
        {selectedRows.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteSelected(selectedRows.map(row => row.original))}
          >
            Delete {selectedRows.length} transaction{selectedRows.length > 1 ? 's' : ''}
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
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                <AlertTriangle className="h-8 w-8 mx-auto" /> {error}
              </TableCell>
            </TableRow>
          ) : tableInstance.getRowModel().rows?.length > 0 ? (
            tableInstance.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="px-6 py-3 text-left">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-48 text-center text-slate-500">
                <ListOrdered className="h-12 w-12 mx-auto mb-2" /> No transactions recorded.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* --- Pagination Controls --- */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-slate-500">
          {selectedRows.length} of {tableInstance.getPreFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows</p>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => tableInstance.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20].map(size => <SelectItem key={size} value={`${size}`}>{size}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm font-medium">
            Page {pagination.pageIndex + 1} of {tableInstance.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => tableInstance.setPageIndex(0)} disabled={!tableInstance.getCanPreviousPage()}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => tableInstance.previousPage()} disabled={!tableInstance.getCanPreviousPage()}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => tableInstance.nextPage()} disabled={!tableInstance.getCanNextPage()}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => tableInstance.setPageIndex(tableInstance.getPageCount() - 1)} disabled={!tableInstance.getCanNextPage()}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

TransactionLedgerTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    accessorKey: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    cell: PropTypes.func
  })).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  sorting: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    desc: PropTypes.bool
  })),
  setSorting: PropTypes.func.isRequired,
  rowSelection: PropTypes.object,
  setRowSelection: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number
  }).isRequired,
  setPagination: PropTypes.func.isRequired,
  onDeleteSelected: PropTypes.func.isRequired
};

export default TransactionLedgerTable;
