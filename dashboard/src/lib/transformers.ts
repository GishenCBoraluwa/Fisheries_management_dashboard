import { Order, PriceHistory } from '@/types/api';

// Transform API Order to FishOrder format
export interface FishOrder {
  orderId: string;
  fishTypeId: string;
  quantityKg: number;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: "confirmed" | "pending" | "delivered" | "cancelled";
}

export function transformOrderToFishOrder(order: Order): FishOrder {
  return {
    orderId: order.id.toString(),
    fishTypeId: order.orderItems?.[0]?.fishTypeId?.toString() || '1',
    quantityKg: parseFloat(order.orderItems?.[0]?.quantityKg || '0'),
    orderDate: order.orderDate,
    deliveryDate: order.deliveryDate,
    totalAmount: parseFloat(order.totalAmount),
    status: mapOrderStatus(order.status),
  };
}

function mapOrderStatus(apiStatus: string): FishOrder['status'] {
  switch (apiStatus) {
    case 'pending': return 'pending';
    case 'delivered': return 'delivered';
    case 'completed': return 'delivered';
    case 'cancelled': return 'cancelled';
    default: return 'confirmed';
  }
}

// Transform API PriceHistory to FishPrice format
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

export function transformPriceHistoryToFishPrice(price: PriceHistory): FishPrice {
  return {
    fishPriceId: price.id.toString(),
    fishTypeId: price.fishTypeId.toString(),
    fishName: price.fishType?.fishName || 'Unknown Fish',
    priceDate: price.priceDate,
    retailPrice: parseFloat(price.retailPrice),
    wholesalePrice: parseFloat(price.wholesalePrice),
    marketDemandLevel: price.marketDemandLevel,
    supplyAvailability: price.supplyAvailability,
  };
}