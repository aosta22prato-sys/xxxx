/**
 * Real Execution Engine - AI Commerce OS 系统心脏
 * 
 * 完整的闭环执行系统：
 * 读状态 → 生计划 → 安全检查 → 执行动作 → 评估结果 → 学习记忆 → 反复
 */

import {
  ExecutionContext,
  BusinessState,
  ExecutionAction,
  ExecutionResult,
} from './core-interfaces';
import { toolRegistry } from './tool-registry';
import { businessStateObserver } from './business-state-observer';
import { safetyGuard, SafetyValidation } from './safety-guard';
import { resultEvaluator, CycleEvaluation } from './result-evaluator';
import { LLMIntegrator } from '../llm-integrator';

export interface ExecutionLog {
  cycleId: string;
  goal: string;
  timestamp: number;
  oldState: BusinessState;
  newState: BusinessState;
  actionsExecuted: number;
  successCount: number;
  evaluation: CycleEvaluation;
  duration: number;
}

export class RealExecutionEngine {
  private static instance: RealExecutionEngine;

  private cycles: Map<string, ExecutionLog> = new Map();
  private isRunning: boolean = false;
  private currentGoal: any = null;
  private intervalHandle: NodeJS.Timeout | null = null;

  private constructor() {
    console.log('⚙️  [Real Execution Engine] 初始化真实执行引擎...');
    console.log('   - Safety Guard: 已启用');
    console.log('   - Result Evaluator: 已启用');
    console.log('   - Business State Observer: 已启用');
  }

  public static getInstance(): RealExecutionEngine {
    if (!RealExecutionEngine.instance) {
      RealExecutionEngine.instance = new RealExecutionEngine();
    }
    return RealExecutionEngine.instance;
  }

  /**
   * 执行单个动作 - 核心执行流程
   */
  private async executeAction(
    ctx: ExecutionContext,
    action: ExecutionAction,
    safetyValidation: SafetyValidation
  ): Promise<any> {
    const actionStartTime = Date.now();

    // 1. 安全检查失败 - 直接拒绝
    if (!safetyValidation.allowed) {
      return {
        success: false,
        data: null,
        error: `BLOCKED_BY_SAFETY: ${safetyValidation.reason}`,
        executionTime: Date.now() - actionStartTime,
      };
    }

    try {
      // 2. 获取工具
      const tool = toolRegistry.getTool(action.tool);
      if (!tool) {
        return {
          success: false,
          data: null,
          error: `TOOL_NOT_FOUND: ${action.tool}`,
          executionTime: Date.now() - actionStartTime,
        };
      }

      // 3. 验证工具参数
      if (tool.validate && !tool.validate(action.params || {})) {
        return {
          success: false,
          data: null,
          error: `INVALID_PARAMS: ${action.tool}`,
          executionTime: Date.now() - actionStartTime,
        };
      }

      // 4. 执行工具（真实业务操作）
      const result = await tool.execute(ctx, action.params || {});

      ctx.log(`✅ Tool executed: ${action.tool}`, {
        success: result.success,
        duration: result.executionTime,
        rowsAffected: result.rowsAffected,
      });

      return result;
    } catch (error: any) {
      ctx.error(`❌ Tool execution failed: ${action.tool}`, error);

      return {
        success: false,
        data: null,
        error: `EXECUTION_ERROR: ${error.message}`,
        executionTime: Date.now() - actionStartTime,
      };
    }
  }

