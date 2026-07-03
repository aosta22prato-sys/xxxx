/**
 * Discount Service Layer - Level 10 Separation
 * High-performance service abstraction supporting switching between Mock, API, or WebSocket channels.
 */

import { Discount } from '../types';
import { ApiService } from './api.service';
import { ServiceProvider } from './product.service';

export class DiscountService {
  private static provider: ServiceProvider = 'mock';

  static setProvider(p: ServiceProvider) {
    this.provider = p;
  }

  static getProvider(): ServiceProvider {
    return this.provider;
  }

  static async getDiscounts(): Promise<Discount[]> {
    if (this.provider === 'api') {
      const response = await fetch('/api/admin/discounts');
      if (!response.ok) throw new Error('Failed to fetch discounts');
      return response.json();
    }
    
    const stored = localStorage.getItem('shopify_mock_discounts');
    if (stored) return JSON.parse(stored);
    return [];
  }

  static async saveDiscounts(discounts: Discount[]): Promise<boolean> {
    if (this.provider === 'api') {
      const response = await fetch('/api/admin/discounts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discounts }),
      });
      return response.ok;
    }

    const res = await ApiService.syncDatabaseSlices('discounts', discounts);
    return res.success;
  }
}
