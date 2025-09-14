'use client';

import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { DataTable } from "./data-table";
import { columns, FishPrice } from "./columns";
import { usePriceHistory, useCurrentPredictions } from "@/hooks/api/usePricing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

// Mock data fallback
const getMockData = (): FishPrice[] => {
  return [
    {
      fishPriceId: "1",
      fishTypeId: "1",
      fishName: "Yellowfin tuna - Kelawalla",
      priceDate: "2025-09-10",
      retailPrice: 1200.0,
      wholesalePrice: 950.0,
      marketDemandLevel: "high",
      supplyAvailability: 2000,
    },
    {
      fishPriceId: "2",
      fishTypeId: "2",
      fishName: "Sail fish - Thalapath",
      priceDate: "2025-09-10",
      retailPrice: 800.0,
      wholesalePrice: 650.0,
      marketDemandLevel: "medium",
      supplyAvailability: 3500,
    },
    {
      fishPriceId: "3",
      fishTypeId: "3",
      fishName: "Skipjack tuna - Balaya",
      priceDate: "2025-09-10",
      retailPrice: 1000.0,
      wholesalePrice: 800.0,
      marketDemandLevel: "high",
      supplyAvailability: 2500,
    },
  ];
};

export default function FisheriesPage() {
  const { data: priceData, isLoading: priceLoading } = usePriceHistory();
  const { data: predictions, isLoading: predictionsLoading } = useCurrentPredictions();

  // Use mock data as fallback
  const mockData = getMockData();
  const displayData = priceData?.prices || mockData;

  const stats = priceData?.stats || {
    averageRetailPrice: 900,
    averageWholesalePrice: 750,
    trend: 'increasing' as const,
    priceVariability: 12.5
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row w-auto justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fish Prices</h1>
          <p className="text-muted-foreground">
            Track and manage fish pricing data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Price
          </Button>
        </div>
      </div>

      {/* Price Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Retail Price</CardTitle>
            {stats.trend === 'increasing' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageRetailPrice, 'LKR')}
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              {stats.trend} trend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wholesale Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageWholesalePrice, 'LKR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Wholesale pricing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Variability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.priceVariability.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Market volatility
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {predictionsLoading ? '...' : predictions?.predictions?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              AI forecasts available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Fish Prices</CardTitle>
          <CardDescription>
            Current and historical fish pricing data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {priceLoading ? (
            <LoadingSkeleton />
          ) : (
            <DataTable columns={columns} data={displayData} />
          )}
        </CardContent>
      </Card>

      {/* Predictions Section */}
      {predictions?.predictions && predictions.predictions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Price Predictions</CardTitle>
            <CardDescription>
              AI-generated price forecasts for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary">
                        {(parseFloat(prediction.confidence) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}