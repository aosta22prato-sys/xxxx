/**
 * Recovery Engine - Error Recovery & Resilience
 * Handles different error scenarios: NETWORK, PARTIAL, BUSINESS_CONFLICT
 */

import { ActionRecord, RecoveryPlan, RecoveryStrategy } from './types';
import { EventBus } from './event-bus';

export enum ErrorType {
  NETWORK = 'NETWORK',
  PARTIAL = 'PARTIAL',
  BUSINESS_CONFLICT = 'BUSINESS_CONFLICT',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

export interface RecoveryContext {
  actionId: string;
  error: Error | string;
  errorType: ErrorType;
  attempt: number;
  lastResult?: any;
}

export class RecoveryEngine {
  private eventBus: EventBus;
  private maxRetries: number = 3;
  private retryDelays: number[] = [1000, 3000, 5000]; // exponential backoff

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    console.log('[RecoveryEngine] Initialized');
  }

  /**
   * Analyze error and create recovery plan
   */
  recover(action: ActionRecord, error: Error | string): RecoveryPlan {
    const errorType = this.classifyError(error);
    const context: RecoveryContext = {
      actionId: action.id,
      error,
      errorType,
      attempt: (action.retryCount || 0) + 1
    };

    console.log(`[Recovery] Analyzing error for action ${action.id}: ${errorType}`);

    let plan: RecoveryPlan;

    switch (errorType) {
      case ErrorType.NETWORK:
        plan = this.planNetworkRecovery(context);
        break;

      case ErrorType.PARTIAL:
        plan = this.planPartialRecovery(context, action);
        break;

      case ErrorType.BUSINESS_CONFLICT:
        plan = this.planBusinessRecovery(context);
        break;

      case ErrorType.VALIDATION:
        plan = this.planValidationRecovery(context);
        break;

      default:
        plan = this.planDefaultRecovery(context);
    }

    this.eventBus.emit({
      type: 'RECOVERY_PLAN_CREATED',
      payload: {
        actionId: action.id,
        errorType,
        strategy: plan.strategy,
        retryConfig: plan.retry
      },
      timestamp: Date.now()
    });

    return plan;
  }

  /**
   * Classify error type
   */
  private classifyError(error: Error | string): ErrorType {
    const msg = typeof error === 'string' ? error : error.message;

    // Network errors
    if (
      msg.includes('ECONNREFUSED') ||
      msg.includes('TIMEOUT') ||
      msg.includes('ENOTFOUND') ||
      msg.includes('network')
    ) {
      return ErrorType.NETWORK;
    }

    // Partial execution
    if (msg.includes('partial') || msg.includes('incomplete')) {
      return ErrorType.PARTIAL;
    }

    // Business conflicts
    if (
      msg.includes('conflict') ||
      msg.includes('insufficient') ||
      msg.includes('duplicate') ||
      msg.includes('not found')
    ) {
      return ErrorType.BUSINESS_CONFLICT;
    }

    // Validation errors
    if (msg.includes('validation') || msg.includes('invalid')) {
      return ErrorType.VALIDATION;
    }

    return ErrorType.UNKNOWN;
  }

  /**
   * Plan for network errors - RETRY strategy
   */
  private planNetworkRecovery(context: RecoveryContext): RecoveryPlan {
    const canRetry = context.attempt <= this.maxRetries;

    return {
      strategy: canRetry ? 'retry' : 'escalate',
      retry: canRetry
        ? {
            enabled: true,
            maxAttempts: this.maxRetries,
            currentAttempt: context.attempt,
            delayMs: this.retryDelays[Math.min(context.attempt - 1, this.retryDelays.length - 1)],
            backoffMultiplier: 1.5
          }
        : undefined,
      compensate: canRetry
        ? undefined
        : {
            enabled: true,
            reason: 'Network failure after max retries'
          },
      replan: undefined,
      escalate: !canRetry
        ? {
            enabled: true,
            reason: 'Network error persists after retries',
            severity: 'HIGH'
          }
        : undefined,
      notes: `Network error detected. Retry attempt ${context.attempt}/${this.maxRetries}`
    };
  }

