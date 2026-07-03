import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Globe, 
  Layers, 
  Bot, 
  ShieldAlert, 
  Sparkles, 
  MessageSquare, 
  Server, 
  CheckCircle, 
  XCircle, 
  Save, 
  TrendingUp, 
  Coins, 
  Lock, 
  Unlock, 
  Settings, 
  Plus, 
  Trash2, 
  Activity, 
  Mail, 
  Zap, 
  Cpu, 
  RefreshCw, 
  Search, 
  ArrowUpRight, 
  Key
} from 'lucide-react';
import { 
  IndustryType, 
  SaaSPlan, 
  PaymentGatewayConfig, 
  SmsMailChannelConfig, 
  AppInstallationTrace, 
  PlatformGlobalAiConfig 
} from '../types';

interface SuperAdminConsoleProps {
  // Multitenancy direct status
  tenants: any[];
  onToggleTenantStatus: (tenantId: string) => void;
  onUpdateTenantAiLimit: (tenantId: string, limit: number) => void;
  
  // App installation configurations
  marketItems: any[];
  addLog: (agent: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function SuperAdminConsole({ 
  tenants, 
  onToggleTenantStatus, 
  onUpdateTenantAiLimit,
  marketItems,
  addLog 
}: SuperAdminConsoleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'kpi' | 'tenants' | 'plans' | 'gateways' | 'comms' | 'ai' | 'apps'>('kpi');
  
  // 1. Live statistics presets (KPI metrics)
  const [platformMetrics, setPlatformMetrics] = useState({
    totalGmv: 4289040,
    mrr: 158400,
    activeTenants: tenants.filter(t => t.status === 'active').length,
    frozenTenants: tenants.filter(t => t.status === 'suspended').length,
    remainingTokens: 984501230,
    totalTokensUsed: 15498770,
  });

  // 2. SaaS Plans Editor state
  const [saasPlans, setSaasPlans] = useState<SaaSPlan[]>([
    {
      id: 'starter',
      name: '极速启动版 / Starter Edition',
      priceMonthly: 49,
      transactionFeePct: 2.0,
      dailyApiLimit: 5000,
      storageLimitGb: 10,
      grantedAiTokens: 1000000,
      features: ['多渠道收款', '基础物流对接', 'AI 商品描述生成', '1个激活智能体']
    },
    {
      id: 'pro',
      name: '卓越增长版 / Professional Edition',
      priceMonthly: 129,
      transactionFeePct: 1.0,
      dailyApiLimit: 50000,
      storageLimitGb: 100,
      grantedAiTokens: 10000000,
      features: ['包含 Starter 所有的功能', '自定义域名托管', 'AI 供应链监控', '全渠道智能客服', '多门店 POS 自动同步']
    },
    {
      id: 'enterprise',
      name: '跨国企业级 / Enterprise Edition',
      priceMonthly: 499,
      transactionFeePct: 0.5,
      dailyApiLimit: 500000,
      storageLimitGb: 1000,
      grantedAiTokens: 100000000,
      features: ['包含 Professional 所有的功能', '双子星 Pro 专属智能大脑', '零溢价自主结算算力池', '专线物理容灾备份', '无限量应用扩展授权']
    }
  ]);

  // Selected plan for quick inline custom settings
  const [editingPlanId, setEditingPlanId] = useState<'starter' | 'pro' | 'enterprise'>('starter');

  // 3. Global gateway routing database
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>([
    { id: 'stripe', name: 'Stripe 统一结算网关', publicKey: 'pk_live_51O...S9', secretKey: 'sk_live_51O...8K', commissionPct: 1.2, status: 'active', supportedRegions: ['EU', 'US', 'ASIA'] },
    { id: 'adyen', name: 'Adyen 跨国收单机构', publicKey: 'pub.v2.89...Y8', secretKey: 'ws_78...01l', commissionPct: 1.5, status: 'active', supportedRegions: ['EU', 'UK'] },
    { id: 'base_usdc', name: 'Base Network / Coinbase USDC 智能路由', publicKey: '0x7e8...F23', secretKey: 'sec_web3...44', commissionPct: 0.2, status: 'inactive', supportedRegions: ['GLOBAL'] },
  ]);

  // 4. Global Communication channels
  const [commsChannels, setCommsChannels] = useState<SmsMailChannelConfig[]>([
    { id: 'twilio', name: 'Twilio 国际高到达率短信网关', apiKey: 'SK829b39d...9a', senderId: 'SHOPIFY_EU', remainingCredits: 42800, status: 'active', lowBalanceThreshold: 5000 },
    { id: 'sendgrid', name: 'SendGrid 电子邮件分发服务', apiKey: 'SG.eK8s2...fG', senderId: 'noreply@eu-merchant.run', remainingCredits: 902100, status: 'active', lowBalanceThreshold: 20000 },
  ]);

  // 5. Global AI Engine Routing settings
  const [aiConfig, setAiConfig] = useState<PlatformGlobalAiConfig>({
    defaultModel: 'gemini-3.5-flash',
    systemSafeguardPrompt: 'You are the core backend model routing via AI Commerce OS platform. You must ensure data is isolated per tenant_id inside all queries.',
    maxDailyTokenPool: 50000000,
    currentTokensUsed: 12450000,
    unauthorizedBlockText: 'Merchant AI Limit Exhausted. Please upgrade package in subscriptions center.'
  });

  // 6. Installed Plugins traces simulation
  const [installedTraces, setInstalledTraces] = useState<AppInstallationTrace[]>([
    { appId: 'app-wms', appName: '智能仓储协同 WMS 插件', tenantId: 'tenant-retail', tenantName: '法国巴黎二号旗舰仓', installedAt: '2026-05-30', permissionsGranted: ['Read Products', 'Write Inventory'], status: 'authorized' },
    { appId: 'app-tax', appName: '欧盟税控一键报配 (VAT Sync)', tenantId: 'tenant-retail', tenantName: '法国巴黎二号旗舰仓', installedAt: '2026-06-01', permissionsGranted: ['Read Orders', 'Write Invoice'], status: 'authorized' },
    { appId: 'app-seo', appName: '自动多语言 AI 翻译助手', tenantId: 'tenant-food', tenantName: '米兰奢华咖啡店', installedAt: '2026-06-05', permissionsGranted: ['Read Products', 'Write Translation'], status: 'authorized' },
  ]);

  // Handler functions
  const handleToggleGateway = (id: string) => {
    setGateways(prev => prev.map(g => g.id === id ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g));
    addLog('Platform Network', '网关状态变更', `全局支付网关 [${id}] 进行了状态可用性切换。`, 'warning');
  };

  const handleUpdatePlan = (id: 'starter' | 'pro' | 'enterprise', field: keyof SaaSPlan, value: any) => {
    setSaasPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSavePlanSettings = () => {
    const active = saasPlans.find(p => p.id === editingPlanId);
    if (active) {
      addLog('Billing System', '套餐模型已更新', `商户默认套餐「${active.name}」已被总后台重新校准并存储到全局规则库。`, 'success');
    }
  };

  const handleSaveAiConfig = () => {
    addLog('AI Brain Central', 'LLM 调度逻辑已更新', `全局 AI 底座首选模型已锁定为「${aiConfig.defaultModel}」，多租户隔离约束已增强。`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Super Admin Top Header Indicator */}
      <div className="bg-[#121314] text-[#e3e3e3] p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
            <span className="text-xs text-rose-400 font-bold uppercase tracking-wider">Super Operator Terminal</span>
          </div>
          <h2 className="text-xl font-black text-white font-display">平台底座总控制台</h2>
          <p className="text-xs text-[#969696] max-w-xl">
            SaaS 服务运营商（Super Admin）控制中心。主管全网商户状态、物理结算通道、通信接口、AI 算力截流及多租户数据防护网。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button 
            onClick={() => {
              setPlatformMetrics(prev => ({ ...prev, activeTenants: tenants.filter(t => t.status === 'active').length }));
              addLog('Global Registry', '同步探针', '成功同步全网多租户最新的容器物理负载和算力指标。', 'success');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#242426] border border-[#2d2e30] text-xs font-bold text-slate-200 hover:text-white hover:bg-[#2d2d30] flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新全网负载</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs menu explicitly restricted to simple functional tabs */}
      <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm overflow-x-auto gap-1">
        {[
          { id: 'kpi', name: '📊 平台大盘', count: null },
          { id: 'tenants', name: '🛍 租户监控', count: tenants.length },
          { id: 'plans', name: '💳 订阅套餐', count: saasPlans.length },
          { id: 'gateways', name: '🔗 收款通道', count: gateways.length },
          { id: 'comms', name: '📨 短信通道', count: commsChannels.length },
          { id: 'ai', name: '🤖 AI大脑中心', count: null },
          { id: 'apps', name: '🧩 插件拓扑', count: installedTraces.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeSubTab === tab.id 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.name}
            {tab.count !== null && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-slate-100 text-slate-800 font-mono font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. 📊 平台大盘 (KPI Grid) */}
      {activeSubTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-sm space-y-2 text-left">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">全网累计交易额 (SaaS GMV)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 font-mono">€{(platformMetrics.totalGmv / 100).toLocaleString()}</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +14.2%
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-sm space-y-2 text-left">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">周期订阅月经常性收入 (MRR) (EUR)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 font-mono">€{platformMetrics.mrr.toLocaleString()}</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +8.6%
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-sm space-y-2 text-left">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SaaS AI 算力剩余可用 Tokens 池</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900 font-mono">{(platformMetrics.remainingTokens / 1000000).toFixed(1)}M</span>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5">
                  <Cpu className="w-3.5 h-3.5" /> 状态健康
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-sm space-y-4 text-left">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-600" />
                <span>实时网关吞吐日志</span>
              </h3>
              <div className="space-y-2.5 font-mono text-[11px] text-slate-600 bg-slate-50 p-4 rounded-xl max-h-56 overflow-y-auto">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-emerald-700 font-bold">[SUCCESS]</span>
                  <span>GET /api/v1/tenant-fashion/products - 200 OK</span>
                  <span className="text-slate-400">0.03s ago</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-emerald-700 font-bold">[SUCCESS]</span>
                  <span>POST /api/v1/payments/stripe-hook - 201 Created</span>
                  <span className="text-slate-400">12s ago</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-emerald-700 font-bold">[SUCCESS]</span>
                  <span>POST /api/gemini/agent-chat - Client: tenant-food</span>
                  <span className="text-slate-400">45s ago</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-amber-600 font-bold">[WARN]</span>
                  <span>GET /api/v1/tenant-pos/sync - Rate threshold limit 92%</span>
                  <span className="text-slate-400">2m ago</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-sm space-y-4 text-left">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-600" />
                <span>计算集群物理资源监控</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">边缘节点 CPU</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-black text-slate-800 font-mono">14.2%</span>
                    <span className="text-[9px] px-1 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Low</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">边缘节点 RAM</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-black text-slate-800 font-mono">54.8%</span>
                    <span className="text-[9px] px-1 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 🛍 多租户商户管理 (Tenant Registry) */}
      {activeSubTab === 'tenants' && (
        <div className="bg-white rounded-xl border border-slate-150 shadow-sm overflow-hidden text-left">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-800">全网租户商户节点数据库: {tenants.length} 账号</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="搜索租户名称 / ID / 行业类型..."
                className="bg-white border border-slate-200 text-xs text-slate-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-48"
              />
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-mono border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold">租户 ID</th>
                <th className="p-4 font-bold">店铺名称</th>
                <th className="p-4 font-bold">运营行业</th>
                <th className="p-4 font-bold">当前状态</th>
                <th className="p-4 font-bold">注册日期</th>
                <th className="p-4 font-bold">算力经费预算</th>
                <th className="p-4 font-bold text-right">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-50">
                  <td className="p-4 font-mono font-bold text-slate-500">{tenant.id}</td>
                  <td className="p-4 font-semibold text-slate-800">{tenant.companyName}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded">
                      {tenant.industry === 'retail' && '👕 服装批发'}
                      {tenant.industry === 'food' && '🍔 餐饮外卖'}
                      {tenant.industry === 'education' && '🎓 线上电商'}
                      {tenant.industry === 'healthcare' && '🏪 POS门店'}
                      {tenant.industry === 'service' && '💅 美容预约'}
                      {tenant.industry === 'manufacturing' && '🔋 电器百货'}
                    </span>
                  </td>
                  <td className="p-4">
                    {tenant.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-100">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>运营正常</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-800 text-[10px] font-bold rounded-lg border border-rose-100">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>已停用/冻结</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-500 font-mono">{tenant.createdAt}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 font-mono">${tenant.aiSpent} / ${tenant.aiBudget}</span>
                      <div className="w-24 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${Math.min(100, (tenant.aiSpent / tenant.aiBudget) * 100)}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          const newLimit = prompt("调整该商户的 AI 算力额度 (USD):", tenant.aiBudget.toString());
                          if (newLimit && !isNaN(parseFloat(newLimit))) {
                            onUpdateTenantAiLimit(tenant.id, parseFloat(newLimit));
                          }
                        }}
                        className="px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        算力增配
                      </button>

                      {tenant.status === 'active' ? (
                        <button 
                          onClick={() => onToggleTenantStatus(tenant.id)}
                          className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Lock className="w-3 h-3" />
                          <span>一键冻结</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => onToggleTenantStatus(tenant.id)}
                          className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Unlock className="w-3 h-3" />
                          <span>解除冻结</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. 💳 套餐与订阅管理 */}
      {activeSubTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          
          {/* Subscriptions configuration list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-sm space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">订阅套餐模型定制库</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {saasPlans.map((plan) => (
                  <button 
                    key={plan.id}
                    onClick={() => setEditingPlanId(plan.id)}
                    className={`p-4 rounded-xl border text-left space-y-2 transition-all cursor-pointer ${
                      editingPlanId === plan.id 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest block opacity-70">
                      ID: {plan.id}
                    </span>
                    <h4 className="text-sm font-black truncate">{plan.name}</h4>
                    <p className="font-mono font-bold text-lg">€{plan.priceMonthly}/月</p>
                    <div className="text-[10px] space-y-1 opacity-80 pt-1.5 border-t border-slate-200/20">
                      <div>扣点率: {plan.transactionFeePct}%</div>
                      <div>API上限: {plan.dailyApiLimit}</div>
                      <div>AI 经费: {(plan.grantedAiTokens / 1000000).toFixed(0)}M</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Plan override transaction history */}
            <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-sm space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">最新订阅缴费及授权单据</span>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">法国巴黎二号旗舰仓 (服装)</span>
                    <p className="text-[10px] text-slate-400 font-mono">授权单号: SUB-9823-1</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">+€129.00</span>
                    <p className="text-[10px] text-slate-400 font-mono">2026-06-08 02:11</p>
                  </div>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">米兰奢华咖啡店 (餐饮)</span>
                    <p className="text-[10px] text-slate-400 font-mono">授权单号: SUB-1082-2</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">+€49.00</span>
                    <p className="text-[10px] text-slate-400 font-mono">2026-06-06 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct editor parameters */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Settings className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-800">定制套餐: {editingPlanId.toUpperCase()}</span>
              </div>

              {saasPlans.filter(p => p.id === editingPlanId).map((plan) => (
                <div key={plan.id} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">套餐名称</label>
                    <input 
                      type="text" 
                      value={plan.name}
                      onChange={(e) => handleUpdatePlan(plan.id, 'name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">基础月费 (EUR)</label>
                      <input 
                        type="number" 
                        value={plan.priceMonthly}
                        onChange={(e) => handleUpdatePlan(plan.id, 'priceMonthly', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">交易抽拥提成 %</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={plan.transactionFeePct}
                        onChange={(e) => handleUpdatePlan(plan.id, 'transactionFeePct', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">免费赠送 AI Tokens</label>
                    <input 
                      type="number" 
                      value={plan.grantedAiTokens}
                      onChange={(e) => handleUpdatePlan(plan.id, 'grantedAiTokens', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">每日 API 请求限流频次</label>
                    <input 
                      type="number" 
                      value={plan.dailyApiLimit}
                      onChange={(e) => handleUpdatePlan(plan.id, 'dailyApiLimit', parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <button 
                    onClick={handleSavePlanSettings}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>存储全局套餐配置</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. 🔗 支付网关控制 (Payment Routing Grid) */}
      {activeSubTab === 'gateways' && (
        <div className="bg-white rounded-xl border border-slate-150 shadow-sm overflow-hidden text-left">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">全网物理收单通道与网关白名单</h3>
            <p className="text-xs text-slate-400 mt-1">
              配置平台主控 Stripe / Adyen 证书，修改针对商家流水的加成比例（SaaS 网关取点比例）。
            </p>
          </div>

          <div className="p-6 space-y-6">
            {gateways.map((g) => (
              <div key={g.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">{g.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {g.supportedRegions.map(r => (
                      <span key={r} className="text-[9px] bg-indigo-100 text-indigo-800 font-mono font-bold px-1 py-0.2 rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 font-mono">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">公钥 / Public Creds</span>
                    <span className="text-slate-600 bg-white px-2 py-0.5 border border-slate-150 rounded text-[10px] select-all block truncate max-w-[150px]">{g.publicKey}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">网关交易点数扣比 / Commission</span>
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="number" 
                      step="0.1" 
                      value={g.commissionPct} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setGateways(prev => prev.map(item => item.id === g.id ? { ...item, commissionPct: val } : item));
                      }}
                      className="w-16 bg-white border border-slate-200 rounded p-1 text-xs font-mono text-slate-800 focus:outline-none"
                    />
                    <span className="text-slate-500 font-mono">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <span className="font-mono text-[10px] text-slate-400">STATUS:</span>
                  {g.status === 'active' ? (
                    <button 
                      onClick={() => handleToggleGateway(g.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold cursor-pointer"
                    >
                      接入中 / Active
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleToggleGateway(g.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300 font-medium cursor-pointer"
                    >
                      禁用中 / Inactive
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. 📨 通信与短信通道管理 */}
      {activeSubTab === 'comms' && (
        <div className="bg-white rounded-xl border border-slate-150 shadow-sm text-left">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">第三方 SMS 及邮件通信网关路由</h3>
            <p className="text-xs text-slate-400 mt-1">全球化开店的物流跟踪、订单确认、密码召回的底层发送通道密钥托管中心。</p>
          </div>

          <div className="p-6 space-y-6">
            {commsChannels.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">{c.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {c.status === 'active' ? '● 在线可用' : '● 系统停用'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">API Key 凭证</span>
                    <input 
                      type="password" 
                      value={c.apiKey}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCommsChannels(prev => prev.map(item => item.id === c.id ? { ...item, apiKey: val } : item));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">发件人标识 / Sender ID</span>
                    <input 
                      type="text" 
                      value={c.senderId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCommsChannels(prev => prev.map(item => item.id === c.id ? { ...item, senderId: val } : item));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">低额度警报阈值 (单位: 条/封)</span>
                    <input 
                      type="number" 
                      value={c.lowBalanceThreshold}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setCommsChannels(prev => prev.map(item => item.id === c.id ? { ...item, lowBalanceThreshold: val } : item));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-mono text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 text-[11px] text-slate-600 font-mono">
                  <span>
                    通路余额预警: <strong className="text-indigo-600">{c.remainingCredits.toLocaleString()}</strong> 可发余额
                  </span>
                  <button 
                    onClick={() => {
                      addLog('SMS Gateway', '通道凭证已更新', `商户通道 [${c.id}] 账户证书已被运营商重新验证存储。`, 'success');
                    }}
                    className="px-3 py-1 rounded bg-slate-900 text-white font-bold text-[10px] cursor-pointer hover:bg-slate-800"
                  >
                    同步验证
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. 🤖 全球 AI 大脑与智能中心 */}
      {activeSubTab === 'ai' && (
        <div className="bg-white rounded-xl border border-slate-150 shadow-sm p-6 text-left space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Bot className="w-4.5 h-4.5 text-indigo-600" />
              <span>全网 AI 模型路由及全局 Prompt 监管控制</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">指定默认商家的核心智能体芯片。确保隔离层(Safeguard Prompt)具有最高编译级别。</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">全局首选主力 AI 核心</label>
                <select 
                  value={aiConfig.defaultModel}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, defaultModel: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (默认普惠模型 - 响应时间极快)</option>
                  <option value="gemini-3.5-pro">Gemini 3.5 Pro (企业级核心 - 复杂链条逻辑分析)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">算力防护阈值 (全网每日可用上限 pool)</label>
                <input 
                  type="number" 
                  value={aiConfig.maxDailyTokenPool}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, maxDailyTokenPool: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">全局多租户底层数据隔离防御 Guard Prompt</label>
              <textarea 
                rows={4}
                value={aiConfig.systemSafeguardPrompt}
                onChange={(e) => setAiConfig(prev => ({ ...prev, systemSafeguardPrompt: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">商户经费耗尽警示提示 (Unauthorized Response Text)</label>
              <input 
                type="text" 
                value={aiConfig.unauthorizedBlockText}
                onChange={(e) => setAiConfig(prev => ({ ...prev, unauthorizedBlockText: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <button 
              onClick={handleSaveAiConfig}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>锁定底座大脑模型</span>
            </button>
          </div>
        </div>
      )}

      {/* 7. 🧩 应用市场管理 */}
      {activeSubTab === 'apps' && (
        <div className="bg-white rounded-xl border border-slate-150 shadow-sm overflow-hidden text-left space-y-6 p-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800">平台应用市场插件拓扑图 (Installation Traces)</h3>
            <p className="text-xs text-slate-400 mt-1">检测当前全网商户在其多租户容器下真实激活 / 授权的插件拓扑分布。</p>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-150 text-slate-600 uppercase font-mono border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold">商家租户节点</th>
                <th className="p-4 font-bold">已安装授权插件</th>
                <th className="p-4 font-bold">绑定时间</th>
                <th className="p-4 font-bold">授权权限范围 (Scopes)</th>
                <th className="p-4 font-bold">接口状态</th>
                <th className="p-4 font-bold text-right">操作审计</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {installedTraces.map((trace, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{trace.tenantName}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-100 font-medium rounded-lg">
                      {trace.appName}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-500">{trace.installedAt}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {trace.permissionsGranted.map((perm) => (
                        <span key={perm} className="text-[9px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.2 rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-700 font-bold font-mono text-[10px]">AUTHORIZED</span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                        const confirmRevoke = window.confirm(`是否强制注销商户「${trace.tenantName}」对插件 [${trace.appName}] 的 API 根授权凭证？`);
                        if (confirmRevoke) {
                          setInstalledTraces(prev => prev.filter((_, idx) => idx !== i));
                          addLog('App Security Auditor', '授权撤销', `平台已吊销商户「${trace.tenantName}」对 [${trace.appName}] 的 API Scope。`, 'error');
                        }
                      }}
                      className="text-rose-600 hover:text-rose-900 font-bold text-[10px] cursor-pointer"
                    >
                      审计强制卸载
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
