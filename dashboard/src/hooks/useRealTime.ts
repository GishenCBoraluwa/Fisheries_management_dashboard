'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useRealTime() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [hasRecentUpdate, setHasRecentUpdate] = useState(false);

  // Simulate WebSocket connection or polling
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(true);
      setHasRecentUpdate(true);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      setTimeout(() => setHasRecentUpdate(false), 2000);
    }, 30000);

    return () => clearInterval(interval);
  }, [queryClient]);

  const reconnect = () => {
    setIsConnected(true);
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['trucks'] });
  };

  return { isConnected, hasRecentUpdate, reconnect };
}