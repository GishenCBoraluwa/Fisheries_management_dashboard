import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'user',
    header: 'Customer',
    cell: ({ row }) => {
      const user = row.original.user;
      return `${user.firstName} ${user.lastName}`;
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.getValue('totalAmount')),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          className={cn(
            status === 'completed' && 'bg-green-100 text-green-800',
            status === 'pending' && 'bg-yellow-100 text-yellow-800',
            status === 'delivered' && 'bg-blue-100 text-blue-800',
            status === 'cancelled' && 'bg-red-100 text-red-800'
          )}
        >
          {status.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'orderDate',
    header: 'Order Date',
    cell: ({ row }) => formatDate(row.getValue('orderDate')),
  },
  {
    accessorKey: 'deliveryAddress',
    header: 'Delivery Address',
  },
];