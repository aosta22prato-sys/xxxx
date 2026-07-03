/**
 * Learning System - 学习系统 (增强版)
 *
 * 核心功能：
 * - 保存历史执行记录
 * - 建立成功/失败案例库
 * - 基于历史经验调整决策
 * - 实现长期记忆而非单轮执行
 */

import { reflectionEngine, ExecutionResult, Lesson } from '../reflection-engine';
import { LLMIntegrator } from '../llm-integrator';

export interface Case {
  id: string;
  type: 'success' | 'failure';
  goal: any;
  actions: any[];
  outcome: any;
  timestamp: number;
  context: any;
  metadata: any;
}

export interface MemoryItem {
  id: string;
  key: string;
  value: any;
  category: 'business_data' | 'decision_pattern' | 'preference' | 'context';
  confidence: number;
  lastAccessed: number;
  accessCount: number;
  createdAt: number;
  expiresAt?: number;
}

export interface DecisionAdjustment {
  id: string;
  description: string;
  adjustmentType: 'increase_success_probability' | 'reduce_risk' | 'optimize_cost' | 'speed_up';
  factor: number;
  reason: string;
  appliedTo: string[];
  timestamp: number;
}

export class LearningSystem {
  private static instance: LearningSystem;
  private cases: Map<string, Case> = new Map();
  private memory: Map<string, MemoryItem> = new Map();
  private adjustments: DecisionAdjustment[] = [];

  private constructor() {
    console.log('📚 [Learning System] Initializing...');
    this.initializeBaseMemory();
  }

  public static getInstance(): LearningSystem {
    if (!LearningSystem.instance) {
      LearningSystem.instance = new LearningSystem();
    }
    return LearningSystem.instance;
  }

  /**
   * 记录新案例
   */
  public recordCase(executionResult: ExecutionResult, context?: any): Case {
    const caseType = executionResult.success ? 'success' : 'failure';
    const caseItem: Case = {
      id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: caseType,
      goal: executionResult.goal,
      actions: executionResult.actions,
      outcome: executionResult.outcome,
      timestamp: Date.now(),
      context: context || {},
      metadata: {
        duration: executionResult.duration,
        error: executionResult.error
      }
    };

    this.cases.set(caseItem.id, caseItem);
    console.log(`📚 [Learning] Recorded ${caseType} case: ${caseItem.id}`);

    // 触发学习
    this.learnFromCase(caseItem);

    return caseItem;
  }

  /**
   * 记录经验（保持向后兼容）
   */
  public recordExperience(experience: any): void {
    console.log('📚 [Learning] Recording experience:', experience.type);
    
    const executionResult: ExecutionResult = {
      id: `exec_${Date.now()}`,
      timestamp: Date.now(),
      goal: experience.context?.goal || {},
      actions: experience.context?.actions || [],
      success: experience.type === 'success',
      outcome: experience.outcome || {},
      error: experience.outcome?.error,
      duration: experience.outcome?.duration || 0,
      metadata: experience.context || {}
    };

    this.recordCase(executionResult, experience.context);
  }

