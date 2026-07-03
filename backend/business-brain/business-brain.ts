/**
 * Business Brain - Core Business Intelligence Layer
 * Sits on top of Execution Kernel to provide intelligent business decisions
 */

import { executionKernel, ActionRecord, ExecutionContext, eventBus, logger } from '../execution-kernel';

export interface BusinessContext {
  tenantId: string;
  storeId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  condition: (data: any) => boolean;
  action: (data: any) => Promise<ActionRecord[]>;
  priority: number;
  enabled: boolean;
}

export interface BusinessDecision {
  id: string;
  type: string;
  confidence: number; // 0-1
  actions: ActionRecord[];
  reasoning: string;
  timestamp: number;
}

export interface BusinessMetrics {
  ordersToday: number;
  revenueToday: number;
  activeCustomers: number;
  inventoryTurns: number;
  conversionRate: number;
  averageOrderValue: number;
}

/**
 * Business Brain - Main Class
 * Intelligent decision making system for commerce operations
 */
export class BusinessBrain {
  private rules: Map<string, BusinessRule> = new Map();
  private decisions: Map<string, BusinessDecision> = new Map();
  private metrics: Map<string, BusinessMetrics> = new Map();
  private maxDecisions: number = 10000;

  constructor() {
    console.log('[BusinessBrain] Initialized');
  }

  /**
   * Register business rule
   */
  registerRule(rule: BusinessRule): void {
    this.rules.set(rule.id, rule);
    logger.info('BusinessBrain', `Rule registered: ${rule.name}`, { ruleId: rule.id, priority: rule.priority });
  }

  /**
   * Register multiple rules
   */
  registerRules(rules: BusinessRule[]): void {
    rules.forEach((rule) => this.registerRule(rule));
  }

  /**
   * Analyze situation and make business decision
   */
  async makeDecision(
    situation: any,
    context: BusinessContext
  ): Promise<BusinessDecision> {
    const decisionId = `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[BusinessBrain] Making decision for situation:`, situation);

    // 1. Evaluate all rules
    const applicableRules = Array.from(this.rules.values())
      .filter((r) => r.enabled && r.condition(situation))
      .sort((a, b) => b.priority - a.priority);

    if (applicableRules.length === 0) {
      logger.warn('BusinessBrain', 'No applicable rules found', { situation });
      return {
        id: decisionId,
        type: 'no_action',
        confidence: 0,
        actions: [],
        reasoning: 'No applicable business rules matched',
        timestamp: Date.now()
      };
    }

    // 2. Execute highest priority rule
    const selectedRule = applicableRules[0];
    console.log(`[BusinessBrain] Selected rule: ${selectedRule.name} (priority: ${selectedRule.priority})`);

    try {
      const actions = await selectedRule.action(situation);

      const decision: BusinessDecision = {
        id: decisionId,
        type: selectedRule.id,
        confidence: 0.95, // High confidence for rule-based decisions
        actions,
        reasoning: `Applied rule: ${selectedRule.description}`,
        timestamp: Date.now()
      };

      this.decisions.set(decisionId, decision);
      if (this.decisions.size > this.maxDecisions) {
        const firstKey = this.decisions.keys().next().value;
        this.decisions.delete(firstKey);
      }

      logger.info('BusinessBrain', `Decision made: ${selectedRule.name}`, {
        decisionId,
        actions: actions.length,
        confidence: decision.confidence
      });

      return decision;
    } catch (error) {
      logger.error('BusinessBrain', `Rule execution failed: ${selectedRule.name}`, error as Error);
      throw error;
    }
  }

  /**
   * Execute business decision through kernel
   */
  async executeDecision(decision: BusinessDecision, context: BusinessContext): Promise<any> {
    logger.info('BusinessBrain', `Executing decision: ${decision.type}`, { decisionId: decision.id });

    const results = await executionKernel.execute(decision.actions, {
      tenantId: context.tenantId,
      storeId: context.storeId,
      userId: context.userId,
      metadata: {
        ...context.metadata,
        decisionId: decision.id,
        decisionType: decision.type
      }
    });

    return results;
  }

  /**
   * Get decision history
   */
  getDecisions(limit: number = 100): BusinessDecision[] {
    return Array.from(this.decisions.values()).slice(-limit);
  }

  /**
   * Update metrics
   */
  updateMetrics(context: BusinessContext, metrics: BusinessMetrics): void {
    const key = `${context.tenantId}:${context.storeId}`;
    this.metrics.set(key, metrics);
    logger.debug('BusinessBrain', `Metrics updated for ${key}`, metrics);
  }

  /**
   * Get metrics
   */
  getMetrics(context: BusinessContext): BusinessMetrics | undefined {
    const key = `${context.tenantId}:${context.storeId}`;
    return this.metrics.get(key);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalRules: this.rules.size,
      enabledRules: Array.from(this.rules.values()).filter((r) => r.enabled).length,
      totalDecisions: this.decisions.size,
      registeredStores: this.metrics.size
    };
  }
}

// Export singleton
export const businessBrain = new BusinessBrain();
