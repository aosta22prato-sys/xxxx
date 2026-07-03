import { dbEngine } from '../../db/dbEngine';
import { TaskRequest } from '../../types';

class TenantIsolationGuardClass {
  private static instance: TenantIsolationGuardClass;

  private constructor() {}

  public static getInstance(): TenantIsolationGuardClass {
    if (!TenantIsolationGuardClass.instance) {
      TenantIsolationGuardClass.instance = new TenantIsolationGuardClass();
    }
    return TenantIsolationGuardClass.instance;
  }

  /**
   * Asserts that a safety request complies strictly with tenant boundaries.
   * If failure occurs, logs an audit block immediately.
   */
  public validateTenancy(
    tokenTenantId: string,
    tokenStoreId: string,
    targetTenantId: string,
    targetStoreId: string,
    taskRequestId?: string
  ): boolean {
    const isMatched = tokenTenantId === targetTenantId && tokenStoreId === targetStoreId;

    if (!isMatched) {
      console.warn(`[SECURITY BREAK] Tenant boundary mismatch! Token: ${tokenTenantId}/${tokenStoreId}, Target: ${targetTenantId}/${targetStoreId}`);
      
      if (taskRequestId) {
        // Create an explicit Task Denial log mapping the security event
        dbEngine.task_denials.create({
          task_request_id: taskRequestId,
          denied_by: 'TenantIsolationGuard',
          violated_rule_code: 'TENANT_MISMATCH',
          denial_reason: `Cross-tenant execution attempt blocked. Tenant parameters do not match token configuration.`,
          denied_at: new Date().toISOString()
        });

        // Fail the main task request
        dbEngine.task_requests.update(taskRequestId, { status: 'DENIED' });
      }
    }

    return isMatched;
  }
}

export const TenantIsolationGuard = TenantIsolationGuardClass.getInstance();