  /**
   * 从案例中学习
   */
  private async learnFromCase(caseItem: Case) {
    // 更新成功/失败模式记忆
    const patternKey = `pattern:${this.extractGoalPattern(caseItem.goal)}`;
    this.remember(
      patternKey,
      {
        type: caseItem.type,
        outcome: caseItem.outcome,
        actions: caseItem.actions
      },
      'decision_pattern',
      0.8
    );

    let learningMethod = 'TypeScript Static Adjustments';

    try {
      const llm = LLMIntegrator.getInstance();
      if (await llm.isAvailable()) {
        console.log('🤖 [LLM-First Learning] 正在通过 AI 提取本次案例的深层自适应决策调整 (Decision Adjustment)...');
        const prompt = `你是一个电商多智能体自治系统（AI Commerce OS）的智能 Learning System 学习模块。
请对以下执行案例（Case Item）进行深层机器学习，并返回一份在未来的决策中如何自适应调整系统参数（如：成功概率、风险度、成本上限等）的量化建议。

【案例状态 & 目标 (Goal)】:
${JSON.stringify(caseItem.goal, null, 2)}
执行类型: ${caseItem.type.toUpperCase()} (SUCCESS 或 FAILURE)

【执行动作 (Actions)】:
${JSON.stringify(caseItem.actions, null, 2)}

【执行结果 (Outcome)】:
${JSON.stringify(caseItem.outcome, null, 2)}

请提取 1-2 项具体的决策参数调整，并只输出符合以下 JSON 格式的数据，不要包含 Markdown 标记：
[
  {
    "description": "简短描述为什么要这样调整",
    "adjustmentType": "increase_success_probability" | "reduce_risk" | "optimize_cost" | "speed_up",
    "factor": 0.5 到 1.5 之间的数值因子 (例如：成功则调大，失败则调小降低权重),
    "reason": "调整的具体学习根源"
  }
]`;

        const responseText = await llm.generate(prompt, "你是一个纯 JSON 格式输出引擎。不要输出任何解释或 markdown，直接输出 JSON。");
        let cleanText = responseText.trim();
        if (cleanText.startsWith('```')) {
          const lines = cleanText.split('\n');
          if (lines[0].includes('json') || lines[0] === '```') {
            lines.shift();
          }
          if (lines[lines.length - 1] === '```') {
            lines.pop();
          }
          cleanText = lines.join('\n').trim();
        }

        const parsedAdjustments = JSON.parse(cleanText);
        if (Array.isArray(parsedAdjustments) && parsedAdjustments.length > 0) {
          parsedAdjustments.forEach((adj: any) => {
            this.adjustments.push({
              id: `adj_${Date.now()}_llm_${Math.random().toString(36).substr(2, 5)}`,
              description: adj.description || 'AI extracted adaptive learning',
              adjustmentType: adj.adjustmentType || (caseItem.type === 'success' ? 'increase_success_probability' : 'reduce_risk'),
              factor: adj.factor || (caseItem.type === 'success' ? 1.15 : 0.8),
              reason: adj.reason || 'Extracted via Gemini Learning Engine',
              appliedTo: [this.extractGoalPattern(caseItem.goal)],
              timestamp: Date.now()
            });
          });
          learningMethod = 'Gemini / Ollama LLM Self-Learning';
          console.log(`🤖 [LLM-First Learning] AI 成功量化了 ${parsedAdjustments.length} 条自愈/自适应策略参数！`);
        }
      }
    } catch (err) {
      console.warn('⚠️ [LLM-First Learning] AI 自愈学习模块推理失败，正在使用预设学习规则回退:', err);
    }

    if (learningMethod === 'TypeScript Static Adjustments') {
      // 根据结果生成决策调整
      if (caseItem.type === 'success') {
        this.generatePositiveAdjustments(caseItem);
      } else {
        this.generateNegativeAdjustments(caseItem);
      }
    }

    console.log(`📚 [Learning System] Deep Case-based Learning completed using [${learningMethod}].`);
  }

  /**
   * 保存记忆
   */
  public remember(
    key: string,
    value: any,
    category: MemoryItem['category'] = 'business_data',
    confidence: number = 0.8,
    ttl?: number
  ): MemoryItem {
    const existing = this.memory.get(key);
    const item: MemoryItem = {
      id: existing?.id || `memory_${Date.now()}`,
      key,
      value,
      category,
      confidence: existing ? Math.max(existing.confidence, confidence) : confidence,
      lastAccessed: Date.now(),
      accessCount: existing ? existing.accessCount + 1 : 1,
      createdAt: existing?.createdAt || Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined
    };

    this.memory.set(key, item);
    console.log(`🧠 [Learning] Remembered: ${key} (confidence: ${confidence})`);
    return item;
  }

