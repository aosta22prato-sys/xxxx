# 🧠 Business Brain - AI Commerce OS 智能决策层

企业级商业智能和自动化系统，建立在 Execution Kernel 之上。

---

## 📋 目录

1. [概述](#概述)
2. [架构](#架构)
3. [核心功能](#核心功能)
4. [API 参考](#api-参考)
5. [使用示例](#使用示例)
6. [业务规则](#业务规则)
7. [集成指南](#集成指南)

---

## 概述

**Business Brain** 是 AI Commerce OS 的商业智能层，提供：

- 🎯 **规则引擎** - 预定义的商业决策规则
- 🧠 **智能决策** - 基于数据和规则的自动决策
- 📊 **指标管理** - 店铺 KPI 监控和分析
- 🔄 **工作流编排** - 将决策转换为 Execution Kernel 动作
- 📈 **决策历史** - 完整的决策追踪和审计

**关键特性：**
- 无需编码即可配置业务规则
- 与 Execution Kernel 无缝集成
- 支持 10+ 种预定义商业场景
- 完整的审计和可观测性
- 扩展性强的规则架构

---

## 架构

```
Business Brain Architecture
├── Rule Engine
│   ├── Rule Registry (规则注册表)
│   ├── Rule Evaluator (规则评估)
│   └── Decision Generator (决策生成)
│
├── Intelligence Layer
│   ├── Decision Making (决策制定)
│   ├── Metrics Analysis (指标分析)
│   └── Context Enrichment (上下文丰富)
│
├── Execution Coordination
│   ├── Action Mapping (动作映射)
│   ├── Workflow Orchestration (工作流编排)
│   └── Kernel Integration (内核集成)
│
└── API Layer
    ├── Decision Endpoints (决策端点)
    ├── Rule Management (规则管理)
    ├── Metrics API (指标API)
    └── History & Analytics (历史和分析)
```

---

## 核心功能

### 1. 业务决策制定

```typescript
const decision = await businessBrain.makeDecision(
  {
    orderId: 'ORD_001',
    orderTotal: 5000,
    customerLifetimeValue: 50000
  },
  { tenantId: 'store_1', storeId: 'shop_1' }
);

// 返回：
// {
//   id: 'decision_xxx',
//   type: 'rule_order_vip_customer',
//   confidence: 0.95,
//   actions: [ ... ],
//   reasoning: '...'
// }
```

### 2. 规则管理

```typescript
// 注册单个规则
businessBrain.registerRule({
  id: 'custom_rule_001',
  name: 'Custom Pricing Rule',
  priority: 80,
  condition: (data) => data.price > 1000,
  action: async (data) => [ /* actions */ ]
});

// 注册多个规则
businessBrain.registerRules(allRules);
```

### 3. 指标追踪

```typescript
// 更新指标
businessBrain.updateMetrics(context, {
  ordersToday: 342,
  revenueToday: 125000,
  activeCustomers: 1250,
  conversionRate: 3.2,
  averageOrderValue: 365
});

// 获取指标
const metrics = businessBrain.getMetrics(context);
```

### 4. 决策执行

```typescript
// 通过 Execution Kernel 执行决策
const results = await businessBrain.executeDecision(
  decision,
  context
);
```

---

## API 参考

### 决策相关

#### POST /api/business-brain/make-decision
制定业务决策

**请求：**
```json
{
  "situation": {
    "orderId": "ORD_001",
    "orderTotal": 5000,
    "customerLifetimeValue": 50000
  }
}
```

**响应：**
```json
{
  "decision": {
    "id": "decision_xxx",
    "type": "rule_order_vip_customer",
    "confidence": 0.95,
    "actions": [...],
    "reasoning": "Applied rule: VIP Customer Order Processing"
  },
  "kernelStats": {...}
}
```

#### POST /api/business-brain/execute-decision
执行已有决策

**请求：**
```json
{
  "decisionId": "decision_xxx"
}
```

**响应：**
```json
{
  "success": true,
  "results": [...],
  "transactionCount": 3
}
```

#### POST /api/business-brain/analyze
运行综合分析

**请求：**
```json
{
  "data": {...}
}
```

### 规则管理

#### GET /api/business-brain/rules
获取规则统计

**响应：**
```json
{
  "totalRules": 10,
  "enabledRules": 9,
  "status": "Rules configured and ready"
}
```

#### POST /api/business-brain/rules/initialize
初始化默认规则

**响应：**
```json
{
  "success": true,
  "rulesInitialized": 10,
  "message": "Loaded 10 business rules"
}
```

### 指标相关

#### GET /api/business-brain/metrics
获取店铺指标

**响应：**
```json
{
  "metrics": {
    "ordersToday": 342,
    "revenueToday": 125000,
    "activeCustomers": 1250,
    "inventoryTurns": 8.5,
    "conversionRate": 3.2,
    "averageOrderValue": 365
  }
}
```

#### PUT /api/business-brain/metrics
更新店铺指标

**请求：**
```json
{
  "metrics": {
    "ordersToday": 350,
    "revenueToday": 130000
  }
}
```

### 历史和分析

#### GET /api/business-brain/decisions?limit=50
获取决策历史

**响应：**
```json
{
  "decisions": [...],
  "count": 45
}
```

#### GET /api/business-brain/stats
获取系统统计

**响应：**
```json
{
  "totalRules": 10,
  "enabledRules": 10,
  "totalDecisions": 245,
  "registeredStores": 5
}
```

---

## 使用示例

### 示例 1: 订单处理

```typescript
import { businessBrain, getAllBusinessRules, BusinessContext } from './business-brain';

const context: BusinessContext = {
  tenantId: 'store_001',
  storeId: 'shop_nyc',
  userId: 'user_merchant'
};

// 初始化规则
const rules = getAllBusinessRules();
businessBrain.registerRules(rules);

// 大订单 + VIP 客户
const decision = await businessBrain.makeDecision({
  orderId: 'ORD_001',
  orderTotal: 5000,
  largeOrderThreshold: 1000,
  customerId: 'vip_customer_001',
  customerLifetimeValue: 50000,
  vipThreshold: 10000
}, context);

// 执行决策
const results = await businessBrain.executeDecision(decision, context);
console.log(`✅ 订单已处理，${results.length} 个动作完成`);
```

### 示例 2: 库存管理

```typescript
// 低库存预警
const decision = await businessBrain.makeDecision({
  currentStock: 5,
  thresholdStock: 20,
  skuId: 'LAPTOP_PRO_001',
  reorderQuantity: 100
}, context);

console.log(`Decision: ${decision.type}`);
console.log(`Actions: ${decision.actions.length}`);
// 输出: 
// Decision: rule_inventory_low_stock
// Actions: 2
```

### 示例 3: 客户保留

```typescript
// 客户流失风险
const decision = await businessBrain.makeDecision({
  customerId: 'cust_at_risk',
  churnRiskScore: 0.85,
  lastPurchaseDate: Date.now() - 90 * 24 * 60 * 60 * 1000
}, context);

const results = await businessBrain.executeDecision(decision, context);
// 自动触发：
// - 送积分奖励
// - 个性化优惠
```

### 示例 4: 定价优化

```typescript
// 根据需求动态调价
const decision = await businessBrain.makeDecision({
  skuId: 'LAPTOP_PRO_001',
  currentPrice: 1500,
  dailyViews: 5000,
  highDemandThreshold: 2000
}, context);

console.log(decision.reasoning);
// 输出: "Applied rule: Demand-Based Dynamic Pricing"
```

---

## 业务规则

### 已实现的规则

#### 库存管理 (2 个规则)
- **Low Inventory Alert** - 库存低于阈值时自动补货
- **Dead Stock Removal** - 90+ 天未售出的商品标记清仓

#### 订单处理 (2 个规则)
- **Large Order Handling** - 大订单特殊处理
- **VIP Customer Order** - VIP 客户优先级处理

#### 客户管理 (2 个规则)
- **Cart Abandonment Recovery** - 购物车放弃恢复
- **Churn Prevention** - 客户流失预防

#### 定价管理 (2 个规则)
- **Demand-Based Dynamic Pricing** - 根据需求动态调价
- **Competitive Price Matching** - 竞争价格匹配

#### 营销管理 (2 个规则)
- **Cross-Sell Opportunity** - 交叉销售推荐
- **Upsell Opportunity** - 向上销售推荐

### 创建自定义规则

```typescript
import { BusinessRule } from './business-brain';

const customRule: BusinessRule = {
  id: 'rule_custom_flash_sale',
  name: 'Flash Sale Trigger',
  description: 'Automatically triggers flash sales based on inventory',
  priority: 85,
  enabled: true,
  condition: (data) => {
    return data.excessInventory > 1000 && 
           data.daysSinceLastSale < 7;
  },
  action: async (data) => [
    {
      id: `action_flash_${Date.now()}`,
      tool: 'marketing.createFlashSale',
      params: {
        skuIds: data.skuIds,
        discountPercentage: 40,
        duration: 4 // 4 hours
      },
      status: 'pending',
      createdAt: Date.now()
    }
  ]
};

businessBrain.registerRule(customRule);
```

---

## 集成指南

### 步骤 1: 导入和初始化

```typescript
import express from 'express';
import { 
  businessBrain, 
  getAllBusinessRules,
  mountBusinessBrainRoutes 
} from './business-brain';

const app = express();

// 初始化规则
const rules = getAllBusinessRules();
businessBrain.registerRules(rules);

// 挂载 API 路由
mountBusinessBrainRoutes(app);
```

### 步骤 2: 在中间件中提取上下文

```typescript
app.use((req, res, next) => {
  req.businessContext = {
    tenantId: req.headers['x-tenant-id'],
    storeId: req.headers['x-store-id'],
    userId: req.headers['x-user-id']
  };
  next();
});
```

### 步骤 3: 在业务逻辑中使用

```typescript
app.post('/orders', async (req, res) => {
  const order = req.body;
  
  // 让 Business Brain 做决策
  const decision = await businessBrain.makeDecision(
    order,
    req.businessContext
  );
  
  // 执行决策
  const results = await businessBrain.executeDecision(
    decision,
    req.businessContext
  );
  
  res.json({ success: true, results });
});
```

---

## 事件和监控

Business Brain 与 Execution Kernel 集成，所有决策都会生成事件：

```typescript
import { eventBus } from '../execution-kernel';

// 监听决策事件
eventBus.on('ACTION_SUCCESS', (event) => {
  console.log('✅ 决策动作成功:', event.payload);
});

eventBus.on('ACTION_FAILED', (event) => {
  console.log('❌ 决策动作失败:', event.payload);
});
```

---

## 性能特性

| 特性 | 值 |
|------|-----|
| 最大规则数 | 无限 |
| 最大决策历史 | 10,000 |
| 最大店铺数 | 无限 |
| 规则评估时间 | < 100ms |
| 决策制定时间 | < 500ms |
| 决策执行时间 | 依赖 Kernel |

---

## 常见场景

### 场景 1: 自动补货

```typescript
// 库存监控 → 低库存检测 → 自动补货
const situation = {
  currentStock: 5,
  thresholdStock: 50,
  skuId: 'PRODUCT_001',
  reorderQuantity: 200
};

const decision = await businessBrain.makeDecision(situation, context);
// 自动生成补货订单
```

### 场景 2: VIP 订单处理

```typescript
// 订单生成 → VIP 检测 → 优先处理
const situation = {
  orderId: 'ORD_001',
  orderTotal: 5000,
  customerId: 'VIP_001',
  customerLifetimeValue: 100000
};

const decision = await businessBrain.makeDecision(situation, context);
// 自动分配到 VIP 处理队列
```

### 场景 3: 购物车放弃恢复

```typescript
// 购物车放弃 → 时间检查 → 恢复活动
const situation = {
  customerId: 'cust_001',
  cartValue: 250,
  minutesSinceAbandonment: 30
};

const decision = await businessBrain.makeDecision(situation, context);
// 自动发送恢复邮件和折扣码
```

---

## 故障排查

### 问题 1: 没有规则匹配

**症状：** `confidence: 0, actions: []`

**解决方案：**
1. 检查规则是否启用
2. 验证条件语句
3. 查看决策日志

### 问题 2: 规则优先级问题

**症状：** 错误的规则被选中

**解决方案：**
1. 调整规则优先级
2. 检查条件重叠
3. 添加更多条件

### 问题 3: 决策执行失败

**症状：** `results[i].success === false`

**解决方案：**
1. 检查 Execution Kernel 错误
2. 验证工具参数
3. 查看审计日志

---

## 下一步

- [ ] 添加实时监控面板
- [ ] 实现 A/B 测试框架
- [ ] 添加机器学习规则
- [ ] 实现自适应优化
- [ ] 添加多语言支持
- [ ] 集成外部数据源

---

## 相关文档

- [Execution Kernel](../execution-kernel/README.md)
- [业务规则](./rules.ts)
- [API 参考](./api.ts)
- [使用示例](./examples.ts)

---

**🚀 Business Brain 已准备好支撑您的商业自动化！**
