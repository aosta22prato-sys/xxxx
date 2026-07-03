/**
 * Kernel Persistence - Database Support
 * PostgreSQL persistence for transactions, events, and audit logs
 */

import { Pool, QueryResult } from 'pg';
import {
  Transaction,
  ActionRecord,
  Event,
  StateSnapshot,
  AuditLogEntry,
  ExecutionResult
} from './types';

export interface PersistenceConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  enabled: boolean;
}

export class KernelPersistence {
  private pool: Pool | null = null;
  private config: PersistenceConfig;
  private enabled: boolean;

  constructor(config: PersistenceConfig) {
    this.config = config;
    this.enabled = config.enabled;
    if (this.enabled) {
      this.initializePool();
    }
    console.log(`[Persistence] ${this.enabled ? 'Enabled' : 'Disabled'}`);
  }

  /**
   * Initialize connection pool
   */
  private initializePool(): void {
    try {
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        database: this.config.database,
        user: this.config.user,
        password: this.config.password,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      });

      this.pool.on('error', (err) => {
        console.error('[Persistence] Pool error:', err);
      });

      console.log('[Persistence] Connection pool initialized');
    } catch (err) {
      console.error('[Persistence] Failed to initialize pool:', err);
      this.enabled = false;
    }
  }

  /**
   * Initialize database schema
   */
  async initializeSchema(): Promise<void> {
    if (!this.enabled || !this.pool) return;

    try {
      // Transactions table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS kernel_transactions (
          id VARCHAR(255) PRIMARY KEY,
          status VARCHAR(50) NOT NULL,
          tenant_id VARCHAR(255),
          store_id VARCHAR(255),
          user_id VARCHAR(255),
          action_count INT DEFAULT 0,
          success_count INT DEFAULT 0,
          failure_count INT DEFAULT 0,
          metadata JSONB,
          created_at BIGINT NOT NULL,
          updated_at BIGINT NOT NULL,
          INDEX idx_tenant_store (tenant_id, store_id),
          INDEX idx_created_at (created_at)
        );
      `);

      // Actions table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS kernel_actions (
          id VARCHAR(255) PRIMARY KEY,
          tx_id VARCHAR(255) NOT NULL,
          tool VARCHAR(255) NOT NULL,
          params JSONB,
          status VARCHAR(50) NOT NULL,
          result JSONB,
          error TEXT,
          retry_count INT DEFAULT 0,
          created_at BIGINT NOT NULL,
          executed_at BIGINT,
          completed_at BIGINT,
          INDEX idx_tx_id (tx_id),
          FOREIGN KEY (tx_id) REFERENCES kernel_transactions(id)
        );
      `);

      // Events table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS kernel_events (
          id SERIAL PRIMARY KEY,
          type VARCHAR(255) NOT NULL,
          tx_id VARCHAR(255),
          payload JSONB,
          priority VARCHAR(50),
          timestamp BIGINT NOT NULL,
          INDEX idx_tx_id (tx_id),
          INDEX idx_type (type),
          INDEX idx_timestamp (timestamp)
        );
      `);

      // Snapshots table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS kernel_snapshots (
          id SERIAL PRIMARY KEY,
          tx_id VARCHAR(255) NOT NULL,
          tenant_id VARCHAR(255),
          store_id VARCHAR(255),
          state JSONB,
          results JSONB,
          checksum VARCHAR(255),
          timestamp BIGINT NOT NULL,
          UNIQUE (tx_id),
          INDEX idx_tenant_store (tenant_id, store_id)
        );
      `);

      // Audit logs table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS kernel_audit_logs (
          id SERIAL PRIMARY KEY,
          tx_id VARCHAR(255),
          tenant_id VARCHAR(255),
          store_id VARCHAR(255),
          user_id VARCHAR(255),
          action_count INT,
          success_count INT,
          failure_count INT,
          duration INT,
          status VARCHAR(50),
          metadata JSONB,
          timestamp BIGINT NOT NULL,
          INDEX idx_tenant_store (tenant_id, store_id),
          INDEX idx_timestamp (timestamp)
        );
      `);

      console.log('[Persistence] Schema initialized');
    } catch (err) {
      console.error('[Persistence] Schema initialization failed:', err);
    }
  }

  /**
   * Save transaction
   */
  async saveTransaction(tx: Transaction): Promise<void> {
    if (!this.enabled || !this.pool) return;

    try {
      await this.pool.query(
        `INSERT INTO kernel_transactions 
         (id, status, tenant_id, store_id, metadata, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
         status = $2, updated_at = $7`,
        [
          tx.id,
          tx.status,
          tx.tenantId,
          tx.storeId,
          JSON.stringify(tx.metadata || {}),
          tx.createdAt,
          tx.updatedAt
        ]
      );
    } catch (err) {
      console.error('[Persistence] Failed to save transaction:', err);
    }
  }

  /**
   * Save action
   */
  async saveAction(txId: string, action: ActionRecord): Promise<void> {
    if (!this.enabled || !this.pool) return;

    try {
      await this.pool.query(
        `INSERT INTO kernel_actions 
         (id, tx_id, tool, params, status, result, error, retry_count, created_at, executed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET
         status = $5, result = $6, error = $7, executed_at = $10`,
        [
          action.id,
          txId,
          action.tool,
          JSON.stringify(action.params),
          action.status,
          action.result ? JSON.stringify(action.result) : null,
          action.error || null,
          action.retryCount || 0,
          action.createdAt,
          action.executedAt || null
        ]
      );
    } catch (err) {
      console.error('[Persistence] Failed to save action:', err);
    }
  }

  /**
   * Save event
   */
  async saveEvent(event: Event): Promise<void> {
    if (!this.enabled || !this.pool) return;

    try {
      await this.pool.query(
        `INSERT INTO kernel_events (type, tx_id, payload, priority, timestamp)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          event.type,
          event.txId || null,
          JSON.stringify(event.payload),
          event.priority || 'normal',
          event.timestamp || Date.now()
        ]
      );
    } catch (err) {
      console.error('[Persistence] Failed to save event:', err);
    }
  }

  /**
   * Save state snapshot
   */
  async saveSnapshot(snapshot: StateSnapshot): Promise<void> {
    if (!this.enabled || !this.pool) return;

    try {
      await this.pool.query(
        `INSERT INTO kernel_snapshots 
         (tx_id, tenant_id, store_id, state, results, checksum, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (tx_id) DO UPDATE SET
         state = $4, results = $5, checksum = $6`,
        [
          snapshot.txId,
          snapshot.tenantId,
          snapshot.storeId,
          JSON.stringify(snapshot.state),
          JSON.stringify(snapshot.results),
          snapshot.checksum,
          snapshot.timestamp
        ]
      );
    } catch (err) {
      console.error('[Persistence] Failed to save snapshot:', err);
    }
  }

  /**
   * Save audit log
   */
  async saveAuditLog(entry: AuditLogEntry): Promise<void> {
    if (!this.enabled || !this.pool) return;

    try {
      await this.pool.query(
        `INSERT INTO kernel_audit_logs 
         (tx_id, tenant_id, store_id, user_id, action_count, success_count, failure_count, duration, status, metadata, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          entry.txId,
          entry.tenantId,
          entry.storeId,
          entry.userId,
          entry.actionCount,
          entry.successCount,
          entry.failureCount,
          entry.duration,
          entry.status,
          JSON.stringify(entry.metadata || {}),
          entry.timestamp
        ]
      );
    } catch (err) {
      console.error('[Persistence] Failed to save audit log:', err);
    }
  }

  /**
   * Query transaction
   */
  async getTransaction(txId: string): Promise<Transaction | null> {
    if (!this.enabled || !this.pool) return null;

    try {
      const result = await this.pool.query(
        'SELECT * FROM kernel_transactions WHERE id = $1',
        [txId]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('[Persistence] Failed to get transaction:', err);
      return null;
    }
  }

  /**
   * Query transactions by tenant/store
   */
  async getTransactions(
    tenantId: string,
    storeId: string,
    limit: number = 100
  ): Promise<Transaction[]> {
    if (!this.enabled || !this.pool) return [];

    try {
      const result = await this.pool.query(
        `SELECT * FROM kernel_transactions 
         WHERE tenant_id = $1 AND store_id = $2
         ORDER BY created_at DESC
         LIMIT $3`,
        [tenantId, storeId, limit]
      );
      return result.rows;
    } catch (err) {
      console.error('[Persistence] Failed to get transactions:', err);
      return [];
    }
  }

  /**
   * Query snapshot
   */
  async getSnapshot(txId: string): Promise<StateSnapshot | null> {
    if (!this.enabled || !this.pool) return null;

    try {
      const result = await this.pool.query(
        'SELECT * FROM kernel_snapshots WHERE tx_id = $1',
        [txId]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('[Persistence] Failed to get snapshot:', err);
      return null;
    }
  }

  /**
   * Query audit logs
   */
  async getAuditLogs(
    tenantId: string,
    storeId: string,
    limit: number = 100
  ): Promise<AuditLogEntry[]> {
    if (!this.enabled || !this.pool) return [];

    try {
      const result = await this.pool.query(
        `SELECT * FROM kernel_audit_logs 
         WHERE tenant_id = $1 AND store_id = $2
         ORDER BY timestamp DESC
         LIMIT $3`,
        [tenantId, storeId, limit]
      );
      return result.rows;
    } catch (err) {
      console.error('[Persistence] Failed to get audit logs:', err);
      return [];
    }
  }

  /**
   * Clean old data
   */
  async cleanup(olderThanMs: number = 2592000000): Promise<number> {
    if (!this.enabled || !this.pool) return 0;

    try {
      const cutoffTime = Date.now() - olderThanMs;
      const result = await this.pool.query(
        'DELETE FROM kernel_transactions WHERE updated_at < $1',
        [cutoffTime]
      );
      return result.rowCount || 0;
    } catch (err) {
      console.error('[Persistence] Cleanup failed:', err);
      return 0;
    }
  }

  /**
   * Dispose pool
   */
  async dispose(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log('[Persistence] Connection pool closed');
    }
  }
}

/**
 * Create persistence from environment
 */
export function createPersistenceFromEnv(): KernelPersistence {
  return new KernelPersistence({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'kernel_db',
    user: process.env.DB_USER || 'kernel',
    password: process.env.DB_PASSWORD || 'kernel',
    enabled: process.env.PERSISTENCE_ENABLED !== 'false'
  });
}
