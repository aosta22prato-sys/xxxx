/**
 * Execution Kernel - Setup & Examples
 * Shows how to initialize and use the entire kernel system
 */

import {
  executionKernel,
  eventBus,
  createKernelIntegration,
  KernelIntegration
} from './index';
import { AIToolRegistry, createCommerceToolSuite } from './ai-tool-registry';
import { ActionRecord, ExecutionContext } from './types';

/**
 * Initialize kernel with all components
 */
export function initializeKernel() {
  console.log('================================');
  console.log('Execution Kernel Initialization');
  console.log('================================');

  // Setup tool registry
  const toolRegistry = new AIToolRegistry(executionKernel);
  const commerceTools = createCommerceToolSuite();
  toolRegistry.registerTools(commerceTools);

  console.log(`✓ Registered ${toolRegistry.getToolCount()} commerce tools`);

  // Create kernel integration for Express
  const kernelIntegration = createKernelIntegration(executionKernel, {
    enableAudit: true,
    enableStateCapture: true,
    parallelExecution: false,
    actionTimeout: 60000,
    cleanupInterval: 3600000
  });

  console.log('✓ Kernel Integration created');

  // Setup event listeners for monitoring
  setupEventListeners();

  return {
    executionKernel,
    eventBus,
    toolRegistry,
    kernelIntegration
  };
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
  // Listen for execution success
  eventBus.on('EXECUTION_SUCCESS', (event) => {
    console.log(`[Event] Execution success: ${event.txId} (${event.payload.duration}ms)`);
  });

  // Listen for execution failure
  eventBus.on('EXECUTION_FAILED', (event) => {
    console.log(
      `[Event] Execution failed: ${event.txId}, failures: ${event.payload.failureCount}`
    );
  });

  // Listen for action success
  eventBus.on('ACTION_SUCCESS', (event) => {
    console.log(`[Event] Action success: ${event.payload.actionId} (${event.payload.duration}ms)`);
  });

  // Listen for action failure
  eventBus.on('ACTION_FAILED', (event) => {
    console.log(`[Event] Action failed: ${event.payload.actionId}, error: ${event.payload.error}`);
  });

  // Listen for recovery plans
  eventBus.on('RECOVERY_PLAN_CREATED', (event) => {
    console.log(
      `[Event] Recovery plan created: ${event.payload.actionId}, strategy: ${event.payload.strategy}`
    );
  });

  // Listen for compensation
  eventBus.on('COMPENSATION_EXECUTED', (event) => {
    console.log(
      `[Event] Compensation executed: ${event.payload.actionId}, count: ${event.payload.compensationCount}`
    );
  });

  console.log('✓ Event listeners registered');
}

/**
 * Example: Execute simple order flow
 */
