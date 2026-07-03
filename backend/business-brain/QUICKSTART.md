# 🧠 Business Brain - 快速参考卡

快速查询和使用指南

---

## ⚡ 30 秒快速开始

```typescript
import { businessBrain, getAllBusinessRules } from './business-brain';

// 1. 初始化规则
const rules = getAllBusinessRules();
businessBrain.registerRules(rules);

// 2. 制定决策
const decision = await businessBrain.makeDecision(
  { orderId: 'ORD_001', orderTotal: 5000, customerId: 'VIP_001' },
  { tenantId: 'store_1', storeId: 'shop_1' }
);

// 3. 执行决策
const results = await businessBrain.executeDecision(decision, context);

// ✅ 完成！
```

---

## 📚 常用操作

### 注册规则
```typescript
businessBrain.registerRule(rule);
businessBrain.registerRules(rules);
```

### 制定决策
```typescript
const decision = await businessBrain.makeDecision(situation, context);
```

### 执行决策
```typescript
const results = await businessBrain.executeDecision(decision, context);
```

### 获取历史
```typescript
const decisions = businessBrain.getDecisions(limit);
```

### 管理指标
```typescript
// 更新
businessBrain.updateMetrics(context, metrics);

// 获取
const metrics = businessBrain.getMetrics(context);
```

### 获取统计
```typescript
const stats = businessBrain.getStats();
```

---

## 🔌 API 端点

| 方法 | 端点 | 功能 |
|------|------|------|
| POST | `/api/business-brain/make-decision` | 制定决策 |
| POST | `/api/business-brain/execute-decision` | 执行决策 |
| POST | `/api/business-brain/analyze` | 运行分析 |
| GET | `/api/business-brain/rules` | 获取规则 |
| POST | `/api/business-brain/rules/initialize` | 初始化规则 |
| GET | `/api/business-brain/metrics` | 获取指标 |
| PUT | `/api/business-brain/metrics` | 更新指标 |
| GET | `/api/business-brain/decisions` | 决策历史 |
| GET | `/api/business-brain/stats` | 获取统计 |

---

## 📋 业务规则速查表

### 库存管理
- **low_inventory_alert** - 库存低于阈值
- **dead_stock_removal** - 90+ 天未售

### 订单处理
- **large_order_handling** - 大订单处理
- **vip_customer_order** - VIP 客户处理

### 客户管理
- **cart_abandonment_recovery** - 购物车放弃
- **churn_prevention** - 客户流失

### 定价管理
- **demand_based_pricing** - 需求定价
- **competitive_pricing** - 竞争定价

### 营销管理
- **cross_sell_opportunity** - 交叉销售
- **upsell_opportunity** - 向上销售

---

## 🔍 业务上下文

```typescript
interface BusinessContext {
  tenantId: string;        // 租户 ID
  storeId: string;         // 店铺 ID
  userId?: string;         // 用户 ID
  metadata?: Record<string, any>;
}
```

---

## 📊 业务指标

```typescript
interface BusinessMetrics {
  ordersToday: number;           // 今日订单
  revenueToday: number;          // 今日收入
  activeCustomers: number;       // 活跃客户
  inventoryTurns: number;        // 库存周转
  conversionRate: number;        // 转化率
  averageOrderValue: number;     // 平均订单额
}
```

---

## 🎯 业务决策

```typescript
interface BusinessDecision {
  id: string;              // 决策 ID
  type: string;            // 决策类型
  confidence: number;      // 置信度 (0-1)
  actions: ActionRecord[]; // 要执行的动作
  reasoning: string;       // 决策原因
  timestamp: number;       // 时间戳
}
```

---

## 🚀 常见模式

### 模式 1: 订单响应式处理
```typescript
// 订单生成 → Business Brain 决策 → Kernel 执行
const decision = await businessBrain.makeDecision(order, context);
const results = await businessBrain.executeDecision(decision, context);
```

### 模式 2: 定期数据处理
```typescript
// 每小时运行一次
setInterval(async () => {
  const situations = await fetchSituationsFromDB();
  for (const situation of situations) {
    const decision = await businessBrain.makeDecision(situation, context);
    await businessBrain.executeDecision(decision, context);
  }
}, 3600000); // 1 小时
```

### 模式 3: 实时监控
```typescript
// 监听 Kernel 事件
eventBus.on('ACTION_FAILED', async (event) => {
  // 故障恢复决策
  const decision = await businessBrain.makeDecision(
    { error: event.payload.error },
    context
  );
});
```

---

## 💡 最佳实践

### ✅ 做
- 按优先级排序规则
- 使用明确的条件
- 记录决策原因
- 定期审查规则
- 监控决策效果

### ❌ 不做
- 过度复杂的条件
- 硬编码业务逻辑
- 忽视决策审计
- 禁用必要的规则
- 忘记测试新规则

---

## 🔧 创建自定义规则

```typescript
const customRule: BusinessRule = {
  id: 'rule_custom_xxx',
  name: '自定义规则名',
  description: '详细说明',
  priority: 80,
  enabled: true,
  condition: (data) => {
    // 返回 true/false
    return data.value > threshold;
  },
  action: async (data) => {
    // 返回 ActionRecord[]
    return [
      {
        id: `action_${Date.now()}`,
        tool: 'tool.name',
        params: { /* 参数 */ },
        status: 'pending',
        createdAt: Date.now()
      }
    ];
  }
};

businessBrain.registerRule(customRule);
```

---

## 📈 监控指标

```typescript
// 每分钟更新一次
setInterval(() => {
  const stats = businessBrain.getStats();
  console.log(`Rules: ${stats.totalRules}`);
  console.log(`Decisions: ${stats.totalDecisions}`);
  console.log(`Stores: ${stats.registeredStores}`);
}, 60000);
```

---

## ⚠️ 常见错误

| 错误 | 原因 | 解决 |
|------|------|------|
| 无规则匹配 | 条件不符 | 检查条件和数据 |
| 错误的规则 | 优先级问题 | 调整优先级 |
| 执行失败 | 参数错误 | 验证参数 |
| 高延迟 | 规则过多 | 优化条件 |

---

## 📞 需要帮助?

- 📖 完整文档: `README.md`
- 🔧 API 参考: `api.ts`
- 💻 代码示例: `examples.ts`
- 📋 规则库: `rules.ts`

---

**⚡ 快速、强大、可靠的商业决策！**
