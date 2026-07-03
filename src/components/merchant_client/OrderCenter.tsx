import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Truck, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  ChevronRight, 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  CornerDownLeft, 
  FileCheck,
  Send,
  Download,
  Printer,
  Maximize2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { OrderItem, ProductItem, IndustryType } from '../../types';

interface OrderCenterProps {
  orders: OrderItem[];
  products: ProductItem[];
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  onUpdateOrders: (updated: OrderItem[]) => void;
}

// Internal Enriched Order definition for high-fidelity rendering
interface EnrichedOrder extends OrderItem {
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: '待支付' | '已支付' | '支付失败' | '已取消';
  shippingStatus: '待发货' | '已发货' | '已收货' | '已完成';
  items: {
    sku: string;
    name: string;
    price: number;
    qty: number;
  }[];
  trackingNumber?: string;
  carrier?: string;
  logisticsTimeline: {
    time: string;
    status: string;
    desc: string;
  }[];
  refundReason?: string;
  refundAuditStatus?: '待审批' | '已批准' | '已拒绝';
}

export default function OrderCenter({ 
  orders, 
  products, 
  selectedIndustry, 
  addLog, 
  onUpdateOrders 
}: OrderCenterProps) {
  
  // Tab control inside Order Center
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'unshipped' | 'refunds' | 'tracking' | 'billing'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<EnrichedOrder | null>(null);

  // States for Invoices & Billing
  const [invoicedOrderIds, setInvoicedOrderIds] = useState<Record<string, boolean>>({
    'ORD-2026-001': true,
    'ORD-2026-003': true,
  });
  const [sentInvoiceIds, setSentInvoiceIds] = useState<Record<string, boolean>>({});
  const [saasInvoices, setSaasInvoices] = useState<any[]>([
    { id: 'INV-2026-904', date: '2026-06-05', desc: 'Shopify Premium SaaS Subscription Plan (Basic Package)', amount: 29.00, status: 'paid' },
    { id: 'INV-2026-812', date: '2026-05-18', desc: 'Gemini Agent Orchestration API High-Token Surcharge', amount: 98.40, status: 'pending' },
    { id: 'INV-2026-701', date: '2026-04-15', desc: 'EU-Wide Address Auto-Resolution Gateway Fee', amount: 12.00, status: 'overdue' }
  ]);
  const [billingSubTab, setBillingSubTab] = useState<'customer' | 'saas'>('customer');

  // Track active orderId in context
  React.useEffect(() => {
    const activeId = selectedOrder?.id || (orders[0]?.id || undefined);
    if (typeof window !== 'undefined' && window.AIContextTracker) {
      window.AIContextTracker.setOrderId(activeId);
    }
  }, [selectedOrder?.id, orders]);
  const [showDispatchModal, setShowDispatchModal] = useState<EnrichedOrder | null>(null);
  const [showRefundModal, setShowRefundModal] = useState<EnrichedOrder | null>(null);
  const [showRiskModal, setShowRiskModal] = useState<EnrichedOrder | null>(null);
  const [magnifiedOrder, setMagnifiedOrder] = useState<EnrichedOrder | null>(null);
  const [sortField, setSortField] = useState<'createdAt' | 'total'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Interactive checkout order generation matching real buyers
  const handleCreateAutomatedSimulatedOrder = () => {
    const randomBuyers = [
      { name: "Schmidt Logistik GmbH", contact: "billing@schmidt-logistik.de", addr: "Kaiserstraße 12, 60311 Frankfurt am Main, Germany", pay: "EuroSEPA Bank Direct Transfer" },
      { name: "Elena Rostova", contact: "elena.rostova@prague-design.cz", addr: "Vodičkova 36, 110 00 Praha 1, Czech Republic", pay: "Visa B2B Business Card" },
      { name: "Jean-Pierre Laurent", contact: "jp.laurent@paris-fashion.fr", addr: "Avenue des Champs-Élysées 42, 75008 Paris, France", pay: "PayPal Corporate Standard" },
      { name: "Sylvia van der Berg", contact: "accounting@vanderberg-textiles.nl", addr: "Keizersgracht 450, 1016 GD Amsterdam, Netherlands", pay: "MasterCard SecurePay" }
    ];

    const buyer = randomBuyers[Math.floor(Math.random() * randomBuyers.length)];
    const orderId = `ORD-2026-` + Math.floor(1000 + Math.random() * 9000);
    
    const activeProducts = products.length > 0 ? products : [
      { id: 'p1', name: '智能双轴激光数控雕刻机 v2', sku: 'SKU-CNC-L8V2', price: 1290.00, stock: 12, sales: 5, status: 'In Stock' },
      { id: 'p2', name: '高通量多层高频PCB阻抗分析板', sku: 'SKU-PCB-A880', price: 340.00, stock: 45, sales: 8, status: 'In Stock' }
    ];

    const selectedProductsCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 products
    const selectedProds: any[] = [];
    for (let i = 0; i < selectedProductsCount; i++) {
      const p = activeProducts[Math.floor(Math.random() * activeProducts.length)];
      if (!selectedProds.find(item => item.id === p.id)) {
        selectedProds.push(p);
      }
    }

    const orderItems = selectedProds.map(p => {
      const qty = Math.floor(Math.random() * 2) + 1; // 1 or 2
      return {
        productId: p.id,
        sku: p.sku,
        name: p.name,
        price: p.price,
        qty: qty,
        quantity: qty
      };
    });

    const calculatedTotal = orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const riskFactor = Math.floor(Math.random() * 15) + 3; // secure clean orders by default

    const newCreatedOrder: OrderItem = {
      id: orderId,
      customerName: buyer.name,
      contact: buyer.contact,
      total: calculatedTotal,
      status: 'AI Confirmed', // instantly paid and confirmed
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      riskScore: riskFactor,
      shippingAddress: buyer.addr,
      paymentMethod: buyer.pay,
      items: orderItems
    };

    // Append to existing list and sync to App.tsx
    const updated = [newCreatedOrder, ...orders];
    onUpdateOrders(updated);

    // Force select this new order as active for preview
    setSelectedOrder({
      ...newCreatedOrder,
      shippingAddress: buyer.addr,
      paymentMethod: buyer.pay,
      paymentStatus: '已支付',
      shippingStatus: '待发货',
      items: orderItems.map(it => ({
        sku: it.sku || 'SKU-001',
        name: it.name,
        price: it.price,
        qty: it.qty
      })),
      logisticsTimeline: [
        { time: '2026-06-09 10:14', status: '已接单', desc: 'SaaS 跨境店铺主系统自动受理客户付款指令。' }
      ]
    });

    // Also open the Magnificent/Interactive window automatically for delightful instant preview!
    setMagnifiedOrder({
      ...newCreatedOrder,
      shippingAddress: buyer.addr,
      paymentMethod: buyer.pay,
      paymentStatus: '已支付',
      shippingStatus: '待发货',
      items: orderItems.map(it => ({
        sku: it.sku || 'SKU-001',
        name: it.name,
        price: it.price,
        qty: it.qty
      })),
      logisticsTimeline: [
        { time: '2026-06-09 10:14', status: '已接单', desc: 'SaaS 跨境店铺主系统自动受理客户付款指令。' }
      ]
    });

    // Add a log to operations
    addLog(
      'AI Checkout Core',
      '在线模拟自主结算',
      `模拟跨境商城前台有一位客户 [${buyer.name}] 对商品 [${orderItems.map(it => `${it.name} x${it.qty}`).join(', ')}] 完成付款。金额: EUR €${calculatedTotal.toFixed(2)}。生成订单 AWB #${orderId}，已触发自动对账并打开了高级放大预览窗口。`,
      'success'
    );
  };

  // Hardcoded shipping details, products bought matching actual products list dynamically or fallback
  const enrichedOrders = useMemo<EnrichedOrder[]>(() => {
    return orders.map((order, idx) => {
      // Find relevant products for realistic allocation
      const matchedProd = products[idx % products.length] || (products[0] ?? { name: '企业级标品货品', sku: 'SKU-001', price: order.total });
      
      const fallbackItems = [
        {
          sku: matchedProd.sku,
          name: matchedProd.name,
          price: matchedProd.price,
          qty: Math.max(1, Math.floor(order.total / matchedProd.price)) || 1
        }
      ];

      // Address mapping
      const addresses = [
        'Room 1402, High-Tech Industrial Park, Nanshan District, Shenzhen, China',
        '350 Fifth Ave, New York, NY 10118, United States',
        '742 Evergreen Terrace, Springfield, OR 97477, United States',
        'Baker Street 221B, London, NW1 6XE, United Kingdom'
      ];
      const address = addresses[idx % addresses.length];

      // Translate database status mapping based on final status chain
      let payStatus: '待支付' | '已支付' | '支付失败' | '已取消' = '已支付';
      let shipStatus: '待发货' | '已发货' | '已收货' | '已完成' = '待发货';
      let refundAudit: '待审批' | '已批准' | '已拒绝' | undefined = undefined;

      if (order.status === 'Pending') {
        payStatus = '待支付';
        shipStatus = '待发货';
      } else if (order.status === 'AI Confirmed') {
        payStatus = '已支付';
        shipStatus = '待发货';
      } else if (order.status === 'Shipped') {
        payStatus = '已支付';
        shipStatus = '已发货';
      } else if (order.status === 'Refund Requested') {
        payStatus = '已支付';
        shipStatus = '待发货';
        refundAudit = '待审批';
      } else if (order.status === 'Refunded') {
        payStatus = '已取消';
        shipStatus = '待发货';
        refundAudit = '已批准';
      } else if (order.status === 'Completed') {
        payStatus = '已支付';
        shipStatus = '已完成';
      } else if (order.status === 'Cancelled') {
        payStatus = '已取消';
        shipStatus = '待发货';
      }

      // Default tracking data
      const carrier = (order.status === 'Shipped' || order.status === 'Completed') ? 'DHL Express' : undefined;
      const tracking = (order.status === 'Shipped' || order.status === 'Completed') ? `DHL-${849204012 + idx}` : undefined;

      // Realistic logistics events
      const logisticsTimeline = [
        { time: '2026-06-07 10:14', status: '已接单', desc: 'SaaS 跨境店铺主系统自动受理客户付款指令。' }
      ];
      if (order.status !== 'Pending') {
        logisticsTimeline.push({ time: '2026-06-07 10:20', status: '已付款', desc: '资金资金结算通道验证无误，付款成功。' });
        logisticsTimeline.push({ time: '2026-06-07 12:00', status: '风控检验', desc: `订单合规风控常规扫描，风险级别评定。风险等级：${order.riskScore >= 60 ? '高风险' : order.riskScore >= 30 ? '中风险' : '低风险'} (${order.riskScore}%)。` });
      }
      if (order.status === 'Shipped' || order.status === 'Completed') {
        logisticsTimeline.push({ time: '2026-06-07 14:30', status: '已出库', desc: '自建仓立体仓库自动分拣配货，并递送至国际包裹分运站。' });
        logisticsTimeline.push({ time: '2026-06-07 18:00', status: '已发货', desc: '航空快件装载起航，交由国际物流承运商 DHL 承运，快递单号: ' + tracking });
      }
      if (order.status === 'Completed') {
        logisticsTimeline.push({ time: '2026-06-08 10:00', status: '已妥投', desc: '航空物流到达目的地分拨中心，顺利派送并签收完成。' });
      }

      return {
        ...order,
        shippingAddress: order.shippingAddress || address,
        paymentMethod: order.paymentMethod || (idx % 2 === 0 ? 'International Credit Card' : 'PayPal Standard Checkout'),
        paymentStatus: payStatus,
        shippingStatus: shipStatus,
        items: order.items 
          ? order.items.map(it => ({
              sku: it.sku || 'SKU-001',
              name: it.name,
              price: it.price,
              qty: it.qty || it.quantity || 1
            }))
          : fallbackItems,
        carrier: carrier,
        trackingNumber: tracking,
        logisticsTimeline: logisticsTimeline.reverse(), // most recent first
        refundReason: order.status === 'Refund Requested' || order.status === 'Refunded' ? '买家要求：误购/发货延迟风险拦截。' : undefined,
        refundAuditStatus: refundAudit
      };
    });
  }, [orders, products]);

  // Handle Order Status modifications and syncing back to parent App
  const syncOrdersToParent = (updatedEnriched: EnrichedOrder[]) => {
    // Convert back from Enriched model to base OrderItem to trigger seamless state propagation
    const baseOrders: OrderItem[] = updatedEnriched.map(o => {
      let finalStatus: OrderItem['status'] = o.status;
      
      if (o.status === 'Completed') {
        finalStatus = 'Completed';
      } else if (o.status === 'Cancelled') {
        finalStatus = 'Cancelled';
      } else if (o.status === 'Refunded') {
        finalStatus = 'Refunded';
      } else if (o.status === 'Refund Requested') {
        finalStatus = 'Refund Requested';
      } else if (o.shippingStatus === '已完成') {
        finalStatus = 'Completed';
      } else if (o.shippingStatus === '已发货' || o.shippingStatus === '已收货') {
        finalStatus = 'Shipped';
      } else if (o.paymentStatus === '已支付' && o.shippingStatus === '待发货') {
        finalStatus = 'AI Confirmed'; // "执行中"
      } else if (o.paymentStatus === '待支付') {
        finalStatus = 'Pending';
      }

      return {
        id: o.id,
        customerName: o.customerName,
        contact: o.contact,
        total: o.total,
        status: finalStatus,
        createdAt: o.createdAt,
        riskScore: o.riskScore
      };
    });
    onUpdateOrders(baseOrders);
  };

  // Top level stats counting
  const stats = useMemo(() => {
    return {
      totalSales: enrichedOrders.filter(o => o.status !== 'Refunded').reduce((acc, o) => acc + o.total, 0),
      totalCount: enrichedOrders.length,
      unshippedCount: enrichedOrders.filter(o => o.shippingStatus === '待发货' && o.paymentStatus === '已支付').length,
      refundCount: enrichedOrders.filter(o => o.status === 'Refund Requested').length,
      riskCount: enrichedOrders.filter(o => o.riskScore >= 60).length
    };
  }, [enrichedOrders]);

  // Actions
  const handleDispatchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showDispatchModal) return;

    const carrierValue = (document.getElementById('carrier-input') as HTMLInputElement)?.value || 'DHL Global';
    const trackingValue = (document.getElementById('tracking-input') as HTMLInputElement)?.value || `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    const nextList = enrichedOrders.map(o => {
      if (o.id === showDispatchModal.id) {
        addLog('Order Center', '发货作业', `执行发货程序。确认承运商 [${carrierValue}]，单号: ${trackingValue}。`, 'success');
        return {
          ...o,
          shippingStatus: '已发货' as const,
          carrier: carrierValue,
          trackingNumber: trackingValue,
          logisticsTimeline: [
            { time: new Date().toISOString().replace('T', ' ').slice(0, 16), status: '已发货', desc: `包裹装箱并发往口岸，由国际快件 ${carrierValue} 专线承运。单号 ${trackingValue}。` },
            ...o.logisticsTimeline
          ]
        };
      }
      return o;
    });

    syncOrdersToParent(nextList);
    setShowDispatchModal(null);
  };

  const handleApproveRefund = (orderId: string, approve: boolean) => {
    const nextList = enrichedOrders.map(o => {
      if (o.id === orderId) {
        if (approve) {
          addLog('Order Center', '退款审核通过', `批准了订单 [#${orderId}] 的退款申请，系统已自动向原支付通道发起收银台退款及物流截单返仓。`, 'success');
          return {
            ...o,
            status: 'Refunded' as const,
            paymentStatus: '已取消' as const,
            refundAuditStatus: '已批准' as const,
            logisticsTimeline: [
              { time: new Date().toISOString().replace('T', ' ').slice(0, 16), status: '订单已取消/退款完成', desc: '退款审核批准，原渠道结算资金自动原路清退。' },
              ...o.logisticsTimeline
            ]
          };
        } else {
          addLog('Order Center', '退款审核拒绝', `拒绝了订单 [#${orderId}] 的退款申请。单据恢复履行配货程序。`, 'warning');
          return {
            ...o,
            status: 'AI Confirmed' as const,
            refundAuditStatus: '已拒绝' as const
          };
        }
      }
      return o;
    });

    syncOrdersToParent(nextList);
    setShowRefundModal(null);
  };

  const handleExportOrders = () => {
    const headers = ['订单号', '客户', '邮箱', '渠道', '金额', '支付状态', '订单状态', '物流状态', '创建时间', '风险等级'];
    const rows = displayOrders.map(o => {
      let rLevel = o.riskScore >= 60 ? '高风险' : o.riskScore >= 30 ? '中风险' : '低风险';
      
      let busStatusLabel = '待履行';
      if (o.status === 'Pending') busStatusLabel = '待付款';
      else if (o.status === 'AI Confirmed') busStatusLabel = '执行中';
      else if (o.status === 'Shipped') busStatusLabel = '已发货';
      else if (o.status === 'Completed') busStatusLabel = '已完成';
      else if (o.status === 'Refund Requested') busStatusLabel = '退款处理中';
      else if (o.status === 'Refunded') busStatusLabel = '已退款';
      else if (o.status === 'Cancelled') busStatusLabel = '已取消';

      return [
        o.id,
        o.customerName,
        o.contact,
        o.paymentMethod,
        `$${o.total.toFixed(2)}`,
        o.paymentStatus,
        busStatusLabel,
        o.shippingStatus,
        o.createdAt,
        rLevel
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${selectedIndustry}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addLog('Order Center', '单据导出', `导出并下载当前筛选的 ${displayOrders.length} 条跨境订单。格式: CSV。`, 'success');
  };

  // ==================== Billing & Invoicing Integrated Handlers ====================
  // Generate a draft invoice
  const handleGenerateInvoice = (orderId: string) => {
    setInvoicedOrderIds(prev => ({ ...prev, [orderId]: true }));
    addLog(
      'Billing Auditor', 
      '自动生成订货发票', 
      `已自动核验订单 [${orderId}]。拉取公司VAT信息及消费者地址并生成正规欧盟商业销账发票。发票号: INV-2026-N`, 
      'success'
    );
  };

  // Click to simulate direct print
  const handlePrintAction = (invoiceId: string) => {
    addLog(
      'Billing Auditor',
      '打印对公票据',
      `触发发票 ${invoiceId} 本地打印队列。双向核销单联已传输至打印服务器。`,
      'info'
    );
  };

  // Send Order detail and invoice via Email
  const handleSendOrder = (order: EnrichedOrder) => {
    const defaultEmail = order.contact || `${order.customerName.toLowerCase().replace(' ', '')}@europa.eu`;
    setSentInvoiceIds(prev => ({
      ...prev,
      [order.id]: true
    }));
    addLog(
      'Order Dispatcher',
      '发送订单明细与电子发票',
      `系统已将订单 [#${order.id}] 的商品明细及其对应的 B2B 汇税对账款 PDF 单据直投发送至顾客邮箱 [${defaultEmail}]。投递状态：妥投成功 (Delivered)。`,
      'success'
    );
  };

  // Send Invoice via Email
  const handleSendInvoice = (order: OrderItem) => {
    const defaultEmail = order.contact || `${order.customerName.toLowerCase().replace(' ', '')}@europa.eu`;
    setSentInvoiceIds(prev => ({
      ...prev,
      [order.id]: true
    }));
    addLog(
      'Mail Daemon',
      '自动对公投邮',
      `发票已直接打包为 PDF，并安全发送至客户注册妥投信箱: ${defaultEmail}。无需手动输入。`,
      'success'
    );
  };

  // Download customer invoice PDF
  const handleDownloadCustomerPDF = (order: OrderItem, idx: number) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const mockInvoiceId = `INV-2026-FPR-${1892 + idx}`;
      
      // Top decorative brand accent
      doc.setFillColor(7, 194, 227); // #07C2E3
      doc.rect(15, 15, 25, 4, 'F');
      
      // Company header info on left
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('EU COMMERCE DIRECT S.r.l.', 15, 30);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text('Avenue des Champs-Élysées, Paris, France', 15, 35);
      doc.text('VAT Reg No: FR 0895312014', 15, 40);
      doc.text('Email: billing@eucommercedirect.com', 15, 45);
      
      // Invoice details block on right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text('INVOICE / DEBIT NOTE', 195, 30, { align: 'right' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(7, 194, 227); // #07C2E3
      doc.text(mockInvoiceId, 195, 37, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Issue Date: ${order.createdAt}`, 195, 43, { align: 'right' });
      doc.text('Due Date: 30 Days Net (Settled Online)', 195, 48, { align: 'right' });
      
      // Subtle Divider
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(15, 54, 195, 54);
      
      // Addresses grids (Bilateral billing cards)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('BILLED FROM', 15, 65);
      doc.text('BILLED TO (BUYER)', 110, 65);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text('EU Commerce Direct S.r.l.', 15, 71);
      doc.text(order.customerName, 110, 71);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text('Corporate Settlement Center Office', 15, 76);
      doc.text(order.contact || `${order.customerName.toLowerCase().replace(' ', '')}@europa.eu`, 110, 76);
      doc.text('Avenue des Champs-Élysées, Paris, France', 15, 81);
      doc.text(`MAPPED UNIFIED REF: SEPA-CUST-${order.customerName.slice(0, 3).toUpperCase()}`, 110, 81);
      
      // Line Items Table Block
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(15, 95, 180, 8, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('DESCRIPTION OF GOODS / SERVICES', 18, 100);
      doc.text('QTY', 120, 100, { align: 'center' });
      doc.text('RATE (EUR)', 150, 100, { align: 'right' });
      doc.text('TOTAL (EUR)', 190, 100, { align: 'right' });
      
      // Row detail entries
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`eShop Global Direct Purchase (Order Key: ${order.id})`, 18, 110);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`MAPPED SYSTEM SKU: OS-SKU-${order.id.slice(-4)}`, 18, 115);
      
      const netAmount = Math.round(order.total * 0.8333 * 100) / 100;
      const vatAmount = Math.round((order.total - netAmount) * 100) / 100;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text('1', 120, 110, { align: 'center' });
      doc.text(`EUR ${netAmount.toFixed(2)}`, 150, 110, { align: 'right' });
      doc.text(`EUR ${netAmount.toFixed(2)}`, 190, 110, { align: 'right' });
      
      doc.setDrawColor(241, 245, 249);
      doc.line(15, 122, 195, 122);
      
      // Soft-teal PAID banner stamp
      doc.setFillColor(240, 253, 250); // teal-50
      doc.rect(15, 130, 52, 22, 'F');
      doc.setDrawColor(153, 246, 228); // teal-200
      doc.rect(15, 130, 52, 22, 'S');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(13, 148, 136); // teal-600
      doc.text('PAYMENT STATUS', 41, 136, { align: 'center' });
      doc.setFontSize(11);
      doc.text('PAID / SETTLED', 41, 143, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Subtotal:', 150, 130, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`EUR ${netAmount.toFixed(2)}`, 190, 130, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      doc.text('VAT / IVA (20%):', 150, 136, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`EUR ${vatAmount.toFixed(2)}`, 190, 136, { align: 'right' });
      
      doc.setDrawColor(226, 232, 240);
      doc.line(120, 142, 195, 142);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('Gross Total Sum:', 150, 149, { align: 'right' });
      doc.setTextColor(7, 194, 227); // #07C2E3
      doc.text(`EUR ${order.total.toFixed(2)}`, 190, 149, { align: 'right' });
      
      // SEPA direct remittance details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('REMITTANCE / SEPA CLEARING STATUS DETAILS', 15, 165);
      doc.setDrawColor(241, 245, 249);
      doc.line(15, 168, 195, 168);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text('Settlement Bank:', 15, 174); doc.setFont('helvetica', 'normal'); doc.text('BNP Paribas SA (Paris, France)', 42, 174);
      doc.setFont('helvetica', 'bold'); doc.text('Clearing IBAN:', 15, 180); doc.setFont('helvetica', 'normal'); doc.text('FR76 3000 4012 9021 8492 01', 42, 180);
      doc.setFont('helvetica', 'bold'); doc.text('SWIFT-BIC Code:', 15, 186); doc.setFont('helvetica', 'normal'); doc.text('BNPAFRPPXXX', 42, 186);
      doc.setFont('helvetica', 'bold'); doc.text('Settlement Key:', 15, 192); doc.setFont('helvetica', 'normal'); doc.text(`SETTLE-${order.id}-FPR`, 42, 192);
      
      // Footer audit text
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 215, 195, 215);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('This invoice has been automatically generated, audited and cleared under the guidelines of EU Council Directive 2006/112/EC on the common VAT system.', 15, 221);
      doc.text('Transacted client funds have been securely cleared in real-time through the SEPA network directly to the merchant\'s account. Paid state is locked.', 15, 225);
      doc.text('Many thanks for your custom. Automatically managed via AI Commerce OS.', 15, 229);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(7, 194, 227);
      doc.text('AI COMMERCE OS', 195, 240, { align: 'right' });
      
      // Download trigger
      doc.save(`${mockInvoiceId}.pdf`);
      
      addLog(
        'Invoice Auditor',
        '生成 PDF 账单已妥投',
        `欧盟商业合规 PDF 发票 [${mockInvoiceId}] 已打包生成并自动触发浏览器本地端下载。金额: €${order.total.toFixed(2)}。`,
        'success'
      );
    } catch (err: any) {
      console.error(err);
      addLog('Invoice Auditor', '生成 PDF 失败', `生成过程发生错误: ${err.message}`, 'error');
    }
  };

  // SaaS Invoice PDF Generation
  const handleDownloadSaaSInvoicePDF = (inv: any) => {
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
      doc.text('Aurora S.R.L. (SaaS Tenant)', 45, 57);

      // Issuer / Provider details on the right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text('Billing Provider / Issuer:', 130, 35);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('AI Commerce OS Europe S.A.R.L.', 130, 41);
      doc.text('VAT ID No: EU892019203', 130, 46);
      doc.text('Rue de la Paix, Paris, France', 130, 51);
      
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
      
      const splitDesc = doc.splitTextToSize(inv.desc, 95);
      doc.text(splitDesc, 15, 90);
      doc.text('1', 120, 90, { align: 'center' });
      doc.text(`EUR ${inv.amount.toFixed(2)}`, 150, 90, { align: 'right' });
      doc.text(`EUR ${inv.amount.toFixed(2)}`, 195, 90, { align: 'right' });
      
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
      
      addLog('Billing Agent', '下载 PDF 发票', `成功生成并下载系统对公发票 [${inv.id}] 的 PDF 电子票据单（金额：€${inv.amount.toFixed(2)}）。`, 'success');
    } catch (err: any) {
      console.error(err);
      addLog('Billing Agent', '生成 PDF 失败', `生成 PDF 时发生错误：${err.message}`, 'error');
    }
  };

  const handlePrintSaaSInvoice = (inv: any) => {
    addLog('Print Agent', '触发系统账单打印', `成功为系统账单 [${inv.id}] 下发本地无线/局域网云打印指令（账簿合规凭底证已传输完毕）。`, 'info');
  };

  const handleExportAllSaaSInvoicesPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFillColor(7, 194, 227); // #07C2E3
      doc.rect(0, 0, 210, 15, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('AI COMMERCE OS - MULTI-TENANT BILLING REGISTRY', 15, 10);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); 
      doc.text('BILLING STATEMENT SUMMARY', 15, 30);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); 
      doc.text(`Tenant Name:`, 15, 38);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text('Aurora S.R.L. (IT-RETAIL-02)', 45, 38);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Export Date:`, 15, 45);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(new Date().toISOString().slice(0, 10), 45, 45);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text('Billing Authority:', 130, 30);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('AI Commerce OS Europe S.A.R.L.', 130, 36);
      doc.text('Rue de la Paix, Paris, France', 130, 41);
      
      doc.setDrawColor(226, 232, 240); 
      doc.setLineWidth(0.5);
      doc.line(15, 58, 195, 58);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105); 
      doc.text('Invoice Ref', 15, 63);
      doc.text('Date', 45, 63);
      doc.text('Description', 70, 63);
      doc.text('Status', 160, 63, { align: 'center' });
      doc.text('Amount (EUR)', 195, 63, { align: 'right' });
      
      doc.line(15, 67, 195, 67);
      
      let activeY = 73;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      
      saasInvoices.forEach((inv) => {
        doc.setFont('helvetica', 'bold');
        doc.text(inv.id, 15, activeY);
        doc.setFont('helvetica', 'normal');
        doc.text(inv.date, 45, activeY);
        
        const splitText = doc.splitTextToSize(inv.desc, 80);
        doc.text(splitText, 70, activeY);
        
        doc.text(inv.status.toUpperCase(), 160, activeY, { align: 'center' });
        doc.text(`EUR ${inv.amount.toFixed(2)}`, 195, activeY, { align: 'right' });
        
        const textLines = splitText.length;
        activeY += textLines * 4.5 + 4;
        doc.line(15, activeY - 2, 195, activeY - 2);
      });
      
      const totalAmount = saasInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Cumulative Statement Value:', 130, activeY + 10, { align: 'right' });
      doc.setTextColor(7, 194, 227); // #07C2E3
      doc.text(`EUR ${totalAmount.toFixed(2)}`, 195, activeY + 10, { align: 'right' });
      
      doc.line(15, 250, 195, 250);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); 
      doc.text('This is an official summary statement generated from your SaaS Management console.', 15, 256);
      doc.text('All operations comply with European B2B digital services rendering acts.', 15, 261);
      
      doc.save(`Billing_Statement_${new Date().toISOString().slice(0, 10)}.pdf`);
      addLog('Billing Agent', '合并导出系统账单总表', `成功为商户导出 ${saasInvoices.length} 笔财务周期内的系统账单流水汇总 PDF`, 'success');
    } catch (err: any) {
      console.error(err);
      addLog('Billing Agent', '合并导出 PDF 失败', `生成汇总 PDF 时发生错误：${err.message}`, 'error');
    }
  };

  // ==================== End Invoicing Integrated Handlers ====================

  // Filter orders based on sub-tab and search bar
  const displayOrders = useMemo(() => {
    let list = [...enrichedOrders];
    
    // Sub-tab filter
    if (activeSubTab === 'unshipped') {
      list = list.filter(o => o.shippingStatus === '待发货' && o.paymentStatus === '已支付');
    } else if (activeSubTab === 'refunds') {
      list = list.filter(o => o.status === 'Refund Requested' || o.status === 'Refunded');
    } else if (activeSubTab === 'tracking') {
      list = list.filter(o => o.shippingStatus === '已发货');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customerName.toLowerCase().includes(q) || 
        o.contact.toLowerCase().includes(q)
      );
    }

    // Sort order
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      // total
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return list;
  }, [enrichedOrders, activeSubTab, searchQuery, sortField, sortOrder]);

  return (
    <div className="space-y-6 text-slate-900 font-sans select-none animate-fadeIn text-left p-1">
      
      {/* Top statistics section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#07C2E3]" />
            <span>订单中心</span>
          </h2>
        </div>
      </div>

      {/* Grid of four quick metrics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">待发货</span>
          <span className="text-xl font-black font-mono text-slate-800 mt-1">{stats.unshippedCount} 件</span>
          <div className="mt-1 text-[9px] text-[#07C2E3] font-bold">原厂备料</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">待退款</span>
          <span className={`text-xl font-black font-mono mt-1 ${stats.refundCount > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-800'}`}>
            {stats.refundCount} 单
          </span>
          <div className="mt-1 text-[9px] text-slate-400">待终审</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">欺诈审批</span>
          <span className={`text-xl font-black font-mono mt-1 ${stats.riskCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
            {stats.riskCount} 笔
          </span>
          <div className="mt-1 text-[9px] text-rose-500 font-bold">AI 拦截</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-left flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">已结单据</span>
          <span className="text-xl font-black font-mono text-emerald-600 mt-1">
            {enrichedOrders.filter(o => o.shippingStatus === '已发货' || o.status === 'Refunded').length} 笔
          </span>
          <div className="mt-1 text-[9px] text-emerald-600 font-bold">成功率 100%</div>
        </div>
      </div>

      {/* Sub tabs nav + sorting tools & search */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[460px]">
        {/* Navigation row inside card */}
        <div className="border-b border-slate-150 bg-slate-50/50 p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          {/* Subtabs controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 select-none">
            <button
              onClick={() => { setActiveSubTab('all'); setSelectedOrder(null); }}
              className={`text-[10px] font-bold py-1 px-3 rounded-md transition-all cursor-pointer ${
                activeSubTab === 'all' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              全部订单 ({stats.totalCount})
            </button>
            <button
              onClick={() => { setActiveSubTab('unshipped'); setSelectedOrder(null); }}
              className={`text-[10px] font-bold py-1 px-3 rounded-md transition-all cursor-pointer ${
                activeSubTab === 'unshipped' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              待履行发货 ({stats.unshippedCount})
            </button>
            <button
              onClick={() => { setActiveSubTab('tracking'); setSelectedOrder(null); }}
              className={`text-[10px] font-bold py-1 px-3 rounded-md transition-all cursor-pointer ${
                activeSubTab === 'tracking' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              物流跟踪中 ({enrichedOrders.filter(o => o.shippingStatus === '已发货').length})
            </button>
            <button
              onClick={() => { setActiveSubTab('refunds'); setSelectedOrder(null); }}
              className={`text-[10px] font-bold py-1 px-3 rounded-md transition-all cursor-pointer ${
                activeSubTab === 'refunds' 
                  ? 'bg-[#ffebee] text-[#d32f2f] shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              退款审核销账 ({enrichedOrders.filter(o => o.status === 'Refund Requested' || o.status === 'Refunded').length})
            </button>
            <button
              onClick={() => { setActiveSubTab('billing'); setSelectedOrder(null); }}
              className={`text-[10px] font-bold py-1 px-3 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                activeSubTab === 'billing' 
                  ? 'bg-white text-[#07C2E3] shadow-sm font-black' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>财务账单 (Billing & Invoices)</span>
            </button>
          </div>

          {/* Table operations search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="键入单号/买家姓名搜索..."
                className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-[10px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] w-full sm:w-48 font-medium placeholder-slate-400"
              />
            </div>
            
            {/* Sort toggle triggers */}
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-[10px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
            >
              <option value="createdAt">按出单时间排序</option>
              <option value="total">按流转金额排序</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="bg-white border border-slate-200 hover:border-slate-300 text-slate-600 p-1 rounded-lg text-[10px] font-bold cursor-pointer flex items-center justify-center w-6 h-6 shrink-0"
              title="切换排序方向"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>

            {/* Simulate Purchase Action */}
            <button
              onClick={handleCreateAutomatedSimulatedOrder}
              className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 px-2.5 py-1 h-6 rounded-lg text-[10px] font-black cursor-pointer transition-all flex items-center gap-1 shrink-0 border-none shadow-xs"
              title="模拟商城买家线上付款新订单，可实时点击进行放大真实预览、发送和流转PDF"
            >
              <span>+ 模拟商城付款创单</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportOrders}
              className="bg-white border border-slate-200 hover:border-slate-300 hover:text-slate-900 text-slate-600 px-2 py-1 h-6 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shrink-0"
              title="导出当前筛选出的订单数据"
            >
              <Download className="w-3 h-3 text-[#07C2E3]" />
              <span>导出 CSV</span>
            </button>
          </div>

        </div>

        {activeSubTab === 'billing' ? (
          <div className="p-5 space-y-4 animate-fadeIn text-left text-xs bg-white min-h-[460px]">
            {/* Double header with Sub-tab toggle buttons to merge client order invoicing & SaaS platform billing registry */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-105 pb-4">
              <div className="flex items-center gap-1.5 p-0.5 bg-slate-150 rounded-lg border border-slate-200/80 w-fit">
                <button
                  type="button"
                  onClick={() => setBillingSubTab('customer')}
                  className={`text-[10px] font-bold py-1 px-3 rounded-md transition-all cursor-pointer ${
                    billingSubTab === 'customer'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  顾客订单收款开票 (Order Invoices)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingSubTab('saas')}
                  className={`text-[10px] font-bold py-1 px-3 rounded-md transition-all cursor-pointer ${
                    billingSubTab === 'saas'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  系统SaaS订阅账单 (Platform Bills)
                </button>
              </div>

              {billingSubTab === 'saas' && (
                <button
                  type="button"
                  onClick={handleExportAllSaaSInvoicesPDF}
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 py-1.5 px-3.5 rounded-lg text-[10px] font-black tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 border-none shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出账单总表 (Export Statement PDF)</span>
                </button>
              )}
            </div>

            {billingSubTab === 'customer' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-[#07C2E3] rounded-xs inline-block"></span>
                    自动对公销账发票管理 (Auto-generated B2B Order Invoices)
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans">
                    依据订单流转金额及欧盟增值税合规准则（标准 VAT 比率 20%），系统自动核准备备备备置开票草稿
                  </p>
                </div>

                <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10 select-none">
                        <th className="p-3 pl-4">发票编号</th>
                        <th className="p-3">关联订单号</th>
                        <th className="p-3">客户</th>
                        <th className="p-3">开票时间</th>
                        <th className="p-3 text-right">计算金额 (EUR)</th>
                        <th className="p-3 text-center">发票状态</th>
                        <th className="p-3 text-right pr-4">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {orders.map((o, idx) => {
                        const isFinalized = invoicedOrderIds[o.id] || false;
                        const isSent = sentInvoiceIds[o.id] || false;
                        const mockInvoiceId = `INV-2026-FPR-${1892 + idx}`;

                        return (
                          <tr key={o.id} className="h-11 hover:bg-slate-50/20">
                            <td className="p-3 pl-4 font-mono font-bold text-slate-850">
                              {isFinalized ? mockInvoiceId : <span className="text-amber-500 font-sans text-[10px] font-bold">发票草稿 (Draft)</span>}
                            </td>
                            <td className="p-3 font-mono font-bold text-[#07C2E3]">{o.id}</td>
                            <td className="p-3 text-slate-800 font-bold">{o.customerName}</td>
                            <td className="p-3 font-mono text-slate-400">{o.createdAt}</td>
                            <td className="p-3 text-right font-mono font-black text-slate-900">€{o.total.toFixed(2)}</td>
                            <td className="p-3 text-center">
                              {isFinalized ? (
                                <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded border ${
                                  isSent 
                                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                } uppercase font-sans`}>
                                  {isSent ? '已发送客户' : '已核准生成'}
                                </span>
                              ) : (
                                <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border bg-amber-50 border-amber-200 text-amber-600 uppercase font-sans">
                                  未审核
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right pr-4">
                              <div className="flex gap-1.5 justify-end">
                                {!isFinalized ? (
                                  <button
                                    type="button"
                                    onClick={() => handleGenerateInvoice(o.id)}
                                    className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 text-[10px] font-black px-2.5 py-1 rounded cursor-pointer transition-all border-none"
                                  >
                                    生成发票
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadCustomerPDF(o, idx)}
                                      className="text-[#07C2E3] hover:text-[#06B2D0] hover:bg-slate-100 p-1 rounded cursor-pointer shrink-0 transition-colors border border-slate-200"
                                      title="下载 PDF 发票"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handlePrintAction(mockInvoiceId)}
                                      className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-1 rounded cursor-pointer shrink-0 transition-colors border border-slate-200"
                                      title="快捷云打印"
                                    >
                                      <Printer className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSendInvoice(o)}
                                      className="bg-slate-900 hover:bg-black text-[#07C2E3] text-[10px] font-semibold px-2 py-1 rounded cursor-pointer inline-flex items-center gap-1 shrink-0 border-none"
                                    >
                                      <Send className="w-2.5 h-2.5" />
                                      <span>{isSent ? '重新投发' : '投发'}</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-slate-405 font-bold font-sans">
                            目前暂无客户发票单据。请在订单中心成交订单以自动产生草稿。
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-3.5 bg-[#07C2E3] rounded-xs inline-block"></span>
                    企业财务对公发票登记簿 (SaaS Billing Ledger)
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-sans">
                    管理系统计算特权、开发API人工智能算力扣划及欧洲多区库房关税合规发票细节
                  </p>
                </div>

                <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10 select-none">
                        <th className="p-3 pl-4">账 Ref</th>
                        <th className="p-3">结算日期</th>
                        <th className="p-3">算力明细说明</th>
                        <th className="p-3 text-right">合计总额</th>
                        <th className="p-3 text-center">发票状态</th>
                        <th className="p-3 text-right pr-4">快捷操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {saasInvoices.map((inv) => (
                        <tr key={inv.id} className="h-11 hover:bg-slate-50/20">
                          <td className="p-3 pl-4 font-mono font-bold text-[#07C2E3]">{inv.id}</td>
                          <td className="p-3 font-mono text-slate-500">{inv.date}</td>
                          <td className="p-3 text-slate-750 font-sans max-w-[240px] truncate" title={inv.desc}>
                            {inv.desc}
                          </td>
                          <td className="p-3 text-right font-mono font-black text-slate-950">€{inv.amount.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            {inv.status === 'paid' && (
                              <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 border-emerald-200 text-emerald-600 uppercase font-sans">
                                Paid
                              </span>
                            )}
                            {inv.status === 'pending' && (
                              <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border bg-amber-50 border-amber-200 text-amber-600 uppercase font-sans animate-pulse">
                                Pending
                              </span>
                            )}
                            {inv.status === 'overdue' && (
                              <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border bg-rose-50 border-rose-200 text-rose-600 uppercase font-sans">
                                Overdue
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right pr-4">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                type="button"
                                onClick={() => handleDownloadSaaSInvoicePDF(inv)}
                                className="text-[#07C2E3] hover:text-[#06B2D0] hover:bg-slate-100 p-1 rounded cursor-pointer border border-slate-200 transition-colors"
                                title="合并导出 PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePrintSaaSInvoice(inv)}
                                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-1 rounded cursor-pointer border border-slate-200 transition-colors"
                                title="局域网云打印"
                              >
                                <Printer className="w-3.5 h-3.5" />
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
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x divide-slate-150">
          
          {/* Left / Middle: list of matching orders */}
          <div className="xl:col-span-2 text-xs overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/20 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-2.5 text-center">订单号</th>
                  <th className="p-2.5">客户</th>
                  <th className="p-2.5">邮箱</th>
                  <th className="p-2.5">渠道</th>
                  <th className="p-2.5">金额</th>
                  <th className="p-2.5">支付状态</th>
                  <th className="p-2.5">订单状态</th>
                  <th className="p-2.5">物流状态</th>
                  <th className="p-2.5">创建时间</th>
                  <th className="p-2.5 text-center">风险等级</th>
                  <th className="p-2.5 text-right font-bold pr-4">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {displayOrders.length > 0 ? (
                  displayOrders.map((order) => {
                    const isHighRisk = order.riskScore >= 60;
                    
                    // Style mapping for payment status
                    let payBadge = 'bg-slate-50 text-slate-500 border-slate-200';
                    if (order.paymentStatus === '已支付') payBadge = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                    else if (order.paymentStatus === '待支付') payBadge = 'bg-amber-50 text-amber-600 border-amber-100';
                    else if (order.paymentStatus === '已取消') payBadge = 'bg-slate-100 text-slate-400 border-slate-200';
                    else if (order.paymentStatus === '支付失败') payBadge = 'bg-rose-50 text-rose-600 border-rose-100';

                    // Style mapping for shipping status
                    let shipBadge = 'bg-slate-50 text-slate-500 border-slate-200';
                    if (order.shippingStatus === '已完成') shipBadge = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                    else if (order.shippingStatus === '已发货') shipBadge = 'bg-blue-50 text-blue-600 border-blue-105';
                    else if (order.shippingStatus === '已收货') shipBadge = 'bg-cyan-50 text-[#07C2E3] border-cyan-100';
                    else if (order.shippingStatus === '待发货') shipBadge = 'bg-slate-100 text-slate-500 border-slate-200';

                    // Style mapping for general business order status
                    let busStatusLabel = '待履行';
                    let busBadge = 'bg-slate-50 text-slate-500 border-slate-200';

                    if (order.status === 'Pending') {
                      busStatusLabel = '待付款';
                      busBadge = 'bg-amber-50 text-amber-600 border-amber-100';
                    } else if (order.status === 'AI Confirmed') {
                      busStatusLabel = '执行中';
                      busBadge = 'bg-[#e6fafc] text-[#07C2E3] border-cyan-100';
                    } else if (order.status === 'Shipped') {
                      busStatusLabel = '已发货';
                      busBadge = 'bg-blue-50 text-blue-600 border-blue-100';
                    } else if (order.status === 'Refund Requested') {
                      busStatusLabel = '退款处理中';
                      busBadge = 'bg-rose-50 text-rose-600 border-rose-150 animate-pulse';
                    } else if (order.status === 'Refunded') {
                      busStatusLabel = '已退款';
                      busBadge = 'bg-slate-100 text-slate-450 border-slate-200';
                    } else if (order.status === 'Completed') {
                      busStatusLabel = '已完成';
                      busBadge = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                    } else if (order.status === 'Cancelled') {
                      busStatusLabel = '已取消';
                      busBadge = 'bg-slate-100 text-slate-400 border-slate-200';
                    }

                    return (
                      <tr 
                        key={order.id} 
                        onClick={() => {
                          setSelectedOrder(order);
                          setMagnifiedOrder(order);
                        }}
                        className={`hover:bg-slate-50/50 cursor-pointer transition-all border-b border-slate-100 ${selectedOrder?.id === order.id ? 'bg-[#e6fafc]/25 border-l-2 border-l-[#07C2E3]' : ''}`}
                        title="点击直接放大打开预览此订单极其欧盟合规PDF发票与发货投单"
                      >
                        <td className="p-2.5 text-center font-bold font-mono text-slate-900">{order.id}</td>
                        <td className="p-2.5 font-bold text-slate-900">{order.customerName}</td>
                        <td className="p-2.5 font-mono text-slate-500 text-[10px] break-all max-w-[120px]">{order.contact}</td>
                        <td className="p-2.5 text-slate-500 text-[10px] truncate max-w-[100px]" title={order.paymentMethod}>
                          {order.paymentMethod === 'International Credit Card' ? '国际信用卡' : 'PayPal支付'}
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-800">${order.total.toFixed(2)}</td>
                        <td className="p-2.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${payBadge}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${busBadge}`}>
                            {busStatusLabel}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${shipBadge}`}>
                            {order.shippingStatus}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono text-slate-400 text-[10px]">{order.createdAt}</td>
                        <td className="p-2.5 text-center">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            order.riskScore >= 60 
                              ? 'bg-rose-50 text-rose-700 border-rose-100 font-bold' 
                              : order.riskScore >= 30 
                                ? 'bg-amber-50 text-amber-700 border-amber-100 font-bold' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}>
                            {order.riskScore >= 60 ? '高' : order.riskScore >= 30 ? '中' : '低'}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-medium pr-3 space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setMagnifiedOrder(order);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-0.5 px-1.5 rounded text-[10px] font-bold cursor-pointer transition-all inline-block"
                            title="放大预览并编辑发送此单据详情"
                          >
                            查看
                          </button>
                          
                          <button
                            onClick={() => setMagnifiedOrder(order)}
                            className="bg-cyan-50 hover:bg-cyan-100 text-[#07C2E3] py-0.5 px-1.5 rounded text-[10px] font-bold cursor-pointer transition-all inline-flex items-center gap-0.5 border border-cyan-100"
                            title="放大预览此订单"
                          >
                            <Maximize2 className="w-2.5 h-2.5" />
                            <span>放大</span>
                          </button>

                          <button
                            onClick={() => handleSendOrder(order)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 py-0.5 px-1.5 rounded text-[10px] font-bold cursor-pointer transition-all inline-flex items-center gap-0.5 border border-blue-100"
                            title="一键直接核发并发送 PDF 账单给买家"
                          >
                            <Send className="w-2.5 h-2.5" />
                            <span>发送</span>
                          </button>

                          <button
                            onClick={() => handleDownloadCustomerPDF(order, orders.indexOf(order))}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-0.5 px-1.5 rounded text-[10px] font-bold cursor-pointer transition-all inline-flex items-center gap-0.5 border border-emerald-100"
                            title="生成并下载欧盟合规 B2B 款额 PDF 票据"
                          >
                            <Download className="w-2.5 h-2.5" />
                            <span>PDF</span>
                          </button>

                          {order.paymentStatus === '已支付' && order.shippingStatus === '待发货' && order.status !== 'Refund Requested' && (
                            <button
                              onClick={() => setShowDispatchModal(order)}
                              className="bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-0.5 px-1.5 rounded font-bold text-[10px] transition-all cursor-pointer whitespace-nowrap inline-block border-none"
                              title="执行核定派发物流出库单"
                            >
                              发货
                            </button>
                          )}
                          {order.status === 'Refund Requested' && (
                            <button
                              onClick={() => setShowRefundModal(order)}
                              className="bg-rose-500 hover:bg-rose-600 text-white py-0.5 px-1.5 rounded font-bold text-[10px] transition-all cursor-pointer whitespace-nowrap inline-block animate-pulse border-none"
                            >
                              退款审核
                            </button>
                          )}
                          {order.riskScore >= 60 && (
                            <button
                              onClick={() => setShowRiskModal(order)}
                              className="bg-amber-600 hover:bg-amber-700 text-white py-0.5 px-1.5 rounded font-bold text-[10px] transition-all cursor-pointer whitespace-nowrap inline-block border-none"
                            >
                              安全核验
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="p-10 text-center text-slate-400 font-bold">
                      当前筛选条件下没有对应的订单。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Right Pane: Live details and logistics tracking */}
          <div className="p-4 text-xs space-y-4">
            {selectedOrder ? (
              <div className="space-y-4 animate-fadeIn text-left">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">单据详情概要</span>
                    <span className="text-sm font-black text-slate-800 font-mono">订单: {selectedOrder.id}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)} 
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 hover:bg-slate-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Direct quick action invoicing panel fitting European shortcut guidelines */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">发票与凭证快捷操作</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => {
                        addLog('Billing Agent', '生成订单发票', `已自动拉取企业VAT与客户地址，为订单 [${selectedOrder.id}] 建立对应合规发票单：INV-2026-FPR-${selectedOrder.id.slice(-4)}，已载入财务大账。`, 'success');
                      }}
                      className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black text-[10px] py-1.5 px-3 rounded-lg cursor-pointer transition-all border-none"
                    >
                      生成发票
                    </button>
                    <button
                      onClick={() => {
                        addLog('Print Service', '发票排版打印', `合并生成发票 INV-2026-FPR-${selectedOrder.id.slice(-4)}。打印任务已安全指派至本地 PDF 渲染联。`, 'info');
                      }}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px] py-1.5 px-3 rounded-lg cursor-pointer transition-all"
                    >
                      打印
                    </button>
                    <button
                      onClick={() => {
                        const email = selectedOrder.contact || 'customer@standard-buyer.eu';
                        addLog('Mail Service', '投递对公发票', `电子发票 INV-2026-FPR-${selectedOrder.id.slice(-4)} 已由 SMTP 通道直投至客户邮箱: ${email}，免填表流程完毕。`, 'success');
                      }}
                      className="bg-slate-900 hover:bg-black text-[#07C2E3] font-bold text-[10px] py-1.5 px-3 rounded-lg cursor-pointer transition-all border-none"
                    >
                      发送给客户
                    </button>
                  </div>
                </div>

                {/* Risk audit box */}
                <div className={`p-2.5 rounded-lg border text-left ${
                  selectedOrder.riskScore >= 60 
                    ? 'bg-rose-50 border-rose-100 text-rose-850' 
                    : selectedOrder.riskScore >= 30 
                      ? 'bg-amber-50 border-amber-100 text-amber-850'
                      : 'bg-emerald-50 border-emerald-100 text-emerald-850'
                }`}>
                  <div className="flex items-center justify-between font-bold text-[10px] uppercase">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>风险订单识别</span>
                    </div>
                    <span className={`px-1 rounded text-[9px] ${
                      selectedOrder.riskScore >= 60 
                        ? 'bg-rose-100 text-rose-700' 
                        : selectedOrder.riskScore >= 30 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedOrder.riskScore >= 60 ? '风险等级：高' : selectedOrder.riskScore >= 30 ? '风险等级：中' : '风险等级：低'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-mono font-bold text-xs">系数: {selectedOrder.riskScore}%</span>
                    <span className="text-[9px] font-sans">
                      {selectedOrder.riskScore >= 60 
                        ? '监测到异常账单地址及地理漂移。建议进行二次人工核查。' 
                        : selectedOrder.riskScore >= 30 
                          ? '中危：邮箱域名解析存疑。请人工对账单和物流渠道。' 
                          : '安全合规：无欺诈评分。'}
                    </span>
                  </div>
                  
                  {/* Action buttons as part of manual operations */}
                  <div className="mt-2.5 flex items-center gap-1 border-t border-slate-200/40 pt-1.5">
                    <button
                      onClick={() => {
                        addLog('Order Center', '风险核查', `查看订单 [#${selectedOrder.id}] 风控信噪记录及详细日志。对端正常。`, 'info');
                        // Open risk modal directly 
                        setShowRiskModal(selectedOrder);
                      }}
                      className="bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-[9px] py-0.5 px-2 rounded cursor-pointer transition-all"
                    >
                      人工审核
                    </button>
                    {selectedOrder.shippingStatus === '待发货' && selectedOrder.paymentStatus === '已支付' && (
                      <button
                        onClick={() => {
                          setShowDispatchModal(selectedOrder);
                        }}
                        className="bg-[#e6fafc] hover:bg-[#07C2E3] hover:text-white text-[#07C2E3] border border-cyan-150 text-[9px] py-0.5 px-2 rounded cursor-pointer transition-all ml-auto font-bold"
                      >
                        直接允许发货
                      </button>
                    )}
                  </div>
                </div>

                {/* Customer Details info */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-bold block bg-slate-50 border-y border-slate-150/60 py-1 pl-1.5 uppercase select-none">
                    买家寄件信息
                  </span>
                  <div className="space-y-1 bg-slate-50/30 p-2 rounded-lg border border-slate-150">
                    <div className="font-bold text-slate-900">{selectedOrder.customerName}</div>
                    <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{selectedOrder.contact}</span>
                    </div>
                    <div className="flex items-start gap-1 text-slate-500 text-[10px] mt-1 text-left leading-relaxed">
                      <MapPin className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                      <span>{selectedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Items and receipt list */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-bold block bg-slate-50 border-y border-slate-150/60 py-1 pl-1.5 uppercase select-none">
                    商品配货明细
                  </span>
                  <div className="divide-y divide-slate-100 bg-white border border-slate-150 rounded-lg overflow-hidden">
                    {selectedOrder.items.map((item, id) => (
                      <div key={id} className="p-2 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[9px] text-slate-400 font-mono mt-0.5">SKU: {item.sku}</div>
                        </div>
                        <div className="text-right font-mono font-bold">
                          <span className="text-slate-400 mr-2">x{item.qty}</span>
                          <span className="text-slate-800">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                    <div className="p-2 bg-slate-50/50 flex justify-between font-bold text-slate-900 border-t border-slate-150">
                      <span>单据付款总计:</span>
                      <span className="font-mono text-cyan-700">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Live logistics tracing timeline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-slate-50 border-y border-slate-150/60 py-1 px-1.5">
                    <span className="text-[9px] text-slate-400 font-bold uppercase select-none">
                      物流轨迹查询
                    </span>
                    {selectedOrder.shippingStatus === '已发货' && (
                      <button
                        onClick={() => {
                          const updated = enrichedOrders.map(o => {
                            if (o.id === selectedOrder.id) {
                              return {
                                ...o,
                                status: 'Completed' as const,
                                shippingStatus: '已完成' as const,
                                logisticsTimeline: [
                                  { time: new Date().toISOString().replace('T', ' ').slice(0, 16), status: '已签收/已完成', desc: '快递已妥投派送，商家确认完成签收结单。' },
                                  ...o.logisticsTimeline
                                ]
                              };
                            }
                            return o;
                          });
                          syncOrdersToParent(updated);
                          addLog('Order Center', '妥投签收结单', `订单 [#${selectedOrder.id}] 人工确证买家已签收完结，账期清算完成。`, 'success');
                          setSelectedOrder({
                            ...selectedOrder,
                            status: 'Completed',
                            shippingStatus: '已完成',
                            logisticsTimeline: [
                              { time: new Date().toISOString().replace('T', ' ').slice(0, 16), status: '已签收/已完成', desc: '快递已妥投派送，商家确认完成签收结单。' },
                              ...selectedOrder.logisticsTimeline
                            ]
                          });
                        }}
                        className="bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-0.5 px-2 rounded text-[9px] font-bold cursor-pointer transition-all active:scale-95"
                      >
                        标记已完成
                      </button>
                    )}
                  </div>
                  {selectedOrder.carrier && selectedOrder.trackingNumber && (
                    <div className="px-2 py-1 bg-blue-50/40 rounded border border-blue-100 text-[10px] text-blue-700 font-mono flex items-center justify-between">
                      <span>承运: {selectedOrder.carrier}</span>
                      <span>单号: {selectedOrder.trackingNumber}</span>
                    </div>
                  )}

                  <div className="relative pl-3 border-l-2 border-slate-150/80 ml-2 space-y-4 pt-1">
                    {selectedOrder.logisticsTimeline.map((evt, idx) => (
                      <div key={idx} className="relative text-left">
                        {/* Dot */}
                        <div className={`absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full border-2 ${
                          idx === 0 
                            ? 'bg-[#07C2E3] border-cyan-100 ring-2 ring-cyan-50' 
                            : 'bg-slate-300 border-white'
                        }`} />
                        <div className="font-bold text-slate-800 flex items-center gap-1 text-[10px]">
                          <span>{evt.status}</span>
                          <span className="font-mono text-[9px] text-slate-400 font-normal">{evt.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{evt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2 select-none">
                <FileText className="w-8 h-8 text-slate-350" />
                <span className="font-bold text-xs">暂无单据选中</span>
                <p className="text-[10px] text-slate-400 font-mono">SELECT_ORDER</p>
              </div>
            )}
          </div>

        </div>
        )}
      </div>

      {/* Magnified Order Modal Preview */}
      {magnifiedOrder && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200/80 rounded-2xl max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  订单高级放大交互式预览 / Interactive Order Magnified Console
                </span>
                <span className="text-base font-black text-slate-900 font-mono flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[#07C2E3]" />
                  <span>单据 AWB: #{magnifiedOrder.id}</span>
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setMagnifiedOrder(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer border-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Pane */}
            <div className="p-6 space-y-6 overflow-y-auto text-left text-xs text-slate-600">
              
              {/* Row 1: States Summary blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">支付状态</span>
                  <span className="text-xs font-black text-slate-800 mt-1 block font-mono">{magnifiedOrder.paymentStatus}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">运载配送</span>
                  <span className="text-xs font-black text-slate-800 mt-1 block font-mono">{magnifiedOrder.shippingStatus}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">成交时间</span>
                  <span className="text-xs font-medium text-slate-800 mt-1 block font-mono">{magnifiedOrder.createdAt}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">风控评级</span>
                  <span className={`text-xs font-black mt-1 block ${
                    magnifiedOrder.riskScore >= 60 ? 'text-rose-600' : magnifiedOrder.riskScore >= 30 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {magnifiedOrder.riskScore}% ({magnifiedOrder.riskScore >= 60 ? '高风险' : magnifiedOrder.riskScore >= 30 ? '中风险' : '可信件'})
                  </span>
                </div>
              </div>

              {/* Row 2: Customer Delivery Identity block */}
              <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-150 space-y-3.5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
                  国际买家清结算合规信息 (Customer Identity Summary)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                      <FileCheck className="w-3.5 h-3.5 text-[#07C2E3]" />
                      <span>法定买方主体:</span>
                    </div>
                    <p className="font-bold text-slate-900 font-sans text-xs">{magnifiedOrder.customerName}</p>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                      <Mail className="w-3.5 h-3.5 text-[#07C2E3]" />
                      <span>SMTP 邮箱:</span>
                    </div>
                    <p className="font-mono text-slate-800 text-xs break-all">{magnifiedOrder.contact}</p>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-[#07C2E3]" />
                      <span>欧盟VAT申领及签收递送地址:</span>
                    </div>
                    <p className="font-sans text-slate-800 text-xs bg-white p-2.5 rounded border border-slate-100 leading-relaxed font-semibold">
                      {magnifiedOrder.shippingAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 3: Items list table */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-2">
                  明细清单 / Line Items Ledger
                </span>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider h-9 select-none">
                        <th className="p-3 pl-4">商品条码 SKU</th>
                        <th className="p-3">名称</th>
                        <th className="p-3 text-right">单价 Price</th>
                        <th className="p-3 text-center">数量 Qty</th>
                        <th className="p-3 text-right pr-4">小计 Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold bg-white">
                      {magnifiedOrder.items.map((it, idx) => (
                        <tr key={idx} className="h-10 hover:bg-slate-50/20">
                          <td className="p-3 pl-4 font-mono font-bold text-[#07C2E3]">{it.sku}</td>
                          <td className="p-3 text-slate-800 font-medium">{it.name}</td>
                          <td className="p-3 text-right font-mono text-slate-500">${it.price.toFixed(2)}</td>
                          <td className="p-3 text-center font-mono">{it.qty}</td>
                          <td className="p-3 text-right pr-4 font-mono font-black text-slate-900">${(it.price * it.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/30 font-black text-slate-905 h-11">
                        <td colSpan={3} className="p-3 pl-4"></td>
                        <td className="p-3 text-center text-slate-400 font-medium font-mono uppercase tracking-wider text-[9px]">
                          应付账款 (EUR/USD)
                        </td>
                        <td className="p-3 text-right pr-4 font-mono text-sm text-[#07C2E3]">
                          ${magnifiedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Logistics Timeline component */}
              <div className="bg-slate-50/20 border border-slate-150 p-4 rounded-xl space-y-3">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#07C2E3]" />
                  <span>欧盟多式联运实况记录 (Transit Audit Timeline)</span>
                </span>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                  {magnifiedOrder.logisticsTimeline.map((evt, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-[11px] border-b border-slate-50 pb-2 last:border-none">
                      <div className="pt-1 select-none">
                        <span className="w-1.5 h-1.5 bg-[#07C2E3] rounded-full inline-block ring-4 ring-cyan-50"></span>
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{evt.status}</span>
                          <span className="font-mono text-[9px] text-slate-400 font-normal">{evt.time}</span>
                        </div>
                        <p className="text-slate-550 text-[10px] leading-relaxed">{evt.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Unified actions footer */}
            <div className="p-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3 bg-slate-50 rounded-b-2xl">
              <span className="text-[10px] text-slate-404 font-medium">
                账本签署：AI Commerce OS • 欧盟财务对公合规发票已核准
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDownloadCustomerPDF(magnifiedOrder, orders.indexOf(magnifiedOrder))}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-1.5 px-3.5 rounded-xl cursor-pointer transition-all flex items-center gap-1 border-none shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载 PDF 账单</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendOrder(magnifiedOrder)}
                  className="bg-slate-900 hover:bg-black text-[#07C2E3] font-black text-xs py-1.5 px-3.5 rounded-xl cursor-pointer transition-all flex items-center gap-1 border-none shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>发送给买家</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePrintAction(`INV-2026-FPR-${1892 + orders.indexOf(magnifiedOrder)}`);
                  }}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs py-1.5 px-3 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 border border-slate-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>无线云打印</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMagnifiedOrder(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs py-1.5 px-4 rounded-xl cursor-pointer transition-all border-none"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Fulfillment Modal dialog */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form 
            onSubmit={handleDispatchOrder} 
            className="bg-white border border-slate-150 rounded-xl max-w-sm w-full shadow-22xl p-5 relative space-y-4 text-left"
          >
            <button 
              type="button"
              onClick={() => setShowDispatchModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 text-sm text-slate-800">
              <Truck className="w-4 h-4 text-[#07C2E3]" />
              <span>多级跨境物流派发作业 (出库装车)</span>
            </h3>

            <div className="bg-sky-50 rounded-lg p-2.5 border border-sky-100/70 text-slate-700 text-[10px] leading-relaxed">
              <p className="font-bold text-[#07C2E3] mb-0.5">物流链路启动通知:</p>
              <p>确认向 <b>{showDispatchModal.customerName}</b> 出库派送。订单内货品包含 <b>{showDispatchModal.items.map(it => `${it.name} x${it.qty}`).join(', ')}</b>。</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-500 font-bold">国际承运商物流商 *</label>
                <input 
                  type="text"
                  id="carrier-input"
                  required
                  defaultValue="DHL Global Express (大中华区分拨区)"
                  className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-500 font-bold">航空运输快递单号 (AWB) *</label>
                <input 
                  type="text"
                  id="tracking-input"
                  required
                  defaultValue={`AWB-${Math.floor(20593021 + Math.random() * 6940292)}`}
                  className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-50 pt-4">
              <button 
                type="button"
                onClick={() => setShowDispatchModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg font-bold text-xs"
              >
                取消
              </button>
              <button 
                type="submit"
                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-1.5 px-4 rounded-lg font-bold text-xs shadow-sm"
              >
                确认开始物流配运
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Refund/After-sales approval dialog */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-150 rounded-xl max-w-sm w-full shadow-22xl p-5 relative space-y-4 text-left">
            <button 
              type="button"
              onClick={() => setShowRefundModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 text-sm text-slate-800">
              <CornerDownLeft className="w-4 h-4 text-rose-500" />
              <span>售后退款索赔核销审批</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-50 pb-2">
                <span>申请买家:</span>
                <span className="text-slate-900">{showRefundModal.customerName}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-slate-50 pb-2">
                <span>涉事货品总额:</span>
                <span className="text-rose-600 font-mono">${showRefundModal.total.toFixed(2)} USD</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-450 font-bold block mb-1">退款主诉原因:</span>
                <p className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-600 text-[10px] leading-relaxed">
                  {showRefundModal.refundReason || '买家协商一致整单原路退款结算登记。'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-50 pt-4">
              <button 
                type="button"
                onClick={() => handleApproveRefund(showRefundModal.id, false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg font-bold text-xs"
              >
                拒绝申请
              </button>
              <button 
                type="button"
                onClick={() => handleApproveRefund(showRefundModal.id, true)}
                className="bg-rose-600 hover:bg-rose-700 text-white py-1.5 px-4 rounded-lg font-bold text-xs shadow-sm"
              >
                同意退款清算
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Risk Verification dialog */}
      {showRiskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-150 rounded-xl max-w-sm w-full shadow-22xl p-5 relative space-y-4 text-left">
            <button 
              type="button"
              onClick={() => setShowRiskModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 text-sm text-slate-800">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>风险账单人工综合核实</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                <p className="font-bold text-slate-800">单据号: #{showRiskModal.id}</p>
                <p className="text-slate-500 text-[10px] mt-0.5">客户: {showRiskModal.customerName} ({showRiskModal.contact})</p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 text-[10px]">
                  <span>当前风控系数:</span>
                  <span className={`font-mono font-bold px-1 rounded ${
                    showRiskModal.riskScore >= 60 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                  }`}>{showRiskModal.riskScore}%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-450 font-bold block uppercase">安全检测因子指标清单</span>
                
                <div className="p-2 bg-slate-50/50 rounded border border-slate-150 space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">1. 下单地理IP对应国家:</span>
                    <span className="font-mono font-bold text-emerald-600">正常匹配 (Verified)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">2. 支付卡账单地区一致性:</span>
                    <span className={`font-mono font-bold ${showRiskModal.riskScore >= 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {showRiskModal.riskScore >= 60 ? '部分偏差' : '高斯一致'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">3. 高危代购邮箱特征值:</span>
                    <span className="font-mono font-bold text-emerald-600">合规域名</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">4. 恶意多设备并发指纹:</span>
                    <span className="font-mono font-bold text-emerald-600">无异常并发</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-2.5 rounded border border-amber-100/70 text-amber-800 text-[10px] leading-relaxed">
              <p className="font-bold">履约准入提示:</p>
              <p>系统不强制阻断发货，决定权完全在商家手上。允许放行将清除风险印记，取消订单则会启动原渠道资金回汇流程。</p>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-50 pt-4 text-xs">
              <button 
                type="button"
                onClick={() => {
                  const updated = enrichedOrders.map(o => {
                    if (o.id === showRiskModal.id) {
                      return {
                        ...o,
                        status: 'Cancelled' as const,
                        paymentStatus: '已取消' as const,
                        logisticsTimeline: [
                          { time: new Date().toISOString().replace('T', ' ').slice(0, 16), status: '订单已取消', desc: '经人工风控审核，对单异常，商家决定主动取消此异常账单配送。' },
                          ...o.logisticsTimeline
                        ]
                      };
                    }
                    return o;
                  });
                  syncOrdersToParent(updated);
                  addLog('Order Center', '主动取消账单', `由于风控等级人工判定无法准入，主动取消订单 [#${showRiskModal.id}]，原路结算终止。`, 'warning');
                  setShowRiskModal(null);
                  if (selectedOrder?.id === showRiskModal.id) {
                    setSelectedOrder({
                      ...selectedOrder,
                      status: 'Cancelled',
                      paymentStatus: '已取消',
                      logisticsTimeline: [
                        { time: new Date().toISOString().replace('T', ' ').slice(0, 16), status: '订单已取消', desc: '经人工风控审核，对单异常，商家决定主动取消此异常账单配送。' },
                        ...selectedOrder.logisticsTimeline
                      ]
                    });
                  }
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-750 font-bold py-1.5 px-3 rounded-lg border border-rose-100 cursor-pointer"
              >
                取消订单并全额退款
              </button>
              <button 
                type="button"
                onClick={() => {
                  const updated = enrichedOrders.map(o => {
                    if (o.id === showRiskModal.id) {
                      return {
                        ...o,
                        status: 'AI Confirmed' as const, // 转入待执行
                        riskScore: 5,
                        logisticsTimeline: [
                          { time: new Date().toISOString().replace('T', ' ').slice(0, 16), status: '风控检验合格', desc: '人工风控人工覆核，确认收货人身份资质安全，标记为低风险放行件。' },
                          ...o.logisticsTimeline
                        ]
                      };
                    }
                    return o;
                  });
                  syncOrdersToParent(updated);
                  addLog('Order Center', '风控放行', `人工覆核并认定订单 [#${showRiskModal.id}] 安全。标记风控系数降为5%并转入发货配载队列。`, 'success');
                  setShowRiskModal(null);
                  if (selectedOrder?.id === showRiskModal.id) {
                    setSelectedOrder({
                      ...selectedOrder,
                      status: 'AI Confirmed',
                      riskScore: 5,
                      logisticsTimeline: [
                        { time: new Date().toISOString().replace('T', ' ').slice(0, 16), status: '风控检验合格', desc: '人工风控人工覆核，确认收货人身份资质安全，标记为低风险放行件。' },
                        ...selectedOrder.logisticsTimeline
                      ]
                    });
                  }
                }}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-white py-1.5 px-4 rounded-lg font-bold shadow-sm cursor-pointer"
              >
                判定为安全放行
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