  /**
   * 核心执行循环 - Observe → Plan → Execute → Evaluate → Learn
   */
  public async runFullCycle(
    ctx: ExecutionContext,
    goal: any
  ): Promise<ExecutionLog> {
    const cycleId = `exec-${Date.now()}`;
    const cycleStartTime = Date.now();

    console.log(`\n🔄 [Execution Cycle] ${cycleId}`);
    console.log(
      `📍 Goal: ${goal.description || goal.type || JSON.stringify(goal)}`
    );
    console.log('━'.repeat(80));

    try {
      // ==========================================
      // PHASE 1: OBSERVE - 读取当前业务状态
      // ==========================================
      console.log('📊 [Phase 1] OBSERVE 观察当前状态');
      const oldState = await businessStateObserver.observeBusinessState(ctx);
      console.log(`   Revenue: ¥${oldState.revenue.monthly.toFixed(0)}`);
      console.log(`   Profit Margin: ${oldState.profit.margin.toFixed(2)}%`);
      console.log(`   Orders: ${oldState.orders.totalCount}`);
      console.log(`   Ads ROI: ${oldState.marketing.adsROI.toFixed(2)}`);

      // ==========================================
      // PHASE 2: PLAN - 生成执行计划
      // ==========================================
      console.log('\n📋 [Phase 2] PLAN 生成执行计划');
      const actions = await this.generateActions(goal, oldState);
      console.log(`   Generated ${actions.length} actions`);

      // ==========================================
      // PHASE 3: SAFETY CHECK - 安全验证
      // ==========================================
      console.log('\n🛡️  [Phase 3] SAFETY 安全检查');
      const validations = await safetyGuard.validateBatch(actions, oldState);

      const blockedCount = Array.from(validations.values()).filter(
        (v) => !v.allowed
      ).length;
      const warningCount = Array.from(validations.values()).filter(
        (v) => v.riskLevel === 'warning'
      ).length;

      console.log(`   Blocked: ${blockedCount}, Warnings: ${warningCount}`);

      // ==========================================
      // PHASE 4: EXECUTE - 执行动作
      // ==========================================
      console.log('\n🚀 [Phase 4] EXECUTE 执行动作');
      const executionResults: any[] = [];
      let successCount = 0;

      for (const action of actions) {
        const validation = validations.get(action.id);
        if (!validation) {
          console.log(`      ⚠️ Skipping ${action.id} - no validation found`);
          continue;
        }
        
        console.log(`   [${action.tool}] 执行中...`);
        const result = await this.executeAction(ctx, action, validation);
        executionResults.push(result);

        if (result.success) {
          successCount++;
          console.log(`      ✅ Success (${result.executionTime}ms)`);
        } else {
          console.log(`      ❌ Failed: ${result.error}`);
        }
      }

      console.log(
        `   执行结果: ${successCount}/${actions.length} (${((successCount / actions.length) * 100).toFixed(1)}%)`
      );

      // ==========================================
      // PHASE 5: EVALUATE - 评估结果
      // ==========================================
      console.log('\n📈 [Phase 5] EVALUATE 评估结果');
      const newState = await businessStateObserver.observeBusinessState(ctx);

      const evaluation = resultEvaluator.evaluateCycle(
        executionResults.map((r) => ({ success: r.success })) as any,
        oldState,
        newState
      );

      console.log(`   Overall Score: ${evaluation.overallScore.toFixed(0)}/100`);
      console.log(`   Impact: ${evaluation.overallImpact.toUpperCase()}`);
      console.log(
        `   Revenue Change: ${evaluation.overallDelta.revenue > 0 ? '+' : ''}¥${evaluation.overallDelta.revenue.toFixed(0)}`
      );
      console.log(
        `   Profit Change: ${evaluation.overallDelta.profit > 0 ? '+' : ''}¥${evaluation.overallDelta.profit.toFixed(0)}`
      );

      // ==========================================
      // PHASE 6: LEARN - 学习和记忆
      // ==========================================
      console.log('\n🧠 [Phase 6] LEARN 学习经验');
      await this.learnFromCycle(ctx, {
        goal,
        oldState,
        newState,
        evaluation,
        executionResults,
      });
      console.log('   ✅ 学习记录已存储');

      // ==========================================
      // 完成循环
      // ==========================================
      const cycleDuration = Date.now() - cycleStartTime;

      const log: ExecutionLog = {
        cycleId,
        goal: goal.description || goal.type || 'unknown',
        timestamp: Date.now(),
        oldState,
        newState,
        actionsExecuted: actions.length,
        successCount,
        evaluation,
        duration: cycleDuration,
      };

      this.cycles.set(cycleId, log);

      console.log('\n' + '━'.repeat(80));
      console.log(
        `✅ [Cycle Complete] 耗时 ${(cycleDuration / 1000).toFixed(2)}s`
      );
      console.log(resultEvaluator.getSummary(evaluation));

      return log;
    } catch (error: any) {
      ctx.error('Execution cycle failed', error);
      throw error;
    }
  }

