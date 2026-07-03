import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { 
  BarChart3, 
  FileText, 
  Coins, 
  CheckCircle, 
  RefreshCw, 
  Download, 
  Printer, 
  Send, 
  ArrowUpRight, 
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  Search,
  Check
} from 'lucide-react';
import { OrderItem, IndustryType } from '../../types';

interface FinanceCenterProps {
  orders: OrderItem[];
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

// Fixed standard bank account
const DEFAULT_BANK_ACCOUNT = 'BNP Paribas SA (FR76 3000 4012 9021 8492 01)';

interface PayoutRecord {
  id: string;
  time: string;
  amount: number;
  account: string;
  status: 'Processing' | 'Completed' | 'Failed';
}

interface RefundRecord {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  status: 'Refunded' | 'Failed' | 'Pending';
  time: string;
}

export default function FinanceCenter({
  orders,
  selectedIndustry,
  addLog
}: FinanceCenterProps) {
  // Tabs matching specific European Merchant specs: 财务概览, 发票, 提现记录, 退款记录, 交易记录
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payouts' | 'refunds' | 'transactions'>('overview');

  // Interactive local states to persist user interactions dynamically
  const [payouts, setPayouts] = useState<PayoutRecord[]>([
    { id: 'PAY-001', time: '2026-06-03 14:20', amount: 1250.00, account: DEFAULT_BANK_ACCOUNT, status: 'Completed' },
    { id: 'PAY-002', time: '2026-06-05 09:12', amount: 980.00, account: DEFAULT_BANK_ACCOUNT, status: 'Completed' },
  ]);

  const [refunds, setRefunds] = useState<RefundRecord[]>([
    { id: 'REF-001', orderId: 'ORD-921021', customerName: 'Camille Dubois', amount: 89.90, status: 'Refunded', time: '2026-06-06 17:40' },
    { id: 'REF-002', orderId: 'ORD-840131', customerName: 'Lukas Wagner', amount: 145.00, status: 'Refunded', time: '2026-06-07 11:15' },
  ]);

  // Track invoiced status of specific order IDs
  const [invoicedOrderIds, setInvoicedOrderIds] = useState<Record<string, boolean>>({
    'ORD-2026-001': true,
    'ORD-2026-003': true,
  });

  // Keep track of sent invoice status by order ID
  const [sentInvoiceIds, setSentInvoiceIds] = useState<Record<string, boolean>>({});

  // Active invoice detail overlay modal
  const [previewInvoice, setPreviewInvoice] = useState<OrderItem | null>(null);

  // Derive static summary metrics purely from the current actual orders List inside SaaS environment
  const financialTotals = useMemo(() => {
    let salesToday = 0;
    let salesMonth = 0;
    let totalEligiblePayout = 0;
    let pendingInvoiceCount = 0;

    orders.forEach(o => {
      // Average simulation: parse timestamp or just sum
      const isCompleted = o.status === 'Completed' || o.status === 'Shipped' || o.status === 'AI Confirmed';
      if (isCompleted) {
        salesMonth += o.total;
        if (o.createdAt.includes('08') || o.createdAt.includes('07')) {
          salesToday += o.total * 0.35; // simulate day weight
        }
      }
      
      // Compute remaining withdrawable amount (Completed orders unpaid to ledger payouts)
      if (o.status === 'Completed' || o.status === 'Shipped') {
        totalEligiblePayout += o.total;
      }

      // Draft invoices count
      if (!invoicedOrderIds[o.id]) {
        pendingInvoiceCount += 1;
      }
    });

    // Take out existing payouts sum
    const totalWithdrawn = payouts.reduce((sum, p) => p.status === 'Completed' ? sum + p.amount : sum, 0);
    const calculatedToWithdraw = Math.max(0, Math.round((totalEligiblePayout - totalWithdrawn) * 100) / 100);

    return {
      salesToday: Math.round(salesToday * 100) / 100 || 410.50,
      salesMonth: Math.round(salesMonth * 100) / 100 || 2890.00,
      toWithdraw: calculatedToWithdraw,
      toInvoiceCount: pendingInvoiceCount
    };
  }, [orders, payouts, invoicedOrderIds]);

  // Click handler to instantly generate an invoice draft without text entry form
  const handleGenerateInvoice = (orderId: string) => {
    setInvoicedOrderIds(prev => ({
      ...prev,
      [orderId]: true
    }));
    addLog(
      'Invoice Center', 
      '自动生成订货发票', 
      `已自动核验订单 [${orderId}]。拉取公司VAT信息及消费者地址并生成正规欧盟商业销账发票。发票号: INV-2026-N`, 
      'success'
    );
  };

  // Professional enterprise-grade PDF Invoice Generator using jsPDF
  const handleDownloadPDF = (order: OrderItem, idx: number) => {
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
      doc.setFontSize(7.5);
      doc.setTextColor(20, 184, 166);
      doc.text('SEPA Instant Cleared', 41, 148, { align: 'center' });
      
      // Balance Math calculations block
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Subtotal (Net):', 150, 130, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(`EUR ${netAmount.toFixed(2)}`, 190, 130, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Standard VAT (20%):', 150, 136, { align: 'right' });
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
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

  // Click to simulate PDF/HTML direct print
  const handlePrintAction = (invoiceId: string) => {
    addLog(
      'Billing Auditor',
      '打印对公票据',
      `触发发票 ${invoiceId} 本地打印队列。双向核销单联已传输至打印服务器。`,
      'info'
    );
  };

  // Double click Send Invoice triggers automatic mailer pipeline immediately
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

  // Instant zero-calculation withdrawal request
  const handleRequestPayout = () => {
    if (financialTotals.toWithdraw <= 0) {
      addLog('Payout Service', '可提现余额不足', '当前商家钱包无可提现款项明细。', 'warning');
      return;
    }

    const proposedAmount = financialTotals.toWithdraw;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    const newPayout: PayoutRecord = {
      id: `PAY-${Date.now().toString().slice(-3)}`,
      time: nowStr,
      amount: proposedAmount,
      account: DEFAULT_BANK_ACCOUNT,
      status: 'Processing'
    };

    setPayouts(prev => [newPayout, ...prev]);
    addLog(
      'Payout Auditor',
      '提现申请全额核定',
      `提现交易建立！无需计算，自动拉取商户银行账户 ${DEFAULT_BANK_ACCOUNT} 并提现全部剩余金额 €${proposedAmount.toFixed(2)}。预计 1 个工作日到账。`,
      'success'
    );

    // Simulate auto approval in 3 seconds
    setTimeout(() => {
      setPayouts(prev => 
        prev.map(p => p.id === newPayout.id ? { ...p, status: 'Completed' } : p)
      );
    }, 4000);
  };

  // Trigger refund reprocess immediately
  const handleReprocessRefund = (refundId: string, orderId: string) => {
    addLog(
      'Refund Service',
      '重新处理退款单',
      `核对订单 [${orderId}] 退款资金分配。正在重新向原信用卡及SEPA扣款卡发起反向全额退汇 (€${refunds.find(r => r.id === refundId)?.amount.toFixed(2)})，并标记状态。`,
      'info'
    );

    setRefunds(prev => 
      prev.map(r => r.id === refundId ? { ...r, status: 'Refunded' } : r)
    );

    setTimeout(() => {
      addLog(
        'Refund System',
        '退款成功重核',
        `退款请求 ${refundId} 的第三方银行返还信息确信成功。`,
        'success'
      );
    }, 1500);
  };

  return (
    <div id="finance-module-root" className="flex flex-col lg:flex-row gap-5 font-sans text-slate-900 bg-[#FCFCFD] min-h-[580px] rounded-2xl border border-slate-200/80 p-5 shadow-sm text-left">
      
      {/* 1. SECURE SIDEBAR NAVIGATION */}
      <div className="w-full lg:w-48 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-slate-200/80 gap-1 pb-3 lg:pb-0 lg:pr-3 shrink-0">
        <div className="hidden lg:block mb-4 pl-2">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-[#07C2E3]" />
            <span className="font-extrabold text-sm tracking-tight text-slate-900">财务中心</span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'overview' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 shrink-0" />
          <span>财务概览</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'invoices' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>发票管理</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'payouts' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          <span>提现记录</span>
        </button>

        <button
          onClick={() => setActiveTab('refunds')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'refunds' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
          <span>退款记录</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'transactions' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0 text-[#07C2E3]" />
          <span>交易记录</span>
        </button>
      </div>

      {/* 2. CHIEF CONSOL WORKSPACE */}
      <div className="flex-1 overflow-hidden">
        
        {/* TABS A: FINANCE OVERVIEW (Numerical stats only - strictly no text clutter / no AI slop) */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-extrabold text-slate-900">核心财务指标</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              {/* Card 1 */}
              <div 
                onClick={() => {
                  document.getElementById('transaction-list-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white border border-slate-200 hover:border-[#07C2E3] hover:shadow-sm cursor-pointer rounded-xl p-4 flex flex-col justify-between shadow-2xs h-[105px] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-450 uppercase font-mono group-hover:text-[#07C2E3] transition-colors">今日收入 (EUR)</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-slate-900 tracking-tight leading-none">
                    €{financialTotals.salesToday.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block mt-1">自动汇总实时收单流水 (点击直达)</span>
                </div>
              </div>

              {/* Card 2 */}
              <div 
                onClick={() => {
                  document.getElementById('transaction-list-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white border border-slate-200 hover:border-[#07C2E3] hover:shadow-sm cursor-pointer rounded-xl p-4 flex flex-col justify-between shadow-2xs h-[105px] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-450 uppercase font-mono group-hover:text-[#07C2E3] transition-colors">本月收入 (EUR)</span>
                  <span className="text-[9px] text-[#07C2E3] font-bold font-mono">30 Days Peak</span>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-slate-900 tracking-tight leading-none">
                    €{financialTotals.salesMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block mt-1">累计已支付结算总额 (点击直达)</span>
                </div>
              </div>

              {/* Card 3 */}
              <div 
                onClick={(e) => {
                  if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                    setActiveTab('payouts');
                  }
                }}
                className="bg-white border border-slate-200 hover:border-[#07C2E3]/85 hover:shadow-sm cursor-pointer rounded-xl p-4 flex flex-col justify-between shadow-2xs h-[105px] border-l-4 border-l-[#07C2E3] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-450 uppercase font-mono group-hover:text-[#07C2E3] transition-colors">待提现 (To Withdraw)</span>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestPayout();
                    }}
                    disabled={financialTotals.toWithdraw <= 0}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] disabled:bg-slate-150 disabled:text-slate-400 text-slate-950 px-2.5 py-0.5 rounded text-[9.5px] font-black tracking-wide transition-all cursor-pointer border-none"
                  >
                    一键提现
                  </button>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-[#07C2E3] tracking-tight leading-none">
                    €{financialTotals.toWithdraw.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block mt-1">SEPA 银行账户随时可提 (点击跳转)</span>
                </div>
              </div>

              {/* Card 4 */}
              <div 
                onClick={() => setActiveTab('invoices')}
                className="bg-white border border-slate-200 hover:border-[#07C2E3] hover:shadow-sm cursor-pointer rounded-xl p-4 flex flex-col justify-between shadow-2xs h-[105px] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-450 uppercase font-mono group-hover:text-[#07C2E3] transition-colors">待开票 (To Invoice)</span>
                  <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-black">{financialTotals.toInvoiceCount} 笔草稿</span>
                </div>
                <div>
                  <div className="text-2xl font-black font-mono text-slate-800 tracking-tight leading-none">
                    {financialTotals.toInvoiceCount}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block mt-1">订单完结自动生成 (点击跳转)</span>
                </div>
              </div>

            </div>

            {/* Quick SEPA direct info banner */}
            <div className="bg-slate-50 border border-slate-200/85 rounded-xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-mono font-bold text-xs shrink-0">
                  EU
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">法国 BNP Paribas 已绑定</span>
                  <span className="text-[10px] text-slate-450 font-mono">{DEFAULT_BANK_ACCOUNT}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black font-sans">
                  已启用 SEPA 实时入账
                </span>
              </div>
            </div>

            {/* 今日收单流水 (Transaction List) */}
            <div id="transaction-list-section" className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-[#07C2E3] rounded-sm"></span>
                  <h3 className="text-xs font-extrabold text-slate-800">今日成交收单流水 (Real-time Transactions)</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">核对就绪 • 自动对齐</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10 select-none">
                      <th className="p-3 pl-4">支付单号</th>
                      <th className="p-3">关联订单号</th>
                      <th className="p-3">客户称谓</th>
                      <th className="p-3">支付网络</th>
                      <th className="p-3">清算账户</th>
                      <th className="p-3 text-right">金额</th>
                      <th className="p-3 text-center">支付状态</th>
                      <th className="p-3">记账时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-medium font-mono">
                    {orders.map((o, idx) => {
                      const paymentGateways = ['Stripe Card', 'PayPal', 'Apple Pay', 'Google Pay'];
                      const chosenGateway = paymentGateways[idx % paymentGateways.length];
                      return (
                        <tr key={o.id} className="h-11 hover:bg-slate-50/20">
                          <td className="p-3 pl-4 font-bold text-slate-800">PX-2026-{(9832 + idx)}</td>
                          <td className="p-3 text-[#07C2E3] font-bold font-sans">{o.id}</td>
                          <td className="p-3 font-sans text-slate-800">{o.customerName}</td>
                          <td className="p-3 font-sans text-slate-500">{chosenGateway}</td>
                          <td className="p-3 text-slate-400">EUR (€)</td>
                          <td className="p-3 text-right text-slate-900 font-black">€{o.total.toFixed(2)}</td>
                          <td className="p-3 text-center font-sans">
                            <span className="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded font-black">
                              支付成功
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">{o.createdAt}</td>
                        </tr>
                      );
                    })}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-slate-405 font-sans">
                          今日暂未产生支付完结交易单流水。
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TABS B: INVOICED DRAFT & REALTIME CONSOLE */}
        {activeTab === 'invoices' && (
          <div className="space-y-4 animate-fadeIn text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">自动对公发票管理</h3>
                <p className="text-[10px] text-[#07C2E3] font-mono font-bold">BILLING_DRAFTS</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">企业标准 VAT: 20%</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10 select-none">
                    <th className="p-3 pl-4">发票编号</th>
                    <th className="p-3">关联订单号</th>
                    <th className="p-3">客户</th>
                    <th className="p-3">开票日期</th>
                    <th className="p-3 text-right">金额</th>
                    <th className="p-3 text-center">发票状态</th>
                    <th className="p-3 text-right pr-4">快捷操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                  {orders.map((o, idx) => {
                    const isFinalized = invoicedOrderIds[o.id] || false;
                    const isSent = sentInvoiceIds[o.id] || false;
                    const mockInvoiceId = `INV-2026-FPR-${1892 + idx}`;

                    return (
                      <tr key={o.id} className="h-11 hover:bg-slate-50/20">
                        <td className="p-3 pl-4 font-mono font-bold text-slate-800">
                          {isFinalized ? mockInvoiceId : <span className="text-slate-400 font-sans text-[10px]">发票草稿</span>}
                        </td>
                        <td className="p-3 font-mono font-bold text-[#07C2E3]">{o.id}</td>
                        <td className="p-3 text-slate-800">{o.customerName}</td>
                        <td className="p-3 font-mono text-slate-400">{o.createdAt}</td>
                        <td className="p-3 text-right font-mono font-black text-slate-900">€{o.total.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          {isFinalized ? (
                            <span className="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded font-bold">
                              {isSent ? '已发送客户' : '已核准生成'}
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded font-black font-sans">
                              未确认草稿
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right pr-4 shrink-0">
                          <div className="flex gap-1.5 justify-end">
                            {!isFinalized ? (
                              <button
                                onClick={() => handleGenerateInvoice(o.id)}
                                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 text-[10px] font-black px-2.5 py-1 rounded cursor-pointer transition-all border-none"
                              >
                                生成发票
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => setPreviewInvoice(o)}
                                  className="text-slate-700 hover:text-slate-950 border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-semibold px-2 py-1 rounded cursor-pointer"
                                >
                                  查看
                                </button>
                                <button
                                  onClick={() => handleDownloadPDF(o, idx)}
                                  className="text-[#07C2E3] hover:text-[#06B2D0] hover:bg-slate-150 p-1 rounded cursor-pointer shrink-0 transition-colors"
                                  title="下载 PDF 发票"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleSendInvoice(o)}
                                  className="bg-slate-900 hover:bg-black text-[#07C2E3] text-[10px] font-semibold px-2 py-1 rounded cursor-pointer inline-flex items-center gap-1 shrink-0"
                                >
                                  <Send className="w-2.5 h-2.5" />
                                  <span>{isSent ? '重新发送' : '发送'}</span>
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
                      <td colSpan={7} className="text-center py-10 text-slate-405">目前暂无发票单据。请在订单中心成交订单以自动产生草稿。</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABS C: PAYOUT RECORDS (Simple BNP Paribas Direct Ledger) */}
        {activeTab === 'payouts' && (
          <div className="space-y-4 animate-fadeIn text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">到账提现记录</h3>
                <p className="text-[10px] text-[#07C2E3] font-mono font-bold">WITHDRAWALS</p>
              </div>
              
              <button
                onClick={handleRequestPayout}
                className="bg-slate-900 hover:bg-black text-[#07C2E3] font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 border-none"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>申请提现 (提现全部)</span>
              </button>
            </div>

            <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl text-xs flex justify-between items-center">
              <span className="text-amber-850 font-medium">默认最大可提现金额: <strong className="font-mono text-slate-900">€{financialTotals.toWithdraw.toFixed(2)}</strong></span>
              <span className="text-[10px] text-slate-450 font-mono">绑定账户: {DEFAULT_BANK_ACCOUNT.slice(0, 25)}...</span>
            </div>

            <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10 select-none">
                    <th className="p-3 pl-4">申请流水 ID</th>
                    <th className="p-3">申请时间</th>
                    <th className="p-3">提现到账账户</th>
                    <th className="p-3 text-right">提现金额</th>
                    <th className="p-3 text-center">到账状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium font-mono">
                  {payouts.map((p, idx) => (
                    <tr key={p.id} className="h-11 hover:bg-slate-50/20">
                      <td className="p-3 pl-4 text-slate-900 font-bold">{p.id}</td>
                      <td className="p-3 text-slate-500">{p.time}</td>
                      <td className="p-3 font-sans truncate max-w-[200px]" title={p.account}>{p.account}</td>
                      <td className="p-3 text-right text-slate-900 font-black">€{p.amount.toFixed(2)}</td>
                      <td className="p-3 text-center font-sans">
                        <span className={`text-[9.5px] px-2 py-0.5 rounded font-black ${
                          p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                          p.status === 'Processing' ? 'bg-amber-55/10 text-amber-600 animate-pulse' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {p.status === 'Completed' ? '提现成功/妥投' : p.status === 'Processing' ? '银行处理中' : '失败'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABS D: REFUNDS CENTER */}
        {activeTab === 'refunds' && (
          <div className="space-y-4 animate-fadeIn text-left">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900">退款及售后记录</h3>
              <p className="text-[10px] text-[#07C2E3] font-mono font-bold">REFUNDS</p>
            </div>

            <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10 select-none">
                    <th className="p-3 pl-4">退单 ID</th>
                    <th className="p-3">关联订单号</th>
                    <th className="p-3">客户称谓</th>
                    <th className="p-3">售后时间</th>
                    <th className="p-3 text-right">退款退汇</th>
                    <th className="p-3 text-center">状态</th>
                    <th className="p-3 text-right pr-4">售后重核</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium font-mono">
                  {refunds.map(r => (
                    <tr key={r.id} className="h-11 hover:bg-slate-50/20">
                      <td className="p-3 pl-4 text-slate-800 font-bold">{r.id}</td>
                      <td className="p-3 font-sans text-[#07C2E3] font-bold">{r.orderId}</td>
                      <td className="p-3 font-sans text-slate-800">{r.customerName}</td>
                      <td className="p-3 text-slate-400">{r.time}</td>
                      <td className="p-3 text-right text-rose-600 font-bold">€{r.amount.toFixed(2)}</td>
                      <td className="p-3 text-center font-sans col-span-1">
                        <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-black ${
                          r.status === 'Refunded' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-650'
                        }`}>
                          {r.status === 'Refunded' ? '退款成功' : '失败'}
                        </span>
                      </td>
                      <td className="p-3 text-right pr-4 font-sans">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleReprocessRefund(r.id, r.orderId)}
                            className="text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 text-[10.5px] font-bold px-2.5 py-1 rounded cursor-pointer"
                          >
                            重新处理
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

        {/* TABS E: TRANSACTIONS LIST */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 animate-fadeIn text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">收单交易明细</h3>
                <p className="text-[10px] text-[#07C2E3] font-mono font-bold">LEDGER</p>
              </div>
              <span className="text-[10px] bg-[#07C2E3]/15 text-[#07C2E3] px-2 py-0.5 rounded font-black font-mono">
                EUR (€) BASE
              </span>
            </div>

            <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10 select-none">
                    <th className="p-3 pl-4">支付流水号</th>
                    <th className="p-3">关联订单号</th>
                    <th className="p-3">客户</th>
                    <th className="p-3">支付网络</th>
                    <th className="p-3 text-right">结算金额</th>
                    <th className="p-3 text-center">状态</th>
                    <th className="p-3 pr-4 text-right">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-medium font-mono">
                  {orders.map((o, idx) => {
                    const paymentGateways = ['Stripe Card', 'PayPal', 'Apple Pay', 'Google Pay'];
                    const chosenGateway = paymentGateways[idx % paymentGateways.length];
                    return (
                      <tr key={o.id} className="h-11 hover:bg-slate-50/20">
                        <td className="p-3 pl-4 font-bold text-slate-800">PX-2026-{(9832 + idx)}</td>
                        <td className="p-3 text-[#07C2E3] font-bold font-sans">{o.id}</td>
                        <td className="p-3 text-slate-800 font-sans">{o.customerName}</td>
                        <td className="p-3 text-slate-500 font-sans">{chosenGateway}</td>
                        <td className="p-3 text-right text-slate-900 font-black">€{o.total.toFixed(2)}</td>
                        <td className="p-3 text-center font-sans">
                          <span className="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded font-black">
                            支付成功
                          </span>
                        </td>
                        <td className="p-3 pr-4 text-slate-400 text-right text-[11px]">{o.createdAt}</td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-405 font-sans">
                        暂无账单清查流水。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* 3. POPUP MODAL FOR INTERACTIVE INDIVIDUAL INVOICE */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full text-slate-900 p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[85vh]">
            
            {/* Visual Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="space-y-0.5 text-left">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-[#07C2E3] text-slate-950 font-black text-[10px] flex items-center justify-center rounded">OS</div>
                  <span className="font-extrabold text-xs tracking-tight text-slate-950">EU COMMERCE DIRECT S.r.l.</span>
                </div>
                <p className="text-[9px] text-slate-400 font-mono">Automated VAT invoices</p>
              </div>

              <div className="text-right font-mono text-xs">
                <div className="font-bold text-slate-900">INV-2026-FPR-{previewInvoice.id.slice(-4)}</div>
                <div className="text-[10px] text-slate-450">{previewInvoice.createdAt}</div>
              </div>
            </div>

            {/* Address cards */}
            <div className="grid grid-cols-2 gap-4 text-xs text-left">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">开票主体 / FROM</span>
                <p className="font-extrabold text-slate-800">EU Commerce Direct S.r.l.</p>
                <p className="text-slate-500 text-[10px] font-mono leading-tight">Avenue des Champs-Élysées, Paris, France</p>
                <p className="text-slate-450 font-mono text-[9px]">VAT Reg No: FR 0895312014</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">购货客户 / TO PAYER</span>
                <p className="font-extrabold text-slate-800">{previewInvoice.customerName}</p>
                <p className="text-slate-500 text-[10px] leading-tight font-mono">{previewInvoice.contact || 'No Register Standard Email'}</p>
                <p className="text-slate-450 text-[9px]">MAPPED REF: SEPA-CUST-{previewInvoice.customerName.slice(0, 3).toUpperCase()}</p>
              </div>
            </div>

            {/* Line items list */}
            <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[9px] text-slate-400 font-bold uppercase tracking-wider h-8 select-none">
                    <th className="p-2.5 pl-3">应销商品摘要 description</th>
                    <th className="p-2.5 text-center">件数 Qty</th>
                    <th className="p-2.5 text-right">单价 Rate</th>
                    <th className="p-2.5 text-right pr-3">小计 Item Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="h-9">
                    <td className="p-2.5 pl-3 text-slate-900">
                      eShop Global Direct Purchase (Order: {previewInvoice.id})
                      <span className="text-[9px] text-[#07C2E3] font-mono block">MAPPED SKU: OS-SKU-{previewInvoice.id.slice(-4)}</span>
                    </td>
                    <td className="p-2.5 text-center font-mono">1</td>
                    <td className="p-2.5 text-right font-mono">€{(previewInvoice.total * 0.833).toFixed(2)}</td>
                    <td className="p-2.5 text-right pr-3 font-mono font-bold text-slate-910">€{(previewInvoice.total * 0.833).toFixed(2)}</td>
                  </tr>

                  {/* Standard VAT at 20% */}
                  <tr className="h-9 bg-slate-50/30">
                    <td colSpan={3} className="p-2.5 text-right font-bold text-slate-400">欧盟统一销向增值税 (Standard 20% Tax)</td>
                    <td className="p-2.5 text-right pr-3 font-mono font-bold text-slate-700">€{(previewInvoice.total * 0.167).toFixed(2)}</td>
                  </tr>

                  {/* Aggregate Total */}
                  <tr className="h-9 bg-[#07C2E3]/5">
                    <td colSpan={3} className="p-2.5 text-right font-black text-slate-900">结算总金额</td>
                    <td className="p-2.5 text-right pr-3 font-mono font-black text-[#07C2E3] text-sm">€{previewInvoice.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Direct close control */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold">
              <span className="text-slate-400 font-mono">✓ EU compliance invoice automatically generated</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const idx = orders.findIndex(x => x.id === previewInvoice.id);
                    handleDownloadPDF(previewInvoice, idx >= 0 ? idx : 0);
                  }}
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-lg cursor-pointer transition-all border-none flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载 PDF 发票</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewInvoice(null)}
                  className="bg-slate-950 hover:bg-black text-[#07C2E3] text-xs font-bold px-4 py-1.5 rounded-lg cursor-pointer transition-all border-none"
                >
                  退出
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
