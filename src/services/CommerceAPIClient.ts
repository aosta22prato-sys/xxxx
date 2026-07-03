/**
 * Commerce API Client
 * Unified interface for all /api/commerce/* endpoints
 * Replaces legacy ProductService, CustomerService, OrderService
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class CommerceAPIClient {
  private baseUrl: string;
  private storeId: string;
  private tenantId: string;

  constructor(baseUrl = '', storeId = 'store_default', tenantId = 'tenant_default') {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    this.storeId = storeId;
    this.tenantId = tenantId;
  }

  /**
   * Set store and tenant context
   */
  setContext(storeId: string, tenantId: string): void {
    this.storeId = storeId;
    this.tenantId = tenantId;
  }

  /**
   * Make HTTP request with store/tenant headers
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': this.storeId,
          'x-tenant-id': this.tenantId,
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}/api/commerce${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'API request failed' };
      }

      return data as ApiResponse<T>;
    } catch (error) {
      return {
        success: false,
        error: `Request failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Health check
   */
  async health(): Promise<ApiResponse<{ status: string }>> {
    return this.request('/health', 'GET');
  }

  // ============================================================
  // PRODUCT OPERATIONS
  // ============================================================

  /**
   * Create a product
   */
  async createProduct(product: {
    sku: string;
    name: string;
    price: number;
    costPrice?: number;
    stock?: number;
    category?: string;
    description?: string;
    tags?: string[];
  }): Promise<ApiResponse<any>> {
    return this.request('/products', 'POST', product);
  }

  /**
   * Get all products for current store/tenant
   */
  async getProducts(): Promise<ApiResponse<any[]>> {
    const response = await this.request<any[]>('/products', 'GET');
    return {
      ...response,
      data: response.data || [],
    };
  }

  /**
   * Save products (batch update) - DEPRECATED
   * Use createProduct, updateProduct individually instead
   * Kept for backwards compatibility
   */
  async saveProducts(products: any[]): Promise<boolean> {
    console.warn(
      '[CommerceAPIClient] saveProducts() is deprecated. Use createProduct() or updateProduct() instead.'
    );
    // Since API doesn't support batch update yet, create missing products
    const existing = await this.getProducts();
    const existingIds = new Set((existing.data || []).map((p) => p.id));

    for (const product of products) {
      if (!existingIds.has(product.id)) {
        await this.createProduct(product);
      }
    }

    return true;
  }

  // ============================================================
  // ORDER OPERATIONS
  // ============================================================

  /**
   * Create an order
   */
  async createOrder(order: {
    customerId?: string;
    orderNumber: string;
    items: any[];
    total?: number;
  }): Promise<ApiResponse<any>> {
    return this.request('/orders', 'POST', order);
  }

  /**
   * Get all orders for current store/tenant
   */
  async getOrders(): Promise<ApiResponse<any[]>> {
    const response = await this.request<any[]>('/orders', 'GET');
    return {
      ...response,
      data: response.data || [],
    };
  }

  // ============================================================
  // CUSTOMER OPERATIONS
  // ============================================================

  /**
   * Create a customer
   */
  async createCustomer(customer: {
    name: string;
    email?: string;
    phone?: string;
    tags?: string[];
  }): Promise<ApiResponse<any>> {
    return this.request('/customers', 'POST', customer);
  }

  /**
   * Get all customers for current store/tenant
   */
  async getCustomers(): Promise<ApiResponse<any[]>> {
    const response = await this.request<any[]>('/customers', 'GET');
    return {
      ...response,
      data: response.data || [],
    };
  }

  /**
   * Save customers (batch) - DEPRECATED
   * Kept for backwards compatibility
   */
  async saveCustomers(customers: any[]): Promise<boolean> {
    console.warn(
      '[CommerceAPIClient] saveCustomers() is deprecated. Use createCustomer() instead.'
    );
    // Since API doesn't support batch update yet, create missing customers
    const existing = await this.getCustomers();
    const existingIds = new Set((existing.data || []).map((c) => c.id));

    for (const customer of customers) {
      if (!existingIds.has(customer.id)) {
        await this.createCustomer(customer);
      }
    }

    return true;
  }

  // ============================================================
  // EVENT OPERATIONS
  // ============================================================

  /**
   * Get event history
   */
  async getEvents(limit = 100): Promise<ApiResponse<any[]>> {
    const response = await this.request<any[]>(`/events?limit=${limit}`, 'GET');
    return {
      ...response,
      data: response.data || [],
    };
  }
}

// Export singleton instance
export const commerceAPI = new CommerceAPIClient();

// Export class for testing/custom instances
export default CommerceAPIClient;
