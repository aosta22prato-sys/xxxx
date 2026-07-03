/******************************************************** 
 * AI Commander OS - 第一阶段 代码结构参考 
 * 可直接作为类型/接口设计蓝本使用 
 ********************************************************/ 
 
 /** 
  * 店铺上下文（来自本系统的虚拟/真实 DB 属性） 
  */ 
 export interface ShopContext { 
   tenantId: string;         // 当前租户ID（SaaS 内部的租户标识） 
   shopId: string;           // 店铺内部ID 
   shopDomain: string;       // 例如 "mystore.myshopify.com" 
   shopName?: string; 
 
   country: string;          // 国家，例如 "IT" 
   currency: string;         // 例如 "EUR" 
   primaryLocale?: string;   // 例如 "it-IT" 
 
   // 定义的 6 大行业 + 兜底 
   industry: 
     | 'restaurant' 
     | 'fashion' 
     | 'beauty' 
     | 'service' 
     | 'education' 
     | 'ecommerce_general' 
     | 'other'; 
 
   // 店铺生命周期阶段（可按创建时间+GMV 粗分） 
   lifecycleStage: 'new' | 'growing' | 'mature'; 
 
   onlineStoreEnabled: boolean; 
   posEnabled: boolean; 
 } 
 
 /** 
  * 当前登录用户上下文 
  */ 
 export interface UserContext { 
   userId: string; 
   role: 'owner' | 'staff' | 'consultant';   // 店主 / 员工 / 顾问 
   permissions: string[];                    // ['products.read', 'orders.write', ...] 
   language: string;                         // 用户界面语言，例如 'zh-CN' 
 } 
 
 /** 
  * 后台页面类型（根据路由自动识别） 
  */ 
 export type PageType = 
   | 'dashboard'        // 智能大盘 
   | 'products_list'    // 商品中心列表 
   | 'product_detail'   // 商品详情 
   | 'orders_list'      // 订单中心 
   | 'order_detail'     // 订单详情 
   | 'customers_list'   // 客户中心 
   | 'customer_detail'  // 客户详情 
   | 'marketing'        // 营销中心 
   | 'payments'         // 支付中心 
   | 'finance'          // 财务中心 
   | 'shipping'         // 物流中心 
   | 'settings';        // 设置中心 
 
 /** 
  * UI 上下文：当前页面 + 当前操作对象 ID 
  */ 
 export interface UIContext { 
   pageType: PageType; 
 
   // 当前详情页对应的主对象ID（存在详情页时必填） 
   productId?: string; 
   orderId?: string; 
   customerId?: string; 
   discountId?: string; 
   flowId?: string; 
   selectedProductIds?: string[];
 
   // 如有需要，可以扩展筛选条件 / 视图参数 
   filters?: Record<string, any>; 
   viewMeta?: Record<string, any>; 
 } 
 
 /** 
  * 关键经营指标（每次 AI 请求前从真实数据库查询） 
  */ 
 export interface MetricsContext { 
   timeRange: 'today' | 'last_7_days' | 'last_30_days' | 'this_month'; 
 
   from?: string; // ISO 时间，可选 
   to?: string; 
 
   // 核心 KPI 
   totalSalesToday?: number;      // 今日销售额 
   ordersCountToday?: number;     // 今日订单数 
 
   totalSalesThisMonth?: number;  // 本月销售额 
   profitThisMonth?: number;      // 本月利润（毛利或近似利润） 
 
   lowStockCount?: number;        // 库存预警SKU数量 
   churnedCustomersCount?: number;// 流失客户数（比如 90 天未购买） 
 
   paymentSuccessRate?: number;   // 支付成功率（0-100） 
   refundRate?: number;           // 退款率（0-100） 
 
   activeAIStaffCount?: number;   // 活跃AI员工数量（如果当前系统有这个概念） 
  } 
  
  /** 
   * 产品级上下文（当处于商品详情页时，可提前注入简单信息） 
   */ 
  export interface ProductContext { 
    productId: string; 
    title?: string; 
    tags?: string[]; 
    productType?: string; 
    costPerUnit?: number;      // 该商品成本价（来自 SaaS DB） 
    currentPrice?: number; 
    compareAtPrice?: number; 
  } 
  
  /** 
   * 功能开关（Feature Flags，可选） 
   */ 
  export interface FeatureFlags { 
    enableAutoPricing: boolean; 
    enablePaymentAdvisor: boolean; 
    enableFlowSuggestions: boolean; 
    [key: string]: boolean; 
  } 
  
  /** 
   * AI 完整上下文对象 
   * —— 所有 AI 请求在进 LLM 前都必须构造这个对象 
   */ 
  export interface AIContext { 
    shop: ShopContext; 
    user: UserContext; 
    ui: UIContext; 
  
    metrics?: MetricsContext; 
    currentProduct?: ProductContext; 
    flags?: FeatureFlags; 
  } 
  
  /** 
   * Runtime Context Service 的入参定义 
   */ 
  export interface BuildAIContextParams { 
    tenantId: string;      // 从鉴权 / session 拿 
    userId: string;        // 从鉴权 / session 拿 
    currentRoute: string;  // 前端传入当前路由，如 "/products/123" 
  } 
