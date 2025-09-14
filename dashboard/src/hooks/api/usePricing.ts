import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys, queryClient } from '@/lib/queryClient';
import { usePricingFilter, useDashboardSettings, useUIState } from '@/lib/store';
import { PriceHistoryParams, AddActualPriceRequest } from '@/types/api';

export function usePriceHistory(params?: PriceHistoryParams) {
  const { selectedFishTypes } = usePricingFilter();
  const { selectedTimeRange } = useDashboardSettings();

  // Convert time range to days
  const days = selectedTimeRange === '7d' ? 7 
    : selectedTimeRange === '30d' ? 30 
    : selectedTimeRange === '90d' ? 90 
    : 365;

  const queryParams = {
    ...params,
    days,
    fishTypeId: selectedFishTypes.length === 1 ? selectedFishTypes[0] : undefined,
  };

  return useQuery({
    queryKey: queryKeys.pricing.history(queryParams),
    queryFn: () => apiClient.getPriceHistory(queryParams),
    staleTime: 2 * 60 * 1000, // 2 minutes - price history doesn't change frequently
    select: (data) => {
      const prices = data.data;
      
      // Filter by selected fish types if multiple are selected
      const filteredPrices = selectedFishTypes.length > 1 
        ? prices.filter(p => selectedFishTypes.includes(p.fishTypeId))
        : prices;

      return {
        prices: filteredPrices,
        stats: calculatePriceStats(filteredPrices),
      };
    },
  });
}

export function useCurrentPredictions(fishTypeId?: number) {
  const { selectedFishTypes, confidenceThreshold } = usePricingFilter();

  // Use selected fish types if no specific fishTypeId is provided
  const targetFishTypeId = fishTypeId || (selectedFishTypes.length === 1 ? selectedFishTypes[0] : undefined);

  return useQuery({
    queryKey: queryKeys.pricing.predictions(targetFishTypeId),
    queryFn: () => apiClient.getCurrentPredictions(targetFishTypeId),
    refetchInterval: 60000, // Refetch every minute for fresh predictions
    staleTime: 30000, // Consider stale after 30 seconds
    select: (data) => {
      let predictions = data.data;
      
      // Filter by confidence threshold
      predictions = predictions.filter(p => parseFloat(p.confidence) >= confidenceThreshold);
      
      // Filter by selected fish types if multiple are selected and no specific ID provided
      if (!fishTypeId && selectedFishTypes.length > 1) {
        predictions = predictions.filter(p => selectedFishTypes.includes(p.fishTypeId));
      }

      return {
        predictions,
        highConfidencePredictions: predictions.filter(p => parseFloat(p.confidence) >= 0.9),
        averageConfidence: calculateAverageConfidence(predictions),
      };
    },
  });
}

// Get price trends for multiple fish types
export function usePriceTrends() {
  const { selectedFishTypes } = usePricingFilter();
  const { selectedTimeRange } = useDashboardSettings();

  return useQuery({
    queryKey: [...queryKeys.pricing.all, 'trends', selectedFishTypes, selectedTimeRange],
    queryFn: async () => {
      const promises = selectedFishTypes.map(fishTypeId => 
        apiClient.getPriceHistory({ fishTypeId, days: 30 })
      );
      const results = await Promise.all(promises);
      return results.map(result => result.data).flat();
    },
    enabled: selectedFishTypes.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => calculateTrends(data),
  });
}

// Mutations
export function useAddActualPrice() {
  const { addNotification } = useUIState();

  return useMutation({
    mutationFn: (priceData: AddActualPriceRequest) => apiClient.addActualPrice(priceData),
    onSuccess: (data) => {
      // Invalidate pricing queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.pricing.all });
      
      addNotification({
        type: 'success',
        title: 'Price Added',
        message: `Actual price for ${data.data.priceDate} added successfully`,
      });
    },
    onError: (error) => {
      console.error('Failed to add actual price:', error);
      addNotification({
        type: 'error',
        title: 'Price Addition Failed',
        message: 'Failed to add actual price. Please check your data and try again.',
      });
    },
  });
}

// Helper functions
function calculatePriceStats(prices: any[]) {
  if (prices.length === 0) {
    return {
      averageRetailPrice: 0,
      averageWholesalePrice: 0,
      priceVariability: 0,
      trend: 'stable',
    };
  }

  const retailPrices = prices.map(p => parseFloat(p.retailPrice));
  const wholesalePrices = prices.map(p => parseFloat(p.wholesalePrice));

  const avgRetail = retailPrices.reduce((sum, price) => sum + price, 0) / retailPrices.length;
  const avgWholesale = wholesalePrices.reduce((sum, price) => sum + price, 0) / wholesalePrices.length;

  // Calculate price variability (coefficient of variation)
  const retailMean = avgRetail;
  const retailStdDev = Math.sqrt(
    retailPrices.reduce((sum, price) => sum + Math.pow(price - retailMean, 2), 0) / retailPrices.length
  );
  const variability = retailStdDev / retailMean;

  // Determine trend based on first and last prices
  const firstPrice = retailPrices[0];
  const lastPrice = retailPrices[retailPrices.length - 1];
  const trend = lastPrice > firstPrice * 1.05 ? 'increasing' 
    : lastPrice < firstPrice * 0.95 ? 'decreasing' 
    : 'stable';

  return {
    averageRetailPrice: Math.round(avgRetail * 100) / 100,
    averageWholesalePrice: Math.round(avgWholesale * 100) / 100,
    priceVariability: Math.round(variability * 10000) / 100, // As percentage
    trend,
  };
}

function calculateAverageConfidence(predictions: any[]) {
  if (predictions.length === 0) return 0;
  
  const totalConfidence = predictions.reduce((sum, p) => sum + parseFloat(p.confidence), 0);
  return Math.round((totalConfidence / predictions.length) * 100) / 100;
}

function calculateTrends(prices: any[]) {
  // Group prices by fish type
  const pricesByFish = prices.reduce((acc, price) => {
    const fishId = price.fishTypeId;
    if (!acc[fishId]) acc[fishId] = [];
    acc[fishId].push(price);
    return acc;
  }, {} as Record<number, any[]>);

  // Calculate trend for each fish type
  return Object.entries(pricesByFish).map(([fishTypeId, fishPrices]) => {
    const typedFishPrices = fishPrices as any[];
    const sortedPrices = typedFishPrices.sort((a, b) => 
      new Date(a.priceDate).getTime() - new Date(b.priceDate).getTime()
    );

    const stats = calculatePriceStats(sortedPrices);
    
    return {
      fishTypeId: parseInt(fishTypeId),
      fishName: sortedPrices[0]?.fishType?.fishName || 'Unknown',
      ...stats,
      dataPoints: sortedPrices.length,
      latestPrice: parseFloat(sortedPrices[sortedPrices.length - 1]?.retailPrice || '0'),
      oldestPrice: parseFloat(sortedPrices[0]?.retailPrice || '0'),
    };
  });
}