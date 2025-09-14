'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useApi } from '@/hooks/useApi';
import { formatCurrency } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chartConfig = {
  currentYear: {
    label: 'Current Year',
    color: 'hsl(var(--chart-1))',
  },
  previousYear: {
    label: 'Previous Year',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const { useRevenueData } = useApi();
  const { data, isLoading } = useRevenueData();
  const [timeRange, setTimeRange] = useState('12m');

  if (isLoading) return <div>Loading revenue data...</div>;

  const filteredData = data?.slice(0, timeRange === '6m' ? 6 : 12);

  return (
    <div className="@container/card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-medium">Revenue Comparison</h1>
          <p className="text-muted-foreground">Current vs Previous Year</p>
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
        <AreaChart accessibilityLayer data={filteredData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => formatCurrency(value).split('.')[0]}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={(value) => {
                  const numericValue = Array.isArray(value) ? value[0] : value;
                  return formatCurrency(Number(numericValue));
                }}
              />
            }
          />
          <Area
            dataKey="currentYear"
            type="natural"
            fill="url(#fillCurrentYear)"
            stroke="hsl(var(--color-currentYear))"
            stackId="a"
          />
          <Area
            dataKey="previousYear"
            type="natural"
            fill="url(#fillPreviousYear)"
            stroke="hsl(var(--color-previousYear))"
            stackId="a"
          />
          <defs>
            <linearGradient id="fillCurrentYear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--color-currentYear))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--color-currentYear))" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillPreviousYear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--color-previousYear))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--color-previousYear))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ChartContainer>
    </div>
  );
}