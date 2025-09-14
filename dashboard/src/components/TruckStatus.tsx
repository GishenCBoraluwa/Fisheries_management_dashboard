'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApi } from '@/hooks/useApi';
import { cn } from '@/lib/utils';

export function TruckStatus() {
  const { useTrucks } = useApi();
  const { data: trucks, isLoading } = useTrucks();

  if (isLoading) return <div>Loading trucks...</div>;

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Active Trucks</h1>
      <div className="flex flex-col gap-2">
        {trucks?.map((truck) => (
          <Card key={truck.id} className="flex-row items-center justify-between gap-4 p-4">
            <CardHeader className="p-0">
              <CardTitle className="text-sm font-medium">{truck.licensePlate}</CardTitle>
              <p className="text-xs text-muted-foreground">{truck.driver.driverName}</p>
            </CardHeader>
            <CardContent className="p-0">
              <Badge
                className={cn(
                  truck.availabilityStatus === 'in_transit' && 'bg-blue-100 text-blue-800',
                  truck.availabilityStatus === 'available' && 'bg-green-100 text-green-800',
                  truck.availabilityStatus === 'maintenance' && 'bg-yellow-100 text-yellow-800'
                )}
              >
                {truck.availabilityStatus.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}