  /**
   * Plan for partial failures - COMPENSATE strategy
   */
  private planPartialRecovery(context: RecoveryContext, action: ActionRecord): RecoveryPlan {
    return {
      strategy: 'compensate',
      retry: {
        enabled: false
      },
      compensate: {
        enabled: true,
        reason: 'Partial execution detected - rolling back',
        actions: [
          {
            id: `comp_${action.id}`,
            tool: `${action.tool}_rollback`,
            params: {
              originalActionId: action.id,
              originalParams: action.params,
              previousResult: action.result
            }
          }
        ]
      },
      replan: undefined,
      escalate: {
        enabled: true,
        reason: 'Partial failure requires escalation for review',
        severity: 'MEDIUM'
      },
      notes: 'Partial execution detected. Initiating compensation.'
    };
  }

  /**
   * Plan for business conflicts - REPLAN strategy
   */
  private planBusinessRecovery(context: RecoveryContext): RecoveryPlan {
    return {
      strategy: 'replan',
      retry: undefined,
      compensate: undefined,
      replan: {
        enabled: true,
        reason: 'Business conflict detected',
        suggestion: 'Review business logic and adjust action parameters',
        requiresHumanReview: true
      },
      escalate: {
        enabled: true,
        reason: 'Business conflict - manual intervention required',
        severity: 'MEDIUM'
      },
      notes: 'Business logic conflict. Requires replanning or human review.'
    };
  }

  /**
   * Plan for validation errors - ESCALATE or FIX strategy
   */
  private planValidationRecovery(context: RecoveryContext): RecoveryPlan {
    return {
      strategy: 'escalate',
      retry: undefined,
      compensate: undefined,
      replan: {
        enabled: true,
        reason: 'Validation error',
        suggestion: 'Fix action parameters and retry',
        requiresHumanReview: true
      },
      escalate: {
        enabled: true,
        reason: 'Validation error - invalid parameters',
        severity: 'LOW'
      },
      notes: 'Validation error detected. Parameters need correction.'
    };
  }

  /**
   * Plan for unknown errors - ESCALATE strategy
   */
  private planDefaultRecovery(context: RecoveryContext): RecoveryPlan {
    return {
      strategy: 'escalate',
      retry: {
        enabled: context.attempt < 2,
        maxAttempts: 2,
        currentAttempt: context.attempt,
        delayMs: 2000
      },
      compensate: undefined,
      replan: undefined,
      escalate: {
        enabled: true,
        reason: 'Unknown error - escalate for investigation',
        severity: 'HIGH'
      },
      notes: 'Unknown error type. Attempting retry or escalation.'
    };
  }

  /**
   * Execute recovery plan - retry
   */
  async executeRetry(
    action: ActionRecord,
    plan: RecoveryPlan,
    executor: (action: ActionRecord) => Promise<any>
  ): Promise<any> {
    if (!plan.retry?.enabled) {
      throw new Error('Retry not enabled in plan');
    }

    const delay = plan.retry.delayMs || 1000;
    console.log(`[Recovery] Retrying action ${action.id} after ${delay}ms (attempt ${plan.retry.currentAttempt})`);

    await new Promise((resolve) => setTimeout(resolve, delay));
    return executor(action);
  }

  /**
   * Execute recovery plan - compensate
   */
  async executeCompensation(
    actionId: string,
    compensationActions: any[]
  ): Promise<void> {
    console.log(`[Recovery] Executing compensation for action ${actionId}`);

    for (const compAction of compensationActions) {
      console.log(`[Recovery] Compensation action: ${compAction.tool}`);
      // Compensation will be executed by ExecutionKernel
    }

    this.eventBus.emit({
      type: 'COMPENSATION_EXECUTED',
      payload: { actionId, compensationCount: compensationActions.length },
      timestamp: Date.now()
    });
  }

  /**
   * Set max retries
   */
  setMaxRetries(maxRetries: number): void {
    this.maxRetries = maxRetries;
  }

  /**
   * Set retry delays
   */
  setRetryDelays(delays: number[]): void {
    this.retryDelays = delays;
  }
}
