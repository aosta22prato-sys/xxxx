/**
 * Order Service Layer - Level 10 Separation (DEPRECATED)
 * High-performance service abstraction supporting switching between Mock, API, or WebSocket channels.
 */

import { Order } from '../types';
import { ApiService } from './api.service';
import { ServiceProvider } from './product.service';

export class OrderService {
  private static provider: ServiceProvider = 'mock';

  static setProvider(p: ServiceProvider) {
    this.provider = p;
  }

  static getProvider(): ServiceProvider {
    return this.provider;
  }

  static async getOrders(): Promise<Order[]> {
    if (this.provider === 'api') {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }
    
    const stored = localStorage.getItem('shopify_mock_orders');
    if (stored) return JSON.parse(stored);
    return [];
  }

  static async saveOrders(orders: Order[]): Promise<boolean> {
    if (this.provider === 'api') {
      const response = await fetch('/api/commerce/orders/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      });
      return response.ok;
    }

    const res = await ApiService.syncDatabaseSlices('orders', orders);
    return res.success;
  }
}
