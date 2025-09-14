'use client';

import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";
import { DataTable } from "./data-table";
import { columns, FishOrder } from "./columns";
import { usePendingOrders, useLatestTransactions } from "@/hooks/api/useOrders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data fallback - replace with API data
const getMockData = (): FishOrder[] => {
  return [
    {
      orderId: "1",
      fishTypeId: "1",
      quantityKg: 5.0,
      orderDate: "2025-09-09T10:30:00Z",
      deliveryDate: "2025-09-10",
      totalAmount: 6250.0,
      status: "confirmed",
    },
    {
      orderId: "2",
      fishTypeId: "2",
      quantityKg: 3.5,
      orderDate: "2025-09-08T14:00:00Z",
      deliveryDate: "2025-09-09",
      totalAmount: 4500.0,
      status: "pending",
    },
    {
      orderId: "3",
      fishTypeId: "3",
      quantityKg: 10.0,
      orderDate: "2025-09-07T09:15:00Z",
      deliveryDate: "2025-09-08",
      totalAmount: 9000.0,
      status: "delivered",
    },
    {
      orderId: "4",
      fishTypeId: "4",
      quantityKg: 2.0,
      orderDate: "2025-09-06T11:45:00Z",
      deliveryDate: "2025-09-07",
      totalAmount: 2400.0,
      status: "cancelled",
    },
    {
      orderId: "5",
      fishTypeId: "5",
      quantityKg: 8.0,
      orderDate: "2025-09-05T16:20:00Z",
      deliveryDate: "2025-09-06",
      totalAmount: 4800.0,
      status: "confirmed",
    },
  ];
};

export default function OrdersPage() {
  const { data: pendingOrders, isLoading: pendingLoading } = usePendingOrders();
  const { data: completedOrders, isLoading: completedLoading } = useLatestTransactions();

  // Use mock data as fallback
  const mockData = getMockData();
  const pendingData = pendingOrders?.orders || mockData.filter(o => o.status === "pending" || o.status === "confirmed");
  const completedData = completedOrders?.orders || mockData.filter(o => o.status === "delivered");

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
          <h1 className="text-3xl font-bold tracking-tight">Fish Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all fish orders
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
            New Order
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Orders
            <Badge variant="secondary" className="ml-2">
              {pendingData.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Orders
            <Badge variant="secondary" className="ml-2">
              {completedData.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>
                Orders awaiting confirmation or processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <LoadingSkeleton />
              ) : (
                <DataTable columns={columns} data={pendingData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
              <CardDescription>
                Successfully delivered orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedLoading ? (
                <LoadingSkeleton />
              ) : (
                <DataTable columns={columns} data={completedData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}