/**
 * Execution Engine - 真实闭环执行引擎
 * 
 * 这是整个系统的心脏：
 * Observe → Plan → Execute → Evaluate → Learn → Repeat
 */

import {
  ExecutionContext,
  BusinessState,
  ExecutionPlan,
  ExecutionResult,
  ExecutionMetrics,
  ExecutionAction,
} from './core-interfaces';
import { toolRegistry } from './tool-registry';
import { businessStateObserver } from './business-state-observer';

export interface ExecutionCycle {
  cycleId: string;
  goal: string;
  state: BusinessState;
  plan: ExecutionPlan;
  results: ExecutionResult;
  timestamp: number;
}

export class ExecutionEngine {
  private static instance: ExecutionEngine;
  private cycles: Map<string, ExecutionCycle> = new Map();
  private isRunning: boolean = false;
  private currentGoal: any = null;

  private constructor() {
    console.log('⚙️  [Execution Engine] 初始化真实闭环执行引擎...');
  }

  public static getInstance(): ExecutionEngine {
    if (!ExecutionEngine.instance) {
      ExecutionEngine.instance = new ExecutionEngine();
    }
    return ExecutionEngine.instance;
  }

  /**
   * 运行完整的执行循环
   * 这是系统的核心驱动力
   */
  public async runFullCycle(
    ctx: ExecutionContext,
    goal: any
  ): Promise<ExecutionCycle> {
    const cycleId = `cycle-${Date.now()}`;
    const startTime = Date.now();

    console.log(`🔄 [Execution Cycle] 开始执行循环 (${cycleId})`);
    console.log(`📍 [Goal] ${goal.description || JSON.stringify(goal)}`);

    try {
      // 1. OBSERVE：观察当前业务状态
      console.log('📊 [Phase 1] 观察业务状态...');
      const state = await businessStateObserver.observeBusinessState(ctx);
      console.log(
        `✅ [State] 收入: ¥${state.revenue.monthly}, 利润: ${state.profit.margin.toFixed(2)}%, 订单: ${state.orders.totalCount}`
      );

      // 2. PLAN：生成执行计划
      console.log('📋 [Phase 2] 生成执行计划...');
      const plan = await this.generatePlan(ctx, goal, state);
      console.log(`✅ [Plan] 生成了 ${plan.actions.length} 个执行动作`);

      // 3. EXECUTE：执行计划
      console.log('🚀 [Phase 3] 执行计划...');
      const results = await this.executePlan(ctx, plan);
      console.log(
        `✅ [Execution] 成功 ${results.actionResults.filter((r) => r.success).length}/${results.actionResults.length} 个动作`
      );

      // 4. EVALUATE：评估结果
      console.log('📈 [Phase 4] 评估结果...');
      const evaluation = await this.evaluateResults(ctx, state, results);
      console.log(`✅ [Evaluation] ${evaluation}`);

      // 5. LEARN：学习
      console.log('🧠 [Phase 5] 学习经验...');
      await this.learnFromCycle(ctx, { state, plan, results });
      console.log(`✅ [Learning] 经验已存储`);

      // 构建完整的循环记录
      const cycle: ExecutionCycle = {
        cycleId,
        goal: goal.description || JSON.stringify(goal),
        state,
        plan,
        results,
        timestamp: Date.now(),
      };

      this.cycles.set(cycleId, cycle);

      console.log(
        `✅ [Cycle Complete] 耗时 ${(Date.now() - startTime) / 1000}s\n`
      );
      return cycle;
    } catch (error) {
      ctx.error('Execution cycle failed', error);
      throw error;
    }
  }

  /**
   * 生成执行计划
   * 根据目标和当前状态，生成应该执行的动作列表
   */
  private async generatePlan(
    ctx: ExecutionContext,
    goal: any,
    state: BusinessState
  ): Promise<ExecutionPlan> {
    const planId = `plan-${Date.now()}`;
    const actions: ExecutionAction[] = [];

    // 根据目标类型生成动作
    if (goal.type === 'increase-revenue') {
      // 增加收入的策略
      if (state.inventory.totalUnits < state.inventory.warehouseCapacity * 0.3) {
        // 库存不足，需要补货
        actions.push({
          tool: 'adjustInventory',
          params: { quantity: 100, reason: 'Restocking for revenue increase' },
          priority: 'high',
        });
      }

      // 优化广告投放
      if (state.marketing.adsROI < 1) {
        actions.push({
          tool: 'optimizeAdSpend',
          params: { metric: 'ROI' },
          priority: 'high',
        });
      }

      // 降价促销
      if (state.orders.conversionRate < 2) {
        actions.push({
          tool: 'updatePrice',
          params: {
            productId: 'top-sku',
            newPrice: 79.99,
            reason: 'Promotion to increase conversion',
          },
          priority: 'medium',
        });
      }
    } else if (goal.type === 'increase-profit') {
      // 增加利润的策略
      if (state.profit.margin < 30) {
        // 增加价格
        actions.push({
          tool: 'updatePrice',
          params: {
            newPrice: 99.99,
            reason: 'Margin improvement',
          },
          priority: 'high',
        });
      }

      // 减少广告支出
      if (state.marketing.adsROI < 1.5) {
        actions.push({
          tool: 'pauseCampaign',
          params: { campaignId: 'low-roi-campaign' },
          priority: 'medium',
        });
      }

      // 优化库存
      actions.push({
        tool: 'forecastInventoryNeeds',
        params: { days: 30 },
        priority: 'low',
      });
    } else if (goal.type === 'reduce-churn') {
      // 减少流失的策略
      actions.push({
        tool: 'segmentCustomers',
        params: { criteria: 'atrisk' },
        priority: 'high',
      });
    } else if (goal.description) {
      // 自然语言目标 - 生成通用动作
      actions.push(
        {
          tool: 'generateSalesReport',
          params: { period: 'monthly' },
          priority: 'high',
        },
        {
          tool: 'calculateProfitMargin',
          params: { period: 'monthly' },
          priority: 'high',
        }
      );
    }

    // 确保有至少一个动作
    if (actions.length === 0) {
      actions.push({
        tool: 'generateSalesReport',
        params: {},
        priority: 'low',
      });
    }

    const plan: ExecutionPlan = {
      planId,
      goal: goal.description || JSON.stringify(goal),
      actions,
      createdAt: Date.now(),
      priority: goal.priority || 'medium',
      estimatedDurationMinutes: actions.length * 2,
    };

    return plan;
  }

