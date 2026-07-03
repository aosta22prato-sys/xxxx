/**
 * Execution Kernel - Main Export
 * Central hub for all kernel components (Production Ready)
 */

// Core components
export { EventBus, eventBus } from './event-bus';
export { TransactionManager } from './transaction-manager';
export { RecoveryEngine, ErrorType } from './recovery-engine';
export { ExecutionKernel, executionKernel } from './execution-kernel';
export { KernelIntegration, createKernelIntegration } from './kernel-integration';
export { AIToolRegistry, createToolDefinition, commerceTools, createCommerceToolSuite } from './ai-tool-registry';

// Persistence layer
export { KernelPersistence, createPersistenceFromEnv } from './persistence';

// Logging and monitoring
export { KernelLogger, LogLevel, PerformanceMonitor, Timer, logger, perfMonitor, createLoggerFromEnv } from './logger';

// Configuration
export { ConfigManager, DEFAULT_CONFIG, config, createConfigFromEnv } from './config';

// Bootstrap
export { bootstrapKernel, shutdownKernel, healthCheck } from './bootstrap';

// Type exports
export * from './types';

// Examples and utilities
export * from './kernel-examples';

// Convenience imports
import { executionKernel } from './execution-kernel';
import { eventBus } from './event-bus';
import { logger } from './logger';
import { config } from './config';

export { executionKernel, eventBus, logger, config };
