'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import AnalysisDataTable from './data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/hooks/useApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate } from '@/lib/utils';
import AppAreaChart from '@/components/AppAreaChart';

export default function AnalysisPage() {
  const { useWeatherForecasts, useRefreshWeather } = useApi();
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [days, setDays] = useState(7);
  const { data: forecasts, isLoading: isForecastLoading } = useWeatherForecasts(location, days);
  const { mutate: refreshWeather, isPending: isRefreshing } = useRefreshWeather();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Price Analysis</h1>
          <p className="text-muted-foreground">Analyze fish price trends and environmental factors</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refreshWeather()} disabled={isRefreshing}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Weather
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Price
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white rounded-lg border">
          <CardHeader>
            <CardTitle>Fish Price Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <AppAreaChart />
          </CardContent>
        </Card>
        <Card className="bg-white rounded-lg border">
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
            <div className="flex gap-4">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undefined">All Locations</SelectItem>
                  <SelectItem value="colombo">Colombo</SelectItem>
                  <SelectItem value="negombo">Negombo</SelectItem>
                  <SelectItem value="galle">Galle</SelectItem>
                </SelectContent>
              </Select>
              <Select value={days.toString()} onValueChange={(value) => setDays(Number(value))}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Last 7 days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 14 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isForecastLoading ? (
              <div>Loading weather forecasts...</div>
            ) : (
              <div className="space-y-4">
                {forecasts?.map((forecast) => (
                  <div key={forecast.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">{forecast.location}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(forecast.forecastDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Temp: {forecast.temperature2mMean}°C</p>
                      <p className="text-sm">Wind: {forecast.windSpeed10mMax} km/h</p>
                      <p className="text-sm">Precipitation: {forecast.precipitationSum} mm</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white rounded-lg border">
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalysisDataTable />
        </CardContent>
      </Card>
    </div>
  );
}