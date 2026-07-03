/**
 * Core System Interfaces - 真实执行层基础接口
 * 
 * 这些接口定义了 AI Commerce OS 与真实业务系统的交互方式
 * 每个接口都必须有真实实现
 */

// ============================================
// 1. Database Interface (真实数据库层)
// ============================================
export interface DatabaseRow {
  id?: string;
  [key: string]: any;
}

export interface QueryResult<T = any> {
  rows: T[];
  count: number;
  error?: string;
}

export interface Database {
  // 通用查询
  query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
  
  // CRUD 操作
  create(table: string, data: any): Promise<DatabaseRow>;
  read(table: string, id: string): Promise<DatabaseRow | null>;
  update(table: string, id: string, data: any): Promise<boolean>;
  delete(table: string, id: string): Promise<boolean>;
  
  // 列表查询
  list(table: string, filters?: any, limit?: number): Promise<QueryResult>;
  
  // 批量操作
  batch(operations: Array<{ type: 'create' | 'update' | 'delete'; table: string; id?: string; data?: any }>): Promise<boolean>;
  
  // 事务
  transaction<T>(callback: (db: Database) => Promise<T>): Promise<T>;
  
  // 汇总/分析
  aggregate(table: string, aggregation: { count?: boolean; sum?: string; avg?: string; max?: string; min?: string }, filters?: any): Promise<any>;
}

// ============================================
// 2. External API Interface (外部系统接口)
// ============================================
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface ExternalAPI {
  // Shopify API
  shopify: {
    getProduct(productId: string): Promise<APIResponse>;
    updateProduct(productId: string, data: any): Promise<APIResponse>;
    listProducts(filters?: any): Promise<APIResponse>;
    createOrder(data: any): Promise<APIResponse>;
    getOrders(filters?: any): Promise<APIResponse>;
  };
  
  // TikTok Shop API
  tiktokShop: {
    listProducts(filters?: any): Promise<APIResponse>;
    updateProduct(productId: string, data: any): Promise<APIResponse>;
    getOrderMetrics(dateRange?: any): Promise<APIResponse>;
  };
  
  // Meta Ads API
  metaAds: {
    createCampaign(data: any): Promise<APIResponse>;
    updateCampaign(campaignId: string, data: any): Promise<APIResponse>;
    getCampaignMetrics(campaignId: string): Promise<APIResponse>;
  };
  
  // Google Ads API
  googleAds: {
    createCampaign(data: any): Promise<APIResponse>;
    updateCampaign(campaignId: string, data: any): Promise<APIResponse>;
    getCampaignMetrics(campaignId: string): Promise<APIResponse>;
  };
  
  // Generic HTTP
  request(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any, headers?: any): Promise<APIResponse>;
}

// ============================================
// 3. Event Bus (事件总线)
// ============================================
export type EventListener<T = any> = (data: T) => Promise<void>;

export interface EventBus {
  // 发布事件
  publish<T = any>(eventType: string, data: T): Promise<void>;
  
  // 订阅事件
  subscribe<T = any>(eventType: string, listener: EventListener<T>): void;
  unsubscribe(eventType: string, listener: EventListener): void;
  
  // 获取所有订阅者
  getSubscribers(eventType: string): EventListener[];
}

// ============================================
// 4. Execution Context (执行上下文)
// ============================================
export interface ExecutionContext {
  db: Database;
  api: ExternalAPI;
  eventBus: EventBus;
  
  // 执行流跟踪
  executionId: string;
  executionTime: number;
  storeId: string;
  tenantId: string;
  
  // 日志
  log(message: string, data?: any): void;
  error(message: string, error?: any): void;
}

// ============================================
// 5. Tool Interface (工具接口)
// ============================================
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  rowsAffected?: number;
}

export interface Tool {
  name: string;
  description: string;
  category: 'product' | 'order' | 'customer' | 'inventory' | 'marketing' | 'finance' | 'logistics' | 'analytics' | 'integration' | 'admin';
  parameters: ToolParameter[];
  
  // 关键：真实执行方法
  execute(ctx: ExecutionContext, params: any): Promise<ToolResult>;
  
  // 可选：预检查
  validate?(params: any): boolean;
  
  // 可选：权限检查
  requiresPermission?(permission: string): boolean;
}

// ============================================
// 6. Business State Model (业务状态模型)
// ============================================
export interface BusinessState {
  // 销售数据
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
    ytd: number;
  };
  
  // 利润数据
  profit: {
    absolute: number;
    margin: number;
    costOfGoods: number;
  };
  
  // 库存数据
  inventory: {
    totalSKUs: number;
    totalUnits: number;
    warehouseCapacity: number;
    turnoverRate: number;
    daysSalesOfInventory: number;
  };
  
  // 客户数据
  customers: {
    totalCount: number;
    newThisMonth: number;
    repeatRate: number;
    avgLifetimeValue: number;
    churnRate: number;
  };
  
  // 订单数据
  orders: {
    totalCount: number;
    pendingCount: number;
    fulfilledCount: number;
    cancelledCount: number;
    avgOrderValue: number;
    conversionRate: number;
  };
  
  // 营销数据
  marketing: {
    adsSpend: number;
    adsROI: number;
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    activeCampaigns: number;
  };
  
  // 物流数据
  logistics: {
    avgShippingTime: number;
    shippingCost: number;
    deliverySuccessRate: number;
    returnRate: number;
  };
  
  // 时间戳
  timestamp: number;
}

// ============================================
// 7. Execution Plan (执行计划)
// ============================================
export interface ExecutionAction {
  id: string;
  tool: string;
  params: any;
  priority: 'high' | 'medium' | 'low';
  dependsOn?: string[]; // 依赖的action id
  expectedOutcome?: string;
}

export interface ExecutionPlan {
  planId: string;
  goal: string;
  actions: ExecutionAction[];
  createdAt: number;
  priority: 'high' | 'medium' | 'low';
  estimatedDurationMinutes: number;
}

// ============================================
// 8. Execution Result (执行结果)
// ============================================
export interface ExecutionMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  successCount: number;
  failureCount: number;
  totalActions: number;
  successRate: number;
}

export interface ExecutionResult {
  executionId: string;
  planId: string;
  goal: string;
  status: 'success' | 'partial' | 'failed';
  actionResults: Array<{
    action: string;
    success: boolean;
    result?: any;
    error?: string;
  }>;
  metrics: ExecutionMetrics;
  timestamp: number;
}

// ============================================
// 9. Learning Record (学习记录)
// ============================================
export interface LearningRecord {
  id: string;
  actionType: string;
  context: Partial<BusinessState>;
  result: ExecutionResult;
  performanceDelta: {
    revenueChange: number;
    profitChange: number;
    customerChange: number;
  };
  weight: number; // 0-1, based on success
  timestamp: number;
}

// ============================================
// 10. Agent (智能体)
// ============================================
export interface Agent {
  id: string;
  name: string;
  role: 'CEO' | 'CMO' | 'CFO' | 'COO' | 'CTO';
  objectives: string[];
  toolsAvailable: string[];
  decisionPolicy: (state: BusinessState) => ExecutionAction[];
}
