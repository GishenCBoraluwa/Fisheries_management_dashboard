// API Response wrapper
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

// User types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  registrationDate: string;
  isActive: boolean;
  createdAt: string;
  orders?: Order[];
}

// Fish types
export interface FishType {
  id: number;
  fishName: string;
  scientificName: string;
  category: string;
  averageShelfLifeHours: number;
  storageTemperatureMin?: string;
  storageTemperatureMax?: string;
  isActive: boolean;
  createdAt?: string;
}

// Order types
export interface OrderItem {
  id: number;
  orderId?: number;
  fishTypeId: number;
  quantityKg: string;
  unitPrice: string;
  subtotal: string;
  fishType?: FishType;
}

export interface CreateOrderItem {
  fishTypeId: number;
  quantityKg: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  deliveryDate: string;
  deliveryTimeSlot: string;
  totalAmount: string;
  deliveryFee?: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';
  deliveryAddress?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  freshnessRequirementHours?: number;
  specialInstructions?: string;
  createdAt: string;
  updatedAt?: string;
  orderItems?: OrderItem[];
  user?: User;
  assignedTruck?: Truck;
  statusHistory?: OrderStatusHistory[];
}

export interface CreateOrderRequest {
  userId: number;
  deliveryDate: string;
  deliveryTimeSlot: string;
  freshnessRequirementHours?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  deliveryAddress: string;
  orderItems: CreateOrderItem[];
  specialInstructions?: string;
}

export interface OrderStatusHistory {
  status: string;
  statusDate: string;
  notes?: string;
}

// Pricing types
export interface PriceHistory {
  id: number;
  fishTypeId: number;
  priceDate: string;
  retailPrice: string;
  wholesalePrice: string;
  marketDemandLevel: 'low' | 'medium' | 'high';
  supplyAvailability: number;
  isActual: boolean;
  createdAt: string;
  fishType?: FishType;
}

export interface PricePrediction {
  id: number;
  fishTypeId: number;
  predictionDate: string;
  retailPrice: string;
  wholesalePrice: string;
  confidence: string;
  generatedAt: string;
  fishType?: FishType;
}

export interface AddActualPriceRequest {
  fishTypeId: number;
  priceDate: string;
  retailPrice: number;
  wholesalePrice: number;
  marketDemandLevel: 'low' | 'medium' | 'high';
  supplyAvailability: number;
}

// Weather types
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
  createdAt: string;
}

// Dashboard types
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

export interface FishSalesData {
  month: string;
  sales: number;
}

// Driver and Truck types
export interface Driver {
  id: number;
  driverName: string;
  phoneNumber: string;
}

export interface Truck {
  id: number;
  licensePlate: string;
  capacityKg: number;
  availabilityStatus: 'available' | 'in_transit' | 'maintenance';
  currentLatitude?: string;
  currentLongitude?: string;
  driver: Driver;
}

// Blog types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt: string;
  category: 'policy' | 'climate_change' | 'overfishing' | 'iuu_fishing';
  tags: string[];
  author: string;
  isPublished: boolean;
  publishedAt: string;
  readCount: number;
  createdAt: string;
  updatedAt?: string;
}

// Settings types
export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  preferences: {
    currency: string;
    language: string;
    timezone: string;
  };
  delivery: {
    defaultAddress: string;
    preferredTimeSlot: string;
    specialInstructions: string;
  };
}

// Query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface OrdersQueryParams extends PaginationParams {
  status?: string;
}

export interface PriceHistoryParams extends PaginationParams {
  fishTypeId?: number;
  days?: number;
}

export interface WeatherParams extends PaginationParams {
  location?: string;
  days?: number;
}

export interface BlogQueryParams extends PaginationParams {
  category?: string;
}

// Health check
export interface HealthCheck {
  message: string;
  timestamp: string;
  uptime: number;
  environment: string;
}