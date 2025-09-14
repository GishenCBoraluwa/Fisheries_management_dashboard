import { ApiResponse, Order, PriceHistory, DashboardStats, RevenueData, Truck, BlogPost, User, FishType, WeatherForecast } from '@/types/api';

const BASE_URL = 'http://localhost:3001/api/v1';

class ApiClient {
  private async request<T>(endpoint: string, method = 'GET', body?: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Dashboard APIs
  async getDashboardStats() {
    return this.request<DashboardStats>('/dashboard/stats');
  }

  async getRevenueData() {
    return this.request<RevenueData[]>('/dashboard/revenue');
  }

  async getTrucks() {
    return this.request<Truck[]>('/dashboard/trucks');
  }

  async getFishSales() {
    return this.request<{ month: string; sales: number }[]>('/dashboard/fish-sales');
  }

  // Orders APIs
  async getPendingOrders(page = 1, limit = 10) {
    return this.request<Order[]>(`/orders/pending?page=${page}&limit=${limit}`);
  }

  async getLatestTransactions(page = 1, limit = 10) {
    return this.request<Order[]>(`/orders/transactions/latest?page=${page}&limit=${limit}`);
  }

  async getOrderById(id: number) {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(data: any) {
    return this.request<Order>('/orders', 'POST', data);
  }

  // Pricing APIs
  async getPriceHistory(fishTypeId?: number, days = 30) {
    const params = new URLSearchParams();
    if (fishTypeId) params.append('fishTypeId', fishTypeId.toString());
    params.append('days', days.toString());
    return this.request<PriceHistory[]>(`/pricing/history?${params.toString()}`);
  }

  async getCurrentPricePredictions(fishTypeId?: number) {
    const params = fishTypeId ? `?fishTypeId=${fishTypeId}` : '';
    return this.request<PriceHistory[]>(`/pricing/current${params}`);
  }

  // Users APIs
  async getUsers(page = 1, limit = 10) {
    return this.request<User[]>(`/users?page=${page}&limit=${limit}`);
  }

  async getUserById(id: number) {
    return this.request<User>(`/users/${id}`);
  }

  // Blog APIs
  async getBlogPosts(category?: string, page = 1, limit = 10) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    return this.request<BlogPost[]>(`/blog?${params.toString()}`);
  }

  async getBlogPostBySlug(slug: string) {
    return this.request<BlogPost>(`/blog/${slug}`);
  }

  // Fish Types APIs
  async getFishTypes() {
    return this.request<FishType[]>('/fish-types');
  }

  // Weather APIs
  async getWeatherForecasts(location?: string, days = 7) {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    params.append('days', days.toString());
    return this.request<WeatherForecast[]>(`/weather/forecasts?${params.toString()}`);
  }

  async refreshWeatherData() {
    return this.request<any>('/weather/refresh', 'POST');
  }
}

export const apiClient = new ApiClient();