/**
 * Business Brain - Real-World Usage Examples
 * Demonstrates how to use Business Brain for commerce automation
 */

import { businessBrain, BusinessContext } from './business-brain';
import { getAllBusinessRules } from './rules';
import { executionKernel } from '../execution-kernel';

/**
 * Example 1: Initialize system and process an order
 */
export async function exampleOrderProcessing() {
  console.log('\n=== Example 1: Order Processing ===\n');

  const context: BusinessContext = {
    tenantId: 'tenant_shopify_001',
    storeId: 'store_electronics_nyc',
    userId: 'user_merchant_001'
  };

  // Initialize business rules
  const rules = getAllBusinessRules();
  businessBrain.registerRules(rules);
  console.log(`✅ Registered ${rules.length} business rules\n`);

  // Scenario: Large order from VIP customer
  const orderSituation = {
    orderId: 'ORD_20260619_001',
    orderTotal: 5000,
    largeOrderThreshold: 1000,
    customerId: 'cust_vip_001',
    customerLifetimeValue: 50000,
    vipThreshold: 10000,
    items: [
      { skuId: 'LAPTOP_PRO_001', quantity: 2, price: 2000 },
      { skuId: 'ACC_MOUSE_001', quantity: 5, price: 100 }
    ]
  };

  console.log('📦 Order Situation:', orderSituation);
  console.log('');

  // Make decision
  const decision = await businessBrain.makeDecision(orderSituation, context);

  console.log('🧠 Business Decision:');
  console.log(`   Type: ${decision.type}`);
  console.log(`   Confidence: ${(decision.confidence * 100).toFixed(0)}%`);
  console.log(`   Actions: ${decision.actions.length}`);
  console.log(`   Reasoning: ${decision.reasoning}\n`);

  // Execute decision
  const results = await businessBrain.executeDecision(decision, context);

  console.log('✅ Decision Executed:');
  console.log(`   Actions completed: ${results.filter((r) => r.success).length}/${results.length}`);
}

/**
 * Example 2: Inventory management
 */
export async function exampleInventoryManagement() {
  console.log('\n=== Example 2: Inventory Management ===\n');

  const context: BusinessContext = {
    tenantId: 'tenant_shopify_001',
    storeId: 'store_electronics_nyc',
    userId: 'user_merchant_001'
  };

  // Initialize rules
  const rules = getAllBusinessRules();
  businessBrain.registerRules(rules);

  // Scenario 1: Low inventory alert
  const lowStockSituation = {
    currentStock: 5,
    thresholdStock: 10,
    skuId: 'LAPTOP_PRO_001',
    reorderQuantity: 50
  };

  console.log('📦 Low Stock Alert:', lowStockSituation);

  const decision1 = await businessBrain.makeDecision(lowStockSituation, context);
  console.log(`✅ Decision: ${decision1.type}`);
  console.log(`   Actions: ${decision1.actions.length}\n`);

  // Scenario 2: Dead stock
  const deadStockSituation = {
    skuId: 'OLDMODEL_001',
    quantity: 100,
    daysSinceLastSale: 180
  };

  console.log('📦 Dead Stock Clearance:', deadStockSituation);

  const decision2 = await businessBrain.makeDecision(deadStockSituation, context);
  console.log(`✅ Decision: ${decision2.type}`);
  console.log(`   Actions: ${decision2.actions.length}\n`);
}

/**
 * Example 3: Customer engagement
 */
export async function exampleCustomerEngagement() {
  console.log('\n=== Example 3: Customer Engagement ===\n');

  const context: BusinessContext = {
    tenantId: 'tenant_shopify_001',
    storeId: 'store_electronics_nyc'
  };

  // Initialize rules
  const rules = getAllBusinessRules();
  businessBrain.registerRules(rules);

  // Scenario 1: Cart abandonment
  const abandonedCartSituation = {
    customerId: 'cust_001',
    cartValue: 250,
    minutesSinceAbandonment: 45,
    recovered: false
  };

  console.log('🛒 Abandoned Cart:', abandonedCartSituation);

  const decision1 = await businessBrain.makeDecision(abandonedCartSituation, context);
  console.log(`✅ Decision: ${decision1.type}`);
  console.log(`   Actions: ${decision1.actions.length}`);
  console.log(`   Reasoning: ${decision1.reasoning}\n`);

  // Scenario 2: Churn risk
  const churnRiskSituation = {
    customerId: 'cust_002',
    churnRiskScore: 0.85,
    lastPurchaseDate: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days ago
    totalOrders: 5
  };

  console.log('⚠️  Churn Risk Customer:', churnRiskSituation);

  const decision2 = await businessBrain.makeDecision(churnRiskSituation, context);
  console.log(`✅ Decision: ${decision2.type}`);
  console.log(`   Actions: ${decision2.actions.length}\n`);
}

/**
 * Example 4: Pricing optimization
 */
