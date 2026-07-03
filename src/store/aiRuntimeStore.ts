import { 
  AIContext, 
  ShopContext, 
  UserContext, 
  UIContext, 
  PageType, 
  MetricsContext, 
  BuildAIContextParams 
} from '../types/AIContext';

// Safe default context
const initialContext: AIContext = {
  shop: {
    tenantId: 't_retail',
    shopId: 'store_retail',
    shopDomain: 'mystore.myshopify.com',
    shopName: 'AI OS Premium Boutique',
    country: 'IT',
    currency: 'EUR',
    primaryLocale: 'it-IT',
    industry: 'fashion',
    lifecycleStage: 'growing',
    onlineStoreEnabled: true,
    posEnabled: true
  },
  user: {
    userId: 'u_admin',
    role: 'owner',
    permissions: ['products.read', 'orders.read', 'finance.read', 'analytics.read'],
    language: 'zh-CN'
  },
  ui: {
    pageType: 'dashboard'
  },
  metrics: {
    timeRange: 'today',
    totalSalesToday: 1240,
    ordersCountToday: 8,
    totalSalesThisMonth: 18450,
    profitThisMonth: 7750,
    lowStockCount: 3,
    churnedCustomersCount: 14,
    paymentSuccessRate: 98.4,
    refundRate: 2.1,
    activeAIStaffCount: 4
  }
};

let currentContext: AIContext = { ...initialContext };
const listeners: Array<(ctx: AIContext) => void> = [];

export const aiRuntimeStore = {
  /**
   * Overwrite/set the entire context
   */
  setContext(ctx: AIContext) {
    currentContext = { ...ctx };
    this._syncAndNotify();
  },

  /**
   * Update the current active page
   */
  updatePage(pageType: PageType) {
    currentContext.ui.pageType = pageType;
    // Auto-clear unrelated resource IDs when changing pages to keep context clean and relevant
    if (pageType !== 'product_detail') currentContext.ui.productId = undefined;
    if (pageType !== 'order_detail') currentContext.ui.orderId = undefined;
    if (pageType !== 'customer_detail') currentContext.ui.customerId = undefined;
    
    this._syncAndNotify();
  },

  /**
   * Update the current focus industry (with optional country/currency overrides if desired)
   */
  updateIndustry(industry: ShopContext['industry']) {
    currentContext.shop.industry = industry;
    
    // Auto map standard default country/currency for specific industries
    switch (industry) {
      case 'fashion':
      case 'beauty':
        currentContext.shop.country = 'IT';
        currentContext.shop.currency = 'EUR';
        break;
      case 'restaurant':
        currentContext.shop.country = 'DE';
        currentContext.shop.currency = 'EUR';
        break;
      case 'service':
        currentContext.shop.country = 'FR';
        currentContext.shop.currency = 'EUR';
        break;
      case 'education':
        currentContext.shop.country = 'AT';
        currentContext.shop.currency = 'EUR';
        break;
      case 'ecommerce_general':
        currentContext.shop.country = 'IT';
        currentContext.shop.currency = 'EUR';
        break;
      default:
        currentContext.shop.country = 'IT';
        currentContext.shop.currency = 'EUR';
    }

    this._syncAndNotify();
  },

  /**
   * Update focused resource IDs (productId, orderId, customerId)
   */
  updateResource(patch: { productId?: string; orderId?: string; customerId?: string }) {
    if ('productId' in patch) currentContext.ui.productId = patch.productId;
    if ('orderId' in patch) currentContext.ui.orderId = patch.orderId;
    if ('customerId' in patch) currentContext.ui.customerId = patch.customerId;
    
    this._syncAndNotify();
  },

  /**
   * Retrieve the current live copy of the context
   */
  getContext(): AIContext {
    return { ...currentContext };
  },

  /**
   * Subscribe to context changes (useful for React bindings)
   */
  subscribe(listener: (ctx: AIContext) => void): () => void {
    listeners.push(listener);
    // Emit initial
    listener({ ...currentContext });
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },

  /**
   * Private internal helper to keep window.AIContext exact and trigger listener callbacks
   */
  _syncAndNotify() {
    if (typeof window !== 'undefined') {
      window.AIContext = { ...currentContext };
    }
    listeners.forEach(l => {
      try {
        l({ ...currentContext });
      } catch (e) {
        console.error('Error notifying AI Runtime context listener:', e);
      }
    });
  }
};

