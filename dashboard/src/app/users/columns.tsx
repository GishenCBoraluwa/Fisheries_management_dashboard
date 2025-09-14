import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'User ID',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'firstName',
    header: 'Name',
    cell: ({ row }) => `${row.getValue('firstName')} ${row.getValue('lastName')}`,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.getValue('isActive') ? 'default' : 'destructive'}>
        {row.getValue('isActive') ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'registrationDate',
    header: 'Registered',
    cell: ({ row }) => formatDate(row.getValue('registrationDate')),
  },
];