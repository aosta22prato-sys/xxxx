import { StoreSettings } from '../types';

export const TRANSLATIONS: Record<string, { en: string; zh: string }> = {
  home: { en: 'Home', zh: '首页' },
  orders: { en: 'Orders', zh: '订单' },
  products: { en: 'Products', zh: '商品' },
  customers: { en: 'Customers', zh: '客户' },
  more: { en: 'More', zh: '更多' },
  merchant_suffix: { en: 'Merchant Admin', zh: '商家管理员' },
  product_catalog: { en: 'Catalog', zh: '款式/中心' },
  inventory: { en: 'Inventory', zh: '库存管理' },
  collections: { en: 'Collections', zh: '商品分类' },
  customers_list: { en: 'List', zh: '所有客户' },
  segments: { en: 'Segments', zh: '客户分群' },
  marketing: { en: 'Marketing', zh: '经营营销' },
  campaigns: { en: 'Campaigns', zh: '营销活动' },
  automations: { en: 'Automations', zh: '自动化流' },
  discounts: { en: 'Discounts', zh: '优惠管理' },
  content: { en: 'Content', zh: '内容管理' },
  asset_files: { en: 'Files', zh: '文件库' },
  static_pages: { en: 'Pages', zh: '页面中心' },
  markets: { en: 'Markets', zh: '全球市场' },
  financials: { en: 'Financials', zh: '财务中心' },
  overview_stats: { en: 'Overview', zh: '财务看板' },
  atelier_capital: { en: 'Capital', zh: 'Atelier资金' },
  analytics: { en: 'Analytics', zh: '分析洞察' },
  trends: { en: 'Trends', zh: '数据趋势' },
  reports_list: { en: 'Reports', zh: '分析报告' },
  sales_channels: { en: 'Sales Channels', zh: '销售渠道' },
  online_store: { en: 'Online Store', zh: '在线店铺' },
  pos_sales: { en: 'POS Setup', zh: 'POS门店' },
  agentico_ai: { en: 'AI Enterprise Org', zh: 'AI员工组织' },
  embedded_apps: { en: 'Apps & Plugins', zh: '应用中心' },
  settings: { en: 'Settings', zh: '系统设置' }
};

export function translate(key: string, settings?: StoreSettings | null): string {
  const lang = settings?.language === 'en' ? 'en' : 'zh';
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[lang];
}
