/**
 * Execution Kernel - Complete Integration Example
 * Shows how to integrate into existing server.ts
 */

import express, { Express, Request, Response } from 'express';
import { bootstrapKernel, shutdownKernel, healthCheck, KernelBootstrapResult } from './bootstrap';
import { executionKernel, ActionRecord, ExecutionContext } from './index';

/**
 * STEP 1: Extend Express Request type for kernel context
 */
declare global {
  namespace Express {
    interface Request {
      kernelContext: ExecutionContext;
      kernelResult: KernelBootstrapResult;
    }
  }
}

/**
 * STEP 2: Create Express server with kernel
 */
export async function createServerWithKernel(): Promise<Express> {
  const app = express();

  // Middleware
  app.use(express.json());

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error('Server error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  });

  // Extract tenant context from headers
  app.use((req: Request, res: Response, next: Function) => {
    req.kernelContext = {
      tenantId: req.headers['x-tenant-id'] as string,
      storeId: req.headers['x-store-id'] as string,
      userId: req.headers['x-user-id'] as string,
      metadata: {
        path: req.path,
        method: req.method
      }
    };

    if (!req.kernelContext.tenantId || !req.kernelContext.storeId) {
      return res.status(400).json({
        error: 'Missing required headers',
        required: ['x-tenant-id', 'x-store-id']
      });
    }

    next();
  });

  // Bootstrap Execution Kernel
  console.log('\n🚀 Starting Execution Kernel...\n');
  const kernelResult = await bootstrapKernel(app, {
    environment: (process.env.NODE_ENV as any) || 'development',
    debug: process.env.DEBUG === 'true'
  });

  // Store kernel result for use in handlers
  app.use((req: Request, res: Response, next: Function) => {
    req.kernelResult = kernelResult;
    next();
  });

  // ============================================================
  // EXAMPLE API ROUTES
  // ============================================================

  /**
   * Health check endpoint
   */
  app.get('/health', (req: Request, res: Response) => {
    res.json(healthCheck(req.kernelResult));
  });

  /**
   * Execute business action (example: create order)
   */
  app.post('/api/orders/create', async (req: Request, res: Response) => {
    try {
      const { items, customer } = req.body;

      const actions: ActionRecord[] = [
        {
          id: `inventory_${Date.now()}`,
          tool: 'inventory.reserve',
          params: {
            items,
            orderId: `ORD${Date.now()}`
          },
          status: 'pending',
          createdAt: Date.now()
        },
        {
          id: `payment_${Date.now()}`,
          tool: 'payment.process',
          params: {
            amount: 100, // Calculate from items
            orderId: `ORD${Date.now()}`,
            customerId: customer.id
          },
          status: 'pending',
          createdAt: Date.now()
        },
        {
          id: `notification_${Date.now()}`,
          tool: 'notification.send',
          params: {
            customerId: customer.id,
            message: 'Order confirmed'
          },
          status: 'pending',
          createdAt: Date.now()
        }
      ];

      // Execute through kernel
      const results = await executionKernel.execute(actions, req.kernelContext, {
        parallel: false,
        timeout: 60000,
        captureState: true,
        auditLog: true
      });

      res.json({
        success: true,
        results,
        stats: req.kernelResult.kernel.getStats()
      });
    } catch (error) {
      res.status(500).json({
        error: 'Order creation failed',
        message: (error as Error).message
      });
    }
  });

  /**
   * Get order status
   */
  app.get('/api/orders/:orderId/status', (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      res.json({
        orderId,
        status: 'completed',
        kernel_stats: req.kernelResult.kernel.getStats()
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  /**
   * Execute AI plan
   */
  app.post('/api/ai/execute-plan', async (req: Request, res: Response) => {
    try {
      const { actions, options } = req.body;

      if (!Array.isArray(actions)) {
        return res.status(400).json({ error: 'Actions must be array' });
      }

      const results = await executionKernel.execute(actions, req.kernelContext, {
        parallel: options?.parallel || false,
        timeout: options?.timeout || 60000,
        captureState: true,
        auditLog: true
      });

      res.json({
        success: true,
        results,
        transactionCount: req.kernelResult.kernel.getStats().totalTransactions
      });
    } catch (error) {
      res.status(500).json({
        error: 'Plan execution failed',
        message: (error as Error).message
      });
    }
  });

  /**
   * Get audit trail
   */
  app.get('/api/audit', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = req.kernelResult.kernel.getAuditLogs(limit);
      res.json({
        logs,
        count: logs.length
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  /**
   * Kernel stats
   */
  app.get('/api/kernel/stats', (req: Request, res: Response) => {
    res.json(req.kernelResult.kernel.getStats());
  });

  return app;
}

/**
 * STEP 3: Start server
 */
export async function startServer(): Promise<void> {
  try {
    const app = await createServerWithKernel();
    const port = parseInt(process.env.PORT || '3000');

    const server = app.listen(port, () => {
      console.log(`\n✅ Server running on http://localhost:${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`🔌 Kernel stats: http://localhost:${port}/api/kernel/stats\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n🛑 SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\n🛑 SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

/**
 * STEP 4: Example client usage
 */
export const exampleClientUsage = `
// Example 1: Create order with kernel execution
const createOrder = async (items, customer) => {
  const response = await fetch('http://localhost:3000/api/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': 'tenant_001',
      'X-Store-Id': 'store_001',
      'X-User-Id': 'user_123'
    },
    body: JSON.stringify({ items, customer })
  });

  return response.json();
};

// Example 2: Execute custom plan
const executePlan = async (actions) => {
  const response = await fetch('http://localhost:3000/api/ai/execute-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': 'tenant_001',
      'X-Store-Id': 'store_001'
    },
    body: JSON.stringify({
      actions,
      options: { parallel: false, timeout: 60000 }
    })
  });

  return response.json();
};

// Example 3: Subscribe to events (Server-Sent Events)
const subscribeToEvents = () => {
  const eventSource = new EventSource(
    '/api/kernel/subscribe?eventType=ACTION_SUCCESS',
    {
      headers: {
        'X-Tenant-Id': 'tenant_001',
        'X-Store-Id': 'store_001'
      }
    }
  );

  eventSource.onmessage = (event) => {
    console.log('Event:', JSON.parse(event.data));
  };

  return eventSource;
};

// Example 4: Check health
const checkHealth = async () => {
  const response = await fetch('/health');
  return response.json();
};
`;

// Start server if run directly
if (require.main === module) {
  startServer().catch(console.error);
}

export { KernelBootstrapResult };
