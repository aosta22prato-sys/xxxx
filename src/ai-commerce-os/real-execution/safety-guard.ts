/**
 * Safety Guard - AI执行安全控制系统
 * 
 * 防止AI做出危险的决定
 * 每个动作执行前都要通过安全检查
 */

import { ExecutionAction, ExecutionContext } from './core-interfaces';

export interface SafetyValidation {
  allowed: boolean;
  reason?: string;
  riskLevel: 'safe' | 'warning' | 'blocked';
  suggestedAlternative?: string;
}

export interface SafetyRule {
  name: string;
  condition: (action: ExecutionAction, ctx: any) => Promise<boolean>;
  impact: 'block' | 'warn';
  message: string;
}

export class SafetyGuard {
  private static instance: SafetyGuard;
  private rules: SafetyRule[] = [];
  private executionLog: Array<{
    actionId: string;
    result: SafetyValidation;
    timestamp: number;
  }> = [];

  private constructor() {
    console.log('🛡️  [Safety Guard] 初始化AI安全守卫系统...');
    this.initializeRules();
  }

  public static getInstance(): SafetyGuard {
    if (!SafetyGuard.instance) {
      SafetyGuard.instance = new SafetyGuard();
    }
    return SafetyGuard.instance;
  }

  /**
   * 初始化安全规则
   */
  private initializeRules() {
    // 订单相关规则
    this.addRule({
      name: 'MAX_REFUND_AMOUNT',
      condition: async (action) => {
        if (action.tool === 'refundOrder') {
          return action.params.amount <= 50000; // 单笔退款上限5万
        }
        return true;
      },
      impact: 'block',
      message: 'Refund amount exceeds maximum limit',
    });

    this.addRule({
      name: 'BULK_CANCEL_LIMIT',
      condition: async (action) => {
        if (action.tool === 'cancelOrder') {
          return true; // 允许单笔取消
        }
        return true;
      },
      impact: 'block',
      message: 'Bulk cancellation requires manual approval',
    });

    // 价格相关规则
    this.addRule({
      name: 'PRICE_CHANGE_LIMIT',
      condition: async (action) => {
        if (action.tool === 'updatePrice') {
          const oldPrice = action.params.oldPrice || 100;
          const newPrice = action.params.newPrice;
          const changeRatio = Math.abs((newPrice - oldPrice) / oldPrice);
          return changeRatio <= 0.5; // 价格变化不超过50%
        }
        return true;
      },
      impact: 'warn',
      message: 'Price change exceeds 50%',
    });

    // 库存相关规则
    this.addRule({
      name: 'INVENTORY_THRESHOLD',
      condition: async (action) => {
        if (action.tool === 'adjustInventory') {
          return action.params.quantity >= -100; // 单次调整不超过100个
        }
        return true;
      },
      impact: 'warn',
      message: 'Large inventory adjustment',
    });

    // 广告预算相关规则
    this.addRule({
      name: 'AD_BUDGET_DAILY_LIMIT',
      condition: async (action) => {
        if (action.tool === 'createAdCampaign') {
          return action.params.budget <= 10000; // 单日预算不超过1万
        }
        return true;
      },
      impact: 'warn',
      message: 'Daily ad budget is high',
    });

    this.addRule({
      name: 'AD_BUDGET_RATIO_LIMIT',
      condition: async (action) => {
        if (action.tool === 'optimizeAdSpend') {
          const maxIncrease = 1.5; // 最多增加50%
          return action.params.increaseRatio <= maxIncrease;
        }
        return true;
      },
      impact: 'warn',
      message: 'Ad spend increase exceeds 50%',
    });

    // 批量操作规则
    this.addRule({
      name: 'BATCH_OPERATION_SIZE',
      condition: async (action) => {
        if (action.params.batchSize) {
          return action.params.batchSize <= 1000; // 批量操作不超过1000条
        }
        return true;
      },
      impact: 'block',
      message: 'Batch operation size too large',
    });

    // 时间限制规则
    this.addRule({
      name: 'CRITICAL_TIME_CHECK',
      condition: async (action) => {
        // 高风险操作在工作时间外不允许
        if (
          ['refundOrder', 'cancelOrder', 'updatePrice'].includes(action.tool)
        ) {
          const hour = new Date().getHours();
          return hour >= 9 && hour <= 18; // 仅在工作时间9-18点允许
        }
        return true;
      },
      impact: 'block',
      message: 'Critical operation outside business hours',
    });

    // 状态检查规则
    this.addRule({
      name: 'STATE_CONSISTENCY_CHECK',
      condition: async (action, state) => {
        // 库存不足时禁止继续增加广告
        if (action.tool === 'createAdCampaign') {
          if (state && state.inventory && state.inventory.totalUnits < 10) {
            return false; // 库存少于10个时禁止投放广告
          }
        }
        return true;
      },
      impact: 'block',
      message: 'Insufficient inventory for advertising',
    });

    console.log(`✅ [Safety Guard] 已加载 ${this.rules.length} 条安全规则`);
  }

