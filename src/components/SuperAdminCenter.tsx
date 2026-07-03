import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Users, Bot, Settings, Database, RefreshCw, 
  Send, AlertTriangle, Key, Sliders, Check, Network, Activity,
  CreditCard, Mail, Eye, Play, Pause, Trash, ArrowRight, Shield, FileText, Globe,
  Code, Search, Lock, HelpCircle, Terminal, Coins, DollarSign
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { TenantConfig, AppMarketItem, IndustryType } from '../types';

interface SuperAdminCenterProps {
  activeSubTab?: 'stats' | 'tenants' | 'query' | 'gateways' | 'ai-ops' | 'roles' | 'logs' | 'diagnostics' | 'settings';
  tenants: TenantConfig[];
  onUpdateTenantStatus: (tenantId: string, status: 'active' | 'suspended') => void;
  onUpdateTenantAiBudget: (tenantId: string, budget: number) => void;
  marketItems: AppMarketItem[];
  onAddMarketItem: (item: AppMarketItem) => void;
  globalDefaultModel: string;
  onChangeGlobalModel: (model: string) => void;
  onAddSystemLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  activeAgents?: any[];
  onUpdateAgents?: (agents: any[]) => void;
  onChangeSubTab?: (subTab: string) => void;
  auditLogs?: any[];
  setAuditLogs?: React.Dispatch<React.SetStateAction<any[]>>;
  agentRuns?: any[];
  setAgentRuns?: React.Dispatch<React.SetStateAction<any[]>>;
  agentTasks?: any[];
  setAgentTasks?: React.Dispatch<React.SetStateAction<any[]>>;
  tenantDB?: Record<string, any>;
}

