import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { queryKeys, queryClient } from '@/lib/queryClient';
import { useDashboardSettings, useUIState } from '@/lib/store';
import { WeatherParams } from '@/types/api';

export function useWeatherForecasts(params?: WeatherParams) {
  const { selectedLocation } = useDashboardSettings();

  const queryParams = {
    ...params,
    location: params?.location || selectedLocation,
  };

  return useQuery({
    queryKey: queryKeys.weather.forecasts(queryParams),
    queryFn: () => apiClient.getWeatherForecasts(queryParams),
    refetchInterval: 6 * 60 * 60 * 1000, // Refetch every 6 hours
    staleTime: 2 * 60 * 60 * 1000, // Consider stale after 2 hours
    select: (data) => {
      const forecasts = data.data;
      
      return {
        forecasts,
        currentWeather: forecasts[0] || null,
        weeklyForecast: forecasts.slice(0, 7),
        weatherAlerts: generateWeatherAlerts(forecasts),
        averages: calculateWeatherAverages(forecasts),
      };
    },
  });
}

// Get weather for multiple locations
export function useMultiLocationWeather() {
  const locations = ['Colombo', 'Negombo', 'Galle', 'Trincomalee', 'Jaffna', 'Hambantota'];

  return useQuery({
    queryKey: [...queryKeys.weather.all, 'multi-location'],
    queryFn: async () => {
      const promises = locations.map(location => 
        apiClient.getWeatherForecasts({ location, days: 3 })
      );
      const results = await Promise.all(promises);
      return results.map((result, index) => ({
        location: locations[index],
        forecasts: result.data,
      }));
    },
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    select: (data) => ({
      locationForecasts: data,
      summary: generateLocationSummary(data),
    }),
  });
}

// Get weather trends for analysis
export function useWeatherTrends(location?: string, days: number = 30) {
  const { selectedLocation } = useDashboardSettings();
  const targetLocation = location || selectedLocation;

  return useQuery({
    queryKey: [...queryKeys.weather.all, 'trends', targetLocation, days],
    queryFn: () => apiClient.getWeatherForecasts({ location: targetLocation, days }),
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
    select: (data) => {
      const forecasts = data.data;
      return {
        trends: calculateWeatherTrends(forecasts),
        extremes: findWeatherExtremes(forecasts),
        patterns: identifyWeatherPatterns(forecasts),
      };
    },
  });
}

// Mutation for refreshing weather data
export function useRefreshWeatherData() {
  const { addNotification } = useUIState();

  return useMutation({
    mutationFn: () => apiClient.refreshWeatherData(),
    onSuccess: () => {
      // Invalidate all weather queries to fetch fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.weather.all });
      
      addNotification({
        type: 'success',
        title: 'Weather Updated',
        message: 'Weather data has been refreshed successfully',
      });
    },
    onError: (error) => {
      console.error('Failed to refresh weather data:', error);
      addNotification({
        type: 'error',
        title: 'Weather Refresh Failed',
        message: 'Failed to refresh weather data. Please try again.',
      });
    },
  });
}

// Helper functions
function generateWeatherAlerts(forecasts: any[]) {
  const alerts = [];

  for (const forecast of forecasts.slice(0, 3)) { // Check next 3 days
    const temp = parseFloat(forecast.temperature2mMean);
    const windSpeed = parseFloat(forecast.windSpeed10mMax);
    const precipitation = parseFloat(forecast.precipitationSum);

    // High wind alert
    if (windSpeed > 25) {
      alerts.push({
        type: 'wind',
        severity: windSpeed > 35 ? 'severe' : 'moderate',
        message: `High winds expected: ${windSpeed.toFixed(1)} km/h`,
        location: forecast.location,
        date: forecast.forecastDate,
      });
    }

    // Heavy rain alert
    if (precipitation > 50) {
      alerts.push({
        type: 'rain',
        severity: precipitation > 100 ? 'severe' : 'moderate',
        message: `Heavy rainfall expected: ${precipitation.toFixed(1)} mm`,
        location: forecast.location,
        date: forecast.forecastDate,
      });
    }

    // Extreme temperature alert
    if (temp > 35 || temp < 15) {
      alerts.push({
        type: 'temperature',
        severity: temp > 40 || temp < 10 ? 'severe' : 'moderate',
        message: `Extreme temperature: ${temp.toFixed(1)}°C`,
        location: forecast.location,
        date: forecast.forecastDate,
      });
    }
  }

  return alerts;
}

