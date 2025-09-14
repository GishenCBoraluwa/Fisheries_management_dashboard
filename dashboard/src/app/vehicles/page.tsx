'use client';

import { Button } from "@/components/ui/button";
import { Plus, MapPin, Phone, Settings, Fuel } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTruckInformation } from "@/hooks/api/useDashboard";
import { getStatusColor, formatPhoneNumber } from "@/lib/utils";

interface Vehicle {
  id: string;
  licensePlate: string;
  type: 'truck' | 'van' | 'motorcycle';
  capacityKg: number;
  availabilityStatus: 'available' | 'in_transit' | 'maintenance';
  currentLatitude?: string;
  currentLongitude?: string;
  driver: {
    id: string;
    name: string;
    phone: string;
  };
  fuelLevel: number;
  lastMaintenance: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    licensePlate: "CAB-1234",
    type: "truck",
    capacityKg: 1000,
    availabilityStatus: "in_transit",
    currentLatitude: "6.9271",
    currentLongitude: "79.8612",
    driver: {
      id: "1",
      name: "Sunil Perera",
      phone: "+94771234567"
    },
    fuelLevel: 75,
    lastMaintenance: "2025-01-10"
  },
  {
    id: "2",
    licensePlate: "CAB-5678",
    type: "truck",
    capacityKg: 1500,
    availabilityStatus: "available",
    driver: {
      id: "2",
      name: "Kamal Silva",
      phone: "+94777654321"
    },
    fuelLevel: 90,
    lastMaintenance: "2025-01-08"
  },
  {
    id: "3",
    licensePlate: "VAN-9012",
    type: "van",
    capacityKg: 500,
    availabilityStatus: "maintenance",
    driver: {
      id: "3",
      name: "Nimal Fernando",
      phone: "+94712345678"
    },
    fuelLevel: 40,
    lastMaintenance: "2025-01-15"
  }
];

export default function VehiclesPage() {
  const { data: apiTrucks, isLoading } = useTruckInformation();
  
  // Convert API data to local format or use mock data
  const vehicles = apiTrucks?.map(truck => ({
    id: truck.id.toString(),
    licensePlate: truck.licensePlate,
    type: 'truck' as const,
    capacityKg: truck.capacityKg,
    availabilityStatus: truck.availabilityStatus,
    currentLatitude: truck.currentLatitude,
    currentLongitude: truck.currentLongitude,
    driver: {
      id: truck.driver.id.toString(),
      name: truck.driver.driverName,
      phone: truck.driver.phoneNumber
    },
    fuelLevel: Math.floor(Math.random() * 100), // Mock fuel data
    lastMaintenance: "2025-01-10" // Mock maintenance date
  })) || mockVehicles;

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.availabilityStatus === 'available').length,
    inTransit: vehicles.filter(v => v.availabilityStatus === 'in_transit').length,
    maintenance: vehicles.filter(v => v.availabilityStatus === 'maintenance').length,
    totalCapacity: vehicles.reduce((sum, v) => sum + v.capacityKg, 0)
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'truck': return '🚛';
      case 'van': return '🚐';
      case 'motorcycle': return '🏍️';
      default: return '🚗';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">
            Manage and track delivery vehicles
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Map View
          </Button>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Active vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-xs text-muted-foreground">Ready for dispatch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">Currently delivering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.maintenance}</div>
            <p className="text-xs text-muted-foreground">Under service</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCapacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">kg capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getVehicleIcon(vehicle.type)}</span>
                  <div>
                    <CardTitle className="text-lg">{vehicle.licensePlate}</CardTitle>
                    <CardDescription className="capitalize">{vehicle.type}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(vehicle.availabilityStatus)}>
                  {vehicle.availabilityStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Capacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{vehicle.capacityKg.toLocaleString()} kg</span>
                </div>
              </div>

              {/* Driver Info */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Driver</div>
                <div className="space-y-1">
                  <div className="text-sm">{vehicle.driver.name}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {formatPhoneNumber(vehicle.driver.phone)}
                  </div>
                </div>
              </div>

              {/* Fuel Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    <span>Fuel Level</span>
                  </div>
                  <span className="font-medium">{vehicle.fuelLevel}%</span>
                </div>
                <Progress value={vehicle.fuelLevel} className="h-2" />
              </div>

              {/* Location (if available) */}
              {vehicle.currentLatitude && vehicle.currentLongitude && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Location</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {parseFloat(vehicle.currentLatitude).toFixed(4)}, {parseFloat(vehicle.currentLongitude).toFixed(4)}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-3 w-3 mr-1" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
          <CardDescription>Upcoming maintenance for fleet vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vehicles.filter(v => v.availabilityStatus === 'maintenance' || v.fuelLevel < 50).map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getVehicleIcon(vehicle.type)}</span>
                  <div>
                    <div className="font-medium">{vehicle.licensePlate}</div>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.availabilityStatus === 'maintenance' 
                        ? 'Scheduled maintenance' 
                        : 'Low fuel warning'
                      }
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {vehicle.availabilityStatus === 'maintenance' 
                      ? 'In Progress' 
                      : `${vehicle.fuelLevel}% fuel`
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last service: {new Date(vehicle.lastMaintenance).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}