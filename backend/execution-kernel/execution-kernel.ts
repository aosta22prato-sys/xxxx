/**
 * Execution Kernel - Core Executor
 * Orchestrates transaction, action execution, recovery, and state management
 */

import { Transaction, ActionRecord, Event, StateSnapshot, AuditLogEntry, ExecutionResult } from './types';
import { EventBus, eventBus as globalEventBus } from './event-bus';
import { TransactionManager } from './transaction-manager';
import { RecoveryEngine, ErrorType } from './recovery-engine';
import crypto from 'crypto';

export interface ExecutionContext {
  tenantId?: string;
  storeId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface ExecutionOptions {
  parallel?: boolean;
  timeout?: number;
  captureState?: boolean;
  auditLog?: boolean;
}

export class ExecutionKernel {
  private txManager: TransactionManager;
  private recoveryEngine: RecoveryEngine;
  private eventBus: EventBus;
  private toolRegistry: Map<string, (params: any) => Promise<any>> = new Map();
  private stateSnapshots: Map<string, StateSnapshot> = new Map();
  private auditLogs: AuditLogEntry[] = [];
  private maxAuditLogs: number = 100000;

  constructor(eventBus?: EventBus) {
    this.eventBus = eventBus || globalEventBus;
    this.txManager = new TransactionManager(this.eventBus);
    this.recoveryEngine = new RecoveryEngine(this.eventBus);
    console.log('[ExecutionKernel] Initialized');
  }

  /**
   * Register tool for execution
   */
  registerTool(name: string, executor: (params: any) => Promise<any>): void {
    this.toolRegistry.set(name, executor);
    console.log(`[Kernel] Tool registered: ${name}`);
  }

  /**
   * Execute action plan
   */
  async execute(
    actions: ActionRecord[],
    context: ExecutionContext,
    options: ExecutionOptions = {}
  ): Promise<ExecutionResult[]> {
    const startTime = Date.now();
    const { parallel = false, timeout = 60000, captureState = true, auditLog = true } = options;

    console.log(
      `[Kernel] Executing ${actions.length} actions for tenant: ${context.tenantId}, store: ${context.storeId}`
    );

    // Begin transaction
    const tx = this.txManager.begin(context.tenantId, context.storeId, {
      userId: context.userId,
      ...context.metadata
    });

    const results: ExecutionResult[] = [];

    try {
      // Add actions to transaction
      for (const action of actions) {
        action.status = 'pending';
        this.txManager.addAction(tx.id, action);
      }

      // Execute actions
      if (parallel) {
        await this.executeParallel(tx, actions, results, context);
      } else {
        await this.executeSequential(tx, actions, results, context);
      }

      // Check if all succeeded
      const allSucceeded = results.every((r) => r.success);

      if (allSucceeded) {
        // Commit transaction
        this.txManager.commit(tx.id);
        this.eventBus.emit({
          type: 'EXECUTION_SUCCESS',
          payload: {
            txId: tx.id,
            actionCount: actions.length,
            duration: Date.now() - startTime
          },
          timestamp: Date.now(),
          txId: tx.id
        });
      } else {
        // Some actions failed - rollback
        await this.handleFailures(tx, actions, results, context);
      }

      // Capture state snapshot
      if (captureState) {
        await this.captureStateSnapshot(tx.id, context, results);
      }

      // Log audit
      if (auditLog) {
        this.logAudit({
          timestamp: Date.now(),
          txId: tx.id,
          tenantId: context.tenantId,
          storeId: context.storeId,
          userId: context.userId,
          actionCount: actions.length,
          successCount: results.filter((r) => r.success).length,
          failureCount: results.filter((r) => !r.success).length,
          duration: Date.now() - startTime,
          status: this.txManager.get(tx.id)!.status,
          metadata: context.metadata
        });
      }

      return results;
    } catch (err) {
      console.error('[Kernel] Execution error:', err);
      this.txManager.rollback(tx.id, `EXECUTION_ERROR: ${err}`);
      throw err;
    }
  }

