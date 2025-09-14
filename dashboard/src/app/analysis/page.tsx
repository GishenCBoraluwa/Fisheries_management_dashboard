'use client';

import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardStats, useRevenueComparison, useFishSalesData } from "@/hooks/api/useDashboard";
import { usePriceHistory, useCurrentPredictions } from "@/hooks/api/usePricing";
import { useWeatherForecasts } from "@/hooks/api/useWeather";
import { useDashboardSettings } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Download } from "lucide-react";
import { formatCurrency, formatWeight } from "@/lib/utils";

export default function AnalysisPage() {
  const { selectedTimeRange, setSelectedTimeRange } = useDashboardSettings();
  const { data: stats } = useDashboardStats();
  const { data: revenueData } = useRevenueComparison();
  const { data: salesData } = useFishSalesData();
  const { data: priceData } = usePriceHistory();
  const { data: predictions } = useCurrentPredictions();
  const { data: weatherData } = useWeatherForecasts();

  const pieChartData = salesData?.map((item, index) => ({
    name: item.month,
    value: item.sales,
    fill: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][index % 5]
  })) || [];

  const priceAnalysisData = priceData?.prices?.slice(0, 10).map(price => ({
    date: new Date(price.priceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    retail: parseFloat(price.retailPrice),
    wholesale: parseFloat(price.wholesalePrice),
    fishName: price.fishType?.fishName || 'Unknown'
  })) || [];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of fisheries data and trends
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={selectedTimeRange} 
            onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setSelectedTimeRange(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <DashboardStats />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Price Analysis</TabsTrigger>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueChart />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Sales Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${formatWeight(value)}`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatWeight(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Price Trends Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `${value.toLocaleString()}`} />
                      <Tooltip 
                        formatter={(value, name) => [
                          formatCurrency(Number(value), 'LKR'),
                          name === 'retail' ? 'Retail Price' : 'Wholesale Price'
                        ]}
                      />
                      <Bar dataKey="retail" fill="#3b82f6" name="retail" />
                      <Bar dataKey="wholesale" fill="#10b981" name="wholesale" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Retail Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {priceData?.stats ? formatCurrency(priceData.stats.averageRetailPrice, 'LKR') : 'Loading...'}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {priceData?.stats?.trend === 'increasing' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : priceData?.stats?.trend === 'decreasing' ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : null}
                    <span className="capitalize">{priceData?.stats?.trend || 'stable'} trend</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Average Wholesale Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {priceData?.stats ? formatCurrency(priceData.stats.averageWholesalePrice, 'LKR') : 'Loading...'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Variability: {priceData?.stats?.priceVariability.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {priceData?.prices?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Price records analyzed
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}kg`} />
                      <Tooltip formatter={(value) => [formatWeight(Number(value)), 'Sales Volume']} />
                      <Bar dataKey="sales" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Total Sales</div>
                    <div className="text-2xl font-bold">
                      {formatWeight(salesData?.reduce((sum, item) => sum + item.sales, 0) || 0)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Average Monthly</div>
                    <div className="text-2xl font-bold">
                      {formatWeight((salesData?.reduce((sum, item) => sum + item.sales, 0) || 0) / (salesData?.length || 1))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Best Month</div>
                  <div className="font-medium">
                    {salesData?.reduce((prev, current) => 
                      (prev.sales > current.sales) ? prev : current
                    )?.month} - {formatWeight(Math.max(...(salesData?.map(s => s.sales) || [0])))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Price Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                {predictions?.predictions && predictions.predictions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Average Confidence</div>
                        <div className="text-2xl font-bold">
                          {(predictions.averageConfidence * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">High Confidence Predictions</div>
                        <div className="text-2xl font-bold">
                          {predictions.highConfidencePredictions?.length || 0}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Upcoming Predictions</h4>
                      <div className="space-y-2">
                        {predictions.predictions.slice(0, 5).map((prediction, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{prediction.fishType?.fishName}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(prediction.predictionDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formatCurrency(parseFloat(prediction.retailPrice), 'LKR')}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {(parseFloat(prediction.confidence) * 100).toFixed(0)}% confidence
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No predictions available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}