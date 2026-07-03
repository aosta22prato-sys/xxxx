import React, { useState, useMemo } from 'react';
import { 
  Coins, 
  Search, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  CreditCard, 
  DollarSign, 
  RefreshCcw, 
  Wallet, 
  Link2, 
  Clock,
  ChevronRight,
  QrCode,
  Check,
  AlertCircle,
  TrendingUp,
  Sliders,
  Sparkles
} from 'lucide-react';
import { OrderItem, IndustryType } from '../../types';

interface PaymentCenterProps {
  orders: OrderItem[];
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  onUpdateOrders: (updated: OrderItem[]) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  provider: string;
  supportedCurrencies: string[];
  status: 'connected' | 'disconnected' | 'abnormal';
  logoPlaceholder: string;
}

interface PayoutRecord {
  id: string;
  requestedAt: string;
  currency: string;
  amount: number;
  status: 'Processing' | 'Completed' | 'Failed';
  completedAt: string;
  recipientAccount: string;
}

export default function PaymentCenter({
  orders,
  selectedIndustry,
  addLog,
  onUpdateOrders
}: PaymentCenterProps) {
  
  // Left side-menu tabs aligned with Shopify Payments
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'methods' | 'wallet' | 'payouts' | 'refunds'>('overview');

  // Query conditions and search inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState<string>('all');

  // Unified payment gateways list state (as requested, Stripe, PayPal, Apple Pay, Google Pay, Bank Card, USDC Base)
  const [gateways, setGateways] = useState<PaymentMethod[]>([
    { id: 'stripe', name: 'Stripe Payments', provider: 'Stripe Direct Connect', supportedCurrencies: ['EUR', 'USD', 'GBP'], status: 'connected', logoPlaceholder: 'S' },
    { id: 'paypal', name: 'PayPal Integration', provider: 'PayPal Checkout', supportedCurrencies: ['EUR', 'USD'], status: 'connected', logoPlaceholder: 'P' },
    { id: 'applepay', name: 'Apple Pay Gateway', provider: 'Apple Wallet Engine', supportedCurrencies: ['EUR', 'USD'], status: 'connected', logoPlaceholder: 'A' },
    { id: 'googlepay', name: 'Google Pay Gateway', provider: 'Android Instant Billing', supportedCurrencies: ['EUR', 'USD'], status: 'disconnected', logoPlaceholder: 'G' },
    { id: 'bankcard', name: 'Bank Card Cardholder direct', provider: 'Europay MasterCard VISA', supportedCurrencies: ['EUR'], status: 'connected', logoPlaceholder: 'C' },
    { id: 'usdc', name: 'USDC Ledger (Base Network)', provider: 'Base EVM Gateway', supportedCurrencies: ['USDC'], status: 'connected', logoPlaceholder: 'U' },
  ]);

  // Clean payout ledger (payouts)
  const [payouts, setPayouts] = useState<PayoutRecord[]>([
    { id: 'PAY-2026102a', requestedAt: '2026-06-03 10:14', currency: 'EUR', amount: 5000.00, status: 'Completed', completedAt: '2026-06-04 12:00', recipientAccount: 'BNP Paribas (对公卡 *7290)' },
    { id: 'PAY-2026105b', requestedAt: '2026-06-07 15:30', currency: 'EUR', amount: 3280.00, status: 'Processing', completedAt: '--', recipientAccount: 'BNP Paribas (对公卡 *7290)' }
  ]);

  // Withdraw flow parameters
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawTargetAccount, setWithdrawTargetAccount] = useState('BNP Paribas 对公结算卡 (*7290)');
  const [withdrawCurrency, setWithdrawCurrency] = useState('EUR');

  // Unified configuration drawer modal
  const [drawerGatewayId, setDrawerGatewayId] = useState<string | null>(null);

  // Focus refund auditor item
  const [selectedRefundOrder, setSelectedRefundOrder] = useState<OrderItem | null>(null);

  // Web3 terminal simulator
  const [usdcSimulator, setUsdcSimulator] = useState<{
    orderId: string;
    amountUsdc: number;
    address: string;
    hash: string;
    stage: 'idle' | 'scanning' | 'verifying' | 'done';
  } | null>(null);

  // Mapping direct order schema array to real payment ledger items
  const paymentOrders = useMemo(() => {
    return orders.map((o, index) => {
      let payState: '待支付' | '支付成功' | '退款中' | '已退款' = '支付成功';
      if (o.status === 'Pending') payState = '待支付';
      else if (o.status === 'Refund Requested') payState = '退款中';
      else if (o.status === 'Refunded') payState = '已退款';

      // Gateway assignments
      const gatewayMapping = ['Stripe', 'PayPal', 'Apple Pay', 'Bank Card'];
      let chosenMethod = gatewayMapping[index % gatewayMapping.length];

      if (o.id === usdcSimulator?.orderId && usdcSimulator.stage === 'done') {
        chosenMethod = 'USDC (Base)';
      }

      return {
        id: `TX-${1200 + index}`,
        orderId: o.id,
        customer: o.customerName,
        method: chosenMethod,
        currency: 'EUR',
        amount: o.total,
        status: payState,
        createdAt: o.createdAt,
        raw: o
      };
    });
  }, [orders, usdcSimulator]);

  // Derived financials (todaySales, pendingSettlement, withdrawable, totalRefunded, monthlyIncome)
  const aggregates = useMemo(() => {
    let todaySales = 0;
    let pendingSettlement = 0;
    let totalRefunded = 0;
    let txCount = 0;

    paymentOrders.forEach(p => {
      if (p.status === '支付成功') {
        todaySales += p.amount;
        txCount += 1;
      } else if (p.status === '待支付') {
        pendingSettlement += p.amount;
      } else if (p.status === '已退款') {
        totalRefunded += p.amount;
      } else if (p.status === '退款中') {
        totalRefunded += p.amount; // Hold as reserve
      }
    });

    // Elegant withdrawable reserve hold subtraction to mock premium Shopify payout rules
    const withdrawable = Math.max(0, todaySales - totalRefunded - 422);

    return {
      todaySales,
      pendingSettlement,
      withdrawable,
      totalRefunded,
      txCount
    };
  }, [paymentOrders]);

  // Filter transaction rows
  const filteredOrders = useMemo(() => {
    return paymentOrders.filter(row => {
      const matchQuery = row.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         row.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         row.id.toLowerCase().includes(searchQuery.toLowerCase());
      if (selectedMethodFilter === 'all') return matchQuery;
      return matchQuery && row.method.toLowerCase().includes(selectedMethodFilter.toLowerCase());
    });
  }, [paymentOrders, searchQuery, selectedMethodFilter]);

  // Refund requested orders query
  const refundRequestedOrders = useMemo(() => {
    return orders.filter(o => o.status === 'Refund Requested');
  }, [orders]);

  // Actions
  const handleToggleGateway = (id: string) => {
    setGateways(prev => prev.map(g => {
      if (g.id === id) {
        const nextStatus = g.status === 'connected' ? 'disconnected' : 'connected';
        addLog(
          'Financial Hub',
          nextStatus === 'connected' ? '开通网关连接' : '关闭网关服务',
          `商户已成功配置并在生产服务器将网关 [${g.name}] 调整至: ${nextStatus === 'connected' ? '生产授信' : '停止运营'}`,
          nextStatus === 'connected' ? 'success' : 'warning'
        );
        return { ...g, status: nextStatus };
      }
      return g;
    }));
  };

  const handleTestGateway = (name: string) => {
    addLog(
      'Payment Sandbox',
      '网关接口联通测试',
      `Stripe/Direct API 发起 3D-Secure 模拟握手，测试服务器响应延迟 12ms。通道通畅。`,
      'success'
    );
  };

  const handleApplyPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = parseFloat(withdrawAmount);
    if (isNaN(sum) || sum <= 0) {
      addLog('Finance Engine', '提现拒绝', '请填写格式合法的汇出面额。', 'error');
      return;
    }
    if (sum > aggregates.withdrawable) {
      addLog('Finance Engine', '超额变现受阻', '申请汇出金额超出今日可用余额。', 'warning');
      return;
    }

    const newPayout: PayoutRecord = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      requestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      currency: withdrawCurrency,
      amount: sum,
      status: 'Processing',
      completedAt: '--',
      recipientAccount: withdrawTargetAccount
    };

    setPayouts(prev => [newPayout, ...prev]);
    setWithdrawAmount('');
    addLog(
      'Payout Gateway',
      '提现凭证归档',
      `提现申请 €${sum.toFixed(2)} 已递交审核。预计下个结算周期自动打款到对公卡中。`,
      'success'
    );
  };

  const handleConfirmRefundSubmit = (order: OrderItem, approved: boolean) => {
    const nextStatus = approved ? 'Refunded' : 'AI Confirmed';
    const updated = orders.map(o => {
      if (o.id === order.id) {
        return { ...o, status: nextStatus as any };
      }
      return o;
    });
    onUpdateOrders(updated);
    setSelectedRefundOrder(null);

    if (approved) {
      addLog('Refund Engine', '核准打款原路退回', `已批准订单 ${order.id} 的全额退款 (€${order.total.toFixed(2)})，额度自动借记扣划完毕。`, 'success');
    } else {
      addLog('Refund Engine', '驳回退款请求', `订单 ${order.id} 退款申诉被业务员驳回。状态恢复至妥投妥存。`, 'warning');
    }
  };

  // Launch the USDC web3 checkout interface
  const handleLaunchUsdcCheckoutSim = (order: OrderItem) => {
    setActiveTab('methods');
    setUsdcSimulator({
      orderId: order.id,
      amountUsdc: order.total * 1.08, // simple conversion peg with base rate stable premium
      address: '0x3bB8a469a7c3A47c21f0ce5169aAF7c6807C2E3',
      hash: '',
      stage: 'scanning'
    });
    addLog('Base Link', '调起 Base 网络收款', `检测到订单 ${order.id} 转入 Base 支付流模拟`, 'info');
  };

  // Run the quick simulation
  const handleMockChainTransaction = () => {
    if (!usdcSimulator) return;
    setUsdcSimulator(p => p ? { ...p, stage: 'verifying' } : null);

    setTimeout(() => {
      const liveHash = `0x27c81534b8ef9300ee79d39ca21f0ce5169aAF7c68s29a_${Math.floor(Math.random() * 9999)}`;
      setUsdcSimulator(p => p ? { ...p, stage: 'done', hash: liveHash } : null);

      // Mutate status to transaction locked success
      const updated = orders.map(o => {
        if (o.id === usdcSimulator.orderId) {
          return { ...o, status: 'AI Confirmed' as any };
        }
        return o;
      });
      onUpdateOrders(updated);

      addLog('Base Node Consensus', 'EVM 链上转账完成', `订单 ${usdcSimulator.orderId} 收单成功，已捕获交易 Hash: ${liveHash.slice(0, 16)}...`, 'success');
    }, 1200);
  };

  return (
    <div id="finance-center-merchant-console" className="flex flex-col lg:flex-row gap-5 font-sans text-slate-900 bg-[#FCFCFD] min-h-[640px] rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      
      {/* SIDEBAR NAVIGATION - INHERITING PREMIUM SHOPIFY PRINCIPLE */}
      <div className="w-full lg:w-56 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-slate-200/80 gap-1 pb-3 lg:pb-0 lg:pr-4 shrink-0">
        <div className="hidden lg:block mb-4 pl-3">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#07C2E3]" />
            <span className="font-extrabold text-sm tracking-tight text-slate-900">支付中心 (Payments)</span>
          </div>
          <p className="text-[10px] text-[#07C2E3] font-mono mt-0.5 font-bold uppercase">STRIPE_CORE</p>
        </div>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'overview' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span>支付概览 (Overview)</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'orders' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>支付订单 (Transactions)</span>
        </button>

        <button
          onClick={() => setActiveTab('methods')}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'methods' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Link2 className="w-3.5 h-3.5 shrink-0" />
          <span>支付方式 (Gateways)</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'wallet' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <Wallet className="w-3.5 h-3.5 shrink-0" />
          <span>商户钱包 (Wallet)</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 ${
            activeTab === 'payouts' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          <span>提现记录 (Payout Ledger)</span>
        </button>

        <button
          onClick={() => setActiveTab('refunds')}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all text-left truncate cursor-pointer select-none shrink-0 relative ${
            activeTab === 'refunds' ? 'bg-[#07C2E3]/10 text-[#07C2E3]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          <RefreshCcw className="w-3.5 h-3.5 shrink-0" />
          <span>退款管理 (Refunds)</span>
          {refundRequestedOrders.length > 0 && (
            <span className="absolute right-2 top-2.5 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {/* DETAILED WORKSPACE CANVAS */}
      <div className="flex-1 space-y-6">
        
        {/* VIEW 1: PAYMENTS OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Real Stats Metrics according to Stripe rules */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              
              {/* Row 1 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-b border-slate-100">
                <div className="p-6 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">今日收款 (Today's Collections)</span>
                  <div className="text-3xl font-extrabold text-[#07C2E3] font-mono tracking-tight">
                    €{aggregates.todaySales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <span>✓ 资金流稳定入库 </span>
                    <span className="text-slate-400"> (共计 {aggregates.txCount} 笔结算单)</span>
                  </div>
                </div>

                <div className="p-6 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">待结算金额 (Pending Settlement)</span>
                  <div className="text-3xl font-extrabold text-slate-800 font-mono tracking-tight">
                    €{aggregates.pendingSettlement.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-amber-500 font-semibold block">● 清盘周期正常：预计下一个结算工作日派发</span>
                </div>
              </div>

              {/* Row 2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-6 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">可提现余额 (Withdrawable Balance)</span>
                  <div className="text-2xl font-bold text-slate-900 font-mono">
                    €{aggregates.withdrawable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div>
                    <button
                      onClick={() => setActiveTab('wallet')}
                      className="bg-slate-900 hover:bg-black text-[#07C2E3] text-[10px] font-bold px-3 py-1.5 rounded transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>去结算提现</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">退款总额 (Refunded Amount)</span>
                  <div className="text-2xl font-bold text-slate-500 font-mono">
                    €{aggregates.totalRefunded.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div>
                    <button
                      onClick={() => setActiveTab('refunds')}
                      className="text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white text-[10px] font-semibold px-2.5 py-1.5 rounded transition-all cursor-pointer"
                    >
                      <span>审核退款记录</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Custom SVG Performance Graph */}
            <div className="border border-slate-250 bg-white shadow-xs rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs text-slate-800">7 天收单清算趋势图</h3>
                  <p className="text-[9px] text-slate-400 font-mono">Active Settlement rate log tracking</p>
                </div>
                <div className="flex bg-slate-100 p-0.5 rounded text-[10px] font-semibold text-slate-600">
                  <span className="bg-white px-2 py-0.5 rounded shadow-xs text-[#07C2E3]">EUR（即时到账）</span>
                </div>
              </div>

              <div className="w-full h-36 bg-slate-50/50 rounded-lg p-2 relative flex items-center justify-center">
                <svg viewBox="0 0 700 120" className="w-full h-full">
                  <defs>
                    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#07C2E3" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#07C2E3" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="700" y2="20" stroke="#F1F5F9" strokeWidth={1} />
                  <line x1="0" y1="60" x2="700" y2="60" stroke="#F1F5F9" strokeWidth={1} />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#F1F5F9" strokeWidth={1} />

                  {/* Gradient Area */}
                  <path 
                    d="M 50 110 L 150 75 L 250 90 L 350 50 L 450 68 L 550 30 L 650 40 L 650 110 Z" 
                    fill="url(#glow)" 
                  />

                  {/* Line Stroke */}
                  <path 
                    d="M 50 110 L 150 75 L 250 90 L 350 50 L 450 68 L 550 30 L 650 40" 
                    fill="none" 
                    stroke="#07C2E3" 
                    strokeWidth={2.5} 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Nodes */}
                  <circle cx={50} cy={110} r={3.5} fill="#FFF" stroke="#07C2E3" strokeWidth={2} />
                  <circle cx={150} cy={75} r={3.5} fill="#FFF" stroke="#07C2E3" strokeWidth={2} />
                  <circle cx={250} cy={90} r={3.5} fill="#FFF" stroke="#07C2E3" strokeWidth={2} />
                  <circle cx={350} cy={50} r={3.5} fill="#FFF" stroke="#07C2E3" strokeWidth={2} />
                  <circle cx={450} cy={68} r={3.5} fill="#FFF" stroke="#07C2E3" strokeWidth={2} />
                  <circle cx={550} cy={30} r={3.5} fill="#FFF" stroke="#07C2E3" strokeWidth={2} />
                  <circle cx={650} cy={40} r={4.5} fill="#07C2E3" stroke="#FFF" strokeWidth={2} />

                  {/* Dates */}
                  <text x={40} y={118} fontSize="8" className="font-mono fill-slate-400">06-02</text>
                  <text x={140} y={118} fontSize="8" className="font-mono fill-slate-400">06-03</text>
                  <text x={240} y={118} fontSize="8" className="font-mono fill-slate-400">06-04</text>
                  <text x={340} y={118} fontSize="8" className="font-mono fill-slate-400">06-05</text>
                  <text x={440} y={118} fontSize="8" className="font-mono fill-slate-400">06-06</text>
                  <text x={540} y={118} fontSize="8" className="font-mono fill-slate-400">06-07</text>
                  <text x={630} y={118} fontSize="8" className="font-mono fill-slate-500 font-bold">今天 (06-08)</text>
                </svg>
              </div>
            </div>

            {/* Quick Gateways state check lists */}
            <div className="border border-slate-200 bg-white rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                <span className="font-bold text-xs text-slate-800 tracking-wider">网关快捷连接状态</span>
                <span className="text-[10px] text-slate-400 font-mono">Europe SEPA Merchant Channels</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {gateways.map(g => (
                  <div key={g.id} className="border border-slate-150 rounded-xl p-3.5 bg-slate-50/50 flex flex-col justify-between hover:shadow-2xs transition-all min-h-[90px]">
                    <div className="flex justify-between items-center">
                      <div className="w-6 h-6 rounded bg-[#07C2E3]/15 text-[#07C2E3] font-bold text-xs flex items-center justify-center">
                        {g.logoPlaceholder}
                      </div>
                      <span className={`w-1.5 h-1.5 rounded-full ${g.status === 'connected' ? 'bg-[#07C2E3]' : 'bg-slate-300'}`} />
                    </div>
                    <div className="mt-3">
                      <span className="font-bold text-xs text-slate-800 block truncate leading-tight" title={g.name}>{g.name.split(' ')[0]}</span>
                      <span className={`text-[8px] font-bold tracking-wider block mt-1 uppercase ${g.status === 'connected' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {g.status === 'connected' ? '已激活' : '已断开'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Payments rows */}
            <div className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <span className="font-bold text-xs text-slate-800">最近完成收单订单</span>
                <button onClick={() => setActiveTab('orders')} className="text-[10px] text-[#07C2E3] font-bold hover:underline">查看全部 &rarr;</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-widest h-9 select-none">
                      <th className="p-3 pl-4">交易单号</th>
                      <th className="p-3">支付通道</th>
                      <th className="p-3 text-right">结算面额</th>
                      <th className="p-3 text-center">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                    {paymentOrders.slice(0, 4).map(p => (
                      <tr key={p.id} className="h-10 hover:bg-slate-50/20">
                        <td className="p-3 pl-4 font-mono font-bold text-slate-800">{p.orderId}</td>
                        <td className="p-3">{p.method}</td>
                        <td className="p-3 text-right font-mono font-extrabold text-slate-900">€{p.amount.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                            p.status === '支付成功' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                            p.status === '待支付' ? 'bg-amber-50 border-amber-200 text-amber-500' :
                            'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: TRANSACTIONS LIST */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-150 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">支付订单 (Transactions)</h3>
                <p className="text-[10px] text-[#07C2E3] font-mono font-bold uppercase">ORDER_FLOW</p>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜订单号/客户姓名"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-44 bg-white border border-slate-200 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-800 font-medium font-mono"
                  />
                </div>

                <select
                  value={selectedMethodFilter}
                  onChange={(e) => setSelectedMethodFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs font-semibold text-slate-700"
                >
                  <option value="all">所有支付方式</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="apple">Apple Pay</option>
                  <option value="bank">银行卡</option>
                  <option value="usdc">USDC</option>
                </select>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-11 select-none">
                    <th className="p-3 pl-4">支付单号</th>
                    <th className="p-3">订单号</th>
                    <th className="p-3">客户</th>
                    <th className="p-3">支付方式</th>
                    <th className="p-3 text-right">金额</th>
                    <th className="p-3 text-center">支付状态</th>
                    <th className="p-3 text-right pr-4">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">没有查找到相符的账单流水</td>
                    </tr>
                  ) : (
                    filteredOrders.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/30 h-11 transition-colors">
                        <td className="p-3 pl-4 font-mono font-bold text-slate-800">{p.id}</td>
                        <td className="p-3 font-mono font-bold text-[#07C2E3]">{p.orderId}</td>
                        <td className="p-3 font-semibold">{p.customer}</td>
                        <td className="p-3">{p.method}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">€{p.amount.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                            p.status === '支付成功' ? 'bg-emerald-50 border-emerald-250 text-emerald-600' :
                            p.status === '待支付' ? 'bg-amber-50 border-amber-250 text-amber-500' :
                            p.status === '退款中' ? 'bg-rose-50 border-rose-250 text-rose-500' :
                            'bg-slate-100 border-slate-250 text-slate-500'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right pr-4">
                          <div className="flex gap-1.5 justify-end">
                            {p.status === '待支付' && (
                              <button
                                onClick={() => handleLaunchUsdcCheckoutSim(p.raw)}
                                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-bold text-[9px] px-2 py-1 rounded transition-all cursor-pointer inline-flex items-center gap-0.5"
                              >
                                <span>模拟USDC收账</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (p.status === '退款中') {
                                  setSelectedRefundOrder(p.raw);
                                  setActiveTab('refunds');
                                } else {
                                  addLog('Auditor Panel', '交易明细归档', `已核验此订单 [${p.orderId}]，流水凭证妥存，结算成功。`, 'info');
                                }
                              }}
                              className="bg-slate-900 hover:bg-black text-[#07C2E3] font-bold text-[9px] px-2.5 py-1 rounded transition-all cursor-pointer"
                            >
                              {p.status === '退款中' ? '立即审核' : '查看记录'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* VIEW 3: PAYMENT METHODS / GATEWAYS AREA (Stripe, Paypal, Apple Pay, Google Pay, Bank Card, USDC (Base)) */}
        {activeTab === 'methods' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm">支付接口及收单渠道配置 (Gateways)</h3>
              <p className="text-[10px] text-[#07C2E3] font-mono font-bold uppercase">GATEWAYS</p>
            </div>

            {/* Custom integrated top warning banner if usdc simulation is loaded */}
            {usdcSimulator && (
              <div className="bg-slate-950 text-white p-5 rounded-xl border border-slate-800 space-y-3 shadow-md animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#07C2E3]" />
                    <span className="font-mono text-xs font-black text-rose-400">【Web3 专属对账模拟终端】 正在对接订单 {usdcSimulator.orderId}</span>
                  </div>
                  <button 
                    onClick={() => setUsdcSimulator(null)} 
                    className="text-slate-400 hover:text-white text-xs font-bold leading-none cursor-pointer"
                  >
                    关闭
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <p className="text-slate-400">发票参考: {usdcSimulator.orderId}</p>
                    <p className="text-slate-400">应付折算: <span className="text-white font-black">{usdcSimulator.amountUsdc.toFixed(2)} USDC</span></p>
                    <div className="bg-slate-900 p-2 rounded text-[10px] text-emerald-400 truncate">
                      商户钱包: {usdcSimulator.address}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-2 text-center">
                    {usdcSimulator.stage === 'scanning' && (
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-300">已生成 Base 二层公链接收智能二维码，等待链上共识广播</p>
                        <button
                          onClick={handleMockChainTransaction}
                          className="bg-[#07C2E3] text-slate-950 font-bold px-3 py-1 rounded hover:bg-[#06B2D0] transition-all text-[10px] cursor-pointer"
                        >
                          模拟发出 0.23 ETH 签名并广播 RPC
                        </button>
                      </div>
                    )}

                    {usdcSimulator.stage === 'verifying' && (
                      <div className="p-2 text-slate-400 text-[10px]">
                        <span>⏳ RPC Node Checking Block validation...</span>
                      </div>
                    )}

                    {usdcSimulator.stage === 'done' && (
                      <div className="text-[10px] text-emerald-400 space-y-1">
                        <p className="font-black">✓ TX 共识成功并就地销账完成！</p>
                        <p className="text-[8px] text-slate-500 truncate">{usdcSimulator.hash}</p>
                        <button
                          onClick={() => setUsdcSimulator(null)}
                          className="mt-1 bg-white text-slate-900 font-bold px-2 py-0.5 rounded text-[9px]"
                        >
                          确认归档
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* UNIFIED DESIGN CARDS AS MANDATED (Stripe, Paypal, Apple Pay, Google Pay, Bank Card, USDC (Base)) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gateways.map(g => (
                <div key={g.id} className="bg-white border border-slate-200 hover:border-[#07C2E3] rounded-xl p-5 shadow-xs transition-colors flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-100 text-[#07C2E3] font-bold text-sm flex items-center justify-center rounded-lg border border-slate-200">
                          {g.logoPlaceholder}
                        </div>
                        <h4 className="font-bold text-xs text-slate-900">{g.name}</h4>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        g.status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {g.status === 'connected' ? '已连接' : '未连接'}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-mono">
                      通道币种: {g.supportedCurrencies.join(' / ')} • Direct Settlement Routing
                    </p>
                  </div>

                  {/* UNIFIED ACTIONS BAR ONLY */}
                  <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 justify-end">
                    <button
                      onClick={() => setDrawerGatewayId(g.id)}
                      className="border border-slate-200 hover:bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600 rounded cursor-pointer"
                    >
                      查看配置
                    </button>
                    <button
                      onClick={() => handleTestGateway(g.name)}
                      className="border border-slate-200 hover:bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600 rounded cursor-pointer"
                    >
                      测试连接
                    </button>
                    <button
                      onClick={() => handleToggleGateway(g.id)}
                      className={`text-[10px] font-bold px-3 py-1 rounded cursor-pointer transition-all ${
                        g.status === 'connected' 
                          ? 'bg-[#07C2E3]/15 text-[#07C2E3]' 
                          : 'bg-slate-900 text-white hover:bg-black'
                      }`}
                    >
                      {g.status === 'connected' ? '断开连接' : '连接启用'}
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Config modal drawer if requested */}
            {drawerGatewayId && (
              <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs space-y-2 shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                  <span className="text-[#07C2E3] font-extrabold">&gt; CONFIG OVERVIEW: {drawerGatewayId.toUpperCase()}</span>
                  <button onClick={() => setDrawerGatewayId(null)} className="text-slate-500 hover:text-slate-200 text-sm font-bold leading-none">&times;</button>
                </div>
                <div className="text-[10px] text-slate-300 space-y-1">
                  <p>Webhook Core Status: 🟢 ACTIVE - Auto Synchronized</p>
                  <p>Direct Gateway Provider: Unified Gateway Routing protocol v2.10</p>
                  <p>Auto Dispute Lock: Connected and compliant with Europe standard direct rules</p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW 4: MERCHANT WALLET balances across EUR, USD, USDC */}
        {activeTab === 'wallet' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-150 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm">商户钱包 (Wallet Ledger)</h3>
              <p className="text-[10px] text-[#07C2E3] font-mono font-bold uppercase">LEDGER</p>
            </div>

            {/* Balances list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">EUR 结算通账户</span>
                  <span className="bg-emerald-50 text-emerald-600 font-mono text-[9px] px-1.5 py-0.5 rounded font-extrabold">EUR</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono mt-2">€{aggregates.withdrawable.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                <p className="text-[9px] text-slate-400 mt-2 font-mono">冻结限流：€420.00 | 累计清算：€{aggregates.todaySales.toFixed(2)}</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">USD 清结算通道</span>
                  <span className="bg-slate-100 text-slate-400 font-mono text-[9px] px-1.5 py-0.5 rounded font-extrabold">USD</span>
                </div>
                <div className="text-2xl font-black text-slate-400 font-mono mt-2">$0.00</div>
                <p className="text-[9px] text-slate-400 mt-2 font-mono">冻结限流：$0.00 | 累计清算：$0.00</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">USDC 智能收款钱包</span>
                  <span className="bg-[#07C2E3]/10 text-[#07C2E3] font-mono text-[9px] px-1.5 py-0.5 rounded font-extrabold">USDC</span>
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono mt-2">1,240.00 USDC</div>
                <p className="text-[9px] text-slate-400 mt-2 font-mono">Base 托管链网 | 累计收入：$1,240.00</p>
              </div>
            </div>

            {/* Simplified Withdrawal card as requested */}
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs">
              <h4 className="font-extrabold text-xs text-slate-900 mb-3 uppercase tracking-wider">快捷提现划拨 (Submit Payout Request)</h4>
              
              <form onSubmit={handleApplyPayout} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono block">提款结算金额 (EUR)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-2.5 font-mono text-xs font-bold text-slate-400">€</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-6 pr-3 py-1.5 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono block">对公到账结算账户</label>
                    <select
                      value={withdrawTargetAccount}
                      onChange={(e) => setWithdrawTargetAccount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-semibold text-slate-700"
                    >
                      <option value="BNP Paribas 对公结算卡 (*7290)">BNP Paribas SEPA 对公对账卡 (*7290)</option>
                      <option value="Standard Chartered (*3104)">Standard Chartered GBP Master (*3104)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono block">预计清溢到账时间</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-500 font-bold font-mono">
                      预计 1 个工作日内入账
                    </div>
                  </div>

                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-slate-400">今日单日清溢总限额：€100,000.00</span>
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-black text-[#07C2E3] font-extrabold text-xs px-5 py-2 rounded-lg transition-all cursor-pointer"
                  >
                    提交申请
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

        {/* VIEW 5: PAYOUT LEDGER SHEETS */}
        {activeTab === 'payouts' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-150 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm">提现记录 (Payout Ledger)</h3>
              <p className="text-[10px] text-[#07C2E3] font-mono font-bold uppercase">PAYOUTLOG</p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-10 select-none">
                    <th className="p-3 pl-4">申请编号</th>
                    <th className="p-3">申请时间</th>
                    <th className="p-3">结算币种</th>
                    <th className="p-3 text-right">划拨金额</th>
                    <th className="p-3">到账对公账户</th>
                    <th className="p-3 text-center">清溢状态</th>
                    <th className="p-3">到账时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {payouts.map(rec => (
                    <tr key={rec.id} className="h-11">
                      <td className="p-3 pl-4 font-mono font-bold text-slate-800">{rec.id}</td>
                      <td className="p-3 font-mono">{rec.requestedAt}</td>
                      <td className="p-3 font-mono">{rec.currency}</td>
                      <td className="p-3 text-right font-mono text-slate-900 font-bold">€{rec.amount.toFixed(2)}</td>
                      <td className="p-3 truncate max-w-[150px]" title={rec.recipientAccount}>{rec.recipientAccount}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                          rec.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {rec.status === 'Completed' ? '已完成' : '处理中'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono">{rec.completedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 6: REFUND MANAGEMENT (Simplified workflow as requested by user) */}
        {activeTab === 'refunds' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-150 pb-2">
              <h3 className="font-extrabold text-slate-900 text-sm">退款管理 (Refunds)</h3>
              <p className="text-[10px] text-[#07C2E3] font-mono font-bold uppercase">REFUNDS</p>
            </div>

            {/* Quick Refund request list */}
            <div className="space-y-3">
              {refundRequestedOrders.length === 0 ? (
                <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
                  👏 暂无可处理的客诉退款争议
                </div>
              ) : (
                refundRequestedOrders.map(ro => (
                  <div key={ro.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#07C2E3]">{ro.id}</span>
                        <span className="bg-rose-50 border border-rose-200 text-rose-600 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                          争议待定
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        <span>客户: <strong className="text-slate-900">{ro.customerName}</strong> | 申请时间: <span className="font-mono">{ro.createdAt}</span></span>
                      </div>
                      <p className="text-slate-500 text-[11px] font-mono select-all">
                        申诉原因: 顾客申请退货退款 (SaaS/SOP核批中)
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-slate-900 text-sm">€{ro.total.toFixed(2)}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleConfirmRefundSubmit(ro, false)}
                          className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded transition-all cursor-pointer"
                        >
                          拒绝退款
                        </button>
                        <button
                          onClick={() => handleConfirmRefundSubmit(ro, true)}
                          className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded transition-all cursor-pointer"
                        >
                          完成退款
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Historic Refended Transactions overview sheet */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mt-6">
              <div className="p-3 border-b border-slate-100 bg-slate-50/30">
                <span className="font-bold text-xs text-slate-700">退款及争议流水日志</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-bold uppercase tracking-wider h-9 select-none">
                    <th className="p-3 pl-4">销账单ID</th>
                    <th className="p-3">原订单号</th>
                    <th className="p-3">清结客户</th>
                    <th className="p-3 text-right">借还金额</th>
                    <th className="p-3 text-center">当前状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {paymentOrders.filter(p => p.status === '已退款').map(p => (
                    <tr key={p.id} className="h-10">
                      <td className="p-3 pl-4 font-mono font-bold text-slate-800">{p.id}</td>
                      <td className="p-3 font-mono text-slate-400">{p.orderId}</td>
                      <td className="p-3">{p.customer}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">€{p.amount.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-black">
                          已全额借退原路
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paymentOrders.filter(p => p.status === '已退款').length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 text-[11px]">暂无已核准退余的归零单</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
