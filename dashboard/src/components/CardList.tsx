'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks/useApi';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export default function CardList({ title }: { title: string }) {
  const { usePendingOrders, useLatestTransactions } = useApi();
  const { data: pendingData } = usePendingOrders();
  const { data: transactionsData } = useLatestTransactions();

  const list = title === 'Pending Orders' ? pendingData?.orders : transactionsData?.orders;

  if (!list) return <div>Loading {title.toLowerCase()}...</div>;

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {list?.map((item) => (
          <Card key={item.id} className="flex-row items-center justify-between gap-4 p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-sm font-medium">Order #{item.id}</CardTitle>
              <p className="text-xs text-muted-foreground">{formatDate(item.orderDate)}</p>
            </CardHeader>
            <CardContent className="p-0">
              <Badge
                className={cn(
                  item.status === 'completed' && 'bg-green-100 text-green-800',
                  item.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                  item.status === 'delivered' && 'bg-blue-100 text-blue-800',
                  item.status === 'cancelled' && 'bg-red-100 text-red-800'
                )}
              >
                {item.status.toUpperCase()}
              </Badge>
            </CardContent>
            <CardContent className="p-0">
              {formatCurrency(item.totalAmount)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}