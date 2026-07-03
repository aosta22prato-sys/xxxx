import { dbEngine } from '../../db/dbEngine';
import { DecisionConfidence, StrategyPlan } from '../../types';

export class ConfidenceEngine {
  private static instance: ConfidenceEngine | null = null;
  private readonly RECOVERY_THRESHOLD = 70; // Any confidence score < 70 requires manual governance

  private constructor() {}

  public static getInstance(): ConfidenceEngine {
    if (!ConfidenceEngine.instance) {
      ConfidenceEngine.instance = new ConfidenceEngine();
    }
    return ConfidenceEngine.instance;
  }

  /**
   * Conducts full cognitive reasoning audit on any strategical campaign initiative, and calibrates its confidence ratings.
   * If any rating fails the risk threshold, locks auto-execution and registers critical safety locks for the Governor (宪法治理).
   */
  public evaluateCampaignConfidence(
    tenantId: string,
    strategyId: string,
    decisionType: 'replenishment' | 'pricing' | 'recall' | 'strategy'
  ): DecisionConfidence {
    const strategy = dbEngine.strategy_plans.getAll().find(s => s.id === strategyId);
    if (!strategy) {
      throw new Error(`Strategy plan ${strategyId} not found for confidence analysis.`);
    }

    // Get current tenant capabilities to adjust starting weights
    const capabilities = dbEngine.capability_scores.getAll().filter(c => c.tenant_id === tenantId);
    
    // Default weights
    let correspondingCapScore = 75; // safe normal
    if (decisionType === 'pricing' || strategy.title.includes('改价')) {
      const match = capabilities.find(c => c.category === 'pricing_model' || c.id.includes('ops'));
      if (match) correspondingCapScore = match.score;
    } else if (decisionType === 'replenishment' || strategy.title.includes('补货')) {
      const match = capabilities.find(c => c.category === 'inventory_opt');
      if (match) correspondingCapScore = match.score;
    } else if (decisionType === 'recall' || strategy.title.includes('召回')) {
      const match = capabilities.find(c => c.category === 'customer_recall');
      if (match) correspondingCapScore = match.score;
    }

    // Calculate complex, empirical confidence parameters
    const strategyBaseConfidence = strategy.confidence_score || 80;
    
    // Generate slight noise + offset calibrated by capability
    const decision_confidence = Math.min(100, Math.max(10, Math.round(strategyBaseConfidence * 0.4 + correspondingCapScore * 0.6)));
    const strategy_confidence = Math.min(100, Math.max(10, Math.round(strategyBaseConfidence * 0.8 + (Math.random() * 6 - 3))));
    const forecast_confidence = Math.min(100, Math.max(10, Math.round(correspondingCapScore * 0.7 + strategyBaseConfidence * 0.3 + (Math.random() * 4 - 2))));

    // Check if configuration triggers risk limits
    const lowestConfidence = Math.min(decision_confidence, strategy_confidence, forecast_confidence);
    const requires_governor_approval = lowestConfidence < this.RECOVERY_THRESHOLD;

    // Create a detailed breakdowns statement
    let breakdown = '';
    if (requires_governor_approval) {
      breakdown = `[理智警告] 本次策略 "${strategy.title}" 的最低置信度为 ${lowestConfidence}% (低于安全阈值 ${this.RECOVERY_THRESHOLD}%)。由于德国等大面积敏感区运营承受度低，为保护毛利流失率，系统已强制锁死自主运转通路，请求 SuperAdmin 在平台后台 AI 中枢审查并重构。`;
    } else {
      breakdown = `[理智通过] 本次运营战役最高置信度测度为 ${lowestConfidence}%，高出预警阈值。决策合理，符合历史经验沉淀，已获得自愈式自动执行授信许可！`;
    }

    // Upsert into DBState
    const existing = dbEngine.decision_confidences.getByDecisionRef(strategyId);
    const payload = {
      tenant_id: tenantId,
      decision_ref_id: strategyId,
      decision_type: decisionType,
      title: strategy.title,
      decision_confidence,
      strategy_confidence,
      forecast_confidence,
      requires_governor_approval,
      governor_status: requires_governor_approval ? 'pending_review' as const : 'auto_passed' as const,
      analysis_breakdown: breakdown
    };

    if (existing.length > 0) {
      return dbEngine.decision_confidences.update(existing[0].id, payload);
    } else {
      return dbEngine.decision_confidences.create(payload);
    }
  }

  /**
   * Action trigger for the Governor module: overrides and grants manual execution permission
   */
  public approveGovernorDecision(confidenceId: string, adminOpinion: string): DecisionConfidence {
    const record = dbEngine.decision_confidences.getById(confidenceId);
    if (!record) throw new Error(`DecisionConfidence ${confidenceId} not found.`);

    const updated = dbEngine.decision_confidences.update(confidenceId, {
      governor_status: 'approved',
      requires_governor_approval: false,
      analysis_breakdown: `[SuperAdmin 强行授信核准] 经过人机复核，已核发特殊行政豁免。审核意见: "${adminOpinion}"。`
    });

    return updated;
  }

