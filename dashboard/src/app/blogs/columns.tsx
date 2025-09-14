import { ColumnDef } from '@tanstack/react-table';
import { BlogPost } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export const columns: ColumnDef<BlogPost>[] = [
  {
    accessorKey: 'id',
    header: 'Post ID',
    cell: ({ row }) => `#${row.getValue('id')}`,
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as 'policy' | 'climate_change' | 'overfishing' | 'iuu_fishing';
      return <Badge variant="outline">{category.toUpperCase()}</Badge>;
    },
  },
  {
    accessorKey: 'author',
    header: 'Author',
  },
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.getValue('isPublished') ? 'default' : 'destructive'}>
        {row.getValue('isPublished') ? 'Published' : 'Draft'}
      </Badge>
    ),
  },
  {
    accessorKey: 'publishedAt',
    header: 'Published Date',
    cell: ({ row }) => formatDate(row.getValue('publishedAt')),
  },
  {
    accessorKey: 'readCount',
    header: 'Reads',
  },
];