function calculateWeatherAverages(forecasts: any[]) {
  if (forecasts.length === 0) {
    return {
      avgTemperature: 0,
      avgWindSpeed: 0,
      avgHumidity: 0,
      totalPrecipitation: 0,
    };
  }

  const totals = forecasts.reduce((acc, forecast) => ({
    temperature: acc.temperature + parseFloat(forecast.temperature2mMean),
    windSpeed: acc.windSpeed + parseFloat(forecast.windSpeed10mMax),
    humidity: acc.humidity + parseFloat(forecast.relativeHumidity2mMean),
    precipitation: acc.precipitation + parseFloat(forecast.precipitationSum),
  }), { temperature: 0, windSpeed: 0, humidity: 0, precipitation: 0 });

  return {
    avgTemperature: Math.round((totals.temperature / forecasts.length) * 10) / 10,
    avgWindSpeed: Math.round((totals.windSpeed / forecasts.length) * 10) / 10,
    avgHumidity: Math.round((totals.humidity / forecasts.length) * 10) / 10,
    totalPrecipitation: Math.round(totals.precipitation * 10) / 10,
  };
}

function generateLocationSummary(locationData: any[]) {
  return locationData.map(({ location, forecasts }) => {
    const current = forecasts[0];
    if (!current) return { location, status: 'no-data' };

    const temp = parseFloat(current.temperature2mMean);
    const windSpeed = parseFloat(current.windSpeed10mMax);
    const precipitation = parseFloat(current.precipitationSum);

    // Determine fishing conditions
    let condition = 'good';
    if (windSpeed > 25 || precipitation > 30) {
      condition = 'poor';
    } else if (windSpeed > 15 || precipitation > 10) {
      condition = 'fair';
    }

    return {
      location,
      condition,
      temperature: temp,
      windSpeed,
      precipitation,
      summary: `${temp.toFixed(1)}°C, ${windSpeed.toFixed(1)} km/h winds`,
    };
  });
}

function calculateWeatherTrends(forecasts: any[]) {
  if (forecasts.length < 2) return { temperature: 'stable', wind: 'stable', precipitation: 'stable' };

  const sortedForecasts = forecasts.sort((a, b) => 
    new Date(a.forecastDate).getTime() - new Date(b.forecastDate).getTime()
  );

  const first = sortedForecasts[0];
  const last = sortedForecasts[sortedForecasts.length - 1];

  const tempTrend = parseFloat(last.temperature2mMean) - parseFloat(first.temperature2mMean);
  const windTrend = parseFloat(last.windSpeed10mMax) - parseFloat(first.windSpeed10mMax);
  const precipitationTrend = parseFloat(last.precipitationSum) - parseFloat(first.precipitationSum);

  return {
    temperature: tempTrend > 2 ? 'increasing' : tempTrend < -2 ? 'decreasing' : 'stable',
    wind: windTrend > 5 ? 'increasing' : windTrend < -5 ? 'decreasing' : 'stable',
    precipitation: precipitationTrend > 10 ? 'increasing' : precipitationTrend < -10 ? 'decreasing' : 'stable',
  };
}

function findWeatherExtremes(forecasts: any[]) {
  if (forecasts.length === 0) return null;

  const temperatures = forecasts.map(f => parseFloat(f.temperature2mMean));
  const windSpeeds = forecasts.map(f => parseFloat(f.windSpeed10mMax));
  const precipitations = forecasts.map(f => parseFloat(f.precipitationSum));

  return {
    maxTemperature: Math.max(...temperatures),
    minTemperature: Math.min(...temperatures),
    maxWindSpeed: Math.max(...windSpeeds),
    maxPrecipitation: Math.max(...precipitations),
  };
}

function identifyWeatherPatterns(forecasts: any[]) {
  // Simple pattern identification
  const patterns = [];

  // Check for consecutive rainy days
  let consecutiveRainDays = 0;
  let maxConsecutiveRain = 0;

  for (const forecast of forecasts) {
    if (parseFloat(forecast.precipitationSum) > 5) {
      consecutiveRainDays++;
      maxConsecutiveRain = Math.max(maxConsecutiveRain, consecutiveRainDays);
    } else {
      consecutiveRainDays = 0;
    }
  }

  if (maxConsecutiveRain >= 3) {
    patterns.push(`${maxConsecutiveRain} consecutive rainy days expected`);
  }

  // Check for temperature swings
  const temperatures = forecasts.map(f => parseFloat(f.temperature2mMean));
  const tempRange = Math.max(...temperatures) - Math.min(...temperatures);
  
  if (tempRange > 10) {
    patterns.push(`Large temperature variation: ${tempRange.toFixed(1)}°C range`);
  }

  return patterns;
}