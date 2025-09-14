'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { useApi } from '@/hooks/useApi';
import { useState } from 'react';

export default function OrdersDataTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { usePendingOrders } = useApi();
  const { data, isLoading, error } = usePendingOrders(page, limit);

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <DataTable
      columns={columns}
      data={data?.orders || []}
      searchKey="id"
      searchPlaceholder="Search orders..."
      pagination={data?.pagination}
      onPageChange={setPage}
      onLimitChange={setLimit}
    />
  );
}