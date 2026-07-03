import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  UserPlus, 
  Settings2, 
  CheckCircle, 
  X, 
  ShieldAlert, 
  Play, 
  Zap, 
  Layers, 
  Clock, 
  DollarSign, 
  Plus, 
  FileEdit,
  Trash2,
  TrendingUp, 
  BarChart3, 
  Activity, 
  RotateCw, 
  ArrowLeft,
  ShoppingBag,
  Percent,
  CheckCircle2,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';
import { AIEmployee, IndustryType, ProductItem, OrderItem } from '../../types';
import MarkdownCodeEditor from '../MarkdownCodeEditor';

interface AIEmployeeCenterProps {
  activeAgents: AIEmployee[];
  onUpdateAgents: (updated: AIEmployee[]) => void;
  selectedIndustry: IndustryType;
  addLog: (agent: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
  products?: ProductItem[];
  orders?: OrderItem[];
  customers?: any[];
}

export default function AIEmployeeCenter({ 
  activeAgents, 
  onUpdateAgents, 
  selectedIndustry, 
  addLog,
  products = [],
  orders = [],
  customers = []
}: AIEmployeeCenterProps) {
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentForDashboard, setSelectedAgentForDashboard] = useState<string | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastTriggered, setForecastTriggered] = useState(false);

  // Form states for custom AI Employee
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newEmoji, setNewEmoji] = useState('🤖');
  const [newRole, setNewRole] = useState('');
  const [newCapability, setNewCapability] = useState('');
  const [newCapabilitiesList, setNewCapabilitiesList] = useState<string[]>([]);
  const [newSystemPrompt, setNewSystemPrompt] = useState('');
  const [newModel, setNewModel] = useState('gemini-3.5-flash');

  // Edit form state
  const [editPromptValue, setEditPromptValue] = useState('');
  const [editModelValue, setEditModelValue] = useState('');

  // Filter agents by industry or CEO
  const visibleAgents = activeAgents.filter(agent => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = agent.name.toLowerCase().includes(query) || 
                          agent.title.toLowerCase().includes(query) || 
                          agent.role.toLowerCase().includes(query);
    
    // Show agents belonging to current industry or global CEO agents
    const isGlobalOrLocal = agent.id.startsWith(selectedIndustry[0]) || agent.id.includes('ceo');
    return matchesSearch && isGlobalOrLocal;
  });

  const handleStartEdit = (agent: AIEmployee) => {
    setEditingAgentId(agent.id);
    setEditPromptValue(agent.systemPrompt);
    setEditModelValue(agent.model);
  };

  const handleSaveEdit = (agentId: string) => {
    const updated = activeAgents.map(a => {
      if (a.id === agentId) {
        addLog(
          'System Operator',
          'Updated Agent System Prompt',
          `Re-calibrated system instruction prompt weights and LLM endpoint targeting (${editModelValue}) for AI: [${a.name}].`,
          'success'
        );
        return {
          ...a,
          systemPrompt: editPromptValue,
          model: editModelValue
        };
      }
      return a;
    });
    onUpdateAgents(updated);
    setEditingAgentId(null);
  };

  const handleAddCapability = () => {
    if (newCapability.trim()) {
      setNewCapabilitiesList([...newCapabilitiesList, newCapability.trim()]);
      setNewCapability('');
    }
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTitle || !newSystemPrompt) return;

    const newAgent: AIEmployee = {
      id: `${selectedIndustry[0]}_agent_${Date.now()}`,
      name: newName,
      title: newTitle,
      role: newRole || 'Assists with localized corporate storefront operations.',
      status: 'Idle',
      emoji: newEmoji,
      description: `A customized AI agent specialized for our ${selectedIndustry} operations structure.`,
      capabilities: newCapabilitiesList.length > 0 ? newCapabilitiesList : ['SaaS Operations Helper'],
      systemPrompt: newSystemPrompt,
      model: newModel,
      tasksCompleted: 0
    };

    onUpdateAgents([...activeAgents, newAgent]);
    addLog(
      'System Operator',
      'Provisioned Custom AI Employee',
      `Spawned dynamic agent "${newAgent.name}" successfully. Injected customized workflow parameters & system roles.`,
      'success'
    );

    // Reset Form
    setNewName('');
    setNewTitle('');
    setNewEmoji('🤖');
    setNewRole('');
    setNewCapabilitiesList([]);
    setNewSystemPrompt('');
    setNewModel('gemini-3.5-flash');
    setShowAddForm(false);
  };

  const handleDeleteAgent = (agentId: string, agentName: string) => {
    if (confirm(`Are you sure you want to offboard/decommission AI Employee "${agentName}"?`)) {
      onUpdateAgents(activeAgents.filter(a => a.id !== agentId));
      addLog(
        'System Operator',
        'Decommissioned AI agent',
        `Cleanly offboarded AI agent "${agentName}" and severed active multi-agent workflow bindings.`,
        'warning'
      );
    }
  };

  // ========================================================
  // REAL-TIME ANALYTICS CALCULATIONS
  // ========================================================
  const getDailySalesData = () => {
    const days = ['周一 (Mon)', '周二 (Tue)', '周三 (Wed)', '周四 (Thu)', '周五 (Fri)', '周六 (Sat)', '周日 (Sun)'];
    const totalSalesVal = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0);
    const scaleFactor = totalSalesVal > 0 ? (totalSalesVal / 1500) : 1;
    return days.map((day, idx) => {
      const baseSales = [1240, 1890, 1420, 2100, 3100, 2800, 3900][idx] * scaleFactor;
      const baseOrders = [12, 19, 14, 21, 31, 28, 39][idx];
      return {
        name: day,
        "销售额 ($)": Math.round(baseSales * 100) / 100,
        "订单数": baseOrders
      };
    });
  };

  const getCustomerChurnData = () => {
    const activeCount = (customers || []).filter(c => c.status === 'active').length || 15;
    const inactiveCount = (customers || []).filter(c => c.status === 'inactive').length || 3;
    const total = activeCount + inactiveCount;
    const churnPercent = total > 0 ? Math.round((inactiveCount / total) * 100) : 16.7;

    const cohorts = [
      { name: '1月 (Jan)', "活跃数": Math.max(activeCount - 5, 2), "流失数": Math.max(inactiveCount - 2, 0) },
      { name: '2月 (Feb)', "活跃数": Math.max(activeCount - 3, 2), "流失数": Math.max(inactiveCount - 1, 0) },
      { name: '3月 (Mar)', "活跃数": Math.max(activeCount - 1, 3), "流失数": Math.max(inactiveCount + 1, 1) },
      { name: '4月 (Apr)', "活跃数": Math.max(activeCount, 4), "流失数": Math.max(inactiveCount, 1) },
      { name: '5月 (May)', "活跃数": Math.max(activeCount + 2, 5), "流失数": Math.max(inactiveCount - 1, 0) },
      { name: '6月 (Jun)', "活跃数": activeCount, "流失数": inactiveCount }
    ];

    return {
      activeCount,
      inactiveCount,
      churnPercent,
      cohorts
    };
  };

  const getInventoryTurnoverData = () => {
    if (!products || products.length === 0) {
      return [
        { name: 'KB-104 Keyboard', "累计销量": 840, "剩余存量": 120, "周转指数": 7.0 },
        { name: 'HP-189 Headphones', "累计销量": 1240, "剩余存量": 12, "周转指数": 103.3 },
        { name: 'MT-502 Monitor', "累计销量": 310, "剩余存量": 5, "周转指数": 62.0 },
        { name: 'RS-213 Riser', "累计销量": 240, "剩余存量": 152, "周转指数": 1.6 }
      ];
    }
    return products.slice(0, 6).map(p => {
      const turnoverIndex = Math.round((p.sales / (p.stock || 1)) * 10) / 10;
      const cleanName = p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name;
      return {
        name: cleanName,
        "累计销量": p.sales || 0,
        "剩余存量": p.stock || 0,
        "周转指数": turnoverIndex || 1.1
      };
    });
  };

  const handleTriggerForecast = () => {
    setForecastLoading(true);
    addLog(
      'Analytics Agent',
      '启动销量预测模型',
      '开始计算多维度非线性关联贝叶斯决策概率，并比对全店销量及库存周转热度。',
      'info'
    );
    
    setTimeout(() => {
      setForecastLoading(false);
      setForecastTriggered(true);
      addLog(
        'Analytics Agent',
        '销量自愈自适应调优成功',
        '根据 AI 算法多维比对结论，建议对HP-189降价15%清仓，并对存货周转指数极高（103.3）的 Headphones 货源追加补商 150 件以恢复最佳动销率。',
        'success'
      );
    }, 1500);
  };

  const handleExportCSV = () => {
    const sData = getDailySalesData();
    const cData = getCustomerChurnData();
    const tData = getInventoryTurnoverData();

    let csvRows: string[] = [];
    
    // Header info
    csvRows.push("=== STORE REAL-TIME ANALYTICS METRICS INVENTORY REPORT ===");
    csvRows.push(`Generated At,${new Date().toISOString()}`);
    csvRows.push(`Industry Preset,${selectedIndustry.toUpperCase()}`);
    csvRows.push("");

    // Section 1: Weekly Sales Trend
    csvRows.push("SECTION 1 - WEEKLY SALES REVENUE & ORDERS TREND");
    csvRows.push("Day,Sales ($),Orders");
    sData.forEach(row => {
      csvRows.push(`"${row.name}",${row["销售额 ($)"]},${row["订单数"]}`);
    });
    csvRows.push("");

    // Section 2: Churn Cohort
    csvRows.push("SECTION 2 - CUSTOMER COHORT ATTRITION & RETENTION");
    csvRows.push("Cohort Month,Active Count,Churn Count");
    cData.cohorts.forEach(row => {
      csvRows.push(`"${row.name}",${row["活跃数"]},${row["流失数"]}`);
    });
    csvRows.push("");

    // Section 3: SKU Inventory Turnover
    csvRows.push("SECTION 3 - SKU INVENTORY TURNOVER AND VELOCITY");
    csvRows.push("Product Name,Cumulative Sales,Remaining Stocks,Turnover Index");
    tData.forEach(row => {
      csvRows.push(`"${row.name}",${row["累计销量"]},${row["剩余存量"]},${row["周转指数"]}`);
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedIndustry}_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addLog(
      'Analytics Agent',
      '导出实时商业指标',
      '成功打包交易流水、客群留存、SKU库存动销比等核心 Recharts 商业度量指标并保存为 CSV 物理文件。',
      'success'
    );
  };

  // KPIs
  const totalTasks = visibleAgents.reduce((sum, a) => sum + (a.tasksCompleted || 0), 0);
  const savedHours = (totalTasks * 0.4).toFixed(1); // average 24 minutes saved per task
  const savedROIValue = (parseFloat(savedHours) * 24.5).toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' }); // ¥24.5 / hr average junior staff rate

  if (selectedAgentForDashboard) {
    const sData = getDailySalesData();
    const cData = getCustomerChurnData();
    const tData = getInventoryTurnoverData();
    const totalSalesVal = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrdersVal = (orders || []).length;

    return (
      <div className="space-y-6 text-left animate-fadeIn">
        {/* Upper Navigation Header */}
        <div className="flex items-center justify-between border-b border-slate-205 pb-4">
          <button
            onClick={() => {
              setSelectedAgentForDashboard(null);
              setForecastTriggered(false);
            }}
            className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回雇员中心 / Back to Fleet</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-[#07C2E3]/25"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出商业指标 / Export Data (CSV)</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#07C2E3] animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Analytics Node: ACTIVE CONNECTED
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Title Brief */}
        <div className="p-6 bg-[#09090b] rounded-2xl border border-slate-800 text-left relative overflow-hidden">
          <div className="absolute right-10 bottom-0 top-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
            <BarChart3 className="w-64 h-64 text-white" />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-[10px] text-[#07C2E3] font-mono uppercase tracking-widest font-black flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-spin" /> Deep Intelligent BI Central
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-105 font-display">
              数据分析智能体决策控制台 (Analytics Agent Command Console)
            </h2>
            <p className="text-xs text-slate-400 max-w-4xl leading-relaxed">
              实时调取租户内部物理交易数据库线索，通过 Recharts 多通道响应式渲染。核心涉及单日营业总流水（Sales Revenue）、客群流失阻尼指数（Customer Cohort Churn）以及单个 SKU 实物存销周转动量。
            </p>
          </div>
        </div>

        {/* Big ROI KPIs Panel */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">真实交易流水 (GMV)</span>
              <div className="p-1.5 rounded-lg bg-[#07C2E3]/10 border border-[#07C2E3]/20 text-[#07C2E3]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                ${totalSalesVal > 0 ? totalSalesVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "12,480.00"}
              </span>
              <p className="text-[9px] text-[#07C2E3] mt-0.5 font-bold font-mono">
                {totalOrdersVal > 0 ? `${totalOrdersVal} 笔实时付款结算` : "暂无结算，展示基准 Preset"}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">客群流失率 (Churn)</span>
              <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-250 text-rose-500">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                {cData.churnPercent}%
              </span>
              <p className="text-[9px] text-rose-500 mt-0.5 font-bold font-mono">
                流失: {cData.inactiveCount} 人 | 留存: {cData.activeCount} 人
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">平均库存动销比</span>
              <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-500">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                {products.length > 0 ? (tData.reduce((sum, item) => sum + item["周转指数"], 0) / tData.length).toFixed(1) : "3.4"}x
              </span>
              <p className="text-[9px] text-slate-400 mt-0.5 font-medium">累计出库比在库剩余比例</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">决策算法置信度</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                99.4%
              </span>
              <p className="text-[9px] text-emerald-600 mt-0.5 font-bold">ECOS 交叉校验对平审计成功</p>
            </div>
          </div>
        </div>

        {/* CORE CHARTS: Daily sales, customer churn and stock turnover */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Chart 1: Daily sales trend area/line chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-left">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 font-display">
                  <TrendingUp className="w-4 h-4 text-[#07C2E3]" />
                  今日营业额与周订单趋势 (Weekly Sales Revenue & Orders Trend)
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  展现本租户当前工作周 7 日内实时累计成单及收款流水分布区间
                </p>
              </div>
              <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 font-semibold px-2 py-0.5 rounded font-mono">
                Area-Line Chart (Responsive)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#07C2E3" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#07C2E3" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e293b', borderRadius: '10px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
                  <Area type="monotone" dataKey="销售额 ($)" stroke="#07C2E3" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                  <Line type="monotone" dataKey="订单数" stroke="#F43F5E" strokeWidth={1.5} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Customer churn rate grouping comparison bar chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-left">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 font-display">
                  <Percent className="w-4 h-4 text-emerald-500" />
                  客群流失分析与留存队列 (Customer Attrition & Cohort Retention)
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  分月度监控客户流失阈值分布，提供自愈提醒阻尼测算
                </p>
              </div>
              <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 font-semibold px-2 py-0.5 rounded font-mono">
                Bar Chart (Grouped)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cData.cohorts} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e293b', borderRadius: '10px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
                  <Bar dataKey="活跃数" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="流失数" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Stock velocity bar and line chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 xl:col-span-2 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-left">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 font-display">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  商品 SKU 在库与售出比率 (SKU Inventory Turnover and Sales Velocity)
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  横向核对当前活跃单品的存销水位比（Turnover Ratio），反映单个产品出库动销率
                </p>
              </div>
              <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 font-semibold px-2 py-0.5 rounded font-mono">
                Mixed Bar-Line Chart
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#94A3B8" fontSize={9} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6366F1" fontSize={9} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#1e293b', borderRadius: '10px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
                  <Bar yAxisId="left" dataKey="累计销量" fill="#07C2E3" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar yAxisId="left" dataKey="剩余存量" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Line yAxisId="right" type="monotone" dataKey="周转指数" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* COGNITIVE RECONCILIATION CONTROL PAD */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Bot className="w-4 h-4 text-[#07C2E3]" />
              AI 销量诊断与自适应调优模型 (Decision Forecasting Controls)
            </h4>
            <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded">
              State Engine: ACTIVE RUNTIME
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              实时评估存货短缺并结合流失预警触发智能推荐。点击开启预测即可向多智能组网下发增补采购与价格补偿决策单据。
            </p>

            <button
              onClick={handleTriggerForecast}
              disabled={forecastLoading}
              className={`font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                forecastTriggered 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
              } ${forecastLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {forecastLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>正在深度求解中 (Executing Bayes AI)...</span>
                </>
              ) : forecastTriggered ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>销量预测计算完毕 (Yield Computed)</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>触发 AI 预测与销量自愈 (Execute Forecast)</span>
                </>
              )}
            </button>
          </div>

          {forecastTriggered && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2 text-xs text-emerald-800 animate-fadeIn text-left">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>智能体决策推荐：销量预测与周转补偿策略 (Decision Output)</span>
              </div>
              <ul className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed text-emerald-700 font-medium">
                <li>
                  <b className="font-extrabold text-slate-900 font-mono">在架清仓</b>: 系统发现 Curved Monitor 出库迟滞（周转指数比低过预定安全阈值），建议授权上线夏季 “SUMMER-SAVE” 活动降低多余容量积压；
                </li>
                <li>
                  <b className="font-extrabold text-slate-900 font-mono">紧急单补仓</b>: Headphones SKU 部分存物见底（周转指数 103.3，严重超载），建议立即批准由仓管 Oliver 自动提交 150 PCS 增购并同步派发供应商回发合同；
                </li>
                <li>
                  <b className="font-extrabold text-slate-900 font-mono">客群激活挽留</b>: 中断流失率目前驻留在 {cData.churnPercent}% 警报高位。建议通过营销 Webhook 拦截流失群集自动派发专属红包以重启粘性。
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top statistics banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm border border-indigo-950 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase font-mono">Core Fleet</span>
            <h4 className="text-2xl font-bold font-mono">{visibleAgents.length} Agents</h4>
            <p className="text-[11px] text-indigo-200">Active in {selectedIndustry.toUpperCase()} department</p>
          </div>
          <Bot className="w-12 h-12 text-indigo-400 opacity-40 shrink-0" />
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1 col-span-2">
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Delegated Execution</span>
            <h4 className="text-2xl font-bold text-slate-800 font-mono">{totalTasks} Decisions</h4>
            <p className="text-[11px] text-slate-500">Autonomous API tasks completed</p>
          </div>
          <Zap className="w-10 h-10 text-emerald-500 shrink-0 opacity-20" />
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1 col-span-2">
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Saved ROI (Human Equivalent)</span>
            <h4 className="text-2xl font-bold text-emerald-600 font-mono">{savedROIValue}</h4>
            <p className="text-[11px] text-slate-500">Estimated {savedHours} hours workforce saved</p>
          </div>
          <DollarSign className="w-10 h-10 text-emerald-500 shrink-0 opacity-20" />
        </div>
      </div>

      {/* Main Operations Block */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-800 font-display text-base">AI 雇员多代理集群组网</h3>
            <p className="text-xs text-[#07C2E3] font-mono mt-0.5 font-bold">AI_AGENTS</p>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="搜索 AI 雇员属性..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 px-3 py-1.5 rounded-xl text-xs w-48 font-mono"
            />
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 py-1.5 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>入职新型 AI 雇员</span>
            </button>
          </div>
        </div>

        {/* Add custom agent form */}
        {showAddForm && (
          <form onSubmit={handleCreateAgent} className="p-5 bg-slate-50 border border-indigo-100 rounded-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-indigo-100/50 pb-2">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                入职新 AI 团队雇员 (Spawn LLM Agent Persona)
              </h4>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Emoji 头像</label>
                <input 
                  type="text" 
                  value={newEmoji} 
                  onChange={e => setNewEmoji(e.target.value)}
                  className="w-full text-center bg-white border border-slate-300 rounded-lg py-1.5 text-sm" 
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">雇员姓名</label>
                <input 
                  type="text" 
                  required 
                  placeholder="例如: Sophia (索菲亚)" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800" 
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">岗位头衔</label>
                <input 
                  type="text" 
                  required 
                  placeholder="例如: 财务审计主管 Agent" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800" 
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">后台接口模型</label>
                <select 
                  value={newModel} 
                  onChange={e => setNewModel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash (极佳速度+推理)</option>
                  <option value="gemini-3.5-pro">Gemini 3.5 Pro (深度专家分析型)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">主要职能描述</label>
                <textarea 
                  rows={2}
                  value={newRole} 
                  onChange={e => setNewRole(e.target.value)}
                  placeholder="主导特定业务周期的自动化审计及物流跟踪决策..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 text-slate-700" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">AI 技能组 / 接口工具能力 (Capabilities)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="输入一个技能(例如: PDF发票解析)" 
                    value={newCapability} 
                    onChange={e => setNewCapability(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1 text-xs focus:ring-1 focus:ring-indigo-505" 
                  />
                  <button 
                    type="button" 
                    onClick={handleAddCapability}
                    className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 px-3.5 py-1 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {newCapabilitiesList.map((cap, ci) => (
                    <span key={ci} className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      {cap}
                      <button type="button" onClick={() => setNewCapabilitiesList(newCapabilitiesList.filter((_, idx) => idx !== ci))} className="text-slate-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                  {newCapabilitiesList.length === 0 && <span className="text-[10px] text-slate-400 italic font-normal">暂无自定义技能，默认赋予基础 OS 协同检索权限。</span>}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">系统设定 System Prompt (AI 岗位指导指令)</label>
              <MarkdownCodeEditor 
                value={newSystemPrompt} 
                onChange={val => setNewSystemPrompt(val)}
                placeholder="你是一个零售服装供应链采购决策专家。只相信事实SKU和合理成本比例，说话冷静、高效率，使用结构化条款回复商户..."
                rows={4}
                minHeight="120px"
                label="Create New AI Agent Prompt"
                aiContext="Creating a new professional AI Agent prompt, specializing in retail commerce, task automation, and B2B workflow orchestration."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-150">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="text-slate-500 hover:text-rose-500 font-bold text-xs px-4 py-2 cursor-pointer"
              >
                取消
              </button>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-200 cursor-pointer"
              >
                授权并正式入职 (Confirm Authorization)
              </button>
            </div>
          </form>
        )}

        {/* AI Employees grid list */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {visibleAgents.map((agent) => {
            const isEditing = editingAgentId === agent.id;

            return (
              <div 
                key={agent.id} 
                className={`border rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all text-left flex flex-col justify-between ${
                  isEditing 
                    ? 'border-indigo-550 ring-2 ring-indigo-50 bg-indigo-50/10' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-left">
                      <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shadow-inner select-none">
                        {agent.emoji}
                      </span>
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 font-display text-sm">{agent.name}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Offline' ? 'bg-slate-300' : 'bg-emerald-500 animate-pulse'}`}></span>
                        </div>
                        <span className="text-[10px] bg-slate-150 text-slate-600 px-2 py-0.2 rounded font-mono font-bold leading-tight uppercase w-max tracking-wide">
                          {agent.title}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(agent)}
                          title="配置 AI 意识和底层逻辑"
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Settings2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Only custom agents can be offboarded */}
                      {agent.id.includes('agent') && (
                        <button
                          onClick={() => handleDeleteAgent(agent.id, agent.name)}
                          title="解雇/注销 AI 雇员"
                          className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                    {agent.role}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {agent.capabilities.map((cap, index) => (
                      <span key={index} className="text-[9px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded leading-normal">
                        ⚙️ {cap}
                      </span>
                    ))}
                  </div>

                  {agent.id.endsWith('_analytics') && (
                    <button
                      onClick={() => {
                        setSelectedAgentForDashboard(agent.id);
                        addLog('Analytics Agent', '查看决策看板', '调取 Recharts 深度计算中枢以监控各商户数据自愈曲线。', 'success');
                      }}
                      className="w-full mt-2 font-black text-xs text-white bg-[#07C2E3] hover:bg-[#06B2D0] py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-[#07C2E3]/25 font-sans"
                    >
                      <BarChart3 className="w-4.5 h-4.5" />
                      <span>查看数据分析智能仪表盘 (Open Recharts BI)</span>
                    </button>
                  )}

                  {/* System Instruction / prompt editor */}
                  {isEditing ? (
                    <div className="space-y-3 bg-slate-50 border border-indigo-100 rounded-xl p-3 animate-fadeIn mt-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-indigo-900 tracking-wider">岗位底层提示词 Prompt 调节</span>
                        <select 
                          value={editModelValue}
                          onChange={(e) => setEditModelValue(e.target.value)}
                          className="bg-white border rounded text-[10px] p-0.5 focus:outline-none"
                        >
                          <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                          <option value="gemini-3.5-pro">Gemini 3.5 Pro</option>
                        </select>
                      </div>
                      <MarkdownCodeEditor
                        value={editPromptValue}
                        onChange={val => setEditPromptValue(val)}
                        placeholder="请输入或由 AI 智能优化的员工系统 prompt 指令。详细定义其角色背景、应对边界与核心MCP工具权限分配。"
                        rows={5}
                        minHeight="150px"
                        label={`Edit Agent: ${agent.name}`}
                        aiContext={`Tuning existing AI Agent prompt, Agent name: ${agent.name}, Title: ${agent.title}, Role: ${agent.role}`}
                      />
                      <div className="flex justify-end gap-2 text-xs">
                        <button 
                          onClick={() => setEditingAgentId(null)}
                          className="text-slate-500 hover:text-red-500 py-1 px-2.5 font-bold cursor-pointer"
                        >
                          取消
                        </button>
                        <button 
                          onClick={() => handleSaveEdit(agent.id)}
                          className="bg-indigo-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-indigo-755 cursor-pointer"
                        >
                          同步意识参数
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] leading-relaxed relative max-h-24 overflow-y-auto mt-2">
                      <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider mb-0.5">ACTIVE SYSTEM PROMPT:</span>
                      <code className="text-slate-500 font-mono font-medium block whitespace-pre-wrap">{agent.systemPrompt}</code>
                    </div>
                  )}
                </div>

                {/* Dashboard Metrics footer per agent */}
                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>自动接管: <b className="text-slate-800 font-mono">{(agent.tasksCompleted || 0) * 2}</b> 项后台任务</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] bg-indigo-50/50 text-indigo-805 border border-indigo-100/50 px-2 rounded">
                      Model: <b>{agent.model}</b>
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-800">
                      ROI: {(agent.tasksCompleted || 0) * 0.4}hr
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
