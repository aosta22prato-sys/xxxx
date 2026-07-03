import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Users, 
  Clock, 
  ArrowRight, 
  X, 
  Package, 
  Megaphone, 
  Plus, 
  Coins,
  Brain,
  Sparkles,
  TrendingUp,
  DollarSign,
  Bot,
  Activity,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { IndustryType, ProductItem, OrderItem } from '../../types';

interface SaaSMerchantWorkbenchProps {
  selectedIndustry: IndustryType;
  companyName: string;
  onUpdateCompanyName: (name: string) => void;
  products: ProductItem[];
  orders: OrderItem[];
  onAddProduct: (title: string, sku: string, stock: number, price: number) => void;
  onPopulateSampleData: () => void;
  onRestockProduct: (sku: string) => void;
  onAuditOrder: (orderId: string) => void;
  onOpenOnlineStorefront: () => void;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  onSwitchTab: (tab: string) => void;
  agentTasks?: any[];
  onUpdateAgentTasks?: (tasks: any[]) => void;
}

export default function SaaSMerchantWorkbench({
  selectedIndustry,
  companyName,
  products,
  orders,
  onAddProduct,
  onPopulateSampleData,
  onRestockProduct,
  onAuditOrder,
  onOpenOnlineStorefront,
  addLog,
  onSwitchTab,
  agentTasks = [],
  onUpdateAgentTasks
}: SaaSMerchantWorkbenchProps) {
  
  const getThemeStyles = (industry: IndustryType) => {
    const themesDirs: Record<string, {
      primaryBg: string;       
      primaryHoverBg: string;  
      primaryText: string;     
      primaryBorderClass: string; 
      focusRing: string;       
      toastBorder: string;     
      badgeStyle: string;      
      statBg: string;          
      auditBtn: string;        
      themeLabel: string;      
    }> = {
      retail: {
        primaryBg: 'bg-[#07C2E3]',
        primaryHoverBg: 'hover:bg-[#06B2D0]',
        primaryText: 'text-[#07C2E3]',
        primaryBorderClass: 'border-[#07C2E3]',
        focusRing: 'focus:ring-[#07C2E3]',
        toastBorder: 'border-[#07C2E3]',
        badgeStyle: 'bg-[#07C2E3]/10 text-[#07C2E3] border-[#07C2E3]/20',
        statBg: 'bg-[#07C2E3]/15 border-[#07C2E3]/40',
        auditBtn: 'bg-[#121214] hover:bg-[#07C2E3] hover:text-white text-[#07C2E3]',
        themeLabel: '米兰风尚女装直销店'
      },
      food: {
        primaryBg: 'bg-rose-600',
        primaryHoverBg: 'hover:bg-rose-700',
        primaryText: 'text-rose-600',
        primaryBorderClass: 'border-rose-500',
        focusRing: 'focus:ring-rose-500',
        toastBorder: 'border-rose-500',
        badgeStyle: 'bg-rose-50 text-rose-600 border-rose-200',
        statBg: 'bg-rose-50 border-rose-200',
        auditBtn: 'bg-[#121214] hover:bg-rose-600 hover:text-white text-rose-600 border-zinc-800',
        themeLabel: '慕尼黑私房菜配送店'
      },
      manufacturing: {
        primaryBg: 'bg-amber-550 bg-amber-500',
        primaryHoverBg: 'hover:bg-amber-600',
        primaryText: 'text-amber-500',
        primaryBorderClass: 'border-amber-500',
        focusRing: 'focus:ring-amber-500',
        toastBorder: 'border-amber-500',
        badgeStyle: 'bg-amber-50 text-amber-600 border-amber-200',
        statBg: 'bg-amber-50 border-amber-250',
        auditBtn: 'bg-[#121214] hover:bg-amber-500 hover:text-white text-amber-500 border-zinc-800',
        themeLabel: '智电家居多门店直销店'
      },
      healthcare: {
        primaryBg: 'bg-teal-600',
        primaryHoverBg: 'hover:bg-teal-705 hover:bg-teal-700',
        primaryText: 'text-teal-600',
        primaryBorderClass: 'border-teal-500',
        focusRing: 'focus:ring-teal-500',
        toastBorder: 'border-teal-500',
        badgeStyle: 'bg-teal-50 text-teal-600 border-teal-200',
        statBg: 'bg-teal-50 border-teal-200',
        auditBtn: 'bg-[#121214] hover:bg-teal-600 hover:text-white text-teal-600 border-zinc-800',
        themeLabel: '巴黎高端香水POS快速结算端'
      },
      service: {
        primaryBg: 'bg-pink-500',
        primaryHoverBg: 'hover:bg-pink-600',
        primaryText: 'text-pink-500',
        primaryBorderClass: 'border-pink-500',
        focusRing: 'focus:ring-pink-500',
        toastBorder: 'border-pink-400',
        badgeStyle: 'bg-pink-50 text-pink-500 border-pink-200',
        statBg: 'bg-pink-50 border-pink-200',
        auditBtn: 'bg-[#121214] hover:bg-pink-500 hover:text-white text-pink-500 border-zinc-800',
        themeLabel: '罗马会所美容线上预订端'
      },
      education: {
        primaryBg: 'bg-indigo-600',
        primaryHoverBg: 'hover:bg-indigo-700',
        primaryText: 'text-indigo-600',
        primaryBorderClass: 'border-indigo-500',
        focusRing: 'focus:ring-indigo-500',
        toastBorder: 'border-indigo-400',
        badgeStyle: 'bg-indigo-50 text-indigo-500 border-indigo-200',
        statBg: 'bg-indigo-50 border-indigo-200',
        auditBtn: 'bg-[#121214] hover:bg-indigo-600 hover:text-white text-indigo-600 border-zinc-800',
        themeLabel: '382跨境3C出海站'
      }
    };
    return themesDirs[industry] || themesDirs.retail;
  };

  const currentTheme = getThemeStyles(selectedIndustry);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(69);
  const [newStock, setNewStock] = useState(100);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate dynamic, real-world task lists for other industries if agentTasks is empty
  const getIndustryTasks = () => {
    const parentFiltered = agentTasks.filter(t => t.tenantId === 't_' + selectedIndustry);
    if (parentFiltered.length > 0) {
      return parentFiltered;
    }

    // High fidelity fallback presets for each industry which can be physically written to the server's state later.
    const fallbackPresets: Record<string, any[]> = {
      retail: [
        { id: 'TASK_RET_01', tenantId: 't_retail', name: '自动采购补配断货女装 SKU-R189', sourceAgent: 'InventoryAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() },
        { id: 'TASK_RET_02', tenantId: 't_retail', name: '拦截 Adyen 支付欺诈异常订单 #ORD-8821', sourceAgent: 'FraudRiskAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() },
        { id: 'TASK_RET_03', tenantId: 't_retail', name: '启动夏季清仓 618 满减推广促销活动', sourceAgent: 'MarketingAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() },
        { id: 'TASK_RET_04', tenantId: 't_retail', name: '核销本周欧盟跨境 VAT 增值税资金池', sourceAgent: 'FinanceAgent', status: 'COMPLETED', progress: 100, createdAt: new Date().toISOString() }
      ],
      food: [
        { id: 'TASK_FOOD_01', tenantId: 't_food', name: '夜间意式披萨食材面皮与牛肉紧急报采', sourceAgent: 'InventoryAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() },
        { id: 'TASK_FOOD_02', tenantId: 't_food', name: '老客回访：直发 Adyen 20% OFF 特惠兑换码', sourceAgent: 'MarketingAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() },
        { id: 'TASK_FOOD_03', tenantId: 't_food', name: '拦截恶意拒付、刷单外卖可疑订单 #ORD-3329', sourceAgent: 'FraudRiskAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() }
      ],
      service: [
        { id: 'TASK_SERV_01', tenantId: 't_service', name: '美容 SPA 高端玫瑰原精油 100 瓶起订报备', sourceAgent: 'InventoryAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() },
        { id: 'TASK_SERV_02', tenantId: 't_service', name: '法国奢华精油 VIP 会员大礼包促销优惠券上线', sourceAgent: 'MarketingAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() },
        { id: 'TASK_SERV_03', tenantId: 't_service', name: '财务大盘：对账Adyen收单资金清分核算', sourceAgent: 'FinanceAgent', status: 'COMPLETED', progress: 100, createdAt: new Date().toISOString() }
      ],
      manufacturing: [
        { id: 'TASK_MAN_01', tenantId: 't_manufacturing', name: '自动生成新款智慧电器说明书文案', sourceAgent: 'ProductAgent', status: 'COMPLETED', progress: 100, createdAt: new Date().toISOString() },
        { id: 'TASK_MAN_02', tenantId: 't_manufacturing', name: '追加 3C 电器贴片主控安全备料安全锁量', sourceAgent: 'InventoryAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() }
      ],
      healthcare: [
        { id: 'TASK_HC_01', tenantId: 't_healthcare', name: '流失客户跟进：抗敏药贴健康提示直发', sourceAgent: 'MarketingAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() },
        { id: 'TASK_HC_02', tenantId: 't_healthcare', name: '结算巴黎保税药剂大包物料储备增订款', sourceAgent: 'InventoryAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() }
      ],
      education: [
        { id: 'TASK_EDU_01', tenantId: 't_education', name: '一键生成德法俄跨境精品课程详情文案', sourceAgent: 'ProductAgent', status: 'COMPLETED', progress: 100, createdAt: new Date().toISOString() },
        { id: 'TASK_EDU_02', tenantId: 't_education', name: '高溢价 VIP 会员一对一答疑服务满赠大促', sourceAgent: 'MarketingAgent', status: 'PENDING_APPROVAL', progress: 0, createdAt: new Date().toISOString() }
      ]
    };

    return fallbackPresets[selectedIndustry] || fallbackPresets.retail;
  };

  const recentTasks = getIndustryTasks().map(task => {
    let matchedAgent = 'AI Agent';
    if (task.sourceAgent === 'ProductAgent' || task.sourceAgent === 'Product Designer') matchedAgent = '商品设计师 Sofia';
    else if (task.sourceAgent === 'InventoryAgent' || task.sourceAgent === 'Inventory Manager' || task.sourceAgent === 'Oliver') matchedAgent = '采购经理 Oliver';
    else if (task.sourceAgent === 'MarketingAgent' || task.sourceAgent === 'Marcus') matchedAgent = '市场总监 Victor';
    else if (task.sourceAgent === 'FraudRiskAgent') matchedAgent = '风控智体 Stuart';
    else if (task.sourceAgent === 'FinanceAgent' || task.sourceAgent === 'Audit') matchedAgent = '财务合规 Audit';

    let mappedStatus = '就绪';
    if (task.status === 'PENDING_APPROVAL' || task.status === '待审核') mappedStatus = '待审核';
    else if (task.status === 'RUNNING' || task.status === '进行中') mappedStatus = '进行中';
    else if (task.status === 'COMPLETED' || task.status === 'SUCCESS' || task.status === '完成') mappedStatus = '完成';

    return {
      id: task.id,
      name: task.name,
      agent: matchedAgent,
      status: mappedStatus,
      rawTask: task
    };
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleAddNewSKU = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const generatedSku = `SKU-${Date.now().toString().slice(-4)}`;
    onAddProduct(newTitle, generatedSku, newStock, newPrice);
    setNewTitle('');
    setShowAddForm(false);
    addLog('System', '创建新商品', `手动注册商品「${newTitle}」, 标价 $${newPrice}, 初始库存 ${newStock}`, 'success');
    showToast(`✓ 商品「${newTitle}」成功注册上架！`);
  };

  // Click on a recent task initiates the direct execution action
  const handleExecuteTask = (taskId: string) => {
    const task = recentTasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === '完成') {
      showToast(`✓ 任务 ${taskId} 已经完成，无需重复执行。`);
      return;
    }

    // Prepare fully mutated list to write physically back to database
    let changedTasks = [];
    const parentHasThis = agentTasks.some(t => t.id === taskId);
    if (parentHasThis) {
      changedTasks = agentTasks.map(t => t.id === taskId ? { ...t, status: 'COMPLETED', progress: 100 } : t);
    } else {
      // If the task was a local preset, write it and other presets physically to the parent list!
      const currentPresets = getIndustryTasks();
      const updatedPresets = currentPresets.map(t => t.id === taskId ? { ...t, status: 'COMPLETED', progress: 100 } : t);
      // Merged back to parent list
      const otherIndustryTasks = agentTasks.filter(t => t.tenantId !== 't_' + selectedIndustry);
      changedTasks = [...otherIndustryTasks, ...updatedPresets];
    }

    if (onUpdateAgentTasks) {
      onUpdateAgentTasks(changedTasks);
    }

    addLog('AI Command Node', '执行自动化任务', `立即执行任务: ${task.name}`, 'tool');

    // Trigger physical structural mutations
    const titleLower = task.name.toLowerCase();
    if (titleLower.includes('采购') || titleLower.includes('库存') || titleLower.includes('备料') || titleLower.includes('精油') || titleLower.includes('外套')) {
      const topProd = products[0];
      const targetSku = topProd ? topProd.sku : 'SKU-R189';
      onRestockProduct(targetSku);
      showToast(`✓ 立即执行：已自动采购追加并且增加 SKU「${targetSku}」实盘库存 50 件！`);
    } else if (titleLower.includes('拦截') || titleLower.includes('欺诈') || titleLower.includes('风控') || titleLower.includes('异常')) {
      const pOrder = orders[0];
      const targetOrderId = pOrder ? pOrder.id : '#ORD-9839';
      onAuditOrder(targetOrderId);
      showToast(`✓ 立即执行：风控签名验证通过，已标记可疑订单 ${targetOrderId} 为安全放行 (AI Confirmed)！`);
    } else if (titleLower.includes('大促') || titleLower.includes('满减') || titleLower.includes('营销') || titleLower.includes('体验') || titleLower.includes('活动') || titleLower.includes('券')) {
      showToast(`✓ 立即执行：已自动上线营销特惠券、拉网式触发 Adyen 催付及老客特许召回。`);
    } else {
      showToast(`✓ 立即执行：系统原子任务已成功运行！`);
    }
  };

  // Dynamic Stat Computations
  const computedSalesSum = orders.reduce((sum, o) => sum + o.total, 0);
  const todaySales = computedSalesSum > 0 ? computedSalesSum : 12480;
  const todayOrdersCount = orders.length > 0 ? orders.length : 148;
  const todayCustomersUnique = new Set(orders.map(o => o.customerName)).size;
  const todayCustomersCount = todayCustomersUnique > 0 ? todayCustomersUnique : 64;
  const todayProfit = Math.round(todaySales * 0.35 * 100) / 100;

  const pendingShipmentCount = orders.filter(o => o.status === 'Pending').length || 12;
  const pendingRefundCount = orders.filter(o => o.status === 'Refund Requested').length || 3;
  const pendingApprovalCount = orders.filter(o => o.riskScore && o.riskScore > 35).length || 2;
  const pendingActionCount = products.filter(p => p.stock <= p.minStockThreshold).length + pendingShipmentCount;

  return (
    <div id="ecos-merchant-workbench" className="space-y-6 text-slate-800 select-none font-sans animate-fadeIn relative pb-16">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-55 max-w-sm bg-[#09090b] border-2 ${currentTheme.primaryBorderClass} text-slate-100 p-4 rounded-xl shadow-2xl flex items-start gap-3 animate-slideIn`}>
          <Sparkles className={`w-5 h-5 ${currentTheme.primaryText} shrink-0 mt-0.5 animate-pulse`} />
          <div className="space-y-1">
            <h4 className={`text-xs font-black ${currentTheme.primaryText} tracking-widest uppercase`}>系统事件广播</h4>
            <p className="text-[11px] font-semibold text-slate-300 leading-relaxed font-mono">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Top Banner Navigation */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-5 text-left">
        <div className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg ${currentTheme.statBg} flex items-center justify-center`}>
              <Brain className={`w-3.5 h-3.5 ${currentTheme.primaryText}`} />
            </div>
            <h1 className="text-lg font-black tracking-widest text-slate-900 uppercase flex items-center gap-1.5 font-display">
              商家控制中心首页
              <span className={`text-[9px] font-semibold ${currentTheme.badgeStyle} px-1.5 py-0.5 rounded font-mono`}>
                Merchant Operations Core
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            企业: <span className="text-slate-800 font-bold">{companyName}</span> | 行业类型: <span className="text-slate-800 font-bold uppercase font-mono">{selectedIndustry}</span> | 实盘数据: <span className="text-emerald-600 font-bold">完全独立物理隔离</span>
          </p>
        </div>

        {/* Preview Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenOnlineStorefront}
            className={`px-3.5 py-2 bg-white border border-slate-200 hover:${currentTheme.primaryBorderClass} text-slate-700 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer`}
          >
            <span>预览商城</span>
            <ArrowRight className={`w-3 h-3 ${currentTheme.primaryText}`} />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/*第一排: 数据卡片 */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '今日销售额', value: `$${todaySales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: currentTheme.primaryText, desc: '线上商城产生的总交易流水' },
          { label: '今日订单', value: `${todayOrdersCount} 笔`, icon: ShoppingCart, color: 'text-slate-700', desc: '消费者成功确认付款的总笔数' },
          { label: '今日客户', value: `${todayCustomersCount} 人`, icon: Users, color: 'text-slate-700', desc: '去重统计的活跃购买消费者' },
          { label: '今日利润', value: `$${todayProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: WinnerIcon, color: currentTheme.primaryText, desc: '按 35% 净溢价水位估算得出的净利润' }
        ].map((item, index) => {
          const IconComponent = item.icon === WinnerIcon ? Coins : item.icon;
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{item.label}</span>
                <div className={`p-1.5 rounded-lg bg-slate-50 border border-slate-100 ${item.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 font-mono tracking-tight">{item.value}</span>
                <p className="text-[9px] text-slate-400 mt-0.5 truncate leading-none">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 第二排: 待处理指标卡片 */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '待发货', value: `${pendingShipmentCount} 单`, statusColor: 'bg-slate-50 border-slate-200 text-slate-600', alert: true },
          { label: '待退款', value: `${pendingRefundCount} 单`, statusColor: 'bg-rose-50 border-rose-200 text-rose-600', alert: true },
          { label: '待审批', value: `${pendingApprovalCount} 单`, statusColor: 'bg-slate-50 border-slate-200 text-slate-600', alert: true },
          { label: '待处理', value: `${pendingActionCount} 任务`, statusColor: 'bg-slate-100 border-slate-200 text-slate-700', alert: false }
        ].map((item, index) => {
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 block">{item.label}</span>
                <span className="text-lg font-black text-slate-900 font-mono">{item.value}</span>
              </div>
              <span className={`text-[10px] font-bold rounded-lg border px-2.5 py-1 ${item.statusColor}`}>
                {item.alert ? '● 需处理' : '● 行动指示'}
              </span>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 第三排: AI效能硬指标 */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'AI员工在线', value: '8 / 8 智体', icon: Bot, color: currentTheme.primaryText, details: '多智能体网络全部巡检就绪' },
          { label: '执行任务', value: '142 次', icon: Activity, color: currentTheme.primaryText, details: '今日累计代替店长执行业务操作' },
          { label: '成功率', value: '99.4%', icon: CheckCircle2, color: 'text-emerald-600', details: '智体审核与数据落库交易合规对平率' },
          { label: '节省成本', value: '$1,420.00', icon: Coins, color: currentTheme.primaryText, details: '替代底层物理操作换算的资金对调红利' }
        ].map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{item.label}</span>
                <div className={`p-1.5 rounded-lg bg-slate-50 border border-slate-100 ${item.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-base font-black text-slate-900 font-mono">{item.value}</span>
                <p className="text-[9px] text-slate-400 mt-0.5 truncate leading-none">{item.details}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 第四排: 快捷入口 */}
      {/* ======================================================== */}
      <div className="text-left space-y-2">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">快捷操作直达 (快捷入口)</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: '商品', tab: 'products', icon: Package, color: 'text-slate-700' },
            { label: '订单', tab: 'orders', icon: ShoppingCart, color: 'text-slate-700' },
            { label: '客户', tab: 'customers', icon: Users, color: 'text-slate-700' },
            { label: '库存', tab: 'products', icon: Clock, color: 'text-slate-700' },
            { label: '营销', tab: 'marketing', icon: Megaphone, color: 'text-slate-700' },
            { label: '财务', tab: 'finance', icon: Coins, color: 'text-slate-700' }
          ].map((item, key) => {
            const Icon = item.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onSwitchTab(item.tab);
                  addLog('Quick Navigator', '快捷跳转', `一键跳转到页面: ${item.label}`, 'info');
                }}
                className={`p-3 bg-white border border-slate-200 hover:${currentTheme.primaryBorderClass} rounded-xl text-left transition-all active:scale-[0.97] flex flex-col justify-between h-20 cursor-pointer text-slate-700 shadow-sm group`}
              >
                <Icon className={`w-4 h-4 text-slate-400 group-hover:${currentTheme.primaryText}`} />
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Add SKU trigger */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            addLog('Owner Command', '开启商品表单', '点击了一键开启上架定制商品表单', 'info');
          }}
          className={`${currentTheme.primaryBg} ${currentTheme.primaryHoverBg} text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>创建定制高溢价商品</span>
        </button>
      </div>

      {/* Add Product Form Overlay/Section */}
      {showAddForm && (
        <div className={`bg-white border-2 ${currentTheme.primaryBorderClass} rounded-xl p-5 text-left space-y-4 shadow-xl animate-fadeIn`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <Plus className={`w-4 h-4 ${currentTheme.primaryText}`} />
              <span>录入新商品信息</span>
            </div>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAddNewSKU} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">商品名称 *</label>
              <input 
                type="text" 
                required 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="名称..."
                className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 ${currentTheme.focusRing} focus:bg-white`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">定价 ($) *</label>
              <input 
                type="number" 
                required 
                min="1"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 ${currentTheme.focusRing} focus:bg-white`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">初始采购量 *</label>
              <input 
                type="number" 
                required 
                min="1"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 ${currentTheme.focusRing} focus:bg-white`}
              />
            </div>
            <div className="md:col-span-4 flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit" 
                className={`px-5 py-2 ${currentTheme.primaryBg} ${currentTheme.primaryHoverBg} text-white font-bold text-xs rounded-lg transition-all active:scale-95 cursor-pointer`}
              >
                确认上架产品
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* 第五排: 最近任务 (表格) */}
      {/* ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col text-left">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-800 text-sm tracking-tight font-display">最近任务 / AI 自动化调度流水</h3>
            <p className="text-[11px] text-slate-400">SaaS 多智能体系统自主分析并生成的决策计划和操作队列</p>
          </div>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse font-mono">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-400 uppercase tracking-wider select-none">
                <th className="px-5 py-3">任务编号</th>
                <th className="px-5 py-3 text-slate-500">业务目标 (任务名称)</th>
                <th className="px-5 py-3 text-slate-500">负责智体</th>
                <th className="px-5 py-3 text-center text-slate-500">运行状态</th>
                <th className="px-5 py-3 text-right text-slate-500">立即行动</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTasks.map((task) => {
                let statusBadge = '';
                if (task.status === '待审核') statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
                else if (task.status === '进行中') statusBadge = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                else if (task.status === '完成') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                else statusBadge = 'bg-slate-50 text-slate-700 border-slate-200';

                return (
                  <tr key={task.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-bold text-slate-900">#{task.id}</td>
                    <td className="px-5 py-3.5 text-slate-700 font-bold font-sans">{task.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">{task.agent}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${statusBadge}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {task.status === '完成' ? (
                        <div className="text-[10px] text-slate-400 font-sans flex items-center justify-end gap-1 font-semibold pr-3">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 已安全扣款落库
                        </div>
                      ) : (
                        <button
                          onClick={() => handleExecuteTask(task.id)}
                          className={`px-3 py-1 ${currentTheme.auditBtn} font-bold text-[10px] rounded border transition-all cursor-pointer`}
                        >
                          立即执行
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// Simple placeholder block to work around a linter warning if any
const WinnerIcon = () => null;
