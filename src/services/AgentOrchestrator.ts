import { AIContext } from '../types/AIContext';

export interface SpecializedAgent {
  id: string;
  name: string;
  title: string;
  emoji: string;
  role: string;
  capabilities: string[];
  systemPrompt: string;
  onDuty: boolean;
}

export const AgentRegistry: Record<string, SpecializedAgent> = {
  ceo: {
    id: 'ceo',
    name: 'Sophia',
    title: 'Operating CEO Agent',
    emoji: '💼',
    role: 'SaaS Platform CEO. Evaluates overall store and tenant KPIs, reviews task queues, and issues final operations decisions.',
    capabilities: ['Strategic Review', 'Overall KPI Audits', 'Workflow Approvals', 'Team Dispatching'],
    systemPrompt: 'You are Sophia, the Operating CEO Agent. Address the user with executive severity, high-level business intelligence, and complete clarity of direction.',
    onDuty: true,
  },
  store: {
    id: 'store',
    name: 'Charlotte',
    title: 'Storefront Optimization Agent',
    emoji: '🏪',
    role: 'Optimizes theme layout parameters, monitors conversion funnels, and analyzes store settings.',
    capabilities: ['Theme Diagnostics', 'Conversion Funnel Tracking', 'UX Score Optimization'],
    systemPrompt: 'You are Charlotte, the Storefront Optimization Agent. You specialize in theme speed, loading parameters, high-fidelity customer experience and conversion metrics.',
    onDuty: true,
  },
  product: {
    id: 'product',
    name: 'Leo',
    title: 'Product Catalog Agent',
    emoji: '📦',
    role: 'Manages SKUs, designs catalog taxonomies, standardizes product description parameters, and aligns vendor metadata.',
    capabilities: ['SKU Refinement', 'Tag Management', 'Category Taxonomy mapping'],
    systemPrompt: 'You are Leo, the Product Catalog Agent. You ensure standard formatting across all items, verifying that metadata matches retail taxonomy fields.',
    onDuty: true,
  },
  inventory: {
    id: 'inventory',
    name: 'Oliver',
    title: 'WMS Inventory Sourcing Agent',
    emoji: '🏭',
    role: 'Monitors real-time stock levels, detects critical low inventory counts, and directs purchase orders.',
    capabilities: ['Stock Replenishment', 'Sourcing Webhooks', 'Reorder trigger limits'],
    systemPrompt: 'You are Oliver, the Inventory and Sourcing Specialist. Track stock levels precisely and trigger clear, rapid requisition requests when counts go below thresholds.',
    onDuty: true,
  },
  pricing: {
    id: 'pricing',
    name: 'Fiona',
    title: 'Yield Pricing & Margin Agent',
    emoji: '💰',
    role: 'Calculates markup margins, monitors wholesale margins, and recommends optimized price matrices.',
    capabilities: ['Price Elasticity', 'Wholesale Cost Reduction', 'COGS Calculations'],
    systemPrompt: 'You are Fiona, the Yield Pricing Agent. Analyze wholesale cost vs retail MSRP to recommend maximum net profit pricing models.',
    onDuty: true,
  },
  marketing: {
    id: 'marketing',
    name: 'Marcus',
    title: 'Campaign Marketing Agent',
    emoji: '🎁',
    role: 'Designs digital ad spend strategies, configures discounts, and monitors ROI benchmarks.',
    capabilities: ['ROAS Benchmarking', 'Discount Issuance', 'Audience Segment targeting'],
    systemPrompt: 'You are Marcus, the CRM and Campaign Marketing Agent. Formulate direct, aggressive promotion plans to clear slow stock or lift seasonal revenue.',
    onDuty: true,
  },
  customer: {
    id: 'customer',
    name: 'Grace',
    title: 'Customer Retention Agent',
    emoji: '👥',
    role: 'Segments buyers into loyalty tiers, calculates LTV (lifetime value), and monitors customer churn rates.',
    capabilities: ['LTV Calculations', 'Churn Rate Analytics', 'VIP Tier Provisioning'],
    systemPrompt: 'You are Grace, the Customer Retention Agent. Optimize repeat order frequency and construct reward incentives for high-value shoppers.',
    onDuty: true,
  },
  order: {
    id: 'order',
    name: 'Arthur',
    title: 'Fulfillment Order Agent',
    emoji: '🧾',
    role: 'Tracks incoming checkout flows, updates delivery states, and audits processing times.',
    capabilities: ['Order Status Tracking', 'SLA Adherence Guard', 'Fulfillment routing'],
    systemPrompt: 'You are Arthur, the Order Processing Agent. Ensure zero delay in transaction workflows and flags late shipments immediately.',
    onDuty: true,
  },
  payment: {
    id: 'payment',
    name: 'Valerie',
    title: 'Payment Channel Advisor',
    emoji: '💳',
    role: 'Surveys checkout gateway success rates, detects transaction friction, and checks active POS systems.',
    capabilities: ['Gateway Success Rate Mapping', 'Payment Friction Audit', 'Fee optimization'],
    systemPrompt: 'You are Valerie, the Payment Channel Specialist. Highlight failure rates and optimize payment configurations to minimize recovery efforts.',
    onDuty: true,
  },
  logistics: {
    id: 'logistics',
    name: 'Douglas',
    title: 'Logistics Courier Director',
    emoji: '🚚',
    role: 'Selects optimal parcel dispatch providers, calculates shipping times, and coordinates shipping labels.',
    capabilities: ['Carrier Selection', 'Shipping Time Estimations', 'DHL/FedEx Integration Map'],
    systemPrompt: 'You are Douglas, the Logistics Director. Always opt for speed at minimum cost to safeguard customer service standards.',
    onDuty: true,
  },
  finance: {
    id: 'finance',
    name: 'Christian',
    title: 'Corporate Finance Analyst',
    emoji: '📈',
    role: 'Computes monthly GMV balance sheets, maps profit margins, and flags excessive store operational costs.',
    capabilities: ['Weekly GMV Reports', 'Profit/Loss Audit', 'Finance Health Indexing'],
    systemPrompt: 'You are Christian, the Corporate Finance Analyst. Keep strict, mathematical control over costs and revenue items.',
    onDuty: true,
  },
  risk: {
    id: 'risk',
    name: 'Emily',
    title: 'Risk & Fraud Analyst',
    emoji: '🛡️',
    role: 'Audits suspicious purchase IPs, tracks extreme refund ratios, and flag credit card fraud markers.',
    capabilities: ['Refund IP Risk Scans', 'Fraud Multiplier Calculation', 'Hold Action triggers'],
    systemPrompt: 'You are Emily, the Risk and Fraud Analyst. Look for security red flags, high-risk items, and anomalous consumer behaviors.',
    onDuty: true,
  },
  support: {
    id: 'support',
    name: 'Liam',
    title: 'Customer Live Support Agent',
    emoji: '💬',
    role: 'Drafts responses to user complains, maps satisfaction ratings, and streamlines FAQ resolution paths.',
    capabilities: ['FAQ Mapping', 'Ticket Resolution', 'SLA Response Tracking'],
    systemPrompt: 'You are Liam, the Customer Live Support Specialist. Address customer concerns with patience, structured explanations, and helpful details.',
    onDuty: true,
  },
  knowledge: {
    id: 'knowledge',
    name: 'Sophia-KD',
    title: 'SOP Documentation Agent',
    emoji: '📚',
    role: 'Maintains internal corporate manuals, looks up policy catalogs, and extracts operational SLAs.',
    capabilities: ['SOP Retrievals', 'Policy Catalog Lookups', 'GDPR Guidelines Mapping'],
    systemPrompt: 'You are Sophia-KD, the SOP Documentation Agent. Retrieve exact clauses from knowledge logs to back-up tactical recommendations.',
    onDuty: true,
  }
};

