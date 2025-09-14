import { ColumnDef } from '@tanstack/react-table';
import { PriceHistory } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export const columns: ColumnDef<PriceHistory>[] = [
  {
    accessorKey: 'id',
    header: 'Price ID',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'fishType',
    header: 'Fish Type',
    cell: ({ row }) => row.original.fishType.fishName,
  },
  {
    accessorKey: 'retailPrice',
    header: 'Retail Price',
    cell: ({ row }) => formatCurrency(row.getValue('retailPrice')),
  },
  {
    accessorKey: 'wholesalePrice',
    header: 'Wholesale Price',
    cell: ({ row }) => formatCurrency(row.getValue('wholesalePrice')),
  },
  {
    accessorKey: 'marketDemandLevel',
    header: 'Demand',
    cell: ({ row }) => {
      const demandLevel = row.getValue('marketDemandLevel') as 'low' | 'medium' | 'high';
      return (
        <Badge
          className={cn(
            demandLevel === 'high' && 'bg-green-100 text-green-800',
            demandLevel === 'medium' && 'bg-yellow-100 text-yellow-800',
            demandLevel === 'low' && 'bg-red-100 text-red-800'
          )}
        >
          {demandLevel.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'priceDate',
    header: 'Date',
    cell: ({ row }) => formatDate(row.getValue('priceDate')),
  },
];