# Execution Kernel - 快速参考

## 🚀 初始化

```typescript
import { initializeKernel } from './execution-kernel/kernel-examples';

const { executionKernel, eventBus, toolRegistry, kernelIntegration } = 
  initializeKernel();
```

## 📦 核心导入

```typescript
import {
  executionKernel,           // 核心执行器
  eventBus,                  // 事件总线
  EventBus,
  TransactionManager,
  RecoveryEngine,
  ExecutionKernel,
  AIToolRegistry,
  createKernelIntegration,
  // Types
  ActionRecord,
  ExecutionContext,
  Transaction,
  Event,
  ExecutionResult
} from './execution-kernel';
```

## 🔧 常见操作

### 1. 注册工具

```typescript
// 单个工具
executionKernel.registerTool('tool.name', async (params) => {
  // 实现
  return result;
});

// 工具注册表
const registry = new AIToolRegistry(executionKernel);
registry.registerTool({
  name: 'inventory.reserve',
  description: 'Reserve inventory',
  executor: async (params) => { ... },
  isCompensable: true,
  compensator: async (params) => { ... },
  timeout: 5000,
  retryable: true
});
```

### 2. 执行动作计划

```typescript
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
    userId: 'user_123',
    metadata: { orderId: 'ORD123' }
  },
  {
    parallel: false,        // 顺序执行
    timeout: 60000,        // 60秒超时
    captureState: true,    // 捕获状态快照
    auditLog: true         // 记录审计日志
  }
);

// 检查结果
results.forEach(r => {
  if (r.success) {
    console.log(`✓ ${r.actionId}: ${JSON.stringify(r.data)}`);
  } else {
    console.log(`✗ ${r.actionId}: ${r.error}`);
  }
});
```

### 3. 监听事件

```typescript
// 监听特定事件
eventBus.on('ACTION_SUCCESS', (event) => {
  console.log(`Action ${event.payload.actionId} succeeded`);
});

// 监听所有事件
eventBus.on('*', (event) => {
  console.log(`Event: ${event.type}`, event.payload);
});

// 等待事件
const event = await eventBus.waitFor('TX_COMMITTED', 5000);
```

### 4. 查询状态

```typescript
// 获取事务
const tx = executionKernel.getTransaction('tx_id');

// 获取状态快照
const snapshot = executionKernel.getStateSnapshot('tx_id');

// 获取审计日志
const logs = executionKernel.getAuditLogs(50);

// 获取统计信息
const stats = executionKernel.getStats();
```

### 5. Express 集成

```typescript
import { setupExecutionKernel, kernelContextMiddleware } from './execution-kernel/server-integration';

// 初始化
setupExecutionKernel(app);

// 添加中间件
app.use('/api', kernelContextMiddleware);

// 创建路由
const kernelRouter = createKernelIntegration(executionKernel).getRouter();
app.use('/api/kernel', kernelRouter);
```

## 📊 事件类型

```typescript
'TX_BEGIN'                 // 事务开始
'TX_COMMITTED'            // 事务提交
'TX_ROLLED_BACK'          // 事务回滚
'TX_COMPENSATING'         // 开始补偿
'ACTION_ADDED'            // 动作添加
'ACTION_EXECUTING'        // 动作执行中
'ACTION_SUCCESS'          // 动作成功
'ACTION_FAILED'           // 动作失败
'ACTION_STATUS_UPDATED'   // 动作状态更新
'RECOVERY_PLAN_CREATED'   // 恢复计划创建
'COMPENSATION_EXECUTED'   // 补偿执行
'COMPENSATION_SUCCESS'    // 补偿成功
'COMPENSATION_FAILED'     // 补偿失败
'EXECUTION_SUCCESS'       // 执行成功
'EXECUTION_FAILED'        // 执行失败
'STATE_SNAPSHOT_CAPTURED' // 状态快照捕获
'AUDIT_LOG_CREATED'       // 审计日志创建
```

## 🔄 恢复策略

| 错误类型 | 策略 | 说明 |
|---------|------|------|
| NETWORK | retry | 重试 3 次，延迟递增 |
| PARTIAL | compensate | 执行补偿操作并回滚 |
| BUSINESS_CONFLICT | replan | 需要人工审查 |
| VALIDATION | escalate | 立即升级 |
| UNKNOWN | escalate | 未知错误，立即升级 |

## 📈 API 端点

```
POST   /api/kernel/execute              # 执行计划
GET    /api/kernel/transaction/:txId    # 查询事务
GET    /api/kernel/snapshot/:txId       # 查询快照
GET    /api/kernel/audit?limit=100      # 审计日志
GET    /api/kernel/events?limit=100     # 事件历史
GET    /api/kernel/stats                # 统计信息
GET    /api/kernel/subscribe?eventType=*# SSE 订阅
```

## 🐛 调试技巧

```typescript
// 打印所有事件
eventBus.on('*', (e) => console.log(`[${e.type}]`, e.payload));

// 查看事件历史
console.log(eventBus.getHistory(100));

// 获取所有注册的事件类型
console.log(eventBus.getEventTypes());

// 查看内核统计
console.log(executionKernel.getStats());

// 查看活动事务
const stats = executionKernel.getStats();
console.log(`Active: ${stats.activeTransactions}`);
```

## ⚙️ 配置选项

```typescript
createKernelIntegration(executionKernel, {
  enableAudit: true,          // 记录审计日志
  enableStateCapture: true,   // 捕获状态快照
  parallelExecution: false,   // 并行执行动作
  actionTimeout: 60000,       // 单个动作超时（ms）
  cleanupInterval: 3600000    // 自动清理间隔（ms）
});
```

## 🔐 多租户隔离

```typescript
// 所有请求必须包含租户和存储信息
const context = {
  tenantId: 'tenant_001',   // 必须
  storeId: 'store_001',     // 必须
  userId: 'user_123',
  metadata: { ... }
};

// 所有操作都会隔离到这个context
```

## 🎯 最佳实践

1. **总是提供 context** - 确保多租户隔离
2. **使用补偿操作** - 为可逆操作注册回滚
3. **监听关键事件** - 在生产环境中监控
4. **设置合理超时** - 根据操作类型调整
5. **定期清理** - 防止数据堆积
6. **使用审计日志** - 追踪所有业务操作
7. **测试恢复路径** - 确保故障恢复正常工作

## 📚 更多信息

- 详细文档: `README.md`
- 架构说明: `ARCHITECTURE.md`
- 代码示例: `kernel-examples.ts`
- 集成指南: `server-integration.ts`
