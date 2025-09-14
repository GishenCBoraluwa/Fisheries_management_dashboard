import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Dashboard state slice
interface DashboardState {
  selectedTimeRange: '7d' | '30d' | '90d' | '1y';
  selectedLocation: string;
  refreshInterval: number;
  isRealTimeEnabled: boolean;
  
  setSelectedTimeRange: (range: '7d' | '30d' | '90d' | '1y') => void;
  setSelectedLocation: (location: string) => void;
  setRefreshInterval: (interval: number) => void;
  toggleRealTime: () => void;
}

// UI state slice
interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: number;
  duration?: number;
}

// Orders filter state slice
interface OrdersFilterState {
  statusFilter: string[];
  dateRange: { from?: Date; to?: Date };
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  setStatusFilter: (statuses: string[]) => void;
  setDateRange: (range: { from?: Date; to?: Date }) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;
}

// Pricing filters state slice
interface PricingFilterState {
  selectedFishTypes: number[];
  priceRange: { min: number; max: number };
  confidenceThreshold: number;
  
  setSelectedFishTypes: (fishTypes: number[]) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  setConfidenceThreshold: (threshold: number) => void;
  resetPricingFilters: () => void;
}

// Real-time updates state
interface RealTimeState {
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  lastUpdate: number | null;
  pendingUpdates: string[];
  
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'reconnecting') => void;
  setLastUpdate: (timestamp: number) => void;
  addPendingUpdate: (update: string) => void;
  clearPendingUpdates: () => void;
}

// Combined store type
type AppStore = DashboardState & UIState & OrdersFilterState & PricingFilterState & RealTimeState;

// Create the main store using Zustand with middleware
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Dashboard state
        selectedTimeRange: '30d',
        selectedLocation: 'Colombo',
        refreshInterval: 30000, // 30 seconds
        isRealTimeEnabled: true,
        
        setSelectedTimeRange: (range) => set((state) => {
          state.selectedTimeRange = range;
        }),
        
        setSelectedLocation: (location) => set((state) => {
          state.selectedLocation = location;
        }),
        
        setRefreshInterval: (interval) => set((state) => {
          state.refreshInterval = interval;
        }),
        
        toggleRealTime: () => set((state) => {
          state.isRealTimeEnabled = !state.isRealTimeEnabled;
        }),

        // UI state
        sidebarCollapsed: false,
        theme: 'system',
        notifications: [],
        
        toggleSidebar: () => set((state) => {
          state.sidebarCollapsed = !state.sidebarCollapsed;
        }),
        
        setTheme: (theme) => set((state) => {
          state.theme = theme;
        }),
        
        addNotification: (notification) => set((state) => {
          const id = Date.now().toString();
          const newNotification: Notification = {
            ...notification,
            id,
            timestamp: Date.now(),
            duration: notification.duration || 5000,
          };
          state.notifications.push(newNotification);
        }),
        
        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter((n) => n.id !== id);
        }),
        
        clearNotifications: () => set((state) => {
          state.notifications = [];
        }),

        // Orders filter state
        statusFilter: [],
        dateRange: {},
        searchQuery: '',
        sortBy: 'orderDate',
        sortOrder: 'desc',
        
        setStatusFilter: (statuses) => set((state) => {
          state.statusFilter = statuses;
        }),
        
        setDateRange: (range) => set((state) => {
          state.dateRange = range;
        }),
        
        setSearchQuery: (query) => set((state) => {
          state.searchQuery = query;
        }),
        
        setSortBy: (field) => set((state) => {
          state.sortBy = field;
        }),
        
        setSortOrder: (order) => set((state) => {
          state.sortOrder = order;
        }),
        
        resetFilters: () => set((state) => {
          state.statusFilter = [];
          state.dateRange = {};
          state.searchQuery = '';
          state.sortBy = 'orderDate';
          state.sortOrder = 'desc';
        }),

        // Pricing filters state
        selectedFishTypes: [],
        priceRange: { min: 0, max: 5000 },
        confidenceThreshold: 0.8,
        
        setSelectedFishTypes: (fishTypes) => set((state) => {
          state.selectedFishTypes = fishTypes;
        }),
        
        setPriceRange: (range) => set((state) => {
          state.priceRange = range;
        }),
        
        setConfidenceThreshold: (threshold) => set((state) => {
          state.confidenceThreshold = threshold;
        }),
        
        resetPricingFilters: () => set((state) => {
          state.selectedFishTypes = [];
          state.priceRange = { min: 0, max: 5000 };
          state.confidenceThreshold = 0.8;
        }),

        // Real-time state
        connectionStatus: 'disconnected',
        lastUpdate: null,
        pendingUpdates: [],
        
        setConnectionStatus: (status) => set((state) => {
          state.connectionStatus = status;
        }),
        
        setLastUpdate: (timestamp) => set((state) => {
          state.lastUpdate = timestamp;
        }),
        
        addPendingUpdate: (update) => set((state) => {
          state.pendingUpdates.push(update);
        }),
        
        clearPendingUpdates: () => set((state) => {
          state.pendingUpdates = [];
        }),
      })),
      {
        name: 'fisheries-dashboard-store',
        partialize: (state) => ({
          // Only persist UI preferences, not temporary state
          selectedTimeRange: state.selectedTimeRange,
          selectedLocation: state.selectedLocation,
          refreshInterval: state.refreshInterval,
          isRealTimeEnabled: state.isRealTimeEnabled,
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
          confidenceThreshold: state.confidenceThreshold,
          priceRange: state.priceRange,
        }),
      }
    ),
    {
      name: 'fisheries-dashboard',
    }
  )
);

// Selector hooks for better performance
export const useDashboardSettings = () => useAppStore((state) => ({
  selectedTimeRange: state.selectedTimeRange,
  selectedLocation: state.selectedLocation,
  refreshInterval: state.refreshInterval,
  isRealTimeEnabled: state.isRealTimeEnabled,
  setSelectedTimeRange: state.setSelectedTimeRange,
  setSelectedLocation: state.setSelectedLocation,
  setRefreshInterval: state.setRefreshInterval,
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

export const useOrdersFilter = () => useAppStore((state) => ({
  statusFilter: state.statusFilter,
  dateRange: state.dateRange,
  searchQuery: state.searchQuery,
  sortBy: state.sortBy,
  sortOrder: state.sortOrder,
  setStatusFilter: state.setStatusFilter,
  setDateRange: state.setDateRange,
  setSearchQuery: state.setSearchQuery,
  setSortBy: state.setSortBy,
  setSortOrder: state.setSortOrder,
  resetFilters: state.resetFilters,
}));

export const usePricingFilter = () => useAppStore((state) => ({
  selectedFishTypes: state.selectedFishTypes,
  priceRange: state.priceRange,
  confidenceThreshold: state.confidenceThreshold,
  setSelectedFishTypes: state.setSelectedFishTypes,
  setPriceRange: state.setPriceRange,
  setConfidenceThreshold: state.setConfidenceThreshold,
  resetPricingFilters: state.resetPricingFilters,
}));

export const useRealTimeState = () => useAppStore((state) => ({
  connectionStatus: state.connectionStatus,
  lastUpdate: state.lastUpdate,
  pendingUpdates: state.pendingUpdates,
  setConnectionStatus: state.setConnectionStatus,
  setLastUpdate: state.setLastUpdate,
  addPendingUpdate: state.addPendingUpdate,
  clearPendingUpdates: state.clearPendingUpdates,
}));