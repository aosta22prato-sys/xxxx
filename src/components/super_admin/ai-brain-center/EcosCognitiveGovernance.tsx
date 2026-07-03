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
  Check,
  Shield
} from 'lucide-react';
import { dbEngine } from '../../../db/dbEngine';
import { selfHealingService } from '../../../services/SelfHealingService';
import { EnterpriseGovernorService } from '../../../services/EnterpriseGovernorService';
import { 
  CognitiveConflict, 
  EvidenceHierarchyItem, 
  ReasoningReliability, 
  ConfidenceCalibration, 
  CognitiveLoadMetric, 
  CognitiveAuditReplay, 
  GovernanceDriftLog,
  HealingIncidentItem,
  HealingActionItem,
  HealingAuditLogItem
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

  // Self Healing State hooks
  const [healingIncidents, setHealingIncidents] = useState<HealingIncidentItem[]>([]);
  const [healingActions, setHealingActions] = useState<HealingActionItem[]>([]);
  const [healingAuditLogs, setHealingAuditLogs] = useState<HealingAuditLogItem[]>([]);
  const [healingRunText, setHealingRunText] = useState<string>('');

  // Governor State hooks
  const [governorDecisions, setGovernorDecisions] = useState<any[]>([]);
  const [governorPolicies, setGovernorPolicies] = useState<any[]>([]);
  const [governorAuditLogs, setGovernorAuditLogs] = useState<any[]>([]);
  
  // Create simulated proposal form state
  const [testActionType, setTestActionType] = useState<'price_change' | 'stock_purchase' | 'ad_campaign' | 'system_config' | 'compliance_check'>('price_change');
  const [testPayloadStr, setTestPayloadStr] = useState('{"discount_pct": 25}');
  const [createdDecisionItem, setCreatedDecisionItem] = useState<any>(null);

  // New policy form state
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyType, setNewPolicyType] = useState<'financial_limit' | 'inventory_risk' | 'ad_spend' | 'compliance' | 'permission_escalation'>('financial_limit');
  const [newPolicyApproval, setNewPolicyApproval] = useState<'automatic' | 'manual_admin' | 'multi_signature' | 'emergency_bypass'>('automatic');
  const [newPolicyRisk, setNewPolicyRisk] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');

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

  const [activeTabSection, setActiveTabSection] = useState<'overview' | 'conflict' | 'evidence' | 'calibration' | 'load_audit' | 'tenant_intelligence' | 'self_healing' | 'governor'>('tenant_intelligence');
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

      // Self healing reloads
      setHealingIncidents(dbEngine.healing_incidents.getAll());
      setHealingActions(dbEngine.healing_actions.getAll());
      setHealingAuditLogs(dbEngine.healing_audit_logs.getAll());

      // Governor reloads
      setGovernorDecisions(dbEngine.governor_decisions.getAll());
      setGovernorPolicies(dbEngine.governor_policies.getAll());
      setGovernorAuditLogs(dbEngine.governor_audit_logs.getAll());
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
          { id: 'load_audit', label: '⚡ Resource & Replays (P179-181)', icon: Cpu },
          { id: 'self_healing', label: '🛡️ Anomaly Self-Healing (P0-012)', icon: ShieldAlert },
          { id: 'governor', label: '⚖️ Enterprise Governor (P0-010)', icon: Shield }
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

        {/* ==================== P0-012: ANOMALY SELF-HEALING IMMUNITY PORTAL ==================== */}
        {activeTabSection === 'self_healing' && (
          <div className="space-y-6 animate-fadeIn text-left text-slate-800" id="self-healing-cognitive-panel">
            
            {/* Top Header Panel */}
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-400 font-bold tracking-wider uppercase border border-sky-500/35">P0-012</span>
                  <span className="text-white text-base font-black tracking-wide uppercase">ECOS 认知自修复与自我免疫中枢</span>
                </p>
                <p className="text-xs text-slate-400">运行级自愈自检机制。秒级探知认知状态漂移、工具偶发故障、消息积压与知识冲突，并全自动执行回滚、重试或重建</p>
              </div>
              <button
                onClick={() => {
                  setHealingRunText('正在高速巡检企业级各层运行状态...');
                  setTimeout(() => {
                    const scanned = selfHealingService.scanForAnomalies(tenantId);
                    if (scanned.length > 0) {
                      setHealingRunText(`✓ 巡检完成，检测到并登记 ${scanned.length} 项运行时异常！免疫修补作业已就绪。`);
                    } else {
                      setHealingRunText('✓ 巡检完成，暂未检测到严重级认知漂移或运行时阻塞。状态指标健康。');
                    }
                    // Refresh logs from dbEngine
                    setHealingIncidents(dbEngine.healing_incidents.getAll());
                    setHealingActions(dbEngine.healing_actions.getAll());
                    setHealingAuditLogs(dbEngine.healing_audit_logs.getAll());
                  }, 1200);
                }}
                className="px-4 py-2 bg-[#07C2E3] text-black font-extrabold text-xs hover:bg-[#06B2D0] cursor-pointer select-none rounded flex items-center gap-1.5 transition duration-200 shadow-md uppercase tracking-wider"
              >
                <RefreshCw className="w-4 h-4" /> 运行状态自检与突触重扫
              </button>
            </div>

            {healingRunText && (
              <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#07C2E3] animate-pulse" />
                <span className="font-mono text-slate-700 font-black">{healingRunText}</span>
              </div>
            )}

            {/* Platform Runtimes Health Monitor Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                Runtime Health Monitor · 各大运行时健康哨兵
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { name: 'World State Runtime', status: selfHealingService.queryRuntimeStatus().worldState, desc: '环境指示与数据大盘' },
                  { name: 'Tool Runtime', status: selfHealingService.queryRuntimeStatus().toolRuntime, desc: 'API工具调用与授权' },
                  { name: 'Agent Runtime', status: selfHealingService.queryRuntimeStatus().agentRuntime, desc: '十四智能体并发协调' },
                  { name: 'Memory Runtime', status: selfHealingService.queryRuntimeStatus().memoryRuntime, desc: '短期遗忘与长期置信度' },
                  { name: 'Knowledge Runtime', status: selfHealingService.queryRuntimeStatus().knowledgeRuntime, desc: '商品描述与商铺知识包' },
                  { name: 'DNA Runtime', status: 'healthy', desc: '平台主权与经营合规' },
                  { name: 'Governor Runtime', status: selfHealingService.queryRuntimeStatus().governorRuntime, desc: '预算熔断与算力调拨' },
                  { name: 'Nervous ENS Runtime', status: 'healthy', desc: '百毫秒高速突触总线' },
                  { name: 'Planning Runtime', status: selfHealingService.queryRuntimeStatus().autonomousPlanningRuntime, desc: '主动战役与战略分解' },
                ].map((monitor, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 flex flex-col justify-between shadow-xs">
                    <div>
                      <h5 className="text-[11px] font-black text-slate-800 leading-snug">{monitor.name}</h5>
                      <p className="text-[9px] text-slate-400 mt-0.5">{monitor.desc}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`w-2 h-2 rounded-full ${
                        monitor.status === 'healthy' ? 'bg-emerald-500 animate-pulse' :
                        monitor.status === 'degraded' || monitor.status === 'conflict' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-[8px] uppercase font-mono tracking-wider font-extrabold text-slate-600">
                        {monitor.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Panel: Incidents List & Auto Repair Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Incidents Records */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Active Incident Desk (healing_incidents)</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">异常拦截与认知突触冲突事件大盘</p>
                  </div>
                  <span className="font-mono text-xs font-black text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    {healingIncidents.length} 宗事件
                  </span>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {healingIncidents.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-xs text-slate-500">
                      目前全网无异常事件阻滞，系统完全免疫。
                    </div>
                  ) : (
                    healingIncidents.map((inc) => (
                      <div key={inc.incident_id} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-slate-400">事件单: {inc.incident_id}</span>
                          <span className={`text-[8px] font-extrabold border px-2 py-0.5 rounded uppercase ${
                            inc.status === 'resolved' ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' :
                            inc.status === 'repaired' ? 'bg-blue-100/50 text-blue-700 border-blue-200' :
                            inc.status === 'diagnosed' ? 'bg-yellow-101/50 text-yellow-700 border-yellow-200' :
                            'bg-rose-100/50 text-rose-700 border-rose-200 animate-pulse'
                          }`}>
                            {inc.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-snug">{inc.description}</p>
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-slate-500">
                            <span>所属链: <strong className="text-slate-700">{inc.incident_type}</strong></span>
                            <span>&bull;</span>
                            <span>上报哨兵: <strong className="text-slate-700">{inc.source}</strong></span>
                          </div>
                        </div>

                        {inc.status !== 'resolved' && (
                          <div className="pt-2.5 border-t border-slate-200/50 flex items-center justify-end">
                            <button
                              onClick={() => {
                                setHealingRunText(`正在启动异常ID [${inc.incident_id}] 的靶向免疫修复...`);
                                setTimeout(() => {
                                  selfHealingService.autoDiagnoseAndRepair(inc.incident_id);
                                  setHealingRunText(`✓ 免疫修复执行成功。状态已收敛并重置为 resolved。`);
                                  // Refresh logs from dbEngine
                                  setHealingIncidents(dbEngine.healing_incidents.getAll());
                                  setHealingActions(dbEngine.healing_actions.getAll());
                                  setHealingAuditLogs(dbEngine.healing_audit_logs.getAll());
                                }, 1000);
                              }}
                              className="px-3 py-1 bg-[#07C2E3] text-black hover:bg-[#06B2D0] select-none cursor-pointer text-xs font-black rounded tracking-wide transition uppercase text-[10px]"
                            >
                              🚀 极速免疫自愈修复
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Reparations Actions */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Reparations Output Log (healing_actions)</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">自愈引擎所做出的修复动作与回滚响应记录</p>
                  </div>
                  <span className="font-mono text-xs font-black text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                    {healingActions.length} 条记录
                  </span>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 text-xs">
                  {healingActions.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-xs text-slate-505">
                      目前暂无自愈修复动作执行。
                    </div>
                  ) : (
                    healingActions.map((act) => (
                      <div key={act.action_id} className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-slate-400">操作ID: {act.action_id} (针对 {act.incident_id})</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            act.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-105 text-yellow-850'
                          }`}>
                            {act.status}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-slate-500 uppercase mt-1">
                          自救动作类别: <strong className="text-slate-800">{act.action_type}</strong>
                        </p>
                        <p className="text-slate-600 font-bold leading-relaxed mt-2 p-2 bg-slate-900 text-slate-300 rounded font-mono text-[10px]">
                          成果反馈: {act.result}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Immune Audit Trails (healing_audit_logs) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Immune Audit Trail (healing_audit_logs)</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">主权审计与状态漂移合规校验底账</p>
                </div>
                <span className="font-mono text-xs font-black text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  {healingAuditLogs.length} 条底账
                </span>
              </div>

              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {healingAuditLogs.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs text-slate-505">
                    主权审计底账整洁。未引发任何自修复对账。
                  </div>
                ) : (
                  healingAuditLogs.map((log) => (
                    <div key={log.audit_id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">审计凭据: {log.audit_id}</span>
                          <span className="px-2 py-0.5 rounded text-[8px] bg-sky-100 text-sky-800 font-black uppercase font-mono">
                            {log.action}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-mono leading-relaxed truncate max-w-[650px]">
                          <strong>Before:</strong> {log.before_state}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-mono leading-relaxed truncate max-w-[650px]">
                          <strong>After:</strong> {log.after_state}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        {log.created_at}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* ==================== P0-010: ENTERPRISE GOVERNOR RUNTIME ==================== */}
        {activeTabSection === 'governor' && (
          <div className="space-y-6 animate-fadeIn" id="ecos-governor-console">
            
            {/* Regulatory Status Headings */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Governor Circuit State</span>
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    EnterpriseGovernorService.getInstance().isCircuitBreakerTripped() ? 'bg-rose-500' : 'bg-emerald-500'
                  }`} />
                </div>
                <h4 className="text-2xl font-black mt-2 font-mono tracking-tight">
                  {EnterpriseGovernorService.getInstance().isCircuitBreakerTripped() ? 'QUARANTINE / TRIPPED' : 'SECURE / OPERATIONAL'}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  {EnterpriseGovernorService.getInstance().isCircuitBreakerTripped() 
                    ? `触发原因: ${EnterpriseGovernorService.getInstance().getCircuitBreakerReason()}` 
                    : '贝叶斯宪法流正常收敛，安全防护层闭合正常。'}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Takeover Status</span>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${EnterpriseGovernorService.getInstance().isSystemLockedDown() ? 'bg-red-500' : 'bg-slate-300'}`} />
                  <h4 className="text-xl font-mono font-black text-slate-800">
                    {EnterpriseGovernorService.getInstance().isSystemLockedDown() ? 'FORCE LCK-DOWN (FROZEN)' : 'AUTONOMOUS ACTIVE'}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {EnterpriseGovernorService.getInstance().isSystemLockedDown() ? '所有智能代理、工具及运行时已锁定' : '各业务部门多智能体流自治运行中'}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Policies Enforced</span>
                <h4 className="text-3xl font-mono font-black text-[#07C2E3] mt-1">{governorPolicies.length} 条宪法</h4>
                <p className="text-[10px] text-slate-500 mt-1">包含财务控制、广告预算、库存兜底等高危自动阻断政策</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Decisions Log History</span>
                <h4 className="text-3xl font-mono font-black text-slate-700 mt-1">{governorDecisions.length} 件裁决</h4>
                <p className="text-[10px] text-slate-500 mt-1">记录系统内部所有的提案决策、否决、自动升级审核历程</p>
              </div>
            </div>

            {/* Circuit Breaker & Takeover Controls Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Circuit Breaker Engine Control Room */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Circuit Breaker Watchdog (熔断引擎)</h4>
                  <p className="text-[10px] text-slate-400">持续监控连续故障、异常参数漂移、知识及记忆污染指标，遇强震直接熔断阻断系统</p>
                </div>

                {/* Compile diagnostics */}
                {(() => {
                  const diagnostics = EnterpriseGovernorService.getInstance().compileCircuitBreakerMetrics();
                  return (
                    <div className="space-y-3 bg-slate-50 p-4 border border-slate-150 rounded-xl">
                      <div className="flex justify-between items-center text-xs text-slate-600">
                        <span>连续遭遇故障项数 (Failed items):</span>
                        <span className={`font-mono font-bold ${diagnostics.continuousFailuresCount > 2 ? 'text-rose-600' : 'text-slate-705'}`}>
                          {diagnostics.continuousFailuresCount} 故障
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-605">
                        <span>主权认知偏移监控 (Anomaly Drifts):</span>
                        <span className="font-mono text-slate-700 font-bold">{diagnostics.anomalyDriftsCount} 处审计</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>知识库污染隐患率 (Knowledge Pollution):</span>
                          <span className="font-mono">{diagnostics.knowledgePollutionRisk}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#07C2E3] h-full" style={{ width: `${diagnostics.knowledgePollutionRisk}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>决策记忆异态威胁 (Memory Pollution):</span>
                          <span className="font-mono">{diagnostics.memoryPollutionRisk}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${diagnostics.memoryPollutionRisk}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Agent 失律失控度 (Uncontrolled Risk):</span>
                          <span className="font-mono">{diagnostics.uncontrolledAgentRisk}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-rose-500 h-full" style={{ width: `${diagnostics.uncontrolledAgentRisk}%` }} />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs text-slate-605">
                        <span>系统综合评估:</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          diagnostics.isSystemDegraded ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {diagnostics.isSystemDegraded ? '系统急剧飘移危险' : '指标状态收敛合规'}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Real-time actions to trigger breaker or reset */}
                <div className="flex gap-2">
                  {EnterpriseGovernorService.getInstance().isCircuitBreakerTripped() ? (
                    <button
                      onClick={() => {
                        EnterpriseGovernorService.getInstance().resetCircuitBreaker();
                        setGovernorDecisions(dbEngine.governor_decisions.getAll());
                        setLocalFeedback('✓ 成功复位治理极熔断引擎。业务运行时自主流程已恢复畅通！');
                        setTimeout(() => setLocalFeedback(''), 5000);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer select-none text-center"
                    >
                      安全复位重置 (Reset Breaker)
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const r = prompt('请输入触发硬熔断的安全审计原因:', 'Manual emergency alert trigger on potential ledger anomaly.');
                        if (r) {
                          EnterpriseGovernorService.getInstance().triggerCircuitBreaker(r);
                          setGovernorDecisions(dbEngine.governor_decisions.getAll());
                          setLocalFeedback('❗ 安全否决: 超级管理员执行硬熔断。系统已切入离线隔离机制！');
                          setTimeout(() => setLocalFeedback(''), 5000);
                        }
                      }}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer select-none text-center"
                    >
                      强制警示断开 (Trigger Breaker)
                    </button>
                  )}
                </div>
              </div>

              {/* Emergency Takeover Console */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Emergency Takeover Room (接管引擎)</h4>
                  <p className="text-[10px] text-slate-400">允许超级管理员在危机时刻一键阻断工作流，冻结所有AI Agent、高危API工具、Evolution算法引擎，接管系统主权</p>
                </div>

                <div className="p-4 rounded-xl border space-y-3 bg-slate-50 border-slate-200 text-xs text-slate-605">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">业务管治路线:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                      EnterpriseGovernorService.getInstance().isSystemLockedDown() ? 'bg-rose-100 text-rose-800' : 'bg-[#07C2E3]/10 text-[#07c2e3]'
                    }`}>
                      {EnterpriseGovernorService.getInstance().isSystemLockedDown() ? '人工对账锁定模式' : '多智能体自治运行模式'}
                    </span>
                  </div>

                  <div className="space-y-2 mt-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Agent Runtime 隔离率:</span>
                      <span className="font-mono">{EnterpriseGovernorService.getInstance().isSystemLockedDown() ? '100% FROZEN' : '0% STANDBY'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>External Tools 隔离率:</span>
                      <span className="font-mono">{EnterpriseGovernorService.getInstance().isSystemLockedDown() ? '100% FROZEN' : '0% STANDBY'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>World State 数据库突变拦截:</span>
                      <span className="font-mono">{EnterpriseGovernorService.getInstance().isSystemLockedDown() ? 'ACTIVE BLOCK' : 'STANDBY'}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-400 border-t border-slate-200 pt-2 leading-relaxed">
                    <strong>提示:</strong> 激活接管后，系统底层任何Agent的指令提案（Intent ➔ Orchestrator ➔ DNA ➔ GOVERNOR）都将无条件遭到系统级强行拒绝阻断。
                  </p>
                </div>

                <div>
                  {EnterpriseGovernorService.getInstance().isSystemLockedDown() ? (
                    <button
                      onClick={() => {
                        EnterpriseGovernorService.getInstance().setEmergencyTakeover(false);
                        setGovernorDecisions(dbEngine.governor_decisions.getAll());
                        setLocalFeedback('✓ 恢复自治权限。工作流执行环境已重新上线启动。');
                        setTimeout(() => setLocalFeedback(''), 5000);
                      }}
                      className="w-full py-2 bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-900 font-bold rounded-lg text-xs cursor-pointer select-none text-center"
                    >
                      解除系统控制锁 (Resume Autonomy)
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm('警告！确定要强制锁定系统吗？这会导致全网所有接入中枢停止自动业务动作。')) {
                          EnterpriseGovernorService.getInstance().setEmergencyTakeover(true);
                          setGovernorDecisions(dbEngine.governor_decisions.getAll());
                          setLocalFeedback('❗ 紧急指令: 超级管理员成功触发封锁接管。');
                          setTimeout(() => setLocalFeedback(''), 5000);
                        }
                      }}
                      className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-rose-500 hover:text-rose-450 font-bold rounded-lg text-xs cursor-pointer select-none text-center border border-rose-950"
                    >
                      超级终端接管锁定 (Force Lockdown)
                    </button>
                  )}
                </div>
              </div>

              {/* Risk Evaluation Simulator */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Proposal Risk Assessor (风险计算器)</h4>
                  <p className="text-[10px] text-slate-400">在此设置模拟高危运行动作或任务提案，检测它如何通过决策、DNA防线并输出 9 维风险分配矩阵</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">提案所属运营类型</label>
                    <select
                      value={testActionType}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setTestActionType(val);
                        if (val === 'price_change') setTestPayloadStr('{"discount_pct": 25}');
                        else if (val === 'stock_purchase') setTestPayloadStr('{"estimated_cost": 8500}');
                        else if (val === 'ad_campaign') setTestPayloadStr('{"daily_budget": 650}');
                        else if (val === 'system_config') setTestPayloadStr('{"allow_external_nodes": true}');
                        else setTestPayloadStr('{}');
                      }}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="price_change">降价特惠调整 (price_change)</option>
                      <option value="stock_purchase">采购库存补货 (stock_purchase)</option>
                      <option value="ad_campaign">开通广告计划 (ad_campaign)</option>
                      <option value="system_config">修改系统高危配置 (system_config)</option>
                      <option value="compliance_check">合规突击审计 (compliance_check)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">提案参数负载 (Payload Json)</label>
                    <textarea
                      value={testPayloadStr}
                      onChange={(e) => setTestPayloadStr(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                    />
                  </div>

                  <button
                    onClick={() => {
                      try {
                        const parsed = JSON.parse(testPayloadStr);
                        const decision = EnterpriseGovernorService.getInstance().evaluateProposal({
                          taskId: `sim_task_${Math.random().toString(36).substring(2, 9)}`,
                          source: 'Risk Assessor Thread',
                          actionType: testActionType,
                          payload: parsed
                        });
                        setCreatedDecisionItem(decision);
                        setLocalFeedback(`✓ 提案已投递！输出系统裁决状态: [${decision.decision.toUpperCase()}]`);
                        setTimeout(() => setLocalFeedback(''), 5000);
                      } catch (err: any) {
                        alert(`JSON参数格式不正确: ${err.message}`);
                      }
                    }}
                    className="w-full py-2 bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-900 font-bold rounded-lg text-xs cursor-pointer select-none text-center"
                  >
                    提请对数安全裁决 (Evaluate Proposal)
                  </button>
                </div>

                {/* Simulated outputs detailed breakdown */}
                {createdDecisionItem && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="text-[10px] text-slate-500 font-mono">评估凭据: {createdDecisionItem.decision_id}</span>
                      <span className={`text-[10px] font-mono font-black py-0.5 px-2 rounded ${
                        createdDecisionItem.decision === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        createdDecisionItem.decision === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {createdDecisionItem.decision.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-slate-605">
                      <span>综合风险评分 (Risk Score):</span>
                      <span className="font-mono font-bold text-slate-800">{createdDecisionItem.risk_score}/100</span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">9维风险评估向量系数</p>
                      {(() => {
                        try {
                          const detailedRisk = EnterpriseGovernorService.getInstance().evaluateDetailedRisks(testActionType, JSON.parse(testPayloadStr));
                          return (
                            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono">
                              <div className="p-1 bg-white border border-slate-150 rounded text-center">
                                <p className="text-slate-400">财务风险</p>
                                <p className="font-bold text-slate-700 mt-0.5">{detailedRisk.breakdown.financialRisk}%</p>
                              </div>
                              <div className="p-1 bg-white border border-slate-150 rounded text-center">
                                <p className="text-slate-400">库存风险</p>
                                <p className="font-bold text-slate-700 mt-0.5">{detailedRisk.breakdown.inventoryRisk}%</p>
                              </div>
                              <div className="p-1 bg-white border border-slate-150 rounded text-center">
                                <p className="text-slate-400">广告风险</p>
                                <p className="font-bold text-slate-700 mt-0.5">{detailedRisk.breakdown.adRisk}%</p>
                              </div>
                              <div className="p-1 bg-white border border-slate-150 rounded text-center">
                                <p className="text-slate-400">运营风险</p>
                                <p className="font-bold text-slate-700 mt-0.5">{detailedRisk.breakdown.operationsRisk}%</p>
                              </div>
                              <div className="p-1 bg-white border border-slate-150 rounded text-center">
                                <p className="text-slate-400">客户风险</p>
                                <p className="font-bold text-slate-700 mt-0.5">{detailedRisk.breakdown.customerRisk}%</p>
                              </div>
                              <div className="p-1 bg-white border border-slate-150 rounded text-center">
                                <p className="text-slate-400">合规风险</p>
                                <p className="font-bold text-slate-700 mt-0.5">{detailedRisk.breakdown.complianceRisk}%</p>
                              </div>
                              <div className="p-1 bg-white border border-slate-150 rounded text-center">
                                <p className="text-slate-400">知识冲突</p>
                                <p className="font-bold text-slate-700 mt-0.5">{detailedRisk.breakdown.knowledgeConflictRisk}%</p>
                              </div>
                              <div className="p-1 bg-white border border-slate-150 rounded text-center">
                                <p className="text-slate-400">DNA违规</p>
                                <p className="font-bold text-slate-700 mt-0.5">{detailedRisk.breakdown.dnaViolationRisk}%</p>
                              </div>
                              <div className="p-1 bg-white border border-slate-150 rounded text-center">
                                <p className="text-slate-400">系统性能</p>
                                <p className="font-bold text-slate-700 mt-0.5">{detailedRisk.breakdown.systemicRisk}%</p>
                              </div>
                            </div>
                          );
                        } catch {
                          return <p className="text-slate-400">正在复位中重算中...</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Configured Governor Policies Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Policies Active Grid List */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs lg:col-span-2">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Constitution Governor Policies (宪法执行细则)</h4>
                    <p className="text-[10px] text-slate-400">主权大脑据此限制自动机执行权限，非授权动作或越界直接抛掷拒绝和熔断指令</p>
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {governorPolicies.length} 条有效拦截规约
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[400px] overflow-y-auto pr-1">
                  {governorPolicies.length === 0 ? (
                    <div className="col-span-2 py-20 text-center text-slate-400 text-xs">
                      目前商户元宪规约列表为空。建议添加拦截条例。
                    </div>
                  ) : (
                    governorPolicies.map((p: any) => (
                      <div key={p.policy_id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[8px] font-mono font-black uppercase rounded">
                              {p.policy_type}
                            </span>
                            <span className={`text-[8px] font-black uppercase px-2 rounded font-mono ${
                              p.status === 'active' ? 'bg-[#07C2E3]/15 text-[#07C2E3]' : 'bg-slate-200 text-slate-500'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-800 text-xs">{p.policy_name}</h5>
                          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{p.description}</p>
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-slate-200 flex items-center justify-between">
                          <div className="text-[9px] font-mono font-bold text-slate-400 space-y-0.5">
                            <p>防线级别: <span className="text-slate-750">{p.risk_level.toUpperCase()}</span></p>
                            <p>批准机制: <span className="text-indigo-605">{p.approval_mode.toUpperCase()}</span></p>
                          </div>
                          
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                const nextStatus = p.status === 'active' ? 'suspended' : 'active';
                                dbEngine.governor_policies.update(p.policy_id, { status: nextStatus });
                                setLocalFeedback(`✓ 已更新宪法细则 [${p.policy_name}] 状态为 ${nextStatus.toUpperCase()}!`);
                                setTimeout(() => setLocalFeedback(''), 5000);
                              }}
                              className="px-2 py-1 bg-slate-900 text-white rounded font-mono hover:bg-slate-800 cursor-pointer select-none text-[9px]"
                            >
                              切换状态
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`确认要作废并移除该条宪法 [${p.policy_name}] 吗？`)) {
                                  dbEngine.governor_policies.delete(p.policy_id);
                                  setLocalFeedback(`✓ 已成功在主权元规则中作废 [${p.policy_name}] 条例。`);
                                  setTimeout(() => setLocalFeedback(''), 5000);
                                }
                              }}
                              className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-150 rounded cursor-pointer select-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add New Constitutional Rule */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Enforce New Policy (颁布新元规约)</h4>
                  <p className="text-[10px] text-slate-400">动态建立系统拦截防御规则。多智能体和工具请求到此处时均进行验证拦截</p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">规约名称 (Policy Name)</label>
                    <input
                      type="text"
                      placeholder="e.g. 超级特惠价格兜底红线"
                      value={newPolicyName}
                      onChange={(e) => setNewPolicyName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1">管控类别 (Type)</label>
                      <select
                        value={newPolicyType}
                        onChange={(e) => setNewPolicyType(e.target.value as any)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="financial_limit">资金阈值防线 (financial_limit)</option>
                        <option value="inventory_risk">备货库存风险 (inventory_risk)</option>
                        <option value="ad_spend">广告预算上限 (ad_spend)</option>
                        <option value="compliance">法律法规合规性 (compliance)</option>
                        <option value="permission_escalation">越权越级防御 (permission_escalation)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1">风险级别 (Risk Level)</label>
                      <select
                        value={newPolicyRisk}
                        onChange={(e) => setNewPolicyRisk(e.target.value as any)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="low">低等 (low)</option>
                        <option value="medium">中等 (medium)</option>
                        <option value="high">高等 (high)</option>
                        <option value="critical">高危 (critical)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">审批流架构 (Approval Workflow Mode)</label>
                    <select
                      value={newPolicyApproval}
                      onChange={(e) => setNewPolicyApproval(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="automatic">自主评估批准 (automatic)</option>
                      <option value="manual_admin">超级管理员人工签字 (manual_admin)</option>
                      <option value="multi_signature">董事会多重签名机制 (multi_signature)</option>
                      <option value="emergency_bypass">紧急审计豁免通道 (emergency_bypass)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1">拦截控制说明描述 (Description)</label>
                    <textarea
                      placeholder="具体解释该项规约如何生效及熔断机制..."
                      value={newPolicyDesc}
                      onChange={(e) => setNewPolicyDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newPolicyName || !newPolicyDesc) {
                        alert('请完整填写新规约名称和说明描述!');
                        return;
                      }

                      dbEngine.governor_policies.create({
                        policy_name: newPolicyName,
                        policy_type: newPolicyType,
                        approval_mode: newPolicyApproval,
                        risk_level: newPolicyRisk,
                        status: 'active',
                        description: newPolicyDesc
                      });

                      setNewPolicyName('');
                      setNewPolicyDesc('');
                      setLocalFeedback(`✓ 成功颁布并注册商户元宪规约 [${newPolicyName}]，防御算法生效中。`);
                      setTimeout(() => setLocalFeedback(''), 5000);
                    }}
                    className="w-full py-2 bg-[#07C2E3] hover:bg-[#06B2D0] text-slate-900 font-bold rounded-lg text-xs cursor-pointer select-none text-center"
                  >
                    注册颁布此规约 (Enforce Policy)
                  </button>
                </div>
              </div>

            </div>

            {/* Decisions Log Engine & manual approval workflow overrides */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Supreme Governor Decision Log & Workflow Engines (裁决与审批中枢)</h4>
                  <p className="text-[10px] text-slate-400">查看及处理来自于 autonomous 线程的决策阻断提案，提供审批、否决、人工升级及事务回滚</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (confirm('是否确定要清空裁决与流程拦截日志库？')) {
                        dbEngine.governor_decisions.purge();
                        setLocalFeedback('✓ 裁决日志已全部清空。');
                        setTimeout(() => setLocalFeedback(''), 5000);
                      }
                    }}
                    className="px-3 py-1 bg-slate-100 font-bold select-none cursor-pointer border hover:bg-slate-200 border-slate-250 text-slate-700 rounded-lg text-[10px]"
                  >
                    清空记录
                  </button>
                  <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    {governorDecisions.length} 条判例
                  </span>
                </div>
              </div>

              <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                {governorDecisions.length === 0 ? (
                  <div className="py-24 text-center text-slate-400 text-xs">
                    目前判例库为空。启动“风险计算器”生成并评估新提案决策吧。
                  </div>
                ) : (
                  [...governorDecisions].reverse().map((dec: any) => (
                    <div key={dec.decision_id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start justify-between gap-4">
                      
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">决策编号: {dec.decision_id}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-200 px-1.5 rounded">任务ID: {dec.task_id}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${
                            dec.decision === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            dec.decision === 'rejected' ? 'bg-rose-100 text-rose-800' :
                            dec.decision === 'escalated' ? 'bg-amber-100 text-amber-800' : 'bg-slate-500 text-slate-105'
                          }`}>
                            {dec.decision}
                          </span>
                        </div>

                        <p className="font-bold text-slate-800 text-xs mt-1">
                          调用发起者: <strong className="text-slate-950 font-mono">{dec.source}</strong>
                        </p>
                        
                        <p className="text-[11px] text-slate-600 leading-relaxed font-mono mt-1 p-2 bg-slate-900 text-slate-300 rounded">
                          <strong>决策判定:</strong> {dec.reason}
                        </p>

                        <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono pt-1 text-slate-455">
                          <span>风险等级: <strong className="text-slate-700">{dec.risk_score}/100</strong></span>
                          <span>算法自信度: <strong className="text-indigo-600">{(dec.confidence * 100).toFixed(0)}%</strong></span>
                          <span>记录时戳: <strong>{dec.created_at}</strong></span>
                        </div>
                      </div>

                      {/* Manual Action Handlers right on the cards */}
                      <div className="flex flex-col gap-1.5 self-stretch justify-center whitespace-nowrap md:border-l md:border-slate-200 md:pl-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block text-center md:text-left mb-1">主权裁决管理</span>
                        
                        <div className="grid grid-cols-2 gap-1 md:flex md:flex-col md:gap-1.5">
                          <button
                            onClick={() => {
                              EnterpriseGovernorService.getInstance().approveDecision(dec.decision_id, 'CS Manager Override');
                              setGovernorDecisions(dbEngine.governor_decisions.getAll());
                              setLocalFeedback(`✓ 管理员直接签名放行提案 [${dec.decision_id}]!`);
                              setTimeout(() => setLocalFeedback(''), 5000);
                            }}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer select-none text-[9px] text-center font-mono"
                          >
                            批准放行 (Approve)
                          </button>
                          
                          <button
                            onClick={() => {
                              EnterpriseGovernorService.getInstance().rejectDecision(dec.decision_id, 'CS Manager Override');
                              setGovernorDecisions(dbEngine.governor_decisions.getAll());
                              setLocalFeedback(`✓ 管理员一键否决屏蔽 [${dec.decision_id}]!`);
                              setTimeout(() => setLocalFeedback(''), 5000);
                            }}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold cursor-pointer select-none text-[9px] text-center font-mono"
                          >
                            强制否决 (Reject)
                          </button>

                          <button
                            onClick={() => {
                              const bypass = confirm('确认要启用紧急放行机制？这将会跳过所有规约拦截直接予以豁免批准。');
                              if (bypass) {
                                EnterpriseGovernorService.getInstance().processApprovalWorkflow(dec.decision_id, 'emergency_bypass', 'SuperAdmin');
                                setGovernorDecisions(dbEngine.governor_decisions.getAll());
                                setLocalFeedback(`✓ 成功对决策 [${dec.decision_id}] 启动紧急豁免 bypass 审计。`);
                                setTimeout(() => setLocalFeedback(''), 5000);
                              }
                            }}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold cursor-pointer select-none text-[9px] text-center font-mono"
                          >
                            紧急放行 (Bypass)
                          </button>

                          <button
                            onClick={() => {
                              EnterpriseGovernorService.getInstance().executeRollback(dec.decision_id, 'SuperAdmin Audit');
                              setGovernorDecisions(dbEngine.governor_decisions.getAll());
                              setLocalFeedback(`✓ 对裁决 [${dec.decision_id}] 行使撤销权并成功回滚。`);
                              setTimeout(() => setLocalFeedback(''), 5000);
                            }}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold cursor-pointer select-none text-[9px] text-center font-mono"
                          >
                            事务回滚 (Rollback)
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Governor Action Trails (governor_audit_logs) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Metagovernor Audit Trails (主权监督审计底账)</h4>
                  <p className="text-[10px] text-slate-400">针对裁决事件、回滚撤销、接管锁定、熔断复位的最高安全操作底账流</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (confirm('确认要永久抹除主权监督审计底账？')) {
                        dbEngine.governor_audit_logs.purge();
                        setLocalFeedback('✓ 审计底数据已抹除。');
                        setTimeout(() => setLocalFeedback(''), 5000);
                      }
                    }}
                    className="px-3 py-1 bg-slate-100 font-bold select-none cursor-pointer border hover:bg-slate-200 border-slate-250 text-slate-700 rounded-lg text-[10px]"
                  >
                    抹除底账
                  </button>
                  <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    {governorAuditLogs.length} 行对号
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {governorAuditLogs.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs text-slate-500">
                    主权元审计凭证未产生额外事件。系统无外部越级干预。
                  </div>
                ) : (
                  [...governorAuditLogs].reverse().map((aLog: any) => (
                    <div key={aLog.audit_id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-[10px] text-slate-400">凭证编号: {aLog.audit_id}</span>
                          <span className="text-[10px] text-slate-400">针对决策: {aLog.decision_id}</span>
                          <span className="px-2 py-0.5 rounded text-[8px] bg-sky-100 text-sky-800 font-black uppercase">
                            {aLog.action}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono leading-relaxed truncate max-w-[650px]">
                          <strong>Before:</strong> {aLog.before_state}
                        </p>
                        <p className="text-[11px] text-slate-700 font-mono leading-relaxed truncate max-w-[650px]">
                          <strong>After:</strong> {aLog.after_state}
                        </p>
                      </div>

                      <div className="flex md:flex-col items-end gap-3 md:gap-0.5 text-[10px] font-mono whitespace-nowrap text-slate-400">
                        <span className="text-slate-700 font-bold">提行操作人: {aLog.operator}</span>
                        <span>{aLog.created_at}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
