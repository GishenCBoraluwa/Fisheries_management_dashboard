'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { useApi } from '@/hooks/useApi';

export default function VehiclesDataTable() {
  const { useTrucks } = useApi();
  const { data, isLoading, error } = useTrucks();

  if (isLoading) return <div>Loading vehicles...</div>;
  if (error) return <div>Error loading vehicles: {error.message}</div>;

  return (
    <DataTable
      columns={columns}
      data={data || []}
      searchKey="licensePlate"
      searchPlaceholder="Search vehicles..."
    />
  );
}