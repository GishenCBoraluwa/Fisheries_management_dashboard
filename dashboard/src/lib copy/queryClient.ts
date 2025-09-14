import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - how long data stays fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache time - how long data stays in cache when component unmounts (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for critical data
      refetchOnWindowFocus: true,
      // Refetch when network reconnects
      refetchOnReconnect: true,
      // Don't refetch on mount if data is still fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Show error notifications for failed mutations
      onError: (error) => {
        console.error('Mutation error:', error);
        // You can integrate with your toast notification system here
      },
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  // Dashboard queries
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    revenue: () => [...queryKeys.dashboard.all, 'revenue'] as const,
    fishSales: () => [...queryKeys.dashboard.all, 'fish-sales'] as const,
    trucks: () => [...queryKeys.dashboard.all, 'trucks'] as const,
  },
  
  // Order queries
  orders: {
    all: ['orders'] as const,
    pending: (params?: any) => [...queryKeys.orders.all, 'pending', params] as const,
    transactions: (params?: any) => [...queryKeys.orders.all, 'transactions', params] as const,
    byStatus: (params?: any) => [...queryKeys.orders.all, 'by-status', params] as const,
    detail: (id: number) => [...queryKeys.orders.all, 'detail', id] as const,
  },
  
  // Pricing queries
  pricing: {
    all: ['pricing'] as const,
    history: (params?: any) => [...queryKeys.pricing.all, 'history', params] as const,
    predictions: (fishTypeId?: number) => [...queryKeys.pricing.all, 'predictions', fishTypeId] as const,
  },
  
  // Weather queries
  weather: {
    all: ['weather'] as const,
    forecasts: (params?: any) => [...queryKeys.weather.all, 'forecasts', params] as const,
  },
  
  // User queries
  users: {
    all: ['users'] as const,
    list: (params?: any) => [...queryKeys.users.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.users.all, 'detail', id] as const,
    settings: (id: number) => [...queryKeys.users.all, 'settings', id] as const,
  },
  
  // Fish types queries
  fishTypes: {
    all: ['fish-types'] as const,
  },
  
  // Blog queries
  blog: {
    all: ['blog'] as const,
    posts: (params?: any) => [...queryKeys.blog.all, 'posts', params] as const,
    detail: (slug: string) => [...queryKeys.blog.all, 'detail', slug] as const,
  },
  
  // System queries
  system: {
    all: ['system'] as const,
    health: () => [...queryKeys.system.all, 'health'] as const,
    info: () => [...queryKeys.system.all, 'info'] as const,
  },
} as const;

// Utility functions for cache invalidation
export const invalidateQueries = {
  dashboard: () => queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
  orders: () => queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
  pricing: () => queryClient.invalidateQueries({ queryKey: queryKeys.pricing.all }),
  weather: () => queryClient.invalidateQueries({ queryKey: queryKeys.weather.all }),
  users: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  fishTypes: () => queryClient.invalidateQueries({ queryKey: queryKeys.fishTypes.all }),
  blog: () => queryClient.invalidateQueries({ queryKey: queryKeys.blog.all }),
  system: () => queryClient.invalidateQueries({ queryKey: queryKeys.system.all }),
};