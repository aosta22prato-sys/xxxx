/**
 * Complete Integration Example - Execution Kernel + Business Brain
 * Shows full stack integration in server.ts
 */

import express from 'express';
import { bootstrapKernel, shutdownKernel } from '../execution-kernel/bootstrap';
import { businessBrain, getAllBusinessRules, mountBusinessBrainRoutes } from '../business-brain';
import { executionKernel } from '../execution-kernel';

/**
 * Create integrated server with both Kernel and Business Brain
 */
export async function createIntegratedServer(): Promise<express.Express> {
  const app = express();

  // Middleware
  app.use(express.json());

  // ============================================================
  // STEP 1: Bootstrap Execution Kernel
  // ============================================================
  console.log('\n🚀 Bootstrapping Execution Kernel...\n');
  const kernelResult = await bootstrapKernel(app, {
    environment: (process.env.NODE_ENV as any) || 'development',
    debug: process.env.DEBUG === 'true'
  });

  console.log('✅ Execution Kernel initialized\n');

  // ============================================================
  // STEP 2: Initialize Business Brain Rules
  // ============================================================
  console.log('🧠 Initializing Business Brain...\n');
  const rules = getAllBusinessRules();
  businessBrain.registerRules(rules);
  console.log(`✅ Business Brain initialized with ${rules.length} rules\n`);

  // ============================================================
  // STEP 3: Mount Business Brain API routes
  // ============================================================
  mountBusinessBrainRoutes(app);

  // ============================================================
  // STEP 4: Create integrated business workflows
  // ============================================================

  /**
   * Example: Complete order processing workflow
   * Order → Business Brain → Execution Kernel → Results
   */
  app.post('/api/orders', async (req, res) => {
    try {
      const order = req.body;
      const tenantId = req.headers['x-tenant-id'] as string;
      const storeId = req.headers['x-store-id'] as string;

      if (!tenantId || !storeId) {
        return res.status(400).json({
          error: 'Missing required headers: x-tenant-id, x-store-id'
        });
      }

      console.log('\n📦 Processing Order:', order.id);

      // Step 1: Business Brain makes decision
      console.log('   → Analyzing with Business Brain...');
      const businessContext = { tenantId, storeId };
      const decision = await businessBrain.makeDecision(order, businessContext);

      console.log(`   → Decision: ${decision.type}`);
      console.log(`   → Actions: ${decision.actions.length}`);
      console.log(`   → Confidence: ${(decision.confidence * 100).toFixed(0)}%`);

      // Step 2: Execute decision through Kernel
      console.log('   → Executing through Execution Kernel...');
      const results = await businessBrain.executeDecision(decision, businessContext);

      console.log(`   → Completed: ${results.filter((r) => r.success).length}/${results.length}\n`);

      res.json({
        success: true,
        orderId: order.id,
        decision: {
          type: decision.type,
          confidence: decision.confidence,
          reasoning: decision.reasoning
        },
        results: results.map((r) => ({
          actionId: r.actionId,
          success: r.success,
          data: r.data
        })),
        stats: {
          kernelTransactions: kernelResult.kernel.getStats().totalTransactions,
          businessDecisions: businessBrain.getStats().totalDecisions
        }
      });
    } catch (error) {
      console.error('❌ Order processing failed:', error);
      res.status(500).json({
        error: 'Order processing failed',
        message: (error as Error).message
      });
    }
  });

  /**
   * Example: Inventory monitoring workflow
   * Inventory update → Business Brain → Auto-replenishment
   */
  app.post('/api/inventory/update', async (req, res) => {
    try {
      const { skuId, currentStock, thresholdStock, reorderQuantity } = req.body;
      const tenantId = req.headers['x-tenant-id'] as string;
      const storeId = req.headers['x-store-id'] as string;

      console.log(`\n📊 Inventory Update: SKU=${skuId}, Stock=${currentStock}`);

      // Business Brain analyzes inventory situation
      const decision = await businessBrain.makeDecision(
        {
          skuId,
          currentStock,
          thresholdStock,
          reorderQuantity
        },
        { tenantId, storeId }
      );

      console.log(`   → Decision: ${decision.type}`);

      if (decision.actions.length > 0) {
        const results = await businessBrain.executeDecision(decision, {
          tenantId,
          storeId
        });

        res.json({
          success: true,
          skuId,
          decision: decision.type,
          actionsExecuted: results.length
        });
      } else {
        res.json({
          success: true,
          skuId,
          message: 'Inventory level normal'
        });
      }
    } catch (error) {
      res.status(500).json({
        error: 'Inventory update failed',
        message: (error as Error).message
      });
    }
  });

  /**
   * Example: Customer engagement workflow
   * Customer event → Business Brain → Engagement action
   */
  app.post('/api/customers/events', async (req, res) => {
    try {
      const { customerId, eventType, eventData } = req.body;
      const tenantId = req.headers['x-tenant-id'] as string;
      const storeId = req.headers['x-store-id'] as string;

      console.log(`\n👤 Customer Event: ${eventType}`);

      // Prepare situation based on event type
      let situation: any;

      switch (eventType) {
        case 'cart_abandoned':
          situation = {
            customerId,
            cartValue: eventData.cartValue,
            minutesSinceAbandonment: eventData.minutesSinceAbandonment,
            recovered: false
          };
          break;

        case 'churn_risk':
          situation = {
            customerId,
            churnRiskScore: eventData.churnRiskScore,
            lastPurchaseDate: eventData.lastPurchaseDate
          };
          break;

        default:
          situation = eventData;
      }

      // Business Brain makes engagement decision
      const decision = await businessBrain.makeDecision(situation, {
        tenantId,
        storeId
      });

      console.log(`   → Decision: ${decision.type}`);

      // Execute engagement action
      const results = await businessBrain.executeDecision(decision, {
        tenantId,
        storeId
      });

      res.json({
        success: true,
        customerId,
        eventType,
        decision: decision.type,
        actionsExecuted: results.length
      });
    } catch (error) {
      res.status(500).json({
        error: 'Customer event processing failed',
        message: (error as Error).message
      });
    }
  });

  /**
   * Health check endpoint - combined status
   */
  app.get('/health', (req, res) => {
    const kernelStats = kernelResult.kernel.getStats();
    const brainStats = businessBrain.getStats();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      kernel: {
        activeTransactions: kernelStats.activeTransactions,
        totalTransactions: kernelStats.totalTransactions,
        registeredTools: kernelStats.registeredTools
      },
      businessBrain: {
        totalRules: brainStats.totalRules,
        enabledRules: brainStats.enabledRules,
        totalDecisions: brainStats.totalDecisions,
        registeredStores: brainStats.registeredStores
      }
    });
  });

  /**
   * Dashboard metrics endpoint
   */
  app.get('/api/dashboard', (req, res) => {
    const tenantId = req.headers['x-tenant-id'] as string;
    const storeId = req.headers['x-store-id'] as string;

    if (!tenantId || !storeId) {
      return res.status(400).json({
        error: 'Missing required headers'
      });
    }

    const kernelStats = kernelResult.kernel.getStats();
    const brainStats = businessBrain.getStats();
    const metrics = businessBrain.getMetrics({ tenantId, storeId });
    const decisions = businessBrain.getDecisions(10);

    res.json({
      store: { tenantId, storeId },
      kernel: kernelStats,
      businessBrain: brainStats,
      metrics: metrics || {},
      recentDecisions: decisions.map((d) => ({
        id: d.id,
        type: d.type,
        confidence: d.confidence,
        timestamp: d.timestamp
      }))
    });
  });

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: Function) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  });

  return app;
}

