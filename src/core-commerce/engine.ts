/**
 * Core Commerce Engine - Main orchestration
 */

import { Product, Order, Customer, StoreConfig, StoreState, EventData, OrderItem, ApiResponse } from './types';

class EventBusImpl {
  private listeners: Map<string, Set<(event: EventData) => void>> = new Map();
  private history: EventData[] = [];
  private maxHistory = 1000;

  emit(type: string, tenantId: string, storeId: string, data: any, source?: string) {
    const event: EventData = {
      type,
      timestamp: new Date(),
      tenantId,
      storeId,
      data,
      source: source || 'system'
    };

    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Specific type listeners
    if (this.listeners.has(type)) {
      this.listeners.get(type)!.forEach(handler => {
        try {
          handler(event);
        } catch (err) {
          console.error(`Event handler error for ${type}:`, err);
        }
      });
    }

    // Wildcard listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*')!.forEach(handler => {
        try {
          handler(event);
        } catch (err) {
          console.error(`Event handler error for *:`, err);
        }
      });
    }
  }

  subscribe(type: string, handler: (event: EventData) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);

    return () => {
      this.listeners.get(type)?.delete(handler);
    };
  }

  subscribeToAll(handler: (event: EventData) => void) {
    if (!this.listeners.has('*')) {
      this.listeners.set('*', new Set());
    }
    this.listeners.get('*')!.add(handler);

    return () => {
      this.listeners.get('*')?.delete(handler);
    };
  }

  getHistory(limit = 100) {
    return this.history.slice(-limit);
  }
}

export const EventBus = new EventBusImpl();

class StoreEngineImpl {
  private stores: Map<string, { config: StoreConfig; state: StoreState }> = new Map();

  getInstance(config: StoreConfig): StoreState {
    const key = `${config.tenantId}:${config.id}`;

    if (!this.stores.has(key)) {
      this.stores.set(key, {
        config,
        state: {
          id: config.id,
          storeId: config.id,
          tenantId: config.tenantId,
          inventory: {
            totalSkus: 0,
            lowStockItems: 0,
            outOfStockItems: 0,
            turnoverDays: 0
          },
          finance: {
            cashBalance: 0,
            accountsReceivable: 0,
            accountsPayable: 0,
            profitMargin: 0
          },
          operations: {
            pendingOrders: 0,
            shippingOrders: 0,
            processingTime: 0,
            errorRate: 0
          },
          risks: [],
          opportunities: [],
          metrics: {
            totalGMV: 0,
            totalOrders: 0,
            totalCustomers: 0,
            averageOrderValue: 0
          }
        }
      });
    }

    return this.stores.get(key)!.state;
  }

  getConfig(storeId: string, tenantId: string): StoreConfig | null {
    const key = `${tenantId}:${storeId}`;
    return this.stores.get(key)?.config || null;
  }
}

export const StoreEngine = new StoreEngineImpl();

class CommerceEngineImpl {
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private customers: Map<string, Customer> = new Map();

  createProduct(storeId: string, tenantId: string, product: Partial<Product>): Product {
    const id = `prod_${Date.now()}`;
    const newProduct: Product = {
      id,
      storeId,
      tenantId,
      sku: product.sku || `SKU-${Date.now()}`,
      name: product.name || 'Untitled',
      description: product.description || '',
      price: product.price || 0,
      costPrice: product.costPrice || 0,
      stock: product.stock || 0,
      minStock: product.minStock || 10,
      category: product.category || 'General',
      status: product.status || 'draft',
      tags: product.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.products.set(id, newProduct);

    EventBus.emit('product:created', tenantId, storeId, {
      id,
      name: newProduct.name,
      sku: newProduct.sku,
      price: newProduct.price
    }, 'commerce');

    return newProduct;
  }

  getProducts(storeId: string, tenantId?: string): Product[] {
    return Array.from(this.products.values()).filter(p => {
      if (tenantId) {
        return p.storeId === storeId && p.tenantId === tenantId;
      }
      return p.storeId === storeId;
    });
  }

  createOrder(storeId: string, tenantId: string, order: Partial<Order>): Order {
    const id = `ord_${Date.now()}`;
    const newOrder: Order = {
      id,
      storeId,
      tenantId,
      orderNumber: order.orderNumber || `ORD-${Date.now()}`,
      customerId: order.customerId || '',
      items: order.items || [],
      totalAmount: order.totalAmount || 0,
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'unpaid',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.set(id, newOrder);

    EventBus.emit('order:created', tenantId, storeId, {
      id,
      orderNumber: newOrder.orderNumber,
      totalAmount: newOrder.totalAmount
    }, 'commerce');

    return newOrder;
  }

  getOrders(storeId: string, tenantId?: string): Order[] {
    return Array.from(this.orders.values()).filter(o => {
      if (tenantId) {
        return o.storeId === storeId && o.tenantId === tenantId;
      }
      return o.storeId === storeId;
    });
  }

  addCustomer(storeId: string, tenantId: string, customer: Partial<Customer>): Customer {
    const id = `cust_${Date.now()}`;
    const newCustomer: Customer = {
      id,
      storeId,
      tenantId,
      email: customer.email || '',
      name: customer.name || '',
      phone: customer.phone || '',
      totalSpent: customer.totalSpent || 0,
      orderCount: customer.orderCount || 0,
      segment: customer.segment || 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.customers.set(id, newCustomer);

    EventBus.emit('customer:created', tenantId, storeId, {
      id,
      name: newCustomer.name,
      email: newCustomer.email
    }, 'commerce');

    return newCustomer;
  }

  getCustomers(storeId: string, tenantId?: string): Customer[] {
    return Array.from(this.customers.values()).filter(c => {
      if (tenantId) {
        return c.storeId === storeId && c.tenantId === tenantId;
      }
      return c.storeId === storeId;
    });
  }
}

export const CommerceEngine = new CommerceEngineImpl();

export class CoreCommerce {
  static isInitialized(): boolean {
    return true;
  }

  static async init(config: any): Promise<void> {
    console.log('[CoreCommerce] Initialized with config:', config.storeConfig?.name);
    if (config.storeConfig) {
      StoreEngine.getInstance(config.storeConfig);
    }
  }

  static get commerce() {
    return CommerceEngine;
  }

  static get store() {
    return StoreEngine;
  }

  static get events() {
    return EventBus;
  }
}
