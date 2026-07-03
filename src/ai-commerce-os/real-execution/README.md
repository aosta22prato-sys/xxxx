# AI Commerce OS - Real Execution System 用户指南

## 📋 系统概述

Real Execution System 是 AI Commerce OS 的核心执行引擎，它将 AI 的思考转化为真实的业务操作。

### 核心架构

```
         AI Goal
            ↓
    ┌─────────────────┐
    │  State Observer │ ← 读取当前业务状态
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │   Planner       │ ← 生成执行计划
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │  Safety Guard   │ ← 安全检查
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │   Executor      │ ← 执行动作（真实业务操作）
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │   Evaluator     │ ← 评估执行结果
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │   Learning      │ ← 学习和记忆
    └────────┬────────┘
             ↓
         下一周期
```

---

## 🚀 快速开始

### 1. 导入模块

```typescript
import { RealExecutionSystem, createMockContext } from './real-execution';

// 或者分别导入
import { realExecutionEngine } from './real-execution/execution-engine-real';
import { toolRegistry } from './real-execution/tool-registry';
```

### 2. 创建执行上下文

```typescript
import { createMockContext } from './real-execution/mock-implementation';

const ctx = createMockContext('my-store-id', 'my-tenant-id');
```

### 3. 执行单个循环

```typescript
const goal = {
  type: 'increase-revenue',
  description: '增加本月收入20%',
};

const result = await realExecutionEngine.runFullCycle(ctx, goal);

console.log(result.evaluation.overallScore); // 0-100 分
console.log(result.evaluation.overallImpact); // excellent/good/neutral/poor/harmful
```

### 4. 启动自主循环

```typescript
// 每5分钟执行一次
await realExecutionEngine.startAutonomousLoop(ctx, goal, 5);

// 获取状态
const status = realExecutionEngine.getStatus();
console.log(status.isRunning); // true

// 停止循环
realExecutionEngine.stopAutonomousLoop();
```

---

## 🛠️ 核心组件

### Tool Registry (工具注册表)

管理所有可用的业务工具。

```typescript
import { toolRegistry } from './real-execution/tool-registry';

// 获取所有工具
const tools = toolRegistry.getAllTools();

// 按分类获取工具
const productTools = toolRegistry.getToolsByCategory('product');

// 搜索工具
const searchResults = toolRegistry.searchTools('price');

// 执行工具
const result = await toolRegistry.executeTool(ctx, 'updatePrice', {
  productId: 'prod-1',
  newPrice: 99.99,
});
```

### Safety Guard (安全守卫)

在执行前验证动作的安全性。

```typescript
import { safetyGuard } from './real-execution/safety-guard';

// 验证单个动作
const validation = await safetyGuard.validate(action, currentState);

if (!validation.allowed) {
  console.log(`被阻止: ${validation.reason}`);
}

// 验证批量动作
const validations = await safetyGuard.validateBatch(actions, currentState);

// 获取安全统计
const stats = safetyGuard.getStats();
console.log(`安全评分: ${stats.safetyScore}%`);
```

### Result Evaluator (结果评估器)

评估执行动作对业务的影响。

```typescript
import { resultEvaluator } from './real-execution/result-evaluator';

// 评估单个动作
const evaluation = resultEvaluator.evaluateAction(
  'updatePrice',
  oldState,
  newState
);

// 评估完整循环
const cycleEvaluation = resultEvaluator.evaluateCycle(
  actionResults,
  oldState,
  newState
);

// 获取摘要
const summary = resultEvaluator.getSummary(cycleEvaluation);
```

### Business State Observer (业务状态观察器)

实时读取完整的业务状态。

```typescript
import { businessStateObserver } from './real-execution/business-state-observer';

// 获取当前业务状态
const state = await businessStateObserver.observeBusinessState(ctx);

console.log(state.revenue.monthly); // 本月收入
console.log(state.profit.margin); // 利润率
console.log(state.inventory.totalUnits); // 库存数量
console.log(state.orders.totalCount); // 订单总数
console.log(state.marketing.adsROI); // 广告ROI
```

---

## 📊 支持的目标类型

### 1. increase-revenue (增加收入)

```typescript
const goal = {
  type: 'increase-revenue',
  description: '增加本月收入20%',
  target: 15000,
};
```

**执行的动作：**
- 分析销售数据
- 优化广告投放
- 调整价格
- 分析客户行为

### 2. increase-profit (增加利润)

```typescript
const goal = {
  type: 'increase-profit',
  description: '提升利润率到35%',
  targetMargin: 35,
};
```

**执行的动作：**
- 计算利润率
- 调整价格
- 暂停低效广告
- 优化库存

### 3. reduce-inventory (减少库存)

```typescript
const goal = {
  type: 'reduce-inventory',
  description: '降低库存成本',
  targetLevel: 50,
};
```

**执行的动作：**
- 触发低库存警报
- 预测库存需求
- 优化库存水位

---

## 🛡️ 安全规则

系统包含以下默认安全规则：

