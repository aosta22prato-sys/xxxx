/**
 * Real Execution System API 端点
 * 
 * 将 AI Commerce OS Real Execution System 暴露为 REST API
 * 真实的、可调用的、生产级别的端点
 */

import { Router, Request, Response } from 'express';
import {
  RealExecutionSystem,
  realExecutionEngine,
  businessStateObserver,
  safetyGuard,
  resultEvaluator,
  toolRegistry,
} from '../ai-commerce-os/real-execution';
import { createMockContext } from '../ai-commerce-os/real-execution/mock-implementation';

export const realExecutionRouter = Router();

// ============================================
// 中间件：创建执行上下文
// ============================================
const createExecutionContext = (req: Request) => {
  const storeId = (req.query.store_id as string) || 'default-store';
  const tenantId = (req.query.tenant_id as string) || 'default-tenant';
  
  // 生产环境应该使用真实的数据库和API
  // 这里使用Mock用于演示
  return createMockContext(storeId, tenantId);
};

// ============================================
// API 1: 系统状态
// ============================================
realExecutionRouter.get('/status', (_req: Request, res: Response) => {
  try {
    const status = RealExecutionSystem.getStatus();
    res.json({
      success: true,
      data: {
        tools: {
          registered: status.tools,
          description: '已注册的工具数量',
        },
        safety: {
          totalRules: status.safety.totalRules,
          validations: status.safety.validationCount,
          blocked: status.safety.blockedCount,
        },
        execution: {
          cyclesCompleted: status.execution.cyclesCompleted,
          isRunning: status.execution.isRunning,
          avgDuration: status.execution.avgDuration,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `系统状态获取失败: ${error}`,
    });
  }
});

// ============================================
// API 2: 获取工具列表
// ============================================
realExecutionRouter.get('/tools', (_req: Request, res: Response) => {
  try {
    const tools = toolRegistry.getToolList();
    
    // 按分类组织
    const grouped: { [key: string]: typeof tools } = {};
    for (const tool of tools) {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    }
    
    res.json({
      success: true,
      data: {
        total: tools.length,
        byCategory: Object.entries(grouped).map(([category, items]) => ({
          category,
          count: items.length,
          tools: items.map(t => ({
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          })),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `获取工具列表失败: ${error}`,
    });
  }
});

// ============================================
// API 3: 读取业务状态
// ============================================
realExecutionRouter.get('/business-state', async (req: Request, res: Response) => {
  try {
    const ctx = createExecutionContext(req);
    const state = await businessStateObserver.observeBusinessState(ctx);
    
    res.json({
      success: true,
      data: {
        revenue: state.revenue,
        profit: state.profit,
        inventory: state.inventory,
        customers: state.customers,
        orders: state.orders,
        marketing: state.marketing,
        logistics: state.logistics,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `业务状态读取失败: ${error}`,
    });
  }
});

// ============================================
// API 4: 执行单个循环
// ============================================
realExecutionRouter.post('/execute-cycle', async (req: Request, res: Response) => {
  try {
    const { goal } = req.body;
    
    if (!goal || !goal.type) {
      return res.status(400).json({
        success: false,
        error: '缺少 goal 参数，应包含 type 和 description',
      });
    }
    
    // 验证目标类型
    if (!['increase-revenue', 'increase-profit', 'reduce-inventory'].includes(goal.type)) {
      return res.status(400).json({
        success: false,
        error: '不支持的目标类型',
      });
    }
    
    const ctx = createExecutionContext(req);
    
    // 记录执行开始
    const startTime = Date.now();
    
    // 执行循环
    const result = await realExecutionEngine.runFullCycle(ctx, goal);
    
    const duration = Date.now() - startTime;
    
    res.json({
      success: true,
      data: {
        cycleId: result.cycleId,
        goal: goal.type,
        duration: `${duration}ms`,
        actionsExecuted: result.actionsExecuted,
        successCount: result.successCount,
        evaluation: {
          score: result.evaluation.overallScore,
          impact: result.evaluation.overallImpact,
          delta: result.evaluation.performanceDelta,
          learnings: result.evaluation.learnings?.slice(0, 5) || [],
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `执行循环失败: ${error}`,
    });
  }
});

// ============================================
// API 5: 启动自主循环
// ============================================
realExecutionRouter.post('/start-autonomous', async (req: Request, res: Response) => {
  try {
    const { goal, interval } = req.body;
    
    if (!goal || !goal.type) {
      return res.status(400).json({
        success: false,
        error: '缺少 goal 参数',
      });
    }
    
    const ctx = createExecutionContext(req);
    const intervalMinutes = interval || 5;
    
    await realExecutionEngine.startAutonomousLoop(ctx, goal, intervalMinutes);
    
    res.json({
      success: true,
      data: {
        message: `自主循环已启动，间隔: ${intervalMinutes}分钟`,
        goal: goal.type,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `启动自主循环失败: ${error}`,
    });
  }
});

// ============================================
// API 6: 停止自主循环
// ============================================
realExecutionRouter.post('/stop-autonomous', (_req: Request, res: Response) => {
  try {
    realExecutionEngine.stopAutonomousLoop();
    
    res.json({
      success: true,
      data: {
        message: '自主循环已停止',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `停止自主循环失败: ${error}`,
    });
  }
});

// ============================================
// API 7: 检查安全性
// ============================================
realExecutionRouter.post('/validate-action', async (req: Request, res: Response) => {
  try {
    const { action } = req.body;
    
    if (!action) {
      return res.status(400).json({
        success: false,
        error: '缺少 action 参数',
      });
    }
    
    const ctx = createExecutionContext(req);
    const state = await businessStateObserver.observeBusinessState(ctx);
    
    const validation = await safetyGuard.validate(action, state);
    
    res.json({
      success: true,
      data: {
        isValid: validation.isValid,
        reason: validation.reason,
        severity: validation.severity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `动作验证失败: ${error}`,
    });
  }
});

// ============================================
// API 8: 安全统计
// ============================================
realExecutionRouter.get('/safety-stats', (_req: Request, res: Response) => {
  try {
    const stats = safetyGuard.getStats();
    
    res.json({
      success: true,
      data: {
        totalRules: stats.totalRules,
        validationCount: stats.validationCount,
        blockedCount: stats.blockedCount,
        warningCount: stats.warningCount,
        blockRate: stats.blockRate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `获取安全统计失败: ${error}`,
    });
  }
});

// ============================================
// API 9: 执行历史
// ============================================
realExecutionRouter.get('/execution-history', (_req: Request, res: Response) => {
  try {
    const status = realExecutionEngine.getStatus();
    
    res.json({
      success: true,
      data: {
        cyclesCompleted: status.cyclesCompleted,
        isRunning: status.isRunning,
        avgDuration: status.avgDuration,
        recentCycles: status.recentCycles || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `获取执行历史失败: ${error}`,
    });
  }
});

// ============================================
// API 10: 完整演示
// ============================================
realExecutionRouter.post('/run-demo', async (req: Request, res: Response) => {
  try {
    const ctx = createExecutionContext(req);
    
    const scenarios = [
      { goal: { type: 'increase-revenue', description: '增加收入' }, name: '收入增长' },
      { goal: { type: 'increase-profit', description: '增加利润' }, name: '利润增长' },
      { goal: { type: 'reduce-inventory', description: '减少库存' }, name: '库存优化' },
    ];
    
    const results = [];
    
    for (const scenario of scenarios) {
      const result = await realExecutionEngine.runFullCycle(ctx, scenario.goal);
      results.push({
        scenario: scenario.name,
        score: result.evaluation.overallScore,
        impact: result.evaluation.overallImpact,
        actions: result.actionsExecuted,
      });
    }
    
    res.json({
      success: true,
      data: {
        message: '演示执行完成',
        scenarios: results,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `演示执行失败: ${error}`,
    });
  }
});

// ============================================
// API 文档
// ============================================
realExecutionRouter.get('/docs', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      title: 'AI Commerce OS - Real Execution System API',
      version: '1.0',
      baseUrl: '/api/real-execution',
      endpoints: [
        {
          method: 'GET',
          path: '/status',
          description: '获取系统状态',
        },
        {
          method: 'GET',
          path: '/tools',
          description: '获取所有工具列表',
        },
        {
          method: 'GET',
          path: '/business-state',
          description: '读取当前业务状态',
        },
        {
          method: 'POST',
          path: '/execute-cycle',
          description: '执行单个完整循环',
          body: { goal: { type: 'increase-revenue | increase-profit | reduce-inventory', description: '目标描述' } },
        },
        {
          method: 'POST',
          path: '/start-autonomous',
          description: '启动自主循环',
          body: { goal: { type: 'increase-revenue', description: '...' }, interval: 5 },
        },
        {
          method: 'POST',
          path: '/stop-autonomous',
          description: '停止自主循环',
        },
        {
          method: 'POST',
          path: '/validate-action',
          description: '检查动作是否安全',
          body: { action: { toolName: '...', parameters: {} } },
        },
        {
          method: 'GET',
          path: '/safety-stats',
          description: '获取安全统计',
        },
        {
          method: 'GET',
          path: '/execution-history',
          description: '获取执行历史',
        },
        {
          method: 'POST',
          path: '/run-demo',
          description: '运行完整演示',
        },
        {
          method: 'GET',
          path: '/docs',
          description: 'API 文档',
        },
      ],
      queryParams: {
        store_id: '店铺ID (可选，默认: default-store)',
        tenant_id: '租户ID (可选，默认: default-tenant)',
      },
    },
  });
});

export default realExecutionRouter;
