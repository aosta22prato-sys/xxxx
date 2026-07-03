/**
 * Strategy Engine - 战略引擎
 *
 * 核心功能：
 * - 不只是执行目标，而是主动发现机会
 * - 主动识别风险
 * - 提出优化策略
 * - 支持短期、中期、长期目标平衡
 */

import { WorldModel } from '../world-model';
import { DecisionScoringEngine, CandidateAction } from '../decision-scoring';

export interface Opportunity {
  id: string;
  type: 'revenue' | 'cost_saving' | 'efficiency' | 'customer_growth' | 'risk_mitigation';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedImpact: {
    value: number;
    unit: 'revenue' | 'percentage' | 'count';
  };
  timeHorizon: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  confidence: number;
  suggestedActions: CandidateAction[];
  discoveredAt: number;
}

export interface Risk {
  id: string;
  type: 'inventory' | 'financial' | 'operational' | 'market' | 'customer_churn' | 'supply_chain';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  probability: number;
  potentialImpact: number;
  timeHorizon: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  mitigationActions: CandidateAction[];
  discoveredAt: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'growth' | 'optimization' | 'risk_mitigation' | 'innovation';
  objectives: string[];
  priorities: {
    immediate: string[];
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  expectedOutcomes: any;
  timeline: any;
  createdAt: number;
}

export class StrategyEngine {
  private static instance: StrategyEngine;
  private worldModel: WorldModel;
  private decisionScoring: DecisionScoringEngine;
  private opportunities: Map<string, Opportunity> = new Map();
  private risks: Map<string, Risk> = new Map();
  private strategies: Map<string, Strategy> = new Map();

  private constructor() {
    console.log('🎯 [Strategy Engine] Initializing...');
    this.worldModel = WorldModel.getInstance();
    this.decisionScoring = DecisionScoringEngine.getInstance();
    this.initializeDefaultStrategyTemplates();
  }

  public static getInstance(): StrategyEngine {
    if (!StrategyEngine.instance) {
      StrategyEngine.instance = new StrategyEngine();
    }
    return StrategyEngine.instance;
  }

  public discoverOpportunities(businessState?: any): Opportunity[] {
    console.log('🔍 [Strategy Engine] Discovering opportunities...');
    const newOpportunities: Opportunity[] = [];

    newOpportunities.push(...this.detectRevenueOpportunities(businessState));
    newOpportunities.push(...this.detectCostSavingOpportunities(businessState));
    newOpportunities.push(...this.detectEfficiencyOpportunities(businessState));
    newOpportunities.push(...this.detectCustomerGrowthOpportunities(businessState));

    newOpportunities.forEach(opp => this.opportunities.set(opp.id, opp));
    console.log(`🎯 [Strategy Engine] Discovered ${newOpportunities.length} new opportunities`);
    return newOpportunities;
  }

  public identifyRisks(businessState?: any): Risk[] {
    console.log('⚠️ [Strategy Engine] Identifying risks...');
    const newRisks: Risk[] = [];

    newRisks.push(...this.identifyInventoryRisks(businessState));
    newRisks.push(...this.identifyFinancialRisks(businessState));
    newRisks.push(...this.identifyCustomerChurnRisks(businessState));
    newRisks.push(...this.identifyMarketRisks(businessState));

    newRisks.forEach(risk => this.risks.set(risk.id, risk));
    console.log(`⚠️ [Strategy Engine] Identified ${newRisks.length} new risks`);
    return newRisks;
  }

  public generateOptimizationStrategies(businessState?: any): Strategy[] {
    console.log('📈 [Strategy Engine] Generating optimization strategies...');
    const strategies: Strategy[] = [];

    strategies.push(this.createGrowthStrategy(businessState));
    strategies.push(this.createOptimizationStrategy(businessState));
    strategies.push(this.createRiskMitigationStrategy(businessState));

    strategies.forEach(s => this.strategies.set(s.id, s));
    return strategies;
  }

  public getStrategicInsights(businessState?: any): {
    opportunities: Opportunity[];
    risks: Risk[];
    recommendedStrategies: Strategy[];
    prioritizedActions: CandidateAction[];
  } {
    console.log('🎯 [Strategy Engine] Compiling strategic insights...');

    const opportunities = this.discoverOpportunities(businessState);
    const risks = this.identifyRisks(businessState);
    const strategies = this.generateOptimizationStrategies(businessState);

    const allActions: CandidateAction[] = [];
    opportunities.forEach(opp => allActions.push(...opp.suggestedActions));
    risks.forEach(risk => allActions.push(...risk.mitigationActions));

    const decisionResult = this.decisionScoring.scoreAndDecide(allActions, businessState);
    const prioritizedActions = decisionResult.allScores
      .filter(s => s.recommendation !== 'not_recommended')
      .map(score => allActions.find(a => a.id === score.actionId)!);

    return {
      opportunities: opportunities.sort((a, b) => this.priorityToNumber(b.priority) - this.priorityToNumber(a.priority)),
      risks: risks.sort((a, b) => this.severityToNumber(b.severity) - this.severityToNumber(a.severity)),
      recommendedStrategies: strategies,
      prioritizedActions
    };
  }