export async function examplePricingOptimization() {
  console.log('\n=== Example 4: Pricing Optimization ===\n');

  const context: BusinessContext = {
    tenantId: 'tenant_shopify_001',
    storeId: 'store_electronics_nyc'
  };

  // Initialize rules
  const rules = getAllBusinessRules();
  businessBrain.registerRules(rules);

  // Scenario 1: High demand
  const highDemandSituation = {
    skuId: 'LAPTOP_PRO_001',
    currentPrice: 1500,
    dailyViews: 5000,
    highDemandThreshold: 2000,
    quantity: 100
  };

  console.log('📈 High Demand Product:', highDemandSituation);

  const decision1 = await businessBrain.makeDecision(highDemandSituation, context);
  console.log(`✅ Decision: ${decision1.type}`);
  console.log(`   Reasoning: ${decision1.reasoning}\n`);

  // Scenario 2: Competitive pricing
  const competitiveSituation = {
    skuId: 'LAPTOP_PRO_001',
    currentPrice: 1500,
    competitorPrice: 1300
  };

  console.log('💰 Competitive Pricing:', competitiveSituation);

  const decision2 = await businessBrain.makeDecision(competitiveSituation, context);
  console.log(`✅ Decision: ${decision2.type}`);
  console.log(`   Actions: ${decision2.actions.length}\n`);
}

/**
 * Example 5: Marketing opportunities
 */
export async function exampleMarketingAutomation() {
  console.log('\n=== Example 5: Marketing Automation ===\n');

  const context: BusinessContext = {
    tenantId: 'tenant_shopify_001',
    storeId: 'store_electronics_nyc'
  };

  // Initialize rules
  const rules = getAllBusinessRules();
  businessBrain.registerRules(rules);

  // Scenario 1: Cross-sell
  const crossSellSituation = {
    customerId: 'cust_003',
    skuId: 'LAPTOP_PRO_001',
    cartValue: 1500,
    complementaryOffered: false
  };

  console.log('🎯 Cross-Sell Opportunity:', crossSellSituation);

  const decision1 = await businessBrain.makeDecision(crossSellSituation, context);
  console.log(`✅ Decision: ${decision1.type}`);
  console.log(`   Actions: ${decision1.actions.length}\n`);

  // Scenario 2: Upsell
  const upsellSituation = {
    customerId: 'cust_003',
    productId: 'LAPTOP_BASIC_001',
    selectedTier: 'basic',
    cartValue: 800
  };

  console.log('⬆️  Upsell Opportunity:', upsellSituation);

  const decision2 = await businessBrain.makeDecision(upsellSituation, context);
  console.log(`✅ Decision: ${decision2.type}`);
  console.log(`   Actions: ${decision2.actions.length}\n`);
}

/**
 * Example 6: Complete workflow - end-to-end
 */
export async function exampleCompleteWorkflow() {
  console.log('\n=== Example 6: Complete E-Commerce Workflow ===\n');

  const context: BusinessContext = {
    tenantId: 'tenant_amazon_001',
    storeId: 'store_electronics_global',
    userId: 'user_ai_engine'
  };

  // Initialize rules
  console.log('🔧 Initializing Business Brain...');
  const rules = getAllBusinessRules();
  businessBrain.registerRules(rules);
  console.log(`✅ ${rules.length} rules loaded\n`);

  // Update metrics
  console.log('📊 Updating metrics...');
  businessBrain.updateMetrics(context, {
    ordersToday: 342,
    revenueToday: 125000,
    activeCustomers: 1250,
    inventoryTurns: 8.5,
    conversionRate: 3.2,
    averageOrderValue: 365
  });
  console.log('✅ Metrics updated\n');

  // Process multiple situations
  const situations = [
    {
      name: 'Order Processing',
      data: {
        orderId: 'ORD_20260619_100',
        orderTotal: 4500,
        largeOrderThreshold: 1000,
        customerId: 'cust_vip_100',
        customerLifetimeValue: 75000,
        vipThreshold: 10000
      }
    },
    {
      name: 'Inventory Alert',
      data: {
        currentStock: 3,
        thresholdStock: 20,
        skuId: 'GPU_RTX_4090',
        reorderQuantity: 100
      }
    },
    {
      name: 'Customer Retention',
      data: {
        customerId: 'cust_at_risk',
        churnRiskScore: 0.82,
        lastPurchaseDate: Date.now() - 120 * 24 * 60 * 60 * 1000
      }
    }
  ];

  for (const situation of situations) {
    console.log(`🔍 Processing: ${situation.name}`);
    const decision = await businessBrain.makeDecision(situation.data, context);
    console.log(`   ✅ Decision: ${decision.type}`);
    console.log(`   📋 Actions: ${decision.actions.length}`);
    console.log(`   💡 Reasoning: ${decision.reasoning}\n`);
  }

  // Get statistics
  console.log('📈 Final Statistics:');
  const stats = businessBrain.getStats();
  console.log(`   Total Rules: ${stats.totalRules}`);
  console.log(`   Enabled Rules: ${stats.enabledRules}`);
  console.log(`   Total Decisions: ${stats.totalDecisions}`);
  console.log(`   Registered Stores: ${stats.registeredStores}\n`);
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  try {
    await exampleOrderProcessing();
    await exampleInventoryManagement();
    await exampleCustomerEngagement();
    await examplePricingOptimization();
    await exampleMarketingAutomation();
    await exampleCompleteWorkflow();

    console.log('\n=== All Examples Completed ===\n');
  } catch (error) {
    console.error('❌ Example execution failed:', error);
  }
}

// Export all examples
export default {
  exampleOrderProcessing,
  exampleInventoryManagement,
  exampleCustomerEngagement,
  examplePricingOptimization,
  exampleMarketingAutomation,
  exampleCompleteWorkflow,
  runAllExamples
};
