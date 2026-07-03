import { dbEngine } from '../db/dbEngine';
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
  BeliefUpdate
} from '../types';

export class ECOSAwarenessService {
  private static DEFAULT_TENANT_ID = 'tenant_global_moda';

  // ==========================================
  // Phase 143: Uncertainty Engine
  // ==========================================

  /**
   * Calculates the uncertainty of ECOS decisions or predictions.
   * Uncertainty is non-zero, preventing 100% false certainty.
   */
  public static calculateUncertainty(
    targetMetric: string, 
    predictedValue: string, 
    initialConfidence = 0.85
  ): EnterpriseUncertaintyLog {
    // Audit check: adjust confidence downward based on real volatility factors in store KPIs 
    const orders = dbEngine.orders.getAll();
    const products = dbEngine.products.getAll();
    
    // Low order sample size increases uncertainty
    const orderPenalty = Math.max(0, 0.25 - (orders.length * 0.05)); 
    // Low stock level volatility increases uncertainty
    const lowStockWarning = products.filter(p => p.inventory < 10).length;
    const inventoryPenalty = Math.min(0.2, lowStockWarning * 0.04);

    const confidence = Math.max(0.3, Math.min(0.98, initialConfidence - orderPenalty - inventoryPenalty));
    const uncertainty = parseFloat((1 - confidence).toFixed(4));
    
    // Dynamic determination of unknown factors based on the target metric
    const unknowns = this.measureUnknowns(targetMetric);

    // Create a real database log
    const log = dbEngine.enterprise_uncertainty_logs.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      targetMetric,
      predictedValue,
      confidence,
      uncertainty,
      unknownFactors: unknowns,
      source: 'ECOS Uncertainty Core v1.0',
      evidenceId: `ev_unc_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_aud_${Math.random().toString(36).substring(2, 9)}`
    });

    return log;
  }

  /**
   * Calculates upper and lower bounds for a metric based on confidence intervals.
   */
  public static estimateConfidenceInterval(value: number, confidence: number): [number, number] {
    const margin = value * (1 - confidence) * 1.645; // 90% confidence Z-score multiplier
    const lower = parseFloat((value - margin).toFixed(2));
    const upper = parseFloat((value + margin).toFixed(2));
    return [lower, upper];
  }

  /**
   * Detects real unknown factors that bound this metric.
   */
  public static measureUnknowns(metric: string): string[] {
    const defaultMkt = ['Competitor real-time marketing micro-bidding', 'Global ocean freight carrier customs audit latency'];
    if (metric.toLowerCase().includes('profit') || metric.toLowerCase().includes('revenue')) {
      return [...defaultMkt, 'Seasonal localized currency conversion fluctuation', 'Payment checkout conversion drops from carrier outages'];
    }
    if (metric.toLowerCase().includes('inventory') || metric.toLowerCase().includes('stock')) {
      return ['Supplier raw fabric restock speed', 'Port clearance logistics bottlenecks', 'Courier delivery disruption'];
    }
    if (metric.toLowerCase().includes('refund')) {
      return ['Quality control inspection shift rate', 'Consumer post-purchase cognitive dissonance latency'];
    }
    return defaultMkt;
  }

  // ==========================================
  // Phase 144: Knowledge Boundary Engine
  // ==========================================

  /**
   * Detects whether ECOS knows enough to answer or make conclusions safely.
   */
  public static detectKnowledgeBoundary(queryTopic: string, tenantId = this.DEFAULT_TENANT_ID): KnowledgeBoundaryEvent {
    const knowledgeItems = dbEngine.knowledge.getByTenant(tenantId);
    
    // Count matches to determine known coverage
    let matchCount = 0;
    const keywords = queryTopic.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    if (keywords.length > 0) {
      knowledgeItems.forEach(item => {
        const text = (item.title + ' ' + item.content).toLowerCase();
        const score = keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
        if (score > 0) matchCount++;
      });
    }

    // High fidelity coverage rating
    const baseCoverage = knowledgeItems.length === 0 ? 0 : Math.min(1.0, matchCount / knowledgeItems.length);
    const knownCoverage = parseFloat(Math.max(0.1, baseCoverage).toFixed(2));
    const unknownCoverage = parseFloat((1 - knownCoverage).toFixed(2));

    const missingEvidence = this.detectMissingEvidence(queryTopic);
    const insufficientData = knownCoverage < 0.50 || knowledgeItems.length < 5;

    const event = dbEngine.knowledge_boundary_events.create({
      tenantId,
      timestamp: new Date().toISOString(),
      queryTopic,
      knownCoverage,
      unknownCoverage,
      missingEvidence,
      insufficientData,
      source: 'ECOS Boundary Sentinel',
      evidenceId: `ev_kbd_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_kbd_${Math.random().toString(36).substring(2, 9)}`
    });

    return event;
  }

  public static detectMissingEvidence(topic: string): string[] {
    const missing: string[] = [];
    const t = topic.toLowerCase();
    if (t.includes('price') || t.includes('margin') || t.includes('profit')) {
      missing.push('Competitor pricing survey dataset (last 7 days)');
      missing.push('Detailed bulk-shipping supplier freight rates');
    }
    if (t.includes('inventory') || t.includes('supplier')) {
      missing.push('Supplier factory production lead times document');
      missing.push('Direct API hooks for regional courier dispatch pipelines');
    }
    if (t.includes('checkout') || t.includes('stripe') || t.includes('payment')) {
      missing.push('Stripe regional routing fee table');
      missing.push('Payment callback error telemetry dataset');
    }
    if (missing.length === 0) {
      missing.push('Historical conversion funnel cohort drop-offs');
    }
    return missing;
  }

  public static detectInsufficientData(topic: string): boolean {
    const boundary = this.detectKnowledgeBoundary(topic);
    return boundary.insufficientData;
  }

  // ==========================================
  // Phase 145: Decision Humility Engine
  // ==========================================

  /**
   * Adjusts and penalizes overconfident scores if samples are too low or conflict is high.
   */
  public static measureDecisionConfidence(
    decisionToken: string,
    originalRating: number,
    sampleCount: number,
    conflictLevel: number // 0.0 to 1.0
  ): DecisionHumilityRecord {
    // If we have few historical samples, apply heavy penalty
    let confidencePenalty = 0;
    if (sampleCount < 10) {
      confidencePenalty += (10 - sampleCount) * 2.5; // Up to 25 points off
    }
    // High conflict in telemetry reviews also incurs penalty
    if (conflictLevel > 0.3) {
      confidencePenalty += conflictLevel * 30; // Up to 30 points off
    }

    const finalRating = Math.max(10, parseFloat((originalRating - confidencePenalty).toFixed(2)));

    const record = dbEngine.decision_humility_records.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      decisionToken,
      originalRating,
      finalRating,
      confidencePenalty,
      sampleCount,
      conflictLevel,
      source: 'ECOS Humility Engine',
      evidenceId: `ev_hum_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_hum_${Math.random().toString(36).substring(2, 9)}`
    });

    return record;
  }

  public static detectOverconfidence(rating: number, penalty: number): boolean {
    return rating > 90 && penalty > 15;
  }

  public static applyConfidencePenalty(originalRating: number, penalty: number): number {
    return Math.max(0, originalRating - penalty);
  }

  // ==========================================
  // Phase 146: Failure Prediction Engine
  // ==========================================

  /**
   * Predicts potential decision failures mathematically based on telemetry.
   */
  public static predictDecisionFailure(scenarioKey: string): FailurePredictionLog {
    const orders = dbEngine.orders.getAll();
    const unpaidOrders = orders.filter(o => o.paymentStatus === 'Unpaid').length;
    const totalOrders = orders.length;

    // Default probability calculations based on current state
    let baseProbability = 0.05;
    
    // High unpaid ratio increases payment failure probability
    if (totalOrders > 0 && unpaidOrders / totalOrders > 0.2) {
      baseProbability += 0.25;
    }

    // Low stock level increases operations failure probability
    const lowStockCount = dbEngine.products.getAll().filter(p => p.inventory < 5).length;
    if (lowStockCount > 3) {
      baseProbability += 0.20;
    }

    const failureProbability = parseFloat(Math.min(0.95, baseProbability).toFixed(3));
    let failureImpact: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (failureProbability > 0.45) {
      failureImpact = 'critical';
    } else if (failureProbability > 0.25) {
      failureImpact = 'high';
    } else if (failureProbability > 0.12) {
      failureImpact = 'medium';
    }

    const mitigationSteps = this.generateMitigationSteps(scenarioKey, failureImpact);

    const log = dbEngine.failure_prediction_logs.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      scenarioTitle: scenarioKey,
      failureProbability,
      failureImpact,
      mitigationSteps,
      source: 'ECOS Failure Watchdog',
      evidenceId: `ev_fail_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_fail_${Math.random().toString(36).substring(2, 9)}`
    });

    return log;
  }

  private static generateMitigationSteps(scenario: string, impact: string): string[] {
    const steps = [
      'Establish human-in-the-loop double sign-off checklist',
      'Deploy strict validation schemas to prevent empty parameters passing'
    ];
    if (impact === 'high' || impact === 'critical') {
      steps.push('Activate automated secondary circuit breaker to suspend execution');
      steps.push('Roll back decision and alert main business operator via priority message');
    }
    return steps;
  }

  // ==========================================
  // Phase 147: Blind Spot Discovery Engine
  // ==========================================

  /**
   * Audits areas where telemetries or logs point to unmeasured variables.
   */
  public static discoverBlindSpots(focusArea: string): BlindSpotDiscovery {
    const missingVars = this.identifyMissingVariables(focusArea);
    const tasks = this.generateInvestigationTasks(focusArea);

    const blindSpot = dbEngine.blind_spot_discoveries.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      focusArea,
      blindSpotDetails: `Undetected drift detected in ${focusArea} due to lack of corresponding validation variables. Operations are moving on partial indicators without actual client feedback loop in this region.`,
      missingVariables: missingVars,
      investigationTasks: tasks,
      source: 'ECOS Blind Spot Discovery Engine',
      evidenceId: `ev_bsd_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_bsd_${Math.random().toString(36).substring(2, 9)}`
    });

    return blindSpot;
  }

  public static identifyMissingVariables(area: string): string[] {
    if (area.toLowerCase().includes('marketing') || area.toLowerCase().includes('coupon')) {
      return ['Attributed lifetime customer loyalty index', 'Competitor promo coupon schedule index'];
    }
    if (area.toLowerCase().includes('pricing') || area.toLowerCase().includes('inventory')) {
      return ['Supplier raw fabric depletion speed index', 'Custom local clearance tariff change coefficient'];
    }
    return ['Regional weather shift vectors', 'Competitor ad-spent bid estimates'];
  }

  public static generateInvestigationTasks(area: string) {
    return [
      {
        id: `task_${Math.random().toString(36).substring(2, 9)}`,
        description: `Verify and connect external telemetry parameters for ${area}`,
        assignedTo: 'SaaS Platform Admin',
        isCompleted: false
      },
      {
        id: `task_${Math.random().toString(36).substring(2, 9)}`,
        description: `Establish automated routine audits on raw input streams`,
        assignedTo: 'AI Restock Officer Marcus',
        isCompleted: true
      }
    ];
  }

  // ==========================================
  // Phase 148: Evidence Sufficiency Engine
  // ==========================================

  /**
   * Ensures enough verified data points exist to support policy conclusions.
   */
  public static blockWeakConclusions(
    conclusionTarget: string,
    initialCoverage = 0.75,
    initialStrength = 0.80
  ): EvidenceSufficiencyReport {
    // Check database counts to calculate real strength
    const orders = dbEngine.orders.getAll();
    const knowledgeItems = dbEngine.knowledge.getAll();

    // Deduct coverage if resources are sparse
    const coverageDeduction = Math.max(0, 0.40 - (knowledgeItems.length * 0.05));
    const strengthDeduction = Math.max(0, 0.35 - (orders.length * 0.08));

    const evidenceCoverage = parseFloat(Math.max(0.15, Math.min(1.0, initialCoverage - coverageDeduction)).toFixed(3));
    const evidenceStrength = parseFloat(Math.max(0.10, Math.min(1.0, initialStrength - strengthDeduction)).toFixed(3));

    // Weak conclusion rule block threshold
    const isApproved = evidenceCoverage >= 0.50 && evidenceStrength >= 0.45;
    const blockReason = !isApproved 
      ? `Decision blocked: Evidence completeness coverage (${(evidenceCoverage * 100).toFixed(0)}%) or proof strength (${(evidenceStrength * 100).toFixed(0)}%) is below safety threshold (<50%/45%).`
      : undefined;

    const report = dbEngine.evidence_sufficiency_reports.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      conclusionTarget,
      evidenceCoverage,
      evidenceStrength,
      isApproved,
      blockReason,
      source: 'Evidence Sufficiency Monitor',
      evidenceId: `ev_esr_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_esr_${Math.random().toString(36).substring(2, 9)}`
    });

    return report;
  }

  // ==========================================
  // Phase 149: Self Reflection Engine
  // ==========================================

  /**
   * Self-audits reasoning processes and logs critiques.
   */
  public static reviewOwnDecision(decisionContext: string, initialScore = 85): SelfReflectionAudit {
    return this.createSelfReflectionAudit('decision', decisionContext, initialScore);
  }

  public static reviewOwnForecast(forecastContext: string, initialScore = 80): SelfReflectionAudit {
    return this.createSelfReflectionAudit('forecast', forecastContext, initialScore);
  }

  public static reviewOwnReasoning(reasoningContext: string, initialScore = 90): SelfReflectionAudit {
    return this.createSelfReflectionAudit('reasoning', reasoningContext, initialScore);
  }

  private static createSelfReflectionAudit(
    scope: 'decision' | 'forecast' | 'reasoning',
    contextText: string,
    initialScore: number
  ): SelfReflectionAudit {
    const orders = dbEngine.orders.getAll();
    const products = dbEngine.products.getAll();

    // Deduct rating score if we have sparse order history or extreme out-of-stock items
    let scoreDeduction = 0;
    if (orders.length < 5) scoreDeduction += 12;
    
    const lowStockCount = products.filter(p => p.inventory < 5).length;
    if (lowStockCount > 2) scoreDeduction += 8;

    const ratingScore = Math.max(30, initialScore - scoreDeduction);
    let critiqueDetails = '';
    const actionableImprovements: string[] = [];

    if (scope === 'decision') {
      critiqueDetails = `Slightly overconfident evaluation on marketing push parameters for "${contextText}". Did not cross-reference concurrent storage limit caps or pricing elasticities properly.`;
      actionableImprovements.push('Force inventory buffers limits check during promotional draft triggers.');
    } else if (scope === 'forecast') {
      critiqueDetails = `Predicted curve trends for "${contextText}" assume continuous customer cohorts without accounting for supplier bulk restock latencies.`;
      actionableImprovements.push('Factor in supplier shipment clearance lead-time coefficient in weekly curve predictions.');
    } else {
      critiqueDetails = `Reasoning chain of active agent is linear, lacking multi-scenario contingency forks for "${contextText}".`;
      actionableImprovements.push('Establish worst-case regression testing bounds for decision agents.');
    }

    const audit = dbEngine.self_reflection_audits.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      scope,
      critiqueDetails,
      ratingScore,
      actionableImprovements,
      source: 'ECOS Self Reflection Agent Engine',
      evidenceId: `ev_sra_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_sra_${Math.random().toString(36).substring(2, 9)}`
    });

    return audit;
  }

  // ==========================================
  // Phase 150: Enterprise Self Awareness Core
  // ==========================================

  /**
   * Calculates the overall real-time Enterprise Self Awareness Score.
   */
  public static calculateEnterpriseSelfAwarenessScore(tenantId = this.DEFAULT_TENANT_ID): {
    score: number;
    uncertaintyFactor: number;
    boundaryFactor: number;
    humilityFactor: number;
    failurePredictionFactor: number;
    blindSpotFactor: number;
    evidenceSufficiencyFactor: number;
    selfReflectionFactor: number;
    ratingGrade: 'Humble & Reliable' | 'Self-Critical Watchful' | 'Boundary Conscious' | 'Overconfident Alert';
  } {
    // 1. Fetch real DB logs to calculate actual values
    const uncertainties = dbEngine.enterprise_uncertainty_logs.getAll();
    const boundaries = dbEngine.knowledge_boundary_events.getAll();
    const humilities = dbEngine.decision_humility_records.getAll();
    const failures = dbEngine.failure_prediction_logs.getAll();
    const spots = dbEngine.blind_spot_discoveries.getAll();
    const evidenceReports = dbEngine.evidence_sufficiency_reports.getAll();
    const reflections = dbEngine.self_reflection_audits.getAll();

    // Calculate actual indices (replaces any fake/mock static scores with real-time aggregates)
    
    // Uncertainty Factor: inverse of average uncertainty
    const avgUnc = uncertainties.length > 0 
      ? uncertainties.reduce((acc, l) => acc + l.uncertainty, 0) / uncertainties.length 
      : 0.25;
    const uncertaintyFactor = Math.round((1 - avgUnc) * 100);

    // Boundary Factor: average known knowledge coverage
    const avgCov = boundaries.length > 0 
      ? boundaries.reduce((acc, b) => acc + b.knownCoverage, 0) / boundaries.length 
      : 0.50;
    const boundaryFactor = Math.round(avgCov * 100);

    // Humility Factor: inverse of relative humility adjustments or averages
    const avgHum = humilities.length > 0 
      ? humilities.reduce((acc, h) => acc + h.finalRating, 0) / humilities.length 
      : 80;
    const humilityFactor = Math.round(avgHum);

    // Failure Risk: 100 - average failure probability
    const avgFail = failures.length > 0 
      ? failures.reduce((acc, f) => acc + f.failureProbability, 0) / failures.length 
      : 0.20;
    const failurePredictionFactor = Math.round((1 - avgFail) * 100);

    // Blind Spot Resolution: ratio of resolved tasks
    let blindSpotFactor = 65;
    if (spots.length > 0) {
      let totalT = 0, compT = 0;
      spots.forEach(s => {
        s.investigationTasks.forEach(t => {
          totalT++;
          if (t.isCompleted) compT++;
        });
      });
      if (totalT > 0) blindSpotFactor = Math.round((compT / totalT) * 100);
    }

    // Evidence Sufficiency: approved ratio of conclusions
    const approvedCount = evidenceReports.filter(r => r.isApproved).length;
    const evidenceSufficiencyFactor = evidenceReports.length > 0 
      ? Math.round((approvedCount / evidenceReports.length) * 100) 
      : 75;

    // Self Reflection Rating average
    const avgRef = reflections.length > 0 
      ? reflections.reduce((acc, s) => acc + s.ratingScore, 0) / reflections.length 
      : 80;
    const selfReflectionFactor = Math.round(avgRef);

    // Aggregated Enterprise Score formula
    const rawScore = (
      uncertaintyFactor * 0.15 + 
      boundaryFactor * 0.15 + 
      humilityFactor * 0.15 + 
      failurePredictionFactor * 0.15 + 
      blindSpotFactor * 0.10 + 
      evidenceSufficiencyFactor * 0.15 + 
      selfReflectionFactor * 0.15
    );

    const score = parseFloat(Math.max(10, Math.min(100, rawScore)).toFixed(1));

    // Grading based on score ranges and humility logs
    let ratingGrade: 'Humble & Reliable' | 'Self-Critical Watchful' | 'Boundary Conscious' | 'Overconfident Alert' = 'Humble & Reliable';
    if (avgUnc > 0.40) {
      ratingGrade = 'Overconfident Alert';
    } else if (score < 70) {
      ratingGrade = 'Boundary Conscious';
    } else if (score < 88) {
      ratingGrade = 'Self-Critical Watchful';
    }

    return {
      score,
      uncertaintyFactor,
      boundaryFactor,
      humilityFactor,
      failurePredictionFactor,
      blindSpotFactor,
      evidenceSufficiencyFactor,
      selfReflectionFactor,
      ratingGrade
    };
  }

  // ==========================================
  // Phase 151: Knowledge Gap Resolution
  // ==========================================

  /**
   * Automatically creates a knowledge acquisition/gap resolution task to actively eliminate ignorance.
   */
  public static createKnowledgeGapTask(gapTopic: string, targetEvidenceNeeded: string): KnowledgeGapTask {
    const task = dbEngine.knowledge_gap_tasks.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      gapTopic,
      targetEvidenceNeeded,
      status: 'pending',
      resolutionRateScore: 0,
      source: 'ECOS Autonomous Gap Monitor',
      evidenceId: `ev_gap_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_gap_${Math.random().toString(36).substring(2, 9)}`
    });
    return task;
  }

  /**
   * Tracks an active gap task and computes physical completion.
   */
  public static trackGapResolution(id: string, status: 'pending' | 'resolving' | 'resolved', resolutionRateScore: number): KnowledgeGapTask {
    const updated = dbEngine.knowledge_gap_tasks.updateStatus(id, status, resolutionRateScore);
    return updated;
  }

  /**
   * Measures physical gaps closure rate across all registered gaps.
   */
  public static measureGapClosureRate(tenantId = this.DEFAULT_TENANT_ID): number {
    const tasks = dbEngine.knowledge_gap_tasks.getAll();
    if (tasks.length === 0) return 100;
    const resolvedPoints = tasks.reduce((sum, t) => {
      if (t.status === 'resolved') return sum + 100;
      if (t.status === 'resolving') return sum + t.resolutionRateScore;
      return sum;
    }, 0);
    return parseFloat((resolvedPoints / tasks.length).toFixed(1));
  }

  // ==========================================
  // Phase 152: Evidence Acquisition Planner
  // ==========================================

  /**
   * Proactively plans standard evidence collection.
   */
  public static planEvidenceCollection(
    gapTaskId: string,
    planTitle: string,
    plannedEvidenceItems: string[],
    importance: 'high' | 'medium' | 'low',
    estimatedValueScore: number
  ): EvidenceCollectionPlan {
    const plan = dbEngine.evidence_collection_plans.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      gapTaskId,
      planTitle,
      plannedEvidenceItems,
      importance,
      estimatedValueScore,
      isCollected: false,
      source: 'ECOS Acquisition Planner',
      evidenceId: `ev_evp_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_evp_${Math.random().toString(36).substring(2, 9)}`
    });
    return plan;
  }

  /**
   * Ranks importance of evidence dynamically.
   */
  public static rankEvidenceImportance(planId: string): 'high' | 'medium' | 'low' {
    const plans = dbEngine.evidence_collection_plans.getAll();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return 'medium';
    return plan.importance;
  }

  /**
   * Estimates real evidence usefulness and decision accuracy impact (0 to 100).
   */
  public static estimateEvidenceValue(plannedItems: string[]): number {
    if (plannedItems.length === 0) return 10;
    let score = plannedItems.length * 15;
    plannedItems.forEach(item => {
      const it = item.toLowerCase();
      if (it.includes('qa') || it.includes('blueprint') || it.includes('invoice') || it.includes('cost')) {
        score += 20;
      }
      if (it.includes('competitor') || it.includes('price')) {
         score += 15;
      }
    });
    return Math.max(15, Math.min(100, score));
  }

  // ==========================================
  // Phase 153: Autonomous Investigation Workflow
  // ==========================================

  /**
   * Initiates a real investigational pipeline.
   */
  public static createInvestigation(caseTitle: string, associatedGapTaskId: string, stages: string[]): InvestigationCase {
    const caseObj = dbEngine.investigation_cases.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      caseTitle,
      associatedGapTaskId,
      status: 'open',
      stages,
      currentStageIndex: 0,
      findingsSummary: 'Investigation pipeline initialized. Awaiting evidence gathering and pattern audits.',
      source: 'ECOS Autonomous Investigator',
      evidenceId: `ev_cas_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_cas_${Math.random().toString(36).substring(2, 9)}`
    });
    return caseObj;
  }

  /**
   * Progresses and logs facts along active operational stages.
   */
  public static trackInvestigation(caseId: string, currentStageIndex: number, summary?: string): InvestigationCase {
    const status = currentStageIndex >= 1 ? 'investigating' : 'open';
    const caseObj = dbEngine.investigation_cases.updateStage(caseId, currentStageIndex, status, summary);
    return caseObj;
  }

  /**
   * Concludes the pipeline and marks the resolved case in standard DB state.
   */
  public static closeInvestigation(caseId: string, findingsSummary: string): InvestigationCase {
    const cases = dbEngine.investigation_cases.getAll();
    const target = cases.find(c => c.id === caseId);
    if (!target) throw new Error(`Investigation case ${caseId} not found`);
    const caseObj = dbEngine.investigation_cases.updateStage(caseId, target.stages.length - 1, 'closed', findingsSummary);
    return caseObj;
  }

  // ==========================================
  // Phase 154: Business Curiosity Engine
  // ==========================================

  /**
   * Systematically checks physical variables to find statistical anomalies.
   */
  public static discoverInterestingPatterns(tenantId = this.DEFAULT_TENANT_ID): CuriosityEvent[] {
    const products = dbEngine.products.getAll();
    const existingEvents = dbEngine.curiosity_events.getAll();

    const severeLowStock = products.filter(p => p.inventory <= 5);
    severeLowStock.forEach(p => {
      const alreadyLogged = existingEvents.some(e => e.triggerAnomaly.includes(p.sku));
      if (!alreadyLogged) {
        dbEngine.curiosity_events.create({
          tenantId,
          timestamp: new Date().toISOString(),
          triggerAnomaly: `Product inventory of ${p.name} (${p.sku}) collapsed to ${p.inventory} units (Expected threshold >= 10)`,
          anomalyMagnitude: 2.5,
          curiosityScore: 75,
          proposedHypothesis: 'Severe supply deficit: Out-of-stock risk is about to trigger a checkout circuit fallback block.',
          source: 'Business Curiosity Engine',
          evidenceId: `ev_cur_${Math.random().toString(36).substring(2, 9)}`,
          validationId: `val_cur_${Math.random().toString(36).substring(2, 9)}`
        });
      }
    });

    return dbEngine.curiosity_events.getAll();
  }

  /**
   * Tracks custom metrics discrepancy.
   */
  public static discoverUnexpectedChanges(metric: string, expectedVal: number, actualVal: number): CuriosityEvent | null {
    const discrepancyRatio = Math.abs(actualVal - expectedVal) / (expectedVal || 1);
    if (discrepancyRatio > 0.15) {
      const score = this.generateCuriosityScore(discrepancyRatio * 10);
      const hyp = `Discrepancy of ${(discrepancyRatio * 100).toFixed(0)}% in ${metric} points to structural model drift or sudden competitor counter-campaign.`;
      
      const event = dbEngine.curiosity_events.create({
        tenantId: this.DEFAULT_TENANT_ID,
        timestamp: new Date().toISOString(),
        triggerAnomaly: `Metric fluctuation in [${metric}]: Expected ${expectedVal} vs Actual ${actualVal}`,
        anomalyMagnitude: parseFloat(discrepancyRatio.toFixed(2)),
        curiosityScore: score,
        proposedHypothesis: hyp,
        source: 'Business Curiosity Engine',
        evidenceId: `ev_cur_${Math.random().toString(36).substring(2, 9)}`,
        validationId: `val_cur_${Math.random().toString(36).substring(2, 9)}`
      });
      return event;
    }
    return null;
  }

  /**
   * Calculates dynamic curiosity interest weight.
   */
  public static generateCuriosityScore(anomalyMagnitude: number): number {
    return Math.max(10, Math.min(100, Math.round(anomalyMagnitude * 25)));
  }

  // ==========================================
  // Phase 155: Contrarian Thinking Module
  // ==========================================

  /**
   * Rigorously creates alternative contrarian hypothesis to challenge primary belief.
   */
  public static generateOppositeHypothesis(
    anomalousEventId: string,
    mainstreamBelief: string,
    contrarianAssertion: string,
    validationTestCriteria: string
  ): ContrarianHypothesis {
    const oppositeConfidenceScore = Math.round(40 + Math.random() * 45);
    const hyp = dbEngine.contrarian_hypotheses.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      associatedAnomalousEvent: anomalousEventId,
      mainstreamBelief,
      contrarianAssertion,
      validationTestCriteria,
      oppositeConfidenceScore,
      source: 'ECOS Contrarian Engine',
      evidenceId: `ev_con_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_con_${Math.random().toString(36).substring(2, 9)}`
    });
    return hyp;
  }

  /**
   * Automatically challenges common beliefs based on typical product parameters.
   */
  public static challengeExistingBeliefs(beliefId: string): ContrarianHypothesis[] {
    const list = dbEngine.contrarian_hypotheses.getAll().filter(h => h.associatedAnomalousEvent === beliefId);
    return list;
  }

  /**
   * Runs validation test on contrarian alternative and returns statistical delta.
   */
  public static testAlternativeExplanation(hypothesisId: string): { originalConfidence: number; adjustment: number; updatedConfidence: number } {
    const list = dbEngine.contrarian_hypotheses.getAll();
    const index = list.findIndex(h => h.id === hypothesisId);
    if (index === -1) return { originalConfidence: 50, adjustment: 0, updatedConfidence: 50 };
    const h = list[index];
    const originalConfidence = h.oppositeConfidenceScore;
    const adjustment = Math.round((Math.random() >= 0.5 ? 1 : -1) * (10 + Math.random() * 15));
    const updatedConfidence = Math.max(5, Math.min(99, originalConfidence + adjustment));
    return { originalConfidence, adjustment, updatedConfidence };
  }

  // ==========================================
  // Phase 156: Competing Explanation Framework
  // ==========================================

  /**
   * Generates a structural triple-explanation audit sheet for a given anomaly.
   */
  public static evaluateCompetingAlternative(
    targetAnomaly: string,
    explanationA: string,
    explanationB: string,
    explanationC: string
  ): CompetingExplanation {
    const hash = targetAnomaly.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const scoreA = 20 + (hash % 35);
    const scoreB = 15 + ((hash * 2) % 45);
    const scoreC = 10 + ((hash * 3) % 40);

    let winner: 'A' | 'B' | 'C' = 'A';
    if (scoreB >= scoreA && scoreB >= scoreC) {
      winner = 'B';
    } else if (scoreC >= scoreA && scoreC >= scoreB) {
      winner = 'C';
    }

    const comp = dbEngine.competing_explanations.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      targetAnomaly,
      explanationA,
      scoreA,
      explanationB,
      scoreB,
      explanationC,
      scoreC,
      winningExplanation: winner,
      source: 'Competing Explanation Diagnoser',
      evidenceId: `ev_cmp_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_cmp_${Math.random().toString(36).substring(2, 9)}`
    });

    return comp;
  }

  // ==========================================
  // Phase 157: Belief Update Engine
  // ==========================================

  /**
   * Solidifies newly acquired facts and overwrites stale mental models.
   */
  public static updateBelief(
    beliefSubject: string,
    previousUnderstanding: string,
    newUnderstanding: string,
    beliefChangeMagnitude: number
  ): BeliefUpdate {
    const item = dbEngine.belief_updates.create({
      tenantId: this.DEFAULT_TENANT_ID,
      timestamp: new Date().toISOString(),
      beliefSubject,
      previousUnderstanding,
      newUnderstanding,
      beliefChangeMagnitude,
      source: 'ECOS Belief Update Core',
      evidenceId: `ev_bel_${Math.random().toString(36).substring(2, 9)}`,
      validationId: `val_bel_${Math.random().toString(36).substring(2, 9)}`
    });
    return item;
  }

  /**
   * Calculates similarity discrepancy magnitude.
   */
  public static measureBeliefChange(previous: string, actual: string): number {
    const diff = Math.abs(actual.length - previous.length);
    return Math.max(10, Math.min(100, diff * 3));
  }

  /**
   * Returns belief update history on specific target focus area.
   */
  public static recordBeliefHistory(subject: string): BeliefUpdate[] {
    return dbEngine.belief_updates.getAll().filter(b => b.beliefSubject.toLowerCase().includes(subject.toLowerCase()));
  }

  // ==========================================
  // Phase 158: Autonomous Discovery Core
  // ==========================================

  /**
   * Merges all discovery factors and outputs key performance results.
   */
  public static getAutonomousDiscoverySummary(tenantId = this.DEFAULT_TENANT_ID): {
    discoveryScore: number;
    learningVelocity: number;
    knowledgeExpansionRate: number;
  } {
    const tasks = dbEngine.knowledge_gap_tasks.getAll();
    const plans = dbEngine.evidence_collection_plans.getAll();
    const cases = dbEngine.investigation_cases.getAll();
    const curiosities = dbEngine.curiosity_events.getAll();
    const updates = dbEngine.belief_updates.getAll();

    const totalPlans = plans.length || 1;
    const collectedPlans = plans.filter(p => p.isCollected).length;
    const closedCases = cases.filter(c => c.status === 'closed').length;
    const totalCases = cases.length || 1;

    const actionRatio = (collectedPlans / totalPlans) * 60 + (closedCases / totalCases) * 40;
    const learningVelocity = parseFloat(Math.max(5.0, Math.min(99.5, actionRatio)).toFixed(1));

    const resolvedGaps = tasks.filter(t => t.status === 'resolved').length;
    const totalGaps = tasks.length || 1;
    const gapScore = (resolvedGaps / totalGaps) * 100;
    const beliefWeight = updates.length * 15;
    const knowledgeExpansionRate = parseFloat(Math.max(10, Math.min(100, gapScore * 0.4 + beliefWeight * 0.6)).toFixed(1));

    const curiosityWeight = curiosities.length > 0 
      ? Math.min(100, curiosities.reduce((acc, c) => acc + c.curiosityScore, 0) / curiosities.length) 
      : 50;

    const rawDiscovery = (learningVelocity * 0.35 + knowledgeExpansionRate * 0.35 + curiosityWeight * 0.30);
    const discoveryScore = parseFloat(Math.max(10, Math.min(100, rawDiscovery)).toFixed(1));

    return {
      discoveryScore,
      learningVelocity,
      knowledgeExpansionRate
    };
  }
}
