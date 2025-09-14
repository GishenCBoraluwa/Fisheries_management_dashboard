import { ColumnDef } from '@tanstack/react-table';
import { Truck } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<Truck>[] = [
  {
    accessorKey: 'id',
    header: 'Truck ID',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'licensePlate',
    header: 'License Plate',
  },
  {
    accessorKey: 'capacityKg',
    header: 'Capacity (kg)',
  },
  {
    accessorKey: 'availabilityStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('availabilityStatus') as string;
      return (
        <Badge
          className={cn(
            status === 'in_transit' && 'bg-blue-100 text-blue-800',
            status === 'available' && 'bg-green-100 text-green-800',
            status === 'maintenance' && 'bg-yellow-100 text-yellow-800'
          )}
        >
          {status.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'driver',
    header: 'Driver',
    cell: ({ row }) => row.original.driver.driverName,
  },
];