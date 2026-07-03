/**
 * Result Evaluator - 执行结果评估系统
 * 
 * 用数学方式计算执行结果的业务影响
 */

import { BusinessState, ExecutionResult } from './core-interfaces';

export interface PerformanceDelta {
  revenue: number;
  profit: number;
  profitMargin: number;
  orderCount: number;
  conversionRate: number;
  adsROI: number;
  inventoryTurnover: number;
  customerSatisfaction: number;
  timestamp: number;
}

export interface ActionEvaluation {
  actionName: string;
  success: boolean;
  delta: PerformanceDelta;
  impact: 'positive' | 'negative' | 'neutral';
  score: number; // 0-100
  confidence: number; // 0-100
  recommendation: string;
}

export interface CycleEvaluation {
  totalActions: number;
  successActions: number;
  successRate: number;
  overallDelta: PerformanceDelta;
  overallImpact: 'excellent' | 'good' | 'neutral' | 'poor' | 'harmful';
  overallScore: number; // 0-100
  learnings: string[];
  nextSteps: string[];
}

export class ResultEvaluator {
  private static instance: ResultEvaluator;

  private constructor() {
    console.log('📈 [Result Evaluator] 初始化结果评估系统...');
  }

  public static getInstance(): ResultEvaluator {
    if (!ResultEvaluator.instance) {
      ResultEvaluator.instance = new ResultEvaluator();
    }
    return ResultEvaluator.instance;
  }

  /**
   * 评估单个动作的效果
   */
  public evaluateAction(
    actionName: string,
    oldState: BusinessState,
    newState: BusinessState
  ): ActionEvaluation {
    const delta = this.calculateDelta(oldState, newState);

    // 计算动作分数
    const score = this.calculateActionScore(actionName, delta, oldState);

    // 判断影响
    const impact = this.determineImpact(score, delta);

    // 生成建议
    const recommendation = this.generateRecommendation(
      actionName,
      delta,
      impact
    );

    return {
      actionName,
      success: score > 40,
      delta,
      impact,
      score,
      confidence: this.calculateConfidence(delta),
      recommendation,
    };
  }

  /**
   * 评估完整的执行循环
   */
  public evaluateCycle(
    actions: any[],
    oldState: BusinessState,
    newState: BusinessState
  ): CycleEvaluation {
    const delta = this.calculateDelta(oldState, newState);
    const successCount = actions.filter((a) => a.success).length;
    const successRate = (successCount / actions.length) * 100;

    // 计算总体分数
    let totalScore = 0;

    // 收入增长（权重30%）
    totalScore += Math.min(100, Math.max(0, delta.revenue / 1000)) * 0.3;

    // 利润增长（权重25%）
    totalScore += Math.min(100, Math.max(0, delta.profit / 500)) * 0.25;

    // 订单增长（权重20%）
    totalScore += Math.min(100, Math.max(0, delta.orderCount * 10)) * 0.2;

    // 转化率改善（权重15%）
    totalScore +=
      Math.min(100, Math.max(0, delta.conversionRate * 50)) * 0.15;

    // 动作成功率（权重10%）
    totalScore += successRate * 0.1;

    const overallScore = Math.min(100, totalScore);

    // 判断总体影响
    const overallImpact = this.determineOverallImpact(
      overallScore,
      delta,
      successRate
    );

    // 提取学习
    const learnings = this.extractLearnings(delta, oldState, newState);

    // 提出下一步建议
    const nextSteps = this.suggestNextSteps(delta, newState, actions.length);

    return {
      totalActions: actions.length,
      successActions: successCount,
      successRate,
      overallDelta: delta,
      overallImpact,
      overallScore,
      learnings,
      nextSteps,
    };
  }

  /**
   * 计算状态差值
   */
  private calculateDelta(
    oldState: BusinessState,
    newState: BusinessState
  ): PerformanceDelta {
    return {
      revenue: newState.revenue.monthly - oldState.revenue.monthly,
      profit: newState.profit.absolute - oldState.profit.absolute,
      profitMargin: newState.profit.margin - oldState.profit.margin,
      orderCount: newState.orders.totalCount - oldState.orders.totalCount,
      conversionRate:
        newState.orders.conversionRate - oldState.orders.conversionRate,
      adsROI: newState.marketing.adsROI - oldState.marketing.adsROI,
      inventoryTurnover:
        newState.inventory.turnoverRate - oldState.inventory.turnoverRate,
      customerSatisfaction: 0, // TODO: 从数据计算
      timestamp: Date.now(),
    };
  }