  /**
   * Reject strategy execution
   */
  public rejectGovernorDecision(confidenceId: string, adminOpinion: string): DecisionConfidence {
    const record = dbEngine.decision_confidences.getById(confidenceId);
    if (!record) throw new Error(`DecisionConfidence ${confidenceId} not found.`);

    const updated = dbEngine.decision_confidences.update(confidenceId, {
      governor_status: 'rejected',
      requires_governor_approval: true,
      analysis_breakdown: `[SuperAdmin 拒绝并搁置] 已完全否决该项改价定价行为。驳回理由: "${adminOpinion}"。策略已回退归档。`
    });

    return updated;
  }

  /**
   * Phase 145: Measures decision confidence dynamically by combining base confidence,
   * available evidence metrics, and historical performance rates.
   */
  public measureDecisionConfidence(
    actionType: string,
    evidenceCount?: number,
    historySuccessRate?: number,
    baseConfidence: number = 85
  ): number {
    // 1. Resolve evidence count automatically if not supplied
    let resolvedEvidenceCount = typeof evidenceCount === 'number' ? evidenceCount : 0;
    if (typeof evidenceCount !== 'number') {
      try {
        const evidenceReports = dbEngine.evidence_sufficiency_reports?.getAll() || [];
        const plans = dbEngine.evidence_collection_plans?.getAll() || [];
        resolvedEvidenceCount = evidenceReports.length + plans.length;
        
        // Also add products matching or current contextual records as indirect evidence
        if (actionType === 'restock') {
          const lowStockProducts = (dbEngine.products?.getAll() || []).filter(p => (p as any).stock <= 10);
          resolvedEvidenceCount += lowStockProducts.length;
        } else if (actionType === 'campaign') {
          const promoModels = dbEngine.promotion_models?.getAll() || [];
          resolvedEvidenceCount += promoModels.length;
        }
      } catch (e) {
        resolvedEvidenceCount = 2; // secure fallback
      }
    }

    // 2. Resolve history success rate automatically if not supplied
    let resolvedSuccessRate = typeof historySuccessRate === 'number' ? historySuccessRate : 85;
    if (typeof historySuccessRate !== 'number') {
      try {
        const audits = dbEngine.execution_audits?.getAll() || [];
        if (audits.length > 0) {
          const cleanAudits = audits.filter(a => a.status === 'AUDITED');
          resolvedSuccessRate = Math.round((cleanAudits.length / audits.length) * 100);
        } else {
          resolvedSuccessRate = 90; // Default high for fresh setups
        }
      } catch (e) {
        resolvedSuccessRate = 80;
      }
    }

    // 3. Compute raw score (50% base, 20% evidence completeness, 30% historical track record weighting)
    const evidenceBonus = Math.min(20, resolvedEvidenceCount * 5); // Up to 20 bonus points
    const successFactor = resolvedSuccessRate / 100;
    
    const computedScore = (baseConfidence * 0.5) + evidenceBonus + (baseConfidence * successFactor * 0.3);
    const finalConfidence = Math.min(100, Math.max(10, Math.round(computedScore)));

    return finalConfidence;
  }

  /**
   * Phase 145: Detects cognitive overconfidence where stated base confidence is highly inflated
   * relative to actual evidence availability or past executive track success.
   */
  public detectOverconfidence(
    baseConfidence: number,
    evidenceCount: number,
    historySuccessRate: number
  ): boolean {
    // If the base confidence is high (>= 80), but evidence is low (<= 2 pieces) or history success is poor (< 75%)
    if (baseConfidence >= 80 && (evidenceCount <= 2 || historySuccessRate < 75)) {
      return true;
    }
    // Perfect confidence with any historical imperfections is a sign of lack of humility
    if (baseConfidence === 100 && historySuccessRate < 95) {
      return true;
    }
    return false;
  }

  /**
   * Phase 145: Applies structured confidence penalties to regulate overconfident AI suggestions.
   */
  public applyConfidencePenalty(
    rawConfidence: number,
    evidenceCount: number,
    historySuccessRate: number
  ): number {
    let penalty = 0;

    // Lack of grounding evidence penalty
    if (evidenceCount === 0) {
      penalty += 20;
    } else if (evidenceCount <= 2) {
      penalty += 10;
    }

    // Unreliable historical performance penalty
    if (historySuccessRate < 60) {
      penalty += 25;
    } else if (historySuccessRate < 80) {
      penalty += 12;
    }

    // Ensure the penalized confidence is humbled within realistic limits
    const penalized = Math.min(100, Math.max(10, Math.round(rawConfidence - penalty)));
    return penalized;
  }
}

export const confidenceEngine = ConfidenceEngine.getInstance();
