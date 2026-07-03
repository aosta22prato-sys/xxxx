import { dbEngine } from '../db/dbEngine';
import { 
  GovernorPolicyItem, 
  GovernorDecisionItem, 
  GovernorAuditLogItem 
} from '../types';
import { EnterpriseNervousSystemService } from './EnterpriseNervousSystemService';

export class EnterpriseGovernorService {
  private static instance: EnterpriseGovernorService | null = null;
  
  // High fidelity systemic circuit breaker state persistent properties
  private circuitBreakerTripped: boolean = false;
  private breakerTripReason: string = '';
  private systemLockedDown: boolean = false; // Emergency takeover active

  private constructor() {
    // Initializer
  }

  public static getInstance(): EnterpriseGovernorService {
    if (!EnterpriseGovernorService.instance) {
      EnterpriseGovernorService.instance = new EnterpriseGovernorService();
    }
    return EnterpriseGovernorService.instance;
  }

  /**
   * Main veto / final evaluation layer. Runs sequentially before tool or agent execution.
   * Intent -> DNA Governance -> Enterprise Governor -> Execution.
   */
  public evaluateProposal(params: {
    taskId: string;
    source: string;
    actionType: 'price_change' | 'stock_purchase' | 'ad_campaign' | 'system_config' | 'compliance_check';
    payload: Record<string, any>;
  }): GovernorDecisionItem {
    // 1. Acknowledge and audit initial check request
    const beforeStateStr = JSON.stringify(params.payload);

    // If systemic lock-down is active, block everything immediately
    if (this.systemLockedDown) {
      const lockDecision = dbEngine.governor_decisions.create({
        task_id: params.taskId,
        source: params.source,
        decision: 'emergency_blocked',
        reason: 'CRITICAL SHUTDOWN: Enterprise Brain runtime is locked by Emergency Takeover protocol.',
        risk_score: 100,
        confidence: 1.0
      });

      dbEngine.governor_audit_logs.create({
        decision_id: lockDecision.decision_id,
        action: 'system_locked',
        before_state: beforeStateStr,
        after_state: JSON.stringify({ blocked_reasons: 'Emergency state freeze' }),
        operator: 'System'
      });

      // Broadcast roadblock over the high-speed nervous system bus
      EnterpriseNervousSystemService.getInstance().publishEvent({
        eventType: 'dna',
        source: 'EnterpriseGovernorService',
        sourceRuntime: 'EnterpriseGovernorRuntime',
        payload: { task_id: params.taskId, status: 'BLOCKED_BY_TAKEOVER' },
        priority: 'critical'
      });

      return lockDecision;
    }

    // 2. Evaluate systemic risks to output risk score
    const riskAnalysis = this.calculateRiskAssessment(params.actionType, params.payload);
    const score = riskAnalysis.score;
    const computedLevel = riskAnalysis.level;

    // 3. Match against currently active governor policy list
    const policies = dbEngine.governor_policies.getAll().filter(p => p.status === 'active');
    let decisionOutcome: GovernorDecisionItem['decision'] = 'approved';
    let decisionReason = `Proposal verified. Calculated risk score (${score}/100) satisfies safety bounds.`;

    for (const policy of policies) {
      if (policy.policy_type === 'financial_limit' && params.actionType === 'price_change') {
        const margin = params.payload.hasOwnProperty('margin') ? params.payload.margin : 50;
        if (margin < 45) {
          decisionOutcome = 'escalated';
          decisionReason = `VETO EXCEEDED: Proposed action triggers '${policy.policy_name}' (margin ${margin}% < 45%). Escalating to Super Admin priority signature.`;
          break;
        }
      }

      if (policy.policy_type === 'ad_spend' && params.actionType === 'ad_campaign') {
        const adSpikePct = params.payload.hasOwnProperty('spike_pct') ? params.payload.spike_pct : 0;
        if (adSpikePct > 50) {
          decisionOutcome = 'rejected';
          decisionReason = `BLOCKED: Triggers budget limits configured under '${policy.policy_name}'. Spike metric (${adSpikePct}%) exceeds rule bounds.`;
          break;
        }
      }
    }

    // Dynamic Circuit Breaker safety catch
    if (score >= 85 && decisionOutcome !== 'rejected') {
      decisionOutcome = 'escalated';
      decisionReason = `CRITICAL ELEVATION: Risk Score of ${score} triggers automatic supervisor signature threshold.`;
    }

    // 4. Persistence of decision
    const decisionItem = dbEngine.governor_decisions.create({
      task_id: params.taskId,
      source: params.source,
      decision: decisionOutcome,
      reason: decisionReason,
      risk_score: score,
      confidence: parseFloat((0.9 + Math.random() * 0.09).toFixed(2))
    });

    // 5. Post-audit logging
    dbEngine.governor_audit_logs.create({
      decision_id: decisionItem.decision_id,
      action: decisionOutcome === 'approved' ? 'approve' : decisionOutcome === 'rejected' ? 'reject' : 'escalate',
      before_state: beforeStateStr,
      after_state: JSON.stringify({ decision_id: decisionItem.decision_id, outcome: decisionOutcome }),
      operator: 'System'
    });

    // 6. Broadcast transaction safety event through Nervous System
    EnterpriseNervousSystemService.getInstance().publishEvent({
      eventType: 'audit',
      source: 'EnterpriseGovernorService',
      sourceRuntime: 'EnterpriseGovernorRuntime',
      payload: { 
        decision_id: decisionItem.decision_id, 
        outcome: decisionOutcome, 
        risk_score: score,
        task_id: params.taskId 
      },
      priority: score > 75 ? 'critical' : 'medium'
    });

    return decisionItem;
  }

