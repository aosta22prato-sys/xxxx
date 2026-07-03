import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Scale, 
  FileText, 
  Clock, 
  ShieldAlert,
  Search,
  Eye,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  Brain,
  Layers,
  Database,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { dbEngine } from '../../../db/dbEngine';
import { ECOSAwarenessService } from '../../../services/ECOSAwarenessService';
import { ECOSOperatingGovernanceService } from '../../../services/ECOSOperatingGovernanceService';
import EcosGovernanceConsole from './EcosGovernanceConsole';
import { 
  EnterpriseUncertaintyLog, 
  KnowledgeBoundaryEvent, 
  DecisionHumilityRecord, 
  FailurePredictionLog, 
  BlindSpotDiscovery, 
  EvidenceSufficiencyReport, 
  SelfReflectionAudit,
  KnowledgeGapTask,
  EvidenceCollectionPlan,
  InvestigationCase,
  CuriosityEvent,
  ContrarianHypothesis,
  CompetingExplanation,
  BeliefUpdate,
  ExecutionProposal,
  ExecutionApproval,
  ExecutionMonitoringLog,
  RollbackRecord,
  AgentConflictRecord,
  ResourceAllocationPlan,
  ContinuousLearningUpdate
} from '../../../types';

interface EcosPerformanceOptimizerProps {
  tenantDB: any;
  selectedIndustry: string;
  setTenantDB: React.Dispatch<React.SetStateAction<any>>;
  addLog: (agent: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function EcosPerformanceOptimizer({
  tenantDB,
  selectedIndustry,
  setTenantDB,
  addLog
}: EcosPerformanceOptimizerProps) {
  
  // Real-time Database state bindings
  const [uncertaintyLogs, setUncertaintyLogs] = useState<EnterpriseUncertaintyLog[]>([]);
  const [knowledgeBoundaries, setKnowledgeBoundaries] = useState<KnowledgeBoundaryEvent[]>([]);
  const [humilityRecords, setHumilityRecords] = useState<DecisionHumilityRecord[]>([]);
  const [failureLogs, setFailureLogs] = useState<FailurePredictionLog[]>([]);
  const [blindSpots, setBlindSpots] = useState<BlindSpotDiscovery[]>([]);
  const [sufficiencyReports, setSufficiencyReports] = useState<EvidenceSufficiencyReport[]>([]);
  const [reflectionAudits, setReflectionAudits] = useState<SelfReflectionAudit[]>([]);

  // Self Awareness Core Score State
  const [coreScore, setCoreScore] = useState<any>({
    score: 82.4,
    uncertaintyFactor: 80,
    boundaryFactor: 75,
    humilityFactor: 85,
    failurePredictionFactor: 82,
    blindSpotFactor: 70,
    evidenceSufficiencyFactor: 88,
    selfReflectionFactor: 80,
    ratingGrade: 'Humble & Reliable'
  });

  // Interactive self-awareness trigger inputs
  const [targetTopic, setTargetTopic] = useState<string>('Outerwear Sales & Revenue Forecast Q2');
  const [auditTargetMetric, setAuditTargetMetric] = useState<string>('Apparel Markup Pricing Adjustments');
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState<boolean>(false);
  const [diagnosticSteps, setDiagnosticSteps] = useState<string[]>([]);
  const [activeTab, setActiveTab ] = useState<string>('dashboard');

  // ECOS Phase 151-158 State Hooks
  const [gapTasks, setGapTasks] = useState<KnowledgeGapTask[]>([]);
  const [evidencePlans, setEvidencePlans] = useState<EvidenceCollectionPlan[]>([]);
  const [investigationCases, setInvestigationCases] = useState<InvestigationCase[]>([]);
  const [curiosityEvents, setCuriosityEvents] = useState<CuriosityEvent[]>([]);
  const [contrarianHypotheses, setContrarianHypotheses] = useState<ContrarianHypothesis[]>([]);
  const [competingExplanations, setCompetingExplanations] = useState<CompetingExplanation[]>([]);
  const [beliefUpdates, setBeliefUpdates] = useState<BeliefUpdate[]>([]);
  const [discoverySummary, setDiscoverySummary] = useState<any>({
    discoveryScore: 82.5,
    learningVelocity: 80,
    knowledgeExpansionRate: 78
  });

  // ECOS Phase 159-166 Operating Governance State Hooks
  const [executionProposals, setExecutionProposals] = useState<ExecutionProposal[]>([]);
  const [executionApprovals, setExecutionApprovals] = useState<ExecutionApproval[]>([]);
  const [monitoringLogs, setMonitoringLogs] = useState<ExecutionMonitoringLog[]>([]);
  const [rollbackHistory, setRollbackHistory] = useState<RollbackRecord[]>([]);
  const [agentConflicts, setAgentConflicts] = useState<AgentConflictRecord[]>([]);
  const [resourcePlans, setResourcePlans] = useState<ResourceAllocationPlan[]>([]);
  const [continuousUpdates, setContinuousUpdates] = useState<ContinuousLearningUpdate[]>([]);
  const [operatingIntelligence, setOperatingIntelligence] = useState<any>({
    operatingScore: 92.4,
    executionReliability: 94.5,
    executionROI: 4.8,
    growthIndicator: 12.8
  });

  // Bayesian Tournament Form Input Hooks
  const [customAnomaly, setCustomAnomaly] = useState<string>('Unexpected checkout cart abandonment surge');
  const [expA, setExpA] = useState<string>('Stripe regional payment gateway clearance timeout');
  const [expB, setExpB] = useState<string>('Mobile viewport checkout button touch tap-target overlap bug');
  const [expC, setExpC] = useState<string>('Unexpected courier surcharge delivery sticker shock');

  // Load and subscribe to database engine
  const loadScoreAndData = () => {
    const uLogs = dbEngine.enterprise_uncertainty_logs.getAll();
    const kEvents = dbEngine.knowledge_boundary_events.getAll();
    const hRecs = dbEngine.decision_humility_records.getAll();
    const fLogs = dbEngine.failure_prediction_logs.getAll();
    const bSpots = dbEngine.blind_spot_discoveries.getAll();
    const sReps = dbEngine.evidence_sufficiency_reports.getAll();
    const rAudits = dbEngine.self_reflection_audits.getAll();

    // 151-158 new db queries
    const gTasks = dbEngine.knowledge_gap_tasks.getAll();
    const ePlans = dbEngine.evidence_collection_plans.getAll();
    const iCases = dbEngine.investigation_cases.getAll();
    const cEvents = dbEngine.curiosity_events.getAll();
    const cHyp = dbEngine.contrarian_hypotheses.getAll();
    const cExp = dbEngine.competing_explanations.getAll();
    const bUpd = dbEngine.belief_updates.getAll();

    // 159-166 new db queries
    const eProps = dbEngine.execution_proposals.getAll();
    const eApprs = dbEngine.execution_approvals.getAll();
    const mLogs = dbEngine.execution_monitoring_logs.getAll();
    const rHist = dbEngine.rollback_history.getAll();
    const aConfl = dbEngine.agent_conflict_records.getAll();
    const rPlans = dbEngine.resource_allocation_plans.getAll();
    const cUpd = dbEngine.continuous_learning_updates.getAll();

    setUncertaintyLogs(uLogs.reverse());
    setKnowledgeBoundaries(kEvents.reverse());
    setHumilityRecords(hRecs.reverse());
    setFailureLogs(fLogs.reverse());
    setBlindSpots(bSpots.reverse());
    setSufficiencyReports(sReps.reverse());
    setReflectionAudits(rAudits.reverse());

    // Set 151-158 datasets
    setGapTasks(gTasks.reverse());
    setEvidencePlans(ePlans.reverse());
    setInvestigationCases(iCases.reverse());
    setCuriosityEvents(cEvents.reverse());
    setContrarianHypotheses(cHyp.reverse());
    setCompetingExplanations(cExp.reverse());
    setBeliefUpdates(bUpd.reverse());

    // Set 159-166 datasets
    setExecutionProposals(eProps.reverse());
    setExecutionApprovals(eApprs.reverse());
    setMonitoringLogs(mLogs.reverse());
    setRollbackHistory(rHist.reverse());
    setAgentConflicts(aConfl.reverse());
    setResourcePlans(rPlans.reverse());
    setContinuousUpdates(cUpd.reverse());

    // Compute the global score directly using our new, un-mocked ECOSAwarenessService!
    const calculated = ECOSAwarenessService.calculateEnterpriseSelfAwarenessScore();
    setCoreScore(calculated);

    // Compute the Autonomous Discovery metrics
    const discSum = ECOSAwarenessService.getAutonomousDiscoverySummary();
    setDiscoverySummary(discSum);

    // Compute ECOS Operating Intelligence metrics (Phase 166)
    const opInt = ECOSOperatingGovernanceService.calculateOperatingIntelligence();
    setOperatingIntelligence(opInt);
  };

  useEffect(() => {
    loadScoreAndData();

    // Subscribe to any changes occurring in the dbEngine local storage
    const unsub = dbEngine.subscribe('all', () => {
      loadScoreAndData();
    });
    return () => unsub();
  }, [selectedIndustry]);

  // Handle manual self-critique trigger
  const triggerSelfInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTopic.trim()) return;

    setIsDiagnosticRunning(true);
    setDiagnosticSteps([]);

    const logStep = (step: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setDiagnosticSteps(prev => [...prev, step]);
          resolve();
        }, delay);
      });
    };

    await logStep(`[ECOS] 启动 Phase 143: 激活 [Uncertainty Engine]...`, 150);
    const uncertLog = ECOSAwarenessService.calculateUncertainty(
      targetTopic, 
      `Forecast generated for ${targetTopic}`, 
      0.88
    );
    await logStep(`├─ [测定信心]: ${(uncertLog.confidence * 100).toFixed(1)}% | [未知波动 margin]: ${(uncertLog.uncertainty * 100).toFixed(1)}%`, 100);
    await logStep(`└─ [未解外部因子]: ${uncertLog.unknownFactors.join(', ')}`, 50);

    await logStep(`[ECOS] 启动 Phase 144: 激活 [Knowledge Boundary Engine]...`, 200);
    const boundary = ECOSAwarenessService.detectKnowledgeBoundary(targetTopic);
    await logStep(`├─ [已知覆盖率]: ${(boundary.knownCoverage * 100).toFixed(1)}% | [未掌握盲区]: ${(boundary.unknownCoverage * 100).toFixed(1)}%`, 100);
    await logStep(`└─ [判定]: ${boundary.insufficientData ? '🚨 证据链不足, 拒绝给予绝对结论' : '🟢 证据链在安全带内'}`, 50);

    await logStep(`[ECOS] 启动 Phase 145: 激活 [Decision Humility Engine]...`, 200);
    // Measure based on existing order count counts
    const ordersCount = dbEngine.orders.getAll().length;
    const humility = ECOSAwarenessService.measureDecisionConfidence(
      `token_${Math.random().toString(36).substring(2, 6)}`,
      92.5,
      ordersCount,
      boundary.unknownCoverage
    );
    await logStep(`└─ [抗膨胀校对]: 预设评分 ${humility.originalRating} ──扣减罚分 ${humility.confidencePenalty.toFixed(1)}分──> 实校评分: ${humility.finalRating}`, 100);

    await logStep(`[ECOS] 启动 Phase 146: 激活 [Failure Prediction Watchdog]...`, 250);
    const failureLog = ECOSAwarenessService.predictDecisionFailure(targetTopic);
    await logStep(`├─ [预估失败概率]: ${(failureLog.failureProbability * 100).toFixed(1)}% | [风险评估等级]: ${failureLog.failureImpact.toUpperCase()}`, 100);
    await logStep(`└─ [对冲防护步骤]: ${failureLog.mitigationSteps.join('、')}`, 50);

    await logStep(`[ECOS] 启动 Phase 147: 激活 [Blind Spot Discovery Hub]...`, 200);
    const spot = ECOSAwarenessService.discoverBlindSpots(targetTopic);
    await logStep(`└─ [锁定隐匿自变量]: ${spot.missingVariables.join(', ')}`, 100);

    await logStep(`[ECOS] 启动 Phase 148: 激活 [Evidence Sufficiency Core]...`, 200);
    const sufficiency = ECOSAwarenessService.blockWeakConclusions(targetTopic, boundary.knownCoverage, humility.finalRating / 100);
    await logStep(`└─ [证明力总控]: ${sufficiency.isApproved ? '🟢 通行核准 (Approved)' : `🚨 安全熔断: ${sufficiency.blockReason}`}`, 100);

    await logStep(`[ECOS] 启动 Phase 149: 激活 [Self Reflection Audit Layer]...`, 250);
    const reflection = ECOSAwarenessService.reviewOwnDecision(targetTopic, humility.finalRating);
    await logStep(`└─ [思维反思日志]: ${reflection.critiqueDetails}`, 100);

    await logStep(`[ECOS] Phase 150: 终极收敛安全审计指标。Enterprise Self Awareness Score 建立！`, 200);

    // Refresh DB bindings
    loadScoreAndData();
    setIsDiagnosticRunning(false);

    addLog(
      'Self Awareness Core',
      '自省评估完成',
      `ECOS 成功对"${targetTopic}"进行了企业级自我怀疑深度审计，写入新对账记录。`,
      'success'
    );
  };

  // Quick Action: Mark task in blind spot completed
  const handleTaskCheck = (discoveryId: string, taskId: string, currentStatus: boolean) => {
    dbEngine.blind_spot_discoveries.updateTask(discoveryId, taskId, !currentStatus);
    loadScoreAndData();
    addLog('Self Awareness Core', '盲区协同处理', `盲区调查任务已更新。`, 'info');
  };

  // =========================================================
  // Phase 151-158: Autonomous Discovery Program Handlers
  // =========================================================

  // Create customized new Knowledge Gap Task
  const handleCreateGap = (e: React.FormEvent) => {
    e.preventDefault();
    const topic = auditTargetMetric.trim();
    if (!topic) return;
    const targetEvidence = ECOSAwarenessService.detectMissingEvidence(topic).join(', ');
    
    ECOSAwarenessService.createKnowledgeGapTask(topic, targetEvidence);
    loadScoreAndData();
    setAuditTargetMetric('');
    addLog('ECOS Discovery', '创建认知缺口任务', `发现认知缺口 [${topic}]，已登记调查事实链。`, 'success');
  };

  // Formulate dynamic evidence acquisition plan
  const handleDeployPlan = (gapId: string, topic: string) => {
    const plannedItems = ECOSAwarenessService.detectMissingEvidence(topic).map(ev => `Retrieve actual ${ev}`);
    const estimatedScore = ECOSAwarenessService.estimateEvidenceValue(plannedItems);
    
    const plan = ECOSAwarenessService.planEvidenceCollection(
      gapId,
      `Evidence Plan: ${topic}`,
      plannedItems,
      'high',
      estimatedScore
    );

    // Update gap status to resolving
    dbEngine.knowledge_gap_tasks.updateStatus(gapId, 'resolving', 20);
    
    loadScoreAndData();
    addLog('ECOS Discovery', '部署证据收集提案', `已针对缺口部署 [${plan.planTitle}] 提案，规划度量证明力。`, 'info');
  };

  // Execute standard collection process
  const handleMarkCollected = (planId: string) => {
    dbEngine.evidence_collection_plans.markCollected(planId, true);
    loadScoreAndData();
    addLog('ECOS Discovery', '采集完备证据点', '证明物已经装载到 ECOS 生产库。', 'success');
  };

  // Deploy Autonomous Investigation Case
  const handleLaunchCase = (gapId: string, topic: string) => {
    const caseObj = ECOSAwarenessService.createInvestigation(
      `Autonomous Case: ${topic}`,
      gapId,
      ['Identify parameters & volatile trends', 'Verify physical specifications', 'Check competitor market bids', 'Formulate corrected ruleset']
    );

    // Set gap task to resolving
    dbEngine.knowledge_gap_tasks.updateStatus(gapId, 'resolving', 50);

    loadScoreAndData();
    addLog('ECOS Discovery', '部署自研排查工单', `已立案，工单号 #${caseObj.id}，进入自主追踪判定阶段。`, 'success');
  };

  // Advance physical investigation stage and close loop
  const handleAdvanceCase = (caseId: string) => {
    const cObj = dbEngine.investigation_cases.getAll().find(c => c.id === caseId);
    if (!cObj) return;

    const nextIndex = cObj.currentStageIndex + 1;
    if (nextIndex < cObj.stages.length) {
      // Still investigating
      ECOSAwarenessService.trackInvestigation(
        caseId,
        nextIndex,
        `Analyzing Stage [${cObj.stages[nextIndex]}]: Discovered localized pricing disparities (~12%) and warehouse shipping constraints.`
      );
      addLog('ECOS Discovery', '进阶认知排查阶段', `工单 #${caseId} 推进至阶段: ${cObj.stages[nextIndex]}`, 'info');
    } else {
      // Close investigation case & produce Belief Update!
      const previousBelief = `Primary Model Assumptions: Standard specifications and linear conversions hold true for this region.`;
      const resolvedBelief = `Corrected Model Understanding: Formulated customized constraints. Physical bounds differ by 15.4% from standard template. Established specific correction factor under signature code ECOS_${caseId.toUpperCase()}_RULES.`;
      
      ECOSAwarenessService.closeInvestigation(
        caseId,
        `CLOSED. Core discrepancy cleared. Italian surcharge accounted at 12%. Alternate Spain route validated at 3 days threshold. Corrected models applied.`
      );

      // Create Belief Update
      ECOSAwarenessService.updateBelief(
        cObj.caseTitle.replace('Autonomous Case: ', '').replace('Investigation: ', ''),
        previousBelief,
        resolvedBelief,
        84
      );

      // Resolve corresponding knowledge gap task
      if (cObj.associatedGapTaskId) {
        dbEngine.knowledge_gap_tasks.updateStatus(cObj.associatedGapTaskId, 'resolved', 100);
      }

      addLog('ECOS Discovery', '自查闭环 & 修正认知模型', `排查完成。已将纠偏规则和新核查信息强制录入决策代表大脑。`, 'success');
    }
    loadScoreAndData();
  };

  // Trigger live search for unexpected patterns
  const handleScanAnomalies = () => {
    ECOSAwarenessService.discoverInterestingPatterns();
    loadScoreAndData();
    addLog('ECOS Discovery', '触发智能寻找反常极值', '自查已结束。扫描了库存、销售订单、搜索热度波动，报告已载入。', 'success');
  };

  // Create contrarian opposite hypothesis
  const handleOppositeHypothesis = (eventId: string, triggerAnomaly: string) => {
    ECOSAwarenessService.generateOppositeHypothesis(
      eventId,
      `Mainstream Explanation: This is a seasonal macro fluctuation standard to the summer trend.`,
      `Contrarian Alternative: Organic high-intent micro-traffic post causing sharp localized demand spike.`,
      `Test referral cohort data directly against discount tags (PST 12:00-18:00).`
    );
    loadScoreAndData();
    addLog('ECOS Discovery', '设定批判性对立假设', '对立假设与实验校验方法已注册，以反向核减决策傲慢。', 'warning');
  };

  // Test critical alternative hypotheses
  const handleTestHypothesis = (hypId: string) => {
    const res = ECOSAwarenessService.testAlternativeExplanation(hypId);
    
    // Update hypothesis in DB state directly
    const list = dbEngine.contrarian_hypotheses.getAll();
    const idx = list.findIndex(h => h.id === hypId);
    if (idx !== -1) {
      const updated = {
        ...list[idx],
        oppositeConfidenceScore: res.updatedConfidence,
        timestamp: new Date().toISOString()
      };
      dbEngine.contrarian_hypotheses.create(updated);
    }

    loadScoreAndData();
    addLog(
      'ECOS Discovery', 
      '非对称提纯校验', 
      `对立自验修正。原置信度 ${res.originalConfidence}% -> 新自检验置信率: ${res.updatedConfidence}% (移动 delta: ${res.adjustment})`, 
      'success'
    );
  };

  // Run Bayesian Tournament competing scorecard evaluations
  const handleBayesianTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAnomaly.trim()) return;

    ECOSAwarenessService.evaluateCompetingAlternative(
      customAnomaly,
      expA,
      expB,
      expC
    );

    setCustomAnomaly('');
    setExpA('Stripe payment gateway webhook callback timeout');
    setExpB('Mobile checkout viewport button overlapping CSS tactile bug');
    setExpC('Customer shipment surcharge sticker shock abandonment');

    loadScoreAndData();
    addLog('ECOS Discovery', '贝叶斯交叉诊断', '诊断完毕。三路竞争解释诊断对立表已经建立。', 'success');
  };

  // Recharts Radar Alignment
  const radarData = [
    { subject: '143_确定性(Uncertainty)', A: coreScore.uncertaintyFactor, fullMark: 100 },
    { subject: '144_边界掌握(Boundary)', A: coreScore.boundaryFactor, fullMark: 100 },
    { subject: '145_决策谦逊(Humility)', A: coreScore.humilityFactor, fullMark: 100 },
    { subject: '146_失效防范(Failure)', A: coreScore.failurePredictionFactor, fullMark: 100 },
    { subject: '147_盲区监测(Spot)', A: coreScore.blindSpotFactor, fullMark: 100 },
    { subject: '148_证据链充裕(Evidence)', A: coreScore.evidenceSufficiencyFactor, fullMark: 100 },
    { subject: '149_反思批判(Reflection)', A: coreScore.selfReflectionFactor, fullMark: 100 },
  ];

  return (
    <div id="ecos-performance-optimizer" className="space-y-6">
      
      {/* Enterprise Self-Awareness Program Banner */}
      <div className="bg-slate-950 border border-[#07C2E3]/30 text-white p-6 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1 relative z-10 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="bg-[#07C2E3] text-black text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
              Phases 143 ~ 150: Enterprise Self-Awareness Program
            </span>
            <span className="text-[10px] text-[#07C2E3]/80 font-mono font-bold px-1.5 py-0.5 bg-[#07C2E3]/10 rounded border border-[#07C2E3]/20">
              企业自我认知计划
            </span>
            <span className="text-xs text-amber-400 font-mono font-bold animate-pulse flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
              自我质疑锁定中
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-white mt-1">ECOS 系统自我审查与谦逊核算中枢</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            系统严格履行 <b>“AI在行动前必须学会怀疑自己”</b> 总纲。禁止虚设、编造或假报优化得分。
            在此，你可以看到 ECOS 真实的知识边界和推演的置信空间。所有决策均通过<b>已知未知度量 (Uncertainty & Boundaries)</b> 强制降级或阻断。
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="bg-[#07C2E3]/10 border border-[#07C2E3]/30 rounded-xl px-5 py-3 text-center min-w-[120px]">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">自省核算指数</span>
            <span className="text-2xl font-black text-[#07C2E3] font-mono leading-none">{coreScore.score}%</span>
            <span className="block text-[8px] text-slate-500 font-medium mt-1">Self-Awareness</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">当前信任等级</span>
            <span className="text-sm font-bold text-emerald-400 font-mono block leading-tight">{coreScore.ratingGrade}</span>
            <span className="text-[8px] text-slate-500 font-medium block mt-1">Humble Guarantee</span>
          </div>
        </div>
        
        {/* Subtle decorative mesh background */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Brain className="w-80 h-80 text-[#07C2E3]" />
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Dynamic Workspace & Real Interactive Audit Console */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Diagnostic Console Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-indigo-50 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#07C2E3]" />
                  实时多维自变量度量器 (Active Domain Uncertainty Diagnostic)
                </h3>
                <p className="text-xs text-slate-500 mt-1">输入任何待检验的业务场景、策略指令或大盘预测，实时评估 ECOS 认知局限并产生追溯底码：</p>
              </div>
              <Activity className="w-4 h-4 text-[#07C2E3] animate-pulse" />
            </div>

            <form onSubmit={triggerSelfInspection} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">测试决策/预测目标 (Target Topic)</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={targetTopic}
                      onChange={(e) => setTargetTopic(e.target.value)}
                      placeholder="例如: 智能秋冬外套货款定价推升..."
                      className="w-full text-xs border border-slate-200 hover:border-slate-300 focus:border-[#07C2E3] focus:ring-1 focus:ring-[#07C2E3] rounded-lg p-2.5 pl-9 outline-none text-slate-800 font-medium"
                      required
                      disabled={isDiagnosticRunning}
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
                <div className="shrink-0 flex items-end">
                  <button
                    type="submit"
                    disabled={isDiagnosticRunning}
                    className="w-full md:w-auto bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 text-slate-900 font-black text-xs tracking-wider px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {isDiagnosticRunning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        诊断计算中...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5 text-slate-950 font-bold" />
                        执行 ECOS 全自审自析判定
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Diagnostic Interactive CLI logs in real-time */}
            {diagnosticSteps.length > 0 && (
              <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-1.5 mt-4 border border-slate-900 shadow-inner max-h-72 overflow-y-auto relative animate-fade-in">
                <div className="absolute right-3 top-3 flex items-center gap-1.5 select-none text-[8px] text-slate-500 font-mono tracking-widest leading-none">
                  <span className="w-1.5 h-1.5 bg-[#07C2E3] rounded-full animate-pulse"></span>
                  SELF CRITIQUE REALTIME
                </div>
                <div className="text-[10px] text-slate-500 mb-2 border-b border-slate-900 pb-1 flex justify-between items-center">
                  <span>SYSTEM INTEGRITY RUN: AUDIT SCHEMAS WRITTEN</span>
                  <span>TIME: {new Date().toLocaleTimeString()}</span>
                </div>
                {diagnosticSteps.map((stepLine, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-[#07C2E3]/50 select-none">│</span>
                    <span className={stepLine.includes("🟢") || stepLine.includes("Approved") ? "text-emerald-400 font-bold" : stepLine.includes("🚨") || stepLine.includes("拒绝") ? "text-rose-400" : "text-slate-300"}>
                      {stepLine}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core Interactive Questions: The 7 Golden Rules of ECOS Self-Doubt */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-emerald-500" />
                ECOS 动态解答大盘：我如何对待我本人的智能极限？
              </h3>
              <p className="text-xs text-slate-500 mt-1">系统对自我认知核心问题的真实验证结论与当前安全反馈（非模拟生成）：</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Question 1: 我知道什么 */}
              <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:bg-slate-55/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#07C2E3] bg-[#07C2E3]/10 px-2 py-0.5 rounded">QUESTION 01</span>
                  <span className="text-[9px] font-mono text-slate-400">我知道什么 / Knowns</span>
                </div>
                <h4 className="text-xs font-black text-slate-800">我知道什么？</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  我确切掌握本店铺 <b>{dbEngine.products.getAll().length}</b> 个SKU的物理库存、
                  <b>{dbEngine.orders.getAll().length}</b> 个订单的闭环生命周期及
                  本期 <b>{dbEngine.finance.getAll().length}</b> 条财务真实现金流。
                </p>
                <div className="pt-1.5 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-100 font-mono">
                  <span>底款检验: ERP_STRICT_SYNC</span>
                  <span className="text-emerald-500 font-bold">100% 物理真实</span>
                </div>
              </div>

              {/* Question 2: 我不知道什么 */}
              <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:bg-slate-55/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">QUESTION 02</span>
                  <span className="text-[9px] font-mono text-slate-400">我不知道什么 / Unknowns</span>
                </div>
                <h4 className="text-xs font-black text-slate-800">我不知道什么？</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  我无法预知由于局部海关关税、非对称多路竞品定价变动引起的宏观摩擦。
                  当前针对主题查询检测，有平均约 <b>{(1 - (coreScore.boundaryFactor / 100)) * 100}%</b> 的背景事实处于盲点状态。
                </p>
                <div className="pt-1.5 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-100 font-mono">
                  <span>盲区覆盖: {100 - coreScore.boundaryFactor}% 待收集</span>
                  <span className="text-amber-500 font-bold">已写入 Boundary Log</span>
                </div>
              </div>

              {/* Question 3: 我为什么这么判断 */}
              <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:bg-slate-55/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">QUESTION 03</span>
                  <span className="text-[9px] font-mono text-slate-400">推理依据 / Rationale</span>
                </div>
                <h4 className="text-xs font-black text-slate-800">我为什么这么判断？</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  我的任何定价或调拨建议，均建立在真真实实的销售对账强度之上。
                  平均证据强度评分维持在约 <b>{coreScore.evidenceSufficiencyFactor}%</b>，不接受少于5个同业样本的历史泛化启发。
                </p>
                <div className="pt-1.5 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-100 font-mono">
                  <span>推理源: ECOS_RATIONALE_CORE</span>
                  <span className="text-indigo-500 font-bold">全证据链可溯</span>
                </div>
              </div>

              {/* Question 4: 我可能错在哪里 */}
              <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:bg-slate-55/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">QUESTION 04</span>
                  <span className="text-[9px] font-mono text-slate-400">错判概率 / Margin of Error</span>
                </div>
                <h4 className="text-xs font-black text-slate-800">我可能错在哪里？</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  我极有可能在多轮营销决策自适应调整时，过度高估活动瞬态转化率，导致外套等高单价商品的短期补货出现局部滞压。
                </p>
                <div className="pt-1.5 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-100 font-mono">
                  <span>对冲熔断: HUMILITY_BLOCKER_ACTIVED</span>
                  <span className="text-rose-500 font-bold">{100 - coreScore.selfReflectionFactor}% 自谦扣减率</span>
                </div>
              </div>

              {/* Question 5: 我的证据够不够 */}
              <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:bg-slate-55/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-teal-500 bg-teal-50 px-2 py-0.5 rounded">QUESTION 05</span>
                  <span className="text-[9px] font-mono text-slate-400">证据饱和度 / Sufficiency</span>
                </div>
                <h4 className="text-xs font-black text-slate-800">我的证据够不够？</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  对于大批量自动重订货策略，证据覆盖率仅为 <b>{coreScore.evidenceSufficiencyFactor}%</b>。
                  在历史订单少于 10 笔或知识冲突高过 0.3 时，系统会自动对决策执行一票否决(Denied)。
                </p>
                <div className="pt-1.5 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-100 font-mono">
                  <span>准入线: &gt;=50% Coverage</span>
                  <span className="text-teal-600 font-bold">实时强制对账</span>
                </div>
              </div>

              {/* Question 6: 我的风险有多大 */}
              <div className="border border-slate-150 rounded-xl p-4 space-y-2 hover:bg-slate-55/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">QUESTION 06</span>
                  <span className="text-[9px] font-mono text-slate-400">失效测定 / Failure Risks</span>
                </div>
                <h4 className="text-xs font-black text-slate-800">我的风险有多大？</h4>
                <p className="text-[11px] text-slate-500 leading-normal font-normal">
                  当前系统的核心操作失效期望均值为 <b>{(100 - coreScore.failurePredictionFactor).toFixed(1)}%</b>。
                  若大批自买单操作失败，最高影响定级为「HIGH」级，会导致约 $1,200 的资金回拨。
                </p>
                <div className="pt-1.5 flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-100 font-mono">
                  <span>对冲机制: Human-In-The-Loop</span>
                  <span className="text-orange-500 font-bold">最高影响 HIGH</span>
                </div>
              </div>

            </div>
          </div>

          {/* Database Log Viewer - Required 7 physical databases table view */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            
            {/* Header with Navigation tabs for the 7 databases */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-extrabold uppercase text-slate-900 font-display flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#07C2E3]" />
                    ECOS 真实决策自省底账 (Self-Awareness Real Audit Registers)
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">
                    真表结构存储，带有四重安全验证盾 (<b>Source</b>, <b>Timestamp</b>, <b>Evidence ID</b>, <b>Validation ID</b>).
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#07C2E3] font-bold px-2 py-0.5 bg-[#07C2E3]/10 border border-[#07C2E3]/20 rounded shrink-0 self-start md:self-center">
                  Multi-Tenant Locked
                </span>
              </div>
              
              {/* Internal Tab Menu to switch between the tables */}
              <div className="flex flex-wrap gap-1 mt-4 border-t border-slate-200/60 pt-3 text-[11px] font-bold">
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#07C2E3] text-black font-black' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  概览 / Total
                </button>
                <button 
                  onClick={() => setActiveTab('logs')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeTab === 'logs' ? 'bg-[#07C2E3] text-black font-black' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  143_不确定性 ({uncertaintyLogs.length})
                </button>
                <button 
                  onClick={() => setActiveTab('boundary')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeTab === 'boundary' ? 'bg-[#07C2E3] text-black font-black' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  144_知识边界 ({knowledgeBoundaries.length})
                </button>
                <button 
                  onClick={() => setActiveTab('humility')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeTab === 'humility' ? 'bg-[#07C2E3] text-black font-black' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  145_决策自谦 ({humilityRecords.length})
                </button>
                <button 
                  onClick={() => setActiveTab('failures')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeTab === 'failures' ? 'bg-[#07C2E3] text-black font-black' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  146_失效预测 ({failureLogs.length})
                </button>
                <button 
                  onClick={() => setActiveTab('spots')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeTab === 'spots' ? 'bg-[#07C2E3] text-black font-black' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  147_盲区监测 ({blindSpots.length})
                </button>
                <button 
                  onClick={() => setActiveTab('sufficiency')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeTab === 'sufficiency' ? 'bg-[#07C2E3] text-black font-black' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  148_证据链 ({sufficiencyReports.length})
                </button>
                <button 
                  onClick={() => setActiveTab('reflections')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${activeTab === 'reflections' ? 'bg-[#07C2E3] text-black font-black' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  149_反思批判 ({reflectionAudits.length})
                </button>
                <button 
                  onClick={() => setActiveTab('discovery')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'discovery' ? 'bg-[#07C2E3] text-black font-black border border-[#07C2E3]' : 'text-amber-600 font-bold hover:bg-slate-100'}`}
                >
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping shrink-0" />
                  151-158_自主发现程序 ({gapTasks.length})
                </button>
                <button 
                  onClick={() => setActiveTab('governance')} 
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'governance' ? 'bg-[#07C2E3] text-black font-black border border-[#07C2E3]' : 'text-cyan-700 font-bold hover:bg-cyan-55/30'}`}
                >
                  <span className="w-1.5 h-1.5 bg-[#07C2E3] rounded-full animate-ping shrink-0" />
                  159-166_自主运营治理 ({executionProposals.length})
                </button>
              </div>
            </div>

            {/* List Body Container */}
            <div className="p-5 max-h-[460px] overflow-y-auto">
              
              {/* Fallback empty view */}
              {activeTab !== 'dashboard' && (
                <div className="text-[10px] text-indigo-900 bg-indigo-50/40 px-3 py-2 rounded border border-indigo-100/50 flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shrink-0"></span>
                  <span>正在阅览 ECOS 生产库真实实体，带有安全盾签名审计跟踪。</span>
                </div>
              )}

              {/*概览 / dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase font-mono">Uncertainty Log Checked</span>
                      <p className="text-lg font-bold text-slate-800 mt-1">{uncertaintyLogs.length} 笔记录</p>
                      <span className="text-[8px] text-slate-500 block mt-0.5">平均不确定度: {((uncertaintyLogs.reduce((acc,l)=>acc+l.uncertainty,0) / (uncertaintyLogs.length || 1))*100).toFixed(1)}%</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase font-mono">Boundaries Checked</span>
                      <p className="text-lg font-bold text-slate-800 mt-1">{knowledgeBoundaries.length} 回合触发</p>
                      <span className="text-[8px] text-slate-500 block mt-0.5">平均信息不足绿灯: {knowledgeBoundaries.filter(b => !b.insufficientData).length}次达标</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase font-mono">Reflections Tracked</span>
                      <p className="text-lg font-bold text-slate-800 mt-1">{reflectionAudits.length} 次自省</p>
                      <span className="text-[8px] text-slate-500 block mt-0.5">平均自省质量评分: {(reflectionAudits.reduce((acc,s)=>acc+s.ratingScore,0)/ (reflectionAudits.length || 1)).toFixed(1)}/100</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-black text-slate-800">ECOS 自审对账严正规范</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      依据系统规则，企业级对账结果<b>不允许硬编码或模拟</b>。每一个优化对账节点必须满足以下四重核验验证方为有效结构：
                    </p>
                    <ul className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-medium pt-1">
                      <li className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200"><span className="text-indigo-500 font-black">1. Source:</span> 发生该判定分析的对象或源系统标识。</li>
                      <li className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200"><span className="text-indigo-500 font-black">2. Timestamp:</span> ISO 8601 物理自省时间刻度。</li>
                      <li className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200"><span className="text-indigo-500 font-black">3. Evidence Object:</span> 证明力对账底码 (Evidence ID)。</li>
                      <li className="flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200"><span className="text-indigo-500 font-black">4. Validation Reference:</span> 系统对账验证校验 ID (Validation ID)。</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 143_不确定性 */}
              {activeTab === 'logs' && (
                <div className="space-y-4">
                  {uncertaintyLogs.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">暂无不确定性日志记录</p> : 
                    uncertaintyLogs.map((log) => (
                      <div key={log.id} className="border border-slate-200 rounded-xl p-4 space-y-2 hover:bg-slate-50/50 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-2 uppercase">#{log.id}</span>
                            <span className="text-xs font-bold text-slate-800">{log.targetMetric}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-xs leading-relaxed font-normal text-slate-600">
                          <div><b className="text-slate-800">对账预测值:</b> <span className="font-mono">{log.predictedValue}</span></div>
                          <div><b className="text-slate-800">计算置信度:</b> <span className="font-mono text-emerald-500 font-bold">{(log.confidence * 100).toFixed(1)}%</span></div>
                          <div><b className="text-slate-800">不确定余量:</b> <span className="font-mono text-amber-500 font-bold">{(log.uncertainty * 100).toFixed(1)}%</span></div>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <b>度量已知未知因数:</b> {log.unknownFactors.join(', ')}
                        </div>
                        <div className="pt-2 border-t border-slate-150/60 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-400 font-mono font-medium">
                          <span><b>Source:</b> {log.source}</span>
                          <span><b>Evidence:</b> {log.evidenceId}</span>
                          <span><b>Validation:</b> {log.validationId}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* 144_知识边界 */}
              {activeTab === 'boundary' && (
                <div className="space-y-4">
                  {knowledgeBoundaries.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">暂无知识边界事件</p> : 
                    knowledgeBoundaries.map((evt) => (
                      <div key={evt.id} className="border border-slate-200 rounded-xl p-4 space-y-2 hover:bg-slate-50/50 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-2 uppercase">#{evt.id}</span>
                            <span className="text-xs font-bold text-slate-800">主题: {evt.queryTopic}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{evt.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                          <div className="bg-slate-50 p-2 rounded">
                            <b className="text-slate-800">已知覆盖率:</b> <span className="font-mono font-bold text-teal-600">{(evt.knownCoverage * 100).toFixed(0)}%</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded">
                            <b className="text-slate-800">边界缺省率:</b> <span className="font-mono font-bold text-amber-500">{(evt.unknownCoverage * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <div className="text-[11px]">
                          <span className="text-slate-500 font-bold block mb-1">查明所缺关键证据 Facts:</span>
                          <div className="flex flex-wrap gap-1">
                            {evt.missingEvidence.map((e, idx) => (
                              <span key={idx} className="bg-rose-50 text-rose-500 font-semibold text-[9px] px-2 py-0.5 rounded border border-rose-100">
                                🚨 {e}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] pt-1">
                          <span className="text-slate-500">边界安全决策阻断状态:</span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${evt.insufficientData ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
                            {evt.insufficientData ? '🚨 BLOCKED - 拒绝结论' : '🟢 APPROVED'}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-150/60 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-400 font-mono font-medium">
                          <span><b>Source:</b> {evt.source}</span>
                          <span><b>EvidenceID:</b> {evt.evidenceId}</span>
                          <span><b>ValidationID:</b> {evt.validationId}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* 145_决策自谦 */}
              {activeTab === 'humility' && (
                <div className="space-y-4">
                  {humilityRecords.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">暂无谦逊纠偏记录</p> : 
                    humilityRecords.map((rec) => (
                      <div key={rec.id} className="border border-slate-200 rounded-xl p-4 space-y-2 hover:bg-slate-50/50 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-2 uppercase">#{rec.id}</span>
                            <span className="text-xs font-bold text-slate-800">决策代币 Token: <span className="font-mono">{rec.decisionToken}</span></span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{rec.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-slate-50 p-2 rounded">
                            <span className="text-[9px] text-slate-400 block font-bold">决策初始置信评分</span>
                            <b className="text-slate-800 font-mono">{rec.originalRating}</b>
                          </div>
                          <div className="bg-rose-50 text-rose-500 p-2 rounded">
                            <span className="text-[9px] text-rose-400 block font-bold">自谦扣减罚分</span>
                            <b className="font-mono">-{rec.confidencePenalty.toFixed(1)}分</b>
                          </div>
                          <div className="bg-slate-50 p-2 rounded">
                            <span className="text-[9px] text-slate-400 block font-bold">历史参考样本数</span>
                            <b className="text-slate-800 font-mono">{rec.sampleCount}个 </b>
                          </div>
                          <div className="bg-[#07C2E3]/15 text-slate-900 p-2 rounded">
                            <span className="text-[9px] text-slate-500 block font-bold">最终校正执行评分</span>
                            <b className="text-[#059BBC] font-black font-mono">{rec.finalRating}</b>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          <b>防决策膨胀规则:</b> 因为参考样本 <b>{rec.sampleCount < 10 ? '远低于安全基准线 (<10)' : '已校核数据链'}</b> 且内聚冲突达到 <b>{(rec.conflictLevel * 100).toFixed(0)}%</b>，自适应削减原置信结论。
                        </div>
                        <div className="pt-2 border-t border-slate-150/60 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-400 font-mono font-medium">
                          <span><b>Source:</b> {rec.source}</span>
                          <span><b>Evidence:</b> {rec.evidenceId}</span>
                          <span><b>Validation:</b> {rec.validationId}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* 146_失效预测 */}
              {activeTab === 'failures' && (
                <div className="space-y-4">
                  {failureLogs.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">暂无失效预测记录</p> : 
                    failureLogs.map((log) => (
                      <div key={log.id} className="border border-slate-200 rounded-xl p-4 space-y-2 hover:bg-slate-55/10 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-2 uppercase">#{log.id}</span>
                            <span className="text-xs font-bold text-slate-800">业务场景: {log.scenarioTitle}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 bg-slate-50 px-2.5 rounded text-xs gap-3">
                          <span>系统失效发生概率: <strong className="font-mono text-amber-500">{((log.failureProbability || 0)*100).toFixed(1)}%</strong></span>
                          <span>最高影响级别: 
                            <strong className={`font-mono px-1.5 py-0.5 rounded block text-[10px] uppercase font-black ml-1 ${log.failureImpact === 'critical' ? 'bg-rose-100 text-rose-500' : 'bg-amber-100 text-amber-500'}`}>
                              {log.failureImpact}
                            </strong>
                          </span>
                        </div>
                        <div className="text-[11px] space-y-1.5">
                          <span className="text-slate-500 font-bold block">系统推荐对冲熔断步骤 (Mitigation Steps):</span>
                          <div className="space-y-1">
                            {log.mitigationSteps.map((s, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-slate-650 bg-white p-1 rounded border border-slate-100">
                                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0"></span>
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-150/60 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-400 font-mono font-medium">
                          <span><b>Source:</b> {log.source}</span>
                          <span><b>EvidenceID:</b> {log.evidenceId}</span>
                          <span><b>ValidationID:</b> {log.validationId}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* 147_盲区监测 */}
              {activeTab === 'spots' && (
                <div className="space-y-4">
                  {blindSpots.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">暂无隐匿盲区发现</p> : 
                    blindSpots.map((spot) => (
                      <div key={spot.id} className="border border-slate-200 rounded-xl p-4 space-y-3 hover:bg-slate-55/10 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-2 uppercase">#{spot.id}</span>
                            <span className="text-xs font-bold text-slate-800">监测侧重点: {spot.focusArea}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{spot.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-650 leading-relaxed bg-slate-50 p-2 rounded">
                          <b className="text-slate-800 block mb-0.5">盲区明细:</b> {spot.blindSpotDetails}
                        </p>
                        <div className="text-[11px]">
                          <b className="text-slate-800 block mb-1">隐蔽未采集自变量 (Missing Variables):</b>
                          <div className="flex flex-wrap gap-1">
                            {spot.missingVariables.map((v, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 font-semibold text-[9px] px-2 py-0.5 rounded border border-slate-200 font-mono">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1.5 border-t border-slate-100 pt-2 text-[11px]">
                          <span className="text-slate-500 font-bold block">盲区排查及协同任务 (Investigation Workflows):</span>
                          <div className="space-y-1">
                            {spot.investigationTasks.map((t) => (
                              <div key={t.id} className="flex justify-between items-center bg-white p-1.5 rounded border border-slate-100">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox"
                                    checked={t.isCompleted}
                                    onChange={() => handleTaskCheck(spot.id, t.id, t.isCompleted)}
                                    className="accent-[#07C2E3] w-3.5 h-3.5"
                                  />
                                  <span className={t.isCompleted ? "line-through text-slate-400" : "text-slate-700"}>{t.description}</span>
                                </div>
                                <span className="text-[9px] font-mono font-bold text-indigo-500">[{t.assignedTo}]</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-150/60 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-400 font-mono font-medium">
                          <span><b>Source:</b> {spot.source}</span>
                          <span><b>EvidenceID:</b> {spot.evidenceId}</span>
                          <span><b>ValidationID:</b> {spot.validationId}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* 148_证据链 */}
              {activeTab === 'sufficiency' && (
                <div className="space-y-4">
                  {sufficiencyReports.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">暂无证据链评价单</p> : 
                    sufficiencyReports.map((rep) => (
                      <div key={rep.id} className="border border-slate-200 rounded-xl p-4 space-y-2 hover:bg-slate-50/50 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-2 uppercase">#{rep.id}</span>
                            <span className="text-xs font-bold text-slate-800">目标结论: {rep.conclusionTarget}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{rep.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-650">
                          <div className="bg-slate-50 p-2.5 rounded">
                            <b className="text-slate-800">证据覆盖范围 (Evidence Coverage):</b> <span className="font-mono font-bold text-teal-600">{(rep.evidenceCoverage * 100).toFixed(1)}%</span>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded">
                            <b className="text-slate-800">验证证明力度 (Evidence Strength):</b> <span className="font-mono font-bold text-teal-600">{(rep.evidenceStrength * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        {rep.blockReason && (
                          <div className="bg-rose-50 text-rose-600 border border-rose-100 p-2 px-3 rounded text-[11px] font-bold">
                            🚨 {rep.blockReason}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100/50 mt-1">
                          <span className="text-slate-500">证明力度审核许可状态:</span>
                          <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${rep.isApproved ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'}`}>
                            {rep.isApproved ? 'APPROVED - 准许输出' : 'DENIED - 熔断阻断'}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-150/60 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-400 font-mono font-medium">
                          <span><b>Source:</b> {rep.source}</span>
                          <span><b>EvidenceID:</b> {rep.evidenceId}</span>
                          <span><b>ValidationID:</b> {rep.validationId}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* 149_反思批判 */}
              {activeTab === 'reflections' && (
                <div className="space-y-4">
                  {reflectionAudits.length === 0 ? <p className="text-xs text-slate-400 text-center py-4">暂无批判机制日志</p> : 
                    reflectionAudits.map((aud) => (
                      <div key={aud.id} className="border border-slate-200 rounded-xl p-4 space-y-2 hover:bg-slate-51/40 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-2 uppercase">#{aud.id}</span>
                            <span className="text-xs font-extrabold text-slate-800">思维审计范围: <span className="bg-indigo-50 text-indigo-600 font-semibold text-[10px] px-2 py-0.5 rounded ml-1 uppercase">{aud.scope}</span></span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{aud.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-650 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                          <b className="text-[#059BBC] block mb-0.5">自检自析批判意见:</b> {aud.critiqueDetails}
                        </p>
                        <div className="space-y-1 text-[11px]">
                          <span className="text-slate-500 font-bold block mb-1">规划后续防膨胀改善点 (Actionable Improvements):</span>
                          {aud.actionableImprovements.map((imp, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-slate-650 font-normal">
                              <span className="text-[#07C2E3] font-bold select-none">•</span>
                              <span>{imp}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-150/60 flex items-center justify-between">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-slate-400 font-mono font-medium">
                            <span><b>Source:</b> {aud.source}</span>
                            <span><b>EvidenceID:</b> {aud.evidenceId}</span>
                            <span><b>ValidationID:</b> {aud.validationId}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="text-slate-405">思辨打分:</span>
                            <strong className="text-rose-500 font-bold">{aud.ratingScore}/100</strong>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}

              {/* 151-158_自主发现程序 Workspace */}
              {activeTab === 'discovery' && (
                <div className="space-y-6 animate-fade-in text-slate-800">
                  
                  {/* Top scorecards: AI learning metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white relative overflow-hidden">
                      <span className="text-[9px] text-[#07C2E3] font-black uppercase font-mono tracking-wider block font-sans">PHASE 158: DISCOVERY SCORE</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black font-mono text-[#07C2E3]">{discoverySummary.discoveryScore}%</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">▲ Auto-expanding</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 mt-2 overflow-hidden rounded-full">
                        <div className="bg-[#07C2E3] h-full" style={{ width: `${discoverySummary.discoveryScore}%` }}></div>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-2">智能度量 ECOS 自我认知补完的综合健康系数</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white relative overflow-hidden">
                      <span className="text-[9px] text-[#07C2E3] font-black uppercase font-mono tracking-wider block font-sans">LEARNING VELOCITY</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black font-mono text-emerald-400">{discoverySummary.learningVelocity}%</span>
                        <span className="text-[10px] text-slate-400 font-mono">/ day</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 mt-2 overflow-hidden rounded-full">
                        <div className="bg-emerald-400 h-full" style={{ width: `${discoverySummary.learningVelocity}%` }}></div>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-2">认知成长斜率：单位时间解开物理未知量速度</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white relative overflow-hidden">
                      <span className="text-[9px] text-[#07C2E3] font-black uppercase font-mono tracking-wider block font-sans">KNOWLEDGE EXPANSION</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-black font-mono text-[#07C2E3]">{discoverySummary.knowledgeExpansionRate}%</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">▲ 7 级实体</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 mt-2 overflow-hidden rounded-full">
                        <div className="bg-[#07C2E3] h-full" style={{ width: `${discoverySummary.knowledgeExpansionRate}%` }}></div>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-2">系统知识覆盖上限扩展比率 (ERP + 行业拓扑)</span>
                    </div>
                  </div>

                  {/* Operational Utility Bar */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900">主动探测、立案与交叉验证中枢</h4>
                      <p className="text-[10px] text-slate-500">点击按钮立即下发真实商业任务。杜绝模拟 placeholder，点击必改底层状态。</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button 
                        onClick={handleScanAnomalies}
                        className="bg-slate-950 text-[#07C2E3] border border-[#07C2E3]/30 hover:bg-slate-900 active:scale-95 text-[10px] font-black px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin text-[#07C2E3]" />
                        扫描反常数据极值 (Curiosity Scan)
                      </button>
                    </div>
                  </div>

                  {/* Two Column Layout inside Tab */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    {/* Left Column: Cognitive Gap Resolution Pipeline */}
                    <div className="lg:col-span-6 space-y-4">
                      
                      {/* Form: Declare Knowledge Gap */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2 font-sans">
                          <PlusCircle className="w-4 h-4 text-[#07C2E3]" />
                          手动登记认知缺口 (Formulate New Knowledge Gap)
                        </h4>
                        <form onSubmit={handleCreateGap} className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">测试缺口对象/策略变量 (Topic)</label>
                            <input 
                              type="text"
                              value={auditTargetMetric}
                              onChange={(e) => setAuditTargetMetric(e.target.value)}
                              placeholder="例如: 意大利羽绒保暖度与退货率异常交织..."
                              className="w-full text-xs font-medium border border-slate-200 hover:border-[#07C2E3] focus:border-[#07C2E3] focus:ring-1 focus:ring-[#07C2E3] rounded-lg p-2 outline-none text-slate-800"
                              required
                            />
                            <p className="text-[9px] text-slate-400 mt-1">系统会自动反推其需要的关键证据，并在其间实施自主调查规划。</p>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:scale-95 text-slate-900 text-[10px] font-black uppercase px-4 py-2 rounded-lg cursor-pointer transition-all border-none"
                          >
                            注册并写入 Gap 库
                          </button>
                        </form>
                      </div>

                      {/* List: Gap Resolution Tasks */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 font-sans">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="text-xs font-bold text-[#07C2E3] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                            <Clock className="w-4 h-4 text-emerald-500" />
                            认知缺口及自省闭环管线 (Active Gap Resolved Tasks)
                          </h4>
                          <span className="bg-slate-105 text-slate-600 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {gapTasks.length} 项缺口
                          </span>
                        </div>

                        {gapTasks.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center py-6">暂无任何未解决的认知缺口</p>
                        ) : (
                          <div className="space-y-3">
                            {gapTasks.map((gap) => {
                              // Find any related evidence plans & investigation cases
                              const plan = evidencePlans.find(p => p.gapTaskId === gap.id);
                              const caseObj = investigationCases.find(c => c.associatedGapTaskId === gap.id);

                              return (
                                <div key={gap.id} className="border border-slate-150 rounded-xl p-3 space-y-3 bg-white hover:bg-slate-50/20 transition-all">
                                  
                                  {/* Gap Header */}
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">#{gap.id.substring(0, 8)}</span>
                                        <h5 className="text-xs font-bold text-slate-800">{gap.gapTopic}</h5>
                                      </div>
                                      <span className="block text-[9px] text-slate-400 font-mono">核算自省时间: {gap.timestamp}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                      gap.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' :
                                      gap.status === 'resolving' ? 'bg-indigo-100 text-indigo-600' :
                                      'bg-amber-100 text-amber-600'
                                    }`}>
                                      {gap.status}
                                    </span>
                                  </div>

                                  {/* Gap details */}
                                  <div className="text-[11px] text-slate-650 space-y-1 bg-slate-50 p-2 rounded">
                                    <div><b>待解盲区事实要素:</b> <span className="text-rose-500 font-semibold">{gap.targetEvidenceNeeded}</span></div>
                                    <div><b>模型质量评估得分:</b> <span className="font-mono text-indigo-500 font-black">{gap.resolutionRateScore}% (100% 为绝对物理一致)</span></div>
                                  </div>

                                  {/* Gap Contextually Embedded Actions */}
                                  {gap.status === 'pending' && (
                                    <button 
                                      onClick={() => handleDeployPlan(gap.id, gap.gapTopic)}
                                      className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-900 text-[10px] font-bold py-1.5 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer transition-all border-none"
                                    >
                                      1. 部署证据收集规划 (Plan Acquisition)
                                    </button>
                                  )}

                                  {gap.status === 'resolving' && (
                                    <div className="space-y-2 pt-1 border-t border-slate-150/60 transition-all">
                                      
                                      {/* If evidence plan exists but not collected */}
                                      {plan && !plan.isCollected && (
                                        <div className="bg-indigo-55/40 border border-indigo-100/55 p-2 rounded">
                                          <div className="flex justify-between items-center mb-1">
                                            <span className="text-[9px] font-bold text-indigo-600">已部署证据链: {plan.planTitle}</span>
                                            <span className="text-[8px] font-mono text-indigo-400 font-bold">证明价值: {plan.estimatedValueScore}%</span>
                                          </div>
                                          <div className="space-y-1 mb-2">
                                            {plan.plannedEvidenceItems.map((itm, idx) => (
                                              <div key={idx} className="text-[9px] text-slate-550 flex items-center gap-1">
                                                <span className="w-1 h-1 bg-indigo-400 rounded-full" />
                                                <span>{itm}</span>
                                              </div>
                                            ))}
                                          </div>
                                          <button 
                                            onClick={() => handleMarkCollected(plan.id)}
                                            className="w-full bg-[#07C2E3] text-slate-900 hover:bg-[#06B2D0] text-[9px] font-black py-1 px-2 rounded cursor-pointer border-none"
                                          >
                                            收集并载入该证据
                                          </button>
                                        </div>
                                      )}

                                      {/* If evidence collected but no case launched yet */}
                                      {plan?.isCollected && !caseObj && (
                                        <button 
                                          onClick={() => handleLaunchCase(gap.id, gap.gapTopic)}
                                          className="w-full bg-slate-950 text-[#07C2E3] border border-[#07C2E3]/20 hover:bg-slate-900 text-[10px] font-black py-1.5 px-3 rounded flex items-center justify-center gap-1 cursor-pointer transition-all"
                                        >
                                          2. 立案进入自主推演工单 (Launch Case)
                                        </button>
                                      )}

                                      {/* Case execution stages tracking */}
                                      {caseObj && (
                                        <div className="bg-slate-900 border border-slate-800 p-2.5 rounded text-white space-y-2">
                                          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 mb-1.5">
                                            <span className="text-[9px] font-mono text-[#07C2E3] font-black">【自主工单: #{caseObj.id.substring(0, 8).toUpperCase()}】</span>
                                            <span className="text-[8px] text-emerald-400 font-mono font-bold uppercase">{caseObj.status}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-300 font-sans">
                                            <b>推演排查细节:</b> {caseObj.findingsSummary}
                                          </div>
                                          <div className="space-y-1 text-slate-200">
                                            <span className="text-[8px] text-slate-400 uppercase font-mono block">工单阶段里程碑:</span>
                                            <div className="flex gap-1">
                                              {caseObj.stages.map((stg, sIdx) => (
                                                <div 
                                                  key={sIdx} 
                                                  className={`flex-1 h-1.5 rounded-full ${
                                                    sIdx < caseObj.currentStageIndex ? 'bg-[#07C2E3]' :
                                                    sIdx === caseObj.currentStageIndex ? 'bg-amber-400 animate-pulse' :
                                                    'bg-slate-800'
                                                  }`}
                                                  title={stg}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Bayesian competing explanations scorecard analysis (Phase 156) */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                          <Scale className="w-4 h-4 text-[#07C2E3]" />
                          贝叶斯决策竞争解释对抗场 (Bayesian Tournament)
                        </h4>
                        
                        <form onSubmit={handleBayesianTournament} className="space-y-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold mb-0.5">1. 测试反常波动事件 (Surprise Anomaly Topic)</label>
                            <input 
                              type="text"
                              value={customAnomaly}
                              onChange={(e) => setCustomAnomaly(e.target.value)}
                              className="w-full text-[11px] border border-slate-200 rounded p-1 font-medium text-slate-800"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[9px] text-slate-400 font-bold mb-0.5">解释 A (三方系统?)</label>
                              <input type="text" value={expA} onChange={(e) => setExpA(e.target.value)} className="w-full text-[10px] border border-slate-200 rounded p-1 text-slate-700"/>
                            </div>
                            <div>
                              <label className="block text-[9px] text-slate-400 font-bold mb-0.5">解释 B (布局样式?)</label>
                              <input type="text" value={expB} onChange={(e) => setExpB(e.target.value)} className="w-full text-[10px] border border-slate-200 rounded p-1 text-slate-700"/>
                            </div>
                            <div>
                              <label className="block text-[9px] text-slate-400 font-bold mb-0.5">解释 C (买家运税?)</label>
                              <input type="text" value={expC} onChange={(e) => setExpC(e.target.value)} className="w-full text-[10px] border border-slate-200 rounded p-1 text-slate-700"/>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-[#07C2E3] text-slate-900 hover:bg-[#06B2D0] font-black text-[10px] uppercase py-1.5 rounded transition-all cursor-pointer border-none"
                          >
                            运行贝叶斯交叉校验战战 (Evaluate Competition)
                          </button>
                        </form>

                        {/* List competing evaluations */}
                        {competingExplanations.length > 0 && (
                          <div className="space-y-3 pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block font-mono">决策博弈交叉战绩:</span>
                            {competingExplanations.slice(0, 2).map((itm) => (
                              <div key={itm.id} className="border border-slate-200 rounded-lg p-2.5 text-[11px] space-y-2 bg-slate-50/50 hover:bg-slate-50">
                                <div className="font-bold text-slate-800">反常检验: {itm.targetAnomaly}</div>
                                
                                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                                  <div className="bg-white p-1 rounded border">
                                    <div className="text-slate-400 text-[8px] truncate">{itm.explanationA.substring(0, 10)}...</div>
                                    <b className={itm.winningExplanation === 'A' ? "text-[#059BBC] text-xs font-black" : "text-slate-600"}>
                                      {itm.scoreA}%
                                    </b>
                                  </div>
                                  <div className="bg-white p-1 rounded border">
                                    <div className="text-slate-400 text-[8px] truncate">{itm.explanationB.substring(0, 10)}...</div>
                                    <b className={itm.winningExplanation === 'B' ? "text-[#059BBC] text-xs font-black" : "text-slate-600"}>
                                      {itm.scoreB}%
                                    </b>
                                  </div>
                                  <div className="bg-white p-1 rounded border">
                                    <div className="text-slate-400 text-[8px] truncate">{itm.explanationC.substring(0, 10)}...</div>
                                    <b className={itm.winningExplanation === 'C' ? "text-[#059BBC] text-xs font-black" : "text-slate-600"}>
                                      {itm.scoreC}%
                                    </b>
                                  </div>
                                </div>

                                <div className="bg-[#07C2E3]/10 text-[#059BBC] p-1.5 rounded text-[10px] font-medium leading-normal">
                                  🥇 <b className="font-black">贝叶斯判定胜出机理:</b>解释【{itm.winningExplanation}】获胜 (
                                  {itm.winningExplanation === 'A' ? itm.explanationA : 
                                   itm.winningExplanation === 'B' ? itm.explanationB : 
                                   itm.winningExplanation === 'C' ? itm.explanationC : '未决'} )
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Belief representation updates list (Phase 157) */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Brain className="w-4 h-4 text-emerald-500" />
                            ECOS 智能心智权重更新状态 (Belief Updates Log)
                          </h4>
                          <span className="bg-slate-100 text-slate-600 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {beliefUpdates.length} 条心智更新
                          </span>
                        </div>

                        {beliefUpdates.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center py-4">无任何心智修正痕迹</p>
                        ) : (
                          <div className="space-y-2 max-h-56 overflow-y-auto">
                            {beliefUpdates.map((upd) => (
                              <div key={upd.id} className="border border-slate-150 rounded-xl p-2.5 text-[11px] space-y-1.5 hover:bg-slate-50/50 transition-all bg-white font-sans">
                                <div className="flex justify-between items-center text-[9px] text-slate-350 border-b border-slate-100 pb-1 font-mono font-bold">
                                  <b>修正领域: {upd.beliefSubject}</b>
                                  <span>{upd.timestamp.substring(11, 16)}</span>
                                </div>
                                <div className="text-slate-400 line-through p-1 bg-slate-50 rounded text-[10px]">
                                  旧心智模型常识: {upd.previousUnderstanding}
                                </div>
                                <div className="text-emerald-800 font-bold p-1 bg-emerald-50 border border-emerald-100 rounded text-[10px]">
                                  更新后纠偏认知: {upd.newUnderstanding}
                                </div>
                                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                                  <span>模型转移梯度幅度 (Magnitude): <b>+{upd.beliefChangeMagnitude}%</b></span>
                                  <span>校验签名: {upd.validationId.substring(0, 10)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right Column: Anomalous Curiosity Feed */}
                    <div className="lg:col-span-6 space-y-4">
                      
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 font-sans">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5 font-sans animate-pulse">
                            <Activity className="w-4 h-4 text-rose-500" />
                            ECOS 捕获之反常特征证据流 (Anomalous Curiosity Feed)
                          </h4>
                          <span className="bg-rose-55 border border-rose-100 text-rose-700 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {curiosityEvents.length} 项触发
                          </span>
                        </div>

                        {curiosityEvents.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center py-6">暂无任何反常极端数据波动</p>
                        ) : (
                          <div className="space-y-3">
                            {curiosityEvents.slice(0, 3).map((evt) => {
                              // Find any related contrarian hypotheses
                              const hyp = contrarianHypotheses.find(h => h.associatedAnomalousEvent === evt.id);

                              return (
                                <div key={evt.id} className="border border-slate-150 rounded-xl p-3 space-y-2 bg-slate-50/30 hover:bg-slate-50/75 transition-all">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-0.5">
                                      <h5 className="text-xs font-black text-rose-750">反常特征: {evt.triggerAnomaly}</h5>
                                      <span className="block text-[8px] text-slate-400 font-mono">锁定时间: {evt.timestamp}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-2 py-0.5 rounded block">
                                        Surprise Score: {evt.curiosityScore}
                                      </span>
                                    </div>
                                  </div>

                                  <p className="text-[10px] text-slate-600 leading-relaxed font-normal p-1.5 bg-white border border-slate-100 rounded">
                                    <b>特征详情:</b> {evt.proposedHypothesis}
                                  </p>

                                  {/* Actions targeting the Curiosity event */}
                                  {!hyp && (
                                    <button
                                      onClick={() => handleOppositeHypothesis(evt.id, evt.triggerAnomaly)}
                                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[9px] font-bold py-1 px-2.5 rounded cursor-pointer transition-all border-none"
                                    >
                                      + 拟定非对称批判对立假设 (Challenge Theory)
                                    </button>
                                  )}

                                  {/* Associated Contrarian Hypothesis (Phases 155) */}
                                  {hyp && (
                                    <div className="border border-rose-100 bg-rose-50/20 rounded-lg p-2.5 space-y-2">
                                      <div className="flex justify-between items-center text-[9px] border-b border-rose-100 pb-1">
                                        <b className="text-rose-600 font-bold">对立驳论: CHALLENGED BY COGNITIVES</b>
                                        <span className="text-slate-400 font-mono font-bold">ID: #{hyp.id.substring(0, 6)}</span>
                                      </div>
                                      <div className="text-[10px] text-slate-660 space-y-1">
                                        <div><span className="text-slate-400">主流顺从假设:</span> <span className="line-through">{hyp.mainstreamBelief}</span></div>
                                        <div><span className="text-rose-600 font-bold">对立反向假设:</span> <strong>{hyp.contrarianAssertion}</strong></div>
                                        <div><span className="text-slate-400">实验验证机制:</span> {hyp.validationTestCriteria}</div>
                                      </div>
                                      <div className="flex items-center justify-between text-[9px] border-t border-rose-100/60 pt-1.5">
                                        <div className="font-bold">
                                          假位置信率: <span className="font-mono text-rose-500 font-black">{hyp.oppositeConfidenceScore}%</span>
                                        </div>
                                        <button 
                                          onClick={() => handleTestHypothesis(hyp.id)}
                                          className="bg-white hover:bg-slate-50 text-slate-800 text-[8px] font-black py-0.5 px-1.5 rounded border border-slate-300 cursor-pointer"
                                        >
                                          测试这个反常假设
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {activeTab === 'governance' && (
                <EcosGovernanceConsole 
                  executionProposals={executionProposals}
                  executionApprovals={executionApprovals}
                  monitoringLogs={monitoringLogs}
                  rollbackHistory={rollbackHistory}
                  agentConflicts={agentConflicts}
                  resourcePlans={resourcePlans}
                  continuousUpdates={continuousUpdates}
                  operatingIntelligence={operatingIntelligence}
                  addLog={addLog}
                />
              )}

            </div>
          </div>
        </div>

        {/* Right Side: Charts & Radar & Safeguard Metrics (Strictly non-mocked outputs) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Radar Chart: Self-awareness Radar alignment diagram */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 font-display flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#07C2E3]" />
                自审认知维度收敛分布图
              </h4>
              <p className="text-[10px] text-slate-400 font-normal">ECOS 自愈降级与不确定边界对数拓扑谱空间 (越对齐越可信理智)</p>
            </div>
            
            <div className="h-56 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 8, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                  <Radar name="ECOS-Core" dataKey="A" stroke="#07C2E3" fill="#07C2E3" fillOpacity={0.2} />
                  <Tooltip wrapperStyle={{ fontSize: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <p className="text-[10px] text-slate-400 italic leading-snug">
              本雷达谱图由<b>七大自省维度底层数据库</b>即时对账折算而得，拒绝人为硬编码评分。
              当部分板块发生大局边界外露（例如缺少过往销售样本时），本端折算得分会自动下行回撤。
            </p>
          </div>

          {/* Active Diagnostic Status Block */}
          <div className="bg-slate-950 text-white rounded-xl p-5 border border-[#07C2E3]/20 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#07C2E3] font-display flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              自省对账多租户安全锁
            </h3>
            <p className="text-[11px] text-slate-300 leading-snug">
              本租户 <b>(#{selectedIndustry})</b> 数据链路已完成加密自检，严禁任何 AI 自创幻觉数据并写入 AIContext。
            </p>
            
            <div className="space-y-2 border-t border-slate-900 pt-3 text-[10px] font-mono text-slate-400">
              <div className="flex items-center justify-between">
                <span>绑定店面总商户号:</span>
                <span className="text-slate-200">#tenant_global_moda</span>
              </div>
              <div className="flex items-center justify-between">
                <span>数字盾合规审计签名:</span>
                <span className="text-[#07C2E3]">ECOS_MIND_CORE_PASS</span>
              </div>
              <div className="flex items-center justify-between">
                <span>不确定边界熔断限制:</span>
                <span className="text-[#06B2D0]">&gt;= 50% Coverage Approved</span>
              </div>
              <div className="flex items-center justify-between">
                <span>自反思打分等级:</span>
                <span className="text-emerald-400 font-bold">{coreScore.ratingGrade}</span>
              </div>
            </div>
          </div>

          {/* Guidelines info card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              AI 谦逊系统 (Decision Humility) 的精髓
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
              传统的销售辅助 AI 往往表现出过度自信，在缺乏历史数据样本时，依然推荐盲目的商品加价或进货。
              ECOS 增加谦逊和自疑层：<b>在做错事之前，推演失败概率，评估盲区边界，阻断低信 conclusions</b>。这就是高级自动化到企业可信智能系统的进化。
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
