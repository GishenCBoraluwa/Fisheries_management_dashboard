import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys, queryClient } from '@/lib/queryClient';
import { useUIState } from '@/lib/store';
import { PaginationParams, UserSettings } from '@/types/api';

export function useAllUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => apiClient.getAllUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - user data doesn't change frequently
    select: (data) => ({
      users: data.data,
      pagination: data.pagination,
    }),
  });
}

export function useUserDetail(userId: number) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => apiClient.getUserById(userId),
    enabled: !!userId && userId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => data.data,
  });
}

export function useUserSettings(userId: number) {
  return useQuery({
    queryKey: queryKeys.users.settings(userId),
    queryFn: () => apiClient.getUserSettings(userId),
    enabled: !!userId && userId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes - settings don't change often
    select: (data) => data.data,
  });
}

// Mutation for updating user settings
export function useUpdateUserSettings(userId: number) {
  const { addNotification } = useUIState();

  return useMutation({
    mutationFn: (settings: Partial<UserSettings>) => 
      apiClient.updateUserSettings(userId, settings),
    onSuccess: () => {
      // Invalidate user settings to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.users.settings(userId) });
      
      addNotification({
        type: 'success',
        title: 'Settings Updated',
        message: 'User settings have been updated successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to update user settings:', error);
      addNotification({
        type: 'error',
        title: 'Settings Update Failed',
        message: 'Failed to update user settings. Please try again.',
      });
    },
  });
}

// User analytics and insights
export function useUserAnalytics() {
  return useQuery({
    queryKey: [...queryKeys.users.all, 'analytics'],
    queryFn: async () => {
      // Fetch all users with minimal pagination to get total count
      const usersResponse = await apiClient.getAllUsers({ limit: 1 });
      const totalUsers = usersResponse.pagination?.total || 0;
      
      // You could extend this to fetch more analytics data
      return {
        totalUsers,
        // Add more analytics as needed
      };
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    select: (data) => data,
  });
}