  /**
   * 添加自定义规则
   */
  public addRule(rule: SafetyRule) {
    this.rules.push(rule);
  }

  /**
   * 验证动作是否安全
   */
  public async validate(
    action: ExecutionAction,
    currentState?: any
  ): Promise<SafetyValidation> {
    console.log(`🔍 [Safety Check] 验证动作: ${action.tool}`);

    const failedRules: SafetyRule[] = [];

    // 检查所有规则
    for (const rule of this.rules) {
      try {
        const passed = await rule.condition(action, currentState);

        if (!passed) {
          console.log(`  ⚠️  规则失败: ${rule.name} - ${rule.message}`);
          failedRules.push(rule);

          // 如果是 block 规则，立即返回
          if (rule.impact === 'block') {
            const validation: SafetyValidation = {
              allowed: false,
              reason: rule.message,
              riskLevel: 'blocked',
            };

            this.logValidation(action.id, validation);
            return validation;
          }
        }
      } catch (error) {
        console.error(
          `❌ [Safety Check] 规则执行异常: ${rule.name}`,
          error
        );
        // 规则异常时，默认拒绝
        const validation: SafetyValidation = {
          allowed: false,
          reason: `Safety rule error: ${rule.name}`,
          riskLevel: 'blocked',
        };

        this.logValidation(action.id, validation);
        return validation;
      }
    }

    // 所有规则都通过
    const validation: SafetyValidation = {
      allowed: true,
      riskLevel: failedRules.length === 0 ? 'safe' : 'warning',
    };

    if (failedRules.length > 0) {
      validation.reason = `${failedRules.length} warning rule(s)`;
    }

    console.log(`✅ [Safety Check] 动作通过安全检查 (${validation.riskLevel})`);
    this.logValidation(action.id, validation);
    return validation;
  }

  /**
   * 验证批量动作
   */
  public async validateBatch(
    actions: ExecutionAction[],
    currentState?: any
  ): Promise<Map<string, SafetyValidation>> {
    const results = new Map<string, SafetyValidation>();

    for (const action of actions) {
      const validation = await this.validate(action, currentState);
      results.set(action.id, validation);
    }

    return results;
  }

  /**
   * 记录验证结果
   */
  private logValidation(actionId: string, result: SafetyValidation) {
    this.executionLog.push({
      actionId,
      result,
      timestamp: Date.now(),
    });

    // 保持日志大小
    if (this.executionLog.length > 1000) {
      this.executionLog = this.executionLog.slice(-500);
    }
  }

  /**
   * 获取安全日志
   */
  public getLog(limit: number = 100) {
    return this.executionLog.slice(-limit);
  }

  /**
   * 获取统计信息
   */
  public getStats() {
    const total = this.executionLog.length;
    const blocked = this.executionLog.filter(
      (log) => log.result.riskLevel === 'blocked'
    ).length;
    const warnings = this.executionLog.filter(
      (log) => log.result.riskLevel === 'warning'
    ).length;
    const safe = this.executionLog.filter(
      (log) => log.result.riskLevel === 'safe'
    ).length;

    return {
      total,
      blocked,
      warnings,
      safe,
      blockedRate: total > 0 ? (blocked / total) * 100 : 0,
      safetyScore: total > 0 ? ((safe / total) * 100).toFixed(2) : 100,
    };
  }

  /**
   * 重置日志
   */
  public clearLog() {
    this.executionLog = [];
  }
}

export const safetyGuard = SafetyGuard.getInstance();
