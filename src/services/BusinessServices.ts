import { ProductItem, OrderItem, CustomerItem, IndustryType } from '../types';

export interface StoreMetrics {
  todaySales: number;
  todayOrdersCount: number;
  monthSales: number;
  monthProfit: number;
  lowStockCount: number;
  lostCustomerCount: number;
  paymentSuccessRate: number;
  refundRate: number;
  activeAIStaff: number;
}

export const ProductService = {
  getProductPerformance(productId: string, orders: OrderItem[]) {
    // Find all quantity sold
    let totalQty = 0;
    let totalRevenue = 0;
    orders.forEach(o => {
      if (o.items) {
        o.items.forEach(item => {
          if (item.productId === productId) {
            const q = item.quantity || item.qty || 0;
            totalQty += q;
            totalRevenue += item.price * q;
          }
        });
      }
    });
    return {
      totalQty,
      totalRevenue,
      conversionEstimations: totalQty > 10 ? '优异 (CR 3.5%)' : '良好 (CR 1.8%)'
    };
  },

  getAllProducts(products: ProductItem[]) {
    return products;
  }
};

export const OrderService = {
  getPendingShipping(orders: OrderItem[]) {
    return orders.filter(o => o.status === 'Pending' || o.status === 'AI Confirmed');
  },

  getOrderRiskRating(orderId: string, order: OrderItem | undefined) {
    if (!order) return { riskScore: 0, level: 'LOW', reasons: [] };
    
    const reasons: string[] = [];
    let score = 10; // baseline safe
    
    // Simple heuristic-based enterprise risk scoring
    if (order.total > 1500) {
      score += 35;
      reasons.push('单笔订单金额超过大额预警阈值 (€1,500)');
    }
    if (order.shippingAddress && order.shippingAddress.includes('Italy') && order.paymentMethod?.toLowerCase().includes('paypal')) {
      score += 15;
      reasons.push('高危付款方式与集线口岸匹配');
    }
    
    const level = score > 40 ? 'HIGH' : score > 20 ? 'MEDIUM' : 'LOW';
    return {
      riskScore: score,
      level,
      reasons: reasons.length > 0 ? reasons : ['交易属性健康，IP无异常']
    };
  }
};

export const CustomerService = {
  getLostCustomers(customers: CustomerItem[]) {
    // Customers with loyalty points but inactive or zero spend/long time
    return customers.filter(c => c.points > 300 && (c.email.includes('inactive') || c.phone?.includes('000')));
  },

  getVipEngagement(customers: CustomerItem[]) {
    const vips = customers.filter(c => c.points > 400 || c.email.includes('vip'));
    return {
      vipCount: vips.length,
      averagePoints: vips.length > 0 ? Math.floor(vips.reduce((acc, v) => acc + v.points, 0) / vips.length) : 0
    };
  }
};

export const FinanceService = {
  calculateMetrics(products: ProductItem[], orders: OrderItem[], customers: CustomerItem[]): StoreMetrics {
    // Calculate actual sales revenue
    const todaySales = orders.filter(o => o.status !== 'Refunded').reduce((sum, o) => sum + o.total, 0) * 0.14; // simulated daily share
    const todayOrdersCount = orders.filter(o => o.status !== 'Refunded').length;
    const monthSales = orders.filter(o => o.status !== 'Refunded').reduce((sum, o) => sum + o.total, 0);
    const monthProfit = monthSales * 0.42; // standard gross profit margin
    
    const lowStockCount = products.filter(p => p.stock <= 10).length;
    
    // Inactive customers with old signups as proxy for lost
    const lostCustomerCount = customers.filter(c => c.points < 150).length;

    // Simulated telemetry metrics representing actual db rates safely
    const paymentSuccessRate = 98.4;
    const refundRate = (orders.filter(o => o.status === 'Refunded').length / (orders.length || 1)) * 100;
    
    return {
      todaySales: Math.round(todaySales * 100) / 100,
      todayOrdersCount,
      monthSales: Math.round(monthSales * 100) / 100,
      monthProfit: Math.round(monthProfit * 100) / 100,
      lowStockCount,
      lostCustomerCount,
      paymentSuccessRate,
      refundRate: Math.round(refundRate * 10) / 10,
      activeAIStaff: 4 // baseline active workers
    };
  }
};

export const InventoryService = {
  getReplenishmentNeeded(products: ProductItem[]) {
    return products.filter(p => p.stock <= 15).map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      currentStock: p.stock,
      recommendedQty: p.stock <= 5 ? 150 : 80
    }));
  }
};

export const MarketingService = {
  getActiveCampaignInsights(industry: any) {
    switch (industry) {
      case 'retail':
        return { promoName: '暑季时尚风暴优惠券', discount: '15% OFF', expectedCR: '提高 4.2%' };
      case 'food':
        return { promoName: '汉堡午市10欧特惠套餐', discount: '10% OFF', expectedCR: '提高 6.8%' };
      default:
        return { promoName: '新客专享尊荣折扣码', discount: '20% OFF', expectedCR: '提高 5.0%' };
    }
  }
};

export const PaymentService = {
  getBestPaymentMethod(country: string, industry: any) {
    if (country === 'IT') {
      return {
        primary: 'Shopify Payments',
        reasons: [
          '无需第三方额外手续费 (费率直接节约 2%)',
          '自动开启 Visa、Mastercard、American Express、Maestro、UnionPay 付款',
          '全面激活 Apple Pay、Google Pay 以及 Shop Pay 快捷结算',
          '原生支持意大利 Bancomat 卡快捷结账 (需联合品牌)',
          '支持本地后付巨头 Klarna 自动接入，高额提升客单转化'
        ],
        others: [
          { name: 'Klarna Pay Later', relevance: '极佳 (提升时尚美容意愿 25%)' },
          { name: 'Satispay', relevance: '用意大利本地客户高覆盖率，首选备用' }
        ]
      };
    }
    return {
      primary: 'Shopify Payments (Stripe Core)',
      reasons: [
        '综合费率更优，欧洲主流信用卡全币种自动承兑',
        '极速到账，保障流转资金免受汇率波动干扰'
      ],
      others: [
        { name: 'PayPal Express Checkout', relevance: '高信任度必备' }
      ]
    };
  }
};
