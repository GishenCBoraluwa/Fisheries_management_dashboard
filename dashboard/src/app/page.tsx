'use client';

import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TruckStatus } from "@/components/dashboard/TruckStatus";
import { useRealTime } from "@/hooks/useRealTime";
import { useDashboardSettings } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Wifi, WifiOff } from "lucide-react";

export default function Home() {
  const { isConnected, hasRecentUpdate, reconnect } = useRealTime();
  const { isRealTimeEnabled, toggleRealTime } = useDashboardSettings();

  return (
    <>
      {/* Real-time status bar */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Dashboard Overview</h2>
          {isConnected ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-sm">Live Updates</span>
              {hasRecentUpdate && (
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              )}
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
          <Button 
            variant={isRealTimeEnabled ? "default" : "outline"} 
            size="sm" 
            onClick={toggleRealTime}
          >
            {isRealTimeEnabled ? "Real-time On" : "Real-time Off"}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Enhanced Section Cards with real API data */}
            <div className="px-4 lg:px-6">
              <DashboardStats />
            </div>
            
            {/* Interactive Chart Area */}
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 p-6">
        {/* Revenue Chart - Enhanced with real data */}
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <RevenueChart />
        </div>
        
        {/* Latest Transactions */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Latest Transactions" />
        </div>
        
        {/* Pending Orders */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <CardList title="Pending Orders" />
        </div>
        
        {/* Truck Status - Real-time fleet management */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <TruckStatus />
        </div>
        
        {/* Area Chart */}
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppAreaChart />
        </div>
        
        {/* Pie Chart */}
        <div className="bg-primary-foreground p-4 rounded-lg">
          <AppPieChart />
        </div>
      </div>
    </>
  );
}