import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Sliders, 
  ShieldAlert, 
  Shuffle, 
  Zap, 
  Plus, 
  Terminal, 
  FileText, 
  RotateCw, 
  Play, 
  Check, 
  X,
  Target,
  UserCheck,
  ChevronRight,
  TrendingDown,
  Percent
} from 'lucide-react';
import { dbEngine } from '../../../db/dbEngine';
import { BusinessEvent, StateTransition, GoalMonitor, TriggerLog, EscalationRecord, SignalCorrelation, ExecutiveAlert } from '../../../types';

export default function EcosEnterpriseNervousSystem() {
  const tenantId = 'tenant_global_moda';
  
  // Database State sync
  const [events, setEvents] = useState<BusinessEvent[]>([]);
  const [transitions, setTransitions] = useState<StateTransition[]>([]);
  const [goals, setGoals] = useState<GoalMonitor[]>([]);
  const [triggers, setTriggers] = useState<TriggerLog[]>([]);
  const [escalations, setEscalations] = useState<EscalationRecord[]>([]);
  const [correlations, setCorrelations] = useState<SignalCorrelation[]>([]);
  const [alerts, setAlerts] = useState<ExecutiveAlert[]>([]);
  const [metrics, setMetrics] = useState({
    businessAwarenessIndex: 98,
    goalDriftIndex: 11,
    operationalStabilityIndex: 88,
    totalEventsCount: 0,
    totalGoalsCount: 0,
    activeEscalationsCount: 0
  });

  // UI Local states
  const [selectedEvent, setSelectedEvent] = useState<BusinessEvent | null>(null);
  const [simulationCategory, setSimulationCategory] = useState<BusinessEvent['eventType']>('InventoryLow');
  const [simulationTitle, setSimulationTitle] = useState('');
  const [simulationDesc, setSimulationDesc] = useState('');
  const [simulationSeverity, setSimulationSeverity] = useState<BusinessEvent['severity']>('warning');
  const [activeSubView, setActiveSubView] = useState<'all' | 'critical' | 'correlated'>('all');

  const loadData = () => {
    const evts = dbEngine.enterprise_nervous_system.getEvents(tenantId);
    const trans = dbEngine.enterprise_nervous_system.getTransitions(tenantId);
    const gls = dbEngine.enterprise_nervous_system.getGoals(tenantId);
    const trgs = dbEngine.enterprise_nervous_system.getTriggers(tenantId);
    const escs = dbEngine.enterprise_nervous_system.getEscalations(tenantId);
    const corrs = dbEngine.enterprise_nervous_system.getCorrelations(tenantId);
    const alts = dbEngine.enterprise_nervous_system.getAlerts(tenantId);
    const m = dbEngine.enterprise_nervous_system.getNervousMetrics(tenantId);

    // Sort logs descending by timestamp or insertion
    setEvents([...evts].reverse());
    setTransitions([...trans].reverse());
    setGoals(gls);
    setTriggers([...trgs].reverse());
    setEscalations([...escs].reverse());
    setCorrelations([...corrs].reverse());
    setAlerts([...alts].reverse());
    setMetrics(m);
  };

  useEffect(() => {
    loadData();
    // Subscribe to state change
    const handleUpdate = () => {
      loadData();
    };
    
    // We add a window interval for reactivity mockup
    const interval = setInterval(() => {
      loadData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulationTitle.trim()) return;

    dbEngine.enterprise_nervous_system.createEvent(tenantId, {
      eventType: simulationCategory,
      severity: simulationSeverity,
      title: simulationTitle,
      description: simulationDesc || `Standard telemetry override processed in Shopify. Metric variance detected outside standard bounds.`,
      metricsAffected: { deviationScore: 18.5, simulatedNode: 1 }
    });

    // Reset inputs
    setSimulationTitle('');
    setSimulationDesc('');
    loadData();
  };

  const handleSimulateTargetDeficit = (type: BusinessEvent['eventType']) => {
    let title = '';
    let desc = '';
    let severity: BusinessEvent['severity'] = 'warning';
    
    if (type === 'CashFlowRisk') {
      title = 'Cash Reserve Buffer Drift Alert';
      desc = 'Liquidity ratio fell below 2.1x due to Swiss custom bank tariff adjustments clearing pre-orders.';
      severity = 'critical';
    } else if (type === 'CustomerChurn') {
      title = 'Premium Subscription Retainer Dip';
      desc = 'Sudden cancellation of 12 bulk fashion brand accounts detected during regional delivery delay.';
      severity = 'warning';
    } else if (type === 'ExternalTariffShock') {
      title = 'Alpine Surcharge Corridor Tax Adjusted';
      desc = 'Raw thread imports are hit with an unscheduled 18% custom duty increase from Zurich shipping nodes.';
      severity = 'critical';
    } else if (type === 'InventoryLow') {
      title = 'Winter Coats Raw Cotton Shortage';
      desc = 'Supplier fiber roll inventory levels collapsed below 1,500 rolls minimum safety configuration.';
      severity = 'critical';
    }

    dbEngine.enterprise_nervous_system.createEvent(tenantId, {
      eventType: type,
      severity,
      title,
      description: desc,
      metricsAffected: { impactIndex: 78, marginBreach: 12.5 }
    });
    
    loadData();
  };

  const handleSlideGoal = (goalId: string, value: number) => {
    dbEngine.enterprise_nervous_system.updateGoalValue(tenantId, goalId, value);
    loadData();
  };

  const handleAuthorizeAlert = (alertId: string) => {
    dbEngine.enterprise_nervous_system.updateAlertStatus(tenantId, alertId, 'authorizing_execution');
    loadData();
  };

  const handleDismissAlert = (alertId: string) => {
    dbEngine.enterprise_nervous_system.updateAlertStatus(tenantId, alertId, 'dismissed');
    loadData();
  };

  const handleResolveEscalation = (escId: string) => {
    dbEngine.enterprise_nervous_system.updateEscalationStatus(tenantId, escId, 'mitigated');
    loadData();
  };

  return (
    <div id="ecos-nervous-system-workbench" className="bg-[#FAF9F6] text-slate-900 min-h-screen p-6 font-sans">
      
      {/* 1. Header Banner & Aesthetic Concept */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5Packed">
            <span className="p-1 px-2.5 rounded-full bg-[#07C2E3]/10 text-[#07C2E3] font-mono text-[10px] uppercase font-black tracking-widest">
              Phase 183 - 190 Active
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 font-mono">ESTABLISHED NEURAL NERVOUS CORES</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 font-sans flex items-center gap-2">
            ECOS 主动神经系统 <span className="text-lg font-light text-slate-500">Enterprise Nervous System</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
            取代“请求-响应”被动式AI，转入<strong>事件、状态、目标联合驱动</strong>的自感知架构。持续、自主探测企业财务红线、商机窗口与跨系统信号。
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={loadData}
            className="p-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500 animate-spin-hover" />
            手动拉取最新脉搏
          </button>
        </div>
      </div>

      {/* 2. Unified Indexes (Phase 190 Scoreboards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Index 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#07C2E3]"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 font-mono tracking-wider">BUSINESS AWARENESS INDEX</span>
            <span className="p-1 rounded bg-[#07C2E3]/10 text-[#07C2E3]">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-slate-900">
              {metrics.businessAwarenessIndex}%
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 敏捷
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5">
            业务事件自动捕获与多重信号关联率。低延迟高精度感知。
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#07C2E3] h-full transition-all duration-500" style={{ width: `${metrics.businessAwarenessIndex}%` }}></div>
          </div>
        </div>

        {/* Index 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 font-mono tracking-wider">AVERAGE GOAL DRIFT INDEX</span>
            <span className="p-1 rounded bg-amber-50 text-amber-600">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-slate-900">
              {metrics.goalDriftIndex}%
            </span>
            <span className={`text-xs font-bold flex items-center px-1.5 py-0.5 rounded ${metrics.goalDriftIndex > 10 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {metrics.goalDriftIndex > 15 ? 'Drifted Severe' : 'Stable Margin'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5">
            当前财务与运营核心计划总体偏离度。偏离度越低越好。
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, metrics.goalDriftIndex * 4)}%` }}></div>
          </div>
        </div>

        {/* Index 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 font-mono tracking-wider">OPERATIONAL STABILITY</span>
            <span className="p-1 rounded bg-slate-100 text-slate-800">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-slate-900">
              {metrics.operationalStabilityIndex}%
            </span>
            <span className="text-xs text-[#07C2E3] font-bold flex items-center bg-blue-50 px-1.5 py-0.5 rounded">
              Constitution Safe
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2.5">
            根据子系统危机级别与挂载的代偿性补救序列状态进行计算。
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-slate-900 h-full transition-all duration-500" style={{ width: `${metrics.operationalStabilityIndex}%` }}></div>
          </div>
        </div>
      </div>

      {/* 3. Main Operational Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Hand: Business Event Bus & State Transition Registry */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Phase 183: Business Event Bus */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#07C2E3]"></span>
                <h2 className="text-base font-bold text-slate-900">
                  业务事件传输总线 (Unified Event Bus)
                </h2>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 p-0.5 px-2 rounded-full">
                Phase 183
              </span>
            </div>

            {/* Quick inject trigger nodes */}
            <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-black uppercase text-slate-500 font-mono tracking-wider block mb-2.5">
                ⚡ 主动探测快速模拟/注入 (Proactive Discovery Trigger)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button 
                  onClick={() => handleSimulateTargetDeficit('InventoryLow')}
                  className="bg-white border text-left border-slate-200 hover:border-[#07C2E3] p-2.5 rounded-lg text-[11px] font-medium text-slate-700 hover:text-slate-950 transition cursor-pointer flex flex-col justify-between h-16"
                >
                  <span className="text-[#07C2E3] font-bold">羊毛短缺</span>
                  <span className="text-[10px] text-slate-400">Inventory Drop</span>
                </button>
                <button 
                  onClick={() => handleSimulateTargetDeficit('CashFlowRisk')}
                  className="bg-white border text-left border-slate-200 hover:border-amber-500 p-2.5 rounded-lg text-[11px] font-medium text-slate-700 hover:text-slate-950 transition cursor-pointer flex flex-col justify-between h-16"
                >
                  <span className="text-amber-500 font-bold">现金流预警</span>
                  <span className="text-[10px] text-slate-400">Liquidity Stress</span>
                </button>
                <button 
                  onClick={() => handleSimulateTargetDeficit('CustomerChurn')}
                  className="bg-white border text-left border-slate-200 hover:border-purple-500 p-2.5 rounded-lg text-[11px] font-medium text-slate-700 hover:text-slate-950 transition cursor-pointer flex flex-col justify-between h-16"
                >
                  <span className="text-purple-600 font-bold">主客户退订</span>
                  <span className="text-[10px] text-slate-400">Churn Threat</span>
                </button>
                <button 
                  onClick={() => handleSimulateTargetDeficit('ExternalTariffShock')}
                  className="bg-white border text-left border-slate-200 hover:border-rose-500 p-2.5 rounded-lg text-[11px] font-medium text-slate-700 hover:text-slate-950 transition cursor-pointer flex flex-col justify-between h-16"
                >
                  <span className="text-rose-600 font-bold">突发关税壁垒</span>
                  <span className="text-[10px] text-slate-400">External Tariff</span>
                </button>
              </div>
            </div>

            {/* Custom inject form toggles */}
            <form onSubmit={handleCreateEvent} className="space-y-3 mb-6 p-4 border border-dashed border-slate-200 rounded-xl bg-white focus-within:border-[#07C2E3] transition">
              <span className="text-[11px] font-bold text-slate-700 tracking-wide block">
                ✍️ 录入自定义业务条件事件:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select 
                  value={simulationCategory}
                  onChange={(e) => setSimulationCategory(e.target.value as any)}
                  className="p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                >
                  <option value="InventoryLow">📦 羊毛库存不足 (InventoryLow)</option>
                  <option value="SalesDrop">📉 销售额阶段下跌 (SalesDrop)</option>
                  <option value="CashFlowRisk">💰 现金流周转缺口 (CashFlowRisk)</option>
                  <option value="CustomerChurn">👥 买家流失预判 (CustomerChurn)</option>
                  <option value="MarginViolation">⚖️ 产品毛利突破红线 (MarginViolation)</option>
                  <option value="ExternalTariffShock">🌍 突发地缘关税加税 (ExternalTariffShock)</option>
                  <option value="AnomalyDetected">📡 渠道接口状态异常 (AnomalyDetected)</option>
                </select>

                <select 
                  value={simulationSeverity}
                  onChange={(e) => setSimulationSeverity(e.target.value as any)}
                  className="p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                >
                  <option value="info">🟢 提示信息 (info)</option>
                  <option value="warning">🟡 警告等级 (warning)</option>
                  <option value="critical">🔴 灾难边界 (critical)</option>
                </select>

                <input 
                  type="text" 
                  value={simulationTitle}
                  onChange={(e) => setSimulationTitle(e.target.value)}
                  placeholder="注入事件标题..."
                  className="p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={simulationDesc}
                  onChange={(e) => setSimulationDesc(e.target.value)}
                  placeholder="详细分析、数值溢出描述..."
                  className="flex-1 p-2 border border-slate-200 rounded-lg text-xs"
                />
                <button 
                  type="submit"
                  className="p-2 px-4 bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  提交通路
                </button>
              </div>
            </form>

            {/* List of bus events */}
            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-2">
              <AnimatePresence initial={false}>
                {events.map((evt) => {
                  const isCritical = evt.severity === 'critical';
                  const isWarning = evt.severity === 'warning';
                  
                  return (
                    <motion.div 
                      key={evt.id}
                      layoutId={`evt_card_${evt.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-sm hover:border-slate-300 transition"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 pl-2 pr-2 font-mono text-[9px] font-black rounded uppercase tracking-wider ${
                            isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            isWarning ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {evt.eventType}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          ID: {evt.id}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 mb-1">
                        {evt.title}
                      </h3>
                      <p className="text-[11px] text-slate-600 leading-relaxed fallback mb-2">
                        {evt.description}
                      </p>

                      {evt.metricsAffected && (
                        <div className="bg-white border rounded p-2 text-[10px] font-mono flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
                          {Object.entries(evt.metricsAffected).map(([key, val]) => (
                            <span key={key}>
                              <strong className="text-slate-800">{key}:</strong> {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Phase 184: State Transition Registry */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-800"></span>
                <h2 className="text-base font-bold text-slate-900">
                  业务状态机转移注册器 (State Transition Registry)
                </h2>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 p-0.5 px-2 rounded-full">
                Phase 184
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              实时记录企业各子板块（如库存、账期现金、毛利护城河）在事件冲击下的真实状态演化。构成企业级<strong>代偿状态机机制</strong>。
            </p>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2">
              {transitions.map((tra) => {
                const isToCritical = tra.toState === 'Critical';
                const isToWarning = tra.toState === 'Warning';
                
                return (
                  <div key={tra.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 relative">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-mono text-[9px] font-black uppercase">
                          {tra.subSystem}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(tra.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Rel: {tra.triggerEventId}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mb-2 py-1.5 bg-white border border-slate-100 rounded-lg px-2.5">
                      <span className="text-xs font-semibold text-slate-500">{tra.fromState}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${
                        isToCritical ? 'bg-rose-50 text-rose-700' :
                        isToWarning ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {tra.toState}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      <span className="text-slate-500 font-bold">触发原由:</span> {tra.rationale}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Hand: Goal Monitoring Network & Triggers */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Phase 185: Goal Monitoring Network */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                <h2 className="text-base font-bold text-slate-900">
                  终极经营目标监控网
                </h2>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 p-0.5 px-2 rounded-full">
                Phase 185
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              直接对齐CEO设定的生存红线。拖动下方滑块控制当前值，系统将自动测算Goal Drift度并适时警报自愈：
            </p>

            <div className="space-y-6">
              {goals.map((gl) => {
                const isDeviated = gl.status === 'deviated';
                const isSevere = gl.status === 'severe_drift';
                
                return (
                  <div key={gl.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 leading-tight">
                          {gl.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase">
                          Type: {gl.goalType}
                        </p>
                      </div>
                      <span className={`p-1 pl-2 pr-2 text-[9px] font-black uppercase rounded tracking-wider ${
                        isSevere ? 'bg-rose-100 text-rose-800' :
                        isDeviated ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {gl.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                      {gl.description}
                    </p>

                    {/* Numeric targets */}
                    <div className="grid grid-cols-3 gap-2 py-1.5 bg-white border border-slate-100 rounded-lg p-2 text-center text-xs font-normal mb-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono">TARGET</span>
                        <span className="font-extrabold text-slate-800">{gl.targetValue}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono">CURRENT</span>
                        <span className="font-extrabold text-slate-900">{gl.currentValue}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono">DRIFT</span>
                        <span className={`font-extrabold ${isSevere ? 'text-rose-600' : isDeviated ? 'text-amber-600' : 'text-slate-800'}`}>
                          {gl.driftIndex}%
                        </span>
                      </div>
                    </div>

                    {/* Range slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                        <span>0</span>
                        <span>Max Limit (Swiss Caps)</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max={gl.targetValue * 1.5}
                        value={gl.currentValue}
                        onChange={(e) => handleSlideGoal(gl.id, Number(e.target.value))}
                        className="w-full accent-[#07C2E3] h-1 bg-slate-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 186: Trigger Framework Log */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                <h2 className="text-base font-bold text-slate-900">
                  触发器引擎执行日志 (Trigger Framework)
                </h2>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 p-0.5 px-2 rounded-full">
                Phase 186
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              监控阈值、连续时间趋势偏差与复合信号。一旦被引爆，立即触发自主补偿或代偿。
            </p>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2">
              {triggers.map((trg) => (
                <div key={trg.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 font-bold rounded">
                      {trg.triggerType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(trg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 font-semibold mb-1">
                    <span className="text-slate-400">满足条件:</span> {trg.ruleBinding}
                  </p>
                  
                  <div className="p-2 border border-[#07C2E3]/20 bg-[#07C2E3]/5 text-slate-900 rounded-lg font-mono text-[10px] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#07C2E3] shrink-0" />
                    <strong>执行动作:</strong> {trg.firedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. Cross-System Signal Correlation (Phase 188) */}
      <div className="my-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <h2 className="text-base font-bold text-slate-900">
              跨系统事件关联引擎 (Cross-System Signal Correlation)
            </h2>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-600 p-0.5 px-2 rounded-full">
            Phase 188
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          ECOS 神经系统会追踪孤立、看似不想交的偶发事件。如果它们在特定时间密集爆发，关联算法将聚合提炼并锁定更深层次的企业级系统压力。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {correlations.map((cor) => (
            <div key={cor.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 px-2.5 font-mono text-[10px] font-black bg-emerald-500 text-white rounded-bl-xl shadow-inner">
                {cor.confidenceScore}% Confidence Correlation
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <span className="p-1 px-1.5 bg-zinc-900 text-white rounded font-mono text-[9px]">CAUSAL CORRELATION</span>
                <span className="text-[10px] text-slate-400 font-mono">{new Date(cor.timestamp).toLocaleTimeString()}</span>
              </div>

              <h3 className="text-xs font-extrabold text-slate-900 mb-2 mt-1">
                {cor.unifiedEventTitle}
              </h3>

              <div className="p-3 bg-white border border-slate-150 rounded-xl mb-3">
                <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                  <strong className="text-slate-800">深度诊断分析: </strong>
                  {cor.analyticalSynthesis}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono">Correlated Signal IDs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cor.correlatedSignalIds.map((id) => (
                    <span key={id} className="text-[10px] font-mono p-1 bg-slate-200 text-slate-700 rounded select-none">
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. C-Suite Alerts & Mitigating Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
        
        {/* Phase 189: Executive Alert Intelligence */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#07C2E3]"></span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                总裁办危机预警决策 (Executive Board Alerts)
              </h2>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 p-0.5 px-2 rounded-full">
              Phase 189
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            一旦确认触发，ECOS 将推演出<strong>“拟损失评估”与“唯一对冲路径”</strong>。董事会可一键授权执行。
          </p>

          <div className="space-y-5">
            {alerts.filter(a => a.status !== 'dismissed').map((alt) => {
              const isExec = alt.status === 'executed';
              const isAuth = alt.status === 'authorizing_execution';
              
              return (
                <div key={alt.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 shadow-sm relative">
                  
                  {/* Alert Tag */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="p-1 px-2.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold font-mono uppercase tracking-wider">
                      {alt.alertType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Timestamp: {new Date(alt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <h3 className="text-xs font-extrabold text-slate-950 mb-1.5">
                    {alt.title}
                  </h3>
                  
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    {alt.description}
                  </p>

                  {/* Impact Estimation Block */}
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                    <h4 className="text-[10px] font-bold text-red-700 uppercase tracking-widest font-mono mb-1">
                      ⚠️ POTENTIAL REVENUE LOSS IMPACT
                    </h4>
                    <p className="text-[11px] text-red-900 font-medium">
                      {alt.impactEstimation}
                    </p>
                  </div>

                  {/* Action Proposed */}
                  <div className="p-3 bg-white border border-[#07C2E3]/20 rounded-xl mb-4">
                    <h4 className="text-[10px] font-bold text-[#07C2E3] uppercase tracking-widest font-mono mb-1 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> UNIQUE REMEDIATION PATHWAY
                    </h4>
                    <p className="text-[11px] text-slate-800 leading-relaxed">
                      {alt.proposedAction}
                    </p>
                  </div>

                  {/* Action Controllers */}
                  <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => handleDismissAlert(alt.id)}
                      disabled={isExec || isAuth}
                      className="p-1.5 px-3 bg-white border text-xs font-semibold text-slate-500 rounded hover:text-slate-800 hover:border-slate-300 transition cursor-pointer disabled:opacity-50"
                    >
                      忽略信号
                    </button>

                    <button 
                      onClick={() => handleAuthorizeAlert(alt.id)}
                      disabled={isExec || isAuth}
                      className={`p-1.5 px-4 rounded text-xs font-semibold text-white transition flex items-center gap-1 ${
                        isExec ? 'bg-emerald-600 cursor-default' :
                        isAuth ? 'bg-slate-400 cursor-wait' :
                        'bg-[#07C2E3] hover:bg-[#06B2D0] cursor-pointer shadow-sm'
                      }`}
                    >
                      {isExec ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          对冲指令已下达
                        </>
                      ) : isAuth ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          调度代偿资源包...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          授权一键执行自愈
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase 187: Autonomous Escalation System */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-900"></span>
              <h2 className="text-base font-bold text-slate-900">
                自主安全消纳路径 (Autonomous Escalation System)
              </h2>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 p-0.5 px-2 rounded-full">
              Phase 187
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            将业务事件进行层级消纳（Level 1 至 Level 5）。从底层自动代理调节、再到本系统对冲、直至跨国宪法董事会一票否决。每一层都具有明确的阻绝边界。
          </p>

          <div className="space-y-4">
            {escalations.map((esc) => {
              const isMitigated = esc.status === 'mitigated';
              
              return (
                <div key={esc.id} className="p-4 border border-slate-200 bg-slate-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {esc.id} | Alert: {esc.alertId}
                    </span>
                    <span className={`p-0.5 px-2 font-mono text-[9px] font-black rounded ${
                      isMitigated ? 'bg-emerald-100 text-emerald-800' : 'bg-red-150 text-red-900 bg-red-100'
                    }`}>
                      {esc.status === 'pending_mitigation' ? '⚠️ Pending Mitigation' : '✅ Mitigated'}
                    </span>
                  </div>

                  {/* Level gauge strip */}
                  <div className="flex items-center gap-1.5 mb-3 bg-white p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 font-mono uppercase shrink-0">
                      ESCALATION LAYER:
                    </span>
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div 
                          key={lvl} 
                          className={`h-2.5 flex-1 rounded ${
                            lvl <= esc.escalationLevel 
                              ? (esc.escalationLevel >= 4 ? 'bg-rose-500' : 'bg-[#07C2E3]')
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 font-mono">
                      L{esc.escalationLevel}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p>
                      <strong className="text-slate-500">自愈调度官:</strong> {esc.responsibleCoordinator}
                    </p>
                    <p>
                      <strong className="text-slate-500">推荐消除消竭方案:</strong> {esc.remediationPathProposed}
                    </p>
                  </div>

                  {!isMitigated && (
                    <div className="flex justify-end mt-3 pt-2.5 border-t border-slate-200">
                      <button 
                        onClick={() => handleResolveEscalation(esc.id)}
                        className="p-1 px-3 bg-white border border-slate-200 hover:border-slate-300 text-[11px] font-bold text-slate-700 rounded transition flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        标记为本地对冲消除 (Mitigated)
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
