'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Users, DollarSign, Truck, UserPlus } from "lucide-react";
import { useDashboardStats } from "@/hooks/api/useDashboard";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  isLoading?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

function StatCard({ title, value, change, icon, isLoading, trend, description }: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    if (!change) return null;
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : trend === 'down' ? (
      <TrendingDown className="h-4 w-4 text-red-600" />
    ) : null;
  };

  const getTrendColor = () => {
    if (!change) return 'text-muted-foreground';
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`text-xs flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{formatPercentage(Math.abs(change))} from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-red-200">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <p className="text-sm">Failed to load stats</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getRevenueTrend = () => {
    if (!stats?.revenueGrowth) return 'neutral';
    return stats.revenueGrowth > 0 ? 'up' : stats.revenueGrowth < 0 ? 'down' : 'neutral';
  };

  const getActiveAccountsTrend = () => {
    if (!stats?.activeAccountsGrowth) return 'neutral';
    return stats.activeAccountsGrowth > 0 ? 'up' : stats.activeAccountsGrowth < 0 ? 'down' : 'neutral';
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={stats ? formatCurrency(stats.totalRevenue, 'LKR') : ''}
          change={stats?.revenueGrowth}
          trend={getRevenueTrend()}
          icon={<DollarSign className="h-4 w-4" />}
          isLoading={isLoading}
          description="Monthly revenue"
        />

        <StatCard
          title="Active Accounts"
          value={stats?.activeAccounts || 0}
          change={stats?.activeAccountsGrowth}
          trend={getActiveAccountsTrend()}
          icon={<Users className="h-4 w-4" />}
          isLoading={isLoading}
          description="Users with orders in last 30 days"
        />

        <StatCard
          title="New Customers"
          value={stats?.newCustomers || 0}
          icon={<UserPlus className="h-4 w-4" />}
          isLoading={isLoading}
          description="New registrations this month"
        />

        <StatCard
          title="Ongoing Deliveries"
          value={stats?.ongoingTrucks || 0}
          icon={<Truck className="h-4 w-4" />}
          isLoading={isLoading}
          description="Trucks currently in transit"
        />
      </div>

      {/* Additional insights */}
      {stats && !isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Growth Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Revenue Growth</span>
                  <Badge variant={stats.revenueGrowth > 0 ? 'default' : 'secondary'}>
                    {formatPercentage(stats.revenueGrowth)}
                  </Badge>
                </div>
                <Progress 
                  value={Math.min(Math.abs(stats.revenueGrowth), 100)} 
                  className="h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>User Base Growth</span>
                  <Badge variant={stats.activeAccountsGrowth > 0 ? 'default' : 'secondary'}>
                    {formatPercentage(stats.activeAccountsGrowth)}
                  </Badge>
                </div>
                <Progress 
                  value={Math.min(Math.abs(stats.activeAccountsGrowth), 100)} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Operational Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fleet Utilization</span>
                <span className="text-sm font-medium">
                  {stats.ongoingTrucks > 0 ? `${stats.ongoingTrucks} active` : 'All available'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer Engagement</span>
                <span className="text-sm font-medium">
                  {stats.activeAccounts > 0 ? 'Active' : 'Low'}
                </span>
              </div>

              {stats.newCustomers > 10 && (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-700">
                    Strong customer acquisition this month
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}