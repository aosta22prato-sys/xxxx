import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Target, ShieldAlert, RotateCw, ArrowRight,
  Sliders, Plus, Loader2, RefreshCw, Send, CheckCircle2, Check,
  AlertCircle, Sparkles, AlertOctagon, UserCheck, Zap, Server, ShieldCheck, HeartPulse
} from 'lucide-react';
import { dbEngine } from '../../../../src/db/dbEngine';
import { BusinessEvent, StateTransition, GoalMonitor, TriggerLog, EscalationRecord, SignalCorrelation, ExecutiveAlert } from '../../../../src/types';

interface EcosEnterpriseNervousSystemProps {
  tenantId?: string;
}

export default function EcosEnterpriseNervousSystem({ tenantId = 't_retail' }: EcosEnterpriseNervousSystemProps) {
  // Database States
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

  // Form local parameter bounds
  const [simulationCategory, setSimulationCategory] = useState<BusinessEvent['eventType']>('InventoryLow');
  const [simulationSeverity, setSimulationSeverity] = useState<BusinessEvent['severity']>('warning');
  const [simulationTitle, setSimulationTitle] = useState('在库大品类安全水位线预警');
  const [simulationDesc, setSimulationDesc] = useState('欧洲物流周转延误，备配在库水位线下移至 8 件。');

  const loadData = () => {
    try {
      const evts = dbEngine.enterprise_nervous_system.getEvents(tenantId);
      const trans = dbEngine.enterprise_nervous_system.getTransitions(tenantId);
      const gls = dbEngine.enterprise_nervous_system.getGoals(tenantId);
      const trgs = dbEngine.enterprise_nervous_system.getTriggers(tenantId);
      const escs = dbEngine.enterprise_nervous_system.getEscalations(tenantId);
      const corrs = dbEngine.enterprise_nervous_system.getCorrelations(tenantId);
      const alts = dbEngine.enterprise_nervous_system.getAlerts(tenantId);
      const m = dbEngine.enterprise_nervous_system.getNervousMetrics(tenantId);

      setEvents([...evts].reverse());
      setTransitions([...trans].reverse());
      setGoals(gls);
      setTriggers([...trgs].reverse());
      setEscalations([...escs].reverse());
      setCorrelations([...corrs].reverse());
      setAlerts([...alts].reverse());
      setMetrics(m);
    } catch (e) {
      console.warn('Nervous system storage read error:', e);
    }
  };

  useEffect(() => {
    loadData();
    // 轮询及订阅对齐，确保后台更新后，前台自动拉取
    const uns = dbEngine.subscribe('all', () => {
      loadData();
    });
    return uns;
  }, [tenantId]);

  // 自主事件注入
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulationTitle.trim()) return;

    dbEngine.enterprise_nervous_system.createEvent(tenantId, {
      eventType: simulationCategory,
      severity: simulationSeverity,
      title: simulationTitle,
      description: simulationDesc || '手动注入的自定义监测事件参数发生偏移。',
      metricsAffected: { impactFactor: 11.2 }
    });

    setSimulationTitle('');
    setSimulationDesc('');
    loadData();
  };

  // 快捷模拟压力测试
  const handleSimulateTargetDeficit = (type: BusinessEvent['eventType']) => {
    let title = '';
    let desc = '';
    let severity: BusinessEvent['severity'] = 'warning';
    
    if (type === 'CashFlowRisk') {
      title = '区域资金周转流动承压预警';
      desc = '由瑞士清关关税波动引起商户回款周期异样延长。';
      severity = 'critical';
    } else if (type === 'CustomerChurn') {
      title = '跨国高净值买家流失警告';
      desc = '由区域物流延误触发多名巴黎长期订货商户意向降低。';
      severity = 'warning';
    } else if (type === 'ExternalTariffShock') {
      title = '国际货代航路附加关税突涨';
      desc = '苏黎世中转走廊运杂费率被突击调升 18%。';
      severity = 'critical';
    } else if (type === 'InventoryLow') {
      title = '应季热卖品类在库物料枯竭告警';
      desc = '巴黎分销库房纤维布料库存逼近限额警戒数值。';
      severity = 'critical';
    }

    dbEngine.enterprise_nervous_system.createEvent(tenantId, {
      eventType: type,
      severity,
      title,
      description: desc,
      metricsAffected: { impactIndex: 82, warningOffset: 14.2 }
    });
    
    loadData();
  };

  const handleSlideGoal = (goalId: string, value: number) => {
    dbEngine.enterprise_nervous_system.updateGoalValue(tenantId, goalId, value);
    loadData();
  };

  const handleAuthorizeAlert = (alertId: string) => {
    // 设置状态，并触发内部对冲逻辑
    dbEngine.enterprise_nervous_system.updateAlertStatus(tenantId, alertId, 'authorizing_execution');
    loadData();
    
    setTimeout(() => {
      // 模拟指令执行自动闭环：将 authorized 的 alert 标记为 executed
      dbEngine.enterprise_nervous_system.updateAlertStatus(tenantId, alertId, 'executed');
      loadData();
    }, 1000);
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
    <div className="text-slate-900 space-y-6 text-left animate-fadeIn">
      
      {/* 头部面板 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-3 gap-3">
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            企业自身感知神经控制
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            监控全网商户在库数据与风控指标波动，确保运行闭环自愈。
          </p>
        </div>
        <button 
          onClick={loadData}
          className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer text-slate-700"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>刷新事件状态</span>
        </button>
      </div>

      {/* 状态指标卡 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white border border-slate-200 rounded p-4 flex justify-between items-center hover:border-slate-400 transition-colors">
          <div>
            <span className="text-[10px] font-bold text-slate-500 block">业务大事件自动感知率</span>
            <p className="text-xl font-bold text-slate-900 font-mono mt-1">
              {metrics.businessAwarenessIndex}%
            </p>
            <span className="text-[9.5px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-bold">感知正常</span>
          </div>
          <Activity className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 flex justify-between items-center hover:border-slate-400 transition-colors">
          <div>
            <span className="text-[10px] font-bold text-slate-500 block">指标综合偏离值</span>
            <p className="text-xl font-bold text-slate-900 font-mono mt-1">
              {metrics.goalDriftIndex}%
            </p>
            <span className="text-[9.5px] text-zinc-650 bg-slate-50 px-1 py-0.2 rounded font-bold">偏差可控</span>
          </div>
          <Target className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 flex justify-between items-center hover:border-slate-400 transition-colors">
          <div>
            <span className="text-[10px] font-bold text-slate-500 block">网络决策稳健指数</span>
            <p className="text-xl font-bold text-slate-900 font-mono mt-1">
              {metrics.operationalStabilityIndex}%
            </p>
            <span className="text-[9.5px] text-[#07C2E3] bg-[#07C2E3]/5 px-1 py-0.2 rounded font-bold">防线正常</span>
          </div>
          <ShieldCheck className="w-5 h-5 text-slate-400" />
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 左排：事件总线与流转 */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded p-5">
            <h2 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 mb-3 flex items-center gap-1.5">
              <span>感知大事件总线</span>
            </h2>

            {/* 快速注入压力 */}
            <div className="mb-4 p-3 bg-slate-50 rounded border border-slate-150">
              <span className="text-[10px] text-slate-500 font-bold block mb-2 uppercase">
                自主压力测试与演练注入:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button 
                  onClick={() => handleSimulateTargetDeficit('InventoryLow')}
                  className="bg-white border text-left border-slate-200 hover:border-zinc-950 p-2.5 rounded text-xs cursor-pointer flex flex-col justify-between h-14"
                >
                  <span className="font-bold text-slate-900">供货水位</span>
                  <span className="text-[9px] text-slate-400">一键断货</span>
                </button>
                <button 
                  onClick={() => handleSimulateTargetDeficit('CashFlowRisk')}
                  className="bg-white border text-left border-slate-200 hover:border-zinc-950 p-2.5 rounded text-xs cursor-pointer flex flex-col justify-between h-14"
                >
                  <span className="font-bold text-slate-950">头寸结汇</span>
                  <span className="text-[9px] text-slate-400">回流延迟</span>
                </button>
                <button 
                  onClick={() => handleSimulateTargetDeficit('CustomerChurn')}
                  className="bg-white border text-left border-slate-200 hover:border-zinc-950 p-2.5 rounded text-xs cursor-pointer flex flex-col justify-between h-14"
                >
                  <span className="font-bold text-slate-900">推荐买家</span>
                  <span className="text-[9px] text-slate-400">意向流失</span>
                </button>
                <button 
                  onClick={() => handleSimulateTargetDeficit('ExternalTariffShock')}
                  className="bg-white border text-left border-slate-200 hover:border-zinc-950 p-2.5 rounded text-xs cursor-pointer flex flex-col justify-between h-14"
                >
                  <span className="font-bold text-slate-900">附加关税</span>
                  <span className="text-[9px] text-slate-400">费率调升</span>
                </button>
              </div>
            </div>

            {/* 创建表单 */}
            <form onSubmit={handleCreateEvent} className="space-y-2 mb-4 p-3 border border-dashed border-slate-200 rounded bg-white">
              <span className="text-[10px] font-bold text-slate-700 block">手动派发监测事件</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select 
                  value={simulationCategory}
                  onChange={(e) => setSimulationCategory(e.target.value as any)}
                  className="p-1.5 border border-slate-200 rounded text-xs bg-white"
                >
                  <option value="InventoryLow">📦 库存告急 (Inventory)</option>
                  <option value="SalesDrop">📉 转化下跌 (Sales)</option>
                  <option value="CashFlowRisk">💰 头寸限额 (Cash)</option>
                  <option value="CustomerChurn">👥 意向断层 (Churn)</option>
                  <option value="MarginViolation">⚖️ 溢价过热 (Margin)</option>
                  <option value="ExternalTariffShock">🌍 关税提高 (Tariff)</option>
                </select>

                <select 
                  value={simulationSeverity}
                  onChange={(e) => setSimulationSeverity(e.target.value as any)}
                  className="p-1.5 border border-slate-200 rounded text-xs bg-white"
                >
                  <option value="info">🔵 常规监控 (info)</option>
                  <option value="warning">🟡 警告升级 (warning)</option>
                  <option value="critical">🔴 重置拦截 (critical)</option>
                </select>

                <input 
                  type="text" 
                  value={simulationTitle}
                  onChange={(e) => setSimulationTitle(e.target.value)}
                  placeholder="标题..."
                  className="p-1.5 border border-slate-200 rounded text-xs text-slate-900 bg-white"
                />
              </div>

              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  value={simulationDesc}
                  onChange={(e) => setSimulationDesc(e.target.value)}
                  placeholder="详情偏差描述..."
                  className="flex-1 p-1.5 border border-slate-200 rounded text-xs text-slate-900 bg-white"
                />
                <button 
                  type="submit"
                  className="p-1.5 px-3 bg-zinc-950 hover:bg-zinc-805 text-white rounded text-xs font-bold cursor-pointer font-sans"
                >
                  立刻录入
                </button>
              </div>
            </form>

            {/* 列表 */}
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {events.map((evt) => {
                  const isCritical = evt.severity === 'critical';
                  const isWarning = evt.severity === 'warning';
                  
                  return (
                    <motion.div 
                      key={evt.id}
                      layoutId={`evt_card_${evt.id}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-slate-50 border border-slate-200 rounded hover:border-slate-350 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold uppercase ${
                          isCritical ? 'bg-red-50 text-red-700 border border-red-100' :
                          isWarning ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-slate-105 text-slate-700'
                        }`}>
                          {evt.eventType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(evt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 mb-0.5">{evt.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-normal mb-1">{evt.description}</p>

                      {evt.metricsAffected && (
                        <div className="bg-white border rounded p-1 text-[9.5px] font-mono flex gap-x-3 text-slate-500">
                          {Object.entries(evt.metricsAffected).map(([k, v]) => (
                            <span key={k}><strong>{k}:</strong> {v}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* 转移控制栏 */}
          <div className="bg-white border border-slate-200 rounded p-5">
            <h2 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 mb-3">
              自愈对冲状态追踪
            </h2>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {transitions.map((tra) => {
                const isToCritical = tra.toState === 'Critical';
                const isToWarning = tra.toState === 'Warning';
                
                return (
                  <div key={tra.id} className="p-3 border border-slate-150 rounded bg-slate-50 text-xs text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-1 py-0.2 bg-slate-200 text-slate-600 rounded font-mono text-[9px] font-bold">
                        {tra.subSystem}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(tra.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 my-1 bg-white border border-slate-100 rounded px-2 py-0.5 select-none font-mono text-[10px]/snug">
                      <span className="text-slate-400">{tra.fromState}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 font-bold" />
                      <span className={`font-bold ${
                        isToCritical ? 'text-red-655 text-red-600' :
                        isToWarning ? 'text-amber-600' :
                        'text-emerald-700'
                      }`}>
                        {tra.toState}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-slate-500 font-light leading-normal">
                      <strong>致因:</strong> {tra.rationale}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 右排：目标监控和审计对账 */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded p-5">
            <h2 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 mb-3">
              指标拦截偏离防线
            </h2>

            <div className="space-y-4">
              {goals.map((gl) => {
                const isSevere = gl.status === 'severe_drift';
                const isDeviated = gl.status === 'deviated';
                
                return (
                  <div key={gl.id} className="p-3 border border-slate-150 rounded bg-slate-50 text-left">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 leading-tight">{gl.title}</h3>
                        <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{gl.goalType}</span>
                      </div>
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                        isSevere ? 'bg-red-50 text-red-700' :
                        isDeviated ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {gl.status === 'severe_drift' ? '严重偏离' : gl.status === 'deviated' ? '微幅偏离' : '防守健全'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-normal mb-2">{gl.description}</p>

                    <div className="grid grid-cols-3 gap-1 bg-white p-1.5 rounded text-center text-[10px] font-mono border border-slate-100 mb-2">
                      <div>
                        <span className="text-slate-400 block text-[9px]">基底值</span>
                        <span className="font-bold text-slate-800">{gl.targetValue}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">实测水位</span>
                        <span className="font-bold text-slate-800">{gl.currentValue}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">偏差值</span>
                        <span className={`font-bold ${isSevere ? 'text-red-600' : isDeviated ? 'text-amber-600' : 'text-emerald-700'}`}>
                          {gl.driftIndex}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <input 
                        type="range"
                        min="0"
                        max={gl.targetValue * 1.5}
                        value={gl.currentValue}
                        onChange={(e) => handleSlideGoal(gl.id, Number(e.target.value))}
                        className="w-full accent-zinc-900 h-1 bg-slate-200 rounded"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-5">
            <h2 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 mb-3">
              自愈调度执行审计记录
            </h2>

            <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
              {triggers.map((trg) => (
                <div key={trg.id} className="p-2.5 border border-slate-150 rounded bg-slate-50 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-1.5 py-0.2 bg-zinc-900 text-white font-bold rounded text-[8.5px]">
                      {trg.triggerType}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(trg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-600 mb-1">
                    <strong>控制规章核验:</strong> {trg.ruleBinding}
                  </p>
                  <div className="p-1 bg-zinc-100 border border-zinc-205 rounded text-[9.5px]/snug font-mono text-zinc-800 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-zinc-950 shrink-0" />
                    <span className="truncate"><strong>执行干预指令:</strong> {trg.firedAction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <div className="bg-white border border-slate-200 rounded p-5">
        <h2 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 mb-3">
          多维关联分析审计诊断
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {correlations.map((cor) => (
            <div key={cor.id} className="p-4 border border-slate-200 bg-slate-50 rounded relative text-left">
              <div className="absolute top-0 right-0 py-0.5 px-2 bg-zinc-900 text-white rounded-bl text-[8.5px] font-mono font-bold">
                相关度: {cor.confidenceScore}%
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[9px] bg-slate-200 text-slate-850 px-1 py-0.2 rounded font-bold">对冲关联</span>
                <span className="text-[10px] text-slate-400 font-mono">{new Date(cor.timestamp).toLocaleTimeString()}</span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 mb-1">{cor.unifiedEventTitle}</h3>
              <p className="text-[11px] text-slate-500 leading-normal font-light bg-white border p-2 rounded border-emerald-50">{cor.analyticalSynthesis}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 事务核准与危机拦截 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        
        <div className="bg-white border border-slate-200 rounded p-5">
          <h2 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 mb-3">
            极端偏差主动代偿核准授权
          </h2>

          <div className="space-y-4">
            {alerts.filter(a => a.status !== 'dismissed').map((alt) => {
              const isExec = alt.status === 'executed';
              const isAuth = alt.status === 'authorizing_execution';
              
              return (
                <div key={alt.id} className="p-4 border border-slate-200 rounded bg-slate-50 relative space-y-3 text-xs text-left">
                  <div className="flex justify-between items-center bg-white p-1 border rounded">
                    <span className="bg-zinc-900 text-white font-bold px-1.5 rounded text-[10px]">{alt.alertType}</span>
                    <span className="text-[10px] text-slate-400">{new Date(alt.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900">{alt.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">{alt.description}</p>

                  <div className="p-2 bg-red-50 border border-red-100 rounded leading-normal">
                    <strong className="text-[9.5px] text-red-800 block font-bold">预计潜在损失边界</strong>
                    <p className="text-[11px] text-red-900 font-light">{alt.impactEstimation}</p>
                  </div>

                  <div className="p-2 bg-white border border-slate-200 rounded leading-normal">
                    <strong className="text-[9.5px] text-slate-800 block font-bold">推荐防备对偿自愈动作</strong>
                    <p className="text-[11px] text-slate-700">{alt.proposedAction}</p>
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button 
                      onClick={() => handleDismissAlert(alt.id)}
                      disabled={isExec || isAuth}
                      className="px-2.5 py-1 bg-white border border-slate-250 rounded text-slate-500 hover:text-slate-850 text-xs font-bold cursor-pointer transition disabled:opacity-50"
                    >
                      忽略
                    </button>
                    <button 
                      onClick={() => handleAuthorizeAlert(alt.id)}
                      disabled={isExec || isAuth}
                      className={`px-3.5 py-1.5 rounded text-xs font-bold text-white transition cursor-pointer flex items-center gap-1.5 ${
                        isExec ? 'bg-emerald-600' :
                        isAuth ? 'bg-zinc-400' :
                        'bg-zinc-950 hover:bg-zinc-800'
                      }`}
                    >
                      {isExec ? '已对冲' : isAuth ? '处理中...' : '授权拦截'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-5">
          <h2 className="text-xs font-bold text-slate-800 pb-2 border-b border-slate-100 mb-3">
            事件升格边界隔离
          </h2>

          <div className="space-y-4">
            {escalations.map((esc) => {
              const isMitigated = esc.status === 'mitigated';
              
              return (
                <div key={esc.id} className="p-3.5 border border-slate-200 bg-slate-50 rounded text-left">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">ID: {esc.id}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold ${
                      isMitigated ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {esc.status === 'pending_mitigation' ? '待对账' : '已代偿消纳'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2.5 bg-white p-1 border border-slate-100 rounded">
                    <span className="text-[9.5px] font-bold text-slate-500 shrink-0">风险等级:</span>
                    <div className="flex gap-0.5 flex-1 select-none">
                      {[1, 2, 3, 4, 5].map((l) => (
                        <div 
                          key={l} 
                          className={`h-1.5 flex-1 rounded-xs ${
                            l <= esc.escalationLevel ? 'bg-zinc-900 font-bold' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-800 font-mono">L{esc.escalationLevel}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 leading-normal">
                    <p><strong>责任负责人:</strong> {esc.responsibleCoordinator}</p>
                    <p><strong>提请对偿策略:</strong> {esc.remediationPathProposed}</p>
                  </div>

                  {!isMitigated && (
                    <div className="flex justify-end mt-2 pt-2 border-t border-slate-200">
                      <button 
                        onClick={() => handleResolveEscalation(esc.id)}
                        className="py-1 px-2.5 bg-white border border-slate-205 text-xs font-bold text-slate-700 rounded transition flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>确认消除异常偏差</span>
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
