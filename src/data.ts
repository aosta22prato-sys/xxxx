import { 
  IndustryType, 
  ProductItem, 
  OrderItem, 
  AIEmployee, 
  Workflow, 
  KnowledgeDoc, 
  McpTool, 
  AppMarketItem,
  Metric,
  CustomerItem
} from './types';

export const PLATFORM_STATS = {
  activeTenants: 1420,
  activeAgents: 8520,
  mcpCallsToday: 41240,
  totalSavedFees: 320400, // in USD
  globalModelCostUSD: 1450.42,
  avgResponseTimeMs: 820
};

export const COMMON_MCP_TOOLS: McpTool[] = [
  { id: 't1', name: 'store.products.get', category: 'Shopify', description: 'Query active product catalog, pricing, and stock status', parameters: ['limit', 'status'], status: 'connected' },
  { id: 't2', name: 'store.products.updateStock', category: 'Shopify', description: 'Modify SKU stock level in ERP and Shopify sync', parameters: ['sku', 'newStock'], status: 'connected' },
  { id: 't3', name: 'store.orders.query', category: 'Shopify', description: 'Retrieve order history, delivery tracing, and payment gateway status', parameters: ['orderId', 'userId'], status: 'connected' },
  { id: 't4', name: 'store.orders.refund', category: 'Shopify', description: 'Initiate partial or full automatic refund under API compliance key', parameters: ['orderId', 'amount', 'reason'], status: 'connected' },
  { id: 't5', name: 'marketing.coupons.create', category: 'Marketing', description: 'Create dynamic discount codes valid for specified duration', parameters: ['code', 'discountPct', 'expiryHours'], status: 'connected' },
  { id: 't6', name: 'marketing.ads.optimizeBudget', category: 'Marketing', description: 'Scale Meta, Google, or TikTok campaign spend based on live ROAS', parameters: ['campaignId', 'budgetDeltaPercentage'], status: 'connected' },
  { id: 't7', name: 'marketing.ads.createAdGraphic', category: 'Marketing', description: 'Trigger visual generator for seasonal promotional ads', parameters: ['theme', 'textHeading', 'width', 'height'], status: 'connected' },
  { id: 't8', name: 'crm.messages.send', category: 'CRM', description: 'Send targeted WhatsApp, SMS, or emails using template variables', parameters: ['channel', 'recipient', 'templateId', 'variables'], status: 'connected' },
  { id: 't9', name: 'finance.invoice.generate', category: 'Finance', description: 'Compute corporate invoice and post statement to records ledger', parameters: ['tenantId', 'orderId', 'taxRate'], status: 'connected' }
];

export const APP_MARK_PRESETS: AppMarketItem[] = [
  { id: 'm1', name: 'TikTok Viral Creative Agent', developer: 'ByteBrain Labs', icon: 'Sparkles', price: '$49/mo', rating: 4.8, category: 'Agent', description: 'An AI content creator that scans TikTok trends, generates localized script copy, generates product mockups, and launches Meta/Shorts ads automatically.', installed: false },
  { id: 'm2', name: 'Supplier Negotiator ERP Agent', developer: 'OpsAuto Inc.', icon: 'Shuffle', price: '$79/mo', rating: 4.6, category: 'Agent', description: 'A highly structured procurement negotiator. Monitors wholesale metal/material index pricing and drafts bulk order proposal emails to secure discounted margins.', installed: false },
  { id: 'm3', name: 'Cross-Border VAT & Tax Compliant Workflow', developer: 'TaxAI Solutions', icon: 'Scale', price: '$29/mo', rating: 4.9, category: 'Workflow', description: 'An automated workflow node pack checking shipping address VAT structures across Europe, calculating optimal tax exemptions, and reporting weekly statements.', installed: false },
  { id: 'm4', name: 'Shopify-to-TikTok Sync Plugin', developer: 'Platform Native', icon: 'Workflow', price: 'Free', rating: 4.5, category: 'Plugin', description: 'Direct webhook Connector triggering instant catalog sync of titles, prices, and stock counts between your store and your active TikTok Shop.', installed: true },
  { id: 'm5', name: 'SLA Logistics Alerting & Delay Mitigation Knowledge Pack', developer: 'LogiBrain', icon: 'BookOpen', price: '$19/mo', rating: 4.7, category: 'Knowledge Pack', description: 'Pre-formatted FAQ knowledge base, standard response templates, or international shipping delays handbook enabling your AI Support to handle shipping interruptions.', installed: false }
];