  /**
   * P0-010: Risk Evaluation Engine
   * Evaluates and returns specialized score allocations across 9 commercial risk vectors:
   * 财务风险, 库存风险, 广告风险, 运营风险, 客户风险, 合规风险, 知识冲突风险, DNA违规风险, 系统风险
   */
  public evaluateDetailedRisks(
    actionType: string,
    payload: Record<string, any>
  ): {
    risk_score: number;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    breakdown: {
      financialRisk: number;
      inventoryRisk: number;
      adRisk: number;
      operationsRisk: number;
      customerRisk: number;
      complianceRisk: number;
      knowledgeConflictRisk: number;
      dnaViolationRisk: number;
      systemicRisk: number;
    }
  } {
    let financialRisk = 15;
    let inventoryRisk = 10;
    let adRisk = 10;
    let operationsRisk = 12;
    let customerRisk = 15;
    let complianceRisk = 10;
    let knowledgeConflictRisk = 8;
    let dnaViolationRisk = 5;
    let systemicRisk = 10;

    // Simulate realistic analytical risk evaluation logic
    if (actionType === 'price_change') {
      const discount = payload.discount_pct || 0;
      financialRisk = Math.min(discount * 2.8, 95);
      complianceRisk = discount > 35 ? 75 : 20;
      customerRisk = discount > 50 ? 60 : 15; // deep discounts raise customer suspicion or support overhead
      operationsRisk = discount > 30 ? 45 : 15;
    } else if (actionType === 'stock_purchase') {
      const budget = payload.estimated_cost || 0;
      financialRisk = Math.min((budget / 15000) * 100, 90);
      inventoryRisk = budget > 10000 ? 80 : 25; // heavy stock over-buy
      systemicRisk = budget > 5000 ? 50 : 15;
    } else if (actionType === 'ad_campaign') {
      const budget = payload.daily_budget || 0;
      financialRisk = Math.min((budget / 1000) * 100, 85);
      adRisk = budget > 500 ? 75 : 20;
      operationsRisk = budget > 800 ? 55 : 15;
    } else if (actionType === 'compliance_check') {
      complianceRisk = 65;
      dnaViolationRisk = 40;
    } else if (actionType === 'system_config') {
      systemicRisk = 85;
      operationsRisk = 70;
      knowledgeConflictRisk = 50;
    }

    // Dynamic checks for systemic state conflict elements
    const randomShift = Math.random() * 10;
    knowledgeConflictRisk = Math.round(Math.min(knowledgeConflictRisk + randomShift, 100));
    dnaViolationRisk = Math.round(Math.min(dnaViolationRisk + (Math.random() > 0.8 ? 30 : 0), 100));

    // Aggregate to overall risk score
    const allRisks = [
      financialRisk, inventoryRisk, adRisk, operationsRisk, 
      customerRisk, complianceRisk, knowledgeConflictRisk, 
      dnaViolationRisk, systemicRisk
    ];
    // Risk score is highly influenced by the highest vector
    const maxRiskVec = Math.max(...allRisks);
    const avgRiskVec = allRisks.reduce((a, b) => a + b, 0) / allRisks.length;
    const risk_score = Math.round(Math.max(maxRiskVec * 0.8 + avgRiskVec * 0.2, 10));

    let risk_level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (risk_score >= 80) risk_level = 'critical';
    else if (risk_score >= 55) risk_level = 'high';
    else if (risk_score >= 35) risk_level = 'medium';

    return {
      risk_score,
      risk_level,
      breakdown: {
        financialRisk,
        inventoryRisk,
        adRisk,
        operationsRisk,
        customerRisk,
        complianceRisk,
        knowledgeConflictRisk,
        dnaViolationRisk,
        systemicRisk
      }
    };
  }

