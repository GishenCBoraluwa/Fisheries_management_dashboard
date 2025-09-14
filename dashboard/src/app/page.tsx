'use client';
import { useApi } from '@/hooks/useApi';
import { DashboardStats } from '@/components/DashboardStats';
import { RevenueChart } from '@/components/RevenueChart';
import { TruckStatus } from '@/components/TruckStatus';
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings, Wifi, WifiOff } from 'lucide-react';
import CardList from '@/components/CardList';
import AppAreaChart from '@/components/AppAreaChart';
import AppPieChart from '@/components/AppPieChart';
import { useRealTime } from '@/hooks/useRealtime';

export default function Dashboard() {
  const { isConnected, hasRecentUpdate, reconnect } = useRealTime();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between border-b bg-muted/20 p-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Dashboard Overview</h2>
          {isConnected ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-sm">Live Updates</span>
              {hasRecentUpdate && <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-red-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm">Offline</span>
              </div>
              <Button variant="outline" size="sm" onClick={reconnect}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
          <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
            <RevenueChart />
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg">
            <CardList title="Latest Transactions" />
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg">
            <CardList title="Pending Orders" />
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg">
            <TruckStatus />
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
            <AppAreaChart />
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg">
            <AppPieChart />
          </div>
        </div>
      </div>
    </div>
  );
}