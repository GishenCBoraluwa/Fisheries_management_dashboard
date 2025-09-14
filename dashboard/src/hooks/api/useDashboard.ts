import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { useDashboardSettings } from "@/lib/store";

export function useDashboardStats() {
  const { refreshInterval } = useDashboardSettings();

  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => apiClient.getDashboardStats(),
    refetchInterval: refreshInterval,
    staleTime: 30000, // Consider data stale after 30 seconds
    select: (data) => data.data,
  });
}

export function useRevenueComparison() {
  const { selectedTimeRange } = useDashboardSettings();

  return useQuery({
    queryKey: [...queryKeys.dashboard.revenue(), selectedTimeRange],
    queryFn: () => apiClient.getRevenueComparison(),
    staleTime: 5 * 60 * 1000, // 5 minutes - revenue data doesn't change frequently
    select: (data) => data.data,
  });
}

export function useFishSalesData() {
  const { selectedTimeRange } = useDashboardSettings();

  return useQuery({
    queryKey: [...queryKeys.dashboard.fishSales(), selectedTimeRange],
    queryFn: () => apiClient.getFishSalesData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => data.data,
  });
}

export function useTruckInformation() {
  const { refreshInterval } = useDashboardSettings();

  return useQuery({
    queryKey: queryKeys.dashboard.trucks(),
    queryFn: () => apiClient.getTruckInformation(),
    refetchInterval: refreshInterval,
    staleTime: 60000, // 1 minute - truck status changes frequently
    select: (data) => data.data,
  });
}