| 规则 | 限制 | 影响 |
|------|------|------|
| MAX_REFUND_AMOUNT | 单笔退款 ≤ 5万 | Block |
| PRICE_CHANGE_LIMIT | 价格变化 ≤ 50% | Warn |
| AD_BUDGET_DAILY_LIMIT | 日预算 ≤ 1万 | Warn |
| BATCH_OPERATION_SIZE | 批量操作 ≤ 1000条 | Block |
| CRITICAL_TIME_CHECK | 工作时间外 | Block |

### 添加自定义规则

```typescript
safetyGuard.addRule({
  name: 'CUSTOM_RULE',
  condition: async (action) => {
    if (action.tool === 'myTool') {
      return action.params.amount < 1000;
    }
    return true;
  },
  impact: 'block',
  message: 'Amount exceeds custom limit',
});
```

---

## 📈 执行结果格式

```typescript
interface ExecutionLog {
  cycleId: string;              // 循环ID
  goal: string;                 // 目标描述
  timestamp: number;            // 执行时间戳
  oldState: BusinessState;      // 执行前的业务状态
  newState: BusinessState;      // 执行后的业务状态
  actionsExecuted: number;      // 执行的动作数
  successCount: number;         // 成功的动作数
  evaluation: CycleEvaluation;  // 完整的评估结果
  duration: number;             // 耗时（毫秒）
}

interface CycleEvaluation {
  totalActions: number;         // 总动作数
  successActions: number;       // 成功动作数
  successRate: number;          // 成功率
  overallDelta: PerformanceDelta; // 性能变化
  overallImpact: string;        // 总体影响
  overallScore: number;         // 评分 (0-100)
  learnings: string[];          // 关键学习
  nextSteps: string[];          // 下一步建议
}
```

---

## 🔍 调试和监控

### 获取执行历史

```typescript
const history = realExecutionEngine.getCycleHistory(10); // 获取最近10个循环

history.forEach((log) => {
  console.log(`${log.cycleId}: 评分 ${log.evaluation.overallScore}`);
});
```

### 获取系统状态

```typescript
const status = realExecutionEngine.getStatus();

console.log('当前运行状态:', status.isRunning);
console.log('完成循环数:', status.cyclesCompleted);
console.log('安全统计:', status.safety);
console.log('最近执行:', status.recentCycles);
```

### 查看安全日志

```typescript
const logs = safetyGuard.getLog(50); // 获取最近50条日志

logs.forEach((log) => {
  console.log(`${log.actionId}: ${log.result.riskLevel}`);
});
```

---

## 🚀 生产环境配置

### 替换 Mock 实现

在 `createMockContext` 中，将 Mock 对象替换为真实实现：

```typescript
export function createProductionContext(
  storeId: string,
  tenantId: string
): ExecutionContext {
  return {
    db: new RealPostgresDatabase(), // 真实 PostgreSQL
    api: new RealExternalAPI(),      // 真实 API 调用
    eventBus: new RealEventBus(),    // 真实事件总线
    executionId: `exec-${Date.now()}`,
    executionTime: Date.now(),
    storeId,
    tenantId,
    log: (message: string, data?: any) => {
      logger.info(`[${storeId}] ${message}`, data);
    },
    error: (message: string, error?: any) => {
      logger.error(`[${storeId}] ${message}`, error);
    },
  };
}
```

---

## 📝 示例：完整流程

```typescript
import { realExecutionEngine, createMockContext } from './real-execution';

async function example() {
  // 1. 创建上下文
  const ctx = createMockContext('my-store', 'my-tenant');

  // 2. 定义目标
  const goal = {
    type: 'increase-revenue',
    description: '在本月内增加收入25%',
  };

  // 3. 执行单个循环
  const result = await realExecutionEngine.runFullCycle(ctx, goal);

  console.log('执行结果:', {
    评分: result.evaluation.overallScore,
    状态: result.evaluation.overallImpact,
    收入变化: result.evaluation.overallDelta.revenue,
    利润变化: result.evaluation.overallDelta.profit,
  });

  // 4. 或者启动自主循环
  await realExecutionEngine.startAutonomousLoop(ctx, goal, 5);

  // ... 让循环运行一段时间 ...

  realExecutionEngine.stopAutonomousLoop();
}
```

---

## 📞 常见问题

**Q: 如何添加新工具？**
A: 在 `tools-*.ts` 文件中创建新的 Tool 对象，然后在 `tool-registry.ts` 中注册。

**Q: 如何修改安全规则？**
A: 在 `safety-guard.ts` 的 `initializeRules()` 方法中添加或修改规则。

**Q: 如何处理执行失败？**
A: 系统会自动记录失败，并在结果评估中反映。查看 `evaluation.overallImpact` 了解失败情况。

**Q: 如何集成真实数据库？**
A: 创建实现 `Database` 接口的类，替换 `MockDatabase`。

---

## 🎯 下一步

- [ ] 集成真实数据库 (PostgreSQL)
- [ ] 集成 LLM 进行动态规划
- [ ] 添加更多业务工具
- [ ] 实现 Reflection Engine
- [ ] 实现 Self Learning 系统
- [ ] 实现 Multi-Agent 协作