  /**
   * 回忆记忆
   */
  public recall(key: string): MemoryItem | undefined {
    const item = this.memory.get(key);
    if (item) {
      item.lastAccessed = Date.now();
      item.accessCount++;
      this.memory.set(key, item);
    }
    return item;
  }

  /**
   * 按类别检索记忆
   */
  public recallByCategory(category: MemoryItem['category']): MemoryItem[] {
    return Array.from(this.memory.values())
      .filter(item => item.category === category && this.isValidMemory(item))
      .sort((a, b) => b.lastAccessed - a.lastAccessed);
  }

  /**
   * 查找相似案例
   */
  public findSimilarCases(goal: any, limit: number = 5): Case[] {
    const goalPattern = this.extractGoalPattern(goal);
    const allCases = Array.from(this.cases.values());
    
    return allCases
      .map(c => ({
        case: c,
        similarity: this.calculateSimilarity(c.goal, goalPattern)
      }))
      .filter(x => x.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(x => x.case);
  }

  /**
   * 获取成功案例
   */
  public getSuccessCases(limit?: number): Case[] {
    const cases = Array.from(this.cases.values())
      .filter(c => c.type === 'success')
      .sort((a, b) => b.timestamp - a.timestamp);
    return limit ? cases.slice(0, limit) : cases;
  }

  /**
   * 获取失败案例
   */
  public getFailureCases(limit?: number): Case[] {
    const cases = Array.from(this.cases.values())
      .filter(c => c.type === 'failure')
      .sort((a, b) => b.timestamp - a.timestamp);
    return limit ? cases.slice(0, limit) : cases;
  }

  /**
   * 获取决策调整建议
   */
  public getDecisionAdjustments(goal: any): DecisionAdjustment[] {
    const goalPattern = this.extractGoalPattern(goal);
    
    return this.adjustments
      .filter(a => a.appliedTo.includes(goalPattern) || a.appliedTo.includes('all'))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 应用历史经验调整决策
   */
  public applyHistoricalAdjustments(decision: any, goal: any): any {
    const adjustments = this.getDecisionAdjustments(goal);
    const similarCases = this.findSimilarCases(goal);
    
    let adjustedDecision = { ...decision };
    
    // 应用调整
    adjustments.forEach(adj => {
      adjustedDecision = this.applySingleAdjustment(adjustedDecision, adj);
    });

    // 基于相似案例调整
    if (similarCases.length > 0) {
      const avgSuccessRate = similarCases.filter(c => c.type === 'success').length / similarCases.length;
      adjustedDecision.historicalConfidence = avgSuccessRate;
      adjustedDecision.similarCaseCount = similarCases.length;
    }

    return adjustedDecision;
  }

  /**
   * 获取学习到的经验总结
   */
  public getLearnedInsights(): {
    successPatterns: any[];
    failurePatterns: any[];
    keyLearnings: string[];
  } {
    const successes = this.getSuccessCases();
    const failures = this.getFailureCases();

    const successPatterns = this.extractPatterns(successes);
    const failurePatterns = this.extractPatterns(failures);

    const keyLearnings = [
      ...this.generateSuccessLearnings(successPatterns),
      ...this.generateFailureLearnings(failurePatterns)
    ];

    return {
      successPatterns,
      failurePatterns,
      keyLearnings
    };
  }

  // ========== 私有辅助方法 ==========

  private isValidMemory(item: MemoryItem): boolean {
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memory.delete(item.key);
      return false;
    }
    return true;
  }

  private extractGoalPattern(goal: any): string {
    const desc = (goal?.description || goal || '').toString().toLowerCase();
    
    if (desc.includes('revenue') || desc.includes('sales')) return 'revenue_growth';
    if (desc.includes('inventory') || desc.includes('stock')) return 'inventory_optimization';
    if (desc.includes('customer')) return 'customer_management';
    if (desc.includes('profit') || desc.includes('margin')) return 'profit_improvement';
    if (desc.includes('marketing') || desc.includes('promotion')) return 'marketing';
    return 'general';
  }

  private calculateSimilarity(goal1: any, pattern2: string): number {
    const pattern1 = this.extractGoalPattern(goal1);
    return pattern1 === pattern2 ? 1.0 : 0.2;
  }

  private generatePositiveAdjustments(caseItem: Case) {
    const pattern = this.extractGoalPattern(caseItem.goal);
    this.adjustments.push({
      id: `adj_${Date.now()}_pos`,
      description: `Success pattern observed for ${pattern}`,
      adjustmentType: 'increase_success_probability',
      factor: 1.1,
      reason: `Similar successful execution at ${new Date(caseItem.timestamp).toISOString()}`,
      appliedTo: [pattern],
      timestamp: Date.now()
    });
  }

  private generateNegativeAdjustments(caseItem: Case) {
    const pattern = this.extractGoalPattern(caseItem.goal);
    this.adjustments.push({
      id: `adj_${Date.now()}_neg`,
      description: `Failure pattern observed for ${pattern} - ${caseItem.metadata?.error}`,
      adjustmentType: 'reduce_risk',
      factor: 0.7,
      reason: `Similar failed execution at ${new Date(caseItem.timestamp).toISOString()}`,
      appliedTo: [pattern],
      timestamp: Date.now()
    });
  }

  private applySingleAdjustment(decision: any, adjustment: DecisionAdjustment): any {
    const result = { ...decision };
    switch (adjustment.adjustmentType) {
      case 'increase_success_probability':
        result.confidence = (result.confidence || 0.8) * adjustment.factor;
        break;
      case 'reduce_risk':
        result.riskTolerance = (result.riskTolerance || 0.5) * adjustment.factor;
        break;
      case 'optimize_cost':
        result.costThreshold = (result.costThreshold || 1000) * adjustment.factor;
        break;
      case 'speed_up':
        result.timeout = (result.timeout || 30000) * adjustment.factor;
        break;
    }
    return result;
  }

  private extractPatterns(cases: Case[]): any[] {
    const patterns: any[] = [];
    const patternCounts: { [key: string]: number } = {};

    cases.forEach(c => {
      const pattern = this.extractGoalPattern(c.goal);
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
    });

    Object.entries(patternCounts).forEach(([pattern, count]) => {
      patterns.push({
        pattern,
        count,
        percentage: (count / cases.length) * 100
      });
    });

    return patterns.sort((a, b) => b.count - a.count);
  }

  private generateSuccessLearnings(patterns: any[]): string[] {
    return patterns
      .slice(0, 3)
      .map(p => `✅ ${p.pattern} has ${p.count} successful executions (${p.percentage.toFixed(1)}%)`);
  }

  private generateFailureLearnings(patterns: any[]): string[] {
    return patterns
      .slice(0, 3)
      .map(p => `⚠️ ${p.pattern} has ${p.count} failures to learn from`);
  }

  private initializeBaseMemory() {
    this.remember('business:goal_types', ['revenue_growth', 'inventory_optimization', 'customer_management', 'profit_improvement'], 'business_data', 1.0);
    this.remember('preference:risk_tolerance', 0.6, 'preference', 0.7);
    this.remember('preference:speed_vs_accuracy', 'balanced', 'preference', 0.7);
  }

  public getStatus() {
    return {
      totalCases: this.cases.size,
      successCases: this.getSuccessCases().length,
      failureCases: this.getFailureCases().length,
      memoryItems: this.memory.size,
      decisionAdjustments: this.adjustments.length,
      capabilities: [
        'case_based_reasoning',
        'historical_learning',
        'long_term_memory',
        'pattern_recognition',
        'decision_adjustment'
      ]
    };
  }
}

export const learningSystem = LearningSystem.getInstance();
