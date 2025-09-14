import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: number;
  duration?: number;
}

interface AppState {
  // UI state
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  
  // Dashboard settings
  selectedTimeRange: '7d' | '30d' | '90d' | '1y';
  selectedLocation: string;
  isRealTimeEnabled: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setSelectedTimeRange: (range: '7d' | '30d' | '90d' | '1y') => void;
  setSelectedLocation: (location: string) => void;
  toggleRealTime: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarCollapsed: false,
        theme: 'system',
        notifications: [],
        selectedTimeRange: '30d',
        selectedLocation: 'Colombo',
        isRealTimeEnabled: true,
        
        // Actions
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        
        setTheme: (theme) => set({ theme }),
        
        addNotification: (notification) => set((state) => {
          const id = Date.now().toString();
          const newNotification: Notification = {
            ...notification,
            id,
            timestamp: Date.now(),
            duration: notification.duration || 5000,
          };
          return {
            notifications: [...state.notifications, newNotification]
          };
        }),
        
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter((notification: Notification) => notification.id !== id)
        })),
        
        clearNotifications: () => set({ notifications: [] }),
        
        setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
        
        setSelectedLocation: (location) => set({ selectedLocation: location }),
        
        toggleRealTime: () => set((state) => ({ isRealTimeEnabled: !state.isRealTimeEnabled })),
      }),
      {
        name: 'fisheries-dashboard-store',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
          selectedTimeRange: state.selectedTimeRange,
          selectedLocation: state.selectedLocation,
          isRealTimeEnabled: state.isRealTimeEnabled,
        }),
      }
    ),
    { name: 'fisheries-dashboard' }
  )
);

// Selector hooks for better performance
export const useDashboardSettings = () => useAppStore((state) => ({
  selectedTimeRange: state.selectedTimeRange,
  selectedLocation: state.selectedLocation,
  isRealTimeEnabled: state.isRealTimeEnabled,
  setSelectedTimeRange: state.setSelectedTimeRange,
  setSelectedLocation: state.setSelectedLocation,
  toggleRealTime: state.toggleRealTime,
}));

export const useUIState = () => useAppStore((state) => ({
  sidebarCollapsed: state.sidebarCollapsed,
  theme: state.theme,
  notifications: state.notifications,
  toggleSidebar: state.toggleSidebar,
  setTheme: state.setTheme,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
}));