/**
 * Business Brain - Express API Integration
 * REST endpoints for business intelligence operations
 */

import express, { Express, Request, Response, Router } from 'express';
import { businessBrain, BusinessContext, BusinessDecision } from './business-brain';
import { getAllBusinessRules } from './rules';
import { logger } from '../execution-kernel';

declare global {
  namespace Express {
    interface Request {
      businessContext: BusinessContext;
    }
  }
}

/**
 * Create Business Brain Router
 */
export function createBusinessBrainRouter(): Router {
  const router = express.Router();

  // ============================================================
  // BUSINESS DECISION ENDPOINTS
  // ============================================================

  /**
   * POST /make-decision
   * Analyze situation and make business decision
   */
  router.post('/make-decision', async (req: Request, res: Response) => {
    try {
      const { situation, ruleFilter } = req.body;
      const context = req.businessContext;

      if (!situation) {
        return res.status(400).json({ error: 'Situation data required' });
      }

      logger.info('BusinessBrainAPI', 'Making decision', { situation });

      const decision = await businessBrain.makeDecision(situation, context);

      res.json({
        decision,
        kernelStats: executionKernel.getStats()
      });
    } catch (error) {
      logger.error('BusinessBrainAPI', 'Decision making failed', error as Error);
      res.status(500).json({
        error: 'Decision making failed',
        message: (error as Error).message
      });
    }
  });

  /**
   * POST /execute-decision
   * Execute a business decision through execution kernel
   */
  router.post('/execute-decision', async (req: Request, res: Response) => {
    try {
      const { decisionId } = req.body;
      const context = req.businessContext;

      const decisions = businessBrain.getDecisions(1000);
      const decision = decisions.find((d) => d.id === decisionId);

      if (!decision) {
        return res.status(404).json({ error: 'Decision not found' });
      }

      logger.info('BusinessBrainAPI', `Executing decision: ${decision.type}`, { decisionId });

      const results = await businessBrain.executeDecision(decision, context);

      res.json({
        success: true,
        results,
        transactionCount: results.length
      });
    } catch (error) {
      logger.error('BusinessBrainAPI', 'Decision execution failed', error as Error);
      res.status(500).json({
        error: 'Decision execution failed',
        message: (error as Error).message
      });
    }
  });

  /**
   * POST /analyze
   * Comprehensive business analysis
   */
  router.post('/analyze', async (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      const context = req.businessContext;

      logger.info('BusinessBrainAPI', 'Running analysis', { context });

      // Analyze with multiple business rules
      const decisions: BusinessDecision[] = [];

      // This would typically run multiple analyses
      // For now, we'll return a placeholder

      res.json({
        analysis: {
          timestamp: Date.now(),
          context,
          decisions
        }
      });
    } catch (error) {
      logger.error('BusinessBrainAPI', 'Analysis failed', error as Error);
      res.status(500).json({
        error: 'Analysis failed',
        message: (error as Error).message
      });
    }
  });

  // ============================================================
  // RULE MANAGEMENT ENDPOINTS
  // ============================================================

  /**
   * GET /rules
   * List all registered rules
   */
  router.get('/rules', (req: Request, res: Response) => {
    const stats = businessBrain.getStats();
    res.json({
      totalRules: stats.totalRules,
      enabledRules: stats.enabledRules,
      status: 'Rules configured and ready'
    });
  });

  /**
   * POST /rules/initialize
   * Initialize default business rules
   */
  router.post('/rules/initialize', (req: Request, res: Response) => {
    try {
      const rules = getAllBusinessRules();
      businessBrain.registerRules(rules);

      logger.info('BusinessBrainAPI', `Initialized ${rules.length} rules`);

      res.json({
        success: true,
        rulesInitialized: rules.length,
        message: `Loaded ${rules.length} business rules`
      });
    } catch (error) {
      logger.error('BusinessBrainAPI', 'Rule initialization failed', error as Error);
      res.status(500).json({
        error: 'Rule initialization failed',
        message: (error as Error).message
      });
    }
  });

  // ============================================================
  // METRICS ENDPOINTS
  // ============================================================

  /**
   * GET /metrics
   * Get store metrics
   */
  router.get('/metrics', (req: Request, res: Response) => {
    try {
      const context = req.businessContext;
      const metrics = businessBrain.getMetrics(context);

      res.json({
        metrics: metrics || {},
        context
      });
    } catch (error) {
      logger.error('BusinessBrainAPI', 'Metrics retrieval failed', error as Error);
      res.status(500).json({
        error: 'Metrics retrieval failed',
        message: (error as Error).message
      });
    }
  });

  /**
   * PUT /metrics
   * Update store metrics
   */
  router.put('/metrics', (req: Request, res: Response) => {
    try {
      const context = req.businessContext;
      const { metrics } = req.body;

      if (!metrics) {
        return res.status(400).json({ error: 'Metrics data required' });
      }

      businessBrain.updateMetrics(context, metrics);

      res.json({
        success: true,
        message: 'Metrics updated',
        metrics
      });
    } catch (error) {
      logger.error('BusinessBrainAPI', 'Metrics update failed', error as Error);
      res.status(500).json({
        error: 'Metrics update failed',
        message: (error as Error).message
      });
    }
  });

  // ============================================================
  // HISTORY & ANALYTICS ENDPOINTS
  // ============================================================

  /**
   * GET /decisions
   * Get decision history
   */
  router.get('/decisions', (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const decisions = businessBrain.getDecisions(limit);

      res.json({
        decisions,
        count: decisions.length
      });
    } catch (error) {
      logger.error('BusinessBrainAPI', 'Decision history retrieval failed', error as Error);
      res.status(500).json({
        error: 'Decision history retrieval failed',
        message: (error as Error).message
      });
    }
  });

  /**
   * GET /stats
   * Get brain statistics
   */
  router.get('/stats', (req: Request, res: Response) => {
    try {
      const stats = businessBrain.getStats();
      res.json(stats);
    } catch (error) {
      logger.error('BusinessBrainAPI', 'Stats retrieval failed', error as Error);
      res.status(500).json({
        error: 'Stats retrieval failed',
        message: (error as Error).message
      });
    }
  });

  return router;
}

/**
 * Setup Business Brain middleware
 */
export function setupBusinessBrainMiddleware(app: Express): void {
  // Extract context from headers
  app.use((req: Request, res: Response, next: Function) => {
    req.businessContext = {
      tenantId: req.headers['x-tenant-id'] as string,
      storeId: req.headers['x-store-id'] as string,
      userId: req.headers['x-user-id'] as string,
      metadata: {
        path: req.path,
        method: req.method
      }
    };

    if (!req.businessContext.tenantId || !req.businessContext.storeId) {
      return res.status(400).json({
        error: 'Missing required headers',
        required: ['x-tenant-id', 'x-store-id']
      });
    }

    next();
  });
}

/**
 * Mount Business Brain routes
 */
export function mountBusinessBrainRoutes(app: Express): void {
  setupBusinessBrainMiddleware(app);
  const router = createBusinessBrainRouter();
  app.use('/api/business-brain', router);
  console.log('✅ Business Brain routes mounted at /api/business-brain');
}

// Import for convenience
import { executionKernel } from '../execution-kernel';
