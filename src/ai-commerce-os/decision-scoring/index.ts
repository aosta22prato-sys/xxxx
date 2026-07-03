/**
 * Decision Scoring Engine - 决策评分引擎
 *
 * 核心功能：
 * - 计算每个行动的收益
 * - 评估风险
 * - 计算成本
 * - 估算时间
 * - 预测成功概率
 * - 选择综合得分最高的方案
 */

import { WorldModel } from '../world-model';
import { LearningSystem } from '../learning-engine';

export interface CandidateAction {
  id: string;
  name: string;
  description: string;
  type: string;
  parameters: any;
  dependencies?: string[];
}

export interface ScoreComponent {
  value: number;
  weight: number;
  reasoning: string;
}

export interface ActionScore {
  actionId: string;
  overallScore: number;
  components: {
    benefit: ScoreComponent;
    risk: ScoreComponent;
    cost: ScoreComponent;
    time: ScoreComponent;
    successProbability: ScoreComponent;
  };
  recommendation: 'high_priority' | 'medium_priority' | 'low_priority' | 'not_recommended';
  justification: string[];
}

export interface DecisionResult {
  bestAction?: CandidateAction;
  allScores: ActionScore[];
  decisionTimestamp: number;
  decisionReasoning: string;
}

export class DecisionScoringEngine {
  private static instance: DecisionScoringEngine;
  private worldModel: WorldModel;
  private learningSystem: LearningSystem;

  private defaultWeights = {
    benefit: 0.35,
    risk: 0.25,
    cost: 0.15,
    time: 0.10,
    successProbability: 0.15
  };

  private constructor() {
    console.log('⚖️ [Decision Scoring] Initializing...');
    this.worldModel = WorldModel.getInstance();
    this.learningSystem = LearningSystem.getInstance();
  }

  public static getInstance(): DecisionScoringEngine {
    if (!DecisionScoringEngine.instance) {
      DecisionScoringEngine.instance = new DecisionScoringEngine();
    }
    return DecisionScoringEngine.instance;
  }

  public scoreAndDecide(candidates: CandidateAction[], context?: any): DecisionResult {
    console.log(`⚖️ [Decision Scoring] Scoring ${candidates.length} candidates...`);

    const allScores = candidates.map(action => this.scoreAction(action, context));
    allScores.sort((a, b) => b.overallScore - a.overallScore);

    const bestScore = allScores[0];
    const bestAction = candidates.find(c => c.id === bestScore.actionId);

    return {
      bestAction,
      allScores,
      decisionTimestamp: Date.now(),
      decisionReasoning: this.generateDecisionReasoning(allScores)
    };
  }

  public scoreAction(action: CandidateAction, context?: any): ActionScore {
    const benefit = this.calculateBenefit(action, context);
    const risk = this.calculateRisk(action, context);
    const cost = this.calculateCost(action, context);
    const time = this.calculateTime(action, context);
    const successProbability = this.calculateSuccessProbability(action, context);

    const overallScore = this.calculateWeightedScore({ benefit, risk, cost, time, successProbability });

    return {
      actionId: action.id,
      overallScore,
      components: { benefit, risk, cost, time, successProbability },
      recommendation: this.getRecommendation(overallScore),
      justification: this.generateJustification(action, { benefit, risk, cost, time, successProbability })
    };
  }

  private calculateBenefit(action: CandidateAction, context?: any): ScoreComponent {
    let value = 0.5;
    let reasoning = 'Default medium benefit assessment';

    const actionType = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    if (actionType.includes('marketing') || actionType.includes('promotion') || desc.includes('discount')) {
      value = 0.75;
      reasoning = 'Marketing and promotions typically drive revenue growth';
    } else if (actionType.includes('inventory') || actionType.includes('restock')) {
      value = 0.65;
      reasoning = 'Inventory management prevents stockouts and lost sales';
    } else if (actionType.includes('price') || actionType.includes('pricing')) {
      value = 0.70;
      reasoning = 'Pricing optimization directly impacts margins';
    } else if (actionType.includes('customer') || actionType.includes('retention')) {
      value = 0.80;
      reasoning = 'Customer retention has high ROI (cheaper than acquisition)';
    }

    const similarCases = this.learningSystem.findSimilarCases(action);
    if (similarCases.length > 0) {
      const successRate = similarCases.filter(c => c.type === 'success').length / similarCases.length;
      value = 0.3 * value + 0.7 * successRate;
      reasoning = `${reasoning}. Historical success rate: ${(successRate * 100).toFixed(1)}%`;
    }

    return { value: Math.min(1, Math.max(0, value)), weight: this.defaultWeights.benefit, reasoning };
  }