  /**
   * 计算单个动作的分数
   */
  private calculateActionScore(
    actionName: string,
    delta: PerformanceDelta,
    oldState: BusinessState
  ): number {
    let score = 50; // 基础分

    switch (actionName) {
      case 'updatePrice':
        // 价格变化应该导致利润变化
        score += Math.min(30, Math.abs(delta.profit) / 100);
        if (delta.revenue > 0) score += 20;
        break;

      case 'createAdCampaign':
        // 广告应该增加订单和收入
        if (delta.revenue > 0) score += 25;
        if (delta.orderCount > 0) score += 15;
        if (delta.adsROI > 1) score += 20;
        break;

      case 'optimizeAdSpend':
        // 优化应该改善ROI
        if (delta.adsROI > 0) score += 30;
        break;

      case 'adjustInventory':
        // 库存调整应该改善库存周转
        if (delta.inventoryTurnover > 0) score += 25;
        break;

      case 'segmentCustomers':
        // 分群应该为后续操作奠定基础
        score += 20;
        break;

      default:
        // 通用逻辑
        if (delta.revenue > 0) score += 15;
        if (delta.profit > 0) score += 15;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 判断单个动作的影响
   */
  private determineImpact(
    score: number,
    delta: PerformanceDelta
  ): 'positive' | 'negative' | 'neutral' {
    if (score >= 60 && delta.profit >= 0) {
      return 'positive';
    } else if (score <= 40 || delta.profit < 0) {
      return 'negative';
    }
    return 'neutral';
  }

  /**
   * 判断总体影响
   */
  private determineOverallImpact(
    score: number,
    delta: PerformanceDelta,
    successRate: number
  ): 'excellent' | 'good' | 'neutral' | 'poor' | 'harmful' {
    if (score >= 80 && delta.profit > 500 && successRate >= 80) {
      return 'excellent';
    } else if (score >= 60 && delta.profit > 0 && successRate >= 60) {
      return 'good';
    } else if (score >= 40 && delta.profit >= 0 && successRate >= 40) {
      return 'neutral';
    } else if (score >= 20 || successRate >= 20) {
      return 'poor';
    }
    return 'harmful';
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(delta: PerformanceDelta): number {
    // 变化越明显，置信度越高
    const changeScore = Math.abs(delta.revenue) + Math.abs(delta.profit);
    return Math.min(100, Math.max(0, changeScore / 100));
  }

  /**
   * 生成单个动作建议
   */
  private generateRecommendation(
    actionName: string,
    delta: PerformanceDelta,
    impact: string
  ): string {
    if (impact === 'positive') {
      return `✅ 动作 "${actionName}" 有效，继续执行`;
    } else if (impact === 'negative') {
      return `❌ 动作 "${actionName}" 有害，需要调整或撤销`;
    } else {
      return `⚠️ 动作 "${actionName}" 效果中性，需要进一步优化`;
    }
  }

  /**
   * 提取学习
   */
  private extractLearnings(
    delta: PerformanceDelta,
    oldState: BusinessState,
    newState: BusinessState
  ): string[] {
    const learnings: string[] = [];

    // 收入变化
    if (delta.revenue > 1000) {
      learnings.push('✅ 高效的收入增长策略');
    } else if (delta.revenue < -1000) {
      learnings.push('⚠️ 收入大幅下降，需要调查原因');
    }

    // 利润变化
    if (delta.profitMargin > 5) {
      learnings.push('✅ 利润率显著改善');
    } else if (delta.profitMargin < -5) {
      learnings.push('⚠️ 利润率恶化，需要成本控制');
    }

    // 订单变化
    if (delta.orderCount > 10) {
      learnings.push('✅ 订单量增加，转化策略有效');
    }

    // 广告ROI
    if (newState.marketing.adsROI > 2) {
      learnings.push('✅ 广告投放ROI健康');
    } else if (newState.marketing.adsROI < 0.5) {
      learnings.push('❌ 广告ROI低下，需要优化');
    }

    // 库存周转
    if (newState.inventory.daysSalesOfInventory < 30) {
      learnings.push('✅ 库存周转快速，供应链高效');
    } else if (newState.inventory.daysSalesOfInventory > 90) {
      learnings.push('⚠️ 库存周转缓慢，可能积压');
    }

    return learnings;
  }

  /**
   * 提出下一步建议
   */
  private suggestNextSteps(
    delta: PerformanceDelta,
    newState: BusinessState,
    actionCount: number
  ): string[] {
    const steps: string[] = [];

    // 基于状态给出建议
    if (newState.profit.margin < 20) {
      steps.push('→ 建议优化成本结构，提升利润率');
    }

    if (newState.orders.conversionRate < 1) {
      steps.push('→ 建议分析用户行为，优化转化漏斗');
    }

    if (newState.marketing.adsROI < 1) {
      steps.push('→ 建议暂停低效广告，聚焦高ROI活动');
    }

    if (newState.inventory.turnoverRate < 5) {
      steps.push('→ 建议调整库存结构，加快周转');
    }

    if (newState.customers.newThisMonth < 10) {
      steps.push('→ 建议加强新客获取，扩大用户规模');
    }

    if (actionCount < 3) {
      steps.push('→ 建议在下一循环执行更多优化动作');
    }

    return steps.slice(0, 3); // 只返回前3条建议
  }

  /**
   * 获取评估摘要
   */
  public getSummary(evaluation: CycleEvaluation): string {
    return `
🎯 执行循环评估摘要
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 指标变化:
   • 收入: ${evaluation.overallDelta.revenue > 0 ? '+' : ''}¥${evaluation.overallDelta.revenue.toFixed(0)}
   • 利润: ${evaluation.overallDelta.profit > 0 ? '+' : ''}¥${evaluation.overallDelta.profit.toFixed(0)}
   • 订单: ${evaluation.overallDelta.orderCount > 0 ? '+' : ''}${evaluation.overallDelta.orderCount}笔
   • 利润率: ${evaluation.overallDelta.profitMargin > 0 ? '+' : ''}${evaluation.overallDelta.profitMargin.toFixed(1)}%

📈 执行结果:
   • 总动作数: ${evaluation.totalActions}
   • 成功数: ${evaluation.successActions}
   • 成功率: ${evaluation.successRate.toFixed(1)}%

🎯 总体评分: ${evaluation.overallScore.toFixed(0)}/100 (${evaluation.overallImpact.toUpperCase()})

💡 关键学习:
${evaluation.learnings.map((l) => `   ${l}`).join('\n')}

📍 下一步建议:
${evaluation.nextSteps.map((s) => `   ${s}`).join('\n')}
    `;
  }
}

export const resultEvaluator = ResultEvaluator.getInstance();