  /**
   * 根据目标生成执行动作
   */
  private async generateActions(
    goal: any,
    state: BusinessState
  ): Promise<ExecutionAction[]> {
    let actions: ExecutionAction[] = [];
    const baseTime = Date.now();
    let plannerUsed = 'TypeScript Hardcoded Rules';

    try {
      const llm = LLMIntegrator.getInstance();
      if (await llm.isAvailable()) {
        console.log('🤖 [Real-Execution LLM-First Planner] 正在使用大模型推理生成执行步骤...');
        const prompt = `你是一个电商多智能体自治系统（AI Commerce OS）的主力 Planner 引擎。
请根据用户的经营目标（Goal）和当前的店铺经营状态（Business State），从以下可用工具库中选择一系列最优的工具动作（Actions），组成执行计划，以实现该目标。

【经营目标 (Goal)】:
${JSON.stringify(goal, null, 2)}

【当前店铺经营状态 (Business State)】:
- 月销售额 (Monthly Revenue): ¥${state.revenue.monthly}
- 利润率 (Profit Margin): ${state.profit.margin.toFixed(2)}%
- 广告投资回报率 (Ads ROI): ${state.marketing.adsROI.toFixed(2)}
- 转化率 (Conversion Rate): ${state.orders.conversionRate.toFixed(2)}%
- 库存总量 (Total Units): ${state.inventory.totalUnits}
- 仓库容量 (Warehouse Capacity): ${state.inventory.warehouseCapacity}

【可用工具库】:
1. "generateSalesReport" - 生成销售分析报告。参数: {}
2. "optimizeAdSpend" - 优化广告投放以提高ROI。参数: { "metric": "ROI" | "conversion" }
3. "updatePrice" - 调整商品售价。参数: { "productId": string (例如 "top-sku"), "newPrice": number, "reason": string }
4. "calculateProfitMargin" - 评估财务并计算利润率。参数: { "period": "monthly" | "weekly" }
5. "triggerLowStockAlert" - 触发库存预警。参数: { "threshold": number }
6. "forecastInventoryNeeds" - 预测未来30天库存需求。参数: { "days": number }
7. "segmentCustomers" - 对流失风险客户进行聚类分群。参数: { "criteria": "atrisk" }
8. "adjustInventory" - 调整或补充库存。参数: { "quantity": number, "reason": string }

【返回格式要求】:
必须只返回一个 JSON 数组。数组中的每个元素必须符合以下格式，不可包含任何 Markdown 标记或其它多余字符（注意 priority 需要是整数优先级，如 1 (高), 2 (中), 3 (低)）：
[
  {
    "id": "唯一ID",
    "tool": "工具名称",
    "params": { ... },
    "priority": 1 | 2 | 3
  }
]`;

        const responseText = await llm.generate(prompt, "你是一个极简格式 JSON 输出引擎。不要输出 markdown，直接输出 JSON。");
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

        const parsedActions = JSON.parse(cleanText);
        if (Array.isArray(parsedActions) && parsedActions.length > 0) {
          actions = parsedActions.map((act, idx) => ({
            id: act.id || `${baseTime}-${idx + 1}`,
            tool: act.tool,
            params: act.params || {},
            priority: act.priority || 1
          }));
          plannerUsed = 'Gemini / Ollama LLM Reasoner';
          console.log(`🤖 [Real-Execution LLM-First Planner] 成功用 AI 生成了 ${actions.length} 个动作！`);
        }
      }
    } catch (err) {
      console.warn('⚠️ [Real-Execution LLM-First Planner] 大模型生成计划失败，正在使用安全规则回退:', err);
    }

    if (actions.length === 0) {
      if (goal.type === 'increase-revenue') {
        // 增加收入的策略
        actions.push(
          {
            id: `${baseTime}-1`,
            tool: 'generateSalesReport',
            params: {},
            priority: 'high',
          },
          {
            id: `${baseTime}-2`,
            tool: 'optimizeAdSpend',
            params: { metric: 'ROI' },
            priority: 'medium',
          }
        );

        if (state.orders.conversionRate < 2) {
          actions.push({
            id: `${baseTime}-3`,
            tool: 'updatePrice',
            params: {
              productId: 'top-sku',
              newPrice: 79.99,
              reason: 'Promotion',
            },
            priority: 'low',
          });
        }
      } else if (goal.type === 'increase-profit') {
        // 增加利润的策略
        actions.push(
          {
            id: `${baseTime}-1`,
            tool: 'calculateProfitMargin',
            params: { period: 'monthly' },
            priority: 'high',
          }
        );

        if (state.profit.margin < 30) {
          actions.push({
            id: `${baseTime}-2`,
            tool: 'updatePrice',
            params: { newPrice: 99.99, reason: 'Margin improvement' },
            priority: 'medium',
          });
        }
      } else if (goal.type === 'reduce-inventory') {
        // 减少库存的策略
        actions.push(
          {
            id: `${baseTime}-1`,
            tool: 'triggerLowStockAlert',
            params: { threshold: 50 },
            priority: 'high',
          },
          {
            id: `${baseTime}-2`,
            tool: 'forecastInventoryNeeds',
            params: { days: 30 },
            priority: 'medium',
          }
        );
      } else {
        // 默认分析动作
        actions.push({
          id: `${baseTime}-1`,
          tool: 'generateSalesReport',
          params: {},
          priority: 'low',
        });
      }
    }

    console.log(`📋 [RealExecutionEngine] Actions compiled using [${plannerUsed}].`);
    return actions;
  }