  private calculateRisk(action: CandidateAction, context?: any): ScoreComponent {
    let riskValue = 0.5;
    let reasoning = 'Default medium risk assessment';

    const actionType = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    if (actionType.includes('price') || desc.includes('decrease') || desc.includes('cut')) {
      riskValue = 0.6;
      reasoning = 'Price decreases carry margin risk';
    } else if (actionType.includes('inventory') || desc.includes('large') || desc.includes('bulk')) {
      riskValue = 0.55;
      reasoning = 'Large inventory purchases tie up capital';
    } else if (actionType.includes('marketing') && desc.includes('new')) {
      riskValue = 0.5;
      reasoning = 'New marketing channels have uncertain ROI';
    } else if (actionType.includes('customer') && desc.includes('retention')) {
      riskValue = 0.3;
      reasoning = 'Customer retention actions are generally low risk';
    }

    const similarFailures = this.learningSystem.getFailureCases(5).filter(c => {
      const goalDesc = JSON.stringify(c.goal).toLowerCase();
      return goalDesc.includes(action.type.toLowerCase()) || (action.description.toLowerCase().includes(goalDesc.slice(0, 50)));
    });
    
    if (similarFailures.length > 0) {
      riskValue += 0.1 * similarFailures.length;
      reasoning = `${reasoning}. ${similarFailures.length} similar failures in history`;
    }

    const scoreValue = 1 - riskValue;
    return { value: Math.min(1, Math.max(0, scoreValue)), weight: this.defaultWeights.risk, reasoning };
  }

  private calculateCost(action: CandidateAction, context?: any): ScoreComponent {
    let costScore = 0.5;
    let reasoning = 'Default medium cost assessment';

    const actionType = action.type.toLowerCase();
    const params = action.parameters || {};

    if (params.budget || params.cost) {
      const cost = params.budget || params.cost;
      if (cost < 100) {
        costScore = 0.9;
        reasoning = 'Very low cost action';
      } else if (cost < 1000) {
        costScore = 0.7;
        reasoning = 'Low to moderate cost';
      } else if (cost < 5000) {
        costScore = 0.5;
        reasoning = 'Moderate cost';
      } else {
        costScore = 0.3;
        reasoning = 'High cost action';
      }
    } else if (actionType.includes('marketing') || actionType.includes('advertising')) {
      costScore = 0.4;
      reasoning = 'Marketing actions typically have associated costs';
    } else if (actionType.includes('email') || actionType.includes('notification')) {
      costScore = 0.9;
      reasoning = 'Digital communications have very low marginal cost';
    }

    return { value: Math.min(1, Math.max(0, costScore)), weight: this.defaultWeights.cost, reasoning };
  }

  private calculateTime(action: CandidateAction, context?: any): ScoreComponent {
    let timeScore = 0.5;
    let reasoning = 'Default medium time assessment';

    const actionType = action.type.toLowerCase();
    const params = action.parameters || {};

    if (params.estimatedTime || params.duration) {
      const time = params.estimatedTime || params.duration;
      if (time < 3600) {
        timeScore = 0.9;
        reasoning = 'Very fast execution (under 1 hour)';
      } else if (time < 86400) {
        timeScore = 0.7;
        reasoning = 'Quick execution (within 1 day)';
      } else if (time < 604800) {
        timeScore = 0.5;
        reasoning = 'Moderate time (within 1 week)';
      } else {
        timeScore = 0.3;
        reasoning = 'Long execution time (over 1 week)';
      }
    } else if (actionType.includes('email') || actionType.includes('notification')) {
      timeScore = 0.95;
      reasoning = 'Immediate digital actions';
    } else if (actionType.includes('inventory') || actionType.includes('order')) {
      timeScore = 0.4;
      reasoning = 'Physical operations take time';
    }

    return { value: Math.min(1, Math.max(0, timeScore)), weight: this.defaultWeights.time, reasoning };
  }

