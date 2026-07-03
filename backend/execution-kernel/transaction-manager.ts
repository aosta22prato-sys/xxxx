/**
 * Transaction Manager - Core Transaction Handling
 * Manages transaction lifecycle: begin, commit, rollback
 */

import { Transaction, ActionRecord } from './types';
import { EventBus } from './event-bus';

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export class TransactionManager {
  private txMap: Map<string, Transaction> = new Map();
  private eventBus: EventBus;
  private txTimeout: number = 30000; // 30 seconds default

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    console.log('[TransactionManager] Initialized');
  }

  /**
   * Begin a new transaction
   */
  begin(tenantId?: string, storeId?: string, metadata?: Record<string, any>): Transaction {
    const tx: Transaction = {
      id: generateId('tx'),
      status: 'pending',
      actions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tenantId,
      storeId,
      metadata
    };

    this.txMap.set(tx.id, tx);

    // Setup auto-timeout
    this.setupTimeout(tx.id);

    this.eventBus.emit({
      type: 'TX_BEGIN',
      payload: { txId: tx.id, tenantId, storeId },
      timestamp: Date.now()
    });

    console.log(`[TX] Begin: ${tx.id}`);
    return tx;
  }

  /**
   * Add action to transaction
   */
  addAction(txId: string, action: ActionRecord): void {
    const tx = this.txMap.get(txId);
    if (!tx) {
      throw new Error(`Transaction not found: ${txId}`);
    }

    if (tx.status !== 'pending') {
      throw new Error(`Cannot add action to ${tx.status} transaction: ${txId}`);
    }

    tx.actions.push(action);
    tx.updatedAt = Date.now();

    this.eventBus.emit({
      type: 'ACTION_ADDED',
      payload: { txId, actionId: action.id },
      timestamp: Date.now(),
      txId
    });

    console.log(`[TX] Action added: ${action.id} to ${txId}`);
  }

  /**
   * Update action status
   */
  updateActionStatus(txId: string, actionId: string, status: string, result?: any): void {
    const tx = this.txMap.get(txId);
    if (!tx) return;

    const action = tx.actions.find((a) => a.id === actionId);
    if (!action) return;

    action.status = status as any;
    action.executedAt = Date.now();
    if (result) action.result = result;

    tx.updatedAt = Date.now();

    this.eventBus.emit({
      type: 'ACTION_STATUS_UPDATED',
      payload: { txId, actionId, status, result },
      timestamp: Date.now(),
      txId
    });
  }

  /**
   * Commit transaction
   */
  commit(txId: string): Transaction {
    const tx = this.txMap.get(txId);
    if (!tx) {
      throw new Error(`Transaction not found: ${txId}`);
    }

    tx.status = 'committed';
    tx.updatedAt = Date.now();

    this.eventBus.emit({
      type: 'TX_COMMITTED',
      payload: { txId, actionCount: tx.actions.length },
      timestamp: Date.now(),
      txId
    });

    console.log(`[TX] Committed: ${txId}`);
    return tx;
  }

  /**
   * Rollback transaction
   */
  rollback(txId: string, reason?: string): Transaction {
    const tx = this.txMap.get(txId);
    if (!tx) {
      throw new Error(`Transaction not found: ${txId}`);
    }

    tx.status = 'rolled_back';
    tx.updatedAt = Date.now();
    tx.metadata = { ...tx.metadata, rollbackReason: reason };

    this.eventBus.emit({
      type: 'TX_ROLLED_BACK',
      payload: { txId, reason, actionCount: tx.actions.length },
      timestamp: Date.now(),
      txId
    });

    console.log(`[TX] Rolled back: ${txId}, reason: ${reason}`);
    return tx;
  }

  /**
   * Begin compensation (for failed transactions)
   */
  beginCompensation(txId: string): Transaction {
    const tx = this.txMap.get(txId);
    if (!tx) {
      throw new Error(`Transaction not found: ${txId}`);
    }

    tx.status = 'compensating';
    tx.updatedAt = Date.now();

    this.eventBus.emit({
      type: 'TX_COMPENSATING',
      payload: { txId },
      timestamp: Date.now(),
      txId
    });

    console.log(`[TX] Started compensation: ${txId}`);
    return tx;
  }

  /**
   * Get transaction by ID
   */
  get(txId: string): Transaction | undefined {
    return this.txMap.get(txId);
  }

  /**
   * Get all transactions (for debugging)
   */
  getAll(): Transaction[] {
    return Array.from(this.txMap.values());
  }

  /**
   * Get active transactions
   */
  getActive(): Transaction[] {
    return Array.from(this.txMap.values()).filter(
      (tx) => tx.status === 'pending' || tx.status === 'compensating'
    );
  }

  /**
   * Get transaction count
   */
  getCount(): number {
    return this.txMap.size;
  }

  /**
   * Setup auto-timeout for transaction
   */
  private setupTimeout(txId: string): void {
    setTimeout(() => {
      const tx = this.txMap.get(txId);
      if (tx && tx.status === 'pending') {
        console.warn(`[TX] Transaction timeout: ${txId}`);
        this.rollback(txId, 'TIMEOUT');
      }
    }, this.txTimeout);
  }

  /**
   * Clean up completed transactions (archive)
   */
  cleanup(olderThanMs: number = 3600000): number {
    const now = Date.now();
    let removed = 0;

    for (const [txId, tx] of this.txMap) {
      if (
        (tx.status === 'committed' || tx.status === 'rolled_back') &&
        now - tx.updatedAt > olderThanMs
      ) {
        this.txMap.delete(txId);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`[TX] Cleanup: removed ${removed} old transactions`);
    }

    return removed;
  }

  /**
   * Set transaction timeout
   */
  setTransactionTimeout(ms: number): void {
    this.txTimeout = ms;
  }
}