export const AgentOrchestrator = {
  /**
   * Get all registered agents
   */
  getRegisteredAgents(): SpecializedAgent[] {
    return Object.values(AgentRegistry);
  },

  /**
   * Simple task-routing function to delegate complex user request to the appropriate specialized agent.
   */
  routeTask(userRequest: string, context: AIContext): {
    agent: SpecializedAgent;
    rationale: string;
    suggestedAction: string;
  } {
    const query = userRequest.toLowerCase();

    // Test 3: Agent runtime execution console.log
    const matchedAgentName = (query.includes('补货') || query.includes('stock') || query.includes('inventory')) ? 'Oliver' : 'Sophia';
    console.log("[AGENT]", matchedAgentName, userRequest);

    // 1. Inventory & Stock Routing
    if (
      query.includes('stock') || 
      query.includes('inventory') || 
      query.includes('reorder') || 
      query.includes('procurement') || 
      query.includes('replenish') ||
      query.includes('sku') ||
      query.includes('wms')
    ) {
      return {
        agent: AgentRegistry.inventory,
        rationale: 'Request detected inventory SKU tracking, threshold triggers, or stocking operations.',
        suggestedAction: 'Execute critical stock check and issue automated merchant replenishment webhook.'
      };
    }

    // 2. Risk & Refund Fraud Routing
    if (
      query.includes('risk') || 
      query.includes('fraud') || 
      query.includes('refund') || 
      query.includes('chargeback') || 
      query.includes('dispute') ||
      query.includes('ip') ||
      query.includes('suspicious')
    ) {
      return {
        agent: AgentRegistry.risk,
        rationale: 'User query is analyzing transaction danger, fraud, refund IPs, or dispute records.',
        suggestedAction: 'Lock high-risk transactions from auto-fulfillment and trigger manual corporate auditing.'
      };
    }

    // 3. Pricing & COGS Routing
    if (
      query.includes('price') || 
      query.includes('pricing') || 
      query.includes('cost') || 
      query.includes('cogs') || 
      query.includes('margin') ||
      query.includes('markup')
    ) {
      return {
        agent: AgentRegistry.pricing,
        rationale: 'Financial yield review or product pricing adjustments requested.',
        suggestedAction: 'Evaluate current COGS markup and propose high-margin dynamic retail adjustments.'
      };
    }

    // 4. Marketing & Ad spends Routing
    if (
      query.includes('marketing') || 
      query.includes('ad') || 
      query.includes('campaign') || 
      query.includes('discount') || 
      query.includes('coupon') ||
      query.includes('sales') ||
      query.includes('roas')
    ) {
      return {
        agent: AgentRegistry.marketing,
        rationale: 'Request points to revenue optimization campaigns or ad platform spend ROI.',
        suggestedAction: 'Apply custom discount codes or trigger a targeted marketing campaign.'
      };
    }

    // 5. Customer Loyalty & Retention Routing
    if (
      query.includes('customer') || 
      query.includes('client') || 
      query.includes('vip') || 
      query.includes('user') || 
      query.includes('churn') ||
      query.includes('ltv') ||
      query.includes('members')
    ) {
      return {
        agent: AgentRegistry.customer,
        rationale: 'Query refers to customer demographics, churn risks, or VIP tier structures.',
        suggestedAction: 'Provision customized tier privileges to VIP cohorts or target churning accounts.'
      };
    }

    // 6. Logistics & Shipping Routing
    if (
      query.includes('shipping') || 
      query.includes('delivery') || 
      query.includes('logistics') || 
      query.includes('carrier') || 
      query.includes('dhl') || 
      query.includes('fedex') ||
      query.includes('package')
    ) {
      return {
        agent: AgentRegistry.logistics,
        rationale: 'Request corresponds to parcel dispatch services, routes, or dispatch speeds.',
        suggestedAction: 'Audit transit SLA levels and match courier routing parameters to minimize delay.'
      };
    }

    // 7. Payment gateway & systems Routing
    if (
      query.includes('payment') || 
      query.includes('stripe') || 
      query.includes('paypal') || 
      query.includes('checkout') || 
      query.includes('credit card') || 
      query.includes('pos')
    ) {
      return {
        agent: AgentRegistry.payment,
        rationale: 'Query represents credit gateway transactions or point-of-sale systems.',
        suggestedAction: 'Trigger checkout friction diagnose sequence on regional payment handlers.'
      };
    }

    // 8. Finance & KPI Analytics Routing
    if (
      query.includes('finance') || 
      query.includes('gmv') || 
      query.includes('cash') || 
      query.includes('balance') || 
      query.includes('profit') || 
      query.includes('tax') ||
      query.includes('revenue')
    ) {
      return {
        agent: AgentRegistry.finance,
        rationale: 'Analysis of corporate earnings, monthly gross profits, or general store GMV requested.',
        suggestedAction: 'Synthesize monthly gross profit balance sheet indicators for review.'
      };
    }

    // 9. Documentation / SOP Lookups
    if (
      query.includes('sop') || 
      query.includes('policy') || 
      query.includes('rule') || 
      query.includes('regulation') || 
      query.includes('manual') ||
      query.includes('documentation') ||
      query.includes('shopify-docs')
    ) {
      return {
        agent: AgentRegistry.knowledge,
        rationale: 'Context lookup requested for store rules or internal SLA policies.',
        suggestedAction: 'Query operational catalog repository for applicable standard operation rules.'
      };
    }

    // 10. Default CEO dispatch routing
    return {
      agent: AgentRegistry.ceo,
      rationale: 'Task involves general executive management or high-level status tracking.',
      suggestedAction: 'Execute broad store KPI assessment and coordinate secondary agent actions.'
    };
  },

  /**
   * Orchestrates a message with AIContext and returns a JSON instruction
   * containing recommended Agent Type (ProductAgent or AnalyticsAgent) and targetParams.
   */
  orchestrate(message: string, context: AIContext): {
    agentType: 'ProductAgent' | 'AnalyticsAgent';
    targetParams: {
      targetId?: string;
      dateRange?: string;
      productIds?: string[];
      pageType?: string;
      industry?: string;
      [key: string]: any;
    };
  } {
    const query = (message || '').trim().toLowerCase();

    // 1. Determine recommended agent type: ProductAgent or AnalyticsAgent
    let agentType: 'ProductAgent' | 'AnalyticsAgent' = 'AnalyticsAgent'; // Default to analytics agent
    
    // Keywords indicating ProductAgent focus (SKU, merchandise, description optimization, copywriting)
    const productKeywords = [
      'product', 'sku', 'catalog', 'merchandise', 'item', 'inventory', 'stock', 'warehouse',
      '商品', '上架', '下架', '断货', '备料', '文案', '优化', '改写', '描述', '翻译', '英文', 
      '欧美', '款式', '详情', '价格', '定价', '折扣', '券', '优惠', '折扣券', 'copywriter', 'campaign'
    ];

    const hasProductKeywords = productKeywords.some(kw => query.includes(kw));
    const isProductPage = context?.ui?.pageType === 'product_detail' || context?.ui?.pageType === 'products_list';

    if (hasProductKeywords || isProductPage) {
      agentType = 'ProductAgent';
    } else {
      agentType = 'AnalyticsAgent';
    }

    // 2. Extract target parameters: targetId, dateRange, productIds
    let targetId: string | undefined = undefined;
    let dateRange: string | undefined = undefined;
    const productIds: string[] = [];

    // Attempt to extract targetId from context first, which is highly reliable!
    if (context?.ui?.productId) {
      targetId = context.ui.productId;
      productIds.push(context.ui.productId);
    } else if (context?.ui?.orderId) {
      targetId = context.ui.orderId;
    } else if (context?.ui?.customerId) {
      targetId = context.ui.customerId;
    }

    // Regex extraction from message to find matches like ORD-xxxx or p_xxxx
    const idRegexes = [
      /\b(ord-[a-zA-Z0-9_-]+)\b/i,
      /\b(p_[a-zA-Z0-9_-]+)\b/i,
      /\b(prod_[a-zA-Z0-9_-]+)\b/i,
      /\b(t_[a-zA-Z0-9_-]+)\b/i,
    ];

    for (const regex of idRegexes) {
      const match = query.match(regex);
      if (match && match[1]) {
        targetId = match[1];
        if (targetId.startsWith('p_') || targetId.startsWith('prod_')) {
          if (!productIds.includes(targetId)) {
            productIds.push(targetId);
          }
        }
        break;
      }
    }

    // Fallback regex for numeric patterns or SKU formats
    if (!targetId) {
      const skuMatch = query.match(/\b([a-zA-Z0-9-]+-[a-zA-Z0-9-]+)\b/);
      if (skuMatch && skuMatch[1]) {
        targetId = skuMatch[1];
      }
    }

    // 3. Extract check of dateRange
    if (query.includes('today') || query.includes('今天') || query.includes('今日')) {
      dateRange = 'today';
    } else if (query.includes('yesterday') || query.includes('昨天')) {
      dateRange = 'yesterday';
    } else if (query.includes('this week') || query.includes('本周') || query.includes('这周')) {
      dateRange = 'this_week';
    } else if (query.includes('last 7 days') || query.includes('最近7天') || query.includes('过去7天')) {
      dateRange = 'last_7_days';
    } else if (query.includes('last 30 days') || query.includes('最近30天') || query.includes('过去30天')) {
      dateRange = 'last_30_days';
    } else if (query.includes('this month') || query.includes('本月') || query.includes('当月')) {
      dateRange = 'this_month';
    } else if (context?.metrics?.timeRange) {
      dateRange = context.metrics.timeRange;
    } else {
      dateRange = 'today';
    }

    // Merge context selectedProductIds
    if (context?.ui?.selectedProductIds && Array.isArray(context.ui.selectedProductIds)) {
      context.ui.selectedProductIds.forEach((id: string) => {
        if (!productIds.includes(id)) {
          productIds.push(id);
        }
      });
    }

    const targetParams = {
      targetId,
      dateRange,
      productIds: productIds.length > 0 ? productIds : undefined,
      pageType: context?.ui?.pageType || 'dashboard',
      industry: context?.shop?.industry || 'fashion'
    };

    return {
      agentType,
      targetParams
    };
  }
};
