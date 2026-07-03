import React from 'react';
import { Users, FileText, Sliders, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function AgentPartnerConsole() {
  return (
    <div id="agent-partner-root" className="min-h-screen bg-[#07080a] text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-6 gap-4">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-900/40">
                Partner Channel
              </span>
              <span className="text-zinc-500 font-mono text-[11px]">System Node Active</span>
            </div>
            <h1 className="text-2xl font-black text-white font-display mt-2 uppercase tracking-wide">
              🤝 代理商合作伙伴控制中心 / Agent Partner Hub
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              管理旗下招商、二级商户入驻分佣、平台费抽成账单以及专属代理 API 配额通道。
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono text-zinc-500 leading-none">Agent ID</span>
              <span className="text-xs font-mono font-bold text-white mt-1">AG_MEMBER_94018</span>
            </div>
          </div>
        </div>

        {/* Visual Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { tag: '总代理店铺数', val: '148 家', change: '+3.5%', desc: '所拓客招商入驻真实店面数', color: 'text-indigo-400' },
            { tag: '本月代理佣金收入', val: '€11,850.00', change: '+12.4%', desc: '20% 商户支付订阅抽佣总账', color: 'text-emerald-400' },
            { tag: '代理 API 调用量', val: '3,184.2K / 5,000K', change: '63.6% 消耗', desc: '旗下多租户 AI 调度算力交割', color: 'text-[#07C2E3]' },
            { tag: '平均招商转化率', val: '18.42%', change: '+1.8%', desc: '邀约开店链接结算漏斗占比', color: 'text-amber-400' },
          ].map((card, i) => (
            <div key={i} className="bg-[#0c0d10] border border-zinc-800/80 p-5 rounded-2xl text-left space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">{card.tag}</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${card.color} tracking-tight`}>{card.val}</span>
                <span className="text-[10px] font-bold text-emerald-400">{card.change}</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Block Banner indicating future integration */}
        <div className="bg-zinc-900/50 border border-dashed border-zinc-800 p-8 rounded-3xl text-center space-y-4">
          <div className="max-w-md mx-auto space-y-2">
            <span className="p-1 px-3 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono font-bold">Reseller Roadmap v1.2</span>
            <h2 className="text-base font-bold text-white">代理商分销面板开发锁定</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              这里已被代码规划完全隔离锁定为 **代理商（Partner Agent）** 的核心代码工作区。
              所有二级加盟店分账机制、物料采购代理代付扣除规则均将落入此文件夹，绝对不与普通商家客户端或超级管理总后台混杂。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
