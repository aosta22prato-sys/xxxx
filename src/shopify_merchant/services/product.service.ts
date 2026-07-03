/**
 * Product Service Layer - Level 10 Separation (DEPRECATED)
 * High-performance service abstraction support switching between Mock, API, or WebSocket channels.
 */

import { Product } from '../types';
import { ApiService } from './api.service';

export type ServiceProvider = 'mock' | 'api' | 'socket';

export class ProductService {
  private static provider: ServiceProvider = 'mock';

  static setProvider(p: ServiceProvider) {
    this.provider = p;
  }

  static getProvider(): ServiceProvider {
    return this.provider;
  }

  static async getProducts(): Promise<Product[]> {
    if (this.provider === 'api') {
      const response = await fetch('/api/admin/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
    
    // Fallback: localStorage/Mock
    const stored = localStorage.getItem('shopify_mock_products');
    if (stored) return JSON.parse(stored);
    return [];
  }

  static async saveProducts(products: Product[]): Promise<boolean> {
    if (this.provider === 'api') {
      const response = await fetch('/api/commerce/products/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      });
      return response.ok;
    }

    const res = await ApiService.syncDatabaseSlices('products', products);
    return res.success;
  }

  static async addProduct(product: Product): Promise<boolean> {
    if (this.provider === 'api') {
      const response = await fetch('/api/commerce/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      return response.ok;
    }
    // Local state syncing is typically done via the store, but here we provide helper
    return true;
  }
}