/**
 * Start integrated server
 */
export async function startIntegratedServer(): Promise<void> {
  try {
    const app = await createIntegratedServer();
    const port = parseInt(process.env.PORT || '3000');

    const server = app.listen(port, () => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ Integrated Server Running');
      console.log('='.repeat(60));
      console.log(`\n📍 API URL: http://localhost:${port}`);
      console.log(`\n🔌 Endpoints:`);
      console.log(`   POST   /api/orders                    - Process order`);
      console.log(`   POST   /api/inventory/update          - Update inventory`);
      console.log(`   POST   /api/customers/events          - Customer events`);
      console.log(`   GET    /health                         - Health check`);
      console.log(`   GET    /api/dashboard                 - Dashboard`);
      console.log(`   GET    /api/business-brain/*          - Business Brain API`);
      console.log(`   GET    /api/kernel/*                  - Execution Kernel API`);
      console.log(`\n📊 Monitoring:`);
      console.log(`   http://localhost:${port}/health`);
      console.log(`   http://localhost:${port}/api/dashboard`);
      console.log('\n' + '='.repeat(60) + '\n');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n🛑 SIGTERM received, shutting down...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('\n🛑 SIGINT received, shutting down...');
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

// Start if run directly
if (require.main === module) {
  startIntegratedServer().catch(console.error);
}

export { createIntegratedServer, startIntegratedServer };