  private detectRevenueOpportunities(businessState?: any): Opportunity[] {
    return [
      {
        id: `opp_revenue_${Date.now()}`,
        type: 'revenue',
        title: 'Price Optimization Opportunity',
        description: 'Analyze and optimize pricing strategy for high-margin products',
        priority: 'high',
        estimatedImpact: { value: 15, unit: 'percentage' },
        timeHorizon: 'short_term',
        confidence: 0.8,
        suggestedActions: [
          {
            id: 'action_price_analysis',
            name: 'Price Analysis',
            description: 'Analyze current pricing strategy',
            type: 'pricing',
            parameters: { scope: 'high_margin_products' }
          },
          {
            id: 'action_price_opt',
            name: 'Price Optimization',
            description: 'Optimize prices for selected products',
            type: 'pricing',
            parameters: { targetMargin: 0.4 }
          }
        ],
        discoveredAt: Date.now()
      },
      {
        id: `opp_revenue_${Date.now() + 1}`,
        type: 'revenue',
        title: 'Cross-sell & Upsell Campaign',
        description: 'Implement cross-sell and upsell strategies',
        priority: 'medium',
        estimatedImpact: { value: 10, unit: 'percentage' },
        timeHorizon: 'medium_term',
        confidence: 0.7,
        suggestedActions: [
          {
            id: 'action_cross_sell',
            name: 'Cross-sell Campaign',
            description: 'Launch cross-sell campaign',
            type: 'marketing',
            parameters: { targetSegment: 'existing_customers' }
          }
        ],
        discoveredAt: Date.now()
      }
    ];
  }

  private detectCostSavingOpportunities(businessState?: any): Opportunity[] {
    return [
      {
        id: `opp_cost_${Date.now()}`,
        type: 'cost_saving',
        title: 'Inventory Optimization',
        description: 'Reduce excess inventory holding costs',
        priority: 'medium',
        estimatedImpact: { value: 8, unit: 'percentage' },
        timeHorizon: 'short_term',
        confidence: 0.75,
        suggestedActions: [
          {
            id: 'action_inventory_review',
            name: 'Inventory Review',
            description: 'Review slow-moving inventory',
            type: 'inventory',
            parameters: { ageThreshold: 90 }
          },
          {
            id: 'action_clearance',
            name: 'Clearance Sale',
            description: 'Run clearance promotion',
            type: 'promotion',
            parameters: { discount: 0.3 }
          }
        ],
        discoveredAt: Date.now()
      }
    ];
  }

  private detectEfficiencyOpportunities(businessState?: any): Opportunity[] {
    return [
      {
        id: `opp_efficiency_${Date.now()}`,
        type: 'efficiency',
        title: 'Process Automation',
        description: 'Automate repetitive manual processes',
        priority: 'medium',
        estimatedImpact: { value: 20, unit: 'percentage' },
        timeHorizon: 'long_term',
        confidence: 0.65,
        suggestedActions: [
          {
            id: 'action_process_audit',
            name: 'Process Audit',
            description: 'Audit manual processes',
            type: 'operational',
            parameters: {}
          }
        ],
        discoveredAt: Date.now()
      }
    ];
  }

  private detectCustomerGrowthOpportunities(businessState?: any): Opportunity[] {
    return [
      {
        id: `opp_customer_${Date.now()}`,
        type: 'customer_growth',
        title: 'High-Value Customer Acquisition',
        description: 'Target and acquire high-LTV customers',
        priority: 'high',
        estimatedImpact: { value: 25, unit: 'percentage' },
        timeHorizon: 'medium_term',
        confidence: 0.7,
        suggestedActions: [
          {
            id: 'action_lookalike',
            name: 'Lookalike Audience',
            description: 'Create lookalike audience campaign',
            type: 'marketing',
            parameters: { source: 'top_10_customers' }
          }
        ],
        discoveredAt: Date.now()
      }
    ];
  }

  private identifyInventoryRisks(businessState?: any): Risk[] {
    return [
      {
        id: `risk_inv_${Date.now()}`,
        type: 'inventory',
        title: 'Stockout Risk',
        description: 'Popular items at risk of stockout',
        severity: 'high',
        probability: 0.4,
        potentialImpact: 0.6,
        timeHorizon: 'immediate',
        mitigationActions: [
          {
            id: 'action_restock',
            name: 'Emergency Restock',
            description: 'Restock critical items',
            type: 'inventory',
            parameters: { priority: 'urgent' }
          }
        ],
        discoveredAt: Date.now()
      }
    ];
  }

  private identifyFinancialRisks(businessState?: any): Risk[] {
    return [
      {
        id: `risk_fin_${Date.now()}`,
        type: 'financial',
        title: 'Margin Compression Risk',
        description: 'Rising costs threatening margins',
        severity: 'medium',
        probability: 0.35,
        potentialImpact: 0.5,
        timeHorizon: 'short_term',
        mitigationActions: [
          {
            id: 'action_cost_analysis',
            name: 'Cost Analysis',
            description: 'Analyze cost structure',
            type: 'financial',
            parameters: {}
          }
        ],
        discoveredAt: Date.now()
      }
    ];
  }

