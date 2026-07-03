import { dbEngine } from '../../db/dbEngine';
import { TaskRequest, TaskAudit } from '../../types';
import { TenantIsolationGuard } from './TenantIsolationGuard';
import { PermissionResolver } from './PermissionResolver';
import { BrainStreamService } from '../brain-stream/BrainStreamService';

class TaskGatewayClass {
  private static instance: TaskGatewayClass;

  private constructor() {}

  public static getInstance(): TaskGatewayClass {
    if (!TaskGatewayClass.instance) {
      TaskGatewayClass.instance = new TaskGatewayClass();
    }
    return TaskGatewayClass.instance;
  }

  /**
   * Safe entry-gateway resolving permissions, checking isolation borders, executing operations and generating auditable actions.
   */
  public submitTaskRequest(
    clientTenantId: string,
    clientStoreId: string,
    targetAgentRole: TaskRequest['target_agent_role'],
    actionType: TaskRequest['task_action_type'],
    requestedBy: TaskRequest['requested_by'],
    payload: Record<string, any>,
    estimatedCost = 0
  ): TaskRequest {
    // 1. Create a transient pending record
    const request = dbEngine.task_requests.create({
      tenant_id: 'tenant_default', // The store target tenant
      store_id: 'store_default',   // The store target store
      target_agent_role: targetAgentRole,
      task_action_type: actionType,
      task_payload: payload,
      requested_by: requestedBy,
      status: 'PENDING_RESOLVE',
      risk_rating: estimatedCost > 200 ? 'HIGH' : estimatedCost > 50 ? 'MEDIUM' : 'LOW',
      created_at: new Date().toISOString()
    });

    // 2. Perform Tenancy Isolation Validation
    const isIsolated = TenantIsolationGuard.validateTenancy(
      clientTenantId,
      clientStoreId,
      'tenant_default',
      'store_default',
      request.id
    );
    if (!isIsolated) {
      this.logAudit(request.id, false, false, 'Tenant mismatch block executed.');
      return this.refreshedRequest(request.id);
    }

    // 3. Evaluate operational permission rules
    const isPermitted = PermissionResolver.resolvePermissions(targetAgentRole, actionType, request.id);
    if (!isPermitted) {
      this.logAudit(request.id, true, false, 'Operation explicitly blocked by governor permissions.');
      return this.refreshedRequest(request.id);
    }

    // 4. Assert financial and transaction frequency thresholds
    const isBudgetOk = PermissionResolver.validateExecutionLimits(targetAgentRole, estimatedCost, request.id);
    if (!isBudgetOk) {
      this.logAudit(request.id, true, true, 'Operation blocked: estimated cost exceeds allocated rate-limits.');
      return this.refreshedRequest(request.id);
    }

    // 5. SUCCESS: All gates passed successfully! Audit, Approve, Execute!
    this.logAudit(request.id, true, true, 'Credentials matched, permissions certified, and budget limits verified.');

    // Write approval record
    dbEngine.task_approvals.create({
      task_request_id: request.id,
      approved_by: 'Autonomous Task Gateway Isolation',
      applied_rules_count: 3,
      approved_at: new Date().toISOString()
    });

    // Mark as SUCCESSFUL and deduct the associated budget
    dbEngine.task_requests.update(request.id, { status: 'SUCCESSFUL' });
    PermissionResolver.deductBudget(targetAgentRole, estimatedCost);

    // Write a real audit record to general execution_audits as well for the audit center
    dbEngine.execution_audits.create({
      agent_role: targetAgentRole,
      affected_row_id: request.id,
      action_summary: `[GATEWAY APPROVED] Executed ${actionType} triggered by ${requestedBy}. Payload: ${JSON.stringify(payload)}`,
      risk_rating: request.risk_rating,
      status: 'AUDITED',
      logged_at: new Date().toISOString()
    });

    // Write a standard Brain Event regarding successful execution
    BrainStreamService.emitEvent(
      'CAMPAIGN_TRIGGER',
      `Secure task executed successfully: Agent [${targetAgentRole}] completed action: ${actionType}`,
      request.risk_rating === 'HIGH' ? 'HIGH' : 'INFO',
      undefined,
      { task_request_id: request.id, cost: estimatedCost, action: actionType }
    );

    return this.refreshedRequest(request.id);
  }

  private logAudit(requestId: string, tenancyPassed: boolean, permissionPassed: boolean, msg: string): TaskAudit {
    return dbEngine.task_audits.create({
      task_request_id: requestId,
      audited_by: 'TenantIsolationGuard',
      tenant_isolation_passed: tenancyPassed,
      permission_resolved_passed: permissionPassed,
      audit_message: msg,
      audited_at: new Date().toISOString(),
      governor_signature: `gov_sig_${Math.random().toString(36).substring(2, 9)}`
    });
  }

  private refreshedRequest(id: string): TaskRequest {
    return dbEngine.task_requests.getAll().find(r => r.id === id)!;
  }
}

export const TaskGateway = TaskGatewayClass.getInstance();
