# Execution Kernel - 项目结构

```
backend/execution-kernel/
├── README.md                          # 详细文档（系统说明、API文档、使用示例）
├── types.ts                           # 类型定义（所有接口和枚举）
├── event-bus.ts                       # EventBus（系统神经网络 - 事件发布/订阅）
├── transaction-manager.ts             # TransactionManager（事务生命周期管理）
├── recovery-engine.ts                 # RecoveryEngine（智能错误恢复）
├── execution-kernel.ts                # ExecutionKernel（核心执行器）
├── kernel-integration.ts              # KernelIntegration（Express集成）
├── ai-tool-registry.ts                # AIToolRegistry（工具注册表）
├── kernel-examples.ts                 # Examples（使用示例和初始化）
├── server-integration.ts              # ServerIntegration（server.ts集成指南）
└── index.ts                           # Main Export（统一导出所有组件）
```

## 📦 文件说明

### 核心文件

#### `types.ts` (100+ 行)
**作用**：中央类型系统
- Transaction（事务）
- ActionRecord（动作记录）
- Event（事件）
- ExecutionResult（执行结果）
- RecoveryPlan（恢复计划）
- StateSnapshot（状态快照）
- AuditLogEntry（审计日志）
- KernelStats（内核统计）

#### `event-bus.ts` (150+ 行)
**作用**：系统神经网络 - 解耦的事件驱动架构
**核心方法**：
- `on(eventType, handler)` - 订阅事件
- `emit(event)` - 同步发送事件
- `emitAsync(event)` - 异步发送事件
- `waitFor(eventType, timeout)` - 等待特定事件
- `getHistory(limit)` - 获取事件历史

#### `transaction-manager.ts` (180+ 行)
**作用**：事务生命周期管理
**核心方法**：
- `begin(tenantId, storeId)` - 开始事务
- `addAction(txId, action)` - 添加动作
- `commit(txId)` - 提交事务
- `rollback(txId, reason)` - 回滚事务
- `beginCompensation(txId)` - 开始补偿

#### `recovery-engine.ts` (220+ 行)
**作用**：智能错误恢复和故障处理
**错误类型**：
- NETWORK - 网络错误（重试）
- PARTIAL - 部分执行（补偿）
- BUSINESS_CONFLICT - 业务冲突（重新规划）
- VALIDATION - 验证错误（升级）
**恢复策略**：retry | compensate | replan | escalate

#### `execution-kernel.ts` (350+ 行)
**作用**：核心执行器 - 协调整个执行流程
**核心方法**：
- `execute(actions, context, options)` - 执行动作计划
- `registerTool(name, executor)` - 注册工具
- `getTransaction(txId)` - 查询事务
- `getStateSnapshot(txId)` - 查询状态快照
- `getAuditLogs(limit)` - 查询审计日志
- `getStats()` - 获取统计信息

#### `kernel-integration.ts` (200+ 行)
**作用**：Express 集成
**提供接口**：
- POST `/execute` - 执行动作计划
- GET `/transaction/:txId` - 查询事务
- GET `/snapshot/:txId` - 查询快照
- GET `/audit` - 查询审计日志
- GET `/events` - 查询事件历史
- GET `/stats` - 查询统计信息
- GET `/subscribe` - SSE 事件订阅

#### `ai-tool-registry.ts` (220+ 行)
**作用**：AI 工具注册和管理
**功能**：
- 注册业务工具
- 绑定补偿操作
- 工具发现和管理
- 预定义商业工具集

#### `kernel-examples.ts` (250+ 行)
**作用**：示例和初始化
**包含示例**：
- `initializeKernel()` - 完整初始化
- `exampleSimpleOrderFlow()` - 简单订单流程
- `exampleParallelExecution()` - 并行执行
- `exampleEventMonitoring()` - 事件监控
- `exampleAuditLogging()` - 审计日志

#### `server-integration.ts` (250+ 行)
**作用**：与 server.ts 的集成指南
**包含**：
- 集成步骤说明
- 现有后端工具映射
- 事件监控设置
- API 端点示例

#### `index.ts` (30+ 行)
**作用**：统一导出所有组件和类型
**导出**：
- EventBus, TransactionManager, RecoveryEngine, ExecutionKernel
- AIToolRegistry, KernelIntegration
- 所有类型定义
- 示例函数

### 文档文件

#### `README.md` (400+ 行)
**内容**：
- 系统定位和架构图
- 六个核心组件详细说明
- 执行流程（成功和故障）
- 集成步骤
- 监控和调试
- 性能考虑
- 完整示例

#### `ARCHITECTURE.md` (此文件)
**内容**：
- 文件组织结构
- 文件说明
- 数据流图
- 集成指南

## 🔄 数据流

### 标准执行流程

