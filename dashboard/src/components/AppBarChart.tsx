'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useApi } from '@/hooks/useApi';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chartConfig = {
  sales: {
    label: 'Sales (kg)',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function AppBarChart() {
  const { useFishSales } = useApi();
  const { data, isLoading } = useFishSales();
  const [timeRange, setTimeRange] = useState('12m');

  if (isLoading) return <div>Loading sales data...</div>;

  const filteredData = data?.slice(0, timeRange === '6m' ? 6 : 12);

  return (
    <div className="@container/card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-medium">Fish Sales</h1>
          <p className="text-muted-foreground">Monthly Sales Volume</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Last 12 months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12m">Last 12 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={filteredData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value} kg`} />} />
          <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}