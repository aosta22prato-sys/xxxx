/**
 * Business Rules Library - Pre-defined Commerce Rules
 * Common patterns and strategies for online commerce
 */

import { BusinessRule, ActionRecord } from './business-brain';

/**
 * Inventory Management Rules
 */
export const inventoryRules = {
  /**
   * Low inventory alert - trigger replenishment
   */
  lowInventoryAlert: (): BusinessRule => ({
    id: 'rule_inventory_low_stock',
    name: 'Low Inventory Alert',
    description: 'Automatically triggers stock replenishment when inventory falls below threshold',
    priority: 90,
    enabled: true,
    condition: (data) => data.currentStock < data.thresholdStock,
    action: async (data) => [
      {
        id: `action_restock_${Date.now()}`,
        tool: 'inventory.restock',
        params: {
          skuId: data.skuId,
          quantity: data.reorderQuantity,
          priority: 'high'
        },
        status: 'pending',
        createdAt: Date.now()
      },
      {
        id: `action_notify_stock_${Date.now()}`,
        tool: 'notification.send',
        params: {
          recipientId: 'admin',
          type: 'low_stock_alert',
          message: `SKU ${data.skuId} low stock alert`
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  }),

  /**
   * Dead stock removal - clear slow-moving inventory
   */
  deadStockRemoval: (): BusinessRule => ({
    id: 'rule_inventory_dead_stock',
    name: 'Dead Stock Removal',
    description: 'Marks or discounts items that have not sold in specified days',
    priority: 70,
    enabled: true,
    condition: (data) => data.daysSinceLastSale > 90 && data.quantity > 0,
    action: async (data) => [
      {
        id: `action_discount_${Date.now()}`,
        tool: 'product.updatePrice',
        params: {
          skuId: data.skuId,
          discountPercentage: 30,
          reason: 'dead_stock_clearance'
        },
        status: 'pending',
        createdAt: Date.now()
      },
      {
        id: `action_promote_${Date.now()}`,
        tool: 'marketing.createCampaign',
        params: {
          name: `Clearance: ${data.skuId}`,
          skuIds: [data.skuId],
          discountPercentage: 30
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  })
};

/**
 * Order Management Rules
 */
export const orderRules = {
  /**
   * Large order rule - special handling for big orders
   */
  largeOrderHandling: (): BusinessRule => ({
    id: 'rule_order_large',
    name: 'Large Order Special Handling',
    description: 'Applies special processing for orders above threshold value',
    priority: 85,
    enabled: true,
    condition: (data) => data.orderTotal > data.largeOrderThreshold,
    action: async (data) => [
      {
        id: `action_reserve_${Date.now()}`,
        tool: 'inventory.reserveItems',
        params: {
          orderId: data.orderId,
          priority: 'urgent'
        },
        status: 'pending',
        createdAt: Date.now()
      },
      {
        id: `action_assign_${Date.now()}`,
        tool: 'order.assignVIPHandler',
        params: {
          orderId: data.orderId,
          customerId: data.customerId
        },
        status: 'pending',
        createdAt: Date.now()
      },
      {
        id: `action_expedite_${Date.now()}`,
        tool: 'logistics.expediteShipping',
        params: {
          orderId: data.orderId,
          method: 'express'
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  }),

  /**
   * High-value customer order - VIP treatment
   */
  vipCustomerOrder: (): BusinessRule => ({
    id: 'rule_order_vip_customer',
    name: 'VIP Customer Order Processing',
    description: 'Special prioritized handling for high-value customers',
    priority: 95,
    enabled: true,
    condition: (data) => data.customerLifetimeValue > data.vipThreshold,
    action: async (data) => [
      {
        id: `action_priority_${Date.now()}`,
        tool: 'order.setPriority',
        params: {
          orderId: data.orderId,
          priority: 'highest'
        },
        status: 'pending',
        createdAt: Date.now()
      },
      {
        id: `action_gift_${Date.now()}`,
        tool: 'order.addGift',
        params: {
          orderId: data.orderId,
          giftValue: 50
        },
        status: 'pending',
        createdAt: Date.now()
      },
      {
        id: `action_vip_notify_${Date.now()}`,
        tool: 'notification.sendToCustomer',
        params: {
          customerId: data.customerId,
          message: 'Your VIP order has been prioritized'
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  })
};

/**
 * Customer Engagement Rules
 */
export const customerRules = {
  /**
   * Cart abandonment recovery
   */
  cartAbandonmentRecovery: (): BusinessRule => ({
    id: 'rule_customer_cart_abandoned',
    name: 'Cart Abandonment Recovery',
    description: 'Sends reminder and applies discount for abandoned carts',
    priority: 75,
    enabled: true,
    condition: (data) => data.minutesSinceAbandonment > 15 && !data.recovered,
    action: async (data) => [
      {
        id: `action_email_${Date.now()}`,
        tool: 'notification.sendEmail',
        params: {
          customerId: data.customerId,
          templateId: 'cart_abandoned_reminder',
          discountCode: 'COMEBACK10'
        },
        status: 'pending',
        createdAt: Date.now()
      },
      {
        id: `action_discount_${Date.now()}`,
        tool: 'customer.applyDiscount',
        params: {
          customerId: data.customerId,
          percentage: 10,
          expiryHours: 24
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  }),

  /**
   * Churn prediction prevention
   */
  churnPrevention: (): BusinessRule => ({
    id: 'rule_customer_churn_risk',
    name: 'Churn Prevention',
    description: 'Identifies at-risk customers and applies retention strategies',
    priority: 80,
    enabled: true,
    condition: (data) => data.churnRiskScore > 0.7,
    action: async (data) => [
      {
        id: `action_retention_${Date.now()}`,
        tool: 'loyalty.offerRetentionBonus',
        params: {
          customerId: data.customerId,
          bonusPoints: 1000
        },
        status: 'pending',
        createdAt: Date.now()
      },
      {
        id: `action_personal_${Date.now()}`,
        tool: 'marketing.sendPersonalizedOffer',
        params: {
          customerId: data.customerId,
          offerType: 'loyalty_bonus'
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  })
};

/**
 * Pricing Rules
 */
export const pricingRules = {
  /**
   * Dynamic pricing based on demand
   */
  demandBasedPricing: (): BusinessRule => ({
    id: 'rule_pricing_demand',
    name: 'Demand-Based Dynamic Pricing',
    description: 'Adjusts prices based on real-time demand patterns',
    priority: 60,
    enabled: true,
    condition: (data) => data.dailyViews > data.highDemandThreshold,
    action: async (data) => [
      {
        id: `action_price_adjust_${Date.now()}`,
        tool: 'product.adjustPrice',
        params: {
          skuId: data.skuId,
          priceMultiplier: 1.1,
          reason: 'high_demand'
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  }),

  /**
   * Competitive pricing matching
   */
  competitivePricing: (): BusinessRule => ({
    id: 'rule_pricing_competitive',
    name: 'Competitive Price Matching',
    description: 'Matches or beats competitor prices',
    priority: 65,
    enabled: true,
    condition: (data) => data.competitorPrice < data.currentPrice,
    action: async (data) => [
      {
        id: `action_match_${Date.now()}`,
        tool: 'product.adjustPrice',
        params: {
          skuId: data.skuId,
          targetPrice: data.competitorPrice * 0.98,
          reason: 'competitive_match'
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  })
};

/**
 * Marketing Rules
 */
export const marketingRules = {
  /**
   * Cross-sell opportunities
   */
  crossSellOpportunity: (): BusinessRule => ({
    id: 'rule_marketing_crosssell',
    name: 'Cross-Sell Recommendation',
    description: 'Recommends complementary products',
    priority: 50,
    enabled: true,
    condition: (data) => data.cartValue > 0 && !data.complementaryOffered,
    action: async (data) => [
      {
        id: `action_recommend_${Date.now()}`,
        tool: 'marketing.sendRecommendations',
        params: {
          customerId: data.customerId,
          currentSkuId: data.skuId,
          recommendationType: 'cross_sell'
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  }),

  /**
   * Upsell opportunities
   */
  upsellOpportunity: (): BusinessRule => ({
    id: 'rule_marketing_upsell',
    name: 'Upsell Recommendation',
    description: 'Recommends premium versions or upgrades',
    priority: 55,
    enabled: true,
    condition: (data) => data.selectedTier === 'basic' && data.cartValue > 50,
    action: async (data) => [
      {
        id: `action_upsell_${Date.now()}`,
        tool: 'marketing.sendUpsellOffer',
        params: {
          customerId: data.customerId,
          currentProduct: data.productId,
          premiumAlternative: `${data.productId}_pro`
        },
        status: 'pending',
        createdAt: Date.now()
      }
    ]
  })
};

/**
 * All rules
 */
export function getAllBusinessRules() {
  return [
    // Inventory
    inventoryRules.lowInventoryAlert(),
    inventoryRules.deadStockRemoval(),
    // Orders
    orderRules.largeOrderHandling(),
    orderRules.vipCustomerOrder(),
    // Customers
    customerRules.cartAbandonmentRecovery(),
    customerRules.churnPrevention(),
    // Pricing
    pricingRules.demandBasedPricing(),
    pricingRules.competitivePricing(),
    // Marketing
    marketingRules.crossSellOpportunity(),
    marketingRules.upsellOpportunity()
  ];
}
