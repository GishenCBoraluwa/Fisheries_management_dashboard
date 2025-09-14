import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys, queryClient } from '@/lib/queryClient';
import { useOrdersFilter, useUIState } from '@/lib/store';
import { CreateOrderRequest, PaginationParams, OrdersQueryParams } from '@/types/api';

export function usePendingOrders(params?: PaginationParams) {
  const { refreshInterval } = useOrdersFilter();

  return useQuery({
    queryKey: queryKeys.orders.pending(params),
    queryFn: () => apiClient.getPendingOrders(params),
    refetchInterval: 30000, // Refresh every 30 seconds for pending orders
    staleTime: 15000, // Consider stale after 15 seconds
    select: (data) => ({
      orders: data.data,
      pagination: data.pagination,
    }),
  });
}

export function useLatestTransactions(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.orders.transactions(params),
    queryFn: () => apiClient.getLatestTransactions(params),
    staleTime: 2 * 60 * 1000, // 2 minutes - completed orders don't change frequently
    select: (data) => ({
      orders: data.data,
      pagination: data.pagination,
    }),
  });
}

export function useOrdersByStatus(params?: OrdersQueryParams) {
  return useQuery({
    queryKey: queryKeys.orders.byStatus(params),
    queryFn: () => apiClient.getOrdersByStatus(params || {}),
    enabled: !!(params?.status), // Only fetch if status is provided
    staleTime: 30000,
    select: (data) => ({
      orders: data.data,
      pagination: data.pagination,
    }),
  });
}

export function useOrderDetail(orderId: number) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => apiClient.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 60000, // 1 minute
    select: (data) => data.data,
  });
}

// Infinite query for large order lists with pagination
export function useInfiniteOrders(params?: OrdersQueryParams) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.orders.all, 'infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      apiClient.getOrdersByStatus({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 30000,
  });
}

// Mutations
export function useCreateOrder() {
  const { addNotification } = useUIState();

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) => apiClient.createOrder(orderData),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      
      addNotification({
        type: 'success',
        title: 'Order Created',
        message: `Order #${data.data.order.id} created successfully`,
      });
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
      addNotification({
        type: 'error',
        title: 'Order Creation Failed',
        message: 'There was an error creating the order. Please try again.',
      });
    },
  });
}

// Optimistic updates for better UX
export function useOptimisticOrderUpdate() {
  const { addNotification } = useUIState();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      // This would be your API call to update order status
      // For now, simulating the call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { orderId, status };
    },
    onMutate: async ({ orderId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.orders.detail(orderId) });

      // Snapshot the previous value
      const previousOrder = queryClient.getQueryData(queryKeys.orders.detail(orderId));

      // Optimistically update to the new value
      if (previousOrder) {
        queryClient.setQueryData(queryKeys.orders.detail(orderId), {
          ...previousOrder,
          status,
        });
      }

      return { previousOrder, orderId };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousOrder) {
        queryClient.setQueryData(
          queryKeys.orders.detail(context.orderId),
          context.previousOrder
        );
      }
      
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update order status. Please try again.',
      });
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}