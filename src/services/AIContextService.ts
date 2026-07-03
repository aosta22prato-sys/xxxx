import { IndustryType, ProductItem, OrderItem, CustomerItem } from '../types';
import { AIContext, ShopContext, UserContext, UIContext, MetricsContext, ProductContext } from '../types/AIContext';
import { FinanceService } from './BusinessServices';
import { 
  mapIndustry, 
  mapPage, 
  getCountryForIndustry, 
  getTenantInfo 
} from '../context/AIContextProvider';
import { aiRuntimeStore } from '../store/aiRuntimeStore';

export const AIContextService = {
  /**
   * Primary method to gather and construct the complete real-time unified AIContext
   */
  gatherContext(params: {
    industry: IndustryType;
    activeTab: string;
    products: ProductItem[];
    orders: OrderItem[];
    customers: CustomerItem[];
    selectedProductId?: string;
    selectedOrderId?: string;
    selectedCustomerId?: string;
  }): AIContext {
    const {
      industry,
      activeTab,
      products,
      orders,
      customers,
      selectedProductId,
      selectedOrderId,
      selectedCustomerId
    } = params;

    // 1. Mapped industry & tenant info
    const mappedInd = mapIndustry(industry);
    const tenantDetails = getTenantInfo(industry);
    
    // 2. Identify UI and page type based on selection and tab
    const mappedPg = mapPage(activeTab, { 
      productId: selectedProductId, 
      orderId: selectedOrderId, 
      customerId: selectedCustomerId 
    });

    // 3. Build Shop Context
    const shop: ShopContext = {
      tenantId: tenantDetails.tenantId,
      shopId: tenantDetails.storeId,
      shopDomain: `${tenantDetails.storeId}.myshopify.net`,
      shopName: `AI OS ${industry.toUpperCase()} Premium Suite`,
      country: getCountryForIndustry(mappedInd),
      currency: 'EUR',
      primaryLocale: mappedInd === 'fashion' || mappedInd === 'beauty' ? 'it-IT' : 'de-DE',
      industry: mappedInd,
      lifecycleStage: products.length > 15 ? 'mature' : 'growing',
      onlineStoreEnabled: true,
      posEnabled: true
    };

    // 4. Build User Context
    const user: UserContext = {
      userId: 'u_admin',
      role: 'owner',
      permissions: [
        'products.read', 'products.write',
        'orders.read', 'orders.write',
        'finance.read', 'analytics.read',
        'marketing.read', 'payments.read'
      ],
      language: 'zh-CN'
    };

    // 5. Build UI Context
    const ui: UIContext = {
      pageType: mappedPg,
      productId: mappedPg === 'product_detail' ? selectedProductId : undefined,
      orderId: mappedPg === 'order_detail' ? selectedOrderId : undefined,
      customerId: mappedPg === 'customer_detail' ? selectedCustomerId : undefined
    };

    // 6. Calculate real-time metrics using the FinanceService
    const liveMetrics = FinanceService.calculateMetrics(products, orders, customers);
    const metrics: MetricsContext = {
      timeRange: 'today',
      totalSalesToday: liveMetrics.todaySales,
      ordersCountToday: liveMetrics.todayOrdersCount,
      totalSalesThisMonth: liveMetrics.monthSales,
      profitThisMonth: liveMetrics.monthProfit,
      lowStockCount: liveMetrics.lowStockCount,
      churnedCustomersCount: liveMetrics.lostCustomerCount,
      paymentSuccessRate: liveMetrics.paymentSuccessRate,
      refundRate: liveMetrics.refundRate,
      activeAIStaffCount: liveMetrics.activeAIStaff
    };

    // 7. Extract detail object context if pageType is product_detail
    let currentProduct: ProductContext | undefined = undefined;
    if (mappedPg === 'product_detail' && selectedProductId) {
      const pItem = products.find(p => p.id === selectedProductId);
      if (pItem) {
        currentProduct = {
          productId: pItem.id,
          title: pItem.name,
          tags: [pItem.category || 'General'],
          productType: pItem.category || 'Standard Group',
          costPerUnit: Math.round(pItem.price * 0.58 * 100) / 100, // Calculated baseline cost
          currentPrice: pItem.price,
          compareAtPrice: pItem.price > 40 ? Math.round(pItem.price * 1.3 * 100) / 100 : undefined
        };
      }
    }

    // Assemble final structured output
    const aiContext: AIContext = {
      shop,
      user,
      ui,
      metrics,
      currentProduct,
      flags: {
        enableAutoPricing: true,
        enablePaymentAdvisor: true,
        enableFlowSuggestions: true
      }
    };

    // Write to store to keep reactive frontend fully synchronized
    aiRuntimeStore.setContext(aiContext);

    return aiContext;
  }
};
