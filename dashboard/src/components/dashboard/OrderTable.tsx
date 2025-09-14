'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Eye, 
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePendingOrders, useLatestTransactions } from "@/hooks/api/useOrders";
import { useOrdersFilter } from "@/lib/store";
import { formatCurrency, formatDateTime, formatRelativeTime, getStatusColor, truncateText } from "@/lib/utils";
import { Order } from "@/types/api";

interface OrdersTableProps {
  variant?: 'pending' | 'transactions';
}

export function OrdersTable({ variant = 'pending' }: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);

  const { statusFilter, setStatusFilter } = useOrdersFilter();

  // Fetch data based on variant
  const { 
    data: pendingData, 
    isLoading: pendingLoading, 
    error: pendingError 
  } = usePendingOrders({ limit: pageSize }, { enabled: variant === 'pending' });

  const { 
    data: transactionsData, 
    isLoading: transactionsLoading, 
    error: transactionsError 
  } = useLatestTransactions({ limit: pageSize }, { enabled: variant === 'transactions' });

  const data = variant === 'pending' ? pendingData?.orders || [] : transactionsData?.orders || [];
  const isLoading = variant === 'pending' ? pendingLoading : transactionsLoading;
  const error = variant === 'pending' ? pendingError : transactionsError;
  const pagination = variant === 'pending' ? pendingData?.pagination : transactionsData?.pagination;

  // Define columns
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Order ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">#{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'user',
      header: 'Customer',
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div>
            <div className="font-medium">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              {user?.phoneNumber}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'orderItems',
      header: 'Items',
      cell: ({ row }) => {
        const items = row.original.orderItems || [];
        const itemCount = items.length;
        const firstItem = items[0];
        
        return (
          <div className="max-w-48">
            {itemCount > 0 && (
              <>
                <div className="font-medium">
                  {truncateText(firstItem?.fishType?.fishName || 'Unknown', 20)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {firstItem?.quantityKg}kg
                  {itemCount > 1 && (
                    <span className="ml-1">+{itemCount - 1} more</span>
                  )}
                </div>
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(parseFloat(row.getValue('totalAmount')), 'LKR')}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge className={getStatusColor(status)}>
            {status.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'orderDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {formatDateTime(row.getValue('orderDate'))}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatRelativeTime(row.getValue('orderDate'))}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'deliveryDate',
      header: 'Delivery',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {formatDateTime(row.getValue('deliveryDate'))}
          </div>
          <div className="text-sm text-muted-foreground capitalize">
            {row.original.deliveryTimeSlot}
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const order = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {variant === 'pending' && (
                <>
                  <DropdownMenuItem>
                    Edit Order
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Cancel Order
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Orders Error</CardTitle>
          <CardDescription>Failed to load orders data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Unable to load orders. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {variant === 'pending' ? 'Pending Orders' : 'Recent Transactions'}
            </CardTitle>
            <CardDescription>
              {variant === 'pending' 
                ? 'Orders waiting for processing and fulfillment'
                : 'Completed and delivered orders'
              }
            </CardDescription>
          </div>
          
          {!isLoading && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              
              {variant === 'pending' && (
                <Select
                  value={statusFilter.join(',')}
                  onValueChange={(value) => setStatusFilter(value ? value.split(',') : [])}
                >
                  <SelectTrigger className="w-32">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-4">
            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
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
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
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
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {table.getPageCount() > 1 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      table.getFilteredRowModel().rows.length
                    )}{' '}
                    of {table.getFilteredRowModel().rows.length} entries
                  </span>
                  
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      table.setPageSize(Number(value));
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <span className="flex items-center gap-1 text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}