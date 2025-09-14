'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { useApi } from '@/hooks/useApi';

export default function FisheriesDataTable() {
  const { useFishTypes } = useApi();
  const { data, isLoading, error } = useFishTypes();

  if (isLoading) return <div>Loading fish types...</div>;
  if (error) return <div>Error loading fish types: {error.message}</div>;

  return (
    <DataTable
      columns={columns}
      data={data || []}
      searchKey="fishName"
      searchPlaceholder="Search fish types..."
    />
  );
}