/**
 * Runtime Context Service 对外主方法
 * 负责：
 * 1. 基于 tenantId / userId / route 加载 ShopContext / UserContext / UIContext
 * 2. 从真实数据库/指标源加载 MetricsContext
 */
export async function buildAIContext(
  params: BuildAIContextParams
): Promise<AIContext> {
  const { tenantId, userId, currentRoute } = params;

  const pageType = derivePageTypeFromRoute(currentRoute);
  const resourceParams = extractRouteParams(currentRoute, pageType);

  const industry = (tenantId.includes('food') || tenantId.includes('restaurant')) ? 'restaurant' 
                 : tenantId.includes('beauty') ? 'beauty'
                 : tenantId.includes('service') ? 'service'
                 : tenantId.includes('education') ? 'education'
                 : tenantId.includes('manufacturing') ? 'ecommerce_general'
                 : 'fashion';

  const shop: ShopContext = {
    tenantId,
    shopId: `store_${industry}`,
    shopDomain: `mystore.myshopify.com`,
    shopName: `AI OS ${industry.toUpperCase()} Merchant`,
    country: (industry === 'fashion' || industry === 'beauty') ? 'IT' : 'DE',
    currency: 'EUR',
    primaryLocale: (industry === 'fashion' || industry === 'beauty') ? 'it-IT' : 'de-DE',
    industry,
    lifecycleStage: 'growing',
    onlineStoreEnabled: true,
    posEnabled: true
  };

  const user: UserContext = {
    userId,
    role: 'owner',
    permissions: ['products.read', 'orders.read', 'finance.read'],
    language: 'zh-CN'
  };

  const ui: UIContext = {
    pageType,
    ...resourceParams
  };

  const metrics: MetricsContext = {
    timeRange: 'today',
    totalSalesToday: 1240,
    ordersCountToday: 8,
    totalSalesThisMonth: 18450,
    profitThisMonth: 7750,
    lowStockCount: 3,
    churnedCustomersCount: 14,
    paymentSuccessRate: 98.4,
    refundRate: 2.1,
    activeAIStaffCount: 4
  };

  return {
    shop,
    user,
    ui,
    metrics
  };
}

// Utility mapper: Route pattern matching for Task 2.1
function derivePageTypeFromRoute(route: string): PageType {
  const cleanRoute = route.split('?')[0];
  if (cleanRoute.startsWith('/products/') && cleanRoute !== '/products') return 'product_detail';
  if (cleanRoute === '/products') return 'products_list';
  if (cleanRoute.startsWith('/orders/') && cleanRoute !== '/orders') return 'order_detail';
  if (cleanRoute === '/orders') return 'orders_list';
  if (cleanRoute.startsWith('/customers/') && cleanRoute !== '/customers') return 'customer_detail';
  if (cleanRoute === '/customers') return 'customers_list';
  if (cleanRoute === '/marketing') return 'marketing';
  if (cleanRoute === '/payments' || cleanRoute === '/payment') return 'payments';
  if (cleanRoute === '/finance') return 'finance';
  if (cleanRoute === '/shipping') return 'shipping';
  if (cleanRoute === '/settings') return 'settings';
  return 'dashboard';
}

function extractRouteParams(route: string, pageType: PageType): Partial<UIContext> {
  const parts = route.split('?')[0].split('/').filter(Boolean);
  if (pageType === 'product_detail' && parts[1]) {
    return { productId: parts[1] };
  }
  if (pageType === 'order_detail' && parts[1]) {
    return { orderId: parts[1] };
  }
  if (pageType === 'customer_detail' && parts[1]) {
    return { customerId: parts[1] };
  }
  return {};
}

declare global {
  interface Window {
    AIContext: AIContext;
    aiRuntimeStore: typeof aiRuntimeStore;
  }
}

if (typeof window !== 'undefined') {
  window.AIContext = currentContext;
  window.aiRuntimeStore = aiRuntimeStore;
}
