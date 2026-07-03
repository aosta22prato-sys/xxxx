import React, { createContext, useContext, useState, useEffect } from 'react';
import { IndustryType } from '../types';
import { AIContext, ShopContext, UserContext, UIContext, PageType, MetricsContext } from '../types/AIContext';
import { aiRuntimeStore } from '../store/aiRuntimeStore';

declare global {
  interface Window {
    AIContext: AIContext;
    AIContextTracker: {
      setProductId: (id: string | undefined) => void;
      setOrderId: (id: string | undefined) => void;
      setCustomerId: (id: string | undefined) => void;
      updateContextDirectly: (patch: Partial<AIContext>) => void;
    };
  }
}

// Industry mapping helpers aligned to the 6 listed in the spec
export function mapIndustry(ind: IndustryType | string): ShopContext['industry'] {
  switch (ind) {
    case 'retail': return 'fashion';
    case 'food': return 'restaurant';
    case 'healthcare': return 'service';
    case 'manufacturing': return 'ecommerce_general';
    // exact matches if already passed in
    case 'restaurant': return 'restaurant';
    case 'fashion': return 'fashion';
    case 'beauty': return 'beauty';
    case 'service': return 'service';
    case 'education': return 'education';
    case 'ecommerce_general': return 'ecommerce_general';
    default: return 'fashion';
  }
}

// Tab/Page mapping helpers mapped to exact production PageType values
export function mapPage(tab: string, details?: { productId?: string, orderId?: string, customerId?: string }): PageType {
  switch (tab) {
    case 'command':
    case 'sales':
      return 'dashboard';
    case 'products':
      return details?.productId ? 'product_detail' : 'products_list';
    case 'orders':
      return details?.orderId ? 'order_detail' : 'orders_list';
    case 'customers':
      return details?.customerId ? 'customer_detail' : 'customers_list';
    case 'marketing':
      return 'marketing';
    case 'payment':
    case 'payments':
      return 'payments';
    case 'finance':
      return 'finance';
    case 'shipping':
    case 'logistics':
      return 'shipping';
    case 'settings':
    case 'employees':
    case 'roles':
    case 'policies':
    case 'online-store':
      return 'settings';
    default:
      return 'dashboard';
  }
}

// State static helpers for country & currency
export function getCountryForIndustry(ind: ShopContext['industry']): string {
  switch (ind) {
    case 'fashion':
    case 'beauty':
      return 'IT';
    case 'restaurant':
      return 'DE';
    case 'service':
      return 'FR';
    case 'education':
      return 'AT';
    default:
      return 'IT';
  }
}

// Get standard tenant-store mapping
export function getTenantInfo(ind: IndustryType | string) {
  const mapped = mapIndustry(ind);
  switch (mapped) {
    case 'fashion':
      return { tenantId: 't_retail', storeId: 'store_retail' };
    case 'restaurant':
      return { tenantId: 't_food', storeId: 'store_food' };
    case 'ecommerce_general':
      return { tenantId: 't_manufacturing', storeId: 'store_manufacturing' };
    case 'service':
      return { tenantId: 't_healthcare', storeId: 'store_healthcare' };
    case 'beauty':
      return { tenantId: 't_service', storeId: 'store_service' };
    case 'education':
      return { tenantId: 't_education', storeId: 'store_education' };
    default:
      return { tenantId: 't_retail', storeId: 'store_retail' };
  }
}

// Keep a backward compatible object that routes to active aiRuntimeStore
export const runtimeContextManager = {
  get currentContext() {
    return aiRuntimeStore.getContext();
  },
  subscribe(listener: (ctx: AIContext) => void) {
    return aiRuntimeStore.subscribe(listener);
  },
  update(patch: Partial<AIContext>) {
    const current = aiRuntimeStore.getContext();
    aiRuntimeStore.setContext({ ...current, ...patch });
  }
};

// Bind window hooks immediately on load to route through store
if (typeof window !== 'undefined') {
  window.AIContext = aiRuntimeStore.getContext();
  window.AIContextTracker = {
    setProductId: (id) => aiRuntimeStore.updateResource({ productId: id }),
    setOrderId: (id) => aiRuntimeStore.updateResource({ orderId: id }),
    setCustomerId: (id) => aiRuntimeStore.updateResource({ customerId: id }),
    updateContextDirectly: (patch) => runtimeContextManager.update(patch)
  };
}

// Create React context for structural bindings in App components
export interface AIContextReactValue {
  aiContext: AIContext;
  updateAIContext: (patch: Partial<AIContext>) => void;
}

export const AIContextReact = createContext<AIContextReactValue | undefined>(undefined);

export const useAIContext = () => {
  const context = useContext(AIContextReact);
  if (!context) {
    throw new Error('useAIContext must be used within an AIContextProvider');
  }
  return context;
};

interface AIContextProviderProps {
  children: React.ReactNode;
  initialIndustry?: IndustryType;
  initialPage?: string;
}

export const ReactAIContextProvider: React.FC<AIContextProviderProps> = ({
  children,
  initialIndustry = 'retail',
  initialPage = 'command'
}) => {
  const [ctx, setCtx] = useState<AIContext>(() => {
    const mappedInd = mapIndustry(initialIndustry);
    const tenantDetails = getTenantInfo(initialIndustry);
    
    const initial: AIContext = {
      shop: {
        tenantId: tenantDetails.tenantId,
        shopId: tenantDetails.storeId,
        shopDomain: 'mystore.myshopify.com',
        shopName: 'AI OS Premium Boutique',
        country: getCountryForIndustry(mappedInd),
        currency: 'EUR',
        primaryLocale: 'it-IT',
        industry: mappedInd,
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
        pageType: mapPage(initialPage)
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
    aiRuntimeStore.setContext(initial);
    return initial;
  });

  // Stay synced with store published changes
  useEffect(() => {
    const unsubscribe = aiRuntimeStore.subscribe((newCtx) => {
      setCtx(newCtx);
    });
    return unsubscribe;
  }, []);

  const updateAIContext = (patch: Partial<AIContext>) => {
    const current = aiRuntimeStore.getContext();
    aiRuntimeStore.setContext({ ...current, ...patch });
  };

  return React.createElement(
    AIContextReact.Provider,
    { value: { aiContext: ctx, updateAIContext } },
    children
  );
};
