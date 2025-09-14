'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { useApi } from '@/hooks/useApi';
import { useState } from 'react';

export default function UsersDataTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { useUsers } = useApi();
  const { data, isLoading, error } = useUsers(page, limit);

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <DataTable
      columns={columns}
      data={data?.users || []}
      searchKey="email"
      searchPlaceholder="Search users..."
      pagination={data?.pagination}
      onPageChange={setPage}
      onLimitChange={setLimit}
    />
  );
}