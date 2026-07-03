# Execution Kernel - 生产级执行控制器

## 🎯 系统定位

**Execution Kernel** 是 AI Commerce OS 的"商业现实控制器"，将 AI 从简单的工具调用升级为事务级、可恢复、可追溯的商业执行系统。

```
┌─────────────────────────────────────────────────────┐
│ AI Commerce OS - 多智能体商业自治系统                   │
├─────────────────────────────────────────────────────┤
│ Execution Kernel (生产级执行底座)                      │
│ ├─ EventBus (系统神经网络)                            │
│ ├─ TransactionManager (事务管理)                      │
│ ├─ RecoveryEngine (恢复引擎)                          │
│ ├─ AIToolRegistry (工具注册)                          │
│ └─ KernelIntegration (Express 集成)                   │
├─────────────────────────────────────────────────────┤
│ 核心特性: 事务控制 | 事件驱动 | 故障恢复 | 多租户隔离      │
└─────────────────────────────────────────────────────┘
```

## 🏗️ 核心组件

### 1. EventBus（系统神经网络）
- **作用**：解耦的事件发布/订阅系统
- **特性**：
  - 事件历史记录（最多10,000条）
  - 异步/同步发送
  - Promise-based 事件等待
  - 通配符监听

**使用示例**：
```typescript
import { eventBus } from './execution-kernel';

// 监听事件
eventBus.on('ACTION_SUCCESS', (event) => {
  console.log('Action succeeded:', event.payload);
});

// 发送事件
eventBus.emit({
  type: 'CUSTOM_EVENT',
  payload: { data: 'value' },
  timestamp: Date.now()
});

// 等待特定事件
const event = await eventBus.waitFor('TX_COMMITTED', 5000);
```

### 2. TransactionManager（事务管理器）
- **作用**：管理事务生命周期
- **事务状态**：`pending` → `committed` / `rolled_back` / `compensating`
- **职责**：
  - 事务的开始、提交、回滚
  - 动作的添加和状态更新
  - 事务超时管理

**使用示例**：
```typescript
import { TransactionManager } from './execution-kernel';

const txManager = new TransactionManager(eventBus);

// 开始事务
const tx = txManager.begin('tenant_001', 'store_001', { userId: 'user_123' });

// 添加动作
txManager.addAction(tx.id, {
  id: 'action_1',
  tool: 'inventory.reserve',
  params: { skuId: 'SKU001', quantity: 10 },
  status: 'pending',
  createdAt: Date.now()
});

// 提交事务
txManager.commit(tx.id);
```

### 3. RecoveryEngine（恢复引擎）
- **作用**：智能错误恢复和故障处理
- **错误分类**：
  - `NETWORK`：网络错误 → 重试
  - `PARTIAL`：部分执行 → 补偿
  - `BUSINESS_CONFLICT`：业务冲突 → 重新规划
  - `VALIDATION`：验证错误 → 升级
- **恢复策略**：retry | compensate | replan | escalate

**使用示例**：
```typescript
import { RecoveryEngine } from './execution-kernel';

const recoveryEngine = new RecoveryEngine(eventBus);

// 分析错误并创建恢复计划
const plan = recoveryEngine.recover(action, new Error('Network timeout'));

// 执行重试
if (plan.retry?.enabled) {
  const result = await recoveryEngine.executeRetry(action, plan, executor);
}

// 执行补偿
if (plan.compensate?.enabled) {
  await recoveryEngine.executeCompensation(action.id, plan.compensate.actions);
}
```

### 4. ExecutionKernel（核心执行器）
- **作用**：协调整个执行流程
- **职责**：
  - 注册工具
  - 执行动作计划
  - 管理事务和恢复
  - 捕获状态快照
  - 审计日志记录

**使用示例**：
```typescript
import { executionKernel } from './execution-kernel';

// 注册工具
executionKernel.registerTool('inventory.reserve', async (params) => {
  return { reserved: params.quantity };
});

// 执行动作计划
const results = await executionKernel.execute(
  [
    {
      id: 'action_1',
      tool: 'inventory.reserve',
      params: { skuId: 'SKU001', quantity: 10 },
      status: 'pending',
      createdAt: Date.now()
    }
  ],
  {
    tenantId: 'tenant_001',
    storeId: 'store_001',
    userId: 'user_123'
  },
  {
    parallel: false,
    timeout: 60000,
    captureState: true,
    auditLog: true
  }
);
```

### 5. AIToolRegistry（工具注册表）
- **作用**：管理所有商业工具的注册和执行
- **特性**：
  - 工具注册和发现
  - 补偿操作绑定
  - 工具元数据管理
  - 预定义商业工具集

**预定义工具**：
```
- inventory.reserve / inventory.reserve_rollback
- payment.process / payment.process_rollback
- logistics.ship / logistics.ship_rollback
- notification.send
```

**使用示例**：
```typescript
import { AIToolRegistry, createCommerceToolSuite } from './execution-kernel';

const registry = new AIToolRegistry(executionKernel);

// 注册商业工具套件
const tools = createCommerceToolSuite();
registry.registerTools(tools);

// 执行工具
const result = await registry.executeTool(
  'inventory.reserve',
  { skuId: 'SKU001', quantity: 10, orderId: 'ORD123' },
  { tenantId: 'tenant_001', storeId: 'store_001' }
);
```

### 6. KernelIntegration（Express 集成）
- **作用**：将 Kernel 集成到 Express 应用
- **提供**：
  - RESTful API 端点
  - Server-Sent Events (SSE) 支持
  - 工具执行接口