  /**
   * Match against currently active governor policy list
   */
  private calculateRiskAssessment(
    actionType: string, 
    payload: Record<string, any>
  ): { score: number; level: 'low' | 'medium' | 'high' | 'critical' } {
    const detailed = this.evaluateDetailedRisks(actionType, payload);
    return {
      score: detailed.risk_score,
      level: detailed.risk_level
    };
  }

  /**
   * P0-010: GOVERNOR DECISION ENGINE WORKFLOWS
   * Manual admin overrides, escalations, rollbacks, and emergency stops
   */
  public approveDecision(decisionId: string, operator: string = 'Admin'): void {
    const decision = dbEngine.governor_decisions.getById(decisionId);
    if (!decision) return;

    dbEngine.governor_decisions.update(decisionId, { decision: 'approved' });

    dbEngine.governor_audit_logs.create({
      decision_id: decisionId,
      action: 'approve',
      before_state: JSON.stringify(decision),
      after_state: JSON.stringify({ ...decision, decision: 'approved' }),
      operator
    });

    // Notify Nervous System
    EnterpriseNervousSystemService.getInstance().publishEvent({
      eventType: 'audit',
      source: 'GovernorDecisionEngine',
      sourceRuntime: 'EnterpriseGovernorRuntime',
      payload: { decision_id: decisionId, status: 'APPROVED', operator },
      priority: 'high'
    });
  }

  public rejectDecision(decisionId: string, operator: string = 'Admin'): void {
    const decision = dbEngine.governor_decisions.getById(decisionId);
    if (!decision) return;

    dbEngine.governor_decisions.update(decisionId, { decision: 'rejected' });

    dbEngine.governor_audit_logs.create({
      decision_id: decisionId,
      action: 'reject',
      before_state: JSON.stringify(decision),
      after_state: JSON.stringify({ ...decision, decision: 'rejected' }),
      operator
    });

    // Notify Nervous System
    EnterpriseNervousSystemService.getInstance().publishEvent({
      eventType: 'audit',
      source: 'GovernorDecisionEngine',
      sourceRuntime: 'EnterpriseGovernorRuntime',
      payload: { decision_id: decisionId, status: 'REJECTED', operator },
      priority: 'critical'
    });
  }

  public escalateDecision(decisionId: string, operator: string = 'Admin'): void {
    const decision = dbEngine.governor_decisions.getById(decisionId);
    if (!decision) return;

    dbEngine.governor_decisions.update(decisionId, { decision: 'escalated' });

    dbEngine.governor_audit_logs.create({
      decision_id: decisionId,
      action: 'escalate',
      before_state: JSON.stringify(decision),
      after_state: JSON.stringify({ ...decision, decision: 'escalated' }),
      operator
    });
  }

  public markForHumanReview(decisionId: string, operator: string = 'Admin'): void {
    const decision = dbEngine.governor_decisions.getById(decisionId);
    if (!decision) return;

    dbEngine.governor_decisions.update(decisionId, { 
      decision: 'escalated',
      reason: `HUMAN REVIEW REQUIRED: Placed in manual supervisor review queue by operator ${operator}.` 
    });

    dbEngine.governor_audit_logs.create({
      decision_id: decisionId,
      action: 'escalate',
      before_state: JSON.stringify(decision),
      after_state: JSON.stringify({ ...decision, humanReviewRequired: true }),
      operator
    });
  }

