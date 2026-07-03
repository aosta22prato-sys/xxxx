/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Brain, 
  Layers, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Trash2, 
  Plus, 
  Play, 
  Fingerprint, 
  Flame, 
  Scale, 
  Compass, 
  Cpu, 
  HelpCircle,
  FileCheck,
  Users,
  TrendingUp,
  Globe,
  Coins,
  DollarSign,
  Award,
  Check
} from 'lucide-react';
import { dbEngine } from '../../../db/dbEngine';
import { 
  CognitiveConflict, 
  EvidenceHierarchyItem, 
  ReasoningReliability, 
  ConfidenceCalibration, 
  CognitiveLoadMetric, 
  CognitiveAuditReplay, 
  GovernanceDriftLog 
} from '../../../types';

export default function EcosCognitiveGovernance() {
  const tenantId = 'tenant_global_moda';

  // Subscribed State variables bound to dbEngine
  const [conflicts, setConflicts] = useState<CognitiveConflict[]>([]);
  const [evidence, setEvidence] = useState<EvidenceHierarchyItem[]>([]);
  const [reliabilityList, setReliabilityList] = useState<ReasoningReliability[]>([]);
  const [calibrations, setCalibrations] = useState<ConfidenceCalibration[]>([]);
  const [loadMetrics, setLoadMetrics] = useState<CognitiveLoadMetric[]>([]);
  const [audits, setAudits] = useState<CognitiveAuditReplay[]>([]);
  const [driftLogs, setDriftLogs] = useState<GovernanceDriftLog[]>([]);

  // Simulation Form states
  const [selectedConflictId, setSelectedConflictId] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<'evidence_priority' | 'consensus_voting' | 'conservative_fallback'>('evidence_priority');
  
  // Fact Injection Form
  const [injectSourceName, setInjectSourceName] = useState('');
  const [injectGrade, setInjectGrade] = useState<'L1_REAL_TRANSACTIONS' | 'L2_HISTORIC_METRICS' | 'L3_INDUSTRY_STATS' | 'L4_HYPOTHETICAL_LOGIC'>('L1_REAL_TRANSACTIONS');
  const [injectKey, setInjectKey] = useState('');
  const [injectValue, setInjectValue] = useState('');
  const [injectScore, setInjectScore] = useState<number>(95);

  // Supreme Calibration Form
  const [proposalTitle, setProposalTitle] = useState('Market Expansion via Cotton Futures Pre-purchase');
  const [rawConfidenceInput, setRawConfidenceInput] = useState<number>(95);
  // Rule checks
  const [q1, setQ1] = useState('High production margins verified of Shopify Ledger for DACH eco-luxury coats');
  const [q2, setQ2] = useState('Cross-compared against L1 actual transactional order history ledger');
  const [q3, setQ3] = useState('99% reliable transactional history verified with 0 unresolved loops');
  const [q4, setQ4] = useState('Immediate 30% cotton transport delay increase in Alpine supply corridor');
  const [q5, setQ5] = useState('L1 transaction drop-off below 1,200 orders quarterly across western Europe');

  const [activeTabSection, setActiveTabSection] = useState<'overview' | 'conflict' | 'evidence' | 'calibration' | 'load_audit' | 'tenant_intelligence'>('tenant_intelligence');
  const [pruningStatus, setPruningStatus] = useState<string>('');
  const [reconstructedAuditText, setReconstructedAuditText] = useState<string[]>([]);
  const [reconstructedAuditId, setReconstructedAuditId] = useState<string>('');
  
  // Feedback action logs
  const [localFeedback, setLocalFeedback] = useState<string>('');

  // ==================== TENANT OPERATING INTELLIGENCE CENTER STATES ====================
  const [operatingTenants, setOperatingTenants] = useState([
    { id: 'Milan Clothing', name: 'Milan Fashion Retail Group', industry: '服装系统', mrr: 12000, growth: -14.5, churnRisk: 'Critical', loginFreq: '0次/7天', aiUsage: 12, campaigns: 0, GMVChange: -25.0, tickets: 9, healthScore: 18, country: '意大利', manager: 'CS Team A' },
    { id: 'Gourmet Paris', name: 'Le Gourmet Parisien Bistro', industry: '餐饮系统', mrr: 4500, growth: -8.2, churnRisk: 'High', loginFreq: '1次/7天', aiUsage: 35, campaigns: 1, GMVChange: -12.4, tickets: 4, healthScore: 35, country: '法国', manager: 'AI Agent CS-1' },
    { id: 'Beauty Berlin', name: 'Berlin Aesthetic Cosmetology', industry: '美容院系统', mrr: 6800, growth: 4.8, churnRisk: 'Low', loginFreq: '12次/7天', aiUsage: 88, campaigns: 8, GMVChange: 15.2, tickets: 1, healthScore: 92, country: '德国', manager: 'CS Team B' },
    { id: 'Direct Retail Amsterdam', name: 'Amsterdam Daily Goods Supply', industry: '零售系统', mrr: 8500, growth: -2.1, churnRisk: 'Medium', loginFreq: '4次/7天', aiUsage: 55, campaigns: 3, GMVChange: -4.5, tickets: 3, healthScore: 61, country: '荷兰', manager: 'AI Agent CS-2' },
    { id: 'Barcelona Tapas', name: 'Barcelona Tapas & Wine Bar Group', industry: '餐饮系统', mrr: 9200, growth: -18.9, churnRisk: 'Critical', loginFreq: '0次/7天', aiUsage: 8, campaigns: 0, GMVChange: -34.2, tickets: 11, healthScore: 22, country: '西班牙', manager: 'CS Team A' },
    { id: 'London Boutique', name: 'London Eco Threads wholesale', industry: '服装系统', mrr: 15500, growth: 12.4, churnRisk: 'Low', loginFreq: '24次/7天', aiUsage: 94, campaigns: 14, GMVChange: 28.9, tickets: 0, healthScore: 97, country: '英国', manager: 'CS Team C' }
  ]);

  const [operationalMissions, setOperationalMissions] = useState([
    { id: 'MIS-101', tenant: 'Milan Fashion Retail Group', triggerReason: '7天未登录 & GMV暴跌25%', type: '免费咨询 + AI 托管方案', assignedTo: 'CS Team A & AI Agent', status: 'WAITING_DEPLOY', createdAt: '2026-06-10 14:02' },
    { id: 'MIS-102', tenant: 'Barcelona Tapas & Wine Bar Group', triggerReason: '11个工单未处理 & Churn Risk: Critical', type: '紧急高危特惠续费+免单券', assignedTo: 'CS Team B', status: 'WAITING_DEPLOY', createdAt: '2026-06-10 16:45' },
    { id: 'MIS-103', tenant: 'Le Gourmet Parisien Bistro', triggerReason: 'AI 使用率仅 35%', type: '免费 1对1 专家功能培训', assignedTo: 'AI CS-1 Agent', status: 'DEPLOYED', createdAt: '2026-06-09 11:30' }
  ]);

  const [recoveredRevenue, setRecoveredRevenue] = useState(5300);
  const [selectedHealthTenant, setSelectedHealthTenant] = useState<any>(null);

  const sortedOperationalTenants = React.useMemo(() => {
    return [...operatingTenants].sort((a, b) => a.healthScore - b.healthScore);
  }, [operatingTenants]);

  const totalMOPER = React.useMemo(() => {
    return operatingTenants.reduce((sum, t) => sum + t.mrr, 0);
  }, [operatingTenants]);

  const calculatedARR = React.useMemo(() => {
    return totalMOPER * 12;
  }, [totalMOPER]);

  const calculatedAtRiskRevenue = React.useMemo(() => {
    return operatingTenants
      .filter(t => t.churnRisk === 'Critical' || t.churnRisk === 'High')
      .reduce((sum, t) => sum + t.mrr, 0);
  }, [operatingTenants]);

  const handleSelectOperationalTenant = (tenant: any) => {
    setSelectedHealthTenant(tenant);
  };

  const triggerRecalculateRisk = (tenantId: string, scoreAdjustment: number) => {
    setOperatingTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        let newScore = Math.min(100, Math.max(0, t.healthScore + scoreAdjustment));
        let newRisk = 'Critical';
        if (newScore >= 80) newRisk = 'Low';
        else if (newScore >= 55) newRisk = 'Medium';
        else if (newScore >= 35) newRisk = 'High';
        
        let updatedUsage = t.aiUsage;
        if (scoreAdjustment > 0) {
          updatedUsage = Math.min(100, t.aiUsage + 12);
        }

        const updated = {
          ...t,
          healthScore: newScore,
          churnRisk: newRisk,
          aiUsage: updatedUsage,
          loginFreq: scoreAdjustment > 0 ? '15次/7天' : '0次/7天',
          tickets: scoreAdjustment > 0 ? Math.max(0, t.tickets - 1) : t.tickets
        };
        
        if (selectedHealthTenant && selectedHealthTenant.id === tenantId) {
          setSelectedHealthTenant(updated);
        }
        return updated;
      }
      return t;
    }));
    
    dbEngine.cognitive_governance.createEvidence({
      tenantId,
      sourceName: 'Churn Prevention Auditor',
      grade: 'L2_HISTORIC_METRICS',
      evidenceData: { scoreDelta: String(scoreAdjustment), newRiskForecast: scoreAdjustment > 0 ? 'Decreased Churn' : 'Escalated warning' },
      lastVerified: new Date().toISOString(),
      reliabilityScore: 92
    });

    setLocalFeedback(`[Calculated OK] Recalculated Churn Model for ${tenantId}! Shifting score by ${scoreAdjustment} PTS.`);
    setTimeout(() => setLocalFeedback(''), 5000);
  };

  const executeRecoveryPlaybook = (tenantName: string, playbookTitle: string, playbookCode: string) => {
    const foundTenant = operatingTenants.find(t => t.name === tenantName || t.id === tenantName);
    if (!foundTenant) {
      alert('未选中高危租户！请在健康矩阵中调阅欲挽修商户。');
      return;
    }

    if (foundTenant.churnRisk === 'Low' || foundTenant.churnRisk === 'Medium') {
      alert(`租户「${foundTenant.name}」已被健康保全，无需重复执行。`);
      return;
    }

    setOperatingTenants(prev => prev.map(t => {
      if (t.id === foundTenant.id) {
        const updated = {
          ...t,
          churnRisk: 'Low',
          healthScore: 88,
          aiUsage: Math.max(t.aiUsage, 85),
          loginFreq: '18次/7天',
          GMVChange: Math.max(t.GMVChange, 2.5),
          tickets: 0
        };
        if (selectedHealthTenant && selectedHealthTenant.id === t.id) {
          setSelectedHealthTenant(updated);
        }
        return updated;
      }
      return t;
    }));

    setRecoveredRevenue(prev => prev + foundTenant.mrr);

    setOperationalMissions(prev => {
      const exists = prev.some(m => m.tenant === foundTenant.name);
      if (exists) {
        return prev.map(m => m.tenant === foundTenant.name ? { ...m, status: 'DEPLOYED' } : m);
      } else {
        return [
          {
            id: `MIS-${Math.floor(100 + Math.random() * 900)}`,
            tenant: foundTenant.name,
            triggerReason: `手动触发: ${playbookCode}`,
            type: playbookTitle,
            assignedTo: 'AI CS-1 & Staff',
            status: 'DEPLOYED',
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          },
          ...prev
        ];
      }
    });

    dbEngine.cognitive_governance.createEvidence({
      tenantId: foundTenant.id,
      sourceName: 'Playbook Governor',
      grade: 'L1_REAL_TRANSACTIONS',
      evidenceData: { executedPlaybook: playbookCode, recoveredMrrProtect: String(foundTenant.mrr) },
      lastVerified: new Date().toISOString(),
      reliabilityScore: 99
    });

    setLocalFeedback(`[Playbook Executed] Unified Playbook "${playbookTitle}" deployed! MRR protected: +$${foundTenant.mrr.toLocaleString()}!`);
    setTimeout(() => setLocalFeedback(''), 5000);
  };

  const dispatchSuccessMission = (missionId: string, triggerType: string) => {
    let targetTenantName = '';
    
    setOperationalMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        targetTenantName = m.tenant;
        return { ...m, status: 'DEPLOYED', assignedTo: triggerType === 'AI_AUTO' ? 'AI Agent CS-Auto' : 'CS Senior Rep' };
      }
      return m;
    }));

    if (targetTenantName) {
      const foundTenant = operatingTenants.find(t => t.name === targetTenantName);
      if (foundTenant && (foundTenant.churnRisk === 'Critical' || foundTenant.churnRisk === 'High')) {
        setOperatingTenants(prev => prev.map(t => {
          if (t.id === foundTenant.id) {
            const updated = {
              ...t,
              churnRisk: 'Medium',
              healthScore: 70,
              aiUsage: Math.max(t.aiUsage, 65),
              loginFreq: '8次/7天',
              tickets: Math.max(0, t.tickets - 3)
            };
            if (selectedHealthTenant && selectedHealthTenant.id === t.id) {
              setSelectedHealthTenant(updated);
            }
            return updated;
          }
          return t;
        }));
        
        setRecoveredRevenue(prev => prev + Math.round(foundTenant.mrr * 0.8));
      }
    }

    setLocalFeedback(`[Mission Dispatched] Success Mission ${missionId} has been designated and executed.`);
    setTimeout(() => setLocalFeedback(''), 5000);
  };

  const auditRevenueRisk = () => {
    const totalRiskWeightLst = operatingTenants
      .filter(t => t.churnRisk === 'Critical' || t.churnRisk === 'High')
      .reduce((sum, t) => sum + t.mrr, 0) * 12;

    alert(`[财资风险精算对账完成]\n全网正在运行的年化高流失风险总额 (At-Risk ARR) 为: $${totalRiskWeightLst.toLocaleString()} USD。\n\n系统已经自动触发了平台保障机制。`);
  };

  const batchMitigateRisk = () => {
    const highRiskTenants = operatingTenants.filter(t => t.churnRisk === 'Critical' || t.churnRisk === 'High');
    if (highRiskTenants.length === 0) {
      alert('所有商家均处于健康稳定或中度活跃状态。平台当前流失风险对冲已满载！');
      return;
    }

    let batchRecoveredTotal = 0;
    setOperatingTenants(prev => prev.map(t => {
      if (t.churnRisk === 'Critical' || t.churnRisk === 'High') {
        batchRecoveredTotal += t.mrr;
        return {
          ...t,
          churnRisk: 'Low',
          healthScore: 82,
          aiUsage: Math.max(t.aiUsage, 80),
          loginFreq: '14次/7天',
          GMVChange: 1.2,
          tickets: 0
        };
      }
      return t;
    }));

    setRecoveredRevenue(prev => prev + batchRecoveredTotal);
    setOperationalMissions(prev => prev.map(m => m.status === 'WAITING_DEPLOY' ? { ...m, status: 'DEPLOYED' } : m));

    if (selectedHealthTenant) {
      setSelectedHealthTenant({
        ...selectedHealthTenant,
        churnRisk: 'Low',
        healthScore: 82,
        aiUsage: 80,
        loginFreq: '14次/7天',
        GMVChange: 1.2,
        tickets: 0
      });
    }

    setLocalFeedback(`[Batch Mitigate OK] Recovered ${highRiskTenants.length} high-risk tenants instantly! secured MRR: +$${batchRecoveredTotal.toLocaleString()} USD!`);
    setTimeout(() => setLocalFeedback(''), 5000);
  };

  // Setup reactive db subscriber
  useEffect(() => {
    const syncDatabaseState = () => {
      setConflicts(dbEngine.cognitive_governance.getConflicts(tenantId));
      setEvidence(dbEngine.cognitive_governance.getEvidence(tenantId));
      setReliabilityList(dbEngine.cognitive_governance.getReliability(tenantId));
      setCalibrations(dbEngine.cognitive_governance.getCalibrations(tenantId));
      setLoadMetrics(dbEngine.cognitive_governance.getLoadMetrics(tenantId));
      setAudits(dbEngine.cognitive_governance.getAudits(tenantId));
      setDriftLogs(dbEngine.cognitive_governance.getDriftLogs(tenantId));
    };

    syncDatabaseState();
    const unsub = dbEngine.subscribe('all', syncDatabaseState);
    return () => unsub();
  }, []);

  // Set default form conflict selection if available
  useEffect(() => {
    const activeOne = conflicts.find(c => c.status === 'active');
    if (activeOne) {
      setSelectedConflictId(activeOne.id);
    } else if (conflicts.length > 0) {
      setSelectedConflictId(conflicts[0].id);
    }
  }, [conflicts]);

  // Calculations for Phase 182 KPIs
  const activeConflictsCount = conflicts.filter(c => c.status === 'active').length;
  // CTI Index Formula: consensus score weighted with reliability and integrity
  const consensusScore = dbEngine.cognitive_governance.calculateConsensusScore(tenantId);
  const averageReliability = reliabilityList.length > 0 
    ? Math.round(reliabilityList.reduce((acc, curr) => acc + curr.calculatedReliabilityScore, 0) / reliabilityList.length)
    : 85;
  const governanceDriftSummary = dbEngine.cognitive_governance.governGovernors(tenantId);
  const ruleIntegrity = governanceDriftSummary.ruleIntegrityPercent;

  const cognitiveTrustIndex = Math.min(100, Math.round(
    (consensusScore * 0.40) + (averageReliability * 0.40) + (ruleIntegrity * 0.20)
  ));

  // Triggers
  const handleDetectConflict = () => {
    const newItem = dbEngine.cognitive_governance.detectReasoningConflict(tenantId);
    setSelectedConflictId(newItem.id);
    setLocalFeedback(`[Spark OK] Detected a new cognitive misalignment between ${newItem.sourceEngines.join(' & ')}!`);
    setTimeout(() => setLocalFeedback(''), 5000);
  };

  const handleResolveConflict = () => {
    if (!selectedConflictId) {
      alert('No selected conflict to resolve. Try triggering conflict detection.');
      return;
    }
    const resolved = dbEngine.cognitive_governance.resolveReasoningConflict(selectedConflictId, selectedStrategy);
    setLocalFeedback(`[Resolved OK] Conflict has been successfully resolved via "${selectedStrategy}". Advice propagated to governors.`);
    setTimeout(() => setLocalFeedback(''), 5000);
  };

  const handleInjectEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!injectSourceName || !injectKey || !injectValue) {
      alert('Please fill out the fact source details.');
      return;
    }
    dbEngine.cognitive_governance.createEvidence({
      tenantId,
      sourceName: injectSourceName,
      grade: injectGrade,
      evidenceData: { [injectKey]: injectValue },
      lastVerified: new Date().toISOString(),
      reliabilityScore: Number(injectScore)
    });
    setLocalFeedback(`[Hierarchy OK] Sourced fact safely deposited into Grade ${injectGrade.split('_')[0]}!`);
    setInjectSourceName('');
    setInjectKey('');
    setInjectValue('');
    setTimeout(() => setLocalFeedback(''), 4000);
  };

  const handleCalibrateAction = () => {
    if (!q1 || !q2 || !q3 || !q4 || !q5) {
      alert('ECOS Supreme Cognitive Rule violation: All 5 constitutional grounding questions must have valid entries to calibrate!');
      return;
    }
    // Simulate creating a mock decision to calibrate
    const newDecision = dbEngine.executive_decisions.create({
      tenantId,
      title: proposalTitle,
      timestamp: new Date().toISOString(),
      boardroomRecommendation: `Grunding verified. What: ${q1} | How: ${q2} | Reliability: ${q3} | Hazard: ${q4} | Pivot Event: ${q5}`,
      confidenceLevel: rawConfidenceInput,
      votedApprovalRate: 90,
      status: 'dispatched_to_governance',
      expectedGain: 75,
      expectedRisk: 30,
      expectedTimeHorizon: '12 Months',
      strategicAlignment: 90,
      survivalImpact: 45
    });

    const calibration = dbEngine.cognitive_governance.calibrateConfidence(tenantId, newDecision.id, rawConfidenceInput);
    
    // Also track reasoning outcomes to train the reliability list
    const isSuccess = Math.abs(calibration.calibrationDelta) < 12;
    dbEngine.cognitive_governance.trackReasoningFailures(tenantId, 'Grounding Calibration Loop', isSuccess);

    setLocalFeedback(`[Calibration OK] Biases examined! Delta: ${calibration.calibrationDelta}%. Confidence calibrated to: ${calibration.calibratedConfidence}%`);
    setTimeout(() => setLocalFeedback(''), 6000);
  };

  const handlePruning = () => {
    setPruningStatus('Executing Cognitive GC... pruning inactive reasoning buffers');
    setTimeout(() => {
      const outcome = dbEngine.cognitive_governance.pruneLowValueReasoning(tenantId);
      setPruningStatus('');
      setLocalFeedback(`[GC OK] Reclaimed system resources! Pruned ${outcome.prunedCount} low-value branches. Saved operational credits.`);
      setTimeout(() => setLocalFeedback(''), 5000);
    }, 1200);
  };

  const handleMeasureLoad = () => {
    dbEngine.cognitive_governance.measureCognitiveLoad(tenantId);
    setLocalFeedback('[Load Measured] Successfully registered cognitive CPU & memory telemetry footprints.');
    setTimeout(() => setLocalFeedback(''), 3000);
  };

  const handleReplayDecision = (decisionId: string) => {
    const rep = dbEngine.cognitive_governance.replayDecision(tenantId, decisionId);
    setReconstructedAuditId(decisionId);
    const steps = dbEngine.cognitive_governance.reconstructReasoning(tenantId, decisionId);
    setReconstructedAuditText(steps);
    setLocalFeedback(`[Replay OK] Retrograde counterfactual reconstructed: "${rep.counterfactualOutcome}"`);
    setTimeout(() => setLocalFeedback(''), 5000);
  };

  const handleRegisterDrift = () => {
    const drift = dbEngine.cognitive_governance.detectGovernanceDrift(tenantId);
    setLocalFeedback(`[Meta Governance OK] Drifting detected! Variance: ${drift.varianceDetected}%. Aligning rules automatically.`);
    setTimeout(() => setLocalFeedback(''), 5000);
  };

  return (
    <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 min-h-[600px] font-sans" id="ecos-cognitive-governance-viewport">
      {/* 🛑 Header Information Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 border-b border-slate-200/60 pb-6 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-cyan-50 text-[#07C2E3] rounded-lg">
              <Brain className="w-6 h-6 animate-pulse" />
            </span>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center">
              ECOS Cognitive Governance Engine
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-slate-900 text-slate-50 uppercase tracking-widest rounded">
                Strategic Alpha
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Governing the algorithms, resolving conflicting advice, enforcing evidence grading hierarchy, tracking reasoning failures & prevent overconfidence bias.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleMeasureLoad} 
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-xs text-slate-700 font-medium select-none cursor-pointer hover:border-slate-300 active:bg-slate-100 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-[#07C2E3]" />
            <span>Measure Telemetry</span>
          </button>
          
          <button 
            onClick={handleRegisterDrift} 
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-medium select-none cursor-pointer active:bg-black transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#07C2E3]" />
            <span>Audit Meta Governance</span>
          </button>
        </div>
      </div>

      {localFeedback && (
        <div className="mb-4 p-3 bg-[#07C2E3]/10 border-l-4 border-[#07C2E3] text-slate-700 text-xs font-medium rounded-r-lg animate-fadeIn flex items-center justify-between" id="cognitive-alert-box">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#06B2D0]" />
            <span>{localFeedback}</span>
          </div>
          <button onClick={() => setLocalFeedback('')} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
        </div>
      )}

      {/* 📊 Section 1: Unified Cognitive Constitution KPIs (Phase 182) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6" id="cognitive-constitution-kpi-row">
        
        {/* KPI 1: Cognitive Trust Index */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center space-x-4">
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16">
              <circle className="text-slate-100" strokeWidth="5" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32" />
              <circle className="text-[#07C2E3] transition-all duration-500 ease-out" strokeWidth="5" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - cognitiveTrustIndex/100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32" />
            </svg>
            <span className="absolute text-sm font-bold text-slate-800">{cognitiveTrustIndex}%</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              Cognitive Trust Index (CTI)
            </h3>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{cognitiveTrustIndex >= 90 ? 'Supreme Trusted' : 'Stabilizing'}</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
              Combined score tracking alignment, verified evidence hierarchy, and resolved engine conflicts.
            </p>
          </div>
        </div>

        {/* KPI 2: Reasoning Reliability Score */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center space-x-4">
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16">
              <circle className="text-slate-100" strokeWidth="5" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32" />
              <circle className="text-[#06B2D0] transition-all duration-500 ease-out" strokeWidth="5" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - averageReliability/100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32" />
            </svg>
            <span className="absolute text-sm font-bold text-slate-800">{averageReliability}%</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Reasoning Reliability Score
            </h3>
            <p className="text-xl font-bold text-slate-800 mt-0.5">
              {averageReliability >= 80 ? 'Elite Precision' : 'Calibrating'}
            </p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
              Continuous feedback assessment of automated reasoning loops and logic loop checks.
            </p>
          </div>
        </div>

        {/* KPI 3: Governance Stability Score */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center space-x-4">
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16">
              <circle className="text-slate-100" strokeWidth="5" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32" />
              <circle className="text-[#059BBC] transition-all duration-500 ease-out" strokeWidth="5" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - ruleIntegrity/100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32" />
            </svg>
            <span className="absolute text-sm font-bold text-slate-800">{ruleIntegrity}%</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Governance Stability Score
            </h3>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{ruleIntegrity >= 95 ? 'Fully Aligned' : 'Slight Drift'}</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
              Constitutional variance checking. Currently tracking {governanceDriftSummary.governorsCalibrated} active drift audits.
            </p>
          </div>
        </div>

      </div>

      {/* 🗂️ Controls Section Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6 bg-slate-100/50 p-1 rounded-xl" id="cognitive-tabs">
        {[
          { id: 'tenant_intelligence', label: '💼 Tenant Operating Intelligence Center', icon: Users },
          { id: 'overview', label: '📊 System Overview', icon: Layers },
          { id: 'conflict', label: '⚔️ Conflict Resolution (P175)', icon: Scale },
          { id: 'evidence', label: '📁 Evidence Grading (P176)', icon: Fingerprint },
          { id: 'calibration', label: '🎯 Confidence Calibration (P177-178)', icon: FileCheck },
          { id: 'load_audit', label: '⚡ Resource & Replays (P179-181)', icon: Cpu }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabSection(tab.id as any)}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-all select-none cursor-pointer ${
                activeTabSection === tab.id
                  ? 'bg-white text-slate-800 shadow-xs border-b-2 border-b-[#07C2E3]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Area Content */}
      <div className="transition-all duration-300" id="cognitive-tab-content">

        {/* ==================== TENANT OPERATING INTELLIGENCE CENTER (PHASE 671-680) ==================== */}
        {activeTabSection === 'tenant_intelligence' && (
          <div className="space-y-6 animate-fadeIn" id="tenant-intelligence-dashboard">
            
            {/* 模块7: CEO 敏捷指挥板 (Executive Command Board) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-xs font-black text-[#07C2E3] uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#07C2E3]" />
                  <span>💼 CEO AGILITY EXECUTIVE BOARD (CEO 敏捷指挥板)</span>
                </span>
                <span className="font-mono text-[9px] text-slate-400">ARR/MRR LIFECYCLE PROTECTOR</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
                <div className="p-2 bg-black border border-slate-800 rounded-lg">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">本月新增 MRR</p>
                  <p className="text-sm font-extrabold text-emerald-400 mt-1 font-mono">+$8,500</p>
                </div>
                <div className="p-2 bg-black border border-slate-800 rounded-lg">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">本月流失 MRR</p>
                  <p className="text-sm font-extrabold text-rose-500 mt-1 font-mono">-$1,200</p>
                </div>
                <div className="p-2 bg-black border border-slate-800 rounded-lg">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">净增长 MRR</p>
                  <p className="text-sm font-extrabold text-[#07C2E3] mt-1 font-mono">+$7,300</p>
                </div>
                <div className="p-2 bg-black border border-slate-800 rounded-lg">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">高危租户数量</p>
                  <p className="text-sm font-extrabold text-orange-400 mt-1 font-mono">
                    {operatingTenants.filter(t => t.churnRisk === 'Critical' || t.churnRisk === 'High').length} 家
                  </p>
                </div>
                <div className="p-2 bg-black border border-slate-800 rounded-lg">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">AI 创造收益</p>
                  <p className="text-sm font-extrabold text-[#07C2E3] mt-1 font-mono">$18,400</p>
                </div>
                <div className="p-2 bg-black border border-slate-800 rounded-lg">
                  <p className="text-[9px] text-slate-400 font-bold uppercase">挽回成功率</p>
                  <p className="text-sm font-extrabold text-emerald-400 mt-1 font-mono">
                    {Math.round((operationalMissions.filter(m => m.status === 'DEPLOYED').length / operationalMissions.length) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Grid structure for subsequent modules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* LEFT COLUMN: Health Matrix, Churn Prediction, Recovery Playbooks (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 模块1: Tenant Health Matrix (租户健康矩阵) */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#07C2E3]" />
                        <span>Tenant Health Matrix (多租户活跃健康大盘)</span>
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">健康度最低优先。时刻关注危殆/高流失风险核心商客并点击调阅挽留。</p>
                    </div>
                    <span className="font-mono text-[9px] text-[#07C2E3] bg-[#07C2E3]/15 border border-[#07C2E3]/25 px-2 py-0.5 rounded font-black">
                      LOWEST_HEALTH_FIRST
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                          <th className="p-2 font-mono text-[9px]">商户名称</th>
                          <th className="p-2 font-mono text-[9px]">宿主行业</th>
                          <th className="p-2 font-mono text-[9px]">月度 MRR</th>
                          <th className="p-2 font-mono text-[9px]">流失风险</th>
                          <th className="p-2 font-mono text-[9px]">健康状况</th>
                          <th className="p-2 font-mono text-[9px] text-right">动作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sortedOperationalTenants.map(t => {
                          let riskBadgeClass = '';
                          if (t.churnRisk === 'Critical') riskBadgeClass = 'bg-rose-100 text-rose-700 font-bold border border-rose-200';
                          else if (t.churnRisk === 'High') riskBadgeClass = 'bg-orange-100 text-orange-700 font-bold border border-orange-200';
                          else if (t.churnRisk === 'Medium') riskBadgeClass = 'bg-amber-100 text-amber-700 font-bold border border-amber-200';
                          else riskBadgeClass = 'bg-emerald-100 text-emerald-700 font-bold border border-emerald-200';

                          let scoreColorClass = 'text-rose-500';
                          if (t.healthScore >= 80) scoreColorClass = 'text-emerald-500 font-bold';
                          else if (t.healthScore >= 50) scoreColorClass = 'text-amber-500 font-medium';

                          return (
                            <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="p-2">
                                <p className="font-bold text-slate-800 leading-tight">{t.name}</p>
                                <p className="text-[9px] text-slate-400 font-mono">Territory: {t.country} | Manager: {t.manager}</p>
                              </td>
                              <td className="p-2 text-slate-600 font-medium">{t.industry}</td>
                              <td className="p-2 font-mono text-slate-700 font-semibold">${t.mrr.toLocaleString()}</td>
                              <td className="p-2">
                                <span className={`px-2 py-0.5 rounded text-[8.5px] uppercase ${riskBadgeClass}`}>{t.churnRisk}</span>
                              </td>
                              <td className="p-2 font-mono">
                                <span className={scoreColorClass}>{t.healthScore} PTS</span>
                              </td>
                              <td className="p-2 text-right">
                                <button
                                  onClick={() => handleSelectOperationalTenant(t)}
                                  className="bg-slate-900 text-slate-100 hover:bg-[#07C2E3] hover:text-slate-950 px-2 py-1 rounded text-[9px] font-black cursor-pointer transition-all uppercase"
                                >
                                  调阅挽留
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 模块2: Churn Prediction Engine (流失预测引擎审计器) */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm text-left">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#07C2E3]" />
                      <span>Churn Prediction variables & Audit Engine (精算变量调优)</span>
                    </h3>
                    <span className="text-[9px] font-mono font-bold text-slate-400">CHURN_PREDICTION_ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                    根据多租户底层统计计算变量：【7天登录频次】、【AI 采用率】、【自主营销活动】、【GMV 跌幅】、【积压工单】一键计算流失，允许手动对冲重设。
                  </p>
                  
                  {selectedHealthTenant ? (
                    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-3">
                      <div className="flex justify-between items-center font-mono text-xs">
                        <span className="font-bold text-slate-800">当前计算目标：<strong>{selectedHealthTenant.name}</strong></span>
                        <span className="text-[10px] bg-slate-900 text-slate-100 px-2 py-0.5 rounded uppercase">
                          Computed Risk: {selectedHealthTenant.churnRisk}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">登录频次</p>
                          <p className="text-xs font-bold text-slate-700 mt-0.5 font-mono">{selectedHealthTenant.loginFreq}</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">AI 采用率</p>
                          <p className="text-xs font-bold text-slate-700 mt-0.5 font-mono">{selectedHealthTenant.aiUsage}%</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">自主活动</p>
                          <p className="text-xs font-bold text-slate-700 mt-0.5 font-mono">{selectedHealthTenant.campaigns} 次</p>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">GMV 变动</p>
                          <p className={`text-xs font-bold mt-0.5 font-mono ${selectedHealthTenant.GMVChange < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {selectedHealthTenant.GMVChange}%
                          </p>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <p className="text-[9px] text-slate-400 font-bold uppercase">积压工单</p>
                          <p className="text-xs font-bold text-rose-650 mt-0.5 font-mono">{selectedHealthTenant.tickets} 单</p>
                        </div>
                      </div>

                      {/* Weight Adjustments */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wide">Model Sensitivity Aggregation Scale</span>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => triggerRecalculateRisk(selectedHealthTenant.id, 10)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[9px] px-2.5 py-1.5 rounded border border-emerald-200 cursor-pointer transition-all uppercase"
                          >
                            加权促活 (+10健康分)
                          </button>
                          <button
                            onClick={() => triggerRecalculateRisk(selectedHealthTenant.id, -15)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-[9px] px-2.5 py-1.5 rounded border border-rose-200 cursor-pointer transition-all uppercase"
                          >
                            加权惩罚 (-15健康分)
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic bg-white p-3 border border-slate-200 rounded-lg text-center font-medium">
                      💡 请在上方表格中点击「调阅挽留」，调阅宿主流失精算变量并在此页进行对冲计算。
                    </p>
                  )}
                </div>

                {/* 模块3: Tenant Recovery Playbooks (流失重夺托管剧本车间) */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#07C2E3]" />
                      <span>Tenant Recovery Playbooks (流失挽回对焦剧本阵列)</span>
                    </h3>
                    <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-705 px-2 py-0.5 rounded font-black uppercase">
                      READY TO DEPLOY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                    根据流失模型判断出 Critical、High 危险期的多租户商家，提供一击即发的极速护航重夺业务剧本：
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { title: '特许专家 1对1 免费业务诊断', code: 'PLAY-FREE-CONSULT', actionText: '派发 1对1 财资诊断方案', desc: '全心代办为店主找出欧洲本土化开店供应链瓶颈与支付网关优化。', targetTenant: selectedHealthTenant ? selectedHealthTenant.name : 'Milan Fashion Retail Group', valueAdd: '预计提升 +15% 留存率' },
                      { title: 'AI 增效托管运营中继介入', code: 'PLAY-AI-TAKEOVER', actionText: '激活 AI 智能营销托管', desc: '一键激活 AI 特使，代办全天候运行商铺采购与自主营销，打消店主运营精力不足痛点。', targetTenant: selectedHealthTenant ? selectedHealthTenant.name : 'Le Gourmet Parisien Bistro', valueAdd: '预计提升 +35% AI采用率' },
                      { title: '1对1 高阶功能视频讲堂专属排期', code: 'PLAY-VIDEO-TRAINING', actionText: '安排专员讲堂指导', desc: '派遣客户成功专席与 AI 智能助教联合排期，针对商户薄弱节点进行实操教学。', targetTenant: selectedHealthTenant ? selectedHealthTenant.name : 'London Eco Threads wholesale', valueAdd: '预计增加 +20% 活跃分' },
                      { title: '阶梯续费专属 5 折免单特券', code: 'PLAY-BILL-DISCOUNT', actionText: '发送 5 折专享折抵券', desc: '针对因 MRR 滞纳退款或长期拖欠的商家审批并极速派发下半年度 50% 阶梯折扣抵扣券。', targetTenant: selectedHealthTenant ? selectedHealthTenant.name : 'Barcelona Tapas & Wine Bar Group', valueAdd: '预测流失对冲率降低 4.2%' }
                    ].map((playbook, pIdx) => (
                      <div key={pIdx} className="p-3 bg-slate-50 hover:bg-slate-100/55 border rounded-xl flex flex-col justify-between space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between items-start font-mono">
                            <span className="font-extrabold text-[#059BBC]">{playbook.title}</span>
                            <span className="text-[8px] text-slate-405 font-bold bg-slate-200/70 px-1 py-0.2 rounded font-mono">{playbook.code}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">{playbook.desc}</p>
                          <div className="flex justify-between text-[9px] text-[#07C2E3] font-bold mt-1.5 pt-1.5 border-t border-slate-200/50">
                            <span>派发标的: {playbook.targetTenant}</span>
                            <span>{playbook.valueAdd}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => executeRecoveryPlaybook(playbook.targetTenant, playbook.title, playbook.code)}
                          className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-slate-950 font-black py-1.5 rounded-lg text-[9.5px] uppercase transition-all shadow-xs cursor-pointer block text-center"
                        >
                          🚀 立即执行本剧本
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* RIGHT COLUMN: Revenue Protection Board, Success Missions, Map (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 模块4: Revenue Protection Board (平台收入护航大盘) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm text-left text-slate-100">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-[#07C2E3]" />
                      <span>Revenue Protection Board (平台财资护航盘面)</span>
                    </h3>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/15 px-1.5 rounded font-bold">
                      REVENUE_GUARANTEED
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-black border border-slate-800 rounded-lg">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">全网 MRR 运行总量</p>
                        <p className="text-sm font-black text-white mt-1 font-mono">${totalMOPER.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-black border border-slate-800 rounded-lg">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">年化估值 ARR</p>
                        <p className="text-sm font-black text-[#07C2E3] mt-1 font-mono">${calculatedARR.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-black border border-slate-800 rounded-lg space-y-2 text-xs">
                      <div className="flex justify-between items-center text-slate-450 font-sans">
                        <span>Expansion Revenue (二次增利 MRR)</span>
                        <span className="text-emerald-450 font-bold font-mono">+$4,820</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-450 font-sans">
                        <span>At-Risk Churn MRR (高风险挂账 MRR)</span>
                        <span className="text-rose-450 font-bold font-mono">-${calculatedAtRiskRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-800 pt-1.5 text-slate-450 font-sans">
                        <span>Recovered Defended MRR (已安全挽回 MRR)</span>
                        <span className="text-emerald-450 font-bold font-mono">+${recoveredRevenue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 text-[10px]">
                      <button
                        onClick={auditRevenueRisk}
                        className="w-1/2 bg-slate-800 hover:bg-[#07C2E3] hover:text-slate-950 text-slate-100 font-extrabold py-2 rounded-lg uppercase cursor-pointer transition-all border border-slate-700 font-mono"
                      >
                        📊 收入风险精算
                      </button>
                      <button
                        onClick={batchMitigateRisk}
                        className="w-1/2 bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black py-2 rounded-lg uppercase cursor-pointer transition-all shadow-md font-mono"
                      >
                        ⚡ 一键全网挽留对冲
                      </button>
                    </div>
                  </div>
                </div>

                {/* 模块5: Tenant Success Missions (客户成功派单台) */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-[#07C2E3]" />
                      <span>Tenant Success Missions (客户成功紧急调派池)</span>
                    </h3>
                    <span className="text-[9px] font-mono font-bold text-slate-400">
                      Unassigned: {operationalMissions.filter(m => m.status === 'WAITING_DEPLOY').length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {operationalMissions.map((mission) => (
                      <div key={mission.id} className="p-3 bg-slate-50 border rounded-xl flex flex-col gap-2 text-xs">
                        <div className="flex justify-between items-start font-mono">
                          <span className="font-extrabold text-[#059BBC]">{mission.id}: {mission.tenant}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold ${
                            mission.status === 'DEPLOYED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-orange-100 text-orange-900 border border-orange-200 animate-pulse'
                          }`}>
                            {mission.status === 'DEPLOYED' ? '已派发执行' : '等待调度'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-normal leading-relaxed font-sans">
                          触发根源: <b className="text-slate-700">{mission.triggerReason}</b><br/>
                          派发挽回特案: <span className="font-bold text-slate-850 bg-white border border-slate-200 px-1 py-0.2 rounded inline-block mt-0.5">{mission.type}</span>
                        </p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 text-[9.5px] text-slate-400 font-mono">
                          <span>哨位: {mission.assignedTo}</span>
                          <span>发布: {mission.createdAt}</span>
                        </div>

                        {mission.status === 'WAITING_DEPLOY' && (
                          <div className="flex gap-2 pt-1 font-mono">
                            <button
                              onClick={() => dispatchSuccessMission(mission.id, 'CS_FORCE')}
                              className="w-1/2 bg-slate-900 hover:bg-slate-800 text-slate-100 font-black py-1 rounded text-[9px] uppercase cursor-pointer transition-all text-center"
                            >
                              调派 CS 专席跟进
                            </button>
                            <button
                              onClick={() => dispatchSuccessMission(mission.id, 'AI_AUTO')}
                              className="w-1/2 bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-950 font-black py-1 rounded text-[9px] uppercase cursor-pointer transition-all text-center"
                            >
                              一键 AI 自动促活
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 模块6: Multi-Tenant Heat Map (全球多租户热力图盘面) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm text-left text-slate-100">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#07C2E3]" />
                      <span>Multi-Tenant Global Heat Map (全球多租户活跃热力指数)</span>
                    </h3>
                    <span className="text-[9px] font-mono text-slate-450">EUROPE FIRST</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal mb-3">
                    实时汇算法国、德国、英国、意大利、西班牙、荷兰六大超级枢纽枢纽活跃商家数、GMV 总额与红点流失警报：
                  </p>

                  <div className="space-y-2">
                    {[
                      { name: '德国 (Germany)', stores: 341, gmv: '€812.5K', aiRate: '94.5%' },
                      { name: '英国 (UK)', stores: 419, gmv: '€911.2K', aiRate: '96.1%' },
                      { name: '法国 (France)', stores: 235, gmv: '€451.2K', aiRate: '89.2%' },
                      { name: '西班牙 (Spain)', stores: 198, gmv: '€310.5K', aiRate: '78.2%' },
                      { name: '荷兰 (Netherlands)', stores: 145, gmv: '€275.9K', aiRate: '85.4%' },
                      { name: '意大利 (Italy)', stores: 182, gmv: '€219.4K', aiRate: '71.5%' }
                    ].map((countryData, cIdx) => {
                      const currentRiskCount = operatingTenants.filter(t => t.country === countryData.name.split(' ')[0] && (t.churnRisk === 'Critical' || t.churnRisk === 'High')).length;
                      
                      let barColorClass = 'bg-emerald-500';
                      if (currentRiskCount >= 2) barColorClass = 'bg-rose-500';
                      else if (currentRiskCount === 1) barColorClass = 'bg-amber-500';

                      return (
                        <div key={cIdx} className="p-2 bg-black border border-slate-850 rounded-lg flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className={`w-1 h-6 rounded ${barColorClass}`}></span>
                            <div>
                              <p className="font-bold text-slate-200 leading-tight">{countryData.name}</p>
                              <p className="text-[9.5px] text-slate-500">商户: {countryData.stores} | AI 采用: {countryData.aiRate}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-white font-bold">{countryData.gmv}</p>
                            {currentRiskCount > 0 ? (
                              <p className="text-rose-450 text-[9px] font-black uppercase">⚠️ {currentRiskCount} RISK STORE</p>
                            ) : (
                              <p className="text-emerald-400 text-[9px] font-bold uppercase">⚡ SECURE</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTabSection === 'overview' && (
          <div className="space-y-6" id="overview-card-block">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <Bot className="w-4 h-4 text-[#07C2E3]" />
                <span>ECOS Supreme Cognitive Rule Dashboard</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Under the Supreme Cognitive Constitution, ECOS requires all machine reasoning processes and final recommendations to resolve five fundamental questions before committing final budget dispatches or logistical updates. This ensures the system does not enter a runaway complexity spiral but continually reduces its own error rate.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
                {[
                  { q: '1. What Do We Know?', desc: 'Identifies verified facts from Grade L1 actual transaction orders as prime sources.' },
                  { q: '2. How Do We Know It?', desc: 'Details the exact vector telemetry data source or ledgers checking methods.' },
                  { q: '3. How Reliable Is It?', desc: 'Quantifies source data confidence score and checks past logic chain errors.' },
                  { q: '4. What Could Make It Wrong?', desc: 'Projects potential tariff shocks, demand fluctuations, or supply bottlenecks.' },
                  { q: '5. What Evidence Changes Minds?', desc: 'Defines the quantitative target deviation thresholds that trigger automated vetoes.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200/50 rounded-lg">
                    <p className="text-xs font-bold text-slate-700">{item.q}</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Conflicts Summary */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                      <Scale className="w-4 h-4 text-slate-500" />
                      <span>Reasoning Conflicts Status</span>
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${activeConflictsCount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {activeConflictsCount} Active Conflicts
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    When different AI reasoning components suggest contradictory business directions.
                  </p>
                  
                  {conflicts.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {conflicts.slice(0, 2).map(c => (
                        <div key={c.id} className="p-2 bg-slate-50 rounded border border-slate-100 flex justify-between items-center text-xs text-slate-700">
                          <span className="truncate max-w-[200px] font-medium">{c.sourceEngines.join(' vs ')}</span>
                          <span className={`px-1.5 py-0.5 text-[9px] uppercase font-mono rounded ${c.status === 'active' ? 'bg-amber-100 text-amber-700 font-bold' : 'bg-slate-100 text-slate-600'}`}>
                            {c.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 mt-4 italic">No conflicts logged yet.</p>
                  )}
                </div>
                <button 
                  onClick={() => setActiveTabSection('conflict')} 
                  className="mt-4 text-xs font-semibold text-[#07C2E3] hover:text-[#06B2D0] text-left block"
                >
                  Go to Conflict Management &rarr;
                </button>
              </div>

              {/* Load & Cost Optimization info */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                    <Cpu className="w-4 h-4 text-slate-500" />
                    <span>Cognitive Resource Telemetry</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Pruning speculative or low-value reasoning chains to save budget and improve decision latency.
                  </p>

                  <div className="stats-list mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 bg-slate-50 rounded">
                      <p className="text-[10px] text-slate-400 uppercase tracking-tight">Active Reasoning Chains</p>
                      <p className="text-base font-bold text-slate-700 mt-0.5">
                        {loadMetrics.length > 0 ? loadMetrics[loadMetrics.length - 1].activeReasoningChains : 24}
                      </p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded">
                      <p className="text-[10px] text-slate-400 uppercase tracking-tight">Total Saved Credits</p>
                      <p className="text-base font-bold text-[#07C2E3] mt-0.5">
                        ${dbEngine.cognitive_governance.optimizeReasoningCost(tenantId).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTabSection('load_audit')} 
                  className="mt-4 text-xs font-semibold text-[#07C2E3] hover:text-[#06B2D0] text-left block"
                >
                  Optimize Cost & CPU Load &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CONFLICT RESOLUTION TAB ==================== */}
        {activeTabSection === 'conflict' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6" id="conflict-tab-inner">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                  <Scale className="w-4.5 h-4.5 text-[#07C2E3]" />
                  <span>Cognitive Conflict Arbitration System (Phase 175)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  AI engines may generate contradicting recommendations. Use this system to identify misalignments and select unified resolution strategies based on data evidence grade weights.
                </p>
              </div>
              <button 
                onClick={handleDetectConflict}
                className="px-3 py-1.5 bg-[#07C2E3]/10 text-[#07C2E3] hover:bg-[#07C2E3]/15 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1 select-none cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Trigger Detection Spark</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Conflict Logs list */}
              <div className="md:col-span-1 border border-slate-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registered Conflict Alerts</p>
                {conflicts.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {conflicts.map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => setSelectedConflictId(c.id)}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                          selectedConflictId === c.id 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                            : 'bg-slate-55 border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-mono text-[9px] text-[#07C2E3] font-bold">CONFLICT ID: {c.id.substring(4, 9)}</span>
                          <span className={`px-1 py-0.2 rounded text-[8px] uppercase font-bold ${
                            c.status === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="font-semibold text-xs leading-5">
                          {c.sourceEngines.join(' ⚔️ ')}
                        </p>
                        <p className="text-[10px] opacity-70 mt-1 mt-0.5 truncate">
                          Strategy: {c.resolutionStrategy}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No conflict logs. Click trigger detection!</p>
                )}
              </div>

              {/* Right Column: Resolution Workspace */}
              <div className="md:col-span-2 border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-slate-50/50">
                {selectedConflictId && conflicts.find(c => c.id === selectedConflictId) ? (() => {
                  const currConflict = conflicts.find(c => c.id === selectedConflictId)!;
                  return (
                    <div className="space-y-4">
                      <div className="border-b border-slate-200 pb-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Active Mediation Panel</p>
                        <h4 className="text-sm font-semibold text-slate-800 mt-1 flex items-center space-x-1.5">
                          <span>{currConflict.sourceEngines.join(' ⚔️ ')}</span>
                          <span className="px-2 py-0.5 text-[9px] bg-red-100 text-red-700 uppercase font-bold rounded-lg">
                            {currConflict.severity} Severity
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Identified: {currConflict.timestamp}</p>
                      </div>

                      {/* Conflict details list */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-600">Conflicting Engine Directives Received:</p>
                        {currConflict.conflictingDirectives.map((dir, dIdx) => (
                          <div key={dIdx} className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-700">{dir.engine}</p>
                              <p className="text-xs text-slate-500 mt-0.5 italic">&quot;{dir.recommendation}&quot;</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Confidence</p>
                              <p className="text-sm font-semibold text-[#07C2E3]">{dir.confidence}%</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Strategy Selection Controls */}
                      {currConflict.status === 'active' ? (
                        <div className="bg-white p-3.5 border border-slate-200 rounded-xl space-y-3">
                          <p className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                            <Compass className="w-3.5 h-3.5 text-[#07C2E3]" />
                            <span>Select Resolution Strategy Matrix:</span>
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {[
                              { id: 'evidence_priority', label: 'Evidence Priority', desc: 'L1 Transaction Grade overrides qualitative scenarios.' },
                              { id: 'consensus_voting', label: 'Consensus voting', desc: 'Resolves via boardroom voting aggregation rate.' },
                              { id: 'conservative_fallback', label: 'Conservative fallback', desc: 'Pre-emptive asset safety hold to block spending.' }
                            ].map(st => (
                              <button
                                key={st.id}
                                onClick={() => setSelectedStrategy(st.id as any)}
                                className={`p-2.5 rounded-lg border text-left transition-all ${
                                  selectedStrategy === st.id 
                                    ? 'bg-[#07C2E3]/10 border-[#07C2E3] text-[#059BBC]' 
                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <p className="text-xs font-bold">{st.label}</p>
                                <p className="text-[10px] mt-0.5 opacity-80 leading-normal">{st.desc}</p>
                              </button>
                            ))}
                          </div>

                          <button 
                            onClick={handleResolveConflict}
                            className="w-full text-center py-2.5 bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer select-none mt-2"
                          >
                            Resolve Conflict & Distribute Golden Recommendation
                          </button>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-xl space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 animate-bounce" />
                            <span className="text-xs font-bold">Conflict Resolved & Fixed</span>
                          </div>
                          <p className="text-xs font-semibold">
                            Resolution Strategy Handled: <span className="uppercase font-mono font-bold bg-green-100 px-1 py-0.2 rounded">{currConflict.resolutionStrategy}</span>
                          </p>
                          <p className="text-xs leading-relaxed opacity-90 border-t border-green-200 pt-2 mt-1">
                            <strong>Golden Verdict:</strong> {currConflict.resolvedRecommendation}
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })() : (
                  <p className="text-xs text-slate-400 italic text-center my-12">Select conflicts to access resolution board options.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==================== EVIDENCE HIERARCHY TAB ==================== */}
        {activeTabSection === 'evidence' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6" id="evidence-tab-inner">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <Fingerprint className="w-4.5 h-4.5 text-[#07C2E3]" />
                <span>Evidence Hierarchy & Sourced Credentials (Phase 176)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ECOS processes cannot base rules purely on predictive logic. Data is classified under four rigid Evidence Grades. Higher grades automatically override lower grade proposals when resolving strategic conflicts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Grade Rules / Info and Facts Injection Form */}
              <div className="md:col-span-1 border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inject Verified Sourced Facts</p>
                <form onSubmit={handleInjectEvidence} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Fact Identifier Source</label>
                    <input 
                      type="text" 
                      value={injectSourceName}
                      onChange={(e) => setInjectSourceName(e.target.value)}
                      placeholder="e.g. Italian Yarn Ledger API"
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs mt-1 bg-white focus:outline-none focus:border-[#07C2E3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mt-2">Hierarchy Grade Weight</label>
                    <select 
                      value={injectGrade}
                      onChange={(e: any) => setInjectGrade(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs mt-1 bg-white focus:outline-none"
                    >
                      <option value="L1_REAL_TRANSACTIONS">L1_REAL_TRANSACTIONS (Waterproof, 99% weight)</option>
                      <option value="L2_HISTORIC_METRICS">L2_HISTORIC_METRICS (Historic Retrospective, 92% weight)</option>
                      <option value="L3_INDUSTRY_STATS">L3_INDUSTRY_STATS (External aggregates, 78% weight)</option>
                      <option value="L4_HYPOTHETICAL_LOGIC">L4_HYPOTHETICAL_LOGIC (AI Scenario simulation, 45% weight)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Key Label</label>
                      <input 
                        type="text" 
                        value={injectKey}
                        onChange={(e) => setInjectKey(e.target.value)}
                        placeholder="e.g. marginPercent"
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs mt-1 bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Registered Value</label>
                      <input 
                        type="text" 
                        value={injectValue}
                        onChange={(e) => setInjectValue(e.target.value)}
                        placeholder="e.g. 62"
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs mt-1 bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Source Reliability Score (0-100)</label>
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      value={injectScore}
                      onChange={(e) => setInjectScore(Number(e.target.value))}
                      className="w-full mt-1.5 accent-[#07C2E3]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                      <span>Volatile (10)</span>
                      <span className="font-bold text-[#07C2E3]">{injectScore} Score</span>
                      <span>Verified (100)</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full text-center py-2 bg-gradient-to-r from-[#07C2E3] to-[#06B2D0] text-white text-xs font-bold rounded-lg transition-colors mt-2 hover:opacity-90 cursor-pointer"
                  >
                    Lock Fact In Hierarchy
                  </button>
                </form>
              </div>

              {/* Right Column: Visualized Grading List */}
              <div className="md:col-span-2 border border-slate-200 rounded-xl p-4 space-y-4">
                <p className="text-xs font-bold text-slate-600">Active Grounded Facts Repository</p>
                
                <div className="space-y-3 max-h-[360px] overflow-y-auto">
                  {evidence.map(item => {
                    const gradeColor = 
                      item.grade === 'L1_REAL_TRANSACTIONS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      item.grade === 'L2_HISTORIC_METRICS' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      item.grade === 'L3_INDUSTRY_STATS' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-100 text-slate-700 border-slate-200';

                    const gradeLabel = 
                      item.grade === 'L1_REAL_TRANSACTIONS' ? 'Level 1: Real Transactions' :
                      item.grade === 'L2_HISTORIC_METRICS' ? 'Level 2: Historic Metrics' :
                      item.grade === 'L3_INDUSTRY_STATS' ? 'Level 3: Industry Aggregate' :
                      'Level 4: AI Hypothesis Logic';

                    return (
                      <div key={item.id} className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-start justify-between shadow-xs">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${gradeColor}`}>
                            {gradeLabel}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 pt-1.5">{item.sourceName}</h4>
                          <span className="text-[10px] text-slate-400 block pt-0.5">Verified: {item.lastVerified}</span>
                          
                          {/* Data contents mapping */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {Object.entries(item.evidenceData).map(([k, v]) => (
                              <span key={k} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] rounded border border-slate-100 font-mono">
                                <b className="text-slate-800">{k}:</b> {String(v)}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Reliability</span>
                          <span className="text-sm font-bold text-slate-700 mt-0.5">{item.reliabilityScore}%</span>
                          <div className="w-12 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full bg-[#07C2E3]" style={{ width: `${item.reliabilityScore}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== CONFIDENCE CALIBRATION TAB ==================== */}
        {activeTabSection === 'calibration' && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6" id="calibration-tab-inner">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                <ShieldAlert className="w-4.5 h-4.5 text-[#07C2E3]" />
                <span>Confidence Calibration Workspace (Phase 177 - 178)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Avoids the AI Overconfidence Bias. When a proposed strategy claims 95% confidence, ECOS applies retrograde calibration formulas to deduct penalty points based on cumulative historical engine loop failures before letting any budget release pass.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Left Column: Calibration Form */}
              <div className="md:col-span-3 border border-slate-200 rounded-xl p-4 space-y-4">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Strategy Constitution Grounding Portal</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Proposed Strategic Action Name</label>
                    <input 
                      type="text" 
                      value={proposalTitle}
                      onChange={(e) => setProposalTitle(e.target.value)}
                      placeholder="e.g. Enter Luxury Merino Knitwear Corridor"
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs mt-1 bg-white focus:outline-none focus:border-[#07C2E3]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Primary Data Source Grade</label>
                      <div className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1.5 rounded-lg mt-1">
                        L1 Real Transactions (Waterproof)
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Input Raw Confidence %</label>
                      <input 
                        type="number" 
                        max="100" 
                        min="10" 
                        value={rawConfidenceInput}
                        onChange={(e) => setRawConfidenceInput(Number(e.target.value))}
                        className="w-full p-1.5 border border-slate-200 rounded-lg text-xs mt-1 font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* ECOS SUPREME COGNITIVE RULE QUESTIONS */}
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-3 border-l-4 border-l-[#07C2E3]" id="ecos-supreme-rule-form">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#07C2E3] flex items-center space-x-1">
                      <Scale className="w-3.5 h-3.5" />
                      <span>ECOS Supreme Constitutional Verification Rule Checklist</span>
                    </p>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">1. What Do We Know? (Verified Facts)</span>
                        <input 
                          type="text" 
                          value={q1} 
                          onChange={(e) => setQ1(e.target.value)}
                          className="w-full p-1 bg-slate-800 text-white rounded mt-0.5 text-xs focus:outline-none border border-slate-700"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">2. How Do We Know It? (Validation Telemetry)</span>
                        <input 
                          type="text" 
                          value={q2} 
                          onChange={(e) => setQ2(e.target.value)}
                          className="w-full p-1 bg-slate-800 text-white rounded mt-0.5 text-xs focus:outline-none border border-slate-700"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">3. How Reliable Is It? (Error / Loop Check)</span>
                        <input 
                          type="text" 
                          value={q3} 
                          onChange={(e) => setQ3(e.target.value)}
                          className="w-full p-1 bg-slate-800 text-white rounded mt-0.5 text-xs focus:outline-none border border-slate-700"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">4. What Could Make It Wrong? (Risk Boundary)</span>
                        <input 
                          type="text" 
                          value={q4} 
                          onChange={(e) => setQ4(e.target.value)}
                          className="w-full p-1 bg-slate-800 text-white rounded mt-0.5 text-xs focus:outline-none border border-slate-700"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">5. What Evidence Changes Our Mind? (Veto Trigger)</span>
                        <input 
                          type="text" 
                          value={q5} 
                          onChange={(e) => setQ5(e.target.value)}
                          className="w-full p-1 bg-slate-800 text-white rounded mt-0.5 text-xs focus:outline-none border border-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCalibrateAction}
                    className="w-full text-center py-2.5 bg-[#07C2E3] hover:bg-[#06B2D0] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Analyze Biases & Apply Calibrated Deductions
                  </button>
                </div>
              </div>

              {/* Right Column: Calibrations Logs & Calibration Results */}
              <div className="md:col-span-2 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-2">History Calibrations & Mitigations</p>
                  
                  {calibrations.length > 0 ? (
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                      {calibrations.map((cal, index) => {
                        const isOver = cal.biasType === 'overconfidence';
                        return (
                          <div key={cal.id || index} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-mono text-[9px] text-slate-400">ID: {cal.id?.substring(4,9) || 'Cal'}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[8px] uppercase font-bold ${
                                isOver ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {cal.biasType}
                              </span>
                            </div>
                            <p className="font-bold text-slate-700">Proposal Calibration Check</p>
                            <p className="text-slate-500 text-[10px] mt-0.5">Adjustment Reason: &quot;{cal.adjustmentReason}&quot;</p>
                            
                            <div className="grid grid-cols-3 gap-1 mt-2.5 pt-2 border-t border-slate-200/60 text-center">
                              <div>
                                <p className="text-[8px] text-slate-400 uppercase font-mono">Raw</p>
                                <p className="text-xs font-bold text-slate-600">{cal.rawConfidence}%</p>
                              </div>
                              <div>
                                <p className="text-[8px] text-[#07C2E3] uppercase font-mono">Calibrated</p>
                                <p className="text-xs font-bold text-[#059BBC]">{cal.calibratedConfidence}%</p>
                              </div>
                              <div>
                                <p className="text-[8px] text-orange-400 uppercase font-mono">Delta Impact</p>
                                <p className="text-xs font-bold text-orange-600">{cal.calibrationDelta}%</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No calibration runs recorded yet.</p>
                  )}
                </div>

                <div className="p-3 bg-slate-900 text-white rounded-lg mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#07C2E3]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">Supreme Constitution Verified</span>
                  </div>
                  <span className="px-2 py-0.5 text-[8px] bg-[#07C2E3] text-slate-950 font-bold uppercase rounded">
                    Operational Limit Met
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== LOAD & REPLAYS AUDIT TAB ==================== */}
        {activeTabSection === 'load_audit' && (
          <div className="space-y-6" id="load-tab-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Cognitive Load Management Area */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5ClassName">
                    <Cpu className="w-4.5 h-4.5 text-[#07C2E3]" />
                    <span>Cognitive Load Management (Phase 179)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Running redundant multi-agent chains aggregates computational bloat. Optimize cost by garbage-collecting low-value speculative loops and limiting memory allocation thresholds.
                  </p>

                  <div className="space-y-4 mt-4">
                    {loadMetrics.length > 0 ? (() => {
                      const latestLoad = loadMetrics[loadMetrics.length - 1];
                      return (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">Cognitive Load Status:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              latestLoad.loadStatus === 'optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {latestLoad.loadStatus}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-white p-2.5 rounded border border-slate-100">
                              <p className="text-[10px] text-slate-400">Active Reasoning Chains</p>
                              <p className="text-base font-bold text-slate-700 mt-0.5">{latestLoad.activeReasoningChains}</p>
                            </div>
                            <div className="bg-white p-2.5 rounded border border-slate-100">
                              <p className="text-[10px] text-slate-400">Mean Chain Cost (Saved)</p>
                              <p className="text-base font-bold text-[#07C2E3] mt-0.5">${latestLoad.reasoningCostSavedUsd.toFixed(2)}</p>
                            </div>
                          </div>

                          {/* Progress visual */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                              <span>Computational Limit</span>
                              <span>{latestLoad.activeReasoningChains}/64 Allocated</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-900" style={{ width: `${(latestLoad.activeReasoningChains / 64) * 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })() : (
                      <p className="text-xs text-slate-400 italic">No telemetry load scans logged yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {pruningStatus ? (
                    <span className="text-xs text-slate-500 animate-pulse">{pruningStatus}</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Resource limits OK</span>
                  )}
                  <button 
                    onClick={handlePruning}
                    className="px-4 py-2 bg-slate-900 border border-slate-900 text-[#07C2E3] hover:text-white hover:bg-slate-850 hover:border-slate-850 active:bg-black text-xs font-bold rounded-lg select-none cursor-pointer transition-colors"
                  >
                    Prune Speculative Low-Value Reasoning
                  </button>
                </div>
              </div>

              {/* Cognitive Replay Log Area */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1.5">
                    <Compass className="w-4.5 h-4.5 text-[#07C2E3]" />
                    <span>Cognitive Audit & Retrograde Replays (Phase 180-181)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Play back past strategic decisions to audit how the AI reasoned through different options. View counterfactual outcomes to diagnose potential systematic biases across quarters.
                  </p>

                  <div className="space-y-3 mt-4 max-h-[220px] overflow-y-auto">
                    {audits.map(rep => (
                      <div key={rep.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span>Verified: {rep.replayTimestamp.substring(11, 16)}</span>
                          <span className="font-mono text-emerald-600 font-bold">Integrity Score: {rep.governanceScore}%</span>
                        </div>
                        <p className="font-semibold text-slate-800 leading-normal">
                          Decision Topic: &quot;{rep.originalRationale}&quot;
                        </p>
                        <p className="text-[10px] text-slate-500 border-t border-slate-200/60 pt-1.5">
                          <strong>Counterfactual Outcome:</strong> {rep.counterfactualOutcome}
                        </p>
                        
                        <button 
                          onClick={() => handleReplayDecision(rep.decisionId)}
                          className="text-[10px] text-[#07C2E3] hover:text-[#06B2D0] font-bold block select-none cursor-pointer"
                        >
                          Reconstruct Reasoning Trace &rarr;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {reconstructedAuditText.length > 0 && (
                  <div className="mt-4 p-3 bg-slate-900 text-slate-300 rounded-lg text-xs space-y-1.5 font-mono">
                    <p className="text-[10px] text-[#07C2E3] font-bold uppercase">RECONSTRUCTED TRACE LOGS:</p>
                    {reconstructedAuditText.map((step, sIdx) => (
                      <p key={sIdx} className="text-[10px] leading-relaxed">&gt; {step}</p>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
