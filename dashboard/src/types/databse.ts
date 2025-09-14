// Core database types for the application
export interface FishOrder {
  orderId: string;
  fishTypeId: string;
  quantityKg: number;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: "confirmed" | "pending" | "delivered" | "cancelled";
}

export interface FishPrice {
  fishPriceId: string;
  fishTypeId: string;
  fishName: string;
  priceDate: string;
  retailPrice: number;
  wholesalePrice: number;
  marketDemandLevel: "high" | "medium" | "low";
  supplyAvailability: number;
}

export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'mobile_payment';
  transactionDate: string;
  description: string;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  type: 'truck' | 'van' | 'motorcycle';
  capacityKg: number;
  status: 'available' | 'in_transit' | 'maintenance';
  driver: {
    id: string;
    name: string;
    phone: string;
  };
  fuelLevel: number;
  lastMaintenance: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: 'policy' | 'climate_change' | 'overfishing' | 'iuu_fishing';
  author: string;
  publishedAt: string;
  readCount: number;
  isPublished: boolean;
}