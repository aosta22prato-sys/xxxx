/**
 * Execution Kernel Bootstrap
 * Complete initialization for production deployment
 */

import { Express } from 'express';
import { executionKernel, eventBus } from './execution-kernel';
import { AIToolRegistry, createCommerceToolSuite } from './ai-tool-registry';
import { KernelIntegration, createKernelIntegration } from './kernel-integration';
import { KernelPersistence, createPersistenceFromEnv } from './persistence';
import { logger, perfMonitor, LogLevel, createLoggerFromEnv } from './logger';
import { config, createConfigFromEnv, KernelConfig } from './config';
import { createCommerceToolSuite as createToolSuite } from './ai-tool-registry';

export interface KernelBootstrapResult {
  kernel: typeof executionKernel;
  eventBus: typeof eventBus;
  integration: KernelIntegration;
  registry: AIToolRegistry;
  persistence: KernelPersistence;
  logger: typeof logger;
  config: typeof config;
}

/**
 * Main bootstrap function
 */
export async function bootstrapKernel(app: Express, configOverrides?: Partial<KernelConfig>): Promise<KernelBootstrapResult> {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Execution Kernel Bootstrap');
  console.log('='.repeat(60) + '\n');

  try {
    // 1. Initialize configuration
    console.log('📋 [1/7] Initializing configuration...');
    const cfg = createConfigFromEnv(configOverrides);
    console.log(`   Environment: ${cfg.getConfig().environment}`);
    console.log(`   Debug: ${cfg.getConfig().debug}`);

    // 2. Initialize logging
    console.log('\n📊 [2/7] Initializing logging system...');
    const appLogger = createLoggerFromEnv();
    if (cfg.getConfig().logging.level) {
      const levelMap: Record<string, LogLevel> = {
        TRACE: LogLevel.TRACE,
        DEBUG: LogLevel.DEBUG,
        INFO: LogLevel.INFO,
        WARN: LogLevel.WARN,
        ERROR: LogLevel.ERROR,
        FATAL: LogLevel.FATAL
      };
      appLogger.setLevel(levelMap[cfg.getConfig().logging.level] || LogLevel.INFO);
    }
    appLogger.info('Bootstrap', 'Logging system initialized');

    // 3. Initialize persistence
    console.log('\n💾 [3/7] Initializing persistence layer...');
    const persistence = createPersistenceFromEnv();
    if (cfg.getConfig().persistence.enabled) {
      await persistence.initializeSchema();
      appLogger.info('Bootstrap', 'Database schema initialized');
    } else {
      appLogger.info('Bootstrap', 'Persistence disabled (in-memory mode)');
    }

    // 4. Initialize tool registry
    console.log('\n🔧 [4/7] Registering tools...');
    const registry = new AIToolRegistry(executionKernel);
    const tools = createToolSuite();
    registry.registerTools(tools);
    appLogger.info('Bootstrap', `Registered ${registry.getToolCount()} tools`);

    // 5. Initialize kernel integration
    console.log('\n🌐 [5/7] Setting up Express integration...');
    const integration = createKernelIntegration(executionKernel, {
      enableAudit: cfg.getConfig().security.enableAudit,
      enableStateCapture: true,
      parallelExecution: false,
      actionTimeout: cfg.getConfig().transactionTimeout,
      cleanupInterval: cfg.getConfig().cleanup.interval
    });
    app.use('/api/kernel', integration.getRouter());
    appLogger.info('Bootstrap', 'Kernel API routes mounted at /api/kernel/*');

    // 6. Setup event monitoring
    console.log('\n📡 [6/7] Setting up event monitoring...');
    setupEventMonitoring(appLogger, cfg.getConfig());

    // 7. Setup performance monitoring
    console.log('\n⚡ [7/7] Setting up performance monitoring...');
    if (cfg.getConfig().performance.enableMonitoring) {
      setupPerformanceMonitoring(appLogger);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ Kernel Bootstrap Complete');
    console.log('='.repeat(60));
    console.log('\n📊 Configuration Summary:');
    const summary = cfg.getSummary();
    Object.entries(summary).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    console.log('\n🔌 Available Endpoints:');
    console.log('   POST   /api/kernel/execute              - Execute plan');
    console.log('   GET    /api/kernel/transaction/:txId    - Get transaction');
    console.log('   GET    /api/kernel/snapshot/:txId       - Get snapshot');
    console.log('   GET    /api/kernel/audit                - Get audit logs');
    console.log('   GET    /api/kernel/events               - Get events');
    console.log('   GET    /api/kernel/stats                - Get stats');
    console.log('   GET    /api/kernel/subscribe            - SSE subscribe');
    console.log('\n');

    return {
      kernel: executionKernel,
      eventBus,
      integration,
      registry,
      persistence,
      logger: appLogger,
      config: cfg
    };
  } catch (error) {
    console.error('❌ Bootstrap failed:', error);
    throw error;
  }
}

/**
 * Setup event monitoring
 */
function setupEventMonitoring(appLogger: typeof logger, cfg: KernelConfig): void {
  // TX events
  eventBus.on('TX_BEGIN', (event) => {
    appLogger.debug('EventMonitor', 'Transaction begin', { txId: event.txId });
  });

  eventBus.on('TX_COMMITTED', (event) => {
    appLogger.info('EventMonitor', `TX committed: ${event.payload.txId}`, {
      actions: event.payload.actionCount,
      duration: event.payload.duration
    });
  });

  eventBus.on('TX_ROLLED_BACK', (event) => {
    appLogger.warn('EventMonitor', `TX rolled back: ${event.payload.txId}`, {
      reason: event.payload.reason
    });
  });

  // Action events
  eventBus.on('ACTION_SUCCESS', (event) => {
    appLogger.debug('EventMonitor', `Action success: ${event.payload.actionId}`, {
      tool: event.payload.tool,
      duration: event.payload.duration
    });
    perfMonitor.record('action_duration', event.payload.duration);
  });

  eventBus.on('ACTION_FAILED', (event) => {
    appLogger.error('EventMonitor', `Action failed: ${event.payload.actionId}`, undefined, {
      tool: event.payload.tool,
      error: event.payload.error
    });
  });

  // Recovery events
  eventBus.on('RECOVERY_PLAN_CREATED', (event) => {
    appLogger.warn('EventMonitor', `Recovery triggered: ${event.payload.actionId}`, {
      strategy: event.payload.strategy
    });
  });

  // Execution summary events
  eventBus.on('EXECUTION_SUCCESS', (event) => {
    appLogger.info('EventMonitor', `Execution success: ${event.payload.txId}`, {
      actions: event.payload.actionCount,
      duration: event.payload.duration
    });
    perfMonitor.record('execution_duration', event.payload.duration);
  });

  eventBus.on('EXECUTION_FAILED', (event) => {
    appLogger.error('EventMonitor', `Execution failed: ${event.payload.txId}`, undefined, {
      failures: event.payload.failureCount,
      compensated: event.payload.compensated
    });
  });

  console.log('   ✓ Event monitoring setup complete');
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring(appLogger: typeof logger): void {
  // Track kernel metrics every minute
  setInterval(() => {
    const stats = executionKernel.getStats();
    const metrics = perfMonitor.getAllMetrics();

    appLogger.debug('Performance', 'Kernel metrics', {
      activeTransactions: stats.activeTransactions,
      totalTransactions: stats.totalTransactions,
      registeredTools: stats.registeredTools,
      stateSnapshots: stats.stateSnapshots,
      actionDuration: metrics.action_duration,
      executionDuration: metrics.execution_duration
    });
  }, 60000); // Every minute

  console.log('   ✓ Performance monitoring setup complete');
}

/**
 * Graceful shutdown
 */
export async function shutdownKernel(result: KernelBootstrapResult): Promise<void> {
  console.log('\n🛑 Shutting down Execution Kernel...');

  try {
    // Cleanup persistence
    if (result.persistence) {
      await result.persistence.dispose();
    }

    // Dispose event bus
    if (result.eventBus) {
      result.eventBus.dispose();
    }

    // Cleanup kernel
    if (result.kernel) {
      result.kernel.cleanup();
    }

    console.log('✅ Kernel shutdown complete');
  } catch (error) {
    console.error('❌ Shutdown error:', error);
  }
}

/**
 * Health check
 */
export function healthCheck(result: KernelBootstrapResult): Record<string, any> {
  const stats = result.kernel.getStats();
  const eventTypes = result.eventBus.getEventTypes();

  return {
    status: 'healthy',
    timestamp: Date.now(),
    kernel: {
      totalTransactions: stats.totalTransactions,
      activeTransactions: stats.activeTransactions,
      committedTransactions: stats.committedTransactions,
      failedTransactions: stats.rolledBackTransactions,
      registeredTools: stats.registeredTools
    },
    events: {
      registeredTypes: eventTypes.length,
      totalEmitted: result.eventBus.getHistory(1).length
    },
    config: result.config.getSummary()
  };
}

/**
 * Export for use in server.ts
 */
export { KernelBootstrapResult };