  /**
   * 执行计划中的所有动作
   */
  private async executePlan(
    ctx: ExecutionContext,
    plan: ExecutionPlan
  ): Promise<ExecutionResult> {
    const executionId = `exec-${Date.now()}`;
    const startTime = Date.now();
    const actionResults = [];

    console.log(`  执行 ${plan.actions.length} 个动作...`);

    for (const action of plan.actions) {
      try {
        console.log(`    ➡️  [${action.tool}] 执行中...`);

        const result = await toolRegistry.executeTool(
          ctx,
          action.tool,
          action.params || {}
        );

        actionResults.push({
          action: action.tool,
          success: result.success,
          result: result.data,
          error: result.error,
        });

        if (result.success) {
          console.log(`      ✅ 成功 (${result.executionTime}ms)`);
        } else {
          console.log(`      ❌ 失败: ${result.error}`);
        }
      } catch (error) {
        console.log(`      ❌ 异常: ${error}`);
        actionResults.push({
          action: action.tool,
          success: false,
          error: String(error),
        });
      }
    }

    const successCount = actionResults.filter((r) => r.success).length;
    const failureCount = actionResults.length - successCount;

    const metrics: ExecutionMetrics = {
      startTime,
      endTime: Date.now(),
      duration: Date.now() - startTime,
      successCount,
      failureCount,
      totalActions: actionResults.length,
      successRate: (successCount / actionResults.length) * 100,
    };

    const result: ExecutionResult = {
      executionId,
      planId: plan.planId,
      goal: plan.goal,
      status:
        failureCount === 0 ? 'success' : failureCount < 3 ? 'partial' : 'failed',
      actionResults,
      metrics,
      timestamp: Date.now(),
    };

    // 保存执行结果到数据库
    await ctx.db.create('executionResults', {
      executionId,
      planId: plan.planId,
      status: result.status,
      actionResults,
      metrics,
      createdAt: new Date(),
    });

    return result;
  }

  /**
   * 评估执行结果
   */
  private async evaluateResults(
    ctx: ExecutionContext,
    oldState: BusinessState,
    results: ExecutionResult
  ): Promise<string> {
    // 获取新的业务状态
    const newState = await businessStateObserver.observeBusinessState(ctx);

    // 计算变化
    const revenueChange = newState.revenue.monthly - oldState.revenue.monthly;
    const profitChange = newState.profit.absolute - oldState.profit.absolute;
    const customerChange =
      newState.customers.totalCount - oldState.customers.totalCount;

    const evaluation =
      `收入变化: ${revenueChange > 0 ? '+' : ''}¥${revenueChange.toFixed(2)}, ` +
      `利润变化: ${profitChange > 0 ? '+' : ''}¥${profitChange.toFixed(2)}, ` +
      `新客户: ${customerChange}`;

    return evaluation;
  }

  /**
   * 从执行循环中学习
   */
  private async learnFromCycle(
    ctx: ExecutionContext,
    cycle: any
  ): Promise<void> {
    // 计算性能差值
    const oldState = cycle.state;

    // 评估结果
    const successRate = cycle.results.metrics.successRate;

    // 如果成功率高，增加权重
    // 如果失败，降低权重

    // 存储学习记录
    await ctx.db.create('learningRecords', {
      cycleId: cycle.planId,
      actionCount: cycle.plan.actions.length,
      successRate,
      goal: cycle.plan.goal,
      performanceDelta: {
        revenueChange: 0, // TODO: 从状态计算
        profitChange: 0,
        customerChange: 0,
      },
      learnedAt: new Date(),
    });
  }

  /**
   * 开始自主运行循环
   */
  public async startAutonomousLoop(
    ctx: ExecutionContext,
    goal: any,
    intervalMinutes: number = 1
  ): Promise<void> {
    if (this.isRunning) {
      ctx.log('Autonomous loop already running');
      return;
    }

    this.isRunning = true;
    this.currentGoal = goal;

    console.log(
      `🤖 [Autonomous Loop] 启动自主循环，间隔: ${intervalMinutes}分钟`
    );

    const intervalMs = intervalMinutes * 60 * 1000;

    const loop = setInterval(async () => {
      try {
        await this.runFullCycle(ctx, this.currentGoal);
      } catch (error) {
        ctx.error('Autonomous loop cycle failed', error);
      }
    }, intervalMs);

    // 立即运行一次
    await this.runFullCycle(ctx, goal);
  }

  /**
   * 停止自主循环
   */
  public stopAutonomousLoop(): void {
    this.isRunning = false;
    console.log('🛑 [Autonomous Loop] 停止自主循环');
  }

  /**
   * 获取循环历史
   */
  public getCycleHistory(limit: number = 10): ExecutionCycle[] {
    return Array.from(this.cycles.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * 获取系统状态
   */
  public getStatus() {
    return {
      isRunning: this.isRunning,
      currentGoal: this.currentGoal,
      cyclesCompleted: this.cycles.size,
      recentCycles: this.getCycleHistory(3),
    };
  }
}

export const executionEngine = ExecutionEngine.getInstance();
