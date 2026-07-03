/**
 * Execution Kernel Integration Guide for server.ts
 *
 * This guide shows how to integrate the ExecutionKernel with the existing
 * Express server in server.ts to replace simple tool calling with
 * transaction-managed, event-driven execution.
 */

import express, { Express, Router } from 'express';
import {
  executionKernel,
  eventBus,
  createKernelIntegration,
  AIToolRegistry,
  createCommerceToolSuite,
  ActionRecord,
  ExecutionContext
} from './index';

/**
 * STEP 1: Setup Integration in server.ts
 *
 * Add this to your server initialization:
 */
export function setupExecutionKernel(app: Express): void {
  console.log('\n=== Setting up Execution Kernel ===\n');

  // 1. Create kernel integration
  const kernelIntegration = createKernelIntegration(executionKernel, {
    enableAudit: true,
    enableStateCapture: true,
    parallelExecution: false,
    actionTimeout: 60000,
    cleanupInterval: 3600000 // 1 hour
  });

  // 2. Setup AI tool registry
  const toolRegistry = new AIToolRegistry(executionKernel);
  const commerceTools = createCommerceToolSuite();
  toolRegistry.registerTools(commerceTools);

  // 3. Register existing backend tools
  registerExistingBackendTools(toolRegistry, app);

  // 4. Mount kernel API routes
  app.use('/api/kernel', kernelIntegration.getRouter());

  // 5. Setup event monitoring
  setupKernelMonitoring();

  console.log('✓ Execution Kernel initialized');
  console.log(`✓ ${toolRegistry.getToolCount()} tools registered`);
  console.log('✓ Kernel API mounted at /api/kernel/*');
}

/**
 * STEP 2: Register existing backend tools
 *
 * Map your existing backend services to ExecutionKernel tools
 */
function registerExistingBackendTools(registry: AIToolRegistry, app: Express): void {
  console.log('\nRegistering existing backend tools...\n');

  // Example: Inventory management tool
  registry.registerTool({
    name: 'inventory.check',
    description: 'Check product inventory',
    executor: async (params: { productId: string; tenantId: string; storeId: string }) => {
      // Call your existing inventory service
      // const result = await inventoryService.check(params);
      console.log(`[InventoryTool] Checking inventory for ${params.productId}`);
      return { productId: params.productId, available: 100 };
    },
    timeout: 5000,
    retryable: true
  });

  // Example: Order creation tool
  registry.registerTool({
    name: 'order.create',
    description: 'Create a new order',
    executor: async (params: { items: any[]; customerId: string; tenantId: string; storeId: string }) => {
      console.log(`[OrderTool] Creating order for customer ${params.customerId}`);
      return { orderId: `ORD${Date.now()}`, status: 'created' };
    },
    isCompensable: true,
    compensator: async (params: { orderId: string }) => {
      console.log(`[OrderTool] Canceling order ${params.orderId}`);
      return { orderId: params.orderId, status: 'cancelled' };
    },
    timeout: 10000,
    retryable: true
  });

  // Example: Payment processing tool
  registry.registerTool({
    name: 'payment.charge',
    description: 'Process payment',
    executor: async (params: { amount: number; orderId: string; method: string; tenantId: string; storeId: string }) => {
      console.log(`[PaymentTool] Processing payment of ${params.amount} for order ${params.orderId}`);
      return { transactionId: `tx_${Date.now()}`, status: 'success' };
    },
    isCompensable: true,
    compensator: async (params: { transactionId: string; amount: number }) => {
      console.log(`[PaymentTool] Refunding ${params.amount}`);
      return { refundId: `ref_${Date.now()}`, status: 'refunded' };
    },
    timeout: 15000,
    retryable: true
  });

  console.log('✓ Backend tools registered');
}

/**
 * STEP 3: Setup kernel monitoring
 */
function setupKernelMonitoring(): void {
  // Log all transactions
  eventBus.on('TX_COMMITTED', (event) => {
    console.log(`✓ [TX] Committed: ${event.payload.txId} (${event.payload.actionCount} actions)`);
  });

  eventBus.on('TX_ROLLED_BACK', (event) => {
    console.log(`✗ [TX] Rolled back: ${event.payload.txId} (${event.payload.reason})`);
  });

  // Log action results
  eventBus.on('ACTION_SUCCESS', (event) => {
    console.log(`✓ [Action] ${event.payload.actionId}: success (${event.payload.duration}ms)`);
  });

  eventBus.on('ACTION_FAILED', (event) => {
    console.log(`✗ [Action] ${event.payload.actionId}: failed (${event.payload.error})`);
  });

  // Log recovery events
  eventBus.on('RECOVERY_PLAN_CREATED', (event) => {
    console.log(`⚠ [Recovery] ${event.payload.actionId}: ${event.payload.strategy}`);
  });
}

/**
 * STEP 4: Create helper function for AI agents to execute plans
 *
 * Use this in your AI controller:
 */
