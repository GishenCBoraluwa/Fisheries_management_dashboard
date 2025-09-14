'use client';

import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { useApi } from '@/hooks/useApi';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AnalysisDataTable() {
  const [fishTypeId, setFishTypeId] = useState<number | undefined>(undefined);
  const [days, setDays] = useState(30);
  const { usePriceHistory, useFishTypes } = useApi();
  const { data, isLoading, error } = usePriceHistory(fishTypeId, days);
  const { data: fishTypes } = useFishTypes();

  if (isLoading) return <div>Loading price history...</div>;
  if (error) return <div>Error loading price history: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Select value={fishTypeId?.toString()} onValueChange={(value) => setFishTypeId(value ? Number(value) : undefined)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Fish Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="undefined">All Fish Types</SelectItem>
            {fishTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.fishName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={days.toString()} onValueChange={(value) => setDays(Number(value))}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        columns={columns}
        data={data || []}
        searchKey="fishType.fishName"
        searchPlaceholder="Search fish types..."
      />
    </div>
  );
}