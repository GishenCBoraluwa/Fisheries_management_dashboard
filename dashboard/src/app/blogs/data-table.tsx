'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { useApi } from '@/hooks/useApi';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BlogsDataTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { useBlogPosts } = useApi();
  const { data, isLoading, error } = useBlogPosts(category, page, limit);

  if (isLoading) return <div>Loading blog posts...</div>;
  if (error) return <div>Error loading blog posts: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="undefined">All Categories</SelectItem>
            <SelectItem value="climate_change">Climate Change</SelectItem>
            <SelectItem value="overfishing">Overfishing</SelectItem>
            <SelectItem value="iuu_fishing">IUU Fishing</SelectItem>
            <SelectItem value="policy">Policy</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data?.posts || []}
        searchKey="title"
        searchPlaceholder="Search blog posts..."
        pagination={data?.pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
}