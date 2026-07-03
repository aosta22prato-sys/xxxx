import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Workflow, 
  Play, 
  AlertOctagon, 
  RefreshCw, 
  CheckCircle, 
  XOctagon, 
  FileText, 
  TrendingUp, 
  Activity, 
  UserCheck, 
  GitPullRequest, 
  Coins, 
  Cpu, 
  Lightbulb, 
  Zap,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { 
  ExecutionProposal, 
  ExecutionApproval, 
  ExecutionMonitoringLog, 
  RollbackRecord, 
  AgentConflictRecord, 
  ResourceAllocationPlan, 
  ContinuousLearningUpdate 
} from '../../../types';
import { ECOSOperatingGovernanceService } from '../../../services/ECOSOperatingGovernanceService';
import { dbEngine } from '../../../db/dbEngine';

interface EcosGovernanceConsoleProps {
  executionProposals: ExecutionProposal[];
  executionApprovals: ExecutionApproval[];
  monitoringLogs: ExecutionMonitoringLog[];
  rollbackHistory: RollbackRecord[];
  agentConflicts: AgentConflictRecord[];
  resourcePlans: ResourceAllocationPlan[];
  continuousUpdates: ContinuousLearningUpdate[];
  operatingIntelligence: {
    operatingScore: number;
    executionReliability: number;
    executionROI: number;
    growthIndicator: number;
  };
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function EcosGovernanceConsole({
  executionProposals,
  executionApprovals,
  monitoringLogs,
  rollbackHistory,
  agentConflicts,
  resourcePlans,
  continuousUpdates,
  operatingIntelligence,
  addLog
}: EcosGovernanceConsoleProps) {

  // Active run state simulators
  const [selectedScenario, setSelectedScenario] = useState<string>('price');
  const [omitEvidenceTracer, setOmitEvidenceTracer] = useState<boolean>(false);
  const [omitValidationTracer, setOmitValidationTracer] = useState<boolean>(false);
  
  // Interactive Simulation Stepper Logs state
  const [simulationSteps, setSimulationSteps] = useState<{ label: string; status: 'pending' | 'success' | 'failed' | 'processing' }[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationTerminal, setSimulationTerminal] = useState<string[]>([]);
  const [simResults, setSimResults] = useState<{ success: boolean; message: string } | null>(null);

  // Filter systems
  const [proposalFilter, setProposalFilter] = useState<'all' | 'draft' | 'approved' | 'executing' | 'executed' | 'failed' | 'rolled_back'>('all');
  const [activeSubSection, setActiveSubSection] = useState<'pipeline' | 'conflicts' | 'resources' | 'learning'>('pipeline');

  // Trigger scenario Simulation
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimResults(null);
    setSimulationTerminal([]);

    const steps = [
      { label: 'COGNITIVE DISCOVERY (Evidence Captured)', status: 'processing' as const },
      { label: 'BAYESIAN REASONING (Hypothesis Formulated)', status: 'pending' as const },
      { label: 'DECISION MODELING (Action Value Proposed)', status: 'pending' as const },
      { label: 'ECOS GOVERNOR REGULATOR (Trace Signature Audit)', status: 'pending' as const },
      { label: 'APPROVAL VERIFICATION (Budget & Risk Check)', status: 'pending' as const },
      { label: 'LIVE PIPELINE EXECUTION (Database Mutex)', status: 'pending' as const },
      { label: 'TELEMETRY MONITORING (Deviation Detection)', status: 'pending' as const },
      { label: 'OPTIMIZATION FEEDBACK (Learning Reinforcement)', status: 'pending' as const }
    ];
    setSimulationSteps(steps);

    const logMsg = (text: string) => {
      setSimulationTerminal(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
    };

    // 1. Evidence Phase
    logMsg("🔍 Phase 151: Inspecting anomalies inside active store database catalogs...");
    await new Promise(r => setTimeout(r, 450));
    const evidenceId = omitEvidenceTracer ? '' : `ev_trace_${Math.floor(1000 + Math.random() * 9000)}`;
    if (omitEvidenceTracer) {
      logMsg("⚠️ Missing critical Evidence ID signature chain registry.");
    } else {
      logMsg(`✅ Evidence ID anchored securely: #${evidenceId}`);
    }
    setSimulationSteps(p => p.map((s, idx) => idx === 0 ? { ...s, status: 'success' } : idx === 1 ? { ...s, status: 'processing' } : s));

    // 2. Reasoning Phase
    logMsg("🧠 Phase 156: Bayesian validation tournament running. Correlating causal factors...");
    await new Promise(r => setTimeout(r, 450));
    const validationId = omitValidationTracer ? '' : `val_trace_${Math.floor(1000 + Math.random() * 9000)}`;
    if (omitValidationTracer) {
      logMsg("⚠️ Missing critical Validation ID tournament signature.");
    } else {
      logMsg(`✅ Validation ID anchored securely: #${validationId}`);
    }
    setSimulationSteps(p => p.map((s, idx) => idx === 1 ? { ...s, status: 'success' } : idx === 2 ? { ...s, status: 'processing' } : s));

    // 3. Decision Phase
    logMsg("💡 Phase 159: Formulating structural execution proposal parameters...");
    await new Promise(r => setTimeout(r, 450));
    
    let scenarioTitle = '';
    let scenarioDesc = '';
    let actionType: ExecutionProposal['actionType'] = 'price_optimization';
    let proposedVal: string | number = '';

    if (selectedScenario === 'price') {
      scenarioTitle = 'Dynamic Price Optimization';
      scenarioDesc = 'Calibrate camel trench coat catalog pricing to counter conversion slump and match current elasticity index.';
      actionType = 'price_optimization';
      proposedVal = 144.50;
    } else if (selectedScenario === 'restock') {
      scenarioTitle = 'Automated Replenishment Dispatch';
      scenarioDesc = 'Dispatched stockout buffer purchase orders for Camel Coat to prevent empty-shelf customer bounces.';
      actionType = 'restock_allocation';
      proposedVal = '45 Units';
    } else if (selectedScenario === 'budget') {
      scenarioTitle = 'Budget Redirection Cutoff';
      scenarioDesc = 'Unprofitable ad campaign detected. Safely redirecting unspent capital streams towards Pinterest higher yielding funnels.';
      actionType = 'ad_budget_redirection';
      proposedVal = '$5,000 Redirect';
    }

    logMsg(`📋 Draft Proposal Compiled: [${scenarioTitle}] - Value: ${proposedVal}`);
    setSimulationSteps(p => p.map((s, idx) => idx === 2 ? { ...s, status: 'success' } : idx === 3 ? { ...s, status: 'processing' } : s));

    // 4. ECOS Absolute Governor signature verification
    logMsg("🛡️ ECOS Absolute Rule Compliance Test running...");
    await new Promise(r => setTimeout(r, 600));

    const isAuthorized = evidenceId && validationId;
    if (!isAuthorized) {
      logMsg("❌ [ECOS Absolute Rule Refusal] Missing mandatory tracer registries. System refuses to propose or execute unvalidated recommendations.");
      setSimulationSteps(p => p.map((s, idx) => idx === 3 ? { ...s, status: 'failed' } : s));
      setIsSimulating(false);
      setSimResults({
        success: false,
        message: '🔴 [Absolute Rule Refusal] Missing Tracer Parameters. Administrative run aborted to protect store safety!'
      });
      addLog('Governor Core', 'ABORT SYSTEM RUN', 'Canceled proposal flow due to trace signature gap (Evidence/Validation trace missing).', 'error');
      return;
    }

    logMsg("💚 Trace compliance indices validated. Initializing active regulatory contract.");
    const proposal = ECOSOperatingGovernanceService.generateExecutionProposal(
      scenarioTitle,
      scenarioDesc,
      actionType,
      proposedVal,
      evidenceId,
      validationId,
      'Simulation Interactive Engine'
    );
    logMsg(`✔ Proposal generated successfully and committed to DB index. Proposal ID: #${proposal.id.substring(0,8)}`);
    setSimulationSteps(p => p.map((s, idx) => idx === 3 ? { ...s, status: 'success' } : idx === 4 ? { ...s, status: 'processing' } : s));

    // 5. Approval Phase
    logMsg("💰 Phase 160: Evaluating risk impact constraints and checking cash allocations...");
    await new Promise(r => setTimeout(r, 550));
    const approval = ECOSOperatingGovernanceService.calculateApprovalRequirement(proposal.id);
    logMsg(`📊 Governance Level: [${proposal.governanceLevel}] - Status: ${approval.status}`);
    setSimulationSteps(p => p.map((s, idx) => idx === 4 ? { ...s, status: 'success' } : idx === 5 ? { ...s, status: 'processing' } : s));

    // 6. Live Pipeline Execution
    logMsg("⚡ Phase 161: Handing off to Execution engine. Acquiring database mutex write-locks...");
    await new Promise(r => setTimeout(r, 700));

    const result = ECOSOperatingGovernanceService.executeAction(proposal.id, 'merchant_simulation_user');
    if (!result.success) {
      logMsg(`🔴 Execution outcome failed: ${result.message}`);
      setSimulationSteps(p => p.map((s, idx) => idx === 5 ? { ...s, status: 'failed' } : s));
      setIsSimulating(false);
      setSimResults({
        success: false,
        message: result.message
      });
      addLog('Governor Core', 'PIPELINE EXECUTION INCOMPLETE', result.message, 'warning');
      return;
    }

    logMsg(`✅ ${result.message}`);
    setSimulationSteps(p => p.map((s, idx) => idx === 5 ? { ...s, status: 'success' } : idx === 6 ? { ...s, status: 'processing' } : s));

    // 7. Telemetry Monitoring
    logMsg("📡 Phase 161 & 162: Activating real-time feedback telemetry probes...");
    await new Promise(r => setTimeout(r, 550));
    if (result.log) {
      logMsg(`📊 Metric Monitored: [${result.log.metricMonitored}] - Observed: ${result.log.actualObservedValue} (Expected: ${result.log.expectedValue})`);
      if (result.log.deviationRate !== 0) {
        logMsg(`📈 Deviation rate captured: ${result.log.deviationRate > 0 ? '+' : ''}${result.log.deviationRate}%`);
      }
      if (result.log.status === 'critical_failure') {
        logMsg("🚨 ANOMALOUS INSTABILITY DETECTED! Triggering Phase 162 structural safety rollback...");
        await new Promise(r => setTimeout(r, 600));
        logMsg("🔄 Restoring database parameters back to previous safe catalog baseline index...");
        logMsg("✅ Database parameters fully stabilized.");
      } else {
        logMsg("✔ Telemetry indicators stable. Performance aligned.");
      }
    }
    setSimulationSteps(p => p.map((s, idx) => idx === 6 ? { ...s, status: 'success' } : idx === 7 ? { ...s, status: 'processing' } : s));

    // 8. Continuous Optimization Loop Feedback
    logMsg("🌱 Phase 165: Capturing outcome score to calibrating strategy weights...");
    await new Promise(r => setTimeout(r, 450));
    logMsg("📈 Calibrated strategies. Dynamic decision-weights shifts committed successfully!");
    setSimulationSteps(p => p.map((s, idx) => idx === 7 ? { ...s, status: 'success' } : s));

    setIsSimulating(false);
    setSimResults({
      success: true,
      message: `🎉 Closed-loop autonomous execution completed beautifully! [${scenarioTitle}] state fully captured, verified, and committed.`
    });
    addLog('Governor Core', 'CLOSED LOOP COMPLETED', `Succesfully executed operational governance sequence for ${scenarioTitle}.`, 'success');
  };

  // Perform a manual action approval live
  const handleApproveAndExecuteLive = (proposalId: string) => {
    const result = ECOSOperatingGovernanceService.executeAction(proposalId, 'merchant_admin_user');
    if (result.success) {
      addLog('Governor Core', 'MANUAL APPROVAL RECORDED', `Merchant owner authorized and dispatched execution proposal #${proposalId.substring(0,8)}.`, 'success');
    } else {
      addLog('Governor Core', 'ABORT MANUAL DESPATCH', result.message, 'warning');
    }
  };

  // Quick Conflict Resolve Trigger
  const handleSimulateConflict = () => {
    ECOSOperatingGovernanceService.resolveAgentConflict(
      'Spring Clearance Markdown Strategy',
      'agent_sales',
      'Deploy combative 35% clearance discount on camel coats to prioritize prompt physical volume clearing.',
      'agent_finance',
      'Restrict markdown limit to 12% max to safeguard cash reserves, amortizing procurement debt exposure.',
      'ev_trace_confl_01',
      'val_trace_confl_01'
    );
    addLog('Governance Resolve', 'RESOLVED AGENT CONFLICT', 'Resolved discount pricing friction between Sale Agent and Finance Agent based on trust ratings.', 'info');
  };

  // Match proposals
  const filteredProposals = executionProposals.filter(p => proposalFilter === 'all' || p.status === proposalFilter);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans">
      
      {/* Operating Intelligence Scoreboards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white relative overflow-hidden">
          <span className="text-[9px] text-[#07C2E3] font-black uppercase font-mono tracking-wider block">PHASE 166: OPERATING INTELLIGENCE</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-[#07C2E3]">{operatingIntelligence.operatingScore}%</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">▲ Optimal</span>
          </div>
          <div className="w-full bg-slate-800 h-1 mt-2 overflow-hidden rounded-full font-bold">
            <div className="bg-[#07C2E3] h-full" style={{ width: `${operatingIntelligence.operatingScore}%` }}></div>
          </div>
          <span className="text-[8px] text-slate-400 block mt-2">智能度量：信度稳定系数与学习提能速率合算</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white relative overflow-hidden">
          <span className="text-[9px] text-emerald-400 font-black uppercase font-mono tracking-wider block">EXECUTION RELIABILITY</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-emerald-400">{operatingIntelligence.executionReliability}%</span>
            <span className="text-[10px] text-slate-400 font-mono">/ Rate</span>
          </div>
          <div className="w-full bg-slate-800 h-1 mt-2 overflow-hidden rounded-full font-bold">
            <div className="bg-emerald-400 h-full" style={{ width: `${operatingIntelligence.executionReliability}%` }}></div>
          </div>
          <span className="text-[8px] text-slate-400 block mt-2">指令可靠性：无失效异常、防范违规指令执行率</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white relative overflow-hidden">
          <span className="text-[9px] text-amber-500 font-black uppercase font-mono tracking-wider block">DECISION ROI MULTIPLIER</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-amber-400">{operatingIntelligence.executionROI}x</span>
            <span className="text-[10px] text-slate-400 font-mono">/ Net Yield</span>
          </div>
          <div className="w-full bg-slate-800 h-1 mt-2 overflow-hidden rounded-full font-bold">
            <div className="bg-amber-400 h-full" style={{ width: `${(operatingIntelligence.executionROI/10)*100}%` }}></div>
          </div>
          <span className="text-[8px] text-slate-400 block mt-2">运营乘数：平均每个自主闭环指令带给店铺的收益增幅</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white relative overflow-hidden">
          <span className="text-[9px] text-[#059BBC] font-black uppercase font-mono tracking-wider block">SAFETY ROLLBACK COST</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black font-mono text-cyan-400">
              ${rollbackHistory.reduce((acc, r) => acc + r.estimatedRollbackCost, 0)}
            </span>
            <span className="text-[10px] text-rose-400 font-mono">Active</span>
          </div>
          <div className="w-full bg-slate-800 h-1 mt-2 overflow-hidden rounded-full font-bold">
            <div className="bg-cyan-500 h-full" style={{ width: '15%' }}></div>
          </div>
          <span className="text-[8px] text-slate-400 block mt-2">自愈摩擦损耗：系统发生安全回滚动作的累计摩擦财务开销</span>
        </div>

      </div>

      {/* CORE CLOSED-LOOP INTERACTIVE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Stepper Simulation Box */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-150 pb-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <Workflow className="w-4 h-4 text-[#07C2E3]" />
              自主运营治理闭环模拟器
            </h4>
            <span className="bg-[#07C2E3]/10 border border-[#07C2E3]/20 text-[#07C2E3] font-mono text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
              Phase 159-166
            </span>
          </div>

          <div className="space-y-3 text-[11px]">
            <div>
              <label className="block text-slate-450 font-bold mb-1 uppercase text-[9px]">1. 选定运营场景规划 (Action Plan)</label>
              <select 
                value={selectedScenario} 
                onChange={(e) => setSelectedScenario(e.target.value)}
                disabled={isSimulating}
                className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#07C2E3]"
              >
                <option value="price">商品动态定价自优化 (price_optimization)</option>
                <option value="restock">供应链库存订单智配 (restock_allocation)</option>
                <option value="budget">不畅投放精准截流转向 (ad_budget_redirection)</option>
              </select>
            </div>

            {/* Test ECOS Absolute rule check triggers */}
            <div className="bg-white border border-slate-150 rounded-lg p-2.5 space-y-2">
              <span className="block text-[9px] text-[#07C2E3] font-black uppercase tracking-wider">🔒 ECOS 绝对红线规则对账器</span>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="omitEvidence" 
                  checked={omitEvidenceTracer} 
                  onChange={(e) => setOmitEvidenceTracer(e.target.checked)}
                  disabled={isSimulating}
                  className="w-3.5 h-3.5 text-[#07C2E3] border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="omitEvidence" className="text-slate-650 cursor-pointer select-none">
                  缺失 Evidence ID <b>[故意违反绝对红线]</b>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="omitValidation" 
                  checked={omitValidationTracer} 
                  onChange={(e) => setOmitValidationTracer(e.target.checked)}
                  disabled={isSimulating}
                  className="w-3.5 h-3.5 text-[#07C2E3] border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="omitValidation" className="text-slate-650 cursor-pointer select-none">
                  缺失 Validation ID <b>[故意违反绝对红线]</b>
                </label>
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#07C2E3]" />
              {isSimulating ? '正在执行闭环控制...' : '启动闭环自主运营程序'}
            </button>
          </div>

          {/* Graphical closed-loop Pipeline stepper */}
          <div className="border border-slate-200/80 rounded-xl bg-white p-3 space-y-2.5">
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">ECOS 节点验证足迹</span>
            
            <div className="space-y-1.5">
              {simulationSteps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px] pb-1 border-b border-slate-100 last:border-none">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="w-4 h-4 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-mono text-[9px] font-bold">
                      {idx + 1}
                    </span>
                    <span className={step.status === 'success' ? 'text-slate-800 font-extrabold' : step.status === 'processing' ? 'text-[#07C2E3] font-bold' : 'text-slate-400'}>
                      {step.label}
                    </span>
                  </div>

                  <div>
                    {step.status === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />}
                    {step.status === 'failed' && <XOctagon className="w-3.5 h-3.5 text-rose-500 fill-rose-50" />}
                    {step.status === 'processing' && <RefreshCw className="w-3 h-3 text-[#07C2E3] animate-spin" />}
                    {step.status === 'pending' && <span className="w-2 h-2 rounded-full bg-slate-200 block mr-1" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper details Output */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-cyan-300 space-y-2 h-44 overflow-y-auto shadow-inner">
            <span className="text-slate-450 block text-[9px] border-b border-slate-800 pb-1 font-bold">📡 CORE COMPLIANCE AUDIO PATH LOGS</span>
            {simulationTerminal.length === 0 ? (
              <span className="text-slate-500 italic block">运行模拟器以调出底层多智能体治理审计记录流...</span>
            ) : (
              simulationTerminal.map((line, idx) => (
                <div key={idx} className="leading-snug">
                  {line}
                </div>
              ))
            )}
          </div>

          {simResults && (
            <div className={`p-3 rounded-lg text-xs leading-relaxed border ${simResults.success ? 'bg-emerald-50 text-emerald-950 border-emerald-150' : 'bg-rose-50 text-rose-950 border-rose-150'}`}>
              <strong>{simResults.success ? '✔ Core Confirmed' : '🚫 Governance Terminated'}</strong>
              <p className="mt-1 font-medium">{simResults.message}</p>
            </div>
          )}
        </div>

        {/* Right Column: Execution register, Conflict records etc. */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Subsection Selection bar */}
          <div className="flex border-b border-slate-200 text-xs font-black">
            <button
              onClick={() => setActiveSubSection('pipeline')}
              className={`pb-2.5 px-4 cursor-pointer transition-all border-b-2 flex items-center gap-1.5 ${activeSubSection === 'pipeline' ? 'border-[#07C2E3] text-slate-900' : 'border-transparent text-slate-450 hover:text-slate-700'}`}
            >
              <Workflow className="w-4 h-4 text-[#07C2E3]" />
              提案执行总线 (Pipeline)
            </button>
            <button
              onClick={() => setActiveSubSection('conflicts')}
              className={`pb-2.5 px-4 cursor-pointer transition-all border-b-2 flex items-center gap-1.5 ${activeSubSection === 'conflicts' ? 'border-[#07C2E3] text-slate-900' : 'border-transparent text-slate-450 hover:text-slate-700'}`}
            >
              <UserCheck className="w-4 h-4 text-emerald-500" />
              智能体合规对账 ({agentConflicts.length})
            </button>
            <button
              onClick={() => setActiveSubSection('resources')}
              className={`pb-2.5 px-4 cursor-pointer transition-all border-b-2 flex items-center gap-1.5 ${activeSubSection === 'resources' ? 'border-[#07C2E3] text-slate-900' : 'border-transparent text-slate-450 hover:text-slate-700'}`}
            >
              <Coins className="w-4 h-4 text-amber-500" />
              运营资源划配 ({resourcePlans.length})
            </button>
            <button
              onClick={() => setActiveSubSection('learning')}
              className={`pb-2.5 px-4 cursor-pointer transition-all border-b-2 flex items-center gap-1.5 ${activeSubSection === 'learning' ? 'border-[#07C2E3] text-slate-900' : 'border-transparent text-slate-450 hover:text-slate-700'}`}
            >
              <Zap className="w-4 h-4 text-[#059BBC]" />
              神经网络权重更新 ({continuousUpdates.length})
            </button>
          </div>

          {/* VIEW: PROPOSALS & PIPELINES */}
          {activeSubSection === 'pipeline' && (
            <div className="space-y-4">
              
              {/* Proposal Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                <div className="flex flex-wrap gap-1.5 text-[10px] font-extrabold">
                  {['all', 'draft', 'executing', 'executed', 'failed', 'rolled_back'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setProposalFilter(filter as any)}
                      className={`px-2.5 py-1 rounded-md cursor-pointer uppercase font-mono ${proposalFilter === filter ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                <span className="text-[10px] text-slate-400 font-mono font-medium">
                  共计 <b>{filteredProposals.length}</b> 笔自治历史审计
                </span>
              </div>

              {/* Execution Proposal List */}
              <div className="space-y-3">
                {filteredProposals.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50/50 border border-slate-150 rounded-xl">
                    <p className="text-xs text-slate-400">未检索到该筛选条件下的提案实体</p>
                  </div>
                ) : (
                  filteredProposals.map((prop) => {
                    // find related approvals, monitoring logs and rollbacks
                    const RelatedApproval = executionApprovals.find(a => a.proposalId === prop.id);
                    const RelatedLog = monitoringLogs.find(m => m.proposalId === prop.id);
                    const RelatedRollback = rollbackHistory.find(r => r.proposalId === prop.id);

                    return (
                      <div key={prop.id} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:border-slate-350 transition-all font-sans">
                        
                        {/* Header info */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-2.5 mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-slate-100 text-slate-800 font-mono text-[9px] font-black px-1.5 py-0.5 rounded">
                                #{prop.id.substring(0, 8)}
                              </span>
                              <h5 className="text-xs font-black text-slate-900">{prop.title}</h5>
                            </div>
                            <span className="text-[8px] text-slate-400 block font-mono font-bold">
                              TIMESTAMP: {prop.timestamp} | SOURCE: {prop.source}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded font-mono uppercase ${
                              prop.status === 'executed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              prop.status === 'failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              prop.status === 'rolled_back' ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' :
                              prop.status === 'executing' ? 'bg-[#07C2E3]/15 text-[#07C2E3] border border-[#07C2E3]/30 animate-pulse' :
                              'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}>
                              ● {prop.status}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                              prop.governanceLevel === 'auto' ? 'bg-emerald-100 text-emerald-800' :
                              prop.governanceLevel === 'manual_approval' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800 shadow-sm'
                            }`}>
                              {prop.governanceLevel}
                            </span>
                          </div>
                        </div>

                        {/* Proposal Content */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs mb-3 text-slate-650 leading-relaxed font-sans">
                          
                          <div className="md:col-span-8 space-y-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-150">
                            <div><strong>提案目标:</strong> {prop.description}</div>
                            <div><strong>推荐执行行动:</strong> <b className="text-slate-800 font-mono text-[11px]">{prop.actionType}</b></div>
                            <div><strong>提议配置数值:</strong> <b className="text-emerald-800 font-mono text-[11px]">{prop.proposedValue}</b></div>
                          </div>

                          <div className="md:col-span-4 bg-slate-50/50 p-2.5 rounded-lg border border-slate-150 flex flex-col justify-between font-mono text-[10px] space-y-1 text-slate-500">
                            <div className="flex justify-between">
                              <span>测算财务收益:</span>
                              <strong className="text-emerald-600 font-extrabold">{prop.estimatedImpactScore}/100</strong>
                            </div>
                            <div className="flex justify-between">
                              <span>测算执行风险:</span>
                              <strong className="text-rose-600 font-extrabold">{prop.estimatedRiskScore}/100</strong>
                            </div>
                            <div className="border-t border-slate-200 pt-1 mt-1 flex justify-between text-[8px] text-slate-400">
                              <span>Evidence Trace:</span>
                              <strong>{prop.evidenceId ? `#${prop.evidenceId.substring(0,8)}` : 'N/A'}</strong>
                            </div>
                          </div>

                        </div>

                        {/* Associated Audit Trace (Strictly compliant with ECOS rule) */}
                        <div className="space-y-2 border-t border-slate-100 pt-3 text-[10px]">
                          <span className="block font-bold text-[#07C2E3] uppercase text-[9px] tracking-wider">🔒 TRACEABILITY AUDIT EVIDENCE CHAIN SIGNATURES</span>
                          
                          {/* Approval audit logs */}
                          {RelatedApproval && (
                            <div className="bg-slate-50 text-slate-700 p-2 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-2 border border-slate-150 font-mono text-[9px]">
                              <div>
                                <strong className="text-slate-900">🛡️ [APPROVAL AUDIT]</strong> AuthorizedBy: <span className="font-bold underline text-cyan-700">{RelatedApproval.authorizedBy}</span> | Mitigated: <span className="text-emerald-600 font-black">{RelatedApproval.riskMitigationVerified ? 'Passed' : 'Omitted'}</span>
                              </div>
                              <div className="text-slate-400">
                                Trace Ref: #{RelatedApproval.id.substring(0,8)}
                              </div>
                            </div>
                          )}

                          {/* Monitoring & Feedback Telemetry logs */}
                          {RelatedLog && (
                            <div className="bg-[#07C2E3]/5 text-[#059BBC] p-2 rounded-lg text-[9px] border border-[#07C2E3]/15 flex flex-col md:flex-row justify-between gap-1.5 font-mono">
                              <div>
                                <strong className="text-cyan-800">📡 [TELEMETRY FEED]</strong> MonitoredMetric: <strong className="text-slate-800 font-sans font-bold">{RelatedLog.metricMonitored}</strong> | Deviation: <span className={RelatedLog.deviationRate > 0 ? "text-emerald-700" : "text-rose-700"}>{RelatedLog.deviationRate > 0 ? "+" : ""}{RelatedLog.deviationRate}%</span> 
                              </div>
                              <div className="text-slate-450">
                                ID: #{RelatedLog.id.substring(0,8)}
                              </div>
                            </div>
                          )}

                          {/* Auto rollback logs */}
                          {RelatedRollback && (
                            <div className="bg-rose-50 text-rose-800 p-2 border border-rose-100 rounded-lg text-[9px] font-mono leading-relaxed space-y-1">
                              <div>
                                <strong className="text-rose-700">🚨 [SAFETY ROLLBACK SIGNED]</strong> Rollback Reason: <strong>{RelatedRollback.rollbackReason}</strong>
                              </div>
                              <div className="flex justify-between text-[8px] text-rose-500 font-bold border-t border-rose-100 pt-1">
                                <span>恢复操作: {RelatedRollback.actionsTaken.join('; ')}</span>
                                <span>已消损: {RelatedRollback.estimatedRollbackCost} 摩擦点分</span>
                              </div>
                            </div>
                          )}

                          {/* Action Button for Manual execution pending */}
                          {prop.governanceLevel === 'manual_approval' && prop.status === 'draft' && (
                            <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                              <span className="text-amber-800 font-sans font-medium text-[10px] flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                这个提案需要店主商户密钥（Merchant Owner Key）签名后授权才能分派执行。
                              </span>
                              <button
                                onClick={() => handleApproveAndExecuteLive(prop.id)}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-black text-[10px] px-3 py-1 rounded shadow transition-all cursor-pointer border-none"
                              >
                                授信并指令分派 (Approve & Run)
                              </button>
                            </div>
                          )}

                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* VIEW: COMPETING AGENT CONFLICTS */}
          {activeSubSection === 'conflicts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-150">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase">163 Multi-Agent Governance Conflict Registry</h4>
                  <p className="text-[10px] text-slate-400">当不同销售、库存和财务大模型策略意见发生摩擦时，ECOS自谦评级将介入折算其合规权重。</p>
                </div>
                
                <button
                  onClick={handleSimulateConflict}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all border-none"
                >
                  模拟触发一次智能体意见竞合
                </button>
              </div>

              <div className="space-y-3">
                {agentConflicts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">暂无任何对立意见记录</p>
                ) : (
                  agentConflicts.map((confl) => (
                    <div key={confl.id} className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm hover:shadow transition-all space-y-3">
                      
                      <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-2">
                        <span className="font-extrabold text-slate-750 uppercase">竞合成冲突主题: <strong className="text-slate-900 underline font-extrabold font-sans">{confl.conflictTopic}</strong></span>
                        <span className="text-slate-400 font-mono font-bold">TIMESTAMP: {confl.timestamp.substring(11, 19)}</span>
                      </div>

                      {/* Side by side friction recommendations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                        
                        <div className="p-3 bg-indigo-50/40 border border-indigo-100/60 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] border-b border-indigo-100 pb-1">
                            <span className="font-extrabold text-[#07C2E3] uppercase flex items-center gap-1">
                              <Cpu className="w-3.5 h-3.5" /> COMPETITOR A: {confl.agentA_Id}
                            </span>
                            <span className="font-mono text-slate-450">信噪权重: {confl.agentA_TrustScore}</span>
                          </div>
                          <p className="text-indigo-950 italic">{confl.agentA_Recommendation}</p>
                        </div>

                        <div className="p-3 bg-amber-50/40 border border-amber-100/60 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] border-b border-amber-100 pb-1">
                            <span className="font-extrabold text-amber-600 uppercase flex items-center gap-1">
                              <Cpu className="w-3.5 h-3.5" /> COMPETITOR B: {confl.agentB_Id}
                            </span>
                            <span className="font-mono text-slate-450">信噪权重: {confl.agentB_TrustScore}</span>
                          </div>
                          <p className="text-amber-950 italic">{confl.agentB_Recommendation}</p>
                        </div>

                      </div>

                      {/* Resolution decision made by Central OS */}
                      <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3 text-[11.5px] text-emerald-950 font-medium space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 border-b border-emerald-150 pb-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                          ECOS 智能合规调停裁决
                        </div>
                        <p className="leading-snug pt-1">{confl.resolutionDecision}</p>
                        <div className="flex justify-between text-[9px] text-emerald-650 font-mono pt-1">
                          <span>授信加权综合折算度 (Resolution Weight): <b>{confl.resolvedTrustScoreWeight} pts</b></span>
                          <span>安全签名: {confl.validationId}</span>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* VIEW: RESOURCE PLANS */}
          {activeSubSection === 'resources' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs">
                <h4 className="font-black text-slate-800 uppercase">164 Resource Allocation Intelligence Core</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">当自主执行订单生成时，划拨算法自动折算账内流动的分配，防止系统无限空赚导致真发现破产爆仓。</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resourcePlans.map((plan) => (
                  <div key={plan.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-3 font-sans">
                    <div className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-1.5 mb-1.5 font-mono">
                      <strong className="text-[#07C2E3] uppercase flex items-center gap-1 text-[9px]">
                        <Coins className="w-3.5 h-3.5" /> SECURED: {plan.resourceType}
                      </strong>
                      <span className="text-slate-400 font-bold">{plan.timestamp.substring(11,19)}</span>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 block uppercase">划拨金额数</span>
                        <span className="text-xl font-mono font-black text-slate-800">{plan.allocatedAmount}</span>
                      </div>
                      <div className="text-right">
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 font-extrabold rounded">
                          效率得分: {plan.efficiencyScore}/100
                        </span>
                        <span className="text-slate-400 block text-[8px] mt-1">使用度: {plan.utilizationRate}%</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg text-[10.5px] text-slate-600 italic border border-slate-150">
                      <strong>配账智能洞察:</strong> “{plan.optimizationInsight}”
                    </div>

                    <div className="flex justify-between text-[8px] text-slate-400 font-mono pt-1">
                      <span>证据回推链 ID: #{plan.evidenceId.substring(0,8)}</span>
                      <span>对账 ID: #{plan.validationId.substring(0,8)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: CONTINUOUS LEARNING CALIBRATIONS */}
          {activeSubSection === 'learning' && (
            <div className="space-y-4 text-slate-800">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs">
                <h4 className="font-black text-slate-800 uppercase">165 Continuous Optimization Neural Weight Shifts</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">对每次自主提案执行成功的真实收益折回神经网络，微调其常识偏向，保证智能体持续朝着高ROI，高理智的方向学习。</p>
              </div>

              <div className="space-y-2.5">
                {continuousUpdates.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10 bg-slate-50">暂无任何微调转移日志</p>
                ) : (
                  continuousUpdates.map((upd) => (
                    <div key={upd.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-xs transition-all flex flex-col md:flex-row justify-between gap-3 font-sans">
                      <div className="space-y-2 flex-grow">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="bg-[#07C2E3]/20 text-cyan-800 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                            CALIBRATION LOOP ACTIVE
                          </span>
                          <strong className="text-slate-900">{upd.modelSubject}</strong>
                        </div>
                        
                        <div className="text-[11px] text-slate-650 min-h-6">
                          对账指标: <strong className="text-slate-800 font-medium">{upd.metricObserved}</strong> | 物理反馈得分: <span className="text-emerald-700 font-black">{upd.outcomeScore}/100</span>
                        </div>

                        <div className="flex justify-between text-[8px] text-slate-450 font-mono border-t border-slate-100 pt-1.5">
                          <span>Evidence Trace: #{upd.evidenceId?.substring(0,8)}</span>
                          <span>Validation Trace: #{upd.validationId?.substring(0,8)}</span>
                          <span>Proposal Trace: #{upd.proposalId?.substring(0,8)}</span>
                        </div>
                      </div>

                      <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-2.5 md:pt-0 md:pl-4 flex flex-row md:flex-col justify-between items-center md:items-end md:justify-center w-full md:w-44 text-[10px] font-mono shrink-0">
                        <div className="text-slate-400">
                          旧权重: <del className="text-slate-500 font-bold">{upd.previousStrategyWeight}</del>
                        </div>
                        <div className="text-emerald-700 font-bold">
                          修正后权重: <strong>{upd.newStrategyWeight}</strong>
                        </div>
                        <span className="text-emerald-600 font-extrabold text-[9px] mt-0.5">
                          ▲ 纠偏变迁: +{upd.decisionWeightShift}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
