export type UserRole = "admin" | "operator" | "finance" | "warehouse" | "developer" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  token?: string;
}

export interface AppReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppMarketItem {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  developer: string;
  price: number;
  rating: number;
  installCount: number;
  reviews: AppReview[];
  isInstalled: boolean;
  version: string;
  docsUrl: string;
  licenseKey?: string;
  status: "pending" | "approved";
}

export interface DevApp {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  webhookUrl: string;
  status: "sandbox" | "production";
  version: string;
}

export interface DevLog {
  id: string;
  timestamp: string;
  type: string;
  event: string;
  status: "success" | "failure";
  statusCode: number;
  payload: string;
  durationMs: number;
}

export interface SysLog {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error";
  type: "auth" | "db" | "api" | "system" | "audit" | "supply" | "app";
  message: string;
  user: string;
  ip: string;
}

export interface OrderItem {
  productId: string;
  name?: string;
  sku?: string;
  price: number;
  quantity: number;
  image?: string;
  title?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerName: string;
  email?: string;
  items: OrderItem[];
  totalAmount?: number;
  paymentStatus: "paid" | "unpaid" | "refunded" | "partially_refunded" | "pending";
  shippingStatus?: "pending" | "shipped" | "delivered" | "cancelled" | "unfulfilled" | "fulfilled";
  date?: string;
  notes?: string;
  trackingNumber?: string;
  discountCode?: string;
  
  // 别名与向后兼容定义
  createdAt?: string;
  fulfillmentStatus?: "pending" | "shipped" | "delivered" | "cancelled" | "unfulfilled" | "fulfilled";
  name?: string;
  total?: number;
  customerPhone?: string;
  customerEmail?: string;
  isArchived?: boolean;
  aiValue?: string;
  aiRisk?: "low" | "medium" | "high" | string;
  tags?: string[];
  carrier?: string;
  
  // Custom billing attributes
  subtotal?: number;
  tax?: number;
  shipping?: number;
  discountAmount?: number;
}

export interface Product {
  id: string;
  name?: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  stock?: number;
  isTracked?: boolean;
  type?: string;
  status: "published" | "draft" | "active" | "archived";
  collections?: string[];
  variants?: { name: string; options: string[] }[];
  tags?: string[];

  // 别名与向后兼容定义
  compareAtPrice?: number;
  inventory?: number;
  images?: string[];
  vendor?: string;
  costPerItem?: number;
  inventoryByLocation?: Record<string, number>;
}

export interface Collection {
  id: string;
  name: string;
  conditions: string;
  count: number;
  image: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  productsCount: number;
  rating: number;
}

export interface SupplyItem {
  sku: string;
  quantity: number;
  cost: number;
}

export interface SupplyOrder {
  id: string;
  supplierName: string;
  date: string;
  items: SupplyItem[];
  total: number;
  status: "pending" | "received";
}

export interface Customer {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  ordersCount?: number;
  totalSpent?: number;
  avatar?: string;
  labels?: string[];
  ltv?: number;
  segments?: string[];
  notes?: string;
  consentMarketing?: boolean;
  dateJoined?: string;

  // 别名与向后兼容定义
  company?: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  segment?: string;
  addresses?: any[];
}

export interface MarketingCampaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  clicks: number;
  conversions: number;
  budget: number;
  spend: number;
  sales: number;
  type: "email" | "social" | "google";
  dateCreated: string;
}

export interface MarketingAutomation {
  id: string;
  name: string;
  triggerEvent: string;
  delayHours: number;
  isEnabled: boolean;
  sentCount: number;
  openRate: number;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "free_shipping" | "buy_x_get_y";
  value: number;
  minPurchase?: number;
  useLimit?: number;
  useCount?: number;
  startDate?: string;
  endDate?: string;
  status: "active" | "expired" | "scheduled";
  valueText?: string;
  usageCount?: number;
  minRequirement?: string;
  buyQuantity?: number;
  getYQuantity?: number;
}

export interface FinanceRecord {
  id: string;
  type: "income" | "refund" | "shipping" | "tax" | "subscription" | "app_purchase";
  amount: number;
  date: string;
  description: string;
  status: "completed" | "pending";
}

export interface EnterpriseState {
  users: User[];
  currentUser: User;
  appMarket: AppMarketItem[];
  devApps: DevApp[];
  devLogs: DevLog[];
  sysLogs: SysLog[];
  orders: Order[];
  products: Product[];
  collections: Collection[];
  suppliers: Supplier[];
  supplyOrders: SupplyOrder[];
  customers: Customer[];
  campaigns: MarketingCampaign[];
  automations: MarketingAutomation[];
  discountCodes: DiscountCode[];
  finances: FinanceRecord[];
}

export type Discount = DiscountCode;

export interface StoreSettings {
  storeName?: string;
  domain?: string;
  contactEmail?: string;
  currency: string;
  timezone: string;
  language: string;
  shopName?: string;
  shopEmail?: string;
  currencySymbol?: string;
  shippingStandardRate?: number;
  taxRate?: number;
  plan?: string;
}

export interface B2BContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  customerId?: string;
}

export interface B2BCompany {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  status?: "active" | "suspended";
  paymentTerms?: string;
  customerId?: string;

  // Additional fields used inside CompanyView
  businessId?: string;
  location?: string;
  paymentTerm?: string;
  creditLimit?: number;
  catalogId?: string;
  totalSpent?: number;
  ordersCount?: number;
  primaryContactName?: string;
  primaryContactEmail?: string;
  contacts?: B2BContact[];
}

export interface Segment {
  id: string;
  name: string;
  query: string;
  memberCount: number;
  description?: string;
  category?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "model";
  text: string;
  timestamp: string;
}

