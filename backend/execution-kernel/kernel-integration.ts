/**
 * Execution Kernel Integration
 * Bridges ExecutionKernel with AI systems and Express server
 */

import { ExecutionKernel, eventBus, ActionRecord } from './index';
import { Router, Request, Response } from 'express';

export interface KernelIntegrationConfig {
  enableAudit?: boolean;
  enableStateCapture?: boolean;
  parallelExecution?: boolean;
  actionTimeout?: number;
  cleanupInterval?: number; // ms
}

export class KernelIntegration {
  private kernel: ExecutionKernel;
  private router: Router;
  private config: KernelIntegrationConfig;
  private cleanupTimer?: NodeJS.Timer;

  constructor(kernel: ExecutionKernel, config: KernelIntegrationConfig = {}) {
    this.kernel = kernel;
    this.config = {
      enableAudit: config.enableAudit !== false,
      enableStateCapture: config.enableStateCapture !== false,
      parallelExecution: config.parallelExecution || false,
      actionTimeout: config.actionTimeout || 60000,
      cleanupInterval: config.cleanupInterval || 3600000
    };
    this.router = Router();
    this.setupRoutes();
    this.setupCleanup();
    console.log('[KernelIntegration] Initialized');
  }

  /**
   * Setup Express routes
   */
  private setupRoutes(): void {
    /**
     * Execute action plan
     * POST /kernel/execute
     */
    this.router.post('/execute', async (req: Request, res: Response) => {
      try {
        const { actions, context, options } = req.body;

        if (!actions || !Array.isArray(actions)) {
          return res.status(400).json({ error: 'Invalid actions' });
        }

        // Merge tenant/store from request context
        const executionContext = {
          ...context,
          tenantId: req.headers['x-tenant-id'] as string,
          storeId: req.headers['x-store-id'] as string
        };

        // Execute
        const results = await this.kernel.execute(actions, executionContext, {
          parallel: this.config.parallelExecution,
          timeout: this.config.actionTimeout,
          captureState: this.config.enableStateCapture,
          auditLog: this.config.enableAudit
        });

        return res.json({
          success: true,
          results,
          stats: this.kernel.getStats()
        });
      } catch (err) {
        console.error('[KernelIntegration] Execute error:', err);
        return res.status(500).json({
          error: 'Execution failed',
          message: (err as Error).message
        });
      }
    });

    /**
     * Get transaction status
     * GET /kernel/transaction/:txId
     */
    this.router.get('/transaction/:txId', (req: Request, res: Response) => {
      const tx = this.kernel.getTransaction(req.params.txId);
      if (!tx) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      return res.json(tx);
    });

    /**
     * Get state snapshot
     * GET /kernel/snapshot/:txId
     */
    this.router.get('/snapshot/:txId', (req: Request, res: Response) => {
      const snapshot = this.kernel.getStateSnapshot(req.params.txId);
      if (!snapshot) {
        return res.status(404).json({ error: 'Snapshot not found' });
      }
      return res.json(snapshot);
    });

    /**
     * Get audit logs
     * GET /kernel/audit?limit=100
     */
    this.router.get('/audit', (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = this.kernel.getAuditLogs(limit);
      return res.json({ logs, count: logs.length });
    });

    /**
     * Get event history
     * GET /kernel/events?limit=100
     */
    this.router.get('/events', (req: Request, res: Response) => {
      const limit = parseInt(req.query.limit as string) || 100;
      const events = eventBus.getHistory(limit);
      return res.json({ events, count: events.length });
    });

    /**
     * Get kernel stats
     * GET /kernel/stats
     */
    this.router.get('/stats', (req: Request, res: Response) => {
      const stats = this.kernel.getStats();
      return res.json(stats);
    });

    /**
     * Subscribe to events (Server-Sent Events)
     * GET /kernel/subscribe?eventType=*
     */
    this.router.get('/subscribe', (req: Request, res: Response) => {
      const eventType = (req.query.eventType as string) || '*';

      // Setup SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send initial connection event
      res.write(`data: ${JSON.stringify({ type: 'CONNECTED', eventType })}\n\n`);

      // Subscribe to events
      const handler = (event: any) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      };

      eventBus.on(eventType, handler);

      // Cleanup on disconnect
      req.on('close', () => {
        eventBus.off(eventType, handler);
        console.log(`[KernelIntegration] Client disconnected from ${eventType}`);
      });
    });

    console.log('[KernelIntegration] Routes setup complete');
  }

  /**
   * Register AI tool
   */
  registerTool(name: string, executor: (params: any) => Promise<any>): void {
    this.kernel.registerTool(name, executor);
    console.log(`[KernelIntegration] Tool registered: ${name}`);
  }

  /**
   * Execute action with AI tool
   */
  async executeAction(
    tool: string,
    params: any,
    context: any = {}
  ): Promise<any> {
    const action: ActionRecord = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tool,
      params,
      status: 'pending',
      createdAt: Date.now()
    };

    const results = await this.kernel.execute([action], context, {
      captureState: this.config.enableStateCapture,
      auditLog: this.config.enableAudit
    });

    return results[0];
  }

  /**
   * Setup event listeners
   */
  onEvent(eventType: string, handler: (event: any) => void): void {
    eventBus.on(eventType, handler);
  }

  /**
   * Wait for event
   */
  waitForEvent(eventType: string, timeout?: number): Promise<any> {
    return eventBus.waitFor(eventType, timeout);
  }

  /**
   * Setup periodic cleanup
   */
  private setupCleanup(): void {
    if (this.config.cleanupInterval) {
      this.cleanupTimer = setInterval(() => {
        this.kernel.cleanup(this.config.cleanupInterval);
        console.log('[KernelIntegration] Cleanup executed');
      }, this.config.cleanupInterval);
    }
  }

  /**
   * Get Express router
   */
  getRouter(): Router {
    return this.router;
  }

  /**
   * Get kernel instance
   */
  getKernel(): ExecutionKernel {
    return this.kernel;
  }

  /**
   * Dispose
   */
  dispose(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    eventBus.dispose();
    console.log('[KernelIntegration] Disposed');
  }
}

// Export factory function
export function createKernelIntegration(
  kernel: ExecutionKernel,
  config?: KernelIntegrationConfig
): KernelIntegration {
  return new KernelIntegration(kernel, config);
}