```
AI Agent Request
    ↓
ExecutionKernel.execute()
    ↓
TransactionManager.begin() → TX_BEGIN event
    ↓
[for each action]:
  ├─ Add to transaction → ACTION_ADDED event
  ├─ Execute tool
  └─ Update status → ACTION_EXECUTING → ACTION_SUCCESS/FAILED
    ↓
[Check results]
  ├─ All success → Commit tx → TX_COMMITTED
  └─ Has failure → Attempt recovery → Rollback → TX_ROLLED_BACK
    ↓
Capture state snapshot → STATE_SNAPSHOT_CAPTURED
    ↓
Log audit entry → AUDIT_LOG_CREATED
    ↓
Return results to client
```

### 事件流

```
EventBus (Central Event Hub)
    ├─ TX_BEGIN
    ├─ TX_COMMITTED/TX_ROLLED_BACK
    ├─ ACTION_ADDED/ACTION_EXECUTING
    ├─ ACTION_SUCCESS/ACTION_FAILED
    ├─ RECOVERY_PLAN_CREATED
    ├─ COMPENSATION_EXECUTED/FAILED
    ├─ EXECUTION_SUCCESS/FAILED
    ├─ STATE_SNAPSHOT_CAPTURED
    ├─ AUDIT_LOG_CREATED
    └─ Custom events...

Listeners:
    ├─ Monitoring (logging)
    ├─ Analytics (metrics)
    ├─ Notifications (alerts)
    └─ External systems (webhooks)
```

## 🔌 集成序列

```
1. server.ts 启动
    ↓
2. setupExecutionKernel(app)
    ├─ Create EventBus singleton
    ├─ Create TransactionManager
    ├─ Create RecoveryEngine
    ├─ Create ExecutionKernel
    ├─ Create AIToolRegistry
    ├─ Register commerce tools
    ├─ Mount /api/kernel routes
    └─ Setup event monitoring
    ↓
3. Request arrives
    ├─ kernelContextMiddleware extracts tenant/store
    ├─ Route handler prepares ActionRecord[]
    └─ Calls executeAIPlan(actions, context)
    ↓
4. ExecutionKernel processes
    ├─ Begin transaction
    ├─ Execute actions
    ├─ Manage recovery if needed
    ├─ Commit or rollback
    ├─ Capture snapshot
    └─ Log audit entry
    ↓
5. Response returned
    ├─ Include execution results
    ├─ Include kernel stats
    └─ Client receives transaction details
```

## 📊 多租户隔离

所有操作都严格隔离：

```
Request
  ↓
  Headers: X-Tenant-Id: tenant_001, X-Store-Id: store_001
  ↓
  Context: { tenantId: 'tenant_001', storeId: 'store_001', userId: 'user_123' }
  ↓
  ExecutionKernel.execute(actions, context)
  ├─ TransactionManager.begin(tenantId, storeId)
  ├─ All actions bound to context
  ├─ StateSnapshot includes tenant/store
  └─ AuditLog includes tenant/store
  ↓
  Only tenant_001/store_001 data visible
```

## 🚀 快速开始

### 1. 在 server.ts 中初始化

```typescript
import { setupExecutionKernel } from './execution-kernel/server-integration';

const app = express();
setupExecutionKernel(app);
```

### 2. 添加中间件

```typescript
import { kernelContextMiddleware } from './execution-kernel/server-integration';

app.use('/api', kernelContextMiddleware);
```

### 3. 在 AI 控制器中使用

```typescript
import { executeAIPlan, ActionRecord, ExecutionContext } from './execution-kernel';

const results = await executeAIPlan(actions, context);
```

### 4. 监听事件

```typescript
import { eventBus } from './execution-kernel';

eventBus.on('ACTION_SUCCESS', (event) => {
  console.log('Action succeeded:', event.payload);
});
```

## 📈 下一个里程碑

### Phase 2: 持久化存储
- [ ] 数据库集成（PostgreSQL）
- [ ] 事务日志持久化
- [ ] 状态快照存储
- [ ] 审计日志存储

### Phase 3: 分布式特性
- [ ] 分布式事务（Saga）
- [ ] 跨服务协调
- [ ] 分布式恢复

### Phase 4: 高级功能
- [ ] 性能优化
- [ ] 缓存层
- [ ] 监控面板
- [ ] Webhook 支持

## 📝 文件大小总结

| 文件 | 大小 | 用途 |
|------|------|------|
| types.ts | 100+ | 类型定义 |
| event-bus.ts | 150+ | 事件系统 |
| transaction-manager.ts | 180+ | 事务管理 |
| recovery-engine.ts | 220+ | 错误恢复 |
| execution-kernel.ts | 350+ | 核心执行 |
| kernel-integration.ts | 200+ | Express 集成 |
| ai-tool-registry.ts | 220+ | 工具注册 |
| kernel-examples.ts | 250+ | 示例 |
| server-integration.ts | 250+ | 集成指南 |
| **总计** | **1.8K+** | **完整系统** |

## 🎯 核心原则

1. **事务安全** - 所有操作都是原子的
2. **事件驱动** - 松耦合的异步架构
3. **故障恢复** - 自动检测和恢复
4. **多租户隔离** - 严格的数据隔离
5. **完全可审计** - 所有操作都有记录
6. **可观测性** - 完整的监控和调试信息
