import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { useLayoutStore } from '../../stores/layoutStore';
import { usePanelStore } from '../../stores/panelStore';
import { MOCK_PRODUCT_SVGS } from '../../data/mockData';
import { 
  TrendingUp, ShoppingBag, Users, ChevronRight, 
  Sparkles, Search, CheckCircle2, ArrowUpRight, 
  FileText, Package, Tag, ArrowRight, ArrowUp
} from 'lucide-react';

export default function HomeView() {
  const { setCurrentTab, showSettingsToast } = useLayoutStore();
  const { togglePreview } = usePanelStore();
  const [askInput, setAskInput] = useState('');

  // 24小时销售趋势细致数据
  const chartData = [
    { time: '00:00', sales: 600 },
    { time: '03:00', sales: 1600 },
    { time: '06:00', sales: 1100 },
    { time: '09:00', sales: 1800 },
    { time: '12:00', sales: 2980 },
    { time: '15:00', sales: 2200 },
    { time: '18:00', sales: 2800 },
    { time: '21:00', sales: 3200 },
    { time: '24:00', sales: 4200 },
  ];

  // 快捷触发智能助手 prompt
  const handleQuickAiAction = (promptText: string) => {
    // 打开右侧的 Sidekick Panel
    togglePreview('sidekick');
    showSettingsToast(`🤖 已向 Sidekick AI 提交：「${promptText}」`);
  };

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    handleQuickAiAction(askInput);
    setAskInput('');
  };

  return (
    <div id="pwa-home-container" className="space-y-6 font-sans antialiased text-[#202223] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-7xl mx-auto p-1 select-none text-left">
      
      {/*  今日销售概览卡片板块 */}
      <div className="bg-white border border-[#e4e4e7] rounded-2xl p-5 shadow-3xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#09090b]">今日销售概览</h3>
        </div>

        {/* 四组精准销售总览指标 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-[#6d7175] block">总销售额</span>
            <span className="text-lg font-bold text-[#09090b] font-mono block">¥ 23,880</span>
            <div className="flex items-center gap-1 text-[10px] text-[#008060]">
              <ArrowUp className="w-2.5 h-2.5" />
              <span>较昨日 ↑ 12%</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-[#6d7175] block">订单数</span>
            <span className="text-lg font-bold text-[#09090b] font-mono block">128</span>
            <div className="flex items-center gap-1 text-[10px] text-[#008060]">
              <ArrowUp className="w-2.5 h-2.5" />
              <span>较昨日 ↑ 8%</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-[#6d7175] block">访客数</span>
            <span className="text-lg font-bold text-[#09090b] font-mono block">2,345</span>
            <div className="flex items-center gap-1 text-[10px] text-[#008060]">
              <ArrowUp className="w-2.5 h-2.5" />
              <span>较昨日 ↑ 15%</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-[#6d7175] block">转化率</span>
            <span className="text-lg font-bold text-[#09090b] font-mono block">3.6%</span>
            <div className="flex items-center gap-1 text-[10px] text-[#008060]">
              <ArrowUp className="w-2.5 h-2.5" />
              <span>较昨日 ↑ 0.6%</span>
            </div>
          </div>
        </div>

        {/* 📈 极至简洁 24小时销售趋势曲线 (Recharts AREA CHART) */}
        <div className="h-44 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008060" stopOpacity={0.12}/>
                  <stop offset="95%" stopColor="#008060" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8c9196', fontSize: 9, fontFamily: 'JetBrains Mono' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8c9196', fontSize: 9, fontFamily: 'JetBrains Mono' }} 
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-[#e4e4e7] p-2 rounded-lg shadow-sm text-center">
                        <span className="text-xs font-bold text-[#09090b] font-mono">¥ {payload[0].value}</span>
                        <div className="text-[9px] text-[#6d7175] mt-0.5">{payload[0].payload.time}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#008060" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#salesColor)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📋 下排双合一模块 - 待处理事项与库存健康度 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. 待处理事项列表 */}
        <div className="bg-white border border-[#e4e4e7] rounded-2xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#09090b]">待处理事项</h3>
            <button 
              onClick={() => setCurrentTab('orders')}
              className="text-[11px] text-[#6d7175] hover:text-[#09090b] cursor-pointer"
            >
              查看全部 ➔
            </button>
          </div>

          <div className="divide-y divide-[#f4f4f5] text-xs">
            <div 
              onClick={() => setCurrentTab('orders')}
              className="flex justify-between items-center py-3 cursor-pointer hover:bg-[#f4f4f5]/40 transition-colors rounded-lg px-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008060]" />
                <span className="font-semibold text-[#09090b]">待发货订单</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-[#f4f4f5] font-bold font-mono text-[10px]">18</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>

            <div 
              onClick={() => setCurrentTab('orders')}
              className="flex justify-between items-center py-3 cursor-pointer hover:bg-[#f4f4f5]/40 transition-colors rounded-lg px-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-[#09090b]">未付款订单</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-[#f4f4f5] font-bold font-mono text-[10px]">6</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>

            <div 
              onClick={() => setCurrentTab('products')}
              className="flex justify-between items-center py-3 cursor-pointer hover:bg-[#f4f4f5]/40 transition-colors rounded-lg px-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="font-semibold text-[#09090b]">低库存商品</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-[#f4f4f5] font-bold font-mono text-[10px]">12</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>

            <div 
              onClick={() => showSettingsToast('📋 退货申请处理流畅：暂无待核销的超时售后纠纷')}
              className="flex justify-between items-center py-3 cursor-pointer hover:bg-[#f4f4f5]/40 transition-colors rounded-lg px-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span className="font-semibold text-[#09090b]">退货申请</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-[#f4f4f5] font-bold font-mono text-[10px]">4</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>

            <div 
              onClick={() => togglePreview('sidekick')}
              className="flex justify-between items-center py-3 cursor-pointer hover:bg-[#f4f4f5]/40 transition-colors rounded-lg px-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008060]" />
                <span className="font-semibold text-[#09090b]">客户消息</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-[#f4f4f5] font-bold font-mono text-[10px]">3</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. 库存健康度饼图/环形图板块 */}
        <div className="bg-white border border-[#e4e4e7] rounded-2xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#09090b]">库存健康度</h3>
            <button 
              onClick={() => setCurrentTab('products')}
              className="text-[11px] text-[#6d7175]"
            >
              查看库存 ➔
            </button>
          </div>

          <div className="flex items-center justify-around h-44">
            
            {/* Concentric Double-Ring Circle Vector */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-[#f4f4f5]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  className="stroke-[#008060]"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="289"
                  strokeDashoffset="63"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-[#09090b] font-mono">78%</span>
                <span className="text-[10px] text-neutral-400 font-medium">健康</span>
              </div>
            </div>

            {/* 图例列表 */}
            <div className="space-y-2.5 text-left text-xs shrink-0 pl-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#008060]" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400">健康 ({'>'}50)</span>
                  <span className="font-bold text-[#09090b] font-mono">68%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 font-medium">预警 (10-50)</span>
                  <span className="font-bold text-[#09090b] font-mono">22%</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400">缺货 (=0)</span>
                  <span className="font-bold text-[#09090b] font-mono">10%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 🏆 Top 3 畅销商品 */}
      <div className="bg-white border border-[#e4e4e7] rounded-2xl p-5 shadow-3xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#09090b]">Top 3 畅销商品</h3>
          <button 
            onClick={() => setCurrentTab('products')}
            className="text-[11px] text-[#6d7175]"
          >
            全部商品 ➔
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Top 1 */}
          <div 
            onClick={() => setCurrentTab('products')}
            className="flex items-center gap-3 p-3 bg-[#f4f4f5]/40 border border-[#e4e4e7] rounded-xl hover:border-[#008060] transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center shrink-0 p-1">
              <div 
                className="w-full h-full text-neutral-900"
                dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS.backpack }}
              />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#09090b] truncate w-28 group-hover:text-[#008060]">Waterproof Pack</div>
              <div className="text-[10px] text-[#6d7175] font-mono">¥ 699</div>
              <div className="text-[10px] text-[#008060] font-bold mt-0.5">销量 32</div>
            </div>
          </div>

          {/* Top 2 */}
          <div 
            onClick={() => setCurrentTab('products')}
            className="flex items-center gap-3 p-3 bg-[#f4f4f5]/40 border border-[#e4e4e7] rounded-xl hover:border-[#008060] transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center shrink-0 p-1">
              <div 
                className="w-full h-full text-neutral-900"
                dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS.shirt }}
              />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#09090b] truncate w-28 group-hover:text-[#008060]">Organic Tee</div>
              <div className="text-[10px] text-[#6d7175] font-mono">¥ 199</div>
              <div className="text-[10px] text-[#008060] font-bold mt-0.5">销量 28</div>
            </div>
          </div>

          {/* Top 3 */}
          <div 
            onClick={() => setCurrentTab('products')}
            className="flex items-center gap-3 p-3 bg-[#f4f4f5]/40 border border-[#e4e4e7] rounded-xl hover:border-[#008060] transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center shrink-0 p-1">
              <div 
                className="w-full h-full text-neutral-00"
                dangerouslySetInnerHTML={{ __html: MOCK_PRODUCT_SVGS.candle }}
              />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#09090b] truncate w-28 group-hover:text-[#008060]">Travel Mug</div>
              <div className="text-[10px] text-[#6d7175] font-mono">¥ 159</div>
              <div className="text-[10px] text-[#008060] font-bold mt-0.5">销量 18</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
