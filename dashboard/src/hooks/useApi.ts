'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';

export function useApi() {
  // Dashboard queries
  const useDashboardStats = () =>
    useQuery({
      queryKey: ['dashboard', 'stats'],
      queryFn: () => apiClient.getDashboardStats(),
      refetchInterval: 30000,
      select: (data) => data.data,
    });

  const useRevenueData = () =>
    useQuery({
      queryKey: ['dashboard', 'revenue'],
      queryFn: () => apiClient.getRevenueData(),
      staleTime: 5 * 60 * 1000,
      select: (data) => data.data,
    });

  const useTrucks = () =>
    useQuery({
      queryKey: ['dashboard', 'trucks'],
      queryFn: () => apiClient.getTrucks(),
      refetchInterval: 30000,
      select: (data) => data.data,
    });

  const useFishSales = () =>
    useQuery({
      queryKey: ['dashboard', 'fish-sales'],
      queryFn: () => apiClient.getFishSales(),
      staleTime: 5 * 60 * 1000,
      select: (data) => data.data,
    });

  // Orders queries
  const usePendingOrders = (page = 1, limit = 10) =>
    useQuery({
      queryKey: ['orders', 'pending', page, limit],
      queryFn: () => apiClient.getPendingOrders(page, limit),
      refetchInterval: 30000,
      select: (data) => ({ orders: data.data, pagination: data.pagination }),
    });

  const useLatestTransactions = (page = 1, limit = 10) =>
    useQuery({
      queryKey: ['orders', 'transactions', page, limit],
      queryFn: () => apiClient.getLatestTransactions(page, limit),
      staleTime: 2 * 60 * 1000,
      select: (data) => ({ orders: data.data, pagination: data.pagination }),
    });

  const useOrderDetail = (id: number) =>
    useQuery({
      queryKey: ['orders', 'detail', id],
      queryFn: () => apiClient.getOrderById(id),
      enabled: !!id,
      select: (data) => data.data,
    });

  const useCreateOrder = () =>
    useMutation({
      mutationFn: (data: any) => apiClient.createOrder(data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    });

  // Pricing queries
  const usePriceHistory = (fishTypeId?: number, days = 30) =>
    useQuery({
      queryKey: ['pricing', 'history', fishTypeId, days],
      queryFn: () => apiClient.getPriceHistory(fishTypeId, days),
      staleTime: 2 * 60 * 1000,
      select: (data) => data.data,
    });

  const usePricePredictions = (fishTypeId?: number) =>
    useQuery({
      queryKey: ['pricing', 'current', fishTypeId],
      queryFn: () => apiClient.getCurrentPricePredictions(fishTypeId),
      staleTime: 2 * 60 * 1000,
      select: (data) => data.data,
    });

  // Users queries
  const useUsers = (page = 1, limit = 10) =>
    useQuery({
      queryKey: ['users', 'list', page, limit],
      queryFn: () => apiClient.getUsers(page, limit),
      staleTime: 5 * 60 * 1000,
      select: (data) => ({ users: data.data, pagination: data.pagination }),
    });

  const useUserDetail = (id: number) =>
    useQuery({
      queryKey: ['users', 'detail', id],
      queryFn: () => apiClient.getUserById(id),
      enabled: !!id,
      select: (data) => data.data,
    });

  // Blog queries
  const useBlogPosts = (category?: string, page = 1, limit = 10) =>
    useQuery({
      queryKey: ['blog', 'posts', category, page, limit],
      queryFn: () => apiClient.getBlogPosts(category, page, limit),
      staleTime: 5 * 60 * 1000,
      select: (data) => ({ posts: data.data, pagination: data.pagination }),
    });

  const useBlogPostDetail = (slug: string) =>
    useQuery({
      queryKey: ['blog', 'detail', slug],
      queryFn: () => apiClient.getBlogPostBySlug(slug),
      enabled: !!slug,
      select: (data) => data.data,
    });

  // Fish Types queries
  const useFishTypes = () =>
    useQuery({
      queryKey: ['fishTypes'],
      queryFn: () => apiClient.getFishTypes(),
      staleTime: 10 * 60 * 1000,
      select: (data) => data.data,
    });

  // Weather queries
  const useWeatherForecasts = (location?: string, days = 7) =>
    useQuery({
      queryKey: ['weather', 'forecasts', location, days],
      queryFn: () => apiClient.getWeatherForecasts(location, days),
      staleTime: 2 * 60 * 60 * 1000,
      select: (data) => data.data,
    });

  const useRefreshWeather = () =>
    useMutation({
      mutationFn: () => apiClient.refreshWeatherData(),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['weather'] }),
    });

  return {
    useDashboardStats,
    useRevenueData,
    useTrucks,
    useFishSales,
    usePendingOrders,
    useLatestTransactions,
    useOrderDetail,
    useCreateOrder,
    usePriceHistory,
    usePricePredictions,
    useUsers,
    useUserDetail,
    useBlogPosts,
    useBlogPostDetail,
    useFishTypes,
    useWeatherForecasts,
    useRefreshWeather,
  };
}