  private identifyCustomerChurnRisks(businessState?: any): Risk[] {
    return [
      {
        id: `risk_churn_${Date.now()}`,
        type: 'customer_churn',
        title: 'High-Value Customer Attrition',
        description: 'Top customers showing churn signals',
        severity: 'critical',
        probability: 0.5,
        potentialImpact: 0.8,
        timeHorizon: 'short_term',
        mitigationActions: [
          {
            id: 'action_retention',
            name: 'Retention Outreach',
            description: 'Personal retention outreach',
            type: 'customer',
            parameters: { segment: 'at_risk' }
          }
        ],
        discoveredAt: Date.now()
      }
    ];
  }

  private identifyMarketRisks(businessState?: any): Risk[] {
    return [
      {
        id: `risk_market_${Date.now()}`,
        type: 'market',
        title: 'Competitive Pressure',
        description: 'New competitor entering market',
        severity: 'medium',
        probability: 0.3,
        potentialImpact: 0.4,
        timeHorizon: 'medium_term',
        mitigationActions: [
          {
            id: 'action_competitive_intel',
            name: 'Competitive Intelligence',
            description: 'Gather competitive intelligence',
            type: 'market',
            parameters: {}
          }
        ],
        discoveredAt: Date.now()
      }
    ];
  }

  private createGrowthStrategy(businessState?: any): Strategy {
    return {
      id: 'strategy_growth_1',
      name: 'Balanced Growth Strategy',
      description: 'Focus on sustainable revenue growth',
      type: 'growth',
      objectives: [
        'Increase revenue by 20% in 6 months',
        'Grow customer base by 15%',
        'Improve customer retention by 10%'
      ],
      priorities: {
        immediate: ['Launch quick win promotions', 'Address critical stockout prevention'],
        shortTerm: ['Implement pricing optimization', 'Launch targeted marketing campaigns'],
        mediumTerm: ['Expand customer loyalty program', 'New product development'],
        longTerm: ['Market expansion', 'Brand building']
      },
      expectedOutcomes: { revenueGrowth: 0.2, customerGrowth: 0.15, marginImprovement: 0.05 },
      timeline: { startDate: Date.now(), reviewDate: Date.now() + 86400000 * 30 },
      createdAt: Date.now()
    };
  }

  private createOptimizationStrategy(businessState?: any): Strategy {
    return {
      id: 'strategy_opt_1',
      name: 'Operational Excellence Strategy',
      description: 'Optimize operations and reduce costs',
      type: 'optimization',
      objectives: [
        'Reduce operational costs by 10%',
        'Improve inventory turnover by 20%',
        'Streamline fulfillment processes'
      ],
      priorities: {
        immediate: ['Fix critical process changes'],
        shortTerm: ['Implement inventory optimization', 'Automate manual processes'],
        mediumTerm: ['Renegotiate supplier contracts', 'Optimize logistics'],
        longTerm: ['Implement AI-driven forecasting']
      },
      expectedOutcomes: { costReduction: 0.1, efficiencyGain: 0.15, inventoryTurnoverImprovement: 0.2 },
      timeline: { startDate: Date.now(), reviewDate: Date.now() + 86400000 * 30 },
      createdAt: Date.now()
    };
  }

  private createRiskMitigationStrategy(businessState?: any): Strategy {
    return {
      id: 'strategy_risk_1',
      name: 'Risk Mitigation Strategy',
      description: 'Proactively manage business risks',
      type: 'risk_mitigation',
      objectives: [
        'Reduce stockout risk by 50%',
        'Improve customer retention by 15%',
        'Build financial resilience'
      ],
      priorities: {
        immediate: ['Address critical stockout risk', 'Reach out to at-risk customers'],
        shortTerm: ['Implement early warning systems', 'Build safety stock'],
        mediumTerm: ['Diversify supplier base', 'Build cash reserves'],
        longTerm: ['Develop contingency plans']
      },
      expectedOutcomes: { riskReduction: 0.5, resilienceScore: 0.3 },
      timeline: { startDate: Date.now(), reviewDate: Date.now() + 86400000 * 30 },
      createdAt: Date.now()
    };
  }

  private priorityToNumber(priority: string): number {
    const map: { [key: string]: number } = { critical: 4, high: 3, medium: 2, low: 1 };
    return map[priority] || 0;
  }

  private severityToNumber(severity: string): number {
    const map: { [key: string]: number } = { critical: 4, high: 3, medium: 2, low: 1 };
    return map[severity] || 0;
  }

  private initializeDefaultStrategyTemplates(): void {
    this.createGrowthStrategy();
    this.createOptimizationStrategy();
    this.createRiskMitigationStrategy();
  }

  public getStatus() {
    return {
      activeOpportunities: this.opportunities.size,
      activeRisks: this.risks.size,
      activeStrategies: this.strategies.size,
      capabilities: [
        'opportunity_discovery',
        'risk_identification',
        'strategy_generation',
        'balanced_objective_setting',
        'time_horizon_planning'
      ]
    };
  }
}

export const strategyEngine = StrategyEngine.getInstance();
