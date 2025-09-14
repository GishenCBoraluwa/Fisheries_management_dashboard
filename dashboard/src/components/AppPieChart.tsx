'use client';

import { Label, Pie, PieChart } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useApi } from '@/hooks/useApi';

const chartConfig = {
  orders: {
    label: 'Orders',
    color: 'var(--chart-1)',
  },
  pending: {
    label: 'Pending',
    color: 'var(--chart-2)',
  },
  delivered: {
    label: 'Delivered',
    color: 'var(--chart-3)',
  },
  completed: {
    label: 'Completed',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

export default function AppPieChart() {
  const { usePendingOrders, useLatestTransactions } = useApi();
  const { data: pendingData } = usePendingOrders();
  const { data: transactionsData } = useLatestTransactions();

  const chartData = [
    { status: 'pending', count: pendingData?.orders.length || 0, fill: 'var(--color-pending)' },
    { status: 'delivered', count: transactionsData?.orders.filter((o) => o.status === 'delivered').length || 0, fill: 'var(--color-delivered)' },
    { status: 'completed', count: transactionsData?.orders.filter((o) => o.status === 'completed').length || 0, fill: 'var(--color-completed)' },
  ];

  const totalOrders = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Order Status Distribution</h1>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                        {totalOrders.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                        Orders
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}