export async function exampleSimpleOrderFlow() {
  console.log('\n--- Example: Simple Order Flow ---\n');

  const { toolRegistry } = initializeKernel();

  // Create action plan
  const actions: ActionRecord[] = [
    {
      id: 'action_1',
      tool: 'inventory.reserve',
      params: { skuId: 'SKU001', quantity: 10, orderId: 'ORD12345' },
      status: 'pending',
      createdAt: Date.now()
    },
    {
      id: 'action_2',
      tool: 'payment.process',
      params: { orderId: 'ORD12345', amount: 500, method: 'credit_card' },
      status: 'pending',
      createdAt: Date.now()
    },
    {
      id: 'action_3',
      tool: 'logistics.ship',
      params: {
        orderId: 'ORD12345',
        items: [{ skuId: 'SKU001', quantity: 10 }],
        destination: 'New York'
      },
      status: 'pending',
      createdAt: Date.now()
    }
  ];

  // Create execution context
  const context: ExecutionContext = {
    tenantId: 'tenant_001',
    storeId: 'store_001',
    userId: 'user_123',
    metadata: { orderId: 'ORD12345', orderType: 'standard' }
  };

  // Execute plan
  try {
    const results = await executionKernel.execute(actions, context, {
      parallel: false,
      timeout: 60000,
      captureState: true,
      auditLog: true
    });

    console.log('\nExecution Results:');
    results.forEach((result) => {
      console.log(`  ${result.actionId}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      if (result.data) console.log(`    Data: ${JSON.stringify(result.data)}`);
      if (result.error) console.log(`    Error: ${result.error}`);
    });

    // Get kernel stats
    const stats = executionKernel.getStats();
    console.log('\nKernel Stats:', stats);
  } catch (err) {
    console.error('Execution error:', err);
  }
}

/**
 * Example: Execute with parallel actions
 */
export async function exampleParallelExecution() {
  console.log('\n--- Example: Parallel Execution ---\n');

  initializeKernel();

  const actions: ActionRecord[] = [
    {
      id: 'notify_1',
      tool: 'notification.send',
      params: { orderId: 'ORD12345', message: 'Order confirmed', channel: 'email' },
      status: 'pending',
      createdAt: Date.now()
    },
    {
      id: 'notify_2',
      tool: 'notification.send',
      params: { orderId: 'ORD12345', message: 'Order confirmed', channel: 'sms' },
      status: 'pending',
      createdAt: Date.now()
    },
    {
      id: 'notify_3',
      tool: 'notification.send',
      params: { orderId: 'ORD12345', message: 'Order confirmed', channel: 'push' },
      status: 'pending',
      createdAt: Date.now()
    }
  ];

  const context: ExecutionContext = {
    tenantId: 'tenant_001',
    storeId: 'store_001'
  };

  try {
    const results = await executionKernel.execute(actions, context, {
      parallel: true, // Execute notifications in parallel
      timeout: 30000,
      captureState: true,
      auditLog: true
    });

    console.log(`Sent ${results.filter((r) => r.success).length}/${results.length} notifications`);
  } catch (err) {
    console.error('Error:', err);
  }
}

/**
 * Example: Monitor event history
 */
export async function exampleEventMonitoring() {
  console.log('\n--- Example: Event Monitoring ---\n');

  initializeKernel();

  // Execute a simple action
  const actions: ActionRecord[] = [
    {
      id: 'monitor_action_1',
      tool: 'payment.process',
      params: { orderId: 'ORD99999', amount: 100, method: 'credit_card' },
      status: 'pending',
      createdAt: Date.now()
    }
  ];

  const context: ExecutionContext = {
    tenantId: 'tenant_001',
    storeId: 'store_001'
  };

  await executionKernel.execute(actions, context);

  // Get event history
  const events = eventBus.getHistory(20);
  console.log(`\nEvent History (last 20 events):`);
  events.forEach((event) => {
    console.log(`  ${event.timestamp}: ${event.type}`);
    if (event.payload) {
      console.log(`    Payload: ${JSON.stringify(event.payload).substring(0, 100)}...`);
    }
  });
}

/**
 * Example: Query audit logs
 */
export async function exampleAuditLogging() {
  console.log('\n--- Example: Audit Logging ---\n');

  initializeKernel();

  // Execute multiple operations
  for (let i = 0; i < 3; i++) {
    const actions: ActionRecord[] = [
      {
        id: `audit_action_${i}`,
        tool: 'inventory.reserve',
        params: { skuId: `SKU_${i}`, quantity: i + 1, orderId: `ORD_${i}` },
        status: 'pending',
        createdAt: Date.now()
      }
    ];

    await executionKernel.execute(actions, {
      tenantId: 'tenant_001',
      storeId: 'store_001'
    });
  }

  // Query audit logs
  const logs = executionKernel.getAuditLogs(50);
  console.log(`\nAudit Logs (last 50 entries):`);
  logs.forEach((log) => {
    console.log(`  ${new Date(log.timestamp).toISOString()}: ${log.status}`);
    console.log(`    TX: ${log.txId}, Actions: ${log.actionCount}, Success: ${log.successCount}`);
  });
}

/**
 * Example: Create kernel integration for Express
 */
export async function exampleExpressIntegration() {
  console.log('\n--- Example: Express Integration ---\n');

  const { kernelIntegration } = initializeKernel();

  // Get Express router
  const router = kernelIntegration.getRouter();

  console.log('✓ Kernel routes ready:');
  console.log('  POST   /kernel/execute       - Execute action plan');
  console.log('  GET    /kernel/transaction/:txId - Get transaction');
  console.log('  GET    /kernel/snapshot/:txId - Get state snapshot');
  console.log('  GET    /kernel/audit?limit=100 - Get audit logs');
  console.log('  GET    /kernel/events?limit=100 - Get event history');
  console.log('  GET    /kernel/stats - Get kernel statistics');
  console.log('  GET    /kernel/subscribe?eventType=* - Subscribe to events (SSE)');

  return router;
}

export default {
  initializeKernel,
  exampleSimpleOrderFlow,
  exampleParallelExecution,
  exampleEventMonitoring,
  exampleAuditLogging,
  exampleExpressIntegration
};