  /**
   * Execute actions sequentially
   */
  private async executeSequential(
    tx: Transaction,
    actions: ActionRecord[],
    results: ExecutionResult[],
    context: ExecutionContext
  ): Promise<void> {
    for (const action of actions) {
      const result = await this.executeAction(tx, action, context);
      results.push(result);

      if (!result.success) {
        console.log(`[Kernel] Action failed: ${action.id}, stopping sequential execution`);
        break;
      }
    }
  }

  /**
   * Execute actions in parallel
   */
  private async executeParallel(
    tx: Transaction,
    actions: ActionRecord[],
    results: ExecutionResult[],
    context: ExecutionContext
  ): Promise<void> {
    const promises = actions.map((action) => this.executeAction(tx, action, context));
    const parallelResults = await Promise.allSettled(promises);

    for (const result of parallelResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          actionId: 'unknown',
          success: false,
          error: result.reason,
          executionTime: 0,
          retryCount: 0
        });
      }
    }
  }

  /**
   * Execute single action
   */
  private async executeAction(
    tx: Transaction,
    action: ActionRecord,
    context: ExecutionContext
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const actionId = action.id;
    let retryCount = 0;

    try {
      // Get tool
      const executor = this.toolRegistry.get(action.tool);
      if (!executor) {
        throw new Error(`Tool not found: ${action.tool}`);
      }

      // Update action status
      this.txManager.updateActionStatus(tx.id, actionId, 'executing');

      // Execute tool
      let result: any;
      try {
        result = await executor(action.params);
        action.result = result;
        retryCount = 0;
      } catch (err) {
        // Error during execution - try recovery
        action.retryCount = (action.retryCount || 0) + 1;
        const plan = this.recoveryEngine.recover(action, err as Error);

        // Handle recovery strategy
        if (plan.retry?.enabled) {
          retryCount = plan.retry.currentAttempt;
          result = await this.recoveryEngine.executeRetry(action, plan, (a) => executor(a.params));
          action.result = result;
        } else if (plan.compensate?.enabled) {
          this.txManager.beginCompensation(tx.id);
          throw new Error(`Partial failure for action ${actionId}: ${err}`);
        } else {
          throw err;
        }
      }

      // Update action status to success
      this.txManager.updateActionStatus(tx.id, actionId, 'success', result);

      // Emit success event
      this.eventBus.emit({
        type: 'ACTION_SUCCESS',
        payload: {
          actionId,
          tool: action.tool,
          result,
          duration: Date.now() - startTime
        },
        timestamp: Date.now(),
        txId: tx.id
      });

      return {
        actionId,
        success: true,
        data: result,
        executionTime: Date.now() - startTime,
        retryCount
      };
    } catch (err) {
      const error = err as Error;

      // Update action status to failed
      this.txManager.updateActionStatus(tx.id, actionId, 'failed', { error: error.message });

      // Emit failure event
      this.eventBus.emit({
        type: 'ACTION_FAILED',
        payload: {
          actionId,
          tool: action.tool,
          error: error.message,
          duration: Date.now() - startTime
        },
        timestamp: Date.now(),
        txId: tx.id
      });

      return {
        actionId,
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
        retryCount
      };
    }
  }

  /**
   * Handle transaction failures
   */
  private async handleFailures(
    tx: Transaction,
    actions: ActionRecord[],
    results: ExecutionResult[],
    context: ExecutionContext
  ): Promise<void> {
    console.log(`[Kernel] Handling ${results.filter((r) => !r.success).length} failures`);

    // Determine if we should rollback or continue
    const hasPartialSuccess = results.some((r) => r.success) && results.some((r) => !r.success);

    if (hasPartialSuccess) {
      // Need compensation
      this.txManager.beginCompensation(tx.id);

      // Execute compensations in reverse order
      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i].success) {
          const action = actions[i];
          const compensationTool = `${action.tool}_rollback`;

          if (this.toolRegistry.has(compensationTool)) {
            try {
              const executor = this.toolRegistry.get(compensationTool)!;
              await executor({
                originalActionId: action.id,
                originalParams: action.params,
                result: results[i].data
              });

              this.eventBus.emit({
                type: 'COMPENSATION_SUCCESS',
                payload: { actionId: action.id },
                timestamp: Date.now(),
                txId: tx.id
              });
            } catch (err) {
              console.error(`[Kernel] Compensation failed for ${action.id}:`, err);
              this.eventBus.emit({
                type: 'COMPENSATION_FAILED',
                payload: { actionId: action.id, error: err },
                timestamp: Date.now(),
                txId: tx.id
              });
            }
          }
        }
      }

      this.txManager.rollback(tx.id, 'PARTIAL_FAILURE_WITH_COMPENSATION');
    } else {
      // All failed - simple rollback
      this.txManager.rollback(tx.id, 'COMPLETE_FAILURE');
    }

    this.eventBus.emit({
      type: 'EXECUTION_FAILED',
      payload: {
        txId: tx.id,
        failureCount: results.filter((r) => !r.success).length,
        compensated: hasPartialSuccess
      },
      timestamp: Date.now(),
      txId: tx.id
    });
  }

  /**
   * Capture state snapshot
   */
  private async captureStateSnapshot(
    txId: string,
    context: ExecutionContext,
    results: ExecutionResult[]
  ): Promise<void> {
    const tx = this.txManager.get(txId)!;

    const snapshot: StateSnapshot = {
      txId,
      tenantId: context.tenantId,
      storeId: context.storeId,
      timestamp: Date.now(),
      state: {
        txStatus: tx.status,
        actionCount: results.length,
        successCount: results.filter((r) => r.success).length,
        failureCount: results.filter((r) => !r.success).length
      },
      results,
      checksum: this.generateChecksum(results)
    };

    this.stateSnapshots.set(txId, snapshot);

    this.eventBus.emit({
      type: 'STATE_SNAPSHOT_CAPTURED',
      payload: { txId, checksum: snapshot.checksum },
      timestamp: Date.now(),
      txId
    });
  }

  /**
   * Generate state checksum
   */
  private generateChecksum(results: ExecutionResult[]): string {
    const data = JSON.stringify(results);
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Log audit entry
   */
  private logAudit(entry: AuditLogEntry): void {
    this.auditLogs.push(entry);

    // Maintain size limit
    if (this.auditLogs.length > this.maxAuditLogs) {
      this.auditLogs.shift();
    }

    this.eventBus.emit({
      type: 'AUDIT_LOG_CREATED',
      payload: { txId: entry.txId, status: entry.status },
      timestamp: Date.now()
    });

    console.log(`[Audit] TX: ${entry.txId}, Status: ${entry.status}, Duration: ${entry.duration}ms`);
  }

  /**
   * Get transaction
   */
  getTransaction(txId: string): Transaction | undefined {
    return this.txManager.get(txId);
  }

  /**
   * Get state snapshot
   */
  getStateSnapshot(txId: string): StateSnapshot | undefined {
    return this.stateSnapshots.get(txId);
  }

  /**
   * Get audit logs
   */
  getAuditLogs(limit: number = 100): AuditLogEntry[] {
    return this.auditLogs.slice(-limit);
  }

  /**
   * Get kernel stats
   */
  getStats() {
    const allTx = this.txManager.getAll();
    return {
      totalTransactions: allTx.length,
      activeTransactions: this.txManager.getActive().length,
      committedTransactions: allTx.filter((t) => t.status === 'committed').length,
      rolledBackTransactions: allTx.filter((t) => t.status === 'rolled_back').length,
      registeredTools: this.toolRegistry.size,
      stateSnapshots: this.stateSnapshots.size,
      auditLogs: this.auditLogs.length
    };
  }

  /**
   * Cleanup old data
   */
  cleanup(olderThanMs: number = 3600000): void {
    const now = Date.now();

    // Clean snapshots
    for (const [txId, snapshot] of this.stateSnapshots) {
      if (now - snapshot.timestamp > olderThanMs) {
        this.stateSnapshots.delete(txId);
      }
    }

    // Clean transactions
    this.txManager.cleanup(olderThanMs);

    console.log('[Kernel] Cleanup completed');
  }
}

// Export singleton
export const executionKernel = new ExecutionKernel();
