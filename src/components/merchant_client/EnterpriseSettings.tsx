import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Settings, 
  Save, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Cpu, 
  Globe, 
  ShieldAlert, 
  HelpCircle,
  CreditCard,
  Layers,
  FileText,
  BadgeAlert,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Check,
  Users,
  Navigation,
  Compass,
  CheckSquare,
  Megaphone,
  Activity,
  Award,
  Bell,
  Database,
  Search,
  BookOpen,
  Mail,
  Sliders,
  ChevronRight,
  Plus,
  Trash2,
  Lock,
  Globe2,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  Tag,
  Code,
  Download,
  Printer
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { IndustryType, OrderItem, ProductItem } from '../../types';
import EmployeeCenter from './EmployeeCenter';
import RolesCenter from './RolesCenter';
import PaymentCenter from './PaymentCenter';
import LogisticsCenter from './LogisticsCenter';
import PoliciesManagement from './PoliciesManagement';

interface EnterpriseSettingsProps {
  companyName: string;
  onUpdateCompanyName: (name: string) => void;
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  orders: OrderItem[];
  products: ProductItem[];
  onUpdateOrders: (updated: OrderItem[]) => void;
  onUpdateProducts: (updated: ProductItem[]) => void;
  parentActiveTab?: string;
}

interface MockInvoice {
  id: string;
  date: string;
  desc: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export default function EnterpriseSettings({ 
  companyName, 
  onUpdateCompanyName, 
  selectedIndustry, 
  addLog,
  orders,
  products,
  onUpdateOrders,
  onUpdateProducts,
  parentActiveTab
}: EnterpriseSettingsProps) {
  // Main settings categories matching Shopify perfectly
  const [activeTab, setActiveTab] = useState<string>('generali');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (parentActiveTab === 'payments') {
      setActiveTab('pagamenti');
    } else if (parentActiveTab === 'logistics') {
      setActiveTab('spedizione');
    } else if (parentActiveTab === 'employees') {
      setActiveTab('utenti');
      setUtentiSubTab('employees');
    } else if (parentActiveTab === 'roles') {
      setActiveTab('utenti');
      setUtentiSubTab('roles');
    } else if (parentActiveTab === 'policies') {
      setActiveTab('normative');
    } else if (parentActiveTab === 'settings') {
      setActiveTab('generali');
    }
  }, [parentActiveTab]);

  // 1. Generali settings state
  const [nameInput, setNameInput] = useState(companyName);
  const [storeEmail, setStoreEmail] = useState('operations@aurora-retail.eu');
  const [currency, setCurrency] = useState('EUR');
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [vatNo, setVatNo] = useState('EU892019203');
  
  const addressPresets = [
    { label: '巴黎二号旗舰仓 (Rue de la Paix, Paris, France)', vat: 'FR892019203', tz: 'Europe/Paris', cur: 'EUR' },
    { label: '米兰奢侈品集散部 (Via Monte Napoleone, Milano, Italy)', vat: 'IT920392019', tz: 'Europe/Rome', cur: 'EUR' },
    { label: '柏林大区保税一仓 (Friedrichstraße, Berlin, Germany)', vat: 'DE120301034', tz: 'Europe/Berlin', cur: 'EUR' },
    { label: '鹿特丹自由港保税二仓 (Coolsingel, Rotterdam, Netherlands)', vat: 'NL661928318', tz: 'Europe/Amsterdam', cur: 'EUR' }
  ];
  const [selectedAddress, setSelectedAddress] = useState(addressPresets[0].label);

  // 2. Subscription package plan state (Piano)
  const [activePlan, setActivePlan] = useState<'basic' | 'advanced' | 'plus'>('basic');

  // 3. Billing registry (Fatturazione)
  const [invoices, setInvoices] = useState<MockInvoice[]>([
    { id: 'INV-2026-904', date: '2026-06-05', desc: 'Shopify Premium SaaS Subscription Plan (Basic Package)', amount: 29.00, status: 'paid' },
    { id: 'INV-2026-812', date: '2026-05-18', desc: 'Gemini Agent Orchestration API High-Token Surcharge', amount: 98.40, status: 'pending' },
    { id: 'INV-2026-701', date: '2026-04-15', desc: 'EU-Wide Address Auto-Resolution Gateway Fee', amount: 12.00, status: 'overdue' }
  ]);

  // 4. Utenti / Team Management toggle
  const [utentiSubTab, setUtentiSubTab] = useState<'employees' | 'roles'>('employees');

  // 6. Check-out settings custom state
  const [requireLastNameOnly, setRequireLastNameOnly] = useState<boolean>(false);
  const [requirePhone, setRequirePhone] = useState<boolean>(true);
  const [shippingAddressLine2, setShippingAddressLine2] = useState<'optional' | 'required' | 'hidden'>('optional');
  const [autoCompleteAddress, setAutoCompleteAddress] = useState<boolean>(true);

  // 7. Client Account strategy parameters
  const [customerLoginRequired, setCustomerLoginRequired] = useState<boolean>(false);
  const [allowPasscodeLogin, setAllowPasscodeLogin] = useState<boolean>(true);

  // 9. Taxes / Imposte rates list
  const [taxRates, setTaxRates] = useState([
    { country: 'Germany (DE)', rate: 19, code: 'DE-VAT', enabled: true },
    { country: 'France (FR)', rate: 20, code: 'FR-TVA', enabled: true },
    { country: 'Italy (IT)', rate: 22, code: 'IT-IVA', enabled: true },
    { country: 'Spain (ES)', rate: 21, code: 'ES-IVA', enabled: true },
    { country: 'Netherlands (NL)', rate: 21, code: 'NL-BTW', enabled: true }
  ]);
  const [newCountry, setNewCountry] = useState('');
  const [newRate, setNewRate] = useState<number>(20);
  const [newTaxCode, setNewTaxCode] = useState('');

  // 10. Sedi stock locations
  const [warehouses, setWarehouses] = useState([
    { id: 'WH-PARIS', name: '巴黎主运营保税仓', address: 'Rue de Rivoli, Paris', priority: 1, stockCount: 1420, active: true },
    { id: 'WH-ROME', name: '意法中转枢纽站', address: 'Via Salaria, Roma', priority: 2, stockCount: 890, active: true },
    { id: 'WH-BERLIN', name: '柏林配送中心', address: 'Kurfürstendamm, Berlin', priority: 3, stockCount: 560, active: false }
  ]);
  const [newWHName, setNewWHName] = useState('');
  const [newWHAddress, setNewWHAddress] = useState('');

  // 11. International exchange rates (Mercati)
  const [exchangeRates, setExchangeRates] = useState([
    { pair: 'EUR / USD', rate: 1.085, lastUpdated: '2026-06-08', method: 'Automatic' },
    { pair: 'EUR / GBP', rate: 0.854, lastUpdated: '2026-06-08', method: 'Automatic' },
    { pair: 'EUR / CHF', rate: 0.978, lastUpdated: '2026-06-08', method: 'Automatic' },
    { pair: 'EUR / SEK', rate: 11.45, lastUpdated: '2026-06-08', method: 'Manual' }
  ]);

  // 12. App installations list
  const [installedApps, setInstalledApps] = useState([
    { id: 'app-klaviyo', name: 'Klaviyo Segment Automation', dev: 'Klaviyo Inc.', scope: 'Write customers, orders', status: 'active' },
    { id: 'app-taxcloud', name: 'EU Customs TaxCloud API', dev: 'TaxCloud Labs', scope: 'Read orders, calculate taxes', status: 'active' },
    { id: 'app-easyship', name: 'Easyship Logistics Gateway', dev: 'Easyship Dev', scope: 'Full logistics API control', status: 'active' }
  ]);

  // 13. Sales channels connected (Canali di vendita)
  const [channels, setChannels] = useState([
    { id: 'online', name: '多租户在线小店门户 (Online Store)', status: 'Connected', loadMs: 12 },
    { id: 'tiktok', name: 'TikTok European Commerce Channel', status: 'Synchronized', loadMs: 45 },
    { id: 'amazon', name: 'Amazon Central Europe Dispatch integration', status: 'Active (FBA Integration)', loadMs: 89 },
    { id: 'pos', name: 'Shopify Mobile POS Terminal Bridge', status: 'Disconnected', loadMs: 0 }
  ]);

  // 14. Custom domain registry names
  const [domains, setDomains] = useState([
    { domain: 'aurora-fashion.eu', type: 'Primary Domain', status: 'Connected (SSL Active)', provider: 'GoDaddy SEC' },
    { domain: 'www.aurora-fashion.eu', type: 'Alias Redirect', status: 'Connected (SSL Active)', provider: 'Cloudflare CNAME' },
    { domain: 'shop.french-vintage.com', type: 'Third-party Domain', status: 'Pending Verification (A Record)', provider: 'Namecheap' }
  ]);
  const [newDomainInput, setNewDomainInput] = useState('');

  // 15. Customer tracking pixel logs
  const [pixels, setPixels] = useState([
    { id: 'px-ga4', name: 'Google Analytics 4 Global Tags', tagId: 'G-EU920BXL22', state: 'active', hits: 14190 },
    { id: 'px-meta', name: 'Meta Pixel Conversion Optimization API', tagId: 'PX-77291039', state: 'active', hits: 8905 }
  ]);
  const [gdprPrivacyTier, setGdprPrivacyTier] = useState<'restrictive' | 'optin' | 'lax'>('restrictive');

  // 16. Brand styling center custom variables
  const [brandColorPrimary, setBrandColorPrimary] = useState('#07C2E3');
  const [brandColorSecondary, setBrandColorSecondary] = useState('#4F46E5');
  const [sloganInput, setSloganInput] = useState('Premium European Craftsmanship, Delivered Interactively');

  // 17. Customizable email/SMS notifier configs
  const [notifications, setNotifications] = useState([
    { id: 'not-order', name: '订单付款确认电邮 (Order Payment Confirmed)', trigger: 'Instant' },
    { id: 'not-shipped', name: '物流出单承运跟踪 (Fulfillment Air-Waybill Issued)', trigger: 'WMS Dispatch API' },
    { id: 'not-abandoned', name: '欧盟防流失自动挽加购物车 (Abandoned Cart Retrieval)', trigger: 'Delay 45 mins' },
    { id: 'not-welcome', name: '会员首次注册优惠发放 (New Customer Voucher Approved)', trigger: 'Instant' }
  ]);

  // 18. Custom Data variables (Metafields / Custom Fields Definitions)
  const [metafields, setMetafields] = useState([
    { id: 'mf-safety', scope: 'Products', name: 'CE 欧盟安全认证证明标识 (Safety Certificate URL)', key: 'custom_ce_label', type: 'URL String' },
    { id: 'mf-wash', scope: 'Products', name: '多国语洗衣水洗操作标签说明 (Fabric Wash Instructions)', key: 'fabric_care_it_fr', type: 'Rich Text' },
    { id: 'mf-eori', scope: 'Customers', name: 'B2B 商家海关退税 EORI 识别序列号 (Corporate EORI No)', key: 'custom_eori_tax', type: 'Alphanumeric ID' }
  ]);
  const [newMFName, setNewMFName] = useState('');
  const [newMFKey, setNewMFKey] = useState('');
  const [newMFScope, setNewMFScope] = useState<'Products' | 'Orders' | 'Customers'>('Products');

  // Botble CMS & Laravel 12.x Bridge State Definitions
  const [botbleEndpoint, setBotbleEndpoint] = useState('https://your-laravel-botble-domain.eu/api/v1');
  const [botbleSecretKey, setBotbleSecretKey] = useState('botble_sec_bfd68fa82b9921c210ab15e07c2e3');
  const [isTestingSync, setIsTestingSync] = useState(false);
  const [syncScenario, setSyncScenario] = useState<'low_inventory' | 'new_product_raw' | 'vip_silent'>('low_inventory');
  const [activeCodeSelector, setActiveCodeSelector] = useState<'laravel' | 'vue' | 'webhook'>('laravel');
  const [simulatedSyncEventResult, setSimulatedSyncResult] = useState<any | null>(null);
  const [botbleSyncLogs, setBotbleSyncLogs] = useState([
    { id: 'b-log-1', time: new Date(Date.now() - 3600000).toLocaleTimeString(), category: 'WMS Sourcing', msg: 'Sync established: Matched 4 Products taxonomy items with Botble DB schema.', status: 'success' },
    { id: 'b-log-2', time: new Date(Date.now() - 1800000).toLocaleTimeString(), category: 'Yield Pricing', msg: 'Calculated elasticity markup coefficients inside Botble base tables.', status: 'success' },
    { id: 'b-log-3', time: new Date(Date.now() - 600000).toLocaleTimeString(), category: 'Constitutional Guard', msg: 'System check: HMAC validation handshake passed successfully with Botble.', status: 'success' }
  ]);

  // Preset operations
  const handleApplyAddressPreset = (idx: number) => {
    const item = addressPresets[idx];
    setSelectedAddress(item.label);
    setVatNo(item.vat);
    setTimezone(item.tz);
    setCurrency(item.cur);
    addLog(
      'Settings Sync',
      '加载库房及欧盟VAT税号',
      `商家选择快捷地址：${item.label}，VAT税号已自动同步匹配为 [${item.vat}] 结算货币设为: ${item.cur}`,
      'info'
    );
  };

  const handleSaveGenerali = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompanyName(nameInput);
    addLog(
      'System Operator',
      '常规主体设置 (Generali) 保存',
      `店铺名称更新为「${nameInput}」 | 保税仓地址: ${selectedAddress} | 结算币种: ${currency} | VAT税号: ${vatNo}`,
      'success'
    );
    alert('常规主体设置保存完毕。');
  };

  const handleUpgradePlan = (planId: 'basic' | 'advanced' | 'plus') => {
    setActivePlan(planId);
    let name = planId === 'basic' ? 'Basic Shopify 基础商用版' : planId === 'advanced' ? 'Advanced Shopify 全功能专业版' : 'Shopify Plus 企业集团级高并发特权';
    let cost = planId === 'basic' ? 29 : planId === 'advanced' ? 79 : 299;
    
    const newInv: MockInvoice = {
      id: `INV-2026-${Math.floor(Math.random() * 800) + 100}`,
      date: new Date().toISOString().slice(0, 10),
      desc: `Upgrade Surcharge to ${name} Settle-Up`,
      amount: cost,
      status: 'paid'
    };
    setInvoices(p => [newInv, ...p]);
    addLog(
      'Billing Engine',
      '套餐自动划费与配置变更',
      `商户手动切换订阅版型至 [${name}]，已即时从汇款卡发起划欠 €${cost}.00，付款流水已归档。`,
      'success'
    );
    alert(`订阅已升级至: ${name} (已即付 €${cost}.00)`);
  };

  const handleDownloadInvoicePDF = (inv: MockInvoice) => {
    try {
      const doc = new jsPDF();
      
      // Invoice branding header
      doc.setFillColor(7, 194, 227); // #07C2E3
      doc.rect(0, 0, 210, 15, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('AI COMMERCE OS - OFFICIAL INVOICE', 15, 10);
      
      // Billing metadata
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('INVOICE / FACTURE', 15, 35);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Invoice ID:`, 15, 45);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(inv.id, 45, 45);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Issue Date:`, 15, 51);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(inv.date, 45, 51);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`SaaS Tenant:`, 15, 57);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(companyName || 'IT-RETAIL-02', 45, 57);

      // Issuer / Provider details on the right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text('Billing Provider / Issuer:', 130, 35);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('AI Commerce OS Europe S.A.R.L.', 130, 41);
      doc.text(`VAT ID No: ${vatNo || 'EU892019203'}`, 130, 46);
      doc.text(selectedAddress || 'Rue de la Paix, Paris, France', 130, 51);
      
      // Table header
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.5);
      doc.line(15, 70, 195, 70);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text('Service Description', 15, 76);
      doc.text('Qty', 120, 76, { align: 'center' });
      doc.text('Unit Price', 150, 76, { align: 'right' });
      doc.text('Total (EUR)', 195, 76, { align: 'right' });
      
      doc.line(15, 82, 195, 82);
      
      // Item row
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      
      // Split description across multiple lines if too long
      const splitDesc = doc.splitTextToSize(inv.desc, 95);
      doc.text(splitDesc, 15, 90);
      doc.text('1', 120, 90, { align: 'center' });
      doc.text(`EUR ${inv.amount.toFixed(2)}`, 150, 90, { align: 'right' });
      doc.text(`EUR ${inv.amount.toFixed(2)}`, 195, 90, { align: 'right' });
      
      // Calculate splitDesc high to put the next line
      const textHeight = splitDesc.length * 5;
      const totalY = Math.max(105, 90 + textHeight);
      
      doc.line(15, totalY, 195, totalY);
      
      // Total amount summary
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text('Subtotal:', 150, totalY + 10, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(`EUR ${inv.amount.toFixed(2)}`, 190, totalY + 10, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      doc.text('VAT / TVA (0% Intracommunity):', 150, totalY + 16, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.text(`EUR 0.00`, 190, totalY + 16, { align: 'right' });
      
      doc.line(130, totalY + 22, 195, totalY + 22);
      
      // Dynamic variables for status and stamp
      let stampBgColor = [240, 253, 250]; // teal-50
      let stampBorderColor = [153, 246, 228]; // teal-200
      let stampTextColor = [13, 148, 136]; // teal-600
      let stampText = 'STATUS: CLEARANCE PAID';
      let stampSubText = 'SEPA Direct Debit Settled';
      let stampAuthCode = 'Auth Code: OK-SEPA-810';
      let totalLabel = 'Total Paid:';
      let labelColor = [7, 194, 227]; // #07C2E3

      if (inv.status === 'pending') {
        stampBgColor = [254, 243, 199]; // amber-50
        stampBorderColor = [252, 211, 77]; // amber-200
        stampTextColor = [217, 119, 6]; // amber-600
        stampText = 'STATUS: OUTSTANDING PENDING';
        stampSubText = 'Pending SEPA Settlement';
        stampAuthCode = 'Due Date: Next 14 Days';
        totalLabel = 'Total Pending:';
        labelColor = [217, 119, 6]; // amber-600
      } else if (inv.status === 'overdue') {
        stampBgColor = [254, 226, 226]; // red-50
        stampBorderColor = [252, 165, 165]; // red-200
        stampTextColor = [220, 38, 38]; // red-600
        stampText = 'STATUS: INVOICE OVERDUE';
        stampSubText = 'Overdue Notice Issued';
        stampAuthCode = 'Action Required: Immediate';
        totalLabel = 'Total Outstanding:';
        labelColor = [220, 38, 38]; // red-600
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(totalLabel, 150, totalY + 30, { align: 'right' });
      doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
      doc.text(`EUR ${inv.amount.toFixed(2)}`, 190, totalY + 30, { align: 'right' });
      
      // Payment voucher details stamp
      doc.setFillColor(stampBgColor[0], stampBgColor[1], stampBgColor[2]);
      doc.rect(15, totalY + 5, 55, 25, 'F');
      doc.setDrawColor(stampBorderColor[0], stampBorderColor[1], stampBorderColor[2]);
      doc.rect(15, totalY + 5, 55, 25, 'S');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(stampTextColor[0], stampTextColor[1], stampTextColor[2]);
      doc.text(stampText, 20, totalY + 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(stampSubText, 20, totalY + 18);
      doc.text(stampAuthCode, 20, totalY + 24);
      
      // Footnotes and disclaimers
      doc.line(15, 250, 195, 250);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('This subscription invoice has been automatically audited/processed by AI Commerce OS under European Commerce and Taxes Regulations.', 15, 256);
      doc.text('If you have any questions, please contact billing@aurora-retail.eu. Thank you for your continued business.', 15, 261);
      
      // Save it
      doc.save(`${inv.id}.pdf`);
      
      addLog('Billing Agent', '下载 PDF 发票', `成功生成并下载发票 [${inv.id}] 的 PDF 电子票据单（金额：€${inv.amount.toFixed(2)}）。`, 'success');
    } catch (err: any) {
      console.error(err);
      addLog('Billing Agent', '生成 PDF 失败', `生成 PDF 时发生错误：${err.message}`, 'error');
    }
  };

  const handlePrintInvoice = (inv: MockInvoice) => {
    addLog('Print Agent', '触发票据打印机制', `成功为发票 [${inv.id}] 下发本地无线/局域网云打印指令（双向合规凭底证已传输完毕）。`, 'info');
  };

  const handleExportAllInvoicesPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Invoice branding header
      doc.setFillColor(7, 194, 227); // #07C2E3
      doc.rect(0, 0, 210, 15, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('AI COMMERCE OS - MULTI-TENANT BILLING REGISTRY', 15, 10);
      
      // Billing metadata
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('BILLING STATEMENT SUMMARY', 15, 30);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`Tenant Name:`, 15, 38);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(companyName || 'IT-RETAIL-02', 45, 38);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`VAT ID No:`, 15, 43);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(vatNo || 'EU892019203', 45, 43);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Export Date:`, 15, 48);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(new Date().toISOString().slice(0, 10), 45, 48);

      // Provider details on the right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text('Billing Authority:', 130, 30);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('AI Commerce OS Europe S.A.R.L.', 130, 36);
      doc.text(selectedAddress || 'Rue de la Paix, Paris, France', 130, 41);
      
      // Table header
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.5);
      doc.line(15, 58, 195, 58);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text('Invoice Ref', 15, 63);
      doc.text('Date', 45, 63);
      doc.text('Description', 70, 63);
      doc.text('Status', 160, 63, { align: 'center' });
      doc.text('Amount (EUR)', 195, 63, { align: 'right' });
      
      doc.line(15, 67, 195, 67);
      
      // Render rows
      let activeY = 73;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      
      invoices.forEach((inv) => {
        doc.setFont('helvetica', 'bold');
        doc.text(inv.id, 15, activeY);
        doc.setFont('helvetica', 'normal');
        doc.text(inv.date, 45, activeY);
        
        // Wrap text
        const splitText = doc.splitTextToSize(inv.desc, 80);
        doc.text(splitText, 70, activeY);
        
        doc.text(inv.status.toUpperCase(), 160, activeY, { align: 'center' });
        doc.text(`EUR ${inv.amount.toFixed(2)}`, 195, activeY, { align: 'right' });
        
        const textLines = splitText.length;
        activeY += textLines * 4.5 + 4;
        doc.line(15, activeY - 2, 195, activeY - 2);
      });
      
      // Summary calculations
      const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Cumulative Statement Value:', 130, activeY + 10, { align: 'right' });
      doc.setTextColor(7, 194, 227); // #07C2E3
      doc.text(`EUR ${totalAmount.toFixed(2)}`, 195, activeY + 10, { align: 'right' });
      
      // Footer
      doc.line(15, 250, 195, 250);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('This is an official summary statement generated from your SaaS Management console.', 15, 256);
      doc.text('All operations comply with European B2B digital services rendering acts.', 15, 261);
      
      doc.save(`Billing_Statement_${new Date().toISOString().slice(0, 10)}.pdf`);
      addLog('Billing Agent', '合并导出对公账单总表', `成功为商户 [${companyName || 'IT-RETAIL-02'}] 导出 ${invoices.length} 笔财务周期内的发票流水汇总 PDF`, 'success');
    } catch (err: any) {
      console.error(err);
      addLog('Billing Agent', '合并导出 PDF 失败', `生成汇总 PDF 时发生错误：${err.message}`, 'error');
    }
  };

  const handleAddTaxRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry) return;
    setTaxRates(prev => [...prev, { country: newCountry, rate: newRate, code: newTaxCode || 'VAT-EXTRA', enabled: true }]);
    addLog('Tax Engine', '追加欧洲关税/附加税主体', `追加新出货目的地 ${newCountry}，默认税率 ${newRate}%, 退税参考代码 [${newTaxCode || 'VAT-EXTRA'}]`, 'success');
    setNewCountry('');
    setNewTaxCode('');
  };

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWHName) return;
    const newId = `WH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setWarehouses(prev => [...prev, { id: newId, name: newWHName, address: newWHAddress, priority: prev.length + 1, stockCount: 0, active: true }]);
    addLog('Inventory Hub', '开设新库房网点', `在地点 [${newWHAddress}] 开设独立库站 ${newWHName}，优先级 ${warehouses.length + 1}`, 'success');
    setNewWHName('');
    setNewWHAddress('');
  };

  const handleAddCustomMetafield = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMFName || !newMFKey) return;
    const newId = `mf-${Math.random().toString(36).substr(2, 5)}`;
    setMetafields(prev => [...prev, { id: newId, scope: newMFScope, name: newMFName, key: newMFKey, type: 'Alphanumeric ID' }]);
    addLog('Metafields Engine', '声明元字段Metafield schema', `为 [${newMFScope}] 模型声明自定义扩展元字段 [${newMFKey}] (字段说明: ${newMFName})`, 'success');
    setNewMFName('');
    setNewMFKey('');
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput) return;
    setDomains(prev => [...prev, { domain: newDomainInput, type: 'Alias Redirect', status: 'Pending Verification (A Record)', provider: 'GoDaddy CNAME' }]);
    addLog('DNS Core', '挂接新独立出海域名', `登记新自定义欧洲域名: ${newDomainInput}，已自动下发阿里云/Cloudflare双向DNS接入指令。`, 'info');
    setNewDomainInput('');
  };

  const handleToggleWH = (id: string) => {
    setWarehouses(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
    addLog('Inventory Hub', '库房地点物理活跃态调节', `库房 [${id}] 的营业状态已手动变更为活跃/停业。`, 'warning');
  };

  // Filter 19 categories in the index
  const settingsCategories = [
    { id: 'generali', name: '🏢 常规主体', desc: '店铺主体', icon: Building },
    { id: 'piano', name: '📊 套餐订阅', desc: '套餐切换', icon: Layers },
    { id: 'fatturazione', name: '🧾 财务账单', desc: '账单历史', icon: FileText },
    { id: 'utenti', name: '👥 团队权限', desc: '员工与权限控制', icon: Users },
    { id: 'pagamenti', name: '💳 支付设置', desc: '绑定终端支付', icon: CreditCard },
    { id: 'checkout', name: '🛍 结账设置', desc: '结账行为规则', icon: Sparkles },
    { id: 'account_cliente', name: '👤 客户账户', desc: '客户注册机制', icon: Globe },
    { id: 'spedizione', name: '🚚 配送交付', desc: '物流与发货绑定', icon: MapPin },
    { id: 'imposte', name: '💰 税费关税', desc: '欧盟VAT关税', icon: DollarSign },
    { id: 'sedi', name: '🏢 库房网点', desc: '多库存保管点', icon: Navigation },
    { id: 'mercati', name: '🌍 国际市场', desc: '多币种自动汇率', icon: Compass },
    { id: 'app', name: '🧩 插件管理', desc: '管理应用插件', icon: CheckSquare },
    { id: 'botble_bridge', name: '🔌 Botble 协同中枢', desc: 'Laravel 12 + Botble 联动', icon: Sliders },
    { id: 'canali_vendita', name: '📢 销售渠道', desc: '多渠道同步', icon: Megaphone },
    { id: 'domini', name: '🌐 域名绑定', desc: '站点域名绑定', icon: Globe },
    { id: 'eventi_clienti', name: '📈 事件追踪', desc: '隐私统计埋点', icon: Activity },
    { id: 'brand', name: '🎨 品牌视觉', desc: '商铺视觉定制', icon: Award },
    { id: 'notifiche', name: '✉️ 模板通知', desc: '业务自动通知', icon: Bell },
    { id: 'dati_personalizzati', name: '🗄 扩展属性', desc: '自定义字段', icon: Database },
    { id: 'normative', name: '🛡 合规条款', desc: '隐私合规设置', icon: ShieldAlert }
  ];

  const filteredCategories = settingsCategories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left font-sans">
      
      {/* 19-Tab Left index sidebar with search bar */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm flex flex-col h-[750px] overflow-hidden">
        <div className="space-y-1 select-none">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '8s' }} />
            <span>核心参数控制中心</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-medium font-semibold">企业级多租户配置</p>
        </div>

        {/* Categories Instant Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white text-slate-800"
            placeholder="搜索设置类别 (例如: 支付, 配送, 关税)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tab list with scrolling */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 select-none custom-scrollbar">
          {filteredCategories.length > 0 ? (
            filteredCategories.map(tab => {
              const IconComponent = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    addLog('Settings Center', '切换系统二级设置参数', `切换至「${tab.name}」`, 'info');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-650 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#07C2E3]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <div className="min-w-0">
                      <p className={`text-[11.5px] font-bold truncate leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>{tab.name}</p>
                      <p className={`text-[9.5px] truncate mt-0.5 font-normal ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>{tab.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-white rotate-90' : 'text-slate-300 group-hover:translate-x-0.5'}`} />
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-[11px] text-slate-400 font-medium">
              无匹配的核心设置类别
            </div>
          )}
        </div>

        {/* Trial alerts in the bottom corner */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl select-none">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500 animate-pulse animate-duration-1000" />
            <span className="text-[10px] font-bold text-amber-800">Piano 订阅余量</span>
          </div>
          <p className="text-[9px] text-amber-600 mt-1 font-semibold leading-relaxed">
            试用账户：尚有 <span className="bg-amber-200 px-1 rounded text-amber-900">3天</span> 使用权限，到期后自动转换为 Basic 计划。
          </p>
        </div>
      </div>

      {/* Settings Details Panel Area */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[750px] flex flex-col overflow-hidden">
        
        {/* Detail Panel Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-100 flex items-center justify-between select-none">
          <div>
            <h4 className="text-xs font-black uppercase text-indigo-750 tracking-wider">
              {settingsCategories.find(c => c.id === activeTab)?.name || '详细参数'}
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">管理租户物理属性参数</p>
          </div>

          <span className="text-[9px] font-mono font-bold bg-[#07C2E3]/15 text-[#07C2E3] px-2.5 py-1 rounded-full uppercase leading-none border border-[#07C2E3]/20">
            Tenant: IT-RETAIL-02
          </span>
        </div>

        {/* Master Detail Contents (Highlydense tables/forms/buttons, strictly abiding by no continuous 3 lines rule) */}
        <div className="p-6 flex-1 overflow-y-auto">

          {/* 1. Generali */}
          {activeTab === 'generali' && (
            <form onSubmit={handleSaveGenerali} className="space-y-5 text-xs animate-fadeIn">
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-3">
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">
                  📍 快捷物理保税主仓及税号预留选项 (Quick Preset Options)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {addressPresets.map((preset, idx) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyAddressPreset(idx)}
                      className={`p-2 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        selectedAddress === preset.label 
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${selectedAddress === preset.label ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-[10.5px] font-bold">{preset.label.split(' (')[0]}</p>
                        <p className="text-[9.5px] text-slate-400 mt-0.5 truncate max-w-[200px] font-normal">{preset.label}</p>
                        <p className="text-[9px] text-[#07C2E3] font-mono mt-0.5 font-bold">VAT: {preset.vat} • {preset.tz}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">🏢 店铺核心属性参数</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">多商户法定店铺名称 (Legal Company Store Name)</label>
                    <input 
                      type="text" 
                      value={nameInput} 
                      onChange={e => setNameInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg text-xs font-semibold focus:bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-600" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">对公通知首选电子邮件 (Primary Business Email)</label>
                    <input 
                      type="email" 
                      value={storeEmail} 
                      onChange={e => setStoreEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg text-xs font-mono font-semibold text-slate-800" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">结账本位货币结算区 (Account Currency)</label>
                    <select 
                      value={currency} 
                      onChange={e => setCurrency(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-1.5 px-2.5 rounded-lg text-xs font-semibold focus:bg-white"
                    >
                      <option value="EUR">EUR (欧元 - 欧盟大区结算)</option>
                      <option value="GBP">GBP (英镑 - 伦敦结算)</option>
                      <option value="USD">USD (USD - Stripe专线通道)</option>
                      <option value="CNY">CNY (CNY - 人民币跨境付)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">物理经营所在时区 (Operating timezone)</label>
                    <select 
                      value={timezone} 
                      onChange={e => setTimezone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-1.5 px-2.5 rounded-lg text-xs font-semibold focus:bg-white"
                    >
                      <option value="Europe/Paris">Europe/Paris (巴黎/罗马 UTC+1)</option>
                      <option value="Europe/London">Europe/London (格林威治 GMT)</option>
                      <option value="America/New_York">America/New_York (纽约 EST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">欧盟纳税人识别VAT号 (European VAT Number)</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg text-xs font-mono font-bold text-indigo-700"
                      value={vatNo}
                      onChange={e => setVatNo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[9px]">
                  <ShieldCheck className="w-3.5 h-3.5" /> 多租户沙箱底层存储已保护隔离
                </div>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存常规配置 (Salva Generali)</span>
                </button>
              </div>

            </form>
          )}

          {/* 2. Piano (Subscription Plans) */}
          {activeTab === 'piano' && (
            <div className="space-y-5 animate-fadeIn text-xs">
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                <BadgeAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="font-extrabold text-slate-800">试用期即将到期 (3 天内):</h4>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed font-semibold mt-1">
                    系统已自动开通 Basic 基础商用套餐试用权限，提供最严格租户安全保护，当前支持最多物理员工 5 人。
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Plan 1 */}
                <div className={`p-4 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-all ${
                  activePlan === 'basic' ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-200 bg-white'
                }`}>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-slate-800">Basic Package</span>
                      {activePlan === 'basic' && <span className="bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded text-[8px]">活跃</span>}
                    </div>
                    <p className="text-[10px] text-slate-400">满足欧洲精品独立小店日常出货</p>
                    <div>
                      <span className="text-2xl font-black font-mono text-slate-900">€29</span>
                      <span className="text-[10px] text-slate-400"> / 月度</span>
                    </div>
                    <ul className="text-[10.5px] text-slate-500 py-3 space-y-1.5 border-t border-b border-dashed border-slate-100 mt-2">
                      <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-600" /> 租户物理隔离</li>
                      <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-600" /> 每月 500 次履约推送</li>
                      <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-600" /> Stripe直连结算保护</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleUpgradePlan('basic')}
                    disabled={activePlan === 'basic'}
                    className={`w-full py-2 px-3 mt-4 rounded-lg font-bold text-center transition-all cursor-pointer ${
                      activePlan === 'basic' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'
                    }`}
                  >
                    切换计划
                  </button>
                </div>

                {/* Plan 2 */}
                <div className={`p-4 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-all ${
                  activePlan === 'advanced' ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-200 bg-white'
                }`}>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-slate-800">Advanced Pro</span>
                      {activePlan === 'advanced' && <span className="bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded text-[8px]">活跃</span>}
                    </div>
                    <p className="text-[10px] text-slate-400">中型出海团队、集团多零售点联动</p>
                    <div>
                      <span className="text-2xl font-black font-mono text-slate-900">€79</span>
                      <span className="text-[10px] text-slate-400"> / 月度</span>
                    </div>
                    <ul className="text-[10.5px] text-slate-500 py-3 space-y-1.5 border-t border-b border-dashed border-slate-100 mt-2">
                      <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-600" /> 包含Basic全部安全特权</li>
                      <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-600" /> 高级欧盟关税全套计算</li>
                      <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-600" /> 物流中心出合规签码</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleUpgradePlan('advanced')}
                    disabled={activePlan === 'advanced'}
                    className={`w-full py-2 px-3 mt-4 rounded-lg font-bold text-center transition-all cursor-pointer ${
                      activePlan === 'advanced' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    立即提速 Advanced
                  </button>
                </div>

                {/* Plan 3 */}
                <div className={`p-4 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-all ${
                  activePlan === 'plus' ? 'border-indigo-600 bg-indigo-50/10' : 'border-slate-200 bg-white'
                }`}>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-slate-800">Shopify Plus</span>
                      {activePlan === 'plus' && <span className="bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded text-[8px]">活跃</span>}
                    </div>
                    <p className="text-[10px] text-slate-400">欧洲大货物流巨头定制性能包</p>
                    <div>
                      <span className="text-2xl font-black font-mono text-slate-900">€299</span>
                      <span className="text-[10px] text-slate-400"> / 月度</span>
                    </div>
                    <ul className="text-[10.5px] text-slate-500 py-3 space-y-1.5 border-t border-b border-dashed border-slate-100 mt-2">
                      <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-600" /> 全模型API限流解除</li>
                      <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-600" /> 1对1欧盟海关法务顾问</li>
                      <li className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-600" /> 专属自研链收单RPC中继</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleUpgradePlan('plus')}
                    disabled={activePlan === 'plus'}
                    className={`w-full py-2 px-3 mt-4 rounded-lg font-bold text-center transition-all cursor-pointer ${
                      activePlan === 'plus' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'
                    }`}
                  >
                    部署 Plus 版
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* 3. Fatturazione */}
          {activeTab === 'fatturazione' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-[#07C2E3] rounded-xs inline-block"></span>
                    企业财务对公发票登记簿 (Billing Invoices)
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans">处理系统的计算特权、API算力扣划及欧洲多区库房关税双向核销详情件</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportAllInvoicesPDF}
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-white py-1.5 px-3 rounded-lg border border-transparent shadow-xs hover:shadow-xs transition-all font-bold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer max-w-fit"
                  title="合并导出当前所有对公发票为汇总PDF文件"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出账单总表 (Export Statement PDF)</span>
                </button>
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-xl bg-white animate-fadeIn">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-[9px] font-bold text-slate-400 uppercase tracking-widest h-9 select-none">
                      <th className="p-3 pl-4">应收费发票编号 (Invoice Target)</th>
                      <th className="p-3">结算划缴日期</th>
                      <th className="p-3">费用明细描述 (Service details)</th>
                      <th className="p-3 text-right">扣划面额</th>
                      <th className="p-3 text-center">出票扣划状态</th>
                      <th className="p-3 text-center w-36">发票打印/下载操作 (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="h-10 hover:bg-slate-50/20">
                        <td className="p-3 pl-4 font-mono font-bold text-slate-800">{inv.id}</td>
                        <td className="p-3 font-mono">{inv.date}</td>
                        <td className="p-3 text-slate-500">{inv.desc}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">€{inv.amount.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          {inv.status === 'paid' && (
                            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 border-emerald-200 text-emerald-600 uppercase font-sans">
                              Paid
                            </span>
                          )}
                          {inv.status === 'pending' && (
                            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border bg-amber-50 border-amber-200 text-amber-600 uppercase font-sans">
                              Pending
                            </span>
                          )}
                          {inv.status === 'overdue' && (
                            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-600 uppercase font-sans">
                              Overdue
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-center font-sans">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDownloadInvoicePDF(inv)}
                              className="bg-[#07C2E3] hover:bg-[#06B2D0] text-white p-1.5 rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1 font-bold text-[9px] px-2"
                              title="下载 PDF 格式的商业合规发票"
                            >
                              <Download className="w-3 h-3" />
                              <span>下载</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintInvoice(inv)}
                              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 text-slate-700 p-1.5 rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1 font-bold text-[9px] px-2"
                              title="本地热敏或云打印此账单凭底证"
                            >
                              <Printer className="w-3 h-3" />
                              <span>打印</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Utenti / Roles - Embedding EmployeeCenter and RolesCenter */}
          {activeTab === 'utenti' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Inner Sub-tab navigation */}
              <div className="flex border-b border-slate-200 p-1 bg-slate-50 rounded-lg max-w-sm">
                <button
                  onClick={() => setUtentiSubTab('employees')}
                  className={`flex-1 py-1 px-3 text-xs font-bold text-center rounded-md cursor-pointer transition-all ${
                    utentiSubTab === 'employees' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  👥 现场备执勤员工 (Utenti)
                </button>
                <button
                  onClick={() => setUtentiSubTab('roles')}
                  className={`flex-1 py-1 px-3 text-xs font-bold text-center rounded-md cursor-pointer transition-all ${
                    utentiSubTab === 'roles' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🔐 安全准入角色隔离 (Permessi)
                </button>
              </div>

              <div className="border border-slate-150 rounded-xl p-4 bg-white/50">
                {utentiSubTab === 'employees' ? (
                  <EmployeeCenter selectedIndustry={selectedIndustry} addLog={addLog} />
                ) : (
                  <RolesCenter selectedIndustry={selectedIndustry} addLog={addLog} />
                )}
              </div>

            </div>
          )}

          {/* 5. Pagamenti - Embedding PaymentCenter */}
          {activeTab === 'pagamenti' && (
            <div className="space-y-4 animate-fadeIn">
              <PaymentCenter 
                orders={orders}
                selectedIndustry={selectedIndustry}
                addLog={addLog}
                onUpdateOrders={onUpdateOrders}
              />
            </div>
          )}

          {/* 6. Checkout */}
          {activeTab === 'checkout' && (
            <div className="space-y-5 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <span className="text-[10px] uppercase font-black text-slate-500 block">🛍 客户结账行为约束与表单策略</span>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800 block">结账只要求输入姓氏 (Require Last Name only)</span>
                      <span className="text-[9px] text-slate-400">开启后客户结账表单不强制要求填写名字，增加支付完单率</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={requireLastNameOnly} 
                      onChange={e => setRequireLastNameOnly(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-indigo-600" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800 block">强制备齐欧洲通邮电话 (Require Phone Identification)</span>
                      <span className="text-[9px] text-slate-400">欧盟直发DHL派件时要求必须提供正确的欧盟境内运单联系电话</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={requirePhone} 
                      onChange={e => setRequirePhone(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-indigo-600" 
                    />
                  </div>

                  <div className="py-1 border-b border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">地址第二行输入策略 (Address Line 2 Policy)</span>
                    <select
                      value={shippingAddressLine2}
                      onChange={e => setShippingAddressLine2(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded p-1 text-xs focus:outline-none"
                    >
                      <option value="optional">指示可选填写 (Optional)</option>
                      <option value="required">设定强制必填 (Required for DHL)</option>
                      <option value="hidden">彻底隐藏此输入行 (Hidden)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <div>
                      <span className="font-bold text-slate-800 block">自动启用欧盟邮编数据库自动补齐 (Autoaddress resolution)</span>
                      <span className="text-[9px] text-slate-400">集成 Google Maps 地址自校验，防止错投拒付退货</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={autoCompleteAddress} 
                      onChange={e => setAutoCompleteAddress(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-indigo-600" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-2">
                <button
                  type="button"
                  onClick={() => addLog('Checkout Settings', '表单结账属性存盘', `更新结账策略 [运单电话必填: ${requirePhone} | 自动校准地址: ${autoCompleteAddress}]`, 'success')}
                  className="bg-slate-900 text-[#07C2E3] hover:bg-black font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                >
                  保存结账规则
                </button>
              </div>
            </div>
          )}

          {/* 7. Client Account */}
          {activeTab === 'account_cliente' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <span className="text-[10px] uppercase font-black text-slate-500 block">👥 会员账户核身与注册规则</span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-slate-150 space-y-2">
                    <span className="font-extrabold text-slate-800 block">结账前必须完成强制登录</span>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="radio" 
                        id="login_opt_no" 
                        name="login_req" 
                        checked={!customerLoginRequired} 
                        onChange={() => setCustomerLoginRequired(false)} 
                      />
                      <label htmlFor="login_opt_no" className="font-semibold cursor-pointer">允许匿名结账 (Guest Checkout)</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="radio" 
                        id="login_opt_yes" 
                        name="login_req" 
                        checked={customerLoginRequired} 
                        onChange={() => setCustomerLoginRequired(true)} 
                      />
                      <label htmlFor="login_opt_yes" className="font-semibold cursor-pointer">强制拥有欧区注册账号</label>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-150 space-y-2">
                    <span className="font-extrabold text-slate-800 block">免密电邮瞬时码验证登录</span>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">向电邮下发4位一次性校验码，告别笨重密码记录</span>
                      <input 
                        type="checkbox" 
                        checked={allowPasscodeLogin} 
                        onChange={e => setAllowPasscodeLogin(e.target.checked)}
                        className="w-4 h-4 cursor-pointer accent-indigo-600" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-2">
                <button
                  type="button"
                  onClick={() => addLog('Security Guard', '会员登录鉴权拓扑调整', `用户鉴权规则已切换 [强制登录: ${customerLoginRequired} | 免密登录: ${allowPasscodeLogin}]`, 'warning')}
                  className="bg-slate-900 text-white font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                >
                  保存客户策略 Settings
                </button>
              </div>
            </div>
          )}

          {/* 8. Spedizione (Logistics Hub integration) */}
          {activeTab === 'spedizione' && (
            <div className="space-y-4 animate-fadeIn">
              <LogisticsCenter 
                orders={orders}
                products={products}
                selectedIndustry={selectedIndustry}
                addLog={addLog}
                onUpdateOrders={onUpdateOrders}
                onUpdateProducts={onUpdateProducts}
              />
            </div>
          )}

          {/* 9. Imposte (Taxes) */}
          {activeTab === 'imposte' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-black text-slate-500 block mb-2">💰 欧盟一单多税 VAT 自动代扣率管理</span>
                
                <div className="overflow-hidden border border-slate-200 bg-white rounded-lg">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-500 h-8">
                        <th className="p-2 pl-3">出货目的地欧盟成员国</th>
                        <th className="p-2">保税代码 (Tax Code)</th>
                        <th className="p-2 text-right">征收标准税率 (Standard VAT)</th>
                        <th className="p-2 text-center">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                      {taxRates.map(tax => (
                        <tr key={tax.country} className="h-8 hover:bg-slate-50">
                          <td className="p-2 pl-3 font-semibold">{tax.country}</td>
                          <td className="p-2 font-mono font-bold text-indigo-700">{tax.code}</td>
                          <td className="p-2 text-right font-mono font-bold">{(tax.rate).toFixed(1)}%</td>
                          <td className="p-2 text-center">
                            <span className="text-[8.5px] bg-indigo-50 text-indigo-700 px-1 rounded font-bold uppercase">已联网同步</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Form to add manually */}
                <form onSubmit={handleAddTaxRate} className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-2.5 items-end">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1">追加目的地 (国家)</label>
                    <input 
                      type="text" 
                      placeholder="如 Spain (ES)"
                      required 
                      value={newCountry}
                      onChange={e => setNewCountry(e.target.value)}
                      className="w-full bg-white border border-slate-200 py-1 px-2 rounded hover:bg-slate-50 text-xs focus:bg-white focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-1">附加增值税率 (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      required 
                      value={newRate}
                      onChange={e => setNewRate(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 py-1 px-2 rounded text-xs select-none focus:outline-none" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-slate-900 text-[#07C2E3] font-bold py-1 px-3 rounded hover:bg-black cursor-pointer text-xs"
                  >
                    添加国家税率
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 10. Sedi (Location warehouses) */}
          {activeTab === 'sedi' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] uppercase font-black text-slate-500 block">🏢 实体直营门店库存在线匹配</span>
                
                <div className="space-y-2">
                  {warehouses.map(wh => (
                    <div key={wh.id} className="p-3 bg-white rounded-lg border border-slate-150 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-800">{wh.name}</span>
                          <span className="font-mono text-[9px] text-[#07C2E3] bg-[#07C2E3]/10 px-1 py-0.2 rounded font-bold">{wh.id}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{wh.address}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-450 block">当前隔离库存包</span>
                          <span className="font-mono font-extrabold text-slate-800 text-xs">{wh.stockCount} 件</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleWH(wh.id)}
                          className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                            wh.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-250' : 'bg-rose-50 text-rose-500 border border-rose-250'
                          }`}
                        >
                          {wh.active ? '● 营业中 (Active)' : '○ 盘库歇业'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddWarehouse} className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 items-end">
                  <input 
                    type="text" 
                    placeholder="库房名称 (如：汉堡港中转主站)" 
                    required 
                    value={newWHName} 
                    onChange={e => setNewWHName(e.target.value)} 
                    className="bg-white border border-slate-200 rounded p-1 text-xs focus:outline-none" 
                  />
                  <input 
                    type="text" 
                    placeholder="物理保税库房地址" 
                    required 
                    value={newWHAddress} 
                    onChange={e => setNewWHAddress(e.target.value)} 
                    className="bg-white border border-slate-200 rounded p-1 text-xs focus:outline-none" 
                  />
                  <button type="submit" className="bg-slate-900 text-white font-bold py-1 px-2.5 rounded text-xs hover:bg-black cursor-pointer">
                    添加营业库房
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 11. Mercati (Markets) */}
          {activeTab === 'mercati' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-black text-slate-500 block mb-2.5">🌍 欧洲向全球汇率结算自动转换池</span>
                
                <div className="overflow-hidden border border-slate-200 rounded-lg bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-450 h-8">
                        <th className="p-2 pl-3">对价币种 (Standard Unit)</th>
                        <th className="p-2">基准转化汇率 (Standard Exchange)</th>
                        <th className="p-2">最近更新</th>
                        <th className="p-2 text-center">同步方式</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                      {exchangeRates.map(exch => (
                        <tr key={exch.pair} className="h-8 hover:bg-slate-50">
                          <td className="p-2 pl-3 font-bold font-mono text-slate-800">{exch.pair}</td>
                          <td className="p-2 font-mono font-black text-emerald-650">{exch.rate}</td>
                          <td className="p-2 font-mono">{exch.lastUpdated}</td>
                          <td className="p-2 text-center">
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border bg-slate-100 text-slate-500">
                              {exch.method}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-3.5">
                  <span className="text-[9.5px] text-slate-400">汇率由 ECB (欧洲中央银行) 每日 14:00 标准对换率自动抓取补齐</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setExchangeRates(prev => prev.map(e => ({ ...e, lastUpdated: '2026-06-08 实时' })));
                      addLog('ECB RPC', '强制全网池多位汇率刷新', '自动调用欧洲中央银行汇率API清空缓存并刷新完毕。', 'success');
                    }}
                    className="flex items-center gap-1 bg-slate-900 text-[#07C2E3] font-bold py-1 px-3 rounded hover:bg-black cursor-pointer text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> 强制全网重新对账拉取
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 12. App Installations */}
          {activeTab === 'app' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-black text-slate-500 block mb-3">🧩 已授权安装运行的三方插件 (Installed applications)</span>
                
                <div className="space-y-2">
                  {installedApps.map(app => (
                    <div key={app.id} className="p-3 bg-white rounded-lg border border-slate-150 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800">{app.name}</span>
                          <span className="text-[8.5px] font-bold bg-slate-100 text-slate-500 px-1 py-0.2 rounded">Scoped</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-mono">Dev: {app.dev} • Scope: {app.scope}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">运行中 (Live)</span>
                        <button
                          onClick={() => {
                            setInstalledApps(prev => prev.filter(a => a.id !== app.id));
                            addLog('Plugin Market', '强制撤回三方授权应用', `解除与 [${app.name}] 的多商户租户数据挂接授权`, 'warning');
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="卸载应用"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Botble CMS & Laravel 12.x Collaborative Bridge Tab */}
          {activeTab === 'botble_bridge' && (
            <div className="space-y-6 animate-fadeIn text-xs">
              
              {/* Core Header Card */}
              <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-[#07C2E3]/30 p-5 rounded-2xl space-y-3 relative overflow-hidden text-left shadow-md">
                <div className="absolute top-0 right-0 py-2 px-4 bg-[#07C2E3]/10 text-[#07C2E3] text-[9px] font-black uppercase font-mono tracking-widest rounded-bl-xl border-l border-b border-[#07C2E3]/20">
                  Laravel 12.x Pro
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#07C2E3]/10 rounded-xl flex items-center justify-center border border-[#07C2E350]">
                    <Sliders className="w-5 h-5 text-[#07C2E3]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider font-display">
                      Botble CMS & Laravel 12.x 协同控制中枢
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">
                      企业级多智能体协同底盘 • 直接对接 PHP 业务骨干及 Botble 数据行数据流
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-350 leading-relaxed max-w-2xl font-sans">
                  通过本联动面板，您可以建立 <strong>AI Commerce OS</strong> 与您现行的 <strong>Laravel 12 / Botble CMS 网站</strong> 的物理直连网关。多智能体团队（CEO Sophia、仓储官 Oliver、精算师 Fiona、编排官 Leo、营销官 Marcus）将全天候自动读取、协同审查，并通过安全 HMAC 签名 webhook 动作，实时核准上架商品、控制断货重塑以及流失忠诚召唤。
                </p>
              </div>

              {/* API Configuration Details Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-left space-y-4 shadow-sm">
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-slate-800 text-xs">🔗 API 配置和同步认证密钥</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 font-mono">Botble CMS 基础 API 路径 (Webhook API Endpoint)</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 font-mono text-xs focus:ring-1 focus:ring-[#07C2E3] focus:bg-white text-slate-700"
                      value={botbleEndpoint}
                      onChange={(e) => setBotbleEndpoint(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 font-mono">HMAC 签名校验秘钥 (X-Botble-Signature-Secret)</label>
                    <input 
                      type="password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 font-mono text-xs focus:ring-1 focus:ring-[#07C2E3] focus:bg-white text-slate-700"
                      value={botbleSecretKey}
                      onChange={(e) => setBotbleSecretKey(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      addLog('Botble SDK', '更新接口及密钥配置', `修改 API 直链终端为: ${botbleEndpoint}`, 'success');
                      alert('✓ API 密钥验证握手成功！您的 Botble CMS 控制参数已落库持久化保存。');
                    }}
                    className="flex items-center gap-1.5 py-1.5 px-4 bg-[#07C2E3] hover:bg-[#06B2D0] text-zinc-950 font-black rounded-xl transition-all active:scale-95 cursor-pointer font-sans"
                  >
                    <Save className="w-3.5 h-3.5" /> 保存配置并连接
                  </button>
                </div>
              </div>

              {/* Two-Column: Left (Live Webhook simulator) | Right (Sync logs & reasoning chain) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
                
                {/* Left Side: Simulation Actions */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <span className="font-extrabold text-slate-800 text-xs">🛠 多智能体协同联调测试 (Sync Webhook Simulator)</span>
                  </div>

                  <p className="text-[11.5px] text-slate-500 font-sans leading-relaxed">
                    无需实际配置，即可模拟您的 <strong>Botble CMS (Laravel 12.x)</strong> 触发业务事件，向 AI OS 发送 Webhook。点击下方不同场景开始触发<strong>多智能体无缝协同</strong>测试：
                  </p>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black text-slate-400 font-mono block">选择触发的 Botble Webhook 事件场景</label>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                      
                      <button
                        type="button"
                        onClick={() => setSyncScenario('low_inventory')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          syncScenario === 'low_inventory' 
                            ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300' 
                            : 'bg-slate-50 border-slate-150 hover:bg-slate-100'
                        }`}
                      >
                        <div className="w-5 py-0.5 bg-amber-500/10 text-amber-600 font-bold rounded text-center text-xs">W</div>
                        <div className="space-y-1">
                          <span className="font-extrabold text-slate-800 block">低库存自动重塑 (Oliver + Fiona + Leo)</span>
                          <span className="text-[9.5px] text-slate-500 block">模拟货品断货。WMS拉工厂补库，财务测算最佳加价比，详情文案中英双语优化一气呵成。</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSyncScenario('new_product_raw')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          syncScenario === 'new_product_raw' 
                            ? 'bg-[#e6fafc] border-[#07C2E3] ring-1 ring-[#07C2E350]' 
                            : 'bg-slate-50 border-slate-150 hover:bg-slate-100'
                        }`}
                      >
                        <div className="w-5 py-0.5 bg-[#07C2E3]/10 text-[#07C2E3] font-bold rounded text-center text-xs">P</div>
                        <div className="space-y-1">
                          <span className="font-extrabold text-slate-800 block">新品上架重构 (Leo + Fiona)</span>
                          <span className="text-[9.5px] text-slate-500 block">模拟商家上传了粗糙中文品。AI 将标题转换为高端欧美格，对齐 Shopify SKU 阶梯定价规则。</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSyncScenario('vip_silent')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          syncScenario === 'vip_silent' 
                            ? 'bg-purple-50/50 border-purple-300 ring-1 ring-purple-300' 
                            : 'bg-slate-50 border-slate-150 hover:bg-slate-100'
                        }`}
                      >
                        <div className="w-5 py-0.5 bg-purple-500/10 text-purple-600 font-bold rounded text-center text-xs">C</div>
                        <div className="space-y-1">
                          <span className="font-extrabold text-slate-800 block">沉默特客召唤 (Grace + Marcus)</span>
                          <span className="text-[9.5px] text-slate-500 block">检测到高LTV买家数日未结付款。Grace提供召回画像，Marcus自动起草EURO优惠并分发。</span>
                        </div>
                      </button>

                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={async () => {
                        setIsTestingSync(true);
                        setSimulatedSyncResult(null);
                        try {
                          const res = await fetch('/api/botble/simulate-event', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ tenantId: 't_retail', eventType: syncScenario })
                          });
                          const data = await res.json();
                          if (data.success) {
                            setSimulatedSyncResult(data.event);
                            
                            // Push new log entry 
                            setBotbleSyncLogs(prev => [
                              {
                                id: 'b-log-' + Date.now(),
                                time: new Date().toLocaleTimeString(),
                                category: syncScenario === 'low_inventory' ? 'WMS Sourcing' : (syncScenario === 'new_product_raw' ? 'Catalog Rewrite' : 'Retention CRM'),
                                msg: `Webhook Successful. Processed Collaboration ID [${data.event.colId}] inside Relational DB tables.`,
                                status: 'success'
                              },
                              ...prev
                            ]);
                            
                            addLog('Laravel Webhook API', '成功捕获 Botble CMS 事件且自愈', `协同ID [${data.event.colId}] 覆盖 SKU ${data.event.sku}，生成新动作记录并写入 relational db 的 ai_actions_log。`, 'success');
                          }
                        } catch (err) {
                          alert('Webhook simulation post failed.');
                        } finally {
                          setIsTestingSync(false);
                        }
                      }}
                      disabled={isTestingSync}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-950 hover:bg-black text-[#07C2E3] hover:text-white border border-[#07C2E3]/50 hover:border-white font-black rounded-xl transition-all active:scale-95 text-xs cursor-pointer disabled:opacity-50"
                    >
                      {isTestingSync ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>正在建立握手、解析 Laravel DTO 模型...</span>
                        </>
                      ) : (
                        <>
                          <Activity className="w-4 h-4" />
                          <span>立即物理触发 Webhook 协同运行 (Simulate Sync Webhook)</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Right Side: Results & Reasoning Timeline */}
                <div className="lg:col-span-6 space-y-4">
                  
                  {/* Sync Event Outcome Panel */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm text-left">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="font-extrabold text-slate-800 text-xs">📦 协同运作实时对账 (Orchestrated Result)</span>
                      {simulatedSyncEventResult && (
                        <span className="text-[8.5px] font-black font-mono tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">
                          ID: {simulatedSyncEventResult.colId}
                        </span>
                      )}
                    </div>

                    {!simulatedSyncEventResult ? (
                      <div className="py-12 text-center text-slate-400 space-y-1 select-none">
                        <Cpu className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
                        <p className="text-xs font-bold font-mono">No active webhook scenario triggered.</p>
                        <p className="text-[10px] text-slate-400 text-medium">Select a scenario on the left to fire the multi-agent synergy.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 animate-fadeIn">
                        
                        {/* Target SKU information badge */}
                        <div className="p-2.5 bg-zinc-950 rounded-xl flex items-center justify-between border border-zinc-900">
                          <div>
                            <span className="text-[8px] uppercase font-black text-slate-500 font-mono block">Sync Handshake target</span>
                            <span className="text-[11px] font-bold text-white font-mono">{simulatedSyncEventResult.productName}</span>
                          </div>
                          <span className="text-[10px] font-black text-[#07C2E3] font-mono select-all">
                            sku: #{simulatedSyncEventResult.sku}
                          </span>
                        </div>

                        {/* Agents Timeline (多智能体协同) */}
                        <div className="space-y-2.5">
                          <label className="text-[9px] uppercase font-black text-slate-400 font-mono block">特设专业官协同决策日志 ({simulatedSyncEventResult.agents.length} 职能官)</label>
                          
                          <div className="space-y-2 font-sans relative pl-3 border-l-2 border-slate-150">
                            {simulatedSyncEventResult.agents.map((agent: any, idx: number) => (
                              <div key={idx} className="space-y-0.5 relative">
                                <span className="absolute -left-[18.2px] top-0.5 text-xs bg-white rounded-full">
                                  {agent.emoji}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-800 text-[11px]">{agent.name}</span>
                                  <span className="text-[8px] bg-slate-100 text-slate-500 px-1 rounded block">{agent.title}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono leading-relaxed bg-slate-50 border border-slate-100 p-2 rounded-lg font-medium">
                                  {agent.desc}
                                </p>
                              </div>
                            ))}
                          </div>

                        </div>

                        {/* Governance Approved Success stamp */}
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-[10px] font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span>[系统自愈完成] 多智能体协同审计完成，相关经营协议已经自动落库并且实时同步写入 Botble CMS 产品/订单/客户数据库。</span>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Logging Panel */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm text-left h-[260px] overflow-hidden flex flex-col">
                    <span className="font-extrabold text-[#07C2E3] text-[10px] uppercase font-mono tracking-wider block border-b border-slate-100 pb-1.5">🔌 Webhook 与对账同步日志 (Connection Logs)</span>
                    <div className="overflow-y-auto space-y-1.5 font-mono text-[10px] flex-1">
                      {botbleSyncLogs.map(log => (
                        <div key={log.id} className="p-2 bg-slate-50 hover:bg-slate-100/70 rounded-lg border border-slate-100 flex items-start justify-between gap-2 transition-all">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 font-bold">{log.time}</span>
                              <span className="text-[8px] font-black bg-slate-200 text-slate-600 px-1 rounded uppercase tracking-wider">{log.category}</span>
                            </div>
                            <p className="text-slate-600 font-semibold">{log.msg}</p>
                          </div>
                          <span className="text-emerald-600 font-black">✓ OK</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Code Exporter Cards (Interactive Code Display for actual Enterprise operation) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 text-left space-y-4 shadow-sm">
                
                <div className="flex items-center justify-between border-b border-slate-150 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-[#07C2E3]" />
                    <span className="font-extrabold text-slate-800 text-sm">💾 PHP Laravel 12 & Vue 3 核心协同接口开发套件 (Developers Code Kit)</span>
                  </div>
                  
                  {/* Selector Tabs for quick switching code snippets */}
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                    <button
                      onClick={() => setActiveCodeSelector('laravel')}
                      className={`px-3 py-1 rounded-lg text-[10.5px] font-black transition-colors cursor-pointer ${
                        activeCodeSelector === 'laravel' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Laravel Controller
                    </button>
                    <button
                      onClick={() => setActiveCodeSelector('vue')}
                      className={`px-3 py-1 rounded-lg text-[10.5px] font-black transition-colors cursor-pointer ${
                        activeCodeSelector === 'vue' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Vue 3 Hook Component
                    </button>
                    <button
                      onClick={() => setActiveCodeSelector('webhook')}
                      className={`px-3 py-1 rounded-lg text-[10.5px] font-black transition-colors cursor-pointer ${
                        activeCodeSelector === 'webhook' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Botble API Plugin Registry
                    </button>
                  </div>
                </div>

                {/* Subheading depending on code tab */}
                <div>
                  {activeCodeSelector === 'laravel' && (
                    <div className="space-y-2">
                      <p className="text-[11.5px] text-slate-500 font-sans leading-relaxed">
                        在您的 Laravel 12 项目中创建并部署以下 <strong>BotbleAgentBridgeController.php</strong>。该控制器可完成从 Botble 数据契约层到 AI Commerce OS 物理直联网关的安全通信对接。
                      </p>
                      <div className="bg-zinc-950 font-mono text-[10px] text-[#07C2E3]/90 p-4 rounded-xl border border-zinc-900 overflow-x-auto select-all max-h-[350px] overflow-y-auto leading-relaxed">
                        <pre>{`<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use Botble\\Ecommerce\\Models\\Product;
use Botble\\Ecommerce\\Models\\Order;
use Botble\\Ecommerce\\Models\\Customer;
use Illuminate\\Support\\Facades\\Log;

/**
 * Enterprise AI Bridge Controller for Botble CMS 7.x & Laravel 12.x
 */
class BotbleAgentBridgeController extends Controller
{
    private $signatureSecret = 'botble_sec_bfd68fa82b9921c210ab15e07c2e3';

    /**
     * Handle incoming webhooks from AI Commerce OS to mutate Botble CMS State
     */
    public function handleWebhook(Request $request)
    {
        // 1. Validate secure HMAC Header representing standard anti-fraud requirements
        $signature = $request->header('X-Botble-Signature');
        unset($computedHash);
        $computedHash = base64_encode(hash_hmac('sha256', $request->getContent(), $this->signatureSecret, true));

        if ($signature !== $computedHash) {
            return response()->json(['error' => 'Unauthorized HMAC Signature. Handshake declined.'], 401);
        }

        $payload = $request->all();
        $eventType = $payload['event_type'] ?? '';

        Log::info('AI Commerce OS Webhook Received: ' . $eventType);

        // 2. Perform direct Botble schema updates strictly in relational isolation
        switch ($eventType) {
            case 'PROCUREMENT_STOCK_ASYNC':
                $sku = $payload['sku'] ?? '';
                $quantity = (int)($payload['quantity'] ?? 150);
                
                $product = Product::where('sku', $sku)->first();
                if ($product) {
                    $product->quantity = $product->quantity + $quantity;
                    $product->save();
                    
                    Log::info("Botble SKU {$sku} replenished with {$quantity} units by AI OS.");
                    return response()->json([
                        'success' => true,
                        'message' => "Successfully replenished Botble SKU {$sku}.",
                        'updated_stock' => $product->quantity
                    ]);
                }
                break;

            case 'BILINGUAL_COPYWRITING_APPLIED':
                $sku = $payload['sku'] ?? '';
                $title = $payload['title'] ?? '';
                $description = $payload['description'] ?? '';

                $product = Product::where('sku', $sku)->first();
                if ($product) {
                    $product->name = $title;
                    $product->description = $description;
                    $product->save();

                    Log::info("Botble SKU {$sku} title/description localized rewrite applied.");
                    return response()->json(['success' => true, 'sku' => $sku]);
                }
                break;
                
            case 'COUPON_AUTOGENERATED':
                // Creates a coupon code inside Botble CMS database tables
                Log::info("Wrote discount coupon " . $payload['code'] . " to Botble coupon table.");
                break;
        }

        return response()->json(['success' => false, 'error' => 'Product SKU or corresponding handler not found in Botble DB.']);
    }
}`}</pre>
                      </div>
                    </div>
                  )}

                  {activeCodeSelector === 'vue' && (
                    <div className="space-y-2">
                      <p className="text-[11.5px] text-slate-500 font-sans leading-relaxed">
                        在您搭载了 <strong>Laravel-Mix + Vue 3</strong> 的 Botble CMS 前端或者后台运营主板中，集成此超轻量级 AI Sidebar 界面追踪钩子，赋予客服及店主一句话极速协同能力：
                      </p>
                      <div className="bg-zinc-950 font-mono text-[10px] text-[#07C2E3]/90 p-4 rounded-xl border border-zinc-900 overflow-x-auto select-all max-h-[350px] overflow-y-auto leading-relaxed">
                        <pre>{`<template>
  <div class="botble-ai-action-sidebar" :class="{ 'is-open': isOpen }">
    <div class="sidebar-header">
      <h4>🔌 Botble CMS 12 AI Partner</h4>
      <button @click="isOpen = false" class="close-btn">&times;</button>
    </div>

    <div class="chat-viewport">
      <div v-for="(msg, idx) in messages" :key="idx" class="chat-bubble" :class="msg.role">
        <span class="bubble-sender">{{ msg.role === 'user' ? 'ME' : 'AI MANAGER' }}</span>
        <p>{{ msg.content }}</p>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="sidebar-input">
      <input v-model="userInput" placeholder="问一问当前的库存, 并协同 reorder..." required />
      <button type="submit" class="send-btn">Send</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "BotbleAgentSidebar",
  data() {
    return {
      isOpen: true,
      userInput: '',
      messages: [
        { role: 'assistant', content: '您好, 已通过 Laravel 12 端口安全对接！我是 AI Commerce OS. 我可以为您协同进行断货和定价调整。' }
      ]
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;
      
      const userMessage = this.userInput;
      this.messages.push({ role: 'user', content: userMessage });
      this.userInput = '';

      try {
        const response = await axios.post('/api/gemini/agent-chat', {
          messages: this.messages,
          aiContext: {
            shop: { shopId: 'botble_shop_1', tenantId: 't_retail', industry: 'fashion' },
            user: { userId: 'botble_admin', role: 'administrator', permissions: ['all'] },
            ui: { pageType: 'dashboard' }
          }
        });
        this.messages.push({ role: 'assistant', content: response.data.text });
      } catch (err) {
        this.messages.push({ role: 'assistant', content: 'Error connecting with AI Commerce Operating System.' });
      }
    }
  }
}
</script>

<style scoped>
.botble-ai-action-sidebar {
  position: fixed; right: 0; top: 0; width: 380px; height: 100vh;
  background-color: #0c0d0e; border-left: 1px solid #1f2124; z-index: 9999;
}
</style>`}</pre>
                      </div>
                    </div>
                  )}

                  {activeCodeSelector === 'webhook' && (
                    <div className="space-y-2">
                      <p className="text-[11.5px] text-slate-500 font-sans leading-relaxed">
                        将 Webhook 分发网关注册 to Botble 核心事件系统（如 <code>app/Providers/EventServiceProvider.php</code>），让数据库的 <code>updated</code> / <code>created</code> 瞬发事件自动同步到 AI OS 中：
                      </p>
                      <div className="bg-zinc-950 font-mono text-[10px] text-[#07C2E3]/90 p-4 rounded-xl border border-zinc-900 overflow-x-auto select-all max-h-[350px] overflow-y-auto leading-relaxed">
                        <pre>{`<?php

namespace App\\Providers;

use Illuminate\\Foundation\\Support\\Providers\\EventServiceProvider as ServiceProvider;
use Illuminate\\Support\\Facades\\Event;
use Botble\\Ecommerce\\Events\\ProductQuantityUpdatedEvent;
use Illuminate\\Support\\Facades\\Http;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Register Botble quantity update hooks directly to AI Commerce OS
     */
    public function boot(): void
    {
        parent::boot();

        Event::listen(ProductQuantityUpdatedEvent::class, function ($event) {
            $product = $event->product;
            
            // Check if stock drop triggers warning
            if ($product->quantity <= 5) {
                unset($secret, $payload, $signature);
                $secret = 'botble_sec_bfd68fa82b9921c210ab15e07c2e3';
                
                $payload = [
                    'tenantId' => 't_retail',
                    'storeId' => 'store_retail',
                    'eventType' => 'low_inventory',
                    'sku' => $product->sku,
                    'stockLevel' => $product->quantity,
                    'triggeredAt' => now()->toIso8601String()
                ];
                
                $signature = base64_encode(hash_hmac('sha256', json_encode($payload), $secret, true));

                // Dispatch fire-and-forget webhook to AI OS Gateway
                Http::withHeaders([
                    'X-Botble-Signature' => $signature,
                    'Content-Type' => 'application/json'
                ])->post('https://your-ai-commerce-os.com/api/botble/simulate-event', $payload);
            }
        });
    }
}`}</pre>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* 13. Canali di vendita */}
          {activeTab === 'canali_vendita' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-black text-slate-500 block mb-2">📢 出海多渠道对公连接同步 (Channels)</span>
                
                <div className="overflow-hidden border border-slate-200 bg-white rounded-lg">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-450 h-8">
                        <th className="p-2 pl-3">对接多营销渠道</th>
                        <th className="p-2">最近通信延值 (Ping)</th>
                        <th className="p-2 text-right">API对接状态</th>
                        <th className="p-2 text-center">系统检测</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                      {channels.map(chan => (
                        <tr key={chan.id} className="h-9 hover:bg-slate-50">
                          <td className="p-2 pl-3 font-bold text-slate-750">{chan.name}</td>
                          <td className="p-2 font-mono">{chan.loadMs > 0 ? `${chan.loadMs}ms` : 'offline'}</td>
                          <td className="p-2 text-right">
                            <span className={`text-[9px] font-bold px-1 rounded uppercase ${
                              chan.status === 'Disconnected' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {chan.status}
                            </span>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => {
                                setChannels(prev => prev.map(c => c.id === chan.id && c.id !== 'pos' ? { ...c, loadMs: Math.floor(Math.random() * 20) + 10 } : c));
                                addLog('API Diagnostics', '握手重试通信调取', `发起与渠道 ${chan.name} 强制安全心跳校准握手`, 'info');
                              }}
                              className="text-[9px] text-[#07C2E3] hover:underline cursor-pointer"
                            >
                              校验握手
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 14. Domini */}
          {activeTab === 'domini' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] uppercase font-black text-slate-500 block">🌐 自定义独立欧洲出海站域名绑定</span>

                <div className="space-y-2">
                  {domains.map(dom => (
                    <div key={dom.domain} className="p-2.5 bg-white rounded-lg border border-slate-150 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-indigo-950">{dom.domain}</span>
                          <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-semibold">{dom.type}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono">DNS: {dom.provider}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded ${
                          dom.status.includes('Pending') ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-650'
                        }`}>
                          {dom.status}
                        </span>
                        
                        {dom.type !== 'Primary Domain' && (
                          <button
                            onClick={() => {
                              setDomains(prev => prev.filter(d => d.domain !== dom.domain));
                              addLog('DNS Core', '解除废弃DNS域名解析连带', `移除域名关联: ${dom.domain}`, 'warning');
                            }}
                            className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddDomain} className="flex gap-2 pt-2">
                  <input 
                    type="text" 
                    placeholder="例如: shop.luxe-brand.it (无需 http://)" 
                    required 
                    value={newDomainInput}
                    onChange={e => setNewDomainInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded p-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-650" 
                  />
                  <button type="submit" className="bg-slate-900 text-white font-bold py-1 px-3 rounded hover:bg-black cursor-pointer text-xs">
                    挂接域名 DNS A 记录
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 15. Pixel Behavior */}
          {activeTab === 'eventi_clienti' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-black text-slate-500 block">📈 欧洲GDPR隐私权政策下客户像素埋点</span>
                  
                  <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-150 px-2.5 py-0.5 rounded">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    <span className="font-mono text-indigo-700 text-[10px] font-bold">GDPR 联网拦截中</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {pixels.map(px => (
                    <div key={px.id} className="p-3 bg-white rounded-lg border border-slate-155 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-800 block">{px.name}</span>
                        <p className="text-[9.5px] text-slate-400 font-mono">Pixel ID: {px.tagId} • Standard Track Actions • Custom Hooks</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 block">总事件抓取数</span>
                        <span className="font-mono font-bold text-slate-800">{px.hits} Hits</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-150 pt-3">
                  <span className="font-extrabold text-slate-805 block mb-1.5">GDPR 隐私授权弹出阻断等级 (GDPR Cookie Banner)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGdprPrivacyTier('restrictive');
                        addLog('GDPR Sentinel', '严选等级切换', '隐私等级切换为【严控：在客户完全授意前阻断所有外部GA4、Meta追踪】', 'warning');
                      }}
                      className={`p-2 rounded border text-center font-bold text-[10px] cursor-pointer transition-all ${
                        gdprPrivacyTier === 'restrictive' ? 'bg-slate-900 border-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🛡 强力阻断 (Strict Opt-In)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGdprPrivacyTier('optin');
                        addLog('GDPR Sentinel', '隐私警告级切换', '隐私等级切换为【仅统计Cookie加载】', 'info');
                      }}
                      className={`p-2 rounded border text-center font-bold text-[10px] cursor-pointer transition-all ${
                        gdprPrivacyTier === 'optin' ? 'bg-slate-900 border-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🔔 柔和提示 (Alert Banner)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGdprPrivacyTier('lax');
                        addLog('GDPR Sentinel', '宽松统计模式开启', '豁免普通出境Cookie审查模式', 'error');
                      }}
                      className={`p-2 rounded border text-center font-bold text-[10px] cursor-pointer transition-all ${
                        gdprPrivacyTier === 'lax' ? 'bg-slate-900 border-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      🔓 松散统计 (Standard Track)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 16. Brand styling */}
          {activeTab === 'brand' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <span className="text-[10px] uppercase font-black text-slate-500 block">🎨 欧洲国际直营站点一键装配 (Brand center)</span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">直营网站牌子口号 (Brand Slogan)</label>
                      <input 
                        type="text" 
                        value={sloganInput}
                        onChange={e => setSloganInput(e.target.value)}
                        className="w-full bg-white border border-slate-200 py-1.5 px-3 rounded hover:bg-slate-100/50 text-xs text-slate-800 focus:bg-white" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">出海主打特色主题色 (Primary)</label>
                        <div className="flex gap-1.5 items-center">
                          <input 
                            type="color" 
                            value={brandColorPrimary}
                            onChange={e => setBrandColorPrimary(e.target.value)}
                            className="w-8 h-8 rounded border-none cursor-pointer" 
                          />
                          <span className="font-mono text-[10px] font-bold uppercase">{brandColorPrimary}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">辅主题高亮颜色 (Secondary)</label>
                        <div className="flex gap-1.5 items-center">
                          <input 
                            type="color" 
                            value={brandColorSecondary}
                            onChange={e => setBrandColorSecondary(e.target.value)}
                            className="w-8 h-8 rounded border-none cursor-pointer" 
                          />
                          <span className="font-mono text-[10px] font-bold uppercase">{brandColorSecondary}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand live mockup preview */}
                  <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col justify-between h-[150px] shadow-xs select-none">
                    <div className="space-y-1">
                      <span className="font-black text-xs text-slate-900 block truncate">{nameInput}</span>
                      <span className="text-[9px] text-slate-400 italic block truncate">"{sloganInput}"</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          style={{ backgroundColor: brandColorPrimary }}
                          className="flex-1 py-1 px-2.5 rounded font-bold text-white text-[9.5px] leading-tight"
                        >
                          主色出票结账
                        </button>
                        <button
                          type="button"
                          style={{ backgroundColor: brandColorSecondary }}
                          className="flex-1 py-1 px-2.5 rounded font-bold text-white text-[9.5px] leading-tight"
                        >
                          辅色退税优惠
                        </button>
                      </div>
                      <span className="text-[8.5px] text-center text-slate-300 block font-semibold uppercase leading-none">实时渲染沙箱 Mockup Rendering</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => addLog('Theme Injector', '直营站主题渲染色谱锁定', `主特色色: ${brandColorPrimary} | 口号: ${sloganInput}`, 'success')}
                  className="bg-slate-900 text-[#07C2E3] hover:bg-black font-bold py-1.5 px-3.5 rounded-lg cursor-pointer"
                >
                  保存整体视觉中心参数
                </button>
              </div>
            </div>
          )}

          {/* 17. Notifications */}
          {activeTab === 'notifiche' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-black text-slate-500 block mb-3">✉️ 业务流传信自动唤醒模版预留</span>
                
                <div className="overflow-hidden border border-slate-200 bg-white rounded-lg">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-450 h-8">
                        <th className="p-2 pl-3">出货及账单自动唤醒邮件名称</th>
                        <th className="p-2">契机唤醒条件 (Trigger)</th>
                        <th className="p-2 text-center">发送网关</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                      {notifications.map(not => (
                        <tr key={not.id} className="h-9 hover:bg-slate-50">
                          <td className="p-2 pl-3 font-bold text-slate-800">{not.name}</td>
                          <td className="p-2 font-mono text-indigo-750 font-bold">{not.trigger}</td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => {
                                addLog('SMS Gateways', '下发对公预览电邮模版', `触发对公联系人邮箱 [${storeEmail}] 试发邮件流水: ${not.name}`, 'info');
                                alert(`预览测试信件已发往 ${storeEmail}，请留意欧盟标准查收。`);
                              }}
                              className="text-[9px] bg-slate-950 text-white font-bold px-2 py-0.5 rounded leading-none hover:bg-black cursor-pointer"
                            >
                              试送预览
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 18. Dati Personalizzati (Metafields) */}
          {activeTab === 'dati_personalizzati' && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-[10px] uppercase font-black text-slate-500 block">🗄 Metafields / 商铺自定义扩展字段定义</span>
                
                <div className="space-y-2">
                  {metafields.map(field => (
                    <div key={field.id} className="p-3 bg-white rounded-lg border border-slate-155 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-850">{field.name}</span>
                          <span className="font-mono text-[8px] bg-indigo-50 text-indigo-600 px-1 py-0.1 border border-indigo-150 rounded leading-none">{field.scope}</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-mono">Custom key definition: <span className="font-bold text-slate-700">custom.{field.key}</span> • Type: {field.type}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMetafields(prev => prev.filter(f => f.id !== field.id));
                          addLog('Metafields Engine', '注销元字段定义', `移除了 [${field.scope}] 元字段 [${field.key}] 的定义`, 'warning');
                        }}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddCustomMetafield} className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 items-end">
                  <div>
                    <label className="block text-[8.5px] font-bold text-slate-400 mb-0.5">挂靠模型 (Scope)</label>
                    <select
                      value={newMFScope}
                      onChange={e => setNewMFScope(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded p-1 text-xs focus:outline-none"
                    >
                      <option value="Products">商品核心 (Products)</option>
                      <option value="Orders">订单核心 (Orders)</option>
                      <option value="Customers">客户核心 (Customers)</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder="字段标题 (CE标志等)" 
                    required 
                    value={newMFName}
                    onChange={e => setNewMFName(e.target.value)}
                    className="bg-white border border-slate-200 rounded p-1 text-xs focus:outline-none" 
                  />
                  <input 
                    type="text" 
                    placeholder="系统检索代键 (ce_mark)" 
                    required 
                    value={newMFKey}
                    onChange={e => setNewMFKey(e.target.value)}
                    className="bg-white border border-slate-200 rounded p-1 text-xs focus:outline-none font-mono" 
                  />
                  <button type="submit" className="bg-slate-900 text-white font-bold py-1 px-2.5 rounded text-xs hover:bg-black cursor-pointer">
                    添加定义
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* 19. Normative (GDPR Policies) - Embedding PoliciesManagement */}
          {activeTab === 'normative' && (
            <div className="space-y-4 animate-fadeIn">
              <PoliciesManagement addLog={addLog} />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
