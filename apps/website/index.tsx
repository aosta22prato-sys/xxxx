/**
 * ECOS AI Business OS Marketing Landing Page
 */

import React from 'react';

export default function WebsitePortal({ onNavigateToRegister }: { onNavigateToRegister: () => void }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans">
      {/* Brand Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#07C2E3] flex items-center justify-center font-extrabold text-slate-950 text-base">E</div>
          <span className="font-sans font-black tracking-tight text-white text-lg">AI BUSINESS OS</span>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={onNavigateToRegister}
            className="bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-lg"
          >
            立即注册 / 试用
          </button>
        </div>
      </header>

      {/* Hero Body */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 space-y-16 text-center">
        <div className="space-y-6">
          <span className="bg-[#07C2E3]/15 text-[#07C2E3] text-[10px] uppercase font-mono px-3 py-1 rounded-full font-extrabold tracking-widest border border-[#07C2E3]/20 inline-block animate-pulse">
            Enterprise Autonomous Operating System
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            六大行业一站自愈式<br />
            <span className="text-[#07C2E3]">多智能体商业自治系统</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-slate-400 leading-relaxed font-sans">
            AI Business OS 融合多租户 SaaS 架构与自愈级脑内核。一键为您的企业构建自主运转的 AI 雇员矩阵，自动同步仓储、面料、外卖配送与 POS 收银台。
          </p>
          <div className="pt-4 flex gap-4 justify-center">
            <button
              onClick={onNavigateToRegister}
              className="bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-slate-950 font-black text-sm px-6 py-3 rounded-lg shadow-lg cursor-pointer transition-all border border-[#07C2E3]/20"
            >
              立刻免费创建您的企业
            </button>
          </div>
        </div>

        {/* Six Industries Grid */}
        <div className="space-y-6 text-left">
          <div className="border-l-4 border-[#07C2E3] pl-4">
            <h3 className="font-extrabold text-white text-base">覆盖六大核心商业垂直行业</h3>
            <p className="text-xs text-slate-400 mt-1">每个行业独立生成专属智能员工链和数据落库流程</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '服装设计批发系统', desc: '款式、面料、印花库存同步绑定，AI买手和财务全流程监控', icon: '👔' },
              { title: '餐馆外卖系统', desc: '桌台收银、厨房配送无缝流转，AI店长负责爆款菜品智能营销', icon: '🍲' },
              { title: '百货电器系统', desc: '串号追踪、多门店调拨策略，AI售后与供应链全链路自动追溯', icon: '🔌' },
              { title: '美容预约系统', desc: '技师空闲智能匹配，会员储值裂变算法，AI美容顾问专属运营', icon: '💅' },
              { title: '电商网店系统', desc: 'Shopify 级一键分流上架，AI独立选品大盘、流量诊断和自主提价', icon: '🛒' },
              { title: 'POS门店系统', desc: '高并发收银、实时库存交班，AI导购赋能线下实体店流水翻倍', icon: '📊' }
            ].map((ind, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-[#07C2E3]/40 transition-all font-sans">
                <div className="text-2xl mb-2">{ind.icon}</div>
                <h4 className="font-bold text-slate-100 text-sm">{ind.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Matrix */}
        <div className="space-y-6 text-left border-t border-slate-850 pt-12">
          <div className="border-l-4 border-slate-400 pl-4">
            <h3 className="font-extrabold text-white text-base">透明算力套餐与计费大盘</h3>
            <p className="text-xs text-slate-400 mt-1">根据您企业的实际计算负荷、AI员工规模进行自动弹性扩张</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: '基础版 Starter Suite', price: '€ 49/MO', perks: ['1 个商户组织空间', '生成服装/零售专属后台', '2 位初级 AI 员工', '10GB 企业自研知识库'], color: 'border-slate-800 bg-slate-950/50' },
              { name: '专业版 Premium OS', price: '€ 149/MO', perks: ['3 个商户组织空间', '开通六大行业全套套件', '6 位高级决策级别 AI 员工', '50GB 知识库 + 智能工作流配置'], color: 'border-[#07C2E3] bg-slate-950 ring-1 ring-[#07C2E3]/20' },
              { name: '企业版 Sovereign Hub', price: '€ 499/MO', perks: ['无限制私有化多租户空间', '定制专属微调行业 AI 模型', '不受限 AI 财务与战略总监配额', '秒级灾备与独立算力通道'], color: 'border-slate-850 bg-slate-950/50' }
            ].map((p, idx) => (
              <div key={idx} className={`border rounded-xl p-6 flex flex-col justify-between ${p.color}`}>
                <div className="space-y-4">
                  <h4 className="font-extrabold text-slate-200 text-xs tracking-wider uppercase">{p.name}</h4>
                  <div className="text-3xl font-black text-white font-mono">{p.price}</div>
                  <ul className="space-y-2 mt-4 text-xs text-slate-400">
                    {p.perks.map((p, i) => <li key={i} className="flex items-center gap-1.5">✓ {p}</li>)}
                  </ul>
                </div>
                <button
                  onClick={onNavigateToRegister}
                  className="w-full mt-6 bg-slate-800 hover:bg-[#07C2E3] hover:text-slate-950 text-slate-200 font-extrabold text-xs py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  开始使用
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-slate-850 bg-slate-950 text-slate-500 px-6 py-6 text-xs text-center">
        <p>© 2026 AI Commerce OS (EC-Sovereign) Europe Tech Platform. All global autonomous parameters validated.</p>
      </footer>
    </div>
  );
}
