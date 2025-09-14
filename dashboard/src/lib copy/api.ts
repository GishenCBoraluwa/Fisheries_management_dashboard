import { 
  ApiResponse, 
  Order, 
  CreateOrderRequest, 
  User, 
  FishType, 
  PriceHistory, 
  PricePrediction, 
  AddActualPriceRequest,
  WeatherForecast, 
  DashboardStats, 
  RevenueData, 
  FishSalesData, 
  Truck, 
  BlogPost, 
  UserSettings, 
  HealthCheck,
  PaginationParams,
  OrdersQueryParams,
  PriceHistoryParams,
  WeatherParams,
  BlogQueryParams
} from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return searchParams.toString() ? `?${searchParams.toString()}` : '';
  }

  // Order Management APIs
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<{ order: Order; items: any[] }>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderById(orderId: number): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${orderId}`);
  }

  async getPendingOrders(params: PaginationParams = {}): Promise<ApiResponse<Order[]>> {
    const queryParams = this.buildQueryParams(params);
    return this.request(`/orders/pending${queryParams}`);
  }

  async getLatestTransactions(params: PaginationParams = {}): Promise<ApiResponse<Order[]>> {
    const queryParams = this.buildQueryParams(params);
    return this.request(`/orders/transactions/latest${queryParams}`);
  }

  async getOrdersByStatus(params: OrdersQueryParams = {}): Promise<ApiResponse<Order[]>> {
    const queryParams = this.buildQueryParams(params);
    return this.request(`/dashboard/orders${queryParams}`);
  }

  // Pricing Management APIs
  async getPriceHistory(params: PriceHistoryParams = {}): Promise<ApiResponse<PriceHistory[]>> {
    const queryParams = this.buildQueryParams(params);
    return this.request(`/pricing/history${queryParams}`);
  }

  async getCurrentPredictions(fishTypeId?: number): Promise<ApiResponse<PricePrediction[]>> {
    const queryParams = fishTypeId ? this.buildQueryParams({ fishTypeId }) : '';
    return this.request(`/pricing/current${queryParams}`);
  }

  async addActualPrice(priceData: AddActualPriceRequest): Promise<ApiResponse<PriceHistory>> {
    return this.request('/pricing/actual', {
      method: 'POST',
      body: JSON.stringify(priceData),
    });
  }

  // Dashboard Analytics APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request('/dashboard/stats');
  }

  async getRevenueComparison(): Promise<ApiResponse<RevenueData[]>> {
    return this.request('/dashboard/revenue');
  }

  async getFishSalesData(): Promise<ApiResponse<FishSalesData[]>> {
    return this.request('/dashboard/fish-sales');
  }

  async getTruckInformation(): Promise<ApiResponse<Truck[]>> {
    return this.request('/dashboard/trucks');
  }

  // Weather Management APIs
  async getWeatherForecasts(params: WeatherParams = {}): Promise<ApiResponse<WeatherForecast[]>> {
    const queryParams = this.buildQueryParams(params);
    return this.request(`/weather/forecasts${queryParams}`);
  }

  async refreshWeatherData(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/weather/refresh', {
      method: 'POST',
    });
  }

  // Blog Content Management APIs
  async getBlogPosts(params: BlogQueryParams = {}): Promise<ApiResponse<BlogPost[]>> {
    const queryParams = this.buildQueryParams(params);
    return this.request(`/blog${queryParams}`);
  }

  async getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return this.request(`/blog/${slug}`);
  }

  // Fish Types APIs
  async getAllFishTypes(): Promise<ApiResponse<FishType[]>> {
    return this.request('/fish-types');
  }

  // User Management APIs
  async getAllUsers(params: PaginationParams = {}): Promise<ApiResponse<User[]>> {
    const queryParams = this.buildQueryParams(params);
    return this.request(`/users${queryParams}`);
  }

  async getUserById(userId: number): Promise<ApiResponse<User>> {
    return this.request(`/users/${userId}`);
  }

  // User Settings APIs
  async getUserSettings(userId: number): Promise<ApiResponse<UserSettings>> {
    return this.request(`/settings/${userId}`);
  }

  async updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
    return this.request(`/settings/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // System APIs
  async getHealthCheck(): Promise<ApiResponse<HealthCheck>> {
    return this.request('/health');
  }

  async getApiInfo(): Promise<ApiResponse<{ message: string; endpoints: Record<string, string> }>> {
    return this.request('/');
  }
}

export const apiClient = new ApiClient();