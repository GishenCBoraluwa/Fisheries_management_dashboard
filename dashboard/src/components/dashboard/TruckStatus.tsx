'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Fuel, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useTruckInformation } from "@/hooks/api/useDashboard";
import { useRealTime } from "@/hooks/useRealTime";
import { getStatusColor, formatPhoneNumber, formatRelativeTime } from "@/lib/utils";
import { Truck as TruckType } from "@/types/api";

interface TruckCardProps {
  truck: TruckType;
  isLoading?: boolean;
}

function TruckCard({ truck, isLoading }: TruckCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (truck.availabilityStatus) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Truck className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUtilizationPercentage = () => {
    // This would typically come from your API based on current load
    // For now, we'll simulate it based on status
    switch (truck.availabilityStatus) {
      case 'in_transit':
        return 85;
      case 'maintenance':
        return 0;
      case 'available':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Truck Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium">{truck.licensePlate}</span>
            </div>
            <Badge className={getStatusColor(truck.availabilityStatus)}>
              {truck.availabilityStatus.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Capacity Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">{truck.capacityKg.toLocaleString()} kg</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Current Load</span>
                <span>{getUtilizationPercentage()}%</span>
              </div>
              <Progress value={getUtilizationPercentage()} className="h-2" />
            </div>
          </div>

          {/* Driver Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{truck.driver.driverName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{formatPhoneNumber(truck.driver.phoneNumber)}</span>
            </div>
          </div>

          {/* Location Info */}
          {truck.currentLatitude && truck.currentLongitude && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Current Location</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {parseFloat(truck.currentLatitude).toFixed(4)}, {parseFloat(truck.currentLongitude).toFixed(4)}
              </div>
            </div>
          )}

          {/* Status Details */}
          {truck.availabilityStatus === 'in_transit' && (
            <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
              🚛 En route to delivery location
            </div>
          )}
          
          {truck.availabilityStatus === 'maintenance' && (
            <div className="p-2 bg-orange-50 rounded text-xs text-orange-700">
              🔧 Scheduled maintenance in progress
            </div>
          )}
          
          {truck.availabilityStatus === 'available' && (
            <div className="p-2 bg-green-50 rounded text-xs text-green-700">
              ✅ Ready for new deliveries
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TruckStatus() {
  const { data: trucks, isLoading, error, refetch } = useTruckInformation();
  const { isConnected, lastUpdate } = useRealTime();

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Truck Status Error</CardTitle>
          <CardDescription>Failed to load truck information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Truck className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p className="text-muted-foreground">Unable to load truck data</p>
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate fleet statistics
  const fleetStats = trucks ? {
    total: trucks.length,
    available: trucks.filter(t => t.availabilityStatus === 'available').length,
    inTransit: trucks.filter(t => t.availabilityStatus === 'in_transit').length,
    maintenance: trucks.filter(t => t.availabilityStatus === 'maintenance').length,
    totalCapacity: trucks.reduce((sum, truck) => sum + truck.capacityKg, 0),
    utilization: trucks.filter(t => t.availabilityStatus === 'in_transit').length / trucks.length * 100,
  } : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Fleet Status
            </CardTitle>
            <CardDescription>
              Real-time truck availability and location tracking
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {isConnected ? 'Live' : 'Offline'}
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Fleet Overview */}
        {fleetStats && !isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{fleetStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Trucks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{fleetStats.available}</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{fleetStats.inTransit}</div>
              <div className="text-xs text-muted-foreground">In Transit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{fleetStats.maintenance}</div>
              <div className="text-xs text-muted-foreground">Maintenance</div>
            </div>
          </div>
        )}

        {/* Fleet Utilization */}
        {fleetStats && !isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fleet Utilization</span>
              <span className="font-medium">{fleetStats.utilization.toFixed(1)}%</span>
            </div>
            <Progress value={fleetStats.utilization} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Capacity: {fleetStats.totalCapacity.toLocaleString()} kg</span>
              {lastUpdate && (
                <span>Updated {formatRelativeTime(new Date(lastUpdate))}</span>
              )}
            </div>
          </div>
        )}

        {/* Truck Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {isLoading ? (
            // Loading skeletons
            [...Array(4)].map((_, i) => (
              <TruckCard key={i} truck={{} as TruckType} isLoading={true} />
            ))
          ) : trucks && trucks.length > 0 ? (
            trucks.map((truck) => (
              <TruckCard key={truck.id} truck={truck} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No trucks found</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!isLoading && trucks && trucks.length > 0 && (
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" className="flex-1">
              <MapPin className="h-4 w-4 mr-2" />
              View on Map
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}