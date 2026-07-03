/**
 * AI Commerce OS Execution Kernel - Core Type Definitions
 * Production-Grade Transaction + Event Bus + Recovery System
 */

// ============================================================
// TRANSACTION TYPES
// ============================================================

export interface Transaction {
  id: string;
  status: "pending" | "committed" | "rolled_back" | "compensating";
  actions: ActionRecord[];
  createdAt: number;
  updatedAt: number;
  tenantId?: string;
  storeId?: string;
  metadata?: Record<string, any>;
}

export interface ActionRecord {
  id: string;
  tool: string;
  params: Record<string, any>;
  status: "pending" | "executing" | "success" | "failed" | "compensated";
  createdAt: number;
  executedAt?: number;
  result?: ExecutionResult;
  error?: any;
}

// ============================================================
// EVENT TYPES
// ============================================================

export interface Event {
  type: string;
  payload: any;
  timestamp: number;
  txId?: string;
  source?: string;
  priority?: "low" | "normal" | "high" | "critical";
}

export interface EventListener {
  (event: Event): void | Promise<void>;
}

// ============================================================
// EXECUTION RESULT TYPES
// ============================================================

export interface ExecutionResult {
  actionId: string;
  success: boolean;
  data?: any;
  error?: any;
  executionTime?: number;
  retryCount?: number;
}

export interface ExecutionPlan {
  id: string;
  actions: ActionRecord[];
  priority: "low" | "normal" | "high";
  dependencies?: Record<string, string[]>; // actionId -> [depActionIds]
  timeout?: number;
}

// ============================================================
// RECOVERY TYPES
// ============================================================

export interface RecoveryPlan {
  retry: boolean;
  retryCount?: number;
  retryDelay?: number;
  compensate: boolean;
  compensationActions?: ActionRecord[];
  replan: boolean;
  escalate: boolean;
}

export interface CompensationAction {
  original: ActionRecord;
  compensation: ActionRecord;
  priority: number;
}

// ============================================================
// STATE SNAPSHOT TYPES
// ============================================================

export interface StateSnapshot {
  txId: string;
  timestamp: number;
  state: Record<string, any>;
  results: ExecutionResult[];
  checksum: string;
}

export interface StateChange {
  key: string;
  oldValue: any;
  newValue: any;
  timestamp: number;
  source: string;
}

// ============================================================
// KERNEL STATUS TYPES
// ============================================================

export interface KernelStatus {
  isRunning: boolean;
  activeTransactions: number;
  pendingActions: number;
  failedActions: number;
  recoveredActions: number;
  uptime: number;
  lastHeartbeat: number;
}

// ============================================================
// AUDIT LOG TYPES
// ============================================================

export interface AuditLogEntry {
  id?: string;
  txId: string;
  actionId?: string;
  eventType?: string;
  timestamp: number;
  actor?: string;
  tenantId?: string;
  storeId?: string;
  userId?: string;
  actionCount: number;
  successCount: number;
  failureCount: number;
  duration: number;
  status: "pending" | "committed" | "rolled_back" | "compensating";
  metadata?: Record<string, any>;
  details?: Record<string, any>;
}

// ============================================================
// RECOVERY ENGINE TYPES
// ============================================================

export enum ErrorType {
  NETWORK = "NETWORK",
  PARTIAL = "PARTIAL",
  BUSINESS_CONFLICT = "BUSINESS_CONFLICT",
  VALIDATION = "VALIDATION",
  UNKNOWN = "UNKNOWN"
}

export interface RetryConfig {
  enabled: boolean;
  maxAttempts?: number;
  currentAttempt?: number;
  delayMs?: number;
  backoffMultiplier?: number;
}

export interface CompensationConfig {
  enabled: boolean;
  reason?: string;
  actions?: Array<{
    id: string;
    tool: string;
    params: Record<string, any>;
  }>;
}

export interface ReplanConfig {
  enabled: boolean;
  reason?: string;
  suggestion?: string;
  requiresHumanReview?: boolean;
}

export interface EscalationConfig {
  enabled: boolean;
  reason?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface RecoveryPlanDetailed {
  strategy: "retry" | "compensate" | "replan" | "escalate";
  retry?: RetryConfig;
  compensate?: CompensationConfig;
  replan?: ReplanConfig;
  escalate?: EscalationConfig;
  notes?: string;
}

// ============================================================
// KERNEL STATISTICS TYPES
// ============================================================

export interface KernelStats {
  totalTransactions: number;
  activeTransactions: number;
  committedTransactions: number;
  rolledBackTransactions: number;
  registeredTools: number;
  stateSnapshots: number;
  auditLogs: number;
}

// ============================================================
// EXECUTION CONTEXT TYPES
// ============================================================

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
