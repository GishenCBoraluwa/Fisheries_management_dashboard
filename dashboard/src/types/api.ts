export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  totalAmount: string;
  deliveryFee: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';
  deliveryAddress: string;
  specialInstructions?: string;
  orderItems: OrderItem[];
  user: User;
  assignedTruck?: { licensePlate: string };
}

export interface OrderItem {
  id: number;
  orderId: number;
  fishTypeId: number;
  quantityKg: string;
  unitPrice: string;
  subtotal: string;
  fishType: FishType;
}

export interface PriceHistory {
  id: number;
  fishTypeId: number;
  priceDate: string;
  retailPrice: string;
  wholesalePrice: string;
  marketDemandLevel: 'low' | 'medium' | 'high';
  supplyAvailability: number;
  isActual: boolean;
  fishType: FishType;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  newCustomers: number;
  activeAccounts: number;
  activeAccountsGrowth: number;
  ongoingTrucks: number;
}

export interface RevenueData {
  month: string;
  currentYear: number;
  previousYear: number;
}

export interface FishType {
  id: number;
  fishName: string;
  scientificName: string;
  category: string;
  averageShelfLifeHours: number;
  storageTemperatureMin: string;
  storageTemperatureMax: string;
  isActive: boolean;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  registrationDate: string;
  isActive: boolean;
}

export interface Truck {
  id: number;
  licensePlate: string;
  capacityKg: number;
  availabilityStatus: 'available' | 'in_transit' | 'maintenance';
  currentLatitude?: string;
  currentLongitude?: string;
  driver: {
    id: number;
    driverName: string;
    phoneNumber: string;
  };
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: 'policy' | 'climate_change' | 'overfishing' | 'iuu_fishing';
  author: string;
  isPublished: boolean;
  publishedAt: string;
  readCount: number;
}

export interface WeatherForecast {
  id: number;
  forecastDate: string;
  location: string;
  latitude: string;
  longitude: string;
  temperature2mMean: string;
  windSpeed10mMax: string;
  precipitationSum: string;
  relativeHumidity2mMean: string;
}