export const INDUSTRY_PRESETS: Record<string, {
  metrics: Metric[];
  products: ProductItem[];
  orders: OrderItem[];
  customers: CustomerItem[];
  agents: AIEmployee[];
  workflows: Workflow[];
  knowledge: KnowledgeDoc[];
}> = {
  retail: {
    metrics: [
      { name: 'Today\'s GMV', value: '$12,450.00', change: '+14% from yesterday', trend: 'up' },
      { name: 'Average Conversion Rate', value: '3.42%', change: '-0.2% from average', trend: 'down' },
      { name: 'Meta & TikTok Ads ROAS', value: '3.12x', change: '+8% optimization index', trend: 'up' },
      { name: 'Stock Shortage Warning', value: '2 SKUs low', change: 'Alert: CEO reorder recommended', trend: 'down' }
    ],
    products: [
      { id: 'p_r1', name: 'Ergonomic Mechanical Keyboard', sku: 'SKU-R104', stock: 120, minStockThreshold: 20, price: 149.00, sales: 840, status: 'In Stock' },
      { id: 'p_r2', name: 'Active ANC Noise-Cancelling Headphones', sku: 'SKU-R189', stock: 12, minStockThreshold: 15, price: 199.00, sales: 1240, status: 'Low Stock' },
      { id: 'p_r3', name: 'UltraWide Curved Desktop Monitor 34"', sku: 'SKU-R502', stock: 0, minStockThreshold: 5, price: 449.00, sales: 310, status: 'Out of Stock' },
      { id: 'p_r4', name: 'Sustainable Bamboo Monitor Riser', sku: 'SKU-R213', stock: 152, minStockThreshold: 10, price: 49.00, sales: 240, status: 'In Stock' }
    ],
    orders: [
      { id: '#ORD-9841', customerName: 'Alex Mercer', contact: 'alex.mercer@gmail.com', total: 198.00, status: 'Pending', createdAt: '2026-06-07 19:42', riskScore: 18 },
      { id: '#ORD-9840', customerName: 'Tiffany Vance', contact: 'tiffany@vance-corp.com', total: 449.00, status: 'AI Confirmed', createdAt: '2026-06-07 18:15', riskScore: 8 },
      { id: '#ORD-9839', customerName: 'William Wallace', contact: 'will.scot@yahoo.com', total: 149.00, status: 'Refund Requested', createdAt: '2026-06-07 15:30', riskScore: 82 }
    ],
    customers: [
      { id: 'CUST-R001', name: 'Alex Mercer', email: 'alex.mercer@gmail.com', phone: '+1 (555) 234-5678', tier: '黄金会员', points: 180, tags: ['VIP', '高频消费'], totalSpend: 198.00, orderCount: 1, status: 'active', createdAt: '2026-04-12 10:14' },
      { id: 'CUST-R002', name: 'Tiffany Vance', email: 'tiffany@vance-corp.com', phone: '+1 (555) 876-5432', tier: '白金会员', points: 450, tags: ['大宗采购', '企业客户', '高净值'], totalSpend: 449.00, orderCount: 1, status: 'active', createdAt: '2026-05-01 14:22' },
      { id: 'CUST-R003', name: 'William Wallace', email: 'will.scot@yahoo.com', phone: '+44 7911 123456', tier: '普通会员', points: 50, tags: ['高风险偏好', '退款争议'], totalSpend: 149.00, orderCount: 1, status: 'active', createdAt: '2026-05-18 11:05' },
      { id: 'CUST-R004', name: 'Sarah Connor', email: 's.connor@sky.net', phone: '+1 (555) 101-2029', tier: '钻石会员', points: 1250, tags: ['极客VIP', '极客买家'], totalSpend: 1350.00, orderCount: 3, status: 'active', createdAt: '2026-01-15 08:34' },
      { id: 'CUST-R005', name: 'Mason Wright', email: 'm.wright@project-angel.org', phone: '+1 (555) 404-5050', tier: '白银会员', points: 120, tags: ['新注册'], totalSpend: 120.00, orderCount: 1, status: 'inactive', createdAt: '2026-06-05 16:40' }
    ],
    agents: [
      {
        id: 'a_ops',
        name: 'Oliver',
        title: 'Operations Director Agent',
        role: 'Supervises ERP stock updates, reviews stockouts, triggers automatic reorders with partnered suppliers.',
        status: 'Idle',
        emoji: '⚙️',
        description: 'Inventory intelligence specialist linked directly to store WMS levels.',
        capabilities: ['WMS Stock Tracking', 'Reorder trigger thresholds', 'Freight SLA calculations'],
        systemPrompt: 'You are Oliver, the Operations and Inventory Director. You speak with industrial precision, noting exact SKU codes, safe stock limits, lead times, and dispatch rates.',
        model: 'gemini-3.5-flash',
        tasksCompleted: 420
      }
    ],
    workflows: [
      {
        id: 'wf_r1',
        name: 'Low Stock Auto-Procurement Run',
        description: 'Triggered when low stock threshold is reached. Searches active supplier bids and alerts Oliver.',
        trigger: 'SKU stock level < minStockThreshold',
        active: true,
        frequency: 'Real-time on change',
        nodes: [
          { id: 'n1', type: 'trigger', title: 'Product low-stock trigger', status: 'idle', details: 'SKU-R189 (ANC Headphones) stock is 12 (Threshold: 15)' },
          { id: 'n2', type: 'ai_decision', title: 'Supply Chain Agent Cost Analysis', status: 'idle', details: 'Oliver evaluates price vs lead time for 3 partners' },
          { id: 'n3', type: 'condition', title: 'Verify Profitability Bound', status: 'idle', details: 'Checks if item MSRP allows minimum 35% margin' },
          { id: 'n4', type: 'action', title: 'Generate PO & Alert CEO', status: 'idle', details: 'Creates purchase draft for CEO approval, sends notification email' }
        ]
      },
      {
        id: 'wf_r2',
        name: 'Threat-Aware High-Risk Refund Audit',
        description: 'Reviews incoming refund claims, cross-references transaction IP to catch logistics double-claiming.',
        trigger: 'Refund Requested Event',
        active: true,
        frequency: 'Real-time on refund intent',
        nodes: [
          { id: 'n1', type: 'trigger', title: 'Refund request received', status: 'idle', details: 'Order #ORD-9839 requested Refund for $149.00' },
          { id: 'n2', type: 'ai_decision', title: 'Logistics SLA & IP Risk Scan', status: 'idle', details: 'AI evaluates delivery confirmation logs of last-mile postal provider' },
          { id: 'n3', type: 'condition', title: 'Evaluate Threat Multiplier', status: 'idle', details: 'Scores order threat score (Current: 82 - flag red)' },
          { id: 'n4', type: 'action', title: 'Trigger Escalation & Hold API', status: 'idle', details: 'Declines standard instant API refund, locks the ticket, drafts human reviewer review' }
        ]
      }
    ],
    knowledge: [
      { id: 'kd1', title: 'Global Returns & Refund Policy v3.4', category: 'Returns', content: 'Standard returns allowed within 14 days of receipt. Shipping carrier receipt must match digital stamp timestamp. High-risk accounts with consecutive refunds exceeding 2 standard dev thresholds require manual regional operational review under article 12.2. Electronics items must include unbroken safety seal sticker.', size: '14 KB', lastUpdated: '2026-05-12' },
      { id: 'kd2', title: 'SLA Logistics Delivery Timelines', category: 'Logistics', content: 'Domestic DHL Express is 1-2 day SLA. FedEx Ground standard SLA is 3-5 days. International standard shipping allows up to 14 business days. Refunds claimed for "Non-Receipt of Package" must only be triggered after 3 calendar days of expected delivery date has passed.', size: '8.2 KB', lastUpdated: '2026-04-30' }
    ]
  },
  food: {
    metrics: [
      { name: 'Active Orders Today', value: '184 covers', change: '+22% high capacity', trend: 'up' },
      { name: 'Menu Gross Margin', value: '68.4%', change: '+1.2% food cost optimization', trend: 'up' },
      { name: 'Avg Prep & Lead Time', value: '14.2 mins', change: '+2.1 min kitchen backup', trend: 'down' },
      { name: 'Waste Multiplier', value: '2.1%', change: 'Lowest this week', trend: 'up' }
    ],
    products: [
      { id: 'p_f1', name: 'Organic Wagyu Burger Premium Set', sku: 'SKU-F203', stock: 80, minStockThreshold: 15, price: 24.50, sales: 512, status: 'In Stock' },
      { id: 'p_f2', name: 'White Truffle Parmesan Handcut Fries', sku: 'SKU-F812', stock: 4, minStockThreshold: 10, price: 11.00, sales: 840, status: 'Low Stock' },
      { id: 'p_f3', name: 'Cold-Brew Jasmine Mint Tea Pitcher', sku: 'SKU-F112', stock: 50, minStockThreshold: 10, price: 6.50, sales: 910, status: 'In Stock' }
    ],
    orders: [
      { id: '#ORD-4012', customerName: 'David Zhang', contact: 'david.z@hey.com', total: 46.50, status: 'Pending', createdAt: '2026-06-07 21:12', riskScore: 5 },
      { id: '#ORD-4011', customerName: 'Lily Vance', contact: 'lilyv@me.com', total: 19.00, status: 'AI Confirmed', createdAt: '2026-06-07 20:45', riskScore: 10 }
    ],
    customers: [
      { id: 'CUST-F001', name: 'David Zhang', email: 'david.z@hey.com', phone: '+86 138-1234-5678', tier: '黄金会员', points: 210, tags: ['生鲜常客', '无辣不欢'], totalSpend: 46.50, orderCount: 1, status: 'active', createdAt: '2026-05-15 12:10' },
      { id: 'CUST-F002', name: 'Lily Vance', email: 'lilyv@me.com', phone: '+1 (555) 321-4321', tier: '普通会员', points: 80, tags: ['公司团餐'], totalSpend: 19.00, orderCount: 1, status: 'active', createdAt: '2026-06-01 09:30' },
      { id: 'CUST-F003', name: 'Tony Stark', email: 'tony@starkindustries.com', phone: '+1 (555) 300-3000', tier: '钻石会员', points: 3500, tags: ['极其挑剔', '黑卡VIP', '松露控'], totalSpend: 3420.00, orderCount: 12, status: 'active', createdAt: '2025-12-25 18:00' }
    ],
    agents: [
      {
        id: 'f_ceo',
        name: 'Liam',
        title: 'Smart Diner Operations CEO',
        role: 'Aggregates commercial food sales, restaurant utilization schedules, driver delivery performance, and ingredient shelf-life risk indices.',
        status: 'Idle',
        emoji: '👨‍🍳',
        description: 'Restaurant chain optimization intelligence agent.',
        capabilities: ['Kitchen load prediction', 'Ingredient expiration warnings', 'Deliveries scheduling sync'],
        systemPrompt: 'You are Liam, the Restaurant Group CEO. You prioritize ingredient freshness, fast kitchen prep limits, high delivery driver placement rates, and solid food cost margins.',
        model: 'gemini-3.5-flash',
        tasksCompleted: 450
      },
      {
        id: 'f_support',
        name: 'Emma',
        title: 'AI Diner Concierge Care',
        role: 'Answers allergens queries, handles late delivery orders, custom catering bids, and refunding inaccurate orders post-delivery.',
        status: 'Idle',
        emoji: '🛎️',
        description: 'Hospitable host agent fluent in allergens standards and fast recovery coupons.',
        capabilities: ['Allergen validation protocol', 'Late delivery compensation', 'WhatsApp order capture'],
        systemPrompt: 'You are Emma, the welcoming Smart Diner Concierge Care Specialist. You are helpful, precise, understanding of food preferences (allergens, vegan rules), and expert at issuing discount vouchers to soothe bad delivery times.',
        model: 'gemini-3.5-flash',
        tasksCompleted: 1422
      }
    ],
    workflows: [
      {
        id: 'wf_f1',
        name: 'Fresh Ingredient Expiration Promo Loop',
        description: 'Senses when local farm ingredients approach expiration within 24 hours. Automatically updates recipe margins and launches special promo on storefront.',
        trigger: 'Ingredient expiration alert from Smart Fridge ERP',
        active: true,
        frequency: 'Daily check at 08:00',
        nodes: [
          { id: 'n1', type: 'trigger', title: 'Sensors report expiring stock', status: 'idle', details: '30kg Wagyu Ground Beef expiring in 28 hours' },
          { id: 'n2', type: 'ai_decision', title: 'Dynamic Promo Calculation', status: 'idle', details: 'System calculates optimal bundle price of Wagyu Burgers to dump excess stock' },
          { id: 'n3', type: 'action', title: 'Auto-Update Menu Pricing', status: 'idle', details: 'Updates Shopify-Diner SKU price to $18.50 (20% off)' },
          { id: 'n4', type: 'action', title: 'Dispatch Geo-Fenced Push Ads', status: 'idle', details: 'Marketing Automation launches geo-fenced Instagram and SMS ads: "Wagyu Flash-Day at Diner!"' }
        ]
      }
    ],
    knowledge: [
      { id: 'kd3', title: 'Allergens Cross-Contamination Policies V2', category: 'Health', content: 'Our diner uses peanuts, gluten, and soy. Gluten-free crust items must be baked on sheet tray R-4 in convection oven only. Shellfish items have separated fryers. Staff must verify gluten requests with chef prior to dispatching packaging labels.', size: '11 KB', lastUpdated: '2026-03-04' }
    ]
  },
  education: {
    metrics: [
      { name: 'Active Subscriptions', value: '4,520 students', change: '+8% this month', trend: 'up' },
      { name: 'Student Completion Rate', value: '42.1%', change: '+5.4% mentorship active', trend: 'up' },
      { name: 'Course Revenue (MRR)', value: '$92,400.00', change: '+12% targeted ads', trend: 'up' },
      { name: 'Advisor Booking Efficiency', value: '92%', change: 'Max seat utilization', trend: 'up' }
    ],
    products: [
      { id: 'p_e1', name: 'AI Engineering & Agent Fundamentals Bootcamp', sku: 'SKU-E710', stock: 1000, minStockThreshold: 10, price: 699.00, sales: 312, status: 'In Stock' },
      { id: 'p_e2', name: 'Next-Gen SaaS Launch Blueprint Course', sku: 'SKU-E102', stock: 50, minStockThreshold: 5, price: 249.00, sales: 840, status: 'In Stock' },
      { id: 'p_e3', name: 'Personalized 1-on-1 AI Mentor Hours (10x)', sku: 'SKU-E304', stock: 1, minStockThreshold: 2, price: 1200.00, sales: 90, status: 'Low Stock' }
    ],
    orders: [
      { id: '#ORD-2004', customerName: 'Zara Patel', contact: 'zara.patel@educate.io', total: 699.00, status: 'Pending', createdAt: '2026-06-07 20:10', riskScore: 2 },
      { id: '#ORD-2003', customerName: 'Daniel Ko', contact: 'daniel@kocoding.dev', total: 249.00, status: 'AI Confirmed', createdAt: '2026-06-07 19:30', riskScore: 12 }
    ],
    customers: [
      { id: 'CUST-E001', name: 'Zara Patel', email: 'zara.patel@educate.io', phone: '+1 (555) 301-4010', tier: '白金会员', points: 700, tags: ['训练营学员', '活跃讨论者'], totalSpend: 699.00, orderCount: 1, status: 'active', createdAt: '2026-05-10 11:45' },
      { id: 'CUST-E002', name: 'Daniel Ko', email: 'daniel@kocoding.dev', phone: '+82 10-1234-5678', tier: '白银会员', points: 250, tags: ['独立开发者', '全栈精通'], totalSpend: 249.00, orderCount: 1, status: 'active', createdAt: '2026-06-01 16:15' },
      { id: 'CUST-E003', name: 'Grace Hopper', email: 'grace@co-compiler.org', phone: '+1 (555) 010-0101', tier: '钻石会员', points: 4200, tags: ['资深学术', '终身VIP'], totalSpend: 3200.00, orderCount: 5, status: 'active', createdAt: '2025-09-01 09:00' }
    ],
    agents: [
      {
        id: 'e_ceo',
        name: 'Clara',
        title: 'EduAcademy Director',
        role: 'Monitors student churn, evaluates curriculum traction metrics, budgets and directs automated advisory outreach programs.',
        status: 'Idle',
        emoji: '👩‍🏫',
        description: 'Educational technology automated dean and budget controller.',
        capabilities: ['Retention path modeling', 'Curriculum engagement analysis', 'Refund threat reduction'],
        systemPrompt: 'You are Clara, the Educational Academy Director. You optimize for course graduation rates, high student feedback stars, minimal dropouts, and maximum lifetime membership values.',
        model: 'gemini-3.5-flash',
        tasksCompleted: 280
      },
      {
        id: 'e_adviser',
        name: 'Luke',
        title: 'AI Student Success Advisor',
        role: 'Evaluates learner code submissions, reviews quiz logs, triggers check-ins to dormant subscribers, coordinates calendar slots.',
        status: 'Idle',
        emoji: '🎓',
        description: 'Warm, smart tutor grounded deeply in curriculum codes and syllabus docs.',
        capabilities: ['Grading evaluation', 'Drop-warning outreach', 'Syllabus FAQ responses'],
        systemPrompt: 'You are Luke, the AI Student Success Advisor. You are encouraging, expert in technical and project fields, and highly responsive. You cite syllabus guides and suggest study hacks.',
        model: 'gemini-3.5-flash',
        tasksCompleted: 1150
      }
    ],
    workflows: [
      {
        id: 'wf_e1',
        name: 'Dormant Student Retention Run',
        description: 'Fired when a student hasn\'t logged in for 5 consecutive days. Analyzes module status and fires customized check-in sequences.',
        trigger: 'Last user login > 5 days ago',
        active: true,
        frequency: 'Daily cron at 10:00',
        nodes: [
          { id: 'n1', type: 'trigger', title: 'Student dormancy detected', status: 'idle', details: 'User daniel@kocoding.dev has 0 lessons completed this week' },
          { id: 'n2', type: 'ai_decision', title: 'Curriculum Progress Analysis', status: 'idle', details: 'Luke reviews Daniel\'s profile: stuck on "API Routing" lesson' },
          { id: 'n3', type: 'action', title: 'Generate Custom Advisor Email', status: 'idle', details: 'Drafts personalized email offering tips for API Routing, including calendar link' },
          { id: 'n4', type: 'action', title: 'Dispatch Message & Track CTR', status: 'idle', details: 'Sends advisor email via SendGrid, creates CRM follow-up' }
        ]
      }
    ],
    knowledge: [
      { id: 'kd4', title: 'AI Developer Curriculum Syllabus V4', category: 'Syllabus', content: 'Module 1: Prompt structure, system parameters. Module 2: Function calling, schema parameters, tool declarations. Module 3: Vector databases, chunking strategy. Module 4: Agent state, graph structures. Final project requires building a sandboxed live agent workspace with REST API integration.', size: '18 KB', lastUpdated: '2026-05-01' }
    ]
  },
  healthcare: {
    metrics: [
      { name: 'Weekly Appointments', value: '312 consultations', change: '+15% telemedicine boost', trend: 'up' },
      { name: 'Patient Trust Rating', value: '4.92 / 5.0', change: 'First class health score', trend: 'up' },
      { name: 'In-Queue Medical Triage', value: '0 patients', change: 'Avg response < 4 mins', trend: 'up' },
      { name: 'Prescription Sync Speed', value: '1.2 mins', change: '-40s electronic compliance', trend: 'up' }
    ],
    products: [
      { id: 'p_h1', name: 'Executive Anti-Aging Screening Package', sku: 'SKU-H501', stock: 200, minStockThreshold: 10, price: 599.00, sales: 152, status: 'In Stock' },
      { id: 'p_h2', name: 'Premium Nutrition & Blood Sugar Consulting', sku: 'SKU-H104', stock: 50, minStockThreshold: 3, price: 180.00, sales: 430, status: 'In Stock' },
      { id: 'p_h3', name: 'Mental Stress & Deep Sleep Biomarker Diagnostics', sku: 'SKU-H302', stock: 0, minStockThreshold: 5, price: 349.00, sales: 84, status: 'Out of Stock' }
    ],
    orders: [
      { id: '#ORD-7108', customerName: 'Frank Underwood', contact: 'f.wood@senate.gov', total: 599.00, status: 'Pending', createdAt: '2026-06-07 15:10', riskScore: 12 },
      { id: '#ORD-7107', customerName: 'Claire Hale', contact: 'claire@hale-global.com', total: 180.00, status: 'AI Confirmed', createdAt: '2026-06-07 14:02', riskScore: 4 }
    ],
    customers: [
      { id: 'CUST-H001', name: 'Frank Underwood', email: 'f.wood@senate.gov', phone: '+1 (555) 202-0051', tier: '普通会员', points: 120, tags: ['联邦政客', '高端VIP'], totalSpend: 599.00, orderCount: 1, status: 'active', createdAt: '2026-04-12 10:14' },
      { id: 'CUST-H002', name: 'Claire Hale', email: 'claire@hale-global.com', phone: '+1 (555) 202-0052', tier: '黄金会员', points: 300, tags: ['高级高管', '深度定制'], totalSpend: 180.00, orderCount: 1, status: 'active', createdAt: '2026-05-01 14:22' }
    ],
    agents: [
      {
        id: 'h_ceo',
        name: 'Victoria',
        title: 'Wellness Director Care CEO',
        role: 'Coordinates doctor schedules, reviews patient retention, ensures strict HIPAA compliance structures, and audits clinic budget distribution.',
        status: 'Idle',
        emoji: '👩‍⚕️',
        description: 'Clinic director optimized for care quality and response compliance.',
        capabilities: ['Triage escalation', 'HIPAA boundaries audit', 'Scheduling allocation'],
        systemPrompt: 'You are Victoria, the Clinical Wellness Director CEO. You discuss general healthcare administration, scheduling optimization, wellness packages, and patient safety under strict non-diagnostic limits.',
        model: 'gemini-3.5-flash',
        tasksCompleted: 450
      },
      {
        id: 'h_triage',
        name: 'Dr. Jamie',
        title: 'AI Patient Care Triage Counselor',
        role: 'Resolves patient scheduling, answers wellness and nutrition general questions, directs complex symptoms to clinical human experts.',
        status: 'Idle',
        emoji: '🩺',
        description: 'Triage specialist grounded in clinical standard operating procedures (SOPs).',
        capabilities: ['Risk scoring triage', 'FAQ nutrition counseling', 'Consultation scheduling'],
        systemPrompt: 'You are Dr. Jamie, the AI Patient Care Specialist. You prioritize patient comfort, safety, and follow strict guidelines: always mention that for acute symptoms of severe pain or emergency, users must call 911 or visit an ER immediately. You speak clearly and with gentle professionalism.',
        model: 'gemini-3.5-flash',
        tasksCompleted: 2420
      }
    ],
    workflows: [
      {
        id: 'wf_h1',
        name: 'Automated Post-Consultation Follow-up',
        description: 'Fired 24 hours after a consultation completes. Prepares custom lifestyle logs and schedule reminders.',
        trigger: 'Consultation Complete webhook',
        active: true,
        frequency: 'Triggered upon appointment tag',
        nodes: [
          { id: 'n1', type: 'trigger', title: 'Consultation checkout tags completed', status: 'idle', details: 'Patient claire@hale-global.com finished Nutrition Consult' },
          { id: 'n2', type: 'ai_decision', title: 'SOP Document Analysis', status: 'idle', details: 'Dr. Jamie looks up the VIP care guidelines for high-fiber diets' },
          { id: 'n3', type: 'action', title: 'Generate Custom Health Check-list', status: 'idle', details: 'Drafts a professional dietary checklist tailored to the patient\'s consultation file' },
          { id: 'n4', type: 'action', title: 'Deliver Patient Email & Follow-up Slot', status: 'idle', details: 'Dispatches secure message, places reminder block for 14-day check-in' }
        ]
      }
    ],
    knowledge: [
      { id: 'kd5', title: 'Patient Privacy Policy (HIPAA Guidance)', category: 'Compliance', content: 'No Protected Health Information (PHI) can be stored in browser localStorage. Patient logs must use secure UUID tokens. Staff are prohibited from discussing patient symptom history over public unsecured text channels. Double verification required for third-party pharmacy shipping releases.', size: '15.4 KB', lastUpdated: '2026-01-20' }
    ]
  },
  service: {
    metrics: [
      { name: 'Booking Slot Utilization', value: '88.4%', change: '+5% last minute fill', trend: 'up' },
      { name: 'Average Service Review', value: '4.95 / 5.0', change: '+0.03 satisfaction index', trend: 'up' },
      { name: 'Outstanding Work orders', value: '2 active', change: 'All staff placed', trend: 'neutral' },
      { name: 'Revenue per Member', value: '$112.50', change: '+12% cross-sell optimization', trend: 'up' }
    ],
    products: [
      { id: 'p_s1', name: 'Deep Tissue Massage & Aromatherapy 90m', sku: 'SKU-S410', stock: 150, minStockThreshold: 5, price: 125.00, sales: 880, status: 'In Stock' },
      { id: 'p_s2', name: 'Premium Hair Keratin Restoration Package', sku: 'SKU-S102', stock: 5, minStockThreshold: 4, price: 185.00, sales: 1520, status: 'In Stock' },
      { id: 'p_s3', name: 'Private 1-on-1 Pilates Conditioning Coach', sku: 'SKU-S301', stock: 0, minStockThreshold: 2, price: 95.00, sales: 410, status: 'Out of Stock' }
    ],
    orders: [
      { id: '#ORD-1102', customerName: 'Gregory House', contact: 'house.diag@princeton.org', total: 125.00, status: 'Pending', createdAt: '2026-06-07 18:30', riskScore: 30 },
      { id: '#ORD-1101', customerName: 'Lisa Cuddy', contact: 'cuddy@princeton.org', total: 185.00, status: 'AI Confirmed', createdAt: '2026-06-07 17:15', riskScore: 2 }
    ],
    customers: [
      { id: 'CUST-S001', name: 'Gregory House', email: 'house.diag@princeton.org', phone: '+1 (555) 732-8201', tier: '普通会员', points: 150, tags: ['挑剔学者', '常客'], totalSpend: 125.00, orderCount: 1, status: 'active', createdAt: '2026-03-10 11:15' },
      { id: 'CUST-S002', name: 'Lisa Cuddy', email: 'cuddy@princeton.org', phone: '+1 (555) 732-8202', tier: '白金会员', points: 500, tags: ['高级总管', '企业会员'], totalSpend: 185.00, orderCount: 1, status: 'active', createdAt: '2026-02-14 09:40' }
    ],
    agents: [],
    workflows: [
      {
        id: 'wf_s1',
        name: 'Last-Minute Cancellation Filler Run',
        description: 'Triggers when a therapist or stylist slot gets cancelled. Finds premium local subscribers and issues special flash vouchers.',
        trigger: 'Slot Cancellation within 12h',
        active: true,
        frequency: 'Instant on scheduling change',
        nodes: [
          { id: 'n1', type: 'trigger', title: 'Slot cancelled late', status: 'idle', details: 'Premium Keratin Slot has opened today at 16:30' },
          { id: 'n2', type: 'ai_decision', title: 'Identify Nearby Active Customers', status: 'idle', details: 'System AI targets top 15 regular active local VIP members' },
          { id: 'n3', type: 'action', title: 'Generate Dynamic Flash-Offer', status: 'idle', details: 'Creates 15% discount coupon: FAST-KERATIN' },
          { id: 'n4', type: 'action', title: 'Dispatch Targeted WhatsApp & SMS', status: 'idle', details: 'Sends invitations to selected VIPs with instant 1-click buy button links' }
        ]
      }
    ],
    knowledge: [
      { id: 'kd6', title: 'Diner and Salon Cancellation Indemnity Standard', category: 'Policy', content: 'Cancellations made within 24 hours of appointment incur a 50% reservation penalty. No-show accounts will be locked from booking priority list. Rescheduling is complimentary up to 24 hours prior. Emergency medical exemptions honored subject to manager override approval.', size: '9.4 KB', lastUpdated: '2026-02-14' }
    ]
  },
  manufacturing: {
    metrics: [
      { name: 'OEE (Overall Efficiency)', value: '82.4%', change: '+3% sensor calibration', trend: 'up' },
      { name: 'Active PO Volume', value: '42 wholesale tons', change: '+12% supplier alignment', trend: 'up' },
      { name: 'Supply SLA Accuracy', value: '98.2%', change: 'Minimal delays this week', trend: 'up' },
      { name: 'Material Cost Volatility', value: '+4.5% aluminum shift', change: 'Alert: margins narrowing', trend: 'down' }
    ],
    products: [
      { id: 'p_m1', name: 'Precision Custom Aluminum Enclosures', sku: 'SKU-M504', stock: 4500, minStockThreshold: 1000, price: 12.50, sales: 82000, status: 'In Stock' },
      { id: 'p_m2', name: 'Galvanized Industrial Hex Screws (x10k)', sku: 'SKU-M102', stock: 450, minStockThreshold: 500, price: 85.00, sales: 12500, status: 'Low Stock' },
      { id: 'p_m3', name: 'Braided Carbon Fiber Structural Tube 2m', sku: 'SKU-M903', stock: 120, minStockThreshold: 200, price: 145.00, sales: 4100, status: 'Low Stock' }
    ],
    orders: [
      { id: '#ORD-5201', customerName: 'Caterpillar Supply Inc', contact: 'purchasing@caterpillar.com', total: 12500.00, status: 'Pending', createdAt: '2026-06-07 12:30', riskScore: 8 },
      { id: '#ORD-5200', customerName: 'Tesla Gigafactory Texas', contact: 'procure@tesla.com', total: 43500.00, status: 'AI Confirmed', createdAt: '2026-06-07 10:15', riskScore: 1 }
    ],
    customers: [
      { id: 'CUST-M001', name: 'Caterpillar Supply Inc', email: 'purchasing@caterpillar.com', phone: '+1 (800) 555-0199', tier: '钻石会员', points: 12000, tags: ['工程机械', '集团采购', '账期控制'], totalSpend: 12500.00, orderCount: 1, status: 'active', createdAt: '2026-02-10 10:25' },
      { id: 'CUST-M002', name: 'Tesla Gigafactory Texas', email: 'procure@tesla.com', phone: '+1 (800) 555-0100', tier: '钻石会员', points: 43000, tags: ['智能重卡', '新能源', '急件配置'], totalSpend: 43500.00, orderCount: 1, status: 'active', createdAt: '2026-05-01 08:30' }
    ],
    agents: [
      {
        id: 'm_ceo',
        name: 'Vince',
        title: 'Factory Operations CEO',
        role: 'Reviews factory utilization capacity, steel index pricing trackers, bulk customer SLA risk factors, and allocates cash reserves.',
        status: 'Idle',
        emoji: '🏭',
        description: 'Heavy enterprise plant director managing material indices.',
        capabilities: ['Capacity load optimization', 'Wholesale pricing trackers', 'B2B credit rating evaluation'],
        systemPrompt: 'You are Vince, the Factory Operations CEO. You talk with hard industrial numbers, manufacturing tolerances, copper and steel stock indices, logistics shipping containers, and supplier SLA percentages.',
        model: 'gemini-3.5-flash',
        tasksCompleted: 450
      },
      {
        id: 'm_procure',
        name: 'Stuart',
        title: 'AI Materials & Procurement Engineer',
        role: 'Monitors raw supply levels, executes programmatic material bids, handles supplier invoice mismatches, and adjusts safety stock metrics.',
        status: 'Idle',
        emoji: '🔧',
        description: 'Wholesale steel, alloy, and chemical sourcing specialist.',
        capabilities: ['Procurement bidding', 'Invoice error detection', 'Material index forecasting'],
        systemPrompt: 'You are Stuart, the Materials and Procurement Specialist. You speak with high-level supply engineering expertise, citing raw sheet weights, mill certificates, shipping delays, and multi-partner cost allocations.',
        model: 'gemini-3.5-flash',
        tasksCompleted: 940
      }
    ],
    workflows: [
      {
        id: 'wf_m1',
        name: 'Delayed Supply Logistics Mitigation',
        description: 'Senses ocean freight bottlenecks and material indices shifts, automatically searching alternative regional suppliers to prevent production shutdowns.',
        trigger: 'Freight delay estimate > 4 days',
        active: true,
        frequency: 'Hourly port scraping cron',
        nodes: [
          { id: 'n1', type: 'trigger', title: 'Customs port delay identified', status: 'idle', details: 'LA Port delay triggers raw Aluminum ingots ETA lag of 6 days' },
          { id: 'n2', type: 'ai_decision', title: 'Alternative Partner Price Ticking', status: 'idle', details: 'Stuart searches catalog bounds of 3 domestic suppliers' },
          { id: 'n3', type: 'condition', title: 'Check Tolerances & Mill Certification', status: 'idle', details: 'Validates if raw material specs align with client safety codes' },
          { id: 'n4', type: 'action', title: 'Approve Split Sourcing PO', status: 'idle', details: 'Executes split order bid to domestic supplier, avoiding pipeline work halts' }
        ]
      }
    ],
    knowledge: [
      { id: 'kd7', title: 'Steel & Aluminum Raw Tolerances Guide', category: 'Standards', content: 'Anodized series 6000 density limits. High-strength aerospace alloy compliance under ASTM-B221. Minimum structural elastic yield threshold is 240 MPa. Thread configurations, load tolerances, and mill certification auditing guides for premium wholesale custom bidding.', size: '24.2 KB', lastUpdated: '2026-03-11' }
    ]
  }
};
