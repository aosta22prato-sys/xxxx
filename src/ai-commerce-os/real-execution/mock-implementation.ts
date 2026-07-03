/**
 * Mock Implementation - 用于测试和演示的模拟实现
 * 
 * 注意：在生产环境，应该替换为真实的 PostgreSQL、API 调用等
 */

import {
  Database,
  QueryResult,
  DatabaseRow,
  ExternalAPI,
  EventBus,
  EventListener,
  ExecutionContext,
} from './core-interfaces';

// ============================================
// Mock Database
// ============================================
export class MockDatabase implements Database {
  private tables: Map<string, Map<string, any>> = new Map();

  constructor() {
    this.initializeTables();
  }

  private initializeTables() {
    const tableNames = [
      'products',
      'orders',
      'order_items',
      'customers',
      'inventory',
      'adCampaigns',
      'priceHistory',
      'inventoryHistory',
      'alerts',
      'financialTransactions',
      'adMetrics',
      'returns',
      'reports',
      'learningRecords',
      'learningCycles',
      'executionResults',
    ];

    for (const name of tableNames) {
      this.tables.set(name, new Map());
    }

    // 初始化示例数据
    this.seedData();
  }

  private seedData() {
    // 示例产品
    this.create('products', {
      id: 'prod-1',
      title: '示例产品1',
      price: 99.99,
      costPrice: 40,
      sku: 'SKU001',
      category: 'Electronics',
      status: 'published',
    });

    this.create('products', {
      id: 'prod-2',
      title: '示例产品2',
      price: 149.99,
      costPrice: 60,
      sku: 'SKU002',
      category: 'Electronics',
      status: 'published',
    });

    // 示例库存
    this.create('inventory', {
      id: 'prod-1',
      productId: 'prod-1',
      quantity: 100,
      reservedQuantity: 10,
      warehouseCapacity: 500,
    });

    this.create('inventory', {
      id: 'prod-2',
      productId: 'prod-2',
      quantity: 150,
      reservedQuantity: 20,
      warehouseCapacity: 500,
    });

    // 示例订单
    for (let i = 1; i <= 10; i++) {
      this.create('orders', {
        id: `ord-${i}`,
        customerId: `cust-${Math.floor(Math.random() * 5) + 1}`,
        total: Math.random() * 500 + 50,
        status: i % 3 === 0 ? 'cancelled' : 'fulfilled',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    // 示例客户
    for (let i = 1; i <= 5; i++) {
      this.create('customers', {
        id: `cust-${i}`,
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      });
    }

    // 示例广告投放
    this.create('adCampaigns', {
      id: 'camp-1',
      platform: 'meta',
      externalCampaignId: 'ext-1',
      budget: 1000,
      status: 'active',
      startDate: new Date(),
    });
  }

  async query<T = any>(
    sql: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    // 简单的 SQL 模拟 - 实际应该调用真实数据库
    console.log(`[Mock DB] Query: ${sql.substring(0, 50)}...`);

    // 模拟查询结果
    if (sql.toLowerCase().includes('select')) {
      return {
        rows: [] as T[],
        count: 0,
      };
    }

    return { rows: [] as T[], count: 0 };
  }

  async create(table: string, data: any): Promise<DatabaseRow> {
    const tableMap = this.tables.get(table);
    if (!tableMap) {
      throw new Error(`Table not found: ${table}`);
    }

    const id = data.id || `${table}-${Date.now()}`;
    const row = { id, ...data, createdAt: data.createdAt || new Date() };

    tableMap.set(id, row);
    console.log(`[Mock DB] Created ${table}: ${id}`);

    return row;
  }

  async read(table: string, id: string): Promise<DatabaseRow | null> {
    const tableMap = this.tables.get(table);
    if (!tableMap) {
      throw new Error(`Table not found: ${table}`);
    }

    return tableMap.get(id) || null;
  }

  async update(table: string, id: string, data: any): Promise<boolean> {
    const tableMap = this.tables.get(table);
    if (!tableMap) {
      throw new Error(`Table not found: ${table}`);
    }

    const existing = tableMap.get(id);
    if (!existing) return false;

    tableMap.set(id, { ...existing, ...data, updatedAt: new Date() });
    console.log(`[Mock DB] Updated ${table}: ${id}`);

    return true;
  }

  async delete(table: string, id: string): Promise<boolean> {
    const tableMap = this.tables.get(table);
    if (!tableMap) {
      throw new Error(`Table not found: ${table}`);
    }

    const existed = tableMap.has(id);
    tableMap.delete(id);

    if (existed) {
      console.log(`[Mock DB] Deleted ${table}: ${id}`);
    }

    return existed;
  }

  async list(
    table: string,
    filters?: any,
    limit?: number
  ): Promise<QueryResult> {
    const tableMap = this.tables.get(table);
    if (!tableMap) {
      throw new Error(`Table not found: ${table}`);
    }

    const rows = Array.from(tableMap.values());
    const limited = rows.slice(0, limit || 100);

    return {
      rows: limited,
      count: rows.length,
    };
  }

  async batch(
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      table: string;
      id?: string;
      data?: any;
    }>
  ): Promise<boolean> {
    for (const op of operations) {
      if (op.type === 'create') {
        await this.create(op.table, op.data);
      } else if (op.type === 'update') {
        await this.update(op.table, op.id!, op.data);
      } else if (op.type === 'delete') {
        await this.delete(op.table, op.id!);
      }
    }

    return true;
  }

  async transaction<T>(
    callback: (db: Database) => Promise<T>
  ): Promise<T> {
    // 简单的事务模拟
    return await callback(this);
  }

  async aggregate(
    table: string,
    aggregation: {
      count?: boolean;
      sum?: string;
      avg?: string;
      max?: string;
      min?: string;
    },
    filters?: any
  ): Promise<any> {
    const tableMap = this.tables.get(table);
    if (!tableMap) {
      throw new Error(`Table not found: ${table}`);
    }

    const values = Array.from(tableMap.values());

    if (aggregation.count) {
      return { count: values.length };
    }

    return {};
  }
}

// ============================================
// Mock External API
// ============================================
export class MockExternalAPI implements ExternalAPI {
  async request(
    method: string,
    url: string,
    data?: any,
    headers?: any
  ): Promise<any> {
    console.log(`[Mock API] ${method} ${url}`);

    return {
      success: true,
      data: {},
      statusCode: 200,
    };
  }

  shopify = {
    getProduct: async () => ({
      success: true,
      data: { id: 'prod-1', title: 'Product', price: 99.99 },
      statusCode: 200,
    }),
    updateProduct: async () => ({
      success: true,
      data: { updated: true },
      statusCode: 200,
    }),
    listProducts: async () => ({
      success: true,
      data: { products: [] },
      statusCode: 200,
    }),
    createOrder: async () => ({
      success: true,
      data: { orderId: 'order-1' },
      statusCode: 200,
    }),
    getOrders: async () => ({
      success: true,
      data: { orders: [] },
      statusCode: 200,
    }),
  };

  tiktokShop = {
    listProducts: async () => ({
      success: true,
      data: { products: [] },
      statusCode: 200,
    }),
    updateProduct: async () => ({
      success: true,
      data: { updated: true },
      statusCode: 200,
    }),
    getOrderMetrics: async () => ({
      success: true,
      data: { metrics: {} },
      statusCode: 200,
    }),
  };

  metaAds = {
    createCampaign: async () => ({
      success: true,
      data: { campaignId: 'camp-1' },
      statusCode: 200,
    }),
    updateCampaign: async () => ({
      success: true,
      data: { updated: true },
      statusCode: 200,
    }),
    getCampaignMetrics: async () => ({
      success: true,
      data: { revenue: 5000, spend: 1000 },
      statusCode: 200,
    }),
  };

  googleAds = {
    createCampaign: async () => ({
      success: true,
      data: { campaignId: 'camp-2' },
      statusCode: 200,
    }),
    updateCampaign: async () => ({
      success: true,
      data: { updated: true },
      statusCode: 200,
    }),
    getCampaignMetrics: async () => ({
      success: true,
      data: { revenue: 3000, spend: 800 },
      statusCode: 200,
    }),
  };
}

// ============================================
// Mock Event Bus
// ============================================
export class MockEventBus implements EventBus {
  private listeners: Map<string, EventListener[]> = new Map();

  async publish<T = any>(eventType: string, data: T): Promise<void> {
    console.log(`[Event] ${eventType}:`, data);

    const eventListeners = this.listeners.get(eventType) || [];

    for (const listener of eventListeners) {
      try {
        await listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    }
  }

  subscribe<T = any>(eventType: string, listener: EventListener<T>): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    this.listeners.get(eventType)!.push(listener);
  }

  unsubscribe(eventType: string, listener: EventListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  getSubscribers(eventType: string): EventListener[] {
    return this.listeners.get(eventType) || [];
  }
}

// ============================================
// Mock Context Factory
// ============================================
export function createMockContext(
  storeId: string = 'store-1',
  tenantId: string = 'tenant-1'
): ExecutionContext {
  return {
    db: new MockDatabase(),
    api: new MockExternalAPI(),
    eventBus: new MockEventBus(),
    executionId: `exec-${Date.now()}`,
    executionTime: Date.now(),
    storeId,
    tenantId,
    log: (message: string, data?: any) => {
      console.log(`[${storeId}] ${message}`, data || '');
    },
    error: (message: string, error?: any) => {
      console.error(`[${storeId}] ${message}`, error || '');
    },
  };
}