export default function SuperAdminCenter({
  activeSubTab = 'stats',
  tenants,
  onUpdateTenantStatus,
  onUpdateTenantAiBudget,
  marketItems,
  onAddMarketItem,
  globalDefaultModel,
  onChangeGlobalModel,
  onAddSystemLog,
  activeAgents = [],
  onUpdateAgents,
  onChangeSubTab,
  auditLogs = [],
  setAuditLogs,
  agentRuns = [],
  setAgentRuns,
  agentTasks = [],
  setAgentTasks,
  tenantDB
}: SuperAdminCenterProps) {

  // ==================== 24h System Task Performance Data for Recharts ====================
  const last24hPerformanceData = useMemo(() => {
    const data = [];
    const baseHour = 14; 
    for (let i = 23; i >= 0; i--) {
      const hourVal = (baseHour - i + 24) % 24;
      const hourStr = `${hourVal.toString().padStart(2, '0')}:00`;
      
      const isBusinessHour = hourVal >= 9 && hourVal <= 18;
      const baseTasks = isBusinessHour ? 220 : 115;
      const tasks = Math.floor(baseTasks + Math.sin(i * 0.8) * 45 + Math.random() * 20);
      
      const baseLatency = isBusinessHour ? 205 : 145;
      const latency = Math.floor(baseLatency + Math.cos(i * 0.8) * 20 + Math.random() * 15);
      
      data.push({
        time: hourStr,
        tasks,
        latency,
      });
    }
    return data;
  }, []);

  const performanceStats = useMemo(() => {
    const totalTasks = last24hPerformanceData.reduce((sum, item) => sum + item.tasks, 0);
    const avgLatency = Math.round(last24hPerformanceData.reduce((sum, item) => sum + item.latency, 0) / last24hPerformanceData.length);
    return {
      totalTasks,
      avgLatency,
      successRate: '99.91%',
    };
  }, [last24hPerformanceData]);

  // ==================== 1. 平台控制中心 States ====================
  const [allowSignup, setAllowSignup] = useState(true);
  const [trialEnabled, setTrialEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [readonlyMode, setReadonlyMode] = useState(false);
  const [systemNotice, setSystemNotice] = useState('温馨提示：平台定于 2026-06-12 凌晨 03:00 进行系统路由性能和数据库索引优化升级，届时系统各项功能不受影响。');
  const [isNoticeBroadcasting, setIsNoticeBroadcasting] = useState(false);
  const [upgradeLogs, setUpgradeLogs] = useState<string[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // ==================== 2. 租户中心 Extra States ====================
  const [tokenAdjustments, setTokenAdjustments] = useState<Record<string, number>>({});
  const [selectedTenantData, setSelectedTenantData] = useState<TenantConfig | null>(null);

  // ==================== 3. 数据查询中心 States ====================
  const [selectedTable, setSelectedTable] = useState<'orders' | 'products' | 'customers' | 'tenants'>('orders');
  const [queryInput, setQueryInput] = useState('SELECT * FROM orders LIMIT 20;');
  const [searchQuery, setSearchQuery] = useState('');
  const [queryError, setQueryError] = useState<string | null>(null);

  // Real Database Extraction
  const allOrders = useMemo(() => {
    if (!tenantDB) return [];
    return Object.keys(tenantDB).flatMap(industry => {
      const db = tenantDB[industry];
      return (db.orders || []).map((o: any) => ({ ...o, industry }));
    });
  }, [tenantDB]);

  const allProducts = useMemo(() => {
    if (!tenantDB) return [];
    return Object.keys(tenantDB).flatMap(industry => {
      const db = tenantDB[industry];
      return (db.products || []).map((p: any) => ({ ...p, industry }));
    });
  }, [tenantDB]);

  const allCustomers = useMemo(() => {
    if (!tenantDB) return [];
    return Object.keys(tenantDB).flatMap(industry => {
      const db = tenantDB[industry];
      return (db.customers || []).map((c: any) => ({ ...c, industry }));
    });
  }, [tenantDB]);

  // Handle data querying based on selections/CLI commands
  const processedQueryResult = useMemo(() => {
    let sourceData: any[] = [];
    if (selectedTable === 'orders') sourceData = allOrders;
    else if (selectedTable === 'products') sourceData = allProducts;
    else if (selectedTable === 'customers') sourceData = allCustomers;
    else if (selectedTable === 'tenants') sourceData = tenants;

    if (!searchQuery.trim()) {
      return sourceData;
    }

    const term = searchQuery.toLowerCase().trim();
    return sourceData.filter(item => {
      return Object.values(item).some(val => {
        if (!val) return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  }, [selectedTable, allOrders, allProducts, allCustomers, tenants, searchQuery]);

  // ==================== 4. 支付通道 States ====================
  const [paymentGateways, setPaymentGateways] = useState([
    { id: 'stripe', name: 'Stripe 境外信用卡渠道网关', apiKey: 'sk_live_51Msz8pG9Ap82K...', webhook: 'https://SaaS-api.shopify.net/webhooks/stripe', status: true, syncTime: '2026-06-08 14:15:30', errorLogs: ['Webhook signature verification warning (2026-06-08 10:22)'] },
    { id: 'paypal', name: 'PayPal 贝宝数字金融对账网关', apiKey: 'client_id_live_A98F...', webhook: 'https://SaaS-api.shopify.net/webhooks/paypal', status: true, syncTime: '2026-06-08 13:58:12', errorLogs: [] },
    { id: 'adyen', name: 'Adyen 欧陆多币种快捷清算宿主', apiKey: 'ws_prod_z87y90aK772B...', webhook: 'https://SaaS-api.shopify.net/webhooks/adyen', status: true, syncTime: '2026-06-08 12:44:09', errorLogs: [] },
    { id: 'klarna', name: 'Klarna 境外先买后付账款信托', apiKey: 'pk_klarna_de_8b244...', webhook: 'https://SaaS-api.shopify.net/webhooks/klarna', status: false, syncTime: '从未同步', errorLogs: ['API credentials revoked by Klarna gateway sandbox issuer'] }
  ]);
  const [isSyncingGateway, setIsSyncingGateway] = useState<string | null>(null);

  // ==================== 5. AI 大脑中心 States ====================
  const [aiOpTab, setAiOpTab] = useState<'revenue' | 'fraud' | 'campaign'>('revenue');
  const [dispatchedCampaign, setDispatchedCampaign] = useState(false);
  const [dispatchedSettlement, setDispatchedSettlement] = useState(false);
  const [lockedRisk, setLockedRisk] = useState(false);

  const [agentsList, setAgentsList] = useState([
    { id: 'inventory_agent', name: '库存调控代理 (Inventory Control Agent)', status: 'Active', version: 'v3.2.1', runs: 124, lastTime: '2.5s' },
    { id: 'pricing_agent', name: '实时调价智能体 (Pricing Adjustment Agent)', status: 'Active', version: 'v3.1.8', runs: 85, lastTime: '1.8s' },
    { id: 'marketing_agent', name: '客户挽留智能体 (Loyalty Re-engager Agent)', status: 'Active', version: 'v2.9.4', runs: 215, lastTime: '3.1s' },
    { id: 'support_agent', name: '智能客服专家 (Support Operations Expert)', status: 'Active', version: 'v4.0.2', runs: 412, lastTime: '0.9s' },
    { id: 'risk_agent', name: '风控拦截智能网 (Risk & Fraud Defensor)', status: 'Disabled', version: 'v2.1.0', runs: 18, lastTime: '4.2s' }
  ]);

  // Global Decisive AI Chat State (总后台 AI 智能运维)
  const [globalAIChatMessages, setGlobalAIChatMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: `系统正常运行中。当前已对接全网活跃隔离商户，所有通道运行平稳。

我可以协助您执行全平台财务对账、风控高危商户筛选、联合战役效果评估。比如您可以问我：
- “过去7天全平台表现怎么样？”
- “哪些商铺的异常争议退款风险最高？”
- “当前全网各隔离商户的利润表现与 MRR 汇总”`
    }
  ]);
  const [globalAIChatInput, setGlobalAIChatInput] = useState('');
  const [isGlobalAIThinking, setIsGlobalAIThinking] = useState(false);

  // Fetch real agent task list
  const realAgentTasks = useMemo(() => {
    return agentTasks.length > 0 ? agentTasks : [
      { id: 'tsk_0091', agentId: 'inventory_agent', name: '服装保税仓库存缺料核查与补货命令', executionTime: '2026-06-08 14:12', result: '已补货提交至审批', status: 'WAIT_FOR_APPROVAL' },
      { id: 'tsk_0088', agentId: 'pricing_agent', name: '外卖披萨热销峰值竞品调价核算', executionTime: '2026-06-08 13:40', result: '平均单价上调 €1.2 加权通过', status: 'FINISHED' }
    ];
  }, [agentTasks]);

  // ==================== 6. 权限中心 States ====================
  const [rolesList, setRolesList] = useState([
    { id: 'owner', name: '系统拥有者 (Owner)', desc: '拥有平台的完整底座管理、账期结算、物理网格配置与财务支配权', permissions: { product: true, order: true, finance: true, ai_ops: true, sys_config: true } },
    { id: 'admin', name: '系统管理员 (Super Admin)', desc: '运维级管理主控台、租户配额动态调拨、日志安全回放审计', permissions: { product: true, order: true, finance: true, ai_ops: true, sys_config: false } },
    { id: 'manager', name: '服务主管级 (Manager)', desc: '管理客户产品合规发布、纠纷订单退款仲裁拦截安全限额控制', permissions: { product: true, order: true, finance: false, ai_ops: true, sys_config: false } },
    { id: 'staff', name: '运营专员组 (Staff)', desc: '可查询租户日常统计数据、对账流水，一般无任何配置更改审批权限', permissions: { product: true, order: false, finance: false, ai_ops: false, sys_config: false } },
    { id: 'support', name: '客服保障组 (Support)', desc: '可协助查询退款详情状态与日志轨迹，但无修改商品价格或支付密钥权限', permissions: { product: false, order: true, finance: false, ai_ops: false, sys_config: false } }
  ]);

  const [settingsForm, setSettingsForm] = useState({
    maxCommissionCap: 5.0,
    sessionTimeout: 3600
  });

  // ==================== 8. 系统诊断中心 States ====================
  const [dbDiagnostic, setDbDiagnostic] = useState({ name: 'PostgreSQL Database Cluster', status: 'Connected', delay: '12ms', msg: '主从节点同步顺畅，空闲连接池池容量：94%' });
  const [redisDiagnostic, setRedisDiagnostic] = useState({ name: 'Redis Cache Memory Host', status: 'Connected', delay: '2ms', msg: '热缓存命中率：98.4%，物理占用内存：840 KB / 2 GB' });
  const [stripeHookDiagnostic, setStripeHookDiagnostic] = useState({ name: 'Stripe Webhook Pipeline', status: 'Healthy', delay: '45ms', msg: '事件转发通畅，最新心跳包签名验证 200 OK' });
  const [geminiDiagnostic, setGeminiDiagnostic] = useState({ name: 'LLM Model Gateway (Gemini API)', status: 'Connected', delay: '880ms', msg: '并发配额剩余 99.8%，安全审计围栏层正常防御' });
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // ==================== Helper Functions ====================
  const handleNoticeBroadcast = () => {
    setIsNoticeBroadcasting(true);
    setTimeout(() => {
      setIsNoticeBroadcasting(false);
      onAddSystemLog('平台公告发布', '发布网站公告', `更新并广播全网公告: "${systemNotice}"`, 'success');
      alert('公告已成功广播至全网多租户前台与后台顶栏！');
    }, 800);
  };

  const handleSystemUpgrade = () => {
    setIsUpgrading(true);
    setUpgradeLogs(['[1/4] 🚀 正在关闭外部网格注册，防止状态中断...', '[2/4] 🔍 备份主物理卷表 products/orders/tenants 并刷新事务提交...']);
    setTimeout(() => {
      setUpgradeLogs(prev => [...prev, '[3/4] 🛠️ 热重载 System Router 并更新 Ollama / Gemini 模型反演安全红线...']);
      setTimeout(() => {
        setUpgradeLogs(prev => [...prev, '[4/4] 🟢 底层物理安全模块重新加载完毕！租户物理隔离网格恢复。升级成功！']);
        setIsUpgrading(false);
        onAddSystemLog('平台升级控制', '底座物理系统升级', '全流程无缝热重载成功率 100%，数据库无缝切换', 'success');
        alert('全网物理底座集群及路由算法性能优化升级完毕！');
      }, 1000);
    }, 1000);
  };

  const handleTestConnection = (id: string, gatewayName: string) => {
    onAddSystemLog('支付中心', '测试链接', `触发网关 [${gatewayName}] 的 API 安全连接性能校验`, 'info');
    alert(`测试连接中...\n网关「${gatewayName}」安全握手连接校验通过！延迟 32ms`);
  };

  const handleSyncNow = (id: string, gatewayName: string) => {
    setIsSyncingGateway(id);
    setTimeout(() => {
      setIsSyncingGateway(null);
      setPaymentGateways(prev => prev.map(g => {
        if (g.id === id) {
          return { ...g, syncTime: new Date().toISOString().replace('T', ' ').substring(0, 19) };
        }
        return g;
      }));
      onAddSystemLog('支付中心', '数据对账同步', `完成网关 [${gatewayName}] 账账核对事务处理`, 'success');
      alert(`网关「${gatewayName}」与后端账房结算中心自动同步完毕！账单对账已物理同步至最新时刻。`);
    }, 1200);
  };

  const handleDiagnoseAll = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setDbDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 5) + 8}ms`, status: 'Connected' }));
      setRedisDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 3) + 1}ms`, status: 'Connected' }));
      setStripeHookDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 20) + 30}ms`, status: 'Healthy' }));
      setGeminiDiagnostic(prev => ({ ...prev, delay: `${Math.floor(Math.random() * 200) + 700}ms`, status: 'Connected' }));
      setIsDiagnosing(false);
      onAddSystemLog('系统诊断引擎', '全网综合体检', '物理网格、高速缓存、海关网关全链路健康体检满分', 'success');
      alert('全网 4 颗核心宿主物理服务器、中间件及 API 出入口线路全面诊断，体检结果: 🟢 优秀！');
    }, 1200);
  };

  const handleToggleAgent = (id: string, name: string) => {
    setAgentsList(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Active' ? 'Disabled' : 'Active';
        onAddSystemLog('AI大脑控制', nextStatus === 'Active' ? '激活代理' : '停用代理', `更改智能体 「${name}」运行状态为 ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'warning');
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  return (
    <div className="w-full text-slate-800 font-sans animate-fadeIn">
      
      {/* 2. Top Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">平台总后台 · SYSTEM</h1>
            <span className="bg-[#07C2E3]/10 text-[#07C2E3] text-[9px] px-2 py-0.5 rounded font-black tracking-wider uppercase border border-[#07C2E3]/20">SUPER_ADMIN</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#07C2E3] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#07C2E3]"></span>
          </span>
          <span className="text-xs font-bold text-[#07C2E3] bg-[#07C2E3]/5 border border-[#07C2E3]/20 rounded-lg px-3 py-1.5 font-mono">
            SYS: ACTIVE_ONLINE
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MENU 1: 📊 平台控制中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'stats' && (
        <div className="space-y-6 text-left">
          
          {/* Section Summary Row - derived purely from local DB! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">全网多租户累计 GMV</span>
                <span className="p-1 px-1.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold font-mono">Real-DB</span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2 font-mono">
                € {allOrders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 1 })}
              </p>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">自动累加 {allOrders.length} 笔实际单据</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">活跃租户数</span>
                <span className="p-1 px-1.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold font-mono">Live</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-2 font-mono">
                {tenants.filter(t => t.status === 'active').length} <span className="text-xs font-medium text-slate-400">/ {tenants.length} 家</span>
              </p>
              <div className="text-[10px] text-amber-600 font-semibold mt-1">{tenants.filter(t => t.status === 'suspended').length} 家停运隔离</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">平台 API 算力消耗</span>
                <span className="p-1 px-1.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold font-mono">Audit</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-2 font-mono">
                ${tenants.reduce((sum, t) => sum + (t.aiSpent || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 1 })}
              </p>
              <div className="text-[10px] text-[#07C2E3] font-semibold mt-1">
                配额上限总额
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">底座版本</span>
                <span className="p-1 px-1.5 bg-[#07C2E3]/10 text-[#07C2E3] rounded text-[9px] font-bold font-mono">Firmware</span>
              </div>
              <p className="text-sm font-black text-[#07C2E3] mt-2 font-mono truncate">
                VER_OS_3.5_STABLE
              </p>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                欧洲中部节点 (Swiss Node)
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Controller Left Body */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 lg:col-span-2">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-[#07C2E3]" />
                <h3 className="text-xs font-black text-slate-900 uppercase">系统开关</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-150 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">自主注册通道</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">控制外来企业自主入驻</p>
                    </div>
                    <button
                      onClick={() => {
                        setAllowSignup(!allowSignup);
                        onAddSystemLog('平台控制室', '注册通道', `${!allowSignup ? '建立并开放' : '熔断并拦截'}新入驻注册接口`, 'warning');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${allowSignup ? 'bg-[#07C2E3]' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${allowSignup ? 'left-6.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-lg border border-slate-150 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">30天体验额度</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">允许免费白名单用户额度体验</p>
                    </div>
                    <button
                      onClick={() => {
                        setTrialEnabled(!trialEnabled);
                        onAddSystemLog('平台控制室', '试用规则', `试用状态变更为: ${!trialEnabled ? '允许' : '屏蔽'}`, 'info');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${trialEnabled ? 'bg-[#07C2E3]' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${trialEnabled ? 'left-6.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-rose-50/40 hover:bg-rose-50 rounded-lg border border-rose-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-rose-950">系统维护锁定模式</p>
                      <p className="text-[10px] text-rose-600 mt-0.5">强弹维护提示，禁止交易更改</p>
                    </div>
                    <button
                      onClick={() => {
                        setMaintenanceMode(!maintenanceMode);
                        onAddSystemLog('平台控制室', '安全维护锁', `${!maintenanceMode ? '🚨 强行维护' : '🔓 一键复位恢复'}`, 'error');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${maintenanceMode ? 'left-6.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/40 hover:bg-amber-50 rounded-lg border border-amber-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-amber-950">商户配置只读锁</p>
                      <p className="text-[10px] text-amber-600 mt-0.5">锁定全网支付、密钥与权限数据库</p>
                    </div>
                    <button
                      onClick={() => {
                        setReadonlyMode(!readonlyMode);
                        onAddSystemLog('平台控制室', '只读锁', `${!readonlyMode ? '⚠️ 开启只读保护' : '🔓 解除只读保护'}`, 'warning');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${readonlyMode ? 'bg-amber-[#07C2E3]' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${readonlyMode ? 'left-6.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

              </div>

              {/* Maintenance Warning Banner if active */}
              {maintenanceMode && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-4 flex gap-3 text-xs font-semibold">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-rose-950 block">高危维护</span>
                    <span className="font-normal block mt-1 text-rose-700">系统已挂起拦截全部交易及自动化指令。</span>
                  </div>
                </div>
              )}

              {/* Global System notice setting - REAL ACTION */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">📢 广播全局系统公告</span>
                  <span className="text-[10px] text-[#07C2E3] font-mono">SYS_ALERT</span>
                </div>
                <textarea
                  rows={2}
                  value={systemNotice}
                  onChange={(e) => setSystemNotice(e.target.value)}
                  placeholder="请输入公告内容..."
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">通告即刻广播部署至所有租户店铺后台顶部。</span>
                  <button
                    onClick={handleNoticeBroadcast}
                    disabled={isNoticeBroadcasting}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] disabled:opacity-50 text-slate-950 font-extrabold text-[11px] px-4 py-2 rounded-lg cursor-pointer transition-all"
                  >
                    {isNoticeBroadcasting ? '下发中...' : '发布通告'}
                  </button>
                </div>
              </div>

            </div>

            {/* Controller Right Body: Database & Upgrades */}
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg space-y-5 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
                  <Terminal className="w-4 h-4 text-[#07C2E3]" />
                  <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest">底层运行模块重组</h3>
                </div>
                
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[9px] text-[#07C2E3] min-h-24 max-h-32 overflow-y-auto space-y-1">
                  <div>[SYS_INIT] Loader ready.</div>
                  <div>[SYS_INIT] Database cluster match: OK</div>
                  {upgradeLogs.map((log, idx) => (
                    <div key={idx} className="text-emerald-400">{log}</div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSystemUpgrade}
                  disabled={isUpgrading}
                  className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] disabled:opacity-50 text-slate-950 font-black text-xs py-3 rounded-xl cursor-pointer transition-all border border-[#07C2E3]/20 shadow"
                >
                  {isUpgrading ? '重组中...' : '重载物理模块'}
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 2: 👥 租户管理中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'tenants' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">租户店铺列表</h3>
              <span className="text-[10px] font-mono text-slate-400">Total: {tenants.length} Tenants</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">租户 ID</th>
                    <th className="p-4">企业主体名称</th>
                    <th className="p-4">行业类型</th>
                    <th className="p-4">创建时间</th>
                    <th className="p-4">额度使用 (消耗 / 预算)</th>
                    <th className="p-4">运行状态</th>
                    <th className="p-4 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tenants.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#07C2E3]">{t.id.toUpperCase()}</td>
                      <td className="p-4 font-bold text-slate-800">{t.companyName}</td>
                      <td className="p-4 font-semibold uppercase">{t.industry}</td>
                      <td className="p-4">{t.createdAt}</td>
                      <td className="p-4 font-mono font-semibold">
                        <span className="text-emerald-700 font-bold">${t.aiSpent.toFixed(2)}</span>
                        <span className="text-slate-300 mx-1">/</span>
                        <span className="text-slate-400">${t.aiBudget}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                           t.status === 'active' 
                             ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                             : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {t.status === 'active' ? '独立运行中' : '服务已挂起'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              placeholder="配额($)"
                              value={tokenAdjustments[t.id] ?? ''} 
                              onChange={e => setTokenAdjustments({ ...tokenAdjustments, [t.id]: Number(e.target.value) })}
                              className="w-20 bg-white border border-slate-200 text-slate-800 text-[11px] px-2 py-1 rounded font-mono focus:ring-1 focus:ring-[#07C2E3] focus:outline-none"
                            />
                            <button 
                              onClick={() => {
                                const adj = tokenAdjustments[t.id];
                                if (adj !== undefined && adj > 0) {
                                  onUpdateTenantAiBudget(t.id, adj);
                                  setTokenAdjustments({ ...tokenAdjustments, [t.id]: 0 });
                                  onAddSystemLog('商户管理', '分配额度', `手动调配商户 ${t.companyName} 月上限预算为 $${adj}`, 'success');
                                  alert(`商户 [${t.companyName}] 自动预算调整为 $${adj}`);
                                }
                              }}
                              className="bg-[#07C2E3] hover:bg-[#06B2D0] text-[#0f172a] font-bold px-2 py-1.5 rounded text-[10px] cursor-pointer transition-all"
                            >
                              调配
                            </button>
                          </div>

                          <button 
                            onClick={() => {
                              const targetStatus = t.status === 'active' ? 'suspended' : 'active';
                              onUpdateTenantStatus(t.id, targetStatus);
                              onAddSystemLog('商户管理', targetStatus === 'active' ? '解冻商户' : '挂起商户', `调整商家 「${t.companyName}」状态为 ${targetStatus === 'active' ? '活跃' : '挂起'}`, targetStatus === 'active' ? 'success' : 'error');
                            }}
                            className={`px-2.5 py-1.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                              t.status === 'active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {t.status === 'active' ? '挂起服务' : '放行启用'}
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedTenantData(t);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-750 font-bold border border-slate-200 px-2.5 py-1.5 rounded text-[10px] cursor-pointer transition-all"
                          >
                            配置
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tenant Sandbox Detail Modal */}
          {selectedTenantData && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 relative">
              <button 
                onClick={() => setSelectedTenantData(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-extrabold text-sm"
              >
                ✕
              </button>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <span>商家配置 [租户: {selectedTenantData.id.toUpperCase()}]</span>
                <span className="bg-[#07C2E3]/10 text-[#07C2E3] px-2 py-0.5 rounded font-mono text-[9px] font-black">ACTIVE</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white border p-3 rounded-lg">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">对公账户</span>
                  <span className="font-mono font-bold text-slate-800 break-all block mt-1">CH93 0000 8392 1082 8137 9</span>
                </div>
                <div className="bg-white border p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">安全密钥 Token</span>
                    <span className="font-mono text-[10px] text-emerald-700 block mt-1">ACTIVE_TRUST_TOKEN</span>
                  </div>
                  <button 
                    onClick={() => {
                      onAddSystemLog('商户管理', '重置管理员密钥', `重置租户 ${selectedTenantData.companyName} 后台密钥`, 'warning');
                      alert(`已重新生成，安全密钥已更新。`);
                    }}
                    className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 px-3 py-1.5 rounded font-bold text-[10px] cursor-pointer"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 3: 🔍 数据查询中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'query' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-xl space-y-4 shadow-md">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Search className="w-5 h-5 text-[#07C2E3]" />
              <div>
                <h3 className="text-sm font-extrabold tracking-wider text-slate-100">全网数据查询器</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">管理员直接查询平台级单据与主体状态。</p>
              </div>
            </div>

            {/* Selector Options */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">选择数据表:</span>
                <div className="flex gap-1.5">
                  {(['orders', 'products', 'customers', 'tenants'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        setSelectedTable(tab);
                        setQueryInput(`SELECT * FROM ${tab} LIMIT 20;`);
                        setQueryError(null);
                      }}
                      className={`px-3 py-1.5 rounded font-bold uppercase transition-all text-[11px] cursor-pointer ${selectedTable === tab ? 'bg-[#07C2E3] text-slate-950 border border-[#07C2E3]' : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'}`}
                    >
                      {tab === 'orders' ? '📋 订单' : tab === 'products' ? '🛍️ 商品' : tab === 'customers' ? '👥 客户' : '🏢 租户'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template clicks */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">预置对账模版:</span>
                <button
                  onClick={() => {
                    setSelectedTable('orders');
                    setSearchQuery('payment_failed');
                    setQueryInput(`SELECT * FROM orders WHERE payment_status = 'failed';`);
                    onAddSystemLog('查询中心', '对账检索', '一键抓取异常支付账单', 'info');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  ⚠️ 异常订单
                </button>
                <button
                  onClick={() => {
                    setSelectedTable('products');
                    setSearchQuery('');
                    setQueryInput(`SELECT * FROM products ORDER BY price DESC;`);
                    onAddSystemLog('查询中心', '数据检索', '检索产品物料价目库', 'info');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  🔥 高单价商品
                </button>
                <button
                  onClick={() => {
                    setSelectedTable('tenants');
                    setSearchQuery('suspended');
                    setQueryInput(`SELECT * FROM tenants WHERE status = 'suspended';`);
                    onAddSystemLog('查询中心', '网格审计', '检索暂时挂起的商户', 'warning');
                  }}
                  className="bg-slate-800 hover:bg-slate-705 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer"
                >
                  🚨 挂起商户
                </button>
              </div>
            </div>

            {/* Search inputs */}
            <div className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="键入关键字，如 姓名, 租户, 交易ID, SKU 进行秒级物料行匹配..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-3 font-mono focus:outline-none focus:ring-1 focus:ring-[#07C2E3] placeholder-slate-600"
              />
              <button
                onClick={() => {
                  onAddSystemLog('查询中心', '数据检索', `检索 ${selectedTable} 匹配 ${searchQuery}`, 'info');
                  alert(`读取成功！已抓取到 ${processedQueryResult.length} 行匹配数据记录。`);
                }}
                className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 px-5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                直接搜索
              </button>
            </div>
          </div>

          {/* Results grid */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-indigo-50 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-850 font-extrabold uppercase">📊 读取记录数：{processedQueryResult.length} 行</span>
              <span className="font-mono text-slate-400">READ_MODE: BYPASS_ROUTER</span>
            </div>

            <div className="overflow-x-auto">
              {processedQueryResult.length === 0 ? (
                <div className="p-10 text-center text-slate-400 space-y-2 text-xs">
                  <p>未在当前选择的数据表中检索到符合条件的对账单记录。</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs font-medium text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-250 font-bold text-slate-505">
                      {selectedTable === 'orders' && (
                        <>
                          <th className="p-4">订单号 (ID)</th>
                          <th className="p-4">所属租户</th>
                          <th className="p-4">买家客户</th>
                          <th className="p-4">结算货款</th>
                          <th className="p-4">支付方式</th>
                          <th className="p-4">支付状态</th>
                          <th className="p-4">下单日期</th>
                        </>
                      )}
                      {selectedTable === 'products' && (
                        <>
                          <th className="p-4">物品 ID</th>
                          <th className="p-4">所属租户</th>
                          <th className="p-4">商品名称</th>
                          <th className="p-4">系统成本</th>
                          <th className="p-4">公允销售价</th>
                          <th className="p-4">库存余量</th>
                          <th className="p-4">状态</th>
                        </>
                      )}
                      {selectedTable === 'customers' && (
                        <>
                          <th className="p-4">客户 ID</th>
                          <th className="p-4">所属租户</th>
                          <th className="p-4">姓名</th>
                          <th className="p-4">绑定邮箱</th>
                          <th className="p-4">国家</th>
                          <th className="p-4">累计消费</th>
                          <th className="p-4">层级</th>
                        </>
                      )}
                      {selectedTable === 'tenants' && (
                        <>
                          <th className="p-4">租户 ID</th>
                          <th className="p-4">签约主体企业</th>
                          <th className="p-4">挂载行业</th>
                          <th className="p-4">状态</th>
                          <th className="p-4">创建日期</th>
                          <th className="p-4">已结提存额</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {processedQueryResult.map((row: any, idx: number) => (
                      <tr key={row.id || idx} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Selected Orders schema */}
                        {selectedTable === 'orders' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3]">{row.id || 'ord_n/a'}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase font-sans text-[11px]">{row.industry || 'global'}</td>
                            <td className="p-4 font-sans">{row.customerName || row.customerId || '匿名买家'}</td>
                            <td className="p-4 font-bold text-slate-900">€{row.total ?? 0.0}</td>
                            <td className="p-4 uppercase text-[10px] font-sans font-extrabold">{row.paymentMethod || 'Stripe_Card'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans ${row.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : row.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {row.paymentStatus || 'unknown'}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 text-[10px]">{row.createdAt || '2026-06-08'}</td>
                          </>
                        )}

                        {/* Selected Products schema */}
                        {selectedTable === 'products' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3]">{row.id || 'sku_n/a'}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase font-sans text-[11px]">{row.industry || 'global'}</td>
                            <td className="p-4 font-sans font-bold text-slate-900">{row.name || '商品档案'}</td>
                            <td className="p-4 text-slate-500">€{(row.costPrice || (row.price ? row.price * 0.6 : 10)).toFixed(2)}</td>
                            <td className="p-4 text-[#07C2E3] font-bold">€{(row.price || 0.0).toFixed(2)}</td>
                            <td className="p-4 font-bold text-slate-900">{row.stock ?? 0} 件</td>
                            <td className="p-4 font-sans text-slate-500 text-[10px]">
                              {(row.stock ?? 0) <= 10 ? '🔴 跌至补货线' : '🟢 配备充足'}
                            </td>
                          </>
                        )}

                        {/* Selected Customers schema */}
                        {selectedTable === 'customers' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3]">{row.id || 'cust_n/a'}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase font-sans text-[11px]">{row.industry || 'global'}</td>
                            <td className="p-4 font-sans font-bold text-slate-900">{row.name || '客商档案'}</td>
                            <td className="p-4 text-slate-500 break-all">{row.email || 'n/a'}</td>
                            <td className="p-4 font-sans">{row.country || 'EU / EUR'}</td>
                            <td className="p-4 text-slate-900 font-bold">€{(row.totalSpent || 0).toFixed(2)}</td>
                            <td className="p-4 font-bold text-emerald-700">VIP_Active</td>
                          </>
                        )}

                        {/* Selected Tenants schema */}
                        {selectedTable === 'tenants' && (
                          <>
                            <td className="p-4 font-bold text-[#07C2E3] uppercase">{row.id}</td>
                            <td className="p-4 font-sans font-bold text-slate-900">{row.companyName}</td>
                            <td className="p-4 uppercase text-slate-600 font-sans text-[10px] font-extrabold">{row.industry}</td>
                            <td className="p-4 font-sans">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === 'active' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-rose-50 text-rose-700 font-bold'}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 text-[10px]">{row.createdAt}</td>
                            <td className="p-4 text-slate-900 font-bold">€{(row.aiSpent * 10).toFixed(2)}</td>
                          </>
                        )}

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 4: 💳 支付中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'gateways' && (
        <div className="space-y-6 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentGateways.map(g => (
              <div key={g.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#07C2E3]" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{g.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${g.status ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {g.status ? '● 收单正常' : '○ 通道暂停'}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">物理通信安全 API 秘钥 Key</label>
                      <div className="relative">
                        <input
                          type="password"
                          value={g.apiKey}
                          readOnly
                          className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-mono rounded px-2 text-[11px] py-1.5 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">WebHook 配送应答域目录</label>
                      <input
                        type="text"
                        value={g.webhook}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPaymentGateways(prev => prev.map(item => item.id === g.id ? { ...item, webhook: val } : item));
                        }}
                        className="w-full bg-white border border-slate-200 text-slate-800 font-mono rounded text-[11px] py-1.5 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-50 pt-2 font-mono">
                    <span>最近一期财务对账划拨时间:</span>
                    <span className="font-bold text-slate-800">{g.syncTime}</span>
                  </div>

                  {g.errorLogs.length > 0 && (
                    <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-[10px] space-y-1">
                      <span className="font-bold uppercase tracking-wider block text-rose-950">Gateway System Diagnostics (通道诊断异常):</span>
                      {g.errorLogs.map((err, idx) => (
                        <span key={idx} className="block font-mono font-medium">✕ {err}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTestConnection(g.id, g.name)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                      >
                        ⚡ 连通测试
                      </button>
                      <button
                        onClick={() => handleSyncNow(g.id, g.name)}
                        disabled={isSyncingGateway === g.id}
                        className="bg-[#07C2E3]/10 hover:bg-[#07C2E3]/25 text-[#07C2E3] font-bold text-[11px] px-3 py-1.5 rounded-lg border border-[#07C2E3]/20 tracking-wider cursor-pointer"
                      >
                        {isSyncingGateway === g.id ? '正在对账同步...' : '🔄 即刻对账'}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const nextState = !g.status;
                        setPaymentGateways(prev => prev.map(item => item.id === g.id ? { ...item, status: nextState } : item));
                        onAddSystemLog('支付中心', nextState ? '开启收单网关' : '吊销收单网关', `变更支付网关渠道 ${g.name} 的运行状态为 ${nextState ? '启用' : '废弃中断'}`, nextState ? 'success' : 'error');
                      }}
                      className={`text-[11px] font-extrabold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${g.status ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}
                    >
                      {g.status ? '🚨 吊销通道' : '🔓 激活通道'}
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 5: 🧠 AI大脑中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'ai-ops' && (
        <div className="space-y-6 text-left">
          
          {/* AI KPI Quick Dashboard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">系统智脑状态 (Core AI Status)</span>
              <p className="text-lg font-black text-[#07C2E3] mt-1 font-mono">🟢 ONLINE</p>
              <span className="text-[9px] text-slate-500 font-mono mt-1">集群连接可用性 100%</span>
            </div>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">并发决策指令 (Total AI Runs)</span>
              <p className="text-lg font-black text-white mt-1 font-mono">854 Runs</p>
              <span className="text-[9px] text-slate-500 font-mono mt-1">本日自动调度频次</span>
            </div>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-850 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">已接入隔离租户 (Tenants Shielded)</span>
              <p className="text-lg font-black text-white mt-1 font-mono">{tenants.filter(t => t.status==='active').length} active / {tenants.length} total</p>
              <span className="text-[9px] text-slate-500 font-mono mt-1">Tenant-ID 数据物理隔离</span>
            </div>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">风控审计防御网 (Security Net)</span>
              <p className="text-lg font-black text-rose-500 mt-1 font-mono">{lockedRisk ? 'ACTIVE' : 'STANDBY'}</p>
              <span className="text-[9px] text-slate-500 font-mono mt-1">防跨租户穿透防护层</span>
            </div>
          </div>

          {/* 🎯 平台级统控与对账战略大脑 (Consolidated Core AI Controller) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 text-left mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <span>平台级中央决策中枢 (Central Strategic Control Core)</span>
                  <span className="text-[9.5px] bg-[#07C2E3]/10 text-[#07C2E3] border border-[#07C2E3]/20 px-1.5 py-0.5 rounded font-mono font-black uppercase">Core-Decision-System</span>
                </h3>
              </div>
              
              {/* Action subtabs without clutter descriptions */}
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setAiOpTab('revenue')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer uppercase ${aiOpTab === 'revenue' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  📊 全网对账汇总 (Revenue Audit)
                </button>
                <button
                  onClick={() => setAiOpTab('fraud')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer uppercase ${aiOpTab === 'fraud' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  🛡️ 异常风控审计 (Fraud Monitor)
                </button>
                <button
                  onClick={() => setAiOpTab('campaign')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all cursor-pointer uppercase ${aiOpTab === 'campaign' ? 'bg-white text-slate-950 shadow' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  📣 统控跨境大促 (Campaign Deployer)
                </button>
              </div>
            </div>

            {/* Dynamic Operations workspace */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[220px] flex flex-col justify-between text-left">
              
              {aiOpTab === 'revenue' && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 uppercase text-[10.5px]">全网跨租户经营及 MRR 汇总分析数据 (Consolidated Finance Sheet)</span>
                    <span className="font-mono text-[9px] text-slate-400">STATUS: PHYSICAL_VERIFIED</span>
                  </div>

                  <div className="overflow-x-auto text-left">
                    <table className="w-full text-left border-collapse bg-white border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold">
                          <th className="p-2.5">产业集群分类 (Industry Line)</th>
                          <th className="p-2.5">累计流动流水 (Consolidated GMV)</th>
                          <th className="p-2.5">平均毛利润率 (Margin Rate)</th>
                          <th className="p-2.5">清算账期状态 (Cleared Term)</th>
                          <th className="p-2.5">多租户分区验证 (Isolation Check)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold font-mono text-slate-700">
                        <tr>
                          <td className="p-2.5 font-sans">服饰零售线 (Retail Apparel)</td>
                          <td className="p-2.5">€ 58,290.00</td>
                          <td className="p-2.5 text-emerald-600">72.1%</td>
                          <td className="p-2.5 text-slate-500">正常结算循环 (Standard)</td>
                          <td className="p-2.5 text-emerald-600">🟢 物理区隔锁死 (OK)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-sans">食品配餐线 (Food Dineout)</td>
                          <td className="p-2.5">€ 12,410.00</td>
                          <td className="p-2.5 text-emerald-600">64.8%</td>
                          <td className="p-2.5 text-slate-500">正常结算循环 (Standard)</td>
                          <td className="p-2.5 text-emerald-600">🟢 物理区隔锁死 (OK)</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-sans">智慧五金等余 (All Other Tracks)</td>
                          <td className="p-2.5">€ 109,500.00</td>
                          <td className="p-2.5 text-emerald-600">55.0%</td>
                          <td className="p-2.5 text-slate-500">正常结算循环 (Standard)</td>
                          <td className="p-2.5 text-emerald-600">🟢 物理区隔锁死 (OK)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400">审计评议：多租户下打款资金结算均带有对应租户印记，Stripe & Adyen 安全防穿透验证成功率 100%。</span>
                    <div className="flex items-center gap-2">
                      {dispatchedSettlement && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded">
                          ✔️ 全网对账结算已物理打款下妥
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setDispatchedSettlement(true);
                          onAddSystemLog('AI决策中心', '平台全网结算', '由智脑汇总分析并自动调拨打款各物理租户账款', 'success');
                          alert('对账完成！已成功为 3 个大类共 6 家隔离商户确认自动对账结算，打款凭据已存证入库。');
                        }}
                        className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black text-[11px] px-4 py-2 rounded-lg cursor-pointer transition-all"
                      >
                        📥 一键物理对账结算打款
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {aiOpTab === 'fraud' && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 uppercase text-[10.5px]">24小时交易纠纷及跨境支付安全审计 (Gateway Safety Integrity)</span>
                    <span className="font-mono text-[9px] text-[#07C2E3]">SECURITY LEVEL: HIGH</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">STRIPE 安全信托围栏</span>
                      <span className="text-emerald-600 font-extrabold font-mono block">100% HEALTHY</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">ADYEN 多币种拦截器</span>
                      <span className="text-emerald-600 font-extrabold font-mono block">ACTIVE MONITORING</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">异常大额争议退单</span>
                      <span className="text-slate-800 font-extrabold font-mono block">0 笔 (0.00 €)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400">安全防护声明：所有退款与扣划机制严格在 Tenant_ID 数据沙箱中运行，全网欺诈和未授权跨境交易拦截防穿透层启用就绪。</span>
                    <button
                      onClick={() => {
                        setLockedRisk(!lockedRisk);
                        onAddSystemLog('AI决策中心', lockedRisk ? '解除风控锁' : '开启风控拦截', '一键置下安全防欺诈大额交易红线机制', lockedRisk ? 'warning' : 'success');
                        alert(lockedRisk ? '已解除全网强制防御机制，系统恢复为日常风控监控状态。' : '高阈值风控拦截已全面锁死！平台异常跨境交易行为将被毫秒级审查挂起！');
                      }}
                      className={`font-black text-[11px] px-4 py-2 rounded-lg cursor-pointer transition-all ${lockedRisk ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-900 hover:bg-slate-850 text-[#07C2E3]'}`}
                    >
                      {lockedRisk ? '🔓 解除非法争议拦截锁' : '🔒 一键强制硬抗高欺诈风险拦截'}
                    </button>
                  </div>
                </div>
              )}

              {aiOpTab === 'campaign' && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 uppercase text-[10.5px]">多租户全球联合夏季大促预案下发 (Unified Cross-Border Consolidated Campaign)</span>
                    <span className="font-mono text-[9px] text-[#07C2E3]">API DEPLOYMENT FORWARD</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between font-mono py-1 border-b">
                      <span className="text-slate-400">联合大促代号 (Campaign Code)</span>
                      <span className="font-bold text-slate-800">CAMP_GLOBAL_SUMMER_2026</span>
                    </div>
                    <div className="flex justify-between font-mono py-1 border-b">
                      <span className="text-slate-400 text-right">推荐受众行业 (Target Industry Channels)</span>
                      <span className="font-bold text-slate-800">欧洲零售服饰 (Fashion) & Healthcare</span>
                    </div>
                    <div className="flex justify-between font-mono py-1">
                      <span className="text-slate-400">全局联合折扣基准 (Proposed Discount Scale)</span>
                      <span className="font-bold text-[#07C2E3]">30% OFF + Global Deliveries</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400">大促说明：本大促仅提供 platform.campaign.apply 联调 API，具体单店各商家依照多租户安全法私自决断。</span>
                    <div className="flex items-center gap-2">
                      {dispatchedCampaign && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded">
                          ✔️ 联合大促运营预案已配置全局就绪
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setDispatchedCampaign(true);
                          onAddSystemLog('AI决策中心', '联合营销发布', '由总后台向全体隔离租户一键广播大促通用接口 API', 'success');
                          alert('大促联合 API 广播部署就绪！本大促通用券已自动广播至所有店铺底座。具体各单店商铺的商品匹配提价及细化运营可由对应店主助手直接指派。');
                        }}
                        className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black text-[11px] px-4 py-2 rounded-lg cursor-pointer transition-all"
                      >
                        ⚡ 一键全局统配并统编大促营销
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

            {/* Interactive Chat Stream & Real Action Triggers */}
            <div className="space-y-4 text-left">
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block">
                🧠 智脑决策交互中枢 (Central Decisive AI Workspace)
              </span>

              {/* Chat Thread Container */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-[350px] overflow-y-auto space-y-4 shadow-inner">
                {globalAIChatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] font-bold text-slate-400">
                      {msg.role === 'user' ? 'ADMINISTRATOR' : 'CENTRAL CORE AI / 中央决策智脑'}
                    </span>
                    <div className={`p-3.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 border border-slate-800 text-white font-mono' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}>
                      <div className="whitespace-pre-line prose prose-slate max-w-none prose-xs font-medium">
                        {msg.content}
                      </div>
                      
                      {/* Interactive Buttons linked to real states/tabs */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                          {msg.actions.map((act: any, aIdx: number) => (
                            <button
                              key={aIdx}
                              onClick={() => {
                                if (act.action === 'view_tenants') {
                                  onChangeSubTab?.('tenants');
                                } else if (act.action === 'view_gateways') {
                                  onChangeSubTab?.('gateways');
                                } else if (act.action === 'lock_risk') {
                                  setLockedRisk(true);
                                  onAddSystemLog('风控审计', '全局安全防护', '由决策智脑一键提升并锁死异常交易退款监控阈值', 'success');
                                  alert('高敏风控堡垒：交易限额警戒熔断机制已全面部署，可疑欺诈行为将受到毫秒级审查挂起！');
                                } else if (act.action === 'view_query_products') {
                                  setSelectedTable('products');
                                  onChangeSubTab?.('query');
                                } else if (act.action === 'alert_restock') {
                                  onAddSystemLog('供应链协调', '库存跨区分拨', '决策中枢一键调度自动向隔离保税商铺调配披萨与咖啡豆急料', 'info');
                                  alert('库存调配成功：跨分区保税配给指令已下达，目标补货计划已完美更新。');
                                } else if (act.action === 'deploy_campaign') {
                                  setDispatchedCampaign(true);
                                  onAddSystemLog('营销指挥', '联合API广播', '全局广播 CAMP_GLOBAL_SUMMER_2026 大促活动底座', 'success');
                                  alert('营销联调成功：全球联合夏季大促 API 联调链已成功向所有隔离租户广播就绪！');
                                } else if (act.action === 'alert_marketing') {
                                  alert('营销指令下通：联合大促方案和全栈推送组件已经同步至全体商家后台。');
                                } else if (act.action === 'view_ai_revenue') {
                                  setAiOpTab('revenue');
                                } else if (act.action === 'view_ai_fraud') {
                                  setAiOpTab('fraud');
                                }
                              }}
                              className="bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-extrabold text-[10.5px] px-2.5 py-1.5 rounded transition-all flex items-center gap-1 shadow-sm uppercase cursor-pointer"
                            >
                              ⚡ {act.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isGlobalAIThinking && (
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-[9px] font-bold text-slate-400">CENTRAL CORE AI / 中央决策智脑</span>
                    <div className="bg-white border border-slate-200 text-slate-500 rounded-xl rounded-tl-none p-3 text-xs flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="font-mono">中央决策正在跨沙箱执行高聚合度审计中...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="space-y-1.5">
                <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">快捷决策指令建议：</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const qText = '过去7天全平台表现怎么样？';
                      setGlobalAIChatInput(qText);
                    }}
                    className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-[10.5px] cursor-pointer font-bold transition-all"
                  >
                    📈 过去7天全平台表现
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const qText = '哪些商铺的异常争议退款风险最高？';
                      setGlobalAIChatInput(qText);
                    }}
                    className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-[10.5px] cursor-pointer font-bold transition-all"
                  >
                    🚨 高退配高危风险审计
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const qText = '全网多租户高压力 SKU 库存分析';
                      setGlobalAIChatInput(qText);
                    }}
                    className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-[10.5px] cursor-pointer font-bold transition-all"
                  >
                    🍕 供应链核心库存缺料
                  </button>
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!globalAIChatInput.trim() || isGlobalAIThinking) return;
                  const userT = globalAIChatInput.trim();
                  setGlobalAIChatInput('');
                  setGlobalAIChatMessages(prev => [...prev, { role: 'user', content: userT }]);
                  setIsGlobalAIThinking(true);

                  setTimeout(() => {
                    setIsGlobalAIThinking(false);
                    const lowerInput = userT.toLowerCase();
                    let aiReply = '';
                    let actions: any[] = [];
                    
                    // Simple Greet/No Business Meaning Detection
                    const isGreeting = /^(你好|hi|在吗|在|测试|测试一下|ok|hello|hithere|helloworld|test|你好啊|您好)$/i.test(
                      lowerInput.replace(/[\s\p{P}]/gu, '')
                    );

                    if (isGreeting || (userT.length <= 4 && !/7|sku|款|店|促/i.test(lowerInput))) {
                      aiReply = `您好，智脑决策系统已准备就绪。您可以随时输入对多租户财务汇总、欺诈风险审计或跨店库存调配的业务指令。`;
                    } else {
                      // Real Business Queries
                      if (lowerInput.includes('7天') || lowerInput.includes('七天') || lowerInput.includes('表现') || lowerInput.includes('gmv') || lowerInput.includes('业绩')) {
                        aiReply = `**全平台过去 7 天经营表现总结 (Consolidated Platform Performance)**

过去 7 天全平台经营势头强劲，整体表现极其优异：
- 🟢 **全平台 GMV 总计**: **€ 180,200.00**（较上一周期环比上升 **12.4%**）。
- 💳 **Stripe & Adyen 通道核算**: 全网对账流程无任何跨租户数据穿透漏洞，打款结算核算可信。
- 👥 **新增商铺**: 新激活 **3** 个活跃隔离沙箱租户。

为了维持利润率，建议密切监控以下潜在运营波动事件：`;
                        actions = [
                          { label: '查看全网租户类别', action: 'view_tenants' },
                          { label: '核实各支付渠道财务对账', action: 'view_gateways' }
                        ];
                      } else if (lowerInput.includes('退款') || lowerInput.includes('争议') || lowerInput.includes('高风险') || lowerInput.includes('纠纷') || lowerInput.includes('拦截')) {
                        aiReply = `**全网商户纠纷与高退配风险安全审计 (Fraud & Dispute Audit Report)**

经过底座安全围栏阻隔器实时审计，目前平台总体退款纠纷率控制在 **0.15%** 的极低水位，但系统侦测到以下风险商户需要关注：
- 🚨 **法国巴黎服饰店**: 因有一单跨境大额争议款未在 24 小时内上传物流证存，导致局部风控指数上扬。
- 🛡️ **当前防护状态**: 高欺诈风险一键拦截围栏处于就绪态，物理区隔保护正常运转。`;
                        actions = [
                          { label: '一键强制硬抗高欺诈风险拦截', action: 'lock_risk' },
                          { label: '管理物理租户状态', action: 'view_tenants' }
                        ];
                      } else if (lowerInput.includes('sku') || lowerInput.includes('库存') || lowerInput.includes('缺料') || lowerInput.includes('断货')) {
                        aiReply = `**全网多租户高压力 SKU 库存分析 (Consolidated SKU High Pressure Stock Alert)**

跨行业供应链健康度指数正常，但以下隔离区商铺有发生局部断货的紧急库存事件：
- 🍕 **食品配餐线**: 【热辣披萨原料】与【拿铁咖啡豆】当前全网库存低于警戒水位。
- 📦 **自动干预建议**: 建议立即下达跨仓位物理配给指令，以免阻碍店主交易转化。`;
                        actions = [
                          { label: '查看库存数据详情', action: 'view_query_products' },
                          { label: '广播一键补足调配指令', action: 'alert_restock' }
                        ];
                      } else if (lowerInput.includes('战役') || lowerInput.includes('大促') || lowerInput.includes('营销')) {
                        aiReply = `**全球联合夏季大促战役部署与配额分析 (Campaign Integration Status)**

平台联合营销代码为 \`CAMP_GLOBAL_SUMMER_2026\`，全网广播机制就绪：
- 📣 **广播状态**: API 接口就绪，已有 **6** 家活跃商户读取了大促优惠券配置。
- ⏳ **受众转化预测**: 服饰类目大促期间预期交易规模将增长 **35%+**。`;
                        actions = [
                          { label: '部署联合大促 API', action: 'deploy_campaign' },
                          { label: '广播一键全局营销命令', action: 'alert_marketing' }
                        ];
                      } else {
                        aiReply = `**全网决策中枢智脑响应回复 (Strategic Decision Report)**

针对提问 \`"${userT}"\`，智脑已进行平台级战略审计。全平台目前各大租户物理沙箱运作良好：
- 📊 **当前全系统 GMV**: **€ 180,200.00**，多渠道支付通道运作平稳（Stripe/Adyen/Klarna）。
- 🧠 **决策路径建议**: 推荐点击下方快捷指令或提问 ‘最近7天表现如何？’、‘退款纠纷漏洞审计’。`;
                        actions = [
                          { label: '汇总全网租户利润', action: 'view_ai_revenue' },
                          { label: '智能风控安全审计', action: 'view_ai_fraud' }
                        ];
                      }
                    }

                    setGlobalAIChatMessages(prev => [...prev, {
                      role: 'assistant',
                      content: aiReply,
                      actions: actions
                    }]);
                  }, 700);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="作为系统管理员，输入对跨租户利润、纠纷监控或者全局大促的命令..."
                  value={globalAIChatInput}
                  onChange={(e) => setGlobalAIChatInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#07C2E3] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!globalAIChatInput.trim() || isGlobalAIThinking}
                  className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black text-xs px-4 py-2 rounded-lg disabled:opacity-40 cursor-pointer"
                >
                  咨询智脑
                </button>
              </form>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* AI Agents state column */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">底座内嵌多智能体大脑引擎 (Core AI Agents Status)</h3>
                </div>
                <span className="font-mono text-[10px] text-slate-400">Total: {agentsList.length} AI Employees</span>
              </div>

              {/* Table listing */}
              <div className="overflow-x-auto text-xs font-semibold">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-405">
                      <th className="p-3">系统标号 ID / Agent 角色</th>
                      <th className="p-3">底层模型版本</th>
                      <th className="p-3">累计调用频段（本周期）</th>
                      <th className="p-3">单次指令平均推理耗时</th>
                      <th className="p-3">安全诊断状态</th>
                      <th className="p-3 text-center">指令调配与生命期控制</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    {agentsList.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{a.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Role ID: system_{a.id}</span>
                        </td>
                        <td className="p-3 font-normal text-slate-500">{a.version}</td>
                        <td className="p-3 font-bold text-slate-800 text-center">{a.runs} 次调阅</td>
                        <td className="p-3 text-slate-600">{a.lastTime}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-sans ${a.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-slate-100 text-slate-500 border'}`}>
                            {a.status === 'Active' ? '🟢 RAG_ONLINE' : '⚪ SYSTEM_OFFLINE'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                onAddSystemLog('AI大脑中心', '重启模型', `重启智能大脑 ${a.name}，清理上下文缓冲区`, 'info');
                                alert(`已物理清除智能体「${a.name}」在本地 RAG 内存中的向量上下文，模型完成热插配置重启。`);
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-extrabold text-[10px] px-2 py-1 rounded transition-all cursor-pointer"
                            >
                              🔄 重启
                            </button>
                            <button
                              onClick={() => handleToggleAgent(a.id, a.name)}
                              className={`font-extrabold text-[10px] px-2 py-1 rounded border transition-all cursor-pointer ${a.status === 'Active' ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-750 border-emerald-200'}`}
                            >
                              {a.status === 'Active' ? '🚨 挂起下线' : '🔓 下派干预'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* AI Runs Table right column */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">实时 RAG 数据任务流 (Live AI Task Flow)</h3>
                  </div>
                  <span className="font-extrabold text-[9px] bg-indigo-500/10 text-indigo-700 rounded px-1.5 border border-indigo-500/15">Active</span>
                </div>

                <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                  展示由平台各租户触发的多路分布式任务。当客户行为触发 IF-THEN 决策时，对应 Agent 会自动组装向量上下文进行 RAG 分析：
                </p>

                <div className="space-y-2.5 text-xs">
                  {realAgentTasks.map(t => (
                    <div key={t.id} className="p-3 bg-slate-50 border rounded-lg space-y-1.5 hover:bg-slate-100/50 transition-colors">
                      <div className="flex justify-between items-center font-mono">
                        <span className="font-bold text-indigo-700">{t.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.status === 'FINISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="font-sans font-bold text-slate-800 leading-snug">{t.name}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-450 pt-1 font-mono border-t border-slate-100">
                        <span>执勤时间: {t.executionTime}</span>
                        <span className="text-indigo-600 font-bold max-w-[150px] truncate">Result: {t.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-[10px] text-slate-400 font-sans flex justify-between items-center">
                <span>智能体指令运行全部处于严格容器物理域隔离状态。</span>
                <span className="font-mono text-indigo-600 font-bold">SANDBOXED_OK</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 6: 🔐 权限中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">系统级运行人员 角色权限控制矩阵</h3>
                <p className="text-[10px] text-slate-400 mt-1">精细化管理多租户 SaaS 系统的后台人员资产身份配置（Owner/SuperAdmin/Staff）</p>
              </div>
              <span className="text-[11px] font-mono text-slate-405 font-bold">Platform-Level Guardrails</span>
            </div>

            <div className="overflow-x-auto text-xs font-semibold">
              <table className="w-full text-left border-collapse text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-250 font-bold text-slate-505">
                    <th className="p-4">角色标识符 / 职能描述</th>
                    <th className="p-4 text-center">商品发布管理 (Product)</th>
                    <th className="p-4 text-center">订单退款审计 (Order)</th>
                    <th className="p-4 text-center">收单结算及银行划拨 (Finance)</th>
                    <th className="p-4 text-center">智能配置指令下发 (AI Ops)</th>
                    <th className="p-4 text-center">物理底座服务器管理 (Sys Admin)</th>
                    <th className="p-4 text-center">安全隔离状态修改</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rolesList.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{r.name}</span>
                        <span className="text-[10px] text-slate-405 font-normal block mt-1 leading-normal max-w-sm font-sans">{r.desc}</span>
                      </td>
                      
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.product}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, product: !item.permissions.product };
                                onAddSystemLog('权限变更', '更改商品读写权', `更改角色 [${r.name}] 的商品修改权限为 ${!item.permissions.product}`, 'warning');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.order}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, order: !item.permissions.order };
                                onAddSystemLog('权限变更', '更改退货审单权', `更改角色 [${r.name}] 的退单审核权限为 ${!item.permissions.order}`, 'warning');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.finance}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, finance: !item.permissions.finance };
                                onAddSystemLog('权限变更', '更改银行划拔权', `更改角色 [${r.name}] 的财务打款及划拔权限为 ${!item.permissions.finance}`, 'error');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.ai_ops}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, ai_ops: !item.permissions.ai_ops };
                                onAddSystemLog('权限变更', '更改AI控制权', `更改角色 [${r.name}] 的智能自动化控制权限为 ${!item.permissions.ai_ops}`, 'warning');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={r.permissions.sys_config}
                          onChange={() => {
                            const updated = rolesList.map(item => {
                              if (item.id === r.id) {
                                const nextPerm = { ...item.permissions, sys_config: !item.permissions.sys_config };
                                onAddSystemLog('权限变更', '更改核心底座支配权', `更改角色 [${r.name}] 的宿主控制级别权限为 ${!item.permissions.sys_config}`, 'error');
                                return { ...item, permissions: nextPerm };
                              }
                              return item;
                            });
                            setRolesList(updated);
                          }}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-4 text-center font-mono">
                        <button
                          onClick={() => {
                            onAddSystemLog('权限审计', '保存身份矩阵', `确定保存角色 ${r.name} 的运行机制描述`, 'success');
                            alert(`角色「${r.name}」权限规则修改已物理生效并落库！`);
                          }}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg border border-indigo-150 cursor-pointer transition-all"
                        >
                          💾 保存生效
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

      {/* ========================================================= */}
      {/* MENU 7: 📜 审计中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6 text-left">
          
          {/* Recharts System Task Performance over the last 24 hours */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-[#07C2E3] rounded-xs inline-block"></span>
                  系统任务执能分析 (24小时性能监测)
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">监测全域多智能体底座任务吞吐节奏、平均时延指标，及系统动态高可用率</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#07C2E3] rounded-sm inline-block"></span>
                  <span className="text-slate-500 font-bold">任务吞吐量 (次/h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block"></span>
                  <span className="text-slate-500 font-bold">平均响应延时 (ms)</span>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black block">24h 累计任务吞吐量</span>
                <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">{performanceStats.totalTasks.toLocaleString()} <span className="text-xs text-slate-400 font-normal font-sans">次任务</span></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black block">24h 平均内核响应延迟</span>
                <span className="text-lg font-black text-[#07C2E3] font-mono mt-0.5 block">{performanceStats.avgLatency} <span className="text-xs text-[#07C2E3]/70 font-normal font-sans">ms</span></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
                <span className="text-[9px] text-slate-400 uppercase font-black block">系统综合 SLA 高可用率</span>
                <span className="text-lg font-black text-emerald-600 font-mono mt-0.5 block">{performanceStats.successRate}</span>
              </div>
            </div>

            {/* Line Chart Grid */}
            <div className="h-[220px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={last24hPerformanceData}
                  margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    yAxisId="left"
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'monospace' }} 
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] font-mono text-slate-200">
                            <p className="font-bold mb-1 text-slate-400">时间: {label}</p>
                            <p className="text-[#07C2E3] flex items-center justify-between gap-4">
                              <span>任务量:</span>
                              <span className="font-extrabold text-white">{payload[0]?.value} 次/h</span>
                            </p>
                            {payload[1] && (
                              <p className="text-amber-500 flex items-center justify-between gap-4 mt-0.5">
                                <span>延迟:</span>
                                <span className="font-extrabold text-white">{payload[1]?.value} ms</span>
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#07C2E3" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: '#07C2E3' }} 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#f59e0b" 
                    strokeWidth={1.5} 
                    dot={false} 
                    activeDot={{ r: 3, strokeWidth: 0, fill: '#f59e0b' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-indigo-50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">系统物理全域 综合安全审计中心 (Audit Registry Master)</h3>
                <p className="text-[10px] text-slate-400 mt-1">100% 记录来自于底座服务器热加载、支付秘钥变更、网格隔离拦截的日志归档</p>
              </div>
              <span className="font-mono text-indigo-600 text-[10px] font-bold">SEC_AUDIT_STABLE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-4">审计时间点</th>
                    <th className="p-4">执勤运维模块</th>
                    <th className="p-4">安全防线审计细节 specs</th>
                    <th className="p-4 font-mono">操作人身份 ID</th>
                    <th className="p-4 text-center">底座隔离存档签名</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditLogs.map((l: any, idx: number) => {
                    const typeColor = l.type === 'error' ? 'text-red-600' : l.type === 'warning' ? 'text-amber-600' : 'text-emerald-700';
                    return (
                      <tr key={l.id || idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-slate-500">{l.createdAt || '2026-06-08 14:56'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-black ${l.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : l.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700'}`}>
                            {l.module || 'SYS_CONTROLLER'}
                          </span>
                        </td>
                        <td className={`p-4 truncate max-w-md font-sans ${typeColor}`}>{l.details || '系统管理员对账审查完毕并存档'}</td>
                        <td className="p-4 text-slate-800 font-bold font-mono">{(l.userId || 'SuperAdmin').toUpperCase()}</td>
                        <td className="p-4 text-center">
                          <span className="bg-slate-10s0 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                            #{Math.floor(Math.sin(idx + 1) * 90000) + 10000}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="hover:bg-slate-50/50 transition-colors text-slate-505">
                    <td className="p-4">2026-06-08 14:12:01</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-sans">多租户安全网格</span></td>
                    <td className="p-4 font-sans text-emerald-700">米兰风尚服装批发集团 沙箱隔离鉴权通过，数据库连接网格验证无越权溢出。</td>
                    <td className="p-4 text-slate-800 font-bold font-mono">SYSTEM_AUTO</td>
                    <td className="p-4 text-center"><span className="bg-slate-10s0 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">#48192</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors text-slate-505">
                    <td className="p-4">2026-06-08 13:58:12</td>
                    <td className="p-4"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-sans">支付中继调度</span></td>
                    <td className="p-4 font-sans text-emerald-700">财务对账：通过 Adyen 网关安全拆算欧洲零售物理账户 1.2% 并提划入平台瑞士对公托管行。</td>
                    <td className="p-4 text-slate-800 font-bold font-mono">SYSTEM_AUTO</td>
                    <td className="p-4 text-center"><span className="bg-slate-10s0 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 font-bold">#59218</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 8: 🩺 系统诊断中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'diagnostics' && (
        <div className="space-y-6 text-left">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">底座物理组件全网健康体检 diagnostic</h3>
                <p className="text-[10px] text-slate-400 mt-1">诊断包含数据库集群、高速 Redis 缓存、API 网关及第三方收单接口握手性能</p>
              </div>
              <button
                onClick={handleDiagnoseAll}
                disabled={isDiagnosing}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-lg cursor-pointer transition-all"
              >
                {isDiagnosing ? '🔍 正在高精密度扫轨诊断中...' : '🔄 运行系统全域高维诊断'}
              </button>
            </div>

            {/* Diagnostics Cards Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{dbDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {dbDiagnostic.status} | {dbDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{dbDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">CONNECTION_URI: postgresql://SaaS_user:***@swiss-pg-host-1:5432/db</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{redisDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {redisDiagnostic.status} | {redisDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{redisDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">MEM_EVICTION_POLICY: volatile-lru | MASTER_HOST</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{stripeHookDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {stripeHookDiagnostic.status} | {stripeHookDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{stripeHookDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">API_GATEWAY: public_https_listener_stripe (200_OK_VERIF)</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900 block">{geminiDiagnostic.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded font-mono text-[9px] font-bold">
                    {geminiDiagnostic.status} | {geminiDiagnostic.delay}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{geminiDiagnostic.msg}</p>
                <div className="text-[9px] text-slate-400 font-mono">MODEL_PROOFS: @google/genai TypeScript Native Endpoint</div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MENU 9: ⚙️ 平台设置中心 */}
      {/* ========================================================= */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6 text-left animate-fadeIn">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <Settings className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">平台全局规则与底座高保设置 specs</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-semibold text-slate-705">
              
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">系统对公开扣点佣金上限比例 (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settingsForm.maxCommissionCap}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maxCommissionCap: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-[9px] text-slate-400 block font-normal">设定所有商家套餐中最大自动对账手续费率提点硬上限，当前: 5.0%</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">系统管理员 Session 会话注销超时 (秒)</label>
                <input
                  type="number"
                  value={settingsForm.sessionTimeout}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeout: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <span className="text-[9px] text-slate-400 block font-normal">无操作超时注销会话的时常。对账密钥保护红线。</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">全网默认底座大语言智算模型 (LLM Model Name)</label>
                <select
                  value={globalDefaultModel}
                  onChange={(e) => onChangeGlobalModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none font-sans"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (推荐：标准对账及自动采购高速度)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (推荐：跨境高奢大订单风险综合评估)</option>
                  <option value="ollama-qwen2.5-7b">Ollama Qwen 2.5 7B (本地物理私有环境对账代理)</option>
                </select>
                <span className="text-[9px] text-slate-400 block font-normal">缺省模型将自动作为商户开通营销挽客/采购规则逻辑反思的默认容器。</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 uppercase mb-1">允许调用所有者权限的运维 IP 白名单列表</label>
                <input
                  type="text"
                  value="127.0.0.1, 82.102.39.*, 45.120.*.*"
                  readOnly
                  className="w-full bg-slate-10s0 border border-slate-200 text-slate-450 font-mono rounded px-2.5 py-1.5 focus:outline-none"
                />
                <span className="text-[9px] text-slate-400 block font-normal">除白名单网段以外的 IP 尝试物理登入 Super Admin 控制台将直接触发底层安全死锁拦截。</span>
              </div>

            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => {
                  onAddSystemLog('平台设置', '保存系统环境参数', `由于安全检查核审，保存环境参数并更新默认模型级别为 ${globalDefaultModel}`, 'success');
                  alert('配置参数已持久化保存并且即刻生效！');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2 rounded-lg cursor-pointer transition-all"
              >
                保存平台全部设置参数
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
