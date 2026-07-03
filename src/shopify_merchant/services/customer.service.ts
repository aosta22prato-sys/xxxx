/**
 * Customer Service Layer - Level 10 Separation (DEPRECATED)
 * High-performance service abstraction supporting switching between Mock, API, or WebSocket channels.
 */

import { Customer } from '../types';
import { ApiService } from './api.service';
import { ServiceProvider } from './product.service';

export class CustomerService {
  private static provider: ServiceProvider = 'mock';

  static setProvider(p: ServiceProvider) {
    this.provider = p;
  }

  static getProvider(): ServiceProvider {
    return this.provider;
  }

  static async getCustomers(): Promise<Customer[]> {
    if (this.provider === 'api') {
      const response = await fetch('/api/admin/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    }
    
    const stored = localStorage.getItem('shopify_mock_customers');
    if (stored) return JSON.parse(stored);
    return [];
  }

  static async saveCustomers(customers: Customer[]): Promise<boolean> {
    if (this.provider === 'api') {
      const response = await fetch('/api/commerce/customers/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customers }),
      });
      return response.ok;
    }

    const res = await ApiService.syncDatabaseSlices('customers', customers);
    return res.success;
  }
}
