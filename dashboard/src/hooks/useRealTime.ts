import { useEffect } from 'react';
import { useRealTimeState } from '@/lib/store';
import { realTimeManager } from '@/lib/realtime';

export function useRealTime() {
  const {
    connectionStatus,
    lastUpdate,
    pendingUpdates,
    setConnectionStatus,
    setLastUpdate,
    clearPendingUpdates,
  } = useRealTimeState();

  useEffect(() => {
    // Initialize real-time connection
    const initConnection = () => {
      if (typeof window !== 'undefined') {
        realTimeManager.connect();
      }
    };

    initConnection();

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined') {
        realTimeManager.disconnect();
      }
    };
  }, []);

  // Helper functions
  const reconnect = () => {
    realTimeManager.disconnect();
    setTimeout(() => {
      realTimeManager.connect();
    }, 1000);
  };

  const clearUpdates = () => {
    clearPendingUpdates();
  };

  const isConnected = connectionStatus === 'connected';
  const isReconnecting = connectionStatus === 'reconnecting';
  
  const timeSinceLastUpdate = lastUpdate ? Date.now() - lastUpdate : null;
  const hasRecentUpdate = timeSinceLastUpdate ? timeSinceLastUpdate < 60000 : false; // Within last minute

  return {
    connectionStatus,
    lastUpdate,
    pendingUpdates,
    isConnected,
    isReconnecting,
    timeSinceLastUpdate,
    hasRecentUpdate,
    reconnect,
    clearUpdates,
  };
}