**Express 路由**：
```
POST   /kernel/execute              - 执行动作计划
GET    /kernel/transaction/:txId    - 获取事务
GET    /kernel/snapshot/:txId       - 获取状态快照
GET    /kernel/audit?limit=100      - 获取审计日志
GET    /kernel/events?limit=100     - 获取事件历史
GET    /kernel/stats                - 获取内核统计
GET    /kernel/subscribe?eventType=* - SSE 事件订阅
```

**使用示例**：
```typescript
import express from 'express';
import { executionKernel, createKernelIntegration } from './execution-kernel';

const app = express();
const integration = createKernelIntegration(executionKernel);

// 挂载内核路由
app.use('/api', integration.getRouter());

// 执行工具
integration.registerTool('my.tool', async (params) => {
  return { result: 'success' };
});
```

## 📋 执行流程

### 标准执行流程（成功路径）

```
1. begin(txId) → TX_BEGIN
   ↓
2. addAction(actionId) → ACTION_ADDED
   ↓
3. [for each action]:
   - execute(tool, params) → ACTION_EXECUTING
   - ✓ success → ACTION_SUCCESS
   ↓
4. commit(txId) → TX_COMMITTED
   ↓
5. captureSnapshot(txId) → STATE_SNAPSHOT_CAPTURED
   ↓
6. logAudit(entry) → AUDIT_LOG_CREATED
```

### 故障恢复流程

```
execute(tool, params)
  ↓
  ✗ Error
    ↓
    recover(action, error)
    ↓
    ┌─ NETWORK: retry → execute again
    ├─ PARTIAL: compensate → rollback
    ├─ CONFLICT: replan → human review
    └─ VALIDATION: escalate → alert
    ↓
    [if recovery successful] → ACTION_SUCCESS
    [if recovery failed] → ACTION_FAILED
    ↓
beginCompensation(txId)
  ↓
[execute compensation actions in reverse]
  ↓
rollback(txId) → TX_ROLLED_BACK
```

## 🔌 集成步骤

### 1. 初始化内核

```typescript
import { initializeKernel } from './execution-kernel/kernel-examples';

const { executionKernel, eventBus, toolRegistry, kernelIntegration } = 
  initializeKernel();
```

### 2. 在 Express 中挂载

```typescript
import express from 'express';
import { createKernelIntegration, executionKernel } from './execution-kernel';

const app = express();
const integration = createKernelIntegration(executionKernel, {
  enableAudit: true,
  enableStateCapture: true,
  parallelExecution: false,
  actionTimeout: 60000
});

app.use('/api/kernel', integration.getRouter());
app.listen(3000);
```

### 3. 在 AI 代理中使用

```typescript
import { executionKernel } from './execution-kernel';

// 在 AI 代理的工具调用中
const result = await executionKernel.execute(
  [
    {
      id: 'action_from_ai',
      tool: toolName,
      params: toolParams,
      status: 'pending',
      createdAt: Date.now()
    }
  ],
  {
    tenantId: req.headers['x-tenant-id'],
    storeId: req.headers['x-store-id'],
    userId: req.user.id
  }
);
```

## 📊 监控和调试

### 事件监听

```typescript
// 监听所有事件
eventBus.on('*', (event) => {
  console.log(`Event: ${event.type}`, event.payload);
});

// 监听特定事件
eventBus.on('EXECUTION_SUCCESS', (event) => {
  console.log(`✓ Execution ${event.txId} succeeded in ${event.payload.duration}ms`);
});

eventBus.on('ACTION_FAILED', (event) => {
  console.log(`✗ Action ${event.payload.actionId} failed: ${event.payload.error}`);
});
```

### 查询内核状态

```typescript
// 获取统计信息
const stats = executionKernel.getStats();
console.log(stats);
// {
//   totalTransactions: 150,
//   activeTransactions: 2,
//   committedTransactions: 140,
//   rolledBackTransactions: 8,
//   registeredTools: 10,
//   stateSnapshots: 150,
//   auditLogs: 5000
// }

// 获取审计日志
const logs = executionKernel.getAuditLogs(100);

// 获取事件历史
const events = eventBus.getHistory(50);

// 查询事务
const tx = executionKernel.getTransaction('tx_id');

// 查询状态快照
const snapshot = executionKernel.getStateSnapshot('tx_id');
```

## 🔒 多租户隔离

所有操作都严格隔离到 `tenant_id` 和 `store_id`：

```typescript
const context = {
  tenantId: 'tenant_001',      // 必须
  storeId: 'store_001',        // 必须
  userId: 'user_123',
  metadata: { orderId: 'ORD123' }
};

const results = await executionKernel.execute(actions, context);
```

## 📈 性能考虑

- **EventBus 历史**：最多 10,000 条事件，超过自动删除最早的
- **审计日志**：最多 100,000 条，超过自动删除最早的
- **自动清理**：默认每小时清理 1 小时前完成的事务
- **并行执行**：支持并行执行多个动作，使用 `options.parallel = true`

## 📚 完整示例

见 `kernel-examples.ts`：
- `exampleSimpleOrderFlow()` - 简单订单流程
- `exampleParallelExecution()` - 并行执行
- `exampleEventMonitoring()` - 事件监控
- `exampleAuditLogging()` - 审计日志
- `exampleExpressIntegration()` - Express 集成

## 🚀 下一步

- [ ] 持久化存储（数据库集成）
- [ ] 分布式事务支持
- [ ] 高级恢复策略（Saga 模式）
- [ ] 性能优化（缓存、索引）
- [ ] 监控面板
