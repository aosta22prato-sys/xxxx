/**
 * Reflection Engine - 反思系统 (增强版)
 *
 * 核心功能：
 * - 分析执行结果（成功/失败）
 * - 识别错误决策模式
 * - 提取经验教训
 * - 避免重复犯错
 * - 生成可复用策略
 */

import { LLMIntegrator } from '../llm-integrator';

export interface ExecutionResult {
  id: string;
  timestamp: number;
  goal: any;
  actions: any[];
  success: boolean;
  outcome: any;
  error?: string;
  duration: number;
  metadata?: any;
}

export interface FailurePattern {
  id: string;
  patternType: 'bad_decision' | 'missing_data' | 'timing_issue' | 'tool_error' | 'unknown';
  description: string;
  occurrences: number;
  firstSeen: number;
  lastSeen: number;
  associatedExecutions: string[];
  suggestedFix: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  category: 'success' | 'failure' | 'improvement';
  context: any;
  timestamp: number;
  applicability: string[];
  confidence: number;
}

export interface ReusableStrategy {
  id: string;
  name: string;
  description: string;
  steps: string[];
  successRate: number;
  useCount: number;
  applicableScenarios: string[];
  createdAt: number;
  lastUsed?: number;
}

export class ReflectionEngine {
  private static instance: ReflectionEngine;
  private executionHistory: Map<string, ExecutionResult> = new Map();
  private failurePatterns: Map<string, FailurePattern> = new Map();
  private lessons: Lesson[] = [];
  private strategies: Map<string, ReusableStrategy> = new Map();

  private constructor() {
    console.log('🧠 [Reflection Engine] Initializing...');
    this.initializeDefaultStrategies();
  }

  public static getInstance(): ReflectionEngine {
    if (!ReflectionEngine.instance) {
      ReflectionEngine.instance = new ReflectionEngine();
    }
    return ReflectionEngine.instance;
  }

