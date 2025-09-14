'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useApi } from '@/hooks/useApi';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chartConfig = {
  kelawalla: { label: 'Yellowfin Tuna (Kelawalla)', color: 'hsl(var(--chart-1))' },
  thalapath: { label: 'Sailfish (Thalapath)', color: 'hsl(var(--chart-2))' },
  balaya: { label: 'Skipjack Tuna (Balaya)', color: 'hsl(var(--chart-3))' },
  paraw: { label: 'Trevally (Paraw)', color: 'hsl(var(--chart-4))' },
  salaya: { label: 'Sardinella (Salaya)', color: 'hsl(var(--chart-5))' },
  hurulla: { label: 'Herrings (Hurulla)', color: 'hsl(var(--chart-6))' },
  linna: { label: 'Indian Scad (Linna)', color: 'hsl(var(--chart-7))' },
} satisfies ChartConfig;

export default function AppAreaChart() {
  const { usePriceHistory } = useApi();
  const { data, isLoading } = usePriceHistory();
  const [timeRange, setTimeRange] = useState('30d');

  if (isLoading) return <div>Loading price history...</div>;

  const filteredData = data?.filter((item) => {
    const date = new Date(item.priceDate);
    const referenceDate = new Date();
    let daysToSubtract = 30;
    if (timeRange === '14d') daysToSubtract = 14;
    else if (timeRange === '7d') daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  }).map((item) => ({
    date: item.priceDate,
    [item.fishType.fishName.toLowerCase().replace(/ /g, '_')]: Number(item.retailPrice),
  }));

  return (
    <div className="@container/card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-medium">Fish Prices</h1>
          <p className="text-muted-foreground">Retail Price Trends</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="14d">Last 14 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
        <AreaChart accessibilityLayer data={filteredData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => formatDate(value)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => formatCurrency(value).split('.')[0]}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => {
                  const numericValue = Array.isArray(value) ? value[0] : value;
                  return formatCurrency(Number(numericValue));
                }}
              />
            }
          />
          {Object.keys(chartConfig).map((key) => (
            <Area
              key={key}
              dataKey={key}
              type="natural"
              fill={`url(#fill${key})`}
              stroke={`hsl(var(--color-${key}))`}
              stackId="a"
            />
          ))}
          <defs>
            {Object.keys(chartConfig).map((key) => (
              <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`hsl(var(--color-${key}))`} stopOpacity={0.8} />
                <stop offset="95%" stopColor={`hsl(var(--color-${key}))`} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
        </AreaChart>
      </ChartContainer>
    </div>
  );
}