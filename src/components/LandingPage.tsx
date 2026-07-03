import React, { useState } from 'react';
import { 
  Brain, 
  ArrowRight, 
  Check, 
  Plus
} from 'lucide-react';
import { IndustryType } from '../types';

interface LandingPageProps {
  onEnterApp: () => void;
  onRegisterSuccess: (companyName: string, industry: IndustryType, tier: string) => void;
  selectedIndustry: IndustryType;
  onIndustryChange: (ind: IndustryType) => void;
  onQuickBypass?: () => void;
}

export default function LandingPage({ 
  onEnterApp, 
  onRegisterSuccess, 
  selectedIndustry, 
  onIndustryChange,
  onQuickBypass
}: LandingPageProps) {
  const [activeCapabilityTab, setActiveCapabilityTab] = useState<'agents' | 'rag' | 'workflow' | 'marketplace' | 'multitenancy'>('agents');
  
  // Register states
  const [companyName, setCompanyName] = useState('极光数字科技有限公司');
  const [selectedRegIndustry, setSelectedRegIndustry] = useState<IndustryType>('retail');
  const [selectedRegTier, setSelectedRegTier] = useState<'basic' | 'pro' | 'enterprise'>('pro');

  const industries: { id: IndustryType; name: string; icon: string }[] = [
    { id: 'retail', name: '服装设计批发', icon: '👕' },
    { id: 'food', name: '餐馆外卖', icon: '🍔' },
    { id: 'manufacturing', name: '百货电器', icon: '🔌' },
    { id: 'service', name: '美容预约', icon: '💆' },
    { id: 'education', name: '电商网店', icon: '📦' },
    { id: 'healthcare', name: 'POS门店', icon: '🏪' }
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    onRegisterSuccess(companyName, selectedRegIndustry, selectedRegTier);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden relative">
      
      {/* TEST DRIVE BYPASS BANNER */}
      {onQuickBypass && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 py-3.5 px-4 text-center text-xs font-semibold text-white flex flex-col sm:flex-row items-center justify-center gap-3 shadow-lg z-50">
          <span>💡 <b className="font-bold">测试及开发专用快速通道已就绪：</b> 无需填表与手机验证码验证，即可体验完整的 SaaS 商家工作台与 AI 团队！</span>
          <button 
            type="button"
            onClick={onQuickBypass}
            className="bg-white text-emerald-950 border border-transparent hover:bg-emerald-50 active:scale-95 px-4 font-black py-1.5 rounded-full text-xs shadow-md shadow-emerald-900/10 transition-all cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>🚀 一键免密/免签直达后台系统</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-900 animate-pulse" />
          </button>
        </div>
      )}
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-white">AI BUSINESS OS</span>
              <span className="block text-[8px] font-mono text-indigo-400">PRODUCTION READY</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onEnterApp}
              className="text-slate-300 hover:text-white font-bold text-xs px-2 py-1 transition-colors cursor-pointer"
            >
              登录
            </button>
            <a 
              href="#register"
              className="text-slate-350 hover:text-white font-bold text-xs px-2 py-1 transition-colors cursor-pointer"
            >
              注册
            </a>
            <button 
              onClick={onEnterApp}
              className="bg-indigo-600 hover:bg-indigo-505 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>开始使用</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </header>

      {/* CORE FRAME */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* SCREEN 1: 6 INDUSTRIES */}
        <section id="industries" className="space-y-6">
          <div className="border-l-2 border-indigo-500 pl-3">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">六大行业入口</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((ind) => (
              <div 
                key={ind.id} 
                className={`bg-slate-900/40 border rounded-xl p-4 flex items-center justify-between gap-4 transition-colors ${
                  selectedIndustry === ind.id ? 'border-indigo-505 bg-indigo-950/10' : 'border-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{ind.icon}</span>
                  <span className="text-xs font-bold text-slate-150">{ind.name}</span>
                </div>

                <button
                  onClick={() => {
                    onIndustryChange(ind.id);
                    onEnterApp();
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>进入</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SCREEN 2: CAPABILITIES */}
        <section id="features" className="space-y-6">
          <div className="border-l-2 border-indigo-500 pl-3">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">平台能力</h2>
          </div>

          {/* Core Tab Toggles */}
          <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-900">
            {(['agents', 'rag', 'workflow', 'marketplace', 'multitenancy'] as const).map((tab) => {
              const labelMap = {
                agents: 'AI员工',
                rag: '知识库',
                workflow: '工作流',
                marketplace: '应用市场',
                multitenancy: '多租户'
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveCapabilityTab(tab)}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                    activeCapabilityTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  {labelMap[tab]}
                </button>
              );
            })}
          </div>

          {/* Direct data matrix displays - no explanations */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5">
            {activeCapabilityTab === 'agents' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-800/80 pb-2">
                  <span>配置岗位</span>
                  <span>就绪状态</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span>CEO 审议岗位</span>
                    <span className="text-emerald-400">● 正常就绪</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span>采购助理岗位</span>
                    <span className="text-emerald-400">● 正常就绪</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span>增长运营岗位</span>
                    <span className="text-emerald-400">● 正常就绪</span>
                  </div>
                </div>
              </div>
            )}

            {activeCapabilityTab === 'rag' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-800/80 pb-2">
                  <span>知识包名称</span>
                  <span>所属行业</span>
                  <span>同步状态</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span>款式设计手册</span>
                    <span>服装批发</span>
                    <span className="text-emerald-400">已同步</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span>餐台预订细则</span>
                    <span>餐餐外卖</span>
                    <span className="text-emerald-400">已同步</span>
                  </div>
                </div>
              </div>
            )}

            {activeCapabilityTab === 'workflow' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-800/80 pb-2">
                  <span>节点类型</span>
                  <span>动作定义</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-900 text-xs font-mono">
                  <span>[触发] 低库存阀值</span>
                  <span>&rarr;</span>
                  <span>[决策] 供应商询价</span>
                  <span>&rarr;</span>
                  <span>[执行] 下发采购订单</span>
                </div>
              </div>
            )}

            {activeCapabilityTab === 'marketplace' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-800/80 pb-2">
                  <span>集成插件</span>
                  <span>接入协议</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span>Shopify 联结通道</span>
                    <span>MCP 协议</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span>DHL 快件运单标签</span>
                    <span>REST Webhook</span>
                  </div>
                </div>
              </div>
            )}

            {activeCapabilityTab === 'multitenancy' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-800/80 pb-2">
                  <span>物理隔离层级</span>
                  <span>加密等级</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span>独占 Space 存储沙箱</span>
                    <span className="text-emerald-400">AES-256</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                    <span>专有路由指令集缓存</span>
                    <span className="text-emerald-400">完全隔离</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SCREEN 3: PRICING */}
        <section id="pricing" className="space-y-6">
          <div className="border-l-2 border-indigo-500 pl-3">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">套餐定价</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Basic */}
            <div className="bg-slate-900/50 border border-slate-900 p-5 rounded-xl text-left flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-450 block uppercase">基础版</span>
                <p className="text-xl font-bold font-mono text-white">$199 / 月</p>
                <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">✓ <span>1 套独立行业专属空间</span></div>
                  <div className="flex items-center gap-1.5">✓ <span>2 名核心 AI 雇员席位</span></div>
                  <div className="flex items-center gap-1.5">✓ <span>标准 RAG 专有知识库</span></div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRegTier('basic')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-205 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                选择基础版
              </button>
            </div>

            {/* Pro */}
            <div className="bg-slate-900/55 border border-indigo-500 p-5 rounded-xl text-left flex flex-col justify-between space-y-4 relative">
              <span className="absolute top-[-10px] left-4 bg-indigo-650 text-white font-bold text-[8px] px-2 py-0.5 rounded uppercase tracking-wider">
                商家推荐
              </span>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 block uppercase">专业版</span>
                <p className="text-xl font-bold font-mono text-white">$499 / 月</p>
                <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">✓ <span>全套 6 大行业核心后台自由切换</span></div>
                  <div className="flex items-center gap-1.5">✓ <span>全量 AI 部署与事件通知</span></div>
                  <div className="flex items-center gap-1.5">✓ <span>Visual Workflow 沙盒画布</span></div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRegTier('pro')}
                className="w-full bg-indigo-600 hover:bg-indigo-505 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                选择专业版
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-slate-900/50 border border-slate-900 p-5 rounded-xl text-left flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-450 block uppercase">企业版</span>
                <p className="text-base font-bold text-white">按需定制 / 特约协商</p>
                <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">✓ <span>专属 Relational DB 数据库</span></div>
                  <div className="flex items-center gap-1.5">✓ <span>独享高频大模型调用端点</span></div>
                  <div className="flex items-center gap-1.5">✓ <span>多租户超级总控代管权</span></div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRegTier('enterprise')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-205 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                选择企业版
              </button>
            </div>

          </div>
        </section>

        {/* SCREEN 4: SIGN-UP FORM */}
        <section id="register" className="max-w-md mx-auto border-t border-slate-900 pt-12 space-y-4">
          <div className="text-center font-display">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">立即注册</h2>
          </div>

          <form onSubmit={handleRegisterSubmit} className="bg-slate-900 border border-slate-850 rounded-xl p-5 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">企业名称</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">行业选择</label>
                  <select
                    value={selectedRegIndustry}
                    onChange={(e) => setSelectedRegIndustry(e.target.value as IndustryType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="retail">👕 服装设计批发</option>
                    <option value="food">🍔 餐馆外卖</option>
                    <option value="manufacturing">🔌 百货电器</option>
                    <option value="service">💆 美容预约</option>
                    <option value="education">📦 电商网店</option>
                    <option value="healthcare">🏪 POS门店</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">套餐选择</label>
                  <select
                    value={selectedRegTier}
                    onChange={(e) => setSelectedRegTier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="basic">基础版 ($199)</option>
                    <option value="pro">专业版 ($499)</option>
                    <option value="enterprise">企业版</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-550 text-white py-3 rounded-lg font-bold text-xs shadow transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>开始创建</span>
            </button>
          </form>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-6 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>AI BUSINESS OS © 2026</span>
          <span className="text-emerald-450 font-bold">● ONLINE</span>
        </div>
      </footer>

    </div>
  );
}
