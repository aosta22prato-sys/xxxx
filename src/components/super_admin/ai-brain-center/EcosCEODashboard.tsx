import React, { useMemo, useState, useEffect } from 'react';
import { 
  DollarSign, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, 
  ArrowRight, Shield, Zap, Search, Play, Scale, Activity, ArrowUpRight,
  Bot, Database, Sparkles, Target, Coins, TrendingDown, RefreshCw, Check,
  UserCheck, Layers, FileText, Landmark, BarChart3, Eye,
  ShieldCheck, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { dbEngine } from '../../../../src/db/dbEngine';

interface EcosCEODashboardProps {
  setAiCentralTab: (tab: any) => void;
  onAddSystemLog?: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function EcosCEODashboard({ setAiCentralTab, onAddSystemLog }: EcosCEODashboardProps) {
  const [tick, setTick] = useState(0);

  // 核心状态绑定
  const [approvedProposal, setApprovedProposal] = useState<Record<string, boolean>>({});
  const [financials, setFinancials] = useState({
    todayRevenue: 8520,
    todayProfit: 2341,
    revenueChange: "12%",
    profitChange: "8%",
    lastUpdated: "实时同步"
  });

  useEffect(() => {
    const unsub = dbEngine.subscribe('all', () => setTick(t => t + 1));
    return unsub;
  }, []);

  const reflectionAudits = useMemo(() => dbEngine.self_reflection_audits.getAll(), [tick]);

  const sendLog = (action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool' = 'info') => {
    if (onAddSystemLog) {
      onAddSystemLog('运营大盘', action, details, type);
    }
  };

  const chartData = [
    { name: '目前', Baseline: 42000, Hedged: 42500 },
    { name: 'W1', Baseline: 46000, Hedged: 49200 },
    { name: 'W2', Baseline: 49500, Hedged: 55400 },
    { name: 'W3', Baseline: 52000, Hedged: 61800 },
    { name: 'W4', Baseline: 54000, Hedged: 68500 },
    { name: 'W5', Baseline: 55000, Hedged: 72400 },
    { name: 'W6', Baseline: 56500, Hedged: 79800 }
  ];

  const handleNavigation = (tabId: string, label: string) => {
    sendLog('模块跳转', `切换至 ${label}`, 'info');
    setAiCentralTab(tabId);
  };

  const handleApproveAction = (proposalId: string, type: string, effect: string, profit: string) => {
    if (approvedProposal[proposalId]) return;

    setApprovedProposal(prev => ({ ...prev, [proposalId]: true }));
    
    setFinancials(prev => {
      const addedRev = type === 'restock' ? 5200 : 2100;
      const addedProfit = type === 'restock' ? 1200 : 640;
      return {
        ...prev,
        todayRevenue: prev.todayRevenue + addedRev,
        todayProfit: prev.todayProfit + addedProfit,
        revenueChange: "14.5%",
        profitChange: "10.2%",
        lastUpdated: "已核准"
      };
    });

    sendLog(
      '经营决策核准',
      `核准执行：【${effect}】，锁定收益 ${profit}。`,
      'success'
    );
  };

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      
      {/* 头部精简标题（黑白极简风格） */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950 text-white rounded-lg p-5 border border-zinc-800 shadow-xs gap-4">
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-100 flex-shrink-0" />
            智脑经营大盘
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            监控全网商户数据状态与跨国结算流转
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900 px-3.5 py-1.5 rounded border border-zinc-800">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-zinc-300">系统运行中</span>
        </div>
      </div>

      {/* 核心财务指标 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 指标 1 */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-tight block">今日总销售额</span>
            <p className="text-xl font-bold text-slate-900 font-mono">
              €{financials.todayRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded font-bold font-mono">↑ {financials.revenueChange}</span>
              <span>对比昨日</span>
            </div>
          </div>
          <span className="p-2 bg-slate-50 text-slate-600 rounded">
            <DollarSign className="w-5 h-5" />
          </span>
        </div>

        {/* 指标 2 */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-tight block">经营优化增加净利</span>
            <p className="text-xl font-bold text-slate-900 font-mono">
              €{financials.todayProfit.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded font-bold font-mono">↑ {financials.profitChange}</span>
              <span>自动对冲增效</span>
            </div>
          </div>
          <span className="p-2 bg-slate-50 text-slate-600 rounded">
            <Coins className="w-5 h-5" />
          </span>
        </div>

        {/* 指标 3 */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold tracking-tight block">防错审计挽回损失</span>
            <p className="text-xl font-bold text-slate-900 font-mono">
              €{(reflectionAudits.length * 4200 + 12500).toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-slate-600 bg-slate-100 px-1 py-0.5 rounded font-medium">拦截防御保护</span>
            </div>
          </div>
          <span className="p-2 bg-slate-50 text-slate-600 rounded">
            <ShieldCheck className="w-5 h-5" />
          </span>
        </div>

      </div>

      {/* 经营决策与活动 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 动态 1 */}
        <div className="bg-zinc-950 text-white rounded-lg p-5 flex flex-col justify-between hover:border-zinc-700 border border-transparent transition-all">
          <div className="space-y-2">
            <span className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase">区域消费策略</span>
            <h3 className="text-sm font-bold text-white">大衣欧洲特定区域转化率走高</h3>
            <p className="text-xs text-zinc-400 leading-normal">
              同行由于清关物流受阻出现断货，购买转化自动呈增长态势。
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono border-t border-zinc-900">
              <div>
                <span className="text-[9px] text-zinc-500 block">预计增益</span>
                <span className="font-bold text-emerald-400">+€4,300/月</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 block">决策置信度</span>
                <span className="font-bold text-zinc-200">89%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 pt-3 border-t border-zinc-900">
            <button 
              onClick={() => handleNavigation('p1_intelligence', '控制台')}
              className="px-3 py-1.5 bg-white text-zinc-950 hover:bg-zinc-100 rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>查看细节</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 动态 2 */}
        <div className="bg-white border border-slate-200 text-slate-900 rounded-lg p-5 flex flex-col justify-between hover:border-slate-350 transition-all">
          <div className="space-y-2">
            <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">关联销售组合</span>
            <h3 className="text-sm font-bold text-slate-900">夹克与内衬商品高频联合采购</h3>
            <p className="text-xs text-slate-500 leading-normal">
              统计表明客户在购买羊毛外套时更倾向于同步加配配套长裤，组合大促有助于提高客单。
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono border-t border-slate-150">
              <div>
                <span className="text-[9px] text-slate-400 block">客单价预期提升</span>
                <span className="font-bold text-slate-800">+22%</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">对冲预期红利</span>
                <span className="font-bold text-slate-900">+€3,800/月</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
            <button 
              onClick={() => handleNavigation('p1_intelligence', '控制台')}
              className="px-3 py-1.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 rounded text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>配置关联</span>
            </button>
          </div>
        </div>

      </div>

      {/* 核心批复方案栏 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 决策卡 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-400 transition-all relative">
          {approvedProposal['rec_01'] && (
            <div className="absolute inset-0 bg-slate-100/40 rounded-lg pointer-events-none"></div>
          )}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded font-bold">
                备妥补货：畅销品自动补货
              </span>
              <span className="text-[10px] text-slate-400 font-mono">在库指标预警</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              畅销款服装面临库存不足。备妥供应链通过合作物流紧急调拨衣物 <b>300 件</b>进行回款保障。
            </p>
            <div className="flex gap-4 text-xs font-mono py-1">
              <div>
                <span className="text-slate-400 block text-[10px]">调度数量</span>
                <span className="font-bold text-slate-800">300 件</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">预计销售</span>
                <span className="font-bold text-slate-900">+€5,200</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-400">核准系数: 94.2%</span>
            <button
              onClick={() => handleApproveAction('rec_01', 'restock', '核准服装补货300件', '+€5,200')}
              disabled={approvedProposal['rec_01']}
              className={`px-4 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                approvedProposal['rec_01']
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800'
              }`}
            >
              {approvedProposal['rec_01'] ? '已核准执行' : '核准执行'}
            </button>
          </div>
        </div>

        {/* 决策卡 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-400 transition-all relative">
          {approvedProposal['rec_02'] && (
            <div className="absolute inset-0 bg-slate-100/40 rounded-lg pointer-events-none"></div>
          )}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded font-bold">
                智能预算重配：广告边际对冲
              </span>
              <span className="text-[10px] text-slate-400 font-mono">广告效能保障</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              高溢价竞流成本飙升。建议将 35% 低能效广告预算重新定向投放至当季大热新品系列。
            </p>
            <div className="flex gap-4 text-xs font-mono py-1">
              <div>
                <span className="text-slate-400 block text-[10px]">资金流向系数</span>
                <span className="font-bold text-slate-800">35% 重配</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">预计对冲收益</span>
                <span className="font-bold text-slate-900">+€2,100</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] text-slate-400">评分概率: 86.0%</span>
            <button
              onClick={() => handleApproveAction('rec_02', 'ad_budget', '转配部分低效预算', '+€2,100')}
              disabled={approvedProposal['rec_02']}
              className={`px-4 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                approvedProposal['rec_02']
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800'
              }`}
            >
              {approvedProposal['rec_02'] ? '已核准执行' : '核准执行'}
            </button>
          </div>
        </div>

      </div>

      {/* 运营预警（纯色系高对比设计） */}
      <div className="bg-zinc-100 border border-zinc-200 rounded-lg p-5 text-left">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-3">
          <ShieldAlert className="w-4 h-4 text-zinc-800" />
          <span>运营预警事件</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-zinc-200 rounded-lg p-3.5 space-y-1">
            <span className="text-[9px] bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded font-bold">本地供应链承阻</span>
            <h4 className="text-xs font-bold text-slate-900 pt-0.5">物流延迟红线预警</h4>
            <p className="text-[11px] text-slate-500 leading-normal font-normal">
              欧洲极端天气引发多级物流延迟，自动规划替代干线。
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg p-3.5 space-y-1">
            <span className="text-[9px] bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded font-bold">边际广告价格</span>
            <h4 className="text-xs font-bold text-slate-900 pt-0.5">加价成本溢出警告</h4>
            <p className="text-[11px] text-slate-500 leading-normal font-normal">
              热门投放关键词获客成本上升，自动重置预算保护额。
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg p-3.5 space-y-1">
            <span className="text-[9px] bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded font-bold">付款回现周期</span>
            <h4 className="text-xs font-bold text-slate-900 pt-0.5">平台结算预估对冲</h4>
            <p className="text-[11px] text-slate-500 leading-normal font-normal">
              在途账期重叠度攀升，开启定向用户立减券加速结算回现。
            </p>
          </div>
        </div>
      </div>

      {/* 图表展示 */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-4">
          <div>
            <h3 className="text-slate-950 font-bold text-sm tracking-tight flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-zinc-800" />
              <span>自适应对冲效果模拟趋势</span>
            </h3>
          </div>

          <div className="flex gap-4 text-[10px] font-sans">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-300 rounded-xs"></span>
              <span className="text-slate-500">常规经营预期</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-zinc-900 rounded-xs"></span>
              <span className="text-slate-900 font-bold">智脑自适应策略预期</span>
            </div>
          </div>
        </div>

        <div className="h-[200px] w-full mt-2 font-mono">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHedged" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '4px', color: '#fff' }}
                labelClassName="text-slate-400 font-mono font-bold text-xs"
              />
              <Area type="monotone" dataKey="Baseline" stroke="#94a3b8" strokeWidth={1} name="常规经营" fillOpacity={1} fill="url(#colorBaseline)" />
              <Area type="monotone" dataKey="Hedged" stroke="#18181b" strokeWidth={1.5} name="自适应策略经营" fillOpacity={1} fill="url(#colorHedged)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
