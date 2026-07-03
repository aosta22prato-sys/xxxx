/**
 * ShopifyQL Reports & Custom Engine Database
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface SavedReport {
  id: string;
  name: string;
  description: string;
  shopifyQL: string;
  type: 'sales' | 'payments' | 'inventory' | 'customers';
  createdAt: string;
}

export interface ShopifyQlResult {
  columns: string[];
  rows: Record<string, any>[];
  totalCount: number;
}

export const INITIAL_SAVED_REPORTS: SavedReport[] = [
  {
    id: 'rep_sales_by_month',
    name: '月度销售财务报表 (Monthly Revenue and Sells)',
    description: 'SUM of total gross sales partitioned by current year fiscal months.',
    shopifyQL: 'SHOW sum(gross_sales), sum(net_sales) FROM sales SINCE -12m GROUP BY month ORDER BY month ASC',
    type: 'sales',
    createdAt: '2026-06-10T12:00:00Z'
  },
  {
    id: 'rep_top_selling_products',
    name: '热销畅销商品统计 (Top Sells SPU Volume)',
    description: 'Ordered list of items showing unit quantities and total value.',
    shopifyQL: 'SHOW product_title, sum(quantity), sum(gross_sales) FROM sales SINCE -30d GROUP BY product_title ORDER BY sum(gross_sales) DESC LIMIT 5',
    type: 'sales',
    createdAt: '2026-06-11T15:00:00Z'
  },
  {
    id: 'rep_customer_ltv_segments',
    name: '全球市场客群生命价值 (Localized CLV Segment)',
    description: 'CLV performance and purchase count grouped by billing country.',
    shopifyQL: 'SHOW billing_country, count(order_id), avg(order_value) FROM customers SINCE -365d GROUP BY billing_country ORDER BY avg(order_value) DESC',
    type: 'customers',
    createdAt: '2026-06-12T09:30:00Z'
  }
];

export const MOCK_DATABASE_TABLES = {
  sales: [
    { month: '2026-01', gross_sales: 12450, net_sales: 11200, product_title: 'Classic Wool Trench Coat', quantity: 45, billing_country: 'Belgium' },
    { month: '2026-02', gross_sales: 14890, net_sales: 13400, product_title: 'Classic Wool Trench Coat', quantity: 50, billing_country: 'France' },
    { month: '2026-03', gross_sales: 18450, net_sales: 16200, product_title: 'Sartorial Leather Tote', quantity: 60, billing_country: 'Italy' },
    { month: '2026-04', gross_sales: 22100, net_sales: 19800, product_title: 'Sartorial Leather Tote', quantity: 72, billing_country: 'Italy' },
    { month: '2026-05', gross_sales: 28450, net_sales: 25400, product_title: 'Brussels Linen Shirt', quantity: 120, billing_country: 'Belgium' },
    { month: '2026-06', gross_sales: 32400, net_sales: 29100, product_title: 'Brussels Linen Shirt', quantity: 145, billing_country: 'Germany' }
  ],
  customers: [
    { billing_country: 'Belgium', customer_count: 850, avg_order_value: 284 },
    { billing_country: 'Italy', customer_count: 620, avg_order_value: 345 },
    { billing_country: 'France', customer_count: 740, avg_order_value: 290 },
    { billing_country: 'Germany', customer_count: 910, avg_order_value: 240 },
    { billing_country: 'Others', customer_count: 320, avg_order_value: 180 }
  ]
};
