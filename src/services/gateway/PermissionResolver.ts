import { dbEngine } from '../../db/dbEngine';

class PermissionResolverClass {
  private static instance: PermissionResolverClass;

  private constructor() {}

  public static getInstance(): PermissionResolverClass {
    if (!PermissionResolverClass.instance) {
      PermissionResolverClass.instance = new PermissionResolverClass();
    }
    return PermissionResolverClass.instance;
  }

  /**
   * Asserts whether an agent has permission to execute a specific task action
   */
  public resolvePermissions(
    agentRole: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent',
    actionType: string,
    taskRequestId?: string
  ): boolean {
    const permissions = dbEngine.execution_permissions.getAll();
    const match = permissions.find(p => p.agent_role === agentRole && p.action_key === actionType);

    const hasPermission = match ? match.governance_check_status !== 'RESTRICTED' : true; // Default to allow if no specific rule

    if (!hasPermission && taskRequestId) {
      dbEngine.task_denials.create({
        task_request_id: taskRequestId,
        denied_by: 'PermissionResolver',
        violated_rule_code: 'PERMISSION_RESTRICTED',
        denial_reason: `Agent [${agentRole}] has been explicitly forbidden from practicing [${actionType}] in security setup.`,
        denied_at: new Date().toISOString()
      });

      dbEngine.task_requests.update(taskRequestId, { status: 'DENIED' });
    }

    return hasPermission;
  }

  /**
   * Evaluates if budget thresholds and daily transaction counts allow this action
   */
  public validateExecutionLimits(
    agentRole: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent',
    estimatedCost: number,
    taskRequestId?: string
  ): boolean {
    const limits = dbEngine.execution_limits.getAll();
    const rule = limits.find(l => l.agent_role === agentRole);

    if (!rule) return true; // No limits set

    const canAfford = rule.current_used_budget_eur + estimatedCost <= rule.max_hourly_budget_eur;

    if (!canAfford) {
      if (taskRequestId) {
        dbEngine.task_denials.create({
          task_request_id: taskRequestId,
          denied_by: 'LimitEnforcer',
          violated_rule_code: 'BUDGET_EXCEEDED',
          denial_reason: `Budget limit exceeded for ${agentRole}. Requested: €${estimatedCost}, Available: €${rule.max_hourly_budget_eur - rule.current_used_budget_eur}`,
          denied_at: new Date().toISOString()
        });

        dbEngine.task_requests.update(taskRequestId, { status: 'DENIED' });
      }
      return false;
    }

    return true;
  }

  /**
   * Deduct budget upon successful operation execution
   */
  public deductBudget(
    agentRole: 'MarketingAgent' | 'InventoryAgent' | 'PricingAgent' | 'CustomerAgent' | 'FinanceAgent',
    cost: number
  ): void {
    const limits = dbEngine.execution_limits.getAll();
    const rule = limits.find(l => l.agent_role === agentRole);
    if (rule) {
      dbEngine.execution_limits.update(rule.id, {
        current_used_budget_eur: rule.current_used_budget_eur + cost,
        updated_at: new Date().toISOString()
      });
    }
  }
}

export const PermissionResolver = PermissionResolverClass.getInstance();