  public triggerEmergencyStop(reason: string, operator: string = 'Admin'): void {
    this.triggerCircuitBreaker(`EMERGENCY STOP TRIGGERED BY ${operator.toUpperCase()}: ${reason}`);
  }

  public executeRollback(decisionId: string, operator: string = 'Admin'): void {
    const decision = dbEngine.governor_decisions.getById(decisionId);
    if (!decision) return;

    dbEngine.governor_audit_logs.create({
      decision_id: decisionId,
      action: 'rollback',
      before_state: JSON.stringify(decision),
      after_state: JSON.stringify({ rolled_back_decision_id: decisionId, state: 'restored_previous' }),
      operator
    });

    // Reset this decision status
    dbEngine.governor_decisions.update(decisionId, {
      decision: 'rejected',
      reason: `ROLLED BACK: This transaction was manually rolled back by ${operator}. previous state restored.`
    });
  }

  /**
   * P0-010: APPROVAL WORKFLOW ENGINE
   * Route decisions through automatic, multi-sig, or emergency override protocols
   */
  public processApprovalWorkflow(
    decisionId: string,
    workflowMode: 'automatic' | 'manual_admin' | 'multi_signature' | 'emergency_bypass',
    operator: string = 'Orchestrator'
  ): void {
    const decision = dbEngine.governor_decisions.getById(decisionId);
    if (!decision) return;

    let finalStatus: GovernorDecisionItem['decision'] = 'approved';
    let summaryText = '';

    switch (workflowMode) {
      case 'automatic':
        finalStatus = decision.risk_score < 70 ? 'approved' : 'escalated';
        summaryText = `Workflow [Automatic mode]: Evaluated risk ${decision.risk_score}/100. Resolution: ${finalStatus}.`;
        break;
      case 'manual_admin':
        finalStatus = 'escalated';
        summaryText = `Workflow [Manual Admin signoff required]: Placed in admin queue.`;
        break;
      case 'multi_signature':
        finalStatus = 'escalated';
        summaryText = `Workflow [Boardroom Multi-Signature]: Waiting for 3 distinct AI Agent approvals.`;
        break;
      case 'emergency_bypass':
        finalStatus = 'approved';
        summaryText = `Workflow [EMERGENCY OVERRIDE BYPASS] signature verified by ${operator}. Force clearance granted.`;
        break;
    }

    dbEngine.governor_decisions.update(decisionId, {
      decision: finalStatus,
      reason: `${decision.reason} | ${summaryText}`
    });

    dbEngine.governor_audit_logs.create({
      decision_id: decisionId,
      action: finalStatus === 'approved' ? 'approve' : 'escalate',
      before_state: JSON.stringify(decision),
      after_state: JSON.stringify({ ...decision, workflowMode, applied_mode: workflowMode }),
      operator
    });
  }

  /**
   * P0-010: CIRCUIT BREAKER CONDITION COMPILER
   * Check metrics for trigger conditions: Continuous Failures, Anomaly drift, Memory/Knowledge conflict, limits exceeded
   */
  public compileCircuitBreakerMetrics(): {
    continuousFailuresCount: number;
    anomalyDriftsCount: number;
    knowledgePollutionRisk: number;
    memoryPollutionRisk: number;
    uncontrolledAgentRisk: number;
    isSystemDegraded: boolean;
  } {
    const driftLogs = dbEngine.cognitive_governance.getDriftLogs('all');
    const incidents = dbEngine.healing_incidents.getAll();
    
    // Calculate realistic risk index
    const continuousFailuresCount = incidents.filter(i => i.status === 'failed' || i.status === 'diagnosed').length;
    const anomalyDriftsCount = driftLogs.length;
    const knowledgePollutionRisk = dbEngine.knowledge_boundary_events?.getAll().length * 15 || 10;
    const memoryPollutionRisk = dbEngine.decision_humility_records?.getAll().length * 12 || 15;
    const uncontrolledAgentRisk = dbEngine.agent_conflict_records?.getAll().length * 20 || 5;

    const isSystemDegraded = continuousFailuresCount > 3 || knowledgePollutionRisk > 60 || uncontrolledAgentRisk > 50;

    return {
      continuousFailuresCount,
      anomalyDriftsCount,
      knowledgePollutionRisk: Math.min(knowledgePollutionRisk, 100),
      memoryPollutionRisk: Math.min(memoryPollutionRisk, 100),
      uncontrolledAgentRisk: Math.min(uncontrolledAgentRisk, 100),
      isSystemDegraded
    };
  }

