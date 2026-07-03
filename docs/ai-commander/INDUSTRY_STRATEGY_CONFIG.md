# MODAUI AI Commander OS: 行业策略配置表 (Industry Strategy Config)

本文档定义了 AI Commander OS 在不同行业下的核心运营逻辑。通过一套统一的多智能体架构，配合不同的「行业作战手册」，实现精准的行业化运营。

---

## 1. 👕 服装设计批发 (fashion_wholesale)

### 1.1 KPI 权重建议
- **GMV (销售额)**: 0.30
- **利润率**: 0.25
- **库存健康度**: 0.30 (核心关注)
- **复购 / 客户关系**: 0.10
- **风险 (退款 / 欺诈)**: 0.05

### 1.2 关键工具优先级
- **核心**: InventoryService, ProductService, PricingService
- **辅助**: MarketingService, PaymentService

### 1.3 默认 Playbook 模板
- **季末清仓计划**: 针对季节性服装库存，制定分层折扣与清货活动。
- **尺码结构优化**: 识别滞销尺码，做混码打包或定向清货。
- **主推款增强计划**: 识别潜力爆款，集中资源提升曝光与转化。

---

## 2. 🍔 餐馆外卖 (restaurant_takeout)

### 2.1 KPI 权重建议
- **GMV (销售额)**: 0.25
- **利润率**: 0.20
- **库存健康度**: 0.10
- **复购 / 回头率**: 0.30 (核心关注)
- **风险 (退款 / 差评)**: 0.15

### 2.2 关键工具优先级
- **核心**: ProductService, PricingService, MarketingService
- **辅助**: InventoryService, PaymentService

### 2.3 默认 Playbook 模板
- **套餐提升客单价**: 通过主菜+小食+饮料套餐提高外卖客单价。
- **复购提升计划**: 针对近期下单客户设计二次下单优惠与唤醒流程。
- **风险订单回访**: 识别差评倾向订单，自动生成道歉补偿方案。

---

## 3. 🔌 百货电器 (general_merch_electronics)

### 3.1 KPI 权重建议
- **GMV (销售额)**: 0.25
- **利润率**: 0.30
- **库存健康度**: 0.20
- **复购 / 客户关系**: 0.10
- **风险 (退款 / 欺诈)**: 0.15 (核心关注)

### 3.2 关键工具优先级
- **核心**: ProductService, PricingService, InventoryService, RiskAgent
- **辅助**: PaymentService, MarketingService

### 3.3 默认 Playbook 模板
- **高价商品风控方案**: 针对大额订单识别风险并制定审核策略。
- **大促定价策略**: 为大促场景制定安全可控的折扣与利润方案。

---

## 4. 💆 美容预约 (beauty_booking)

### 4.1 KPI 权重建议
- **GMV (销售额)**: 0.20
- **利润率**: 0.15
- **库存健康度**: 0.05
- **复购 / 会员价值**: 0.40 (核心关注)
- **风险 (差评 / 预约爽约)**: 0.20

### 4.2 关键工具优先级
- **核心**: CustomerService, MarketingService, PricingService
- **辅助**: PaymentService

### 4.3 默认 Playbook 模板
- **疗程续费计划**: 针对即将完成疗程的客户制定续费优惠与提醒。
- **减少爽约计划**: 通过预约提醒和押金策略降低爽约率。

---

## 5. 📦 电商网店 (ecommerce_store)

### 5.1 KPI 权重建议
- **GMV (销售额)**: 0.35 (核心关注)
- **利润率**: 0.25
- **库存健康度**: 0.20
- **复购 / 客户关系**: 0.10
- **风险 (退款 / 欺诈)**: 0.10

### 5.2 关键工具优先级
- **核心**: StoreKpiService, ProductService, InventoryService, MarketingService
- **辅助**: PaymentService, OrderService

### 5.3 默认 Playbook 模板
- **全店增长计划**: 围绕流量、转化、客单价、复购四个杠杆制定行动。
- **畅销与滞销优化**: 提升畅销品表现，处理滞销和高库存商品。
- **退款率优化计划**: 分析高退款SKU原因，优化详情页文案与预期管理。

---

## 6. 🏪 POS 门店 (pos_retail)

### 6.1 KPI 权重建议
- **GMV (销售额)**: 0.30
- **利润率**: 0.25
- **库存健康度**: 0.25 (核心关注)
- **复购 / 会员**: 0.10
- **风险 (收银差错 / 欺诈)**: 0.10

### 6.2 关键工具优先级
- **核心**: InventoryService, StoreKpiService, ProductService
- **辅助**: MarketingService, PaymentService

### 6.3 默认 Playbook 模板
- **门店对比计划**: 识别不同门店之间的畅销/滞销商品与调拨机会。
- **单店库存周转优化**: 为库存积压门店制定折扣与陈列调整方案。

---

## 7. 技术实现概要

系统通过 `industryConfigs.ts` 导出统一的配置对象，AI 调度中心 (`server.ts`) 在处理请求时，会自动根据当前店铺的 `industry` 字段检索对应的权重和 Playbook，并将其注入 System Prompt。

```typescript
// server.ts 核心调度逻辑片段
const industryConfig = industryConfigs[aiContext.shop.industry];
const systemInstruction = `...
=== 行业专家建议配置 (Industry Config) ===
${JSON.stringify(industryConfig, null, 2)}
...`;
```

这种架构保证了 **一套核心代码** 即可驱动 **六大行业** 的专业运营。