export async function executeAIPlan(
  actions: ActionRecord[],
  context: ExecutionContext
): Promise<any> {
  try {
    const results = await executionKernel.execute(actions, context, {
      parallel: false,
      timeout: 60000,
      captureState: true,
      auditLog: true
    });

    return {
      success: true,
      results,
      executionStats: executionKernel.getStats()
    };
  } catch (error) {
    console.error('[Kernel] Plan execution failed:', error);
    throw error;
  }
}

/**
 * STEP 5: Update AI controller to use ExecutionKernel
 *
 * In your aiController.ts:
 */
export const aiControllerIntegrationExample = `
import { executeAIPlan } from '../execution-kernel/server-integration';
import { ActionRecord, ExecutionContext } from '../execution-kernel';

export async function executeBusinessPlan(req: Request, res: Response) {
  try {
    const { actions, context } = req.body;

    // Ensure tenant/store context
    const executionContext: ExecutionContext = {
      ...context,
      tenantId: req.headers['x-tenant-id'] as string,
      storeId: req.headers['x-store-id'] as string,
      userId: req.user?.id
    };

    // Execute through kernel
    const result = await executeAIPlan(actions, executionContext);

    res.json(result);
  } catch (error) {
    console.error('Plan execution error:', error);
    res.status(500).json({
      error: 'Execution failed',
      message: error.message
    });
  }
}
`;

/**
 * STEP 6: Create middleware for kernel context
 *
 * Add this middleware to ensure tenant/store context on all requests:
 */
export function kernelContextMiddleware(req: any, res: any, next: any) {
  // Extract from headers or session
  req.kernelContext = {
    tenantId: req.headers['x-tenant-id'] || req.session?.tenantId,
    storeId: req.headers['x-store-id'] || req.session?.storeId,
    userId: req.user?.id || req.session?.userId
  };

  if (!req.kernelContext.tenantId || !req.kernelContext.storeId) {
    return res.status(400).json({
      error: 'Missing tenant or store context',
      required: ['x-tenant-id', 'x-store-id']
    });
  }

  next();
}

/**
 * STEP 7: API Endpoint Examples
 *
 * These are the new Kernel API endpoints available:
 */
export const kernelAPIExamples = `
/**
 * Execute action plan
 * POST /api/kernel/execute
 * Headers: x-tenant-id, x-store-id
 */
POST /api/kernel/execute
Content-Type: application/json
X-Tenant-Id: tenant_001
X-Store-Id: store_001

{
  "actions": [
    {
      "id": "action_1",
      "tool": "inventory.check",
      "params": {
        "productId": "PROD001"
      },
      "status": "pending",
      "createdAt": 1624000000000
    }
  ],
  "context": {
    "userId": "user_123",
    "metadata": { "orderId": "ORD123" }
  },
  "options": {
    "parallel": false,
    "timeout": 60000,
    "captureState": true,
    "auditLog": true
  }
}

/**
 * Get transaction details
 * GET /api/kernel/transaction/{txId}
 */
GET /api/kernel/transaction/tx_1624000000000_abcd1234
X-Tenant-Id: tenant_001
X-Store-Id: store_001

/**
 * Get state snapshot
 * GET /api/kernel/snapshot/{txId}
 */
GET /api/kernel/snapshot/tx_1624000000000_abcd1234
X-Tenant-Id: tenant_001
X-Store-Id: store_001

/**
 * Get audit logs
 * GET /api/kernel/audit?limit=100
 */
GET /api/kernel/audit?limit=50
X-Tenant-Id: tenant_001
X-Store-Id: store_001

/**
 * Get event history
 * GET /api/kernel/events?limit=100
 */
GET /api/kernel/events?limit=50
X-Tenant-Id: tenant_001
X-Store-Id: store_001

/**
 * Get kernel statistics
 * GET /api/kernel/stats
 */
GET /api/kernel/stats
X-Tenant-Id: tenant_001
X-Store-Id: store_001

/**
 * Subscribe to events (Server-Sent Events)
 * GET /api/kernel/subscribe?eventType=*
 */
GET /api/kernel/subscribe?eventType=ACTION_SUCCESS
X-Tenant-Id: tenant_001
X-Store-Id: store_001

// Responses as event stream:
data: {"type":"ACTION_SUCCESS","payload":{...}}
data: {"type":"ACTION_SUCCESS","payload":{...}}
`;

/**
 * STEP 8: Summary of Integration Points
 *
 * 1. **Initialization** (server.ts):
 *    setupExecutionKernel(app)
 *
 * 2. **Tool Registration** (backend services):
 *    registry.registerTool({ name, executor, compensator, ... })
 *
 * 3. **AI Execution** (aiController.ts):
 *    await executeAIPlan(actions, context)
 *
 * 4. **Middleware** (request pipeline):
 *    app.use(kernelContextMiddleware)
 *
 * 5. **Monitoring** (logging/debugging):
 *    eventBus.on('EVENT_TYPE', handler)
 *
 * 6. **API** (external clients):
 *    POST /api/kernel/execute
 *    GET /api/kernel/*
 */

export default {
  setupExecutionKernel,
  registerExistingBackendTools,
  setupKernelMonitoring,
  executeAIPlan,
  kernelContextMiddleware
};
