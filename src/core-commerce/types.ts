/**
 * Core Commerce Types - Unified type system
 */

export interface Entity {
  id: string;
  storeId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product extends Entity {
  sku: string;
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  category?: string;
  status: 'active' | 'draft' | 'archived';
  tags?: string[];
  image?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Order extends Entity {
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'partial' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer extends Entity {
  email: string;
  name: string;
  phone?: string;
  totalSpent: number;
  orderCount: number;
  segment?: 'vip' | 'regular' | 'at-risk' | 'dormant' | 'new';
}

export interface StoreConfig {
  id: string;
  tenantId: string;
  name: string;
  timezone: string;
  currency: string;
  language?: string;
  country?: string;
  strategy?: {
    pricingModel?: 'static' | 'dynamic' | 'cost-plus';
    marginTarget?: number;
    maxDiscount?: number;
  };
  supply?: {
    defaultLeadTime?: number;
    replenishmentBuffer?: number;
    minStockThreshold?: number;
  };
  ai?: {
    autoReplenishment?: boolean;
    autoPricing?: boolean;
    autoMarketing?: boolean;
    autonomyLevel?: 'manual' | 'guided' | 'autonomous';
  };
}

export interface StoreState {
  id: string;
  storeId: string;
  tenantId: string;
  inventory?: {
    totalSkus?: number;
    lowStockItems?: number;
    outOfStockItems?: number;
    turnoverDays?: number;
  };
  finance?: {
    cashBalance?: number;
    accountsReceivable?: number;
    accountsPayable?: number;
    profitMargin?: number;
  };
  operations?: {
    pendingOrders?: number;
    shippingOrders?: number;
    processingTime?: number;
    errorRate?: number;
  };
  risks?: Array<{ type: string; severity: 'low' | 'medium' | 'high'; message: string }>;
  opportunities?: Array<{ type: string; impact: string; action: string }>;
  metrics?: {
    totalGMV?: number;
    totalOrders?: number;
    totalCustomers?: number;
    averageOrderValue?: number;
  };
}

export interface EventData {
  type: string;
  timestamp: Date;
  tenantId: string;
  storeId: string;
  data: any;
  source?: string;
  metadata?: Record<string, any>;
}

export interface PricingContext {
  demand?: number;
  inventory?: number;
  competitorPrice?: number;
  costPrice: number;
  elasticity?: number;
}

export interface PricingDecision {
  productId: string;
  originalPrice: number;
  finalPrice: number;
  discount?: number;
  reason: string;
  margin?: number;
  profitability: 'high' | 'medium' | 'low';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type EventType = 
  | 'product:created'
  | 'product:updated'
  | 'product:deleted'
  | 'product:stock-low'
  | 'product:stock-out'
  | 'order:created'
  | 'order:updated'
  | 'order:status-changed'
  | 'customer:created'
  | 'customer:updated'
  | 'price:updated'
  | 'system:error'
  | 'ai:decision-made';