  private calculateSuccessProbability(action: CandidateAction, context?: any): ScoreComponent {
    let probability = 0.7;
    let reasoning = 'Default 70% success probability';

    const similarCases = this.learningSystem.findSimilarCases(action, 10);
    if (similarCases.length > 0) {
      const successRate = similarCases.filter(c => c.type === 'success').length / similarCases.length;
      probability = 0.4 * probability + 0.6 * successRate;
      reasoning = `Based on ${similarCases.length} similar cases, success rate is ${(successRate * 100).toFixed(1)}%`;
    }

    const patternKey = `pattern:${action.type.toLowerCase()}`;
    const patternMemory = this.learningSystem.recall(patternKey);
    if (patternMemory?.value?.type === 'success') {
      probability = Math.min(1, probability + 0.1);
      reasoning = `${reasoning}. Positive pattern recognized from memory`;
    } else if (patternMemory?.value?.type === 'failure') {
      probability = Math.max(0, probability - 0.1);
      reasoning = `${reasoning}. Caution: similar failures in memory`;
    }

    return { value: Math.min(1, Math.max(0, probability)), weight: this.defaultWeights.successProbability, reasoning };
  }

  private calculateWeightedScore(scores: { [key: string]: ScoreComponent }): number {
    return Object.entries(scores).reduce((total, [key, component]) => total + (component.value * component.weight), 0);
  }

  private getRecommendation(score: number): ActionScore['recommendation'] {
    if (score >= 0.75) return 'high_priority';
    if (score >= 0.5) return 'medium_priority';
    if (score >= 0.3) return 'low_priority';
    return 'not_recommended';
  }

  private generateJustification(action: CandidateAction, scores: { [key: string]: ScoreComponent }): string[] {
    const justifications: string[] = [];
    
    Object.entries(scores).forEach(([key, component]) => {
      justifications.push(`📊 ${key.charAt(0).toUpperCase() + key.slice(1)}: ${(component.value * 100).toFixed(0)}%`);
    });

    const entries = Object.entries(scores);
    if (entries.length > 0) {
      const maxComponent = entries.reduce((max, [key, val]) => val.value > max.val.value ? { key, val } : max, { key: entries[0][0], val: entries[0][1] });
      justifications.push(`✅ Strength: ${maxComponent.key} - ${maxComponent.val.reasoning}`);

      const minComponent = entries.reduce((min, [key, val]) => val.value < min.val.value ? { key, val } : min, { key: entries[0][0], val: entries[0][1] });
      if (minComponent.val.value < 0.6) {
        justifications.push(`⚠️ Concern: ${minComponent.key} - ${minComponent.val.reasoning}`);
      }
    }

    return justifications;
  }

  private generateDecisionReasoning(allScores: ActionScore[]): string {
    const best = allScores[0];
    const secondBest = allScores[1];

    let reasoning = `Selected action #${best.actionId} with score ${(best.overallScore * 100).toFixed(1)}%`;
    
    if (secondBest) {
      const diff = best.overallScore - secondBest.overallScore;
      reasoning += `, beating #${secondBest.actionId} by ${(diff * 100).toFixed(1)} percentage points`;
    }

    return reasoning;
  }

  public updateWeights(newWeights: Partial<typeof this.defaultWeights>): void {
    this.defaultWeights = { ...this.defaultWeights, ...newWeights };
    console.log('⚖️ [Decision Scoring] Weights updated:', this.defaultWeights);
  }

  public getStatus() {
    return {
      currentWeights: this.defaultWeights,
      capabilities: [
        'multi_factor_scoring',
        'historical_based_probability',
        'weighted_decision_making',
        'risk_assessment',
        'cost_benefit_analysis'
      ]
    };
  }
}

export const decisionScoringEngine = DecisionScoringEngine.getInstance();
