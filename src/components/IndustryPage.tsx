import React, { useState } from 'react';
import { Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import { IndustryType } from '../types';

interface IndustryPageProps {
  onBack: () => void;
  onSelect: (industry: IndustryType) => void;
}

export default function IndustryPage({ onBack, onSelect }: IndustryPageProps) {
  const [selected, setSelected] = useState<IndustryType>('retail');

  const industries: { id: IndustryType; name: string; icon: string; description: string }[] = [
    { id: 'retail', name: '服装设计批发', icon: '👕', description: '款式管理 · SKU规划 · 工厂采购订单 · 批发供货' },
    { id: 'food', name: '餐馆外卖', icon: '🍔', description: '菜单配方 · 桌台收银 · 厨房调度派单 · 骑手配送' },
    { id: 'manufacturing', name: '百货电器', icon: '🔌', description: '商品串号 · 多仓调拨 · 采购入库控制 · 售后退核' },
    { id: 'service', name: '美容预约', icon: '💆', description: '技师排班 · 会员次卡 · 预订核销 · 门店服务计提' },
    { id: 'education', name: '电商网店', icon: '📦', description: '全网选品 · 物流发货同步 · 跨店铺订单智能路由' },
    { id: 'healthcare', name: 'POS门店', icon: '🏪', description: '交班核账 · 本地库存 · 聚合支付 · 促销券配发' }
  ];

  const handleConfirm = () => {
    onSelect(selected);
  };

  return (
    <div id="industry-page-wrapper" className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col justify-between overflow-x-hidden relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/5 to-transparent blur-3xl pointer-events-none rounded-full"></div>

      {/* HEADER */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur">
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-wider text-white">AI BUSINESS OS</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col justify-center px-6 py-12 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest uppercase">PAGE 003 / SELECT INDUSTRY</span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">选择您企业的主营行业赛道</h1>
          <p className="text-slate-400 text-xs font-normal">专属AI大脑、专有工作流组件和知识包将根据您的选择自动匹配组装</p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
          {industries.map((ind) => {
            const isSelected = selected === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setSelected(ind.id)}
                className={`text-left p-4 rounded-xl border flex gap-4 transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-950/15 ring-2 ring-indigo-500/20' 
                    : 'border-slate-850 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {ind.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-100">{ind.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono leading-relaxed">{ind.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full pt-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 p-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回注册 (Page 002)</span>
          </button>

          <button
            onClick={handleConfirm}
            className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>确认并进入配置 (Page 004)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="py-6 border-t border-slate-900 px-8 text-center bg-slate-950 text-[10px] font-mono text-slate-500">
        AI BUSINESS OS © 2026. CHOOSE AN INDUSTRY ROADWAY TO INJECT THE DOMAIN EXPERT BRAIN.
      </footer>

    </div>
  );
}