  /**
   * 分析执行结果并生成反思
   */
  public async analyzeExecution(result: ExecutionResult): Promise<{
    analysis: any;
    lessons: Lesson[];
    patternMatch?: FailurePattern;
    recommendations: string[];
  }> {
    console.log(`🔍 [Reflection Engine] Analyzing execution with LLM-first: ${result.id}`);
    
    // 保存执行历史
    this.executionHistory.set(result.id, result);
    
    let analysis: any = null;
    let lessons: Lesson[] = [];
    let patternMatch: FailurePattern | undefined = undefined;
    let recommendations: string[] = [];
    let reflectionMethod = 'TypeScript Heuristic Rules';

    try {
      const llm = LLMIntegrator.getInstance();
      if (await llm.isAvailable()) {
        console.log('🤖 [LLM-First Reflection] 正在使用大模型对本次执行结果进行深度反思与根因分析...');
        const prompt = `你是一个多智能体电商系统（AI Commerce OS）的主脑 Reflection Engine。
请分析以下动作执行结果（Execution Result）并提取深层次的经验、失败规律（Root Cause Pattern）及策略性优化建议（Recommendations）。

【执行目标 (Goal)】:
${JSON.stringify(result.goal, null, 2)}

【执行动作及结果 (Actions & Success Status)】:
${JSON.stringify(result.actions, null, 2)}
执行总体成功状态: ${result.success ? '成功 (SUCCESS)' : '失败 (FAILED)'}
错误详情: ${result.error || '无'}
执行耗时: ${result.duration}ms

请根据上述信息进行深层反思，给出并输出符合以下 JSON 格式的深度分析报告，不可包含 Markdown 标记：
{
  "rootCause": "关于成功或失败的核心根因分析，不要浮于表面...",
  "cognitivePatterns": "识别到的行为决策/认知/技术模式，指出可能的规律或重犯风险...",
  "recommendations": [
    "针对下一次执行的具体改良、预防、或放大成功的建议 1",
    "建议 2"
  ],
  "lessons": [
    {
      "title": "经验总结标题 1",
      "content": "具体的经验、规律或反思内容 1",
      "category": "success" | "failure" | "improvement"
    }
  ],
  "confidenceScore": 0.0 ~ 1.0
}`;

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

        const parsed = JSON.parse(cleanText);
        if (parsed) {
          reflectionMethod = 'Gemini / Ollama LLM Reflection';
          analysis = {
            success: result.success,
            duration: result.duration,
            overallAssessment: parsed.rootCause,
            cognitivePatterns: parsed.cognitivePatterns,
            contributingFactors: [{ type: result.success ? 'success' : 'failure', severity: 'high', description: parsed.rootCause }],
            impact: result.success ? 'low' : 'high'
          };
          recommendations = parsed.recommendations || [];
          lessons = (parsed.lessons || []).map((l: any, idx: number) => ({
            id: `lesson_${Date.now()}_llm_${idx}`,
            title: l.title || 'LLM Lesson',
            content: l.content || 'N/A',
            category: l.category || (result.success ? 'success' : 'failure'),
            context: { goal: result.goal, actions: result.actions },
            timestamp: Date.now(),
            applicability: [this.extractGoalType(result.goal)],
            confidence: parsed.confidenceScore || 0.9
          }));

          if (!result.success) {
            patternMatch = {
              id: `pattern_${Date.now()}`,
              patternType: this.classifyFailureType(result),
              description: parsed.cognitivePatterns || 'LLM identified failure signature',
              occurrences: 1,
              firstSeen: Date.now(),
              lastSeen: Date.now(),
              associatedExecutions: [result.id],
              suggestedFix: recommendations[0] || 'Review system constraints'
            };
            this.failurePatterns.set(patternMatch.id, patternMatch);
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ [LLM-First Reflection] AI 反思执行失败，正在回退到硬编码规则模式:', err);
    }

    // 回退规则
    if (!analysis) {
      // 核心分析
      analysis = this.performRootCauseAnalysis(result);
      
      // 识别失败模式
      patternMatch = result.success ? undefined : this.identifyFailurePattern(result);
      
      // 提取经验教训
      lessons = this.extractLessons(result, analysis);
      
      // 生成推荐
      recommendations = this.generateRecommendations(result, analysis, patternMatch);
    }

    this.lessons.push(...lessons);
    
    // 更新策略库
    if (result.success) {
      this.updateStrategiesFromSuccess(result);
    } else if (patternMatch) {
      this.updateStrategiesFromFailure(result, patternMatch);
    }

    console.log(`🧠 [Reflection Engine] Reflection completed using [${reflectionMethod}].`);

    return {
      analysis,
      lessons,
      patternMatch,
      recommendations
    };
  }

  /**
   * 分析执行结果（简化版，保持向后兼容）
   */
  public async reflect(executionId: string, data: any): Promise<any> {
    console.log(`🔍 [Reflection] Reflecting on execution: ${executionId}`);
    
    const result: ExecutionResult = {
      id: executionId,
      timestamp: Date.now(),
      goal: data.goal || {},
      actions: data.actions || [],
      success: data.success !== false,
      outcome: data.outcome || {},
      error: data.error,
      duration: data.duration || 0,
      metadata: data.metadata || {}
    };

    const analysis = await this.analyzeExecution(result);
    
    return {
      executionId,
      success: result.success,
      analysis,
      timestamp: Date.now()
    };
  }

  /**
   * 根因分析
   */
  private performRootCauseAnalysis(result: ExecutionResult) {
    const factors: any[] = [];
    
    if (!result.success) {
      if (result.error?.toLowerCase().includes('timeout')) {
        factors.push({ type: 'timing', severity: 'high', description: 'Execution timed out' });
      }
      if (result.error?.toLowerCase().includes('not found') || result.error?.toLowerCase().includes('undefined')) {
        factors.push({ type: 'missing_data', severity: 'high', description: 'Missing required data' });
      }
      if (result.error?.toLowerCase().includes('tool') || result.error?.toLowerCase().includes('api')) {
        factors.push({ type: 'tool_error', severity: 'medium', description: 'Tool/API execution failed' });
      }
      if (factors.length === 0) {
        factors.push({ type: 'unknown', severity: 'low', description: 'Unknown failure cause' });
      }
    }

    return {
      success: result.success,
      duration: result.duration,
      contributingFactors: factors,
      impact: this.calculateImpact(result),
      overallAssessment: this.generateAssessment(result, factors)
    };
  }

  /**
   * 识别失败模式
   */
  private identifyFailurePattern(result: ExecutionResult): FailurePattern | undefined {
    const errorSignature = this.generateErrorSignature(result);
    
    // 查找现有模式
    for (const [id, pattern] of this.failurePatterns) {
      if (this.matchesPattern(pattern, errorSignature)) {
        pattern.occurrences++;
        pattern.lastSeen = Date.now();
        pattern.associatedExecutions.push(result.id);
        this.failurePatterns.set(id, pattern);
        return pattern;
      }
    }

    // 创建新模式
    const newPattern: FailurePattern = {
      id: `pattern_${Date.now()}`,
      patternType: this.classifyFailureType(result),
      description: this.describeFailure(result),
      occurrences: 1,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      associatedExecutions: [result.id],
      suggestedFix: this.generateSuggestedFix(result)
    };
    
    this.failurePatterns.set(newPattern.id, newPattern);
    return newPattern;
  }

  /**
   * 从执行中提取经验教训
   */
  private extractLessons(result: ExecutionResult, analysis: any): Lesson[] {
    const lessons: Lesson[] = [];
    
    // 成功经验
    if (result.success) {
      lessons.push({
        id: `lesson_${Date.now()}_1`,
        title: 'Successful execution pattern',
        content: `Goal "${result.goal?.description || 'unknown'}" completed successfully in ${result.duration}ms.`,
        category: 'success',
        context: { goal: result.goal, actions: result.actions },
        timestamp: Date.now(),
        applicability: this.extractApplicability(result),
        confidence: 0.85
      });
    } 
    // 失败教训
    else {
      lessons.push({
        id: `lesson_${Date.now()}_1`,
        title: 'Execution failure learned',
        content: `Failed to execute goal: ${result.error || 'Unknown error'}`,
        category: 'failure',
        context: { goal: result.goal, error: result.error },
        timestamp: Date.now(),
        applicability: this.extractApplicability(result),
        confidence: 0.9
      });
      
      if (analysis.contributingFactors.length > 0) {
        lessons.push({
          id: `lesson_${Date.now()}_2`,
          title: 'Root cause identified',
          content: `Identified ${analysis.contributingFactors.length} contributing factor(s)`,
          category: 'improvement',
          context: { factors: analysis.contributingFactors },
          timestamp: Date.now(),
          applicability: ['diagnosis'],
          confidence: 0.75
        });
      }
    }

    return lessons;
  }

  /**
   * 生成改进推荐
   */
  private generateRecommendations(
    result: ExecutionResult, 
    analysis: any, 
    pattern?: FailurePattern
  ): string[] {
    const recommendations: string[] = [];
    
    if (result.success) {
      recommendations.push('Consider documenting this successful approach');
      recommendations.push('Check if this pattern can be reused for similar goals');
    } else {
      if (pattern) {
        recommendations.push(pattern.suggestedFix);
        recommendations.push(`This pattern has occurred ${pattern.occurrences} times - prioritize fixing`);
      }
      
      analysis.contributingFactors.forEach((factor: any) => {
        if (factor.type === 'timing') {
          recommendations.push('Increase timeout thresholds or split into smaller tasks');
        }
        if (factor.type === 'missing_data') {
          recommendations.push('Add data validation checks before execution');
        }
      });
    }
    
    return recommendations;
  }

  /**
   * 从成功中更新策略
   */
  private updateStrategiesFromSuccess(result: ExecutionResult) {
    const goalType = this.extractGoalType(result.goal);
    
    for (const [id, strategy] of this.strategies) {
      if (strategy.applicableScenarios.includes(goalType)) {
        strategy.useCount++;
        strategy.successRate = ((strategy.successRate * (strategy.useCount - 1)) + 1) / strategy.useCount;
        strategy.lastUsed = Date.now();
        this.strategies.set(id, strategy);
      }
    }
  }

  /**
   * 从失败中更新策略
   */
  private updateStrategiesFromFailure(result: ExecutionResult, pattern: FailurePattern) {
    const goalType = this.extractGoalType(result.goal);
    
    for (const [id, strategy] of this.strategies) {
      if (strategy.applicableScenarios.includes(goalType)) {
        strategy.useCount++;
        strategy.successRate = (strategy.successRate * (strategy.useCount - 1)) / strategy.useCount;
        this.strategies.set(id, strategy);
      }
    }
  }

  /**
   * 获取适用的策略
   */
  public getRelevantStrategies(goalType: string): ReusableStrategy[] {
    return Array.from(this.strategies.values())
      .filter(s => s.applicableScenarios.includes(goalType))
      .sort((a, b) => b.successRate - a.successRate);
  }

  /**
   * 获取近期经验教训
   */
  public getRecentLessons(limit: number = 10): Lesson[] {
    return [...this.lessons]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * 获取失败模式统计
   */
  public getFailurePatterns(): FailurePattern[] {
    return Array.from(this.failurePatterns.values())
      .sort((a, b) => b.occurrences - a.occurrences);
  }

  // ========== 辅助方法 ==========

  private generateErrorSignature(result: ExecutionResult): string {
    return `${result.error?.slice(0, 100) || 'no_error'}_${this.extractGoalType(result.goal)}`;
  }

  private matchesPattern(pattern: FailurePattern, signature: string): boolean {
    const patternType = pattern.patternType;
    return signature.includes(patternType) || signature.includes(pattern.description);
  }

  private classifyFailureType(result: ExecutionResult): FailurePattern['patternType'] {
    const error = result.error?.toLowerCase() || '';
    if (error.includes('timeout') || error.includes('time')) return 'timing_issue';
    if (error.includes('not found') || error.includes('undefined') || error.includes('null')) return 'missing_data';
    if (error.includes('tool') || error.includes('api') || error.includes('service')) return 'tool_error';
    return 'unknown';
  }

  private describeFailure(result: ExecutionResult): string {
    return `Failed at: ${result.goal?.description || 'unknown goal'}. Error: ${result.error?.slice(0, 200)}`;
  }

  private generateSuggestedFix(result: ExecutionResult): string {
    const error = result.error?.toLowerCase() || '';
    if (error.includes('timeout')) return 'Increase timeout or break into smaller tasks';
    if (error.includes('not found')) return 'Validate required data exists before execution';
    if (error.includes('tool')) return 'Check tool availability and permissions';
    return 'Review execution logic and add more error handling';
  }

  private calculateImpact(result: ExecutionResult): 'low' | 'medium' | 'high' {
    if (!result.success) return 'high';
    if (result.duration > 30000) return 'medium';
    return 'low';
  }

  private generateAssessment(result: ExecutionResult, factors: any[]): string {
    if (result.success) {
      return factors.length > 0 ? 'Success with minor considerations' : 'Complete success';
    }
    return 'Execution failed - see contributing factors';
  }

  private extractApplicability(result: ExecutionResult): string[] {
    return [this.extractGoalType(result.goal), 'general'];
  }

  private extractGoalType(goal: any): string {
    const desc = (goal?.description || '').toLowerCase();
    if (desc.includes('revenue') || desc.includes('sales')) return 'revenue_growth';
    if (desc.includes('inventory') || desc.includes('stock')) return 'inventory_optimization';
    if (desc.includes('customer')) return 'customer_management';
    if (desc.includes('profit') || desc.includes('margin')) return 'profit_improvement';
    return 'general';
  }

  private initializeDefaultStrategies() {
    const defaults: ReusableStrategy[] = [
      {
        id: 'strategy_data_validation',
        name: 'Data First Validation',
        description: 'Always validate required data exists before executing actions',
        steps: ['Check dependencies', 'Validate inputs', 'Confirm availability', 'Execute'],
        successRate: 0.92,
        useCount: 15,
        applicableScenarios: ['general', 'inventory_optimization'],
        createdAt: Date.now()
      },
      {
        id: 'strategy_small_steps',
        name: 'Incremental Execution',
        description: 'Break large goals into smaller, verifiable steps',
        steps: ['Decompose goal', 'Execute step 1', 'Verify', 'Execute step 2', 'Verify', 'Complete'],
        successRate: 0.88,
        useCount: 12,
        applicableScenarios: ['general', 'revenue_growth'],
        createdAt: Date.now()
      }
    ];
    
    defaults.forEach(s => this.strategies.set(s.id, s));
  }

  public getStatus() {
    return {
      totalExecutionsAnalyzed: this.executionHistory.size,
      lessonsLearned: this.lessons.length,
      failurePatternsIdentified: this.failurePatterns.size,
      strategiesAvailable: this.strategies.size,
      capabilities: [
        'root_cause_analysis',
        'failure_pattern_recognition',
        'lesson_extraction',
        'strategy_recommendation',
        'continuous_improvement'
      ]
    };
  }
}

export const reflectionEngine = ReflectionEngine.getInstance();
