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
  ): Promise<ExecutionResult> {
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
      const executionResults: ExecutionResult[] = [];
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
    const actions: ExecutionAction[] = [];
    const baseTime = Date.now();

    if (goal.type === 'increase-revenue') {
      // 增加收入的策略
      actions.push(
        {
          id: `${baseTime}-1`,
          tool: 'generateSalesReport',
          params: {},
          priority: 1,
        },
        {
          id: `${baseTime}-2`,
          tool: 'optimizeAdSpend',
          params: { metric: 'ROI' },
          priority: 2,
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
          priority: 3,
        });
      }
    } else if (goal.type === 'increase-profit') {
      // 增加利润的策略
      actions.push(
        {
          id: `${baseTime}-1`,
          tool: 'calculateProfitMargin',
          params: { period: 'monthly' },
          priority: 1,
        }
      );

      if (state.profit.margin < 30) {
        actions.push({
          id: `${baseTime}-2`,
          tool: 'updatePrice',
          params: { newPrice: 99.99, reason: 'Margin improvement' },
          priority: 2,
        });
      }
    } else if (goal.type === 'reduce-inventory') {
      // 减少库存的策略
      actions.push(
        {
          id: `${baseTime}-1`,
          tool: 'triggerLowStockAlert',
          params: { threshold: 50 },
          priority: 1,
        },
        {
          id: `${baseTime}-2`,
          tool: 'forecastInventoryNeeds',
          params: { days: 30 },
          priority: 2,
        }
      );
    } else {
      // 默认分析动作
      actions.push({
        id: `${baseTime}-1`,
        tool: 'generateSalesReport',
        params: {},
        priority: 1,
      });
    }

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