  /**
   * 从执行循环中学习
   */
  private async learnFromCycle(ctx: ExecutionContext, cycle: any) {
    // 存储学习记录
    await ctx.db.create('learningCycles', {
      cycleId: cycle.goal,
      goal: cycle.goal,
      oldState: JSON.stringify(cycle.oldState),
      newState: JSON.stringify(cycle.newState),
      evaluation: JSON.stringify(cycle.evaluation),
      successCount: cycle.executionResults.filter((r: any) => r.success)
        .length,
      totalActions: cycle.executionResults.length,
      timestamp: new Date(),
    });

    // 发送学习事件
    await ctx.eventBus.publish('cycle:completed', {
      cycleId: cycle.goal,
      score: cycle.evaluation.overallScore,
      impact: cycle.evaluation.overallImpact,
    });
  }

  /**
   * 启动自主循环 - 持续运行
   */
  public async startAutonomousLoop(
    ctx: ExecutionContext,
    goal: any,
    intervalMinutes: number = 5
  ): Promise<void> {
    if (this.isRunning) {
      ctx.log('⚠️ Autonomous loop already running');
      return;
    }

    this.isRunning = true;
    this.currentGoal = goal;

    console.log(`\n🤖 [Autonomous Loop] 启动自主运行循环`);
    console.log(`   Goal: ${goal.description || goal.type}`);
    console.log(`   Interval: 每 ${intervalMinutes} 分钟执行一次`);
    console.log('━'.repeat(80));

    // 立即执行一次
    try {
      await this.runFullCycle(ctx, goal);
    } catch (error) {
      ctx.error('Initial cycle failed', error);
    }

    // 定时循环
    const intervalMs = intervalMinutes * 60 * 1000;
    this.intervalHandle = setInterval(async () => {
      try {
        await this.runFullCycle(ctx, this.currentGoal);
      } catch (error) {
        ctx.error('Autonomous cycle failed', error);
      }
    }, intervalMs);
  }

  /**
   * 停止自主循环
   */
  public stopAutonomousLoop(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }

    this.isRunning = false;
    console.log('🛑 [Autonomous Loop] 已停止');
  }

  /**
   * 获取执行历史
   */
  public getCycleHistory(limit: number = 10): ExecutionLog[] {
    return Array.from(this.cycles.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * 获取系统状态
   */
  public getStatus() {
    const safetyStats = safetyGuard.getStats();

    return {
      isRunning: this.isRunning,
      currentGoal: this.currentGoal,
      cyclesCompleted: this.cycles.size,
      safety: safetyStats,
      recentCycles: this.getCycleHistory(3).map((log) => ({
        cycleId: log.cycleId,
        goal: log.goal,
        score: log.evaluation.overallScore,
        impact: log.evaluation.overallImpact,
        duration: `${(log.duration / 1000).toFixed(2)}s`,
      })),
    };
  }
}

export const realExecutionEngine = RealExecutionEngine.getInstance();
