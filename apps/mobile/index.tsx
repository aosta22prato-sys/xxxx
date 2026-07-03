/**
 * ECOS Mobile App Portal
 */

import React, { useState } from 'react';
import { dbEngine } from '../../src/db/dbEngine';

export default function MobileApp() {
  const [agents] = useState(() => {
    try {
      const de = dbEngine as any;
      if (de.ai_agents) return de.ai_agents.getAll().slice(0, 4);
      if (de.agents) return de.agents.getAll().slice(0, 4);
    } catch (e) {}
    return [
      { id: '1', role: 'MarketingAgent', system_state: 'IDLE' },
      { id: '2', role: 'PricingAgent', system_state: 'BUSY' }
    ];
  });

  return (
    <div className="max-w-md mx-auto min-h-[80vh] bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 flex flex-col justify-between overflow-hidden shadow-2xl font-sans">
      
      {/* Mobile Phone Mockup Header */}
      <div className="bg-[#0f172a] border-b border-slate-800 p-4 flex justify-between items-center">
        <span className="font-extrabold text-xs text-white uppercase tracking-wider">Sovereign App v1.0</span>
        <span className="bg-[#07C2E3]/20 text-[#07C2E3] text-[9px] px-2 py-0.5 rounded font-mono font-extrabold uppercase animate-pulse">
          5G SECURE TUNNEL
        </span>
      </div>

      {/* Core Container */}
      <div className="p-4 flex-1 space-y-4 text-left overflow-y-auto">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">商户 AI 主动神经架构</span>
            <span className="text-[9px] text-emerald-400">运行良好</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {agents.map((agent: any, idx: number) => (
              <div key={agent.id || idx} className="bg-slate-900/85 border border-slate-800 rounded-lg p-3">
                <span className="text-[14px]">{agent.role === 'MarketingAgent' ? '📣' : agent.role === 'PricingAgent' ? '🏷️' : '📦'}</span>
                <h5 className="font-bold text-slate-100 text-xs mt-1 truncate">{agent.role}</h5>
                <span className={`text-[8.5px] font-mono px-1 py-0.2 rounded mt-1 inline-block ${agent.system_state === 'BUSY' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {agent.system_state}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Overview */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-sans space-y-2">
          <h4 className="text-[10px] text-slate-400 uppercase font-extrabold">宏观资金流健康状况</h4>
          <p className="text-xl font-mono font-bold text-white">€ 285.00 / h <span className="text-xs text-slate-500 font-sans">算力成本</span></p>
          <p className="text-[10px] text-slate-400 leading-relaxed">该数据代表微处理器正在安全代理中独立运行。计算任务分流完成 100%。</p>
        </div>
      </div>

      {/* Mobile Tab bar footer mockup */}
      <div className="bg-[#0f172a] border-t border-slate-800 px-4 py-3 flex justify-around text-xs text-slate-500 font-bold">
        <span className="text-[#07C2E3]">● COMPASS STATS</span>
        <span>● NEURAL GATEWAY</span>
      </div>

    </div>
  );
}