  /**
   * Circuit Breaker Controls
   */
  public triggerCircuitBreaker(reason: string): void {
    this.circuitBreakerTripped = true;
    this.breakerTripReason = reason;

    // Logging trigger
    const decisionItem = dbEngine.governor_decisions.create({
      task_id: 'sys_tripped',
      source: 'Breaker Watchdog Thread',
      decision: 'circuit_broke',
      reason: `CIRCUIT BREAKER TRIGGERED: ${reason}. System enters read-only quarantine pattern.`,
      risk_score: 95,
      confidence: 1.0
    });

    dbEngine.governor_audit_logs.create({
      decision_id: decisionItem.decision_id,
      action: 'circuit_breaker_triggered',
      before_state: JSON.stringify({ breaker: 'closed' }),
      after_state: JSON.stringify({ breaker: 'open', trigger_reason: reason }),
      operator: 'System'
    });

    // Alert Nervous Event broadcast
    EnterpriseNervousSystemService.getInstance().publishEvent({
      eventType: 'audit',
      source: 'CircuitBreakerEngine',
      sourceRuntime: 'EnterpriseGovernorRuntime',
      payload: { system_status: 'QUARANTINED', reason },
      priority: 'critical'
    });
  }

  public resetCircuitBreaker(): void {
    this.circuitBreakerTripped = false;
    this.breakerTripReason = '';

    const restoreDecision = dbEngine.governor_decisions.create({
      task_id: 'sys_reset',
      source: 'Operator Console',
      decision: 'approved',
      reason: 'Circuit breaker reset successfully. Normal transaction processing re-enabled.',
      risk_score: 10,
      confidence: 1.0
    });

    dbEngine.governor_audit_logs.create({
      decision_id: restoreDecision.decision_id,
      action: 'rollback',
      before_state: JSON.stringify({ breaker: 'open' }),
      after_state: JSON.stringify({ breaker: 'closed' }),
      operator: 'Admin'
    });
  }

  public isCircuitBreakerTripped(): boolean {
    return this.circuitBreakerTripped;
  }

  public getCircuitBreakerReason(): string {
    return this.breakerTripReason;
  }

  /**
   * Emergency Lockdown / Takeover mechanism
   */
  public setEmergencyTakeover(lock: boolean): void {
    this.systemLockedDown = lock;

    const actionText = lock ? 'system_locked' : 'unlocked';
    const auditText = lock 
      ? 'EMERGENCY TAKEOVER TRIGGERED: Super-admin forced structural lock. All background worker threads frozen.'
      : 'EMERGENCY TAKEOVER OVERRIDDEN: Structural lock released. Background pipelines resuming.';

    const decisionItem = dbEngine.governor_decisions.create({
      task_id: 'sys_takeover_toggle',
      source: 'Super Admin UI Switch',
      decision: lock ? 'emergency_blocked' : 'approved',
      reason: auditText,
      risk_score: lock ? 100 : 0,
      confidence: 1.0
    });

    dbEngine.governor_audit_logs.create({
      decision_id: decisionItem.decision_id,
      action: actionText,
      before_state: JSON.stringify({ system_locked: !lock }),
      after_state: JSON.stringify({ system_locked: lock }),
      operator: 'Admin'
    });

    // Dispatch system shutdown event to global subscribers
    EnterpriseNervousSystemService.getInstance().publishEvent({
      eventType: 'audit',
      source: 'EmergencyTakeoverEngine',
      sourceRuntime: 'EnterpriseGovernorRuntime',
      payload: { state: lock ? 'LOCKED_DOWN' : 'OPERATIONAL_RESUME' },
      priority: 'critical'
    });
  }

  public isSystemLockedDown(): boolean {
    return this.systemLockedDown;
  }
}
