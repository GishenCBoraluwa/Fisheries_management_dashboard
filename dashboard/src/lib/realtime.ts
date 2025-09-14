import { queryClient, invalidateQueries } from './queryClient';
import { useAppStore } from './store';

// Real-time update types
export interface RealTimeUpdate {
  type: 'order_status_changed' | 'new_order' | 'price_updated' | 'truck_status_changed' | 'weather_updated';
  data: any;
  timestamp: number;
}

class RealTimeManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    
    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleConnectionError();
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      useAppStore.getState().setConnectionStatus('connected');
      useAppStore.getState().setLastUpdate(Date.now());
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const update: RealTimeUpdate = JSON.parse(event.data);
        this.handleRealTimeUpdate(update);
        useAppStore.getState().setLastUpdate(Date.now());
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.handleConnectionError();
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      useAppStore.getState().setConnectionStatus('disconnected');
      this.stopHeartbeat();
      
      if (event.code !== 1000) { // Not a normal closure
        this.handleReconnection();
      }
    };
  }

  private handleRealTimeUpdate(update: RealTimeUpdate) {
    const { addPendingUpdate, addNotification } = useAppStore.getState();
    
    // Add to pending updates for debugging/logging
    addPendingUpdate(`${update.type}:${update.timestamp}`);

    // Handle different types of updates
    switch (update.type) {
      case 'order_status_changed':
        this.handleOrderStatusChange(update.data);
        break;
      case 'new_order':
        this.handleNewOrder(update.data);
        break;
      case 'price_updated':
        this.handlePriceUpdate(update.data);
        break;
      case 'truck_status_changed':
        this.handleTruckStatusChange(update.data);
        break;
      case 'weather_updated':
        this.handleWeatherUpdate(update.data);
        break;
      default:
        console.warn('Unknown update type:', update.type);
    }
  }

  private handleOrderStatusChange(data: any) {
    // Invalidate relevant queries
    invalidateQueries.orders();
    invalidateQueries.dashboard();

    // Show notification
    useAppStore.getState().addNotification({
      type: 'info',
      title: 'Order Status Updated',
      message: `Order #${data.orderId} status changed to ${data.status}`,
    });
  }

  private handleNewOrder(data: any) {
    // Invalidate relevant queries
    invalidateQueries.orders();
    invalidateQueries.dashboard();

    // Show notification
    useAppStore.getState().addNotification({
      type: 'success',
      title: 'New Order Received',
      message: `Order #${data.orderId} for ${data.totalAmount} LKR`,
    });
  }

  private handlePriceUpdate(data: any) {
    // Invalidate pricing queries
    invalidateQueries.pricing();

    // Show notification only for significant price changes
    if (Math.abs(data.priceChange) > 5) {
      useAppStore.getState().addNotification({
        type: 'warning',
        title: 'Price Alert',
        message: `${data.fishName} price ${data.priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(data.priceChange)}%`,
      });
    }
  }

  private handleTruckStatusChange(data: any) {
    // Invalidate dashboard queries
    invalidateQueries.dashboard();

    // Show notification for truck status changes
    useAppStore.getState().addNotification({
      type: 'info',
      title: 'Truck Status Update',
      message: `Truck ${data.licensePlate} is now ${data.status}`,
    });
  }

  private handleWeatherUpdate(data: any) {
    // Invalidate weather queries
    invalidateQueries.weather();

    // Show notification for severe weather alerts
    if (data.alertLevel === 'severe') {
      useAppStore.getState().addNotification({
        type: 'warning',
        title: 'Weather Alert',
        message: `Severe weather warning for ${data.location}`,
        duration: 10000, // Show for 10 seconds
      });
    }
  }

  private handleConnectionError() {
    useAppStore.getState().setConnectionStatus('disconnected');
    this.stopHeartbeat();
    this.handleReconnection();
  }

  private handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      useAppStore.getState().addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: 'Unable to establish real-time connection. Please refresh the page.',
        duration: 10000,
      });
      return;
    }

    this.reconnectAttempts++;
    useAppStore.getState().setConnectionStatus('reconnecting');

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.connect();
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
  }

  // Public method to send messages (for future use)
  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  getConnectionState() {
    return this.ws?.readyState || WebSocket.CLOSED;
  }
}

export const realTimeManager = new RealTimeManager();

// Auto-connect when module loads in browser environment
if (typeof window !== 'undefined') {
  // Only connect if real-time is enabled in store
  const checkAndConnect = () => {
    const { isRealTimeEnabled } = useAppStore.getState();
    if (isRealTimeEnabled && realTimeManager.getConnectionState() === WebSocket.CLOSED) {
      realTimeManager.connect();
    }
  };

  // Initial connection check
  setTimeout(checkAndConnect, 1000);

  // Listen for real-time toggle changes
  let previousRealTimeState = useAppStore.getState().isRealTimeEnabled;
  
  useAppStore.subscribe((state) => {
    const currentRealTimeState = state.isRealTimeEnabled;
    
    if (currentRealTimeState !== previousRealTimeState) {
      if (currentRealTimeState) {
        realTimeManager.connect();
      } else {
        realTimeManager.disconnect();
      }
      previousRealTimeState = currentRealTimeState;
    }
  });
}