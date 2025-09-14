'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { useRevenueComparison, useFishSalesData } from "@/hooks/api/useDashboard";
import { useDashboardSettings } from "@/lib/store";
import { formatCurrency, formatWeight } from "@/lib/utils";
import { TrendingUp, BarChart3, LineChart as LineChartIcon } from "lucide-react";
import { useState } from "react";

type ChartType = 'line' | 'bar';

export function RevenueChart() {
  const [chartType, setChartType] = useState<ChartType>('line');
  const { selectedTimeRange, setSelectedTimeRange } = useDashboardSettings();
  
  const { 
    data: revenueData, 
    isLoading: revenueLoading, 
    error: revenueError 
  } = useRevenueComparison();
  
  const { 
    data: salesData, 
    isLoading: salesLoading 
  } = useFishSalesData();

  if (revenueError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Revenue Chart Error</CardTitle>
          <CardDescription>Failed to load revenue data</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>Unable to display chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Combine revenue and sales data
  const combinedData = revenueData?.map((revenue, index) => ({
    ...revenue,
    sales: salesData?.[index]?.sales || 0,
  })) || [];

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Revenue & Sales Overview
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardTitle>
            <CardDescription>
              Monthly comparison of revenue and fish sales volume
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={chartType} 
              onValueChange={(value: ChartType) => setChartType(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">
                  <div className="flex items-center gap-2">
                    <LineChartIcon className="h-4 w-4" />
                    Line
                  </div>
                </SelectItem>
                <SelectItem value="bar">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Bar
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={selectedTimeRange} 
              onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setSelectedTimeRange(value)}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {revenueLoading || salesLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-4">
            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      yAxisId="revenue"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    />
                    <YAxis 
                      yAxisId="sales"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(value) => `${value}kg`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'currentYear' || name === 'previousYear' 
                          ? formatCurrency(Number(value), 'LKR')
                          : formatWeight(Number(value)),
                        name === 'currentYear' ? 'Current Year Revenue' 
                        : name === 'previousYear' ? 'Previous Year Revenue'
                        : 'Fish Sales'
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="revenue"
                      type="monotone" 
                      dataKey="currentYear" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      name="Current Year"
                    />
                    <Line 
                      yAxisId="revenue"
                      type="monotone" 
                      dataKey="previousYear" 
                      stroke="#94a3b8" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#94a3b8', strokeWidth: 2, r: 3 }}
                      name="Previous Year"
                    />
                    <Line 
                      yAxisId="sales"
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      name="Fish Sales (kg)"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#e2e8f0' }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        formatCurrency(Number(value), 'LKR'),
                        name === 'currentYear' ? 'Current Year' : 'Previous Year'
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="currentYear" 
                      fill="#3b82f6" 
                      name="Current Year"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar 
                      dataKey="previousYear" 
                      fill="#94a3b8" 
                      name="Previous Year"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Summary Cards */}
            {combinedData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                      combinedData.reduce((sum, item) => sum + item.currentYear, 0),
                      'LKR'
                    )}
                  </div>
                  <div className="text-sm text-blue-700">Total Current Year Revenue</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {formatCurrency(
                      combinedData.reduce((sum, item) => sum + item.previousYear, 0),
                      'LKR'
                    )}
                  </div>
                  <div className="text-sm text-gray-700">Total Previous Year Revenue</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatWeight(
                      combinedData.reduce((sum, item) => sum + (item.sales || 0), 0)
                    )}
                  </div>
                  <div className="text-sm text-green-700">Total Fish Sales</div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}