# EPIC 1: 👕 服装设计批发 – 季末库存清理智能体 (Seasonal Inventory Clearance Agent)

## 1. 背景 & 业务痛点
**行业**：服装设计批发 (fashion_wholesale)

**典型痛点**：
- **季节性库存积压**：每季结束时，大量冬装/秋装/夏装剩余在仓库，占用大量流动资金。
- **决策难度高**：运营人员很难快速计算哪些款式必须清掉、折扣力度应为多少（平衡毛利与速度）、以及目标客户是谁。
- **执行低效**：目前的清货操作多依赖人工经验和群发消息，缺乏针对性和系统化的折扣策略。

**解决方案**：
通过 AI Commander 实现「指令驱动」的智能清货。用户只需输入目标（如“两个月内清掉冬季库存 70%”），系统自动完成 SKU 识别、表现分析、策略生成及执行草稿配置。

---

## 2. 业务目标 (Goal) 示例
**自然语言输入**：
- 「两个月内清掉冬季库存 70%。」
- 「帮我清一下冬款库存，尽量快一点回款。」

**结构化 BusinessGoal**：
```typescript
const goal: BusinessGoal = {
  timeRange: {
    preset: 'next_2_months',
  },
  metricsTarget: {
    // 目标：冬季 SKU 总库存减少 70%
    inventoryTurnoverDaysMax: undefined, 
  },
  priorityWeights: {
    gmv: 0.30,
    margin: 0.20,
    inventoryHealth: 0.40, // 清货场景的核心权重
    retention: 0.05,
    risk: 0.05,
  },
};
```

---

## 3. Ops Commander 的「清货 Playbook」结构
**主目标**：在 2 个月内，将冬季库存 SKU 总库存减少 70%，同时尽量保持毛利率在合理区间。

### 模块 A：高库存 + 滞销 SKU 强力清仓
- **定价策略**：建议折扣 40%–60% off，设计批量折扣（如买 10 件以上再打 9 折）。
- **客户策略**：识别高频大客户，组合打包推荐。
- **输出**：跨 SKU 的批量折扣草稿。

### 模块 B：中等库存 + 畅销 SKU 温和清货
- **定价策略**：小幅折扣 10%–20% off。
- **客户策略**：针对高价值客户做专属清仓优惠。
- **输出**：轻度促销活动草稿。

### 模块 C：尺码结构优化（混码打包）
- **策略**：分析滞销码（如 XS/XXL），建议按件数/重量混码打包销售。
- **输出**：建议新建「混码清货」产品 SKU 及定价方案。

---

## 4. 需要调用的智能体 & 工具链路
### 4.1 涉及角色
- **Ops Commander**：总指挥，负责全局目标拆解与 Playbook 组装。
- **Inventory Agent**：负责库存现状、季节性识别与尺码分析。
- **Pricing Agent**：负责折扣计算、阶梯价建议。
- **Marketing Agent**：负责营销活动策划与客户群匹配。

### 4.2 工具链路 (Logic Flow)
1. **Inventory Agent**：调用 `InventoryService.getSeasonalSkus` 和 `ProductService.getProductInsight`。
   - 识别冬季 SKU。
   - 标记 `performanceTag` (畅销/滞销) 和 `inventoryStatus` (健康/积压)。
2. **Pricing Agent**：根据库存与毛利现状，调用 `PricingService.recommendPriceAndPromo`。
   - 生成针对不同分类 SKU 的折扣区间建议。
3. **Marketing Agent**：调用 `MarketingService.suggestWholesaleClearanceCampaign`。
   - 设计清仓活动标题、文案及目标客户分组。
4. **Ops Commander**：汇总数据，计算预估影响，生成最终 Playbook 对象。

---

## 5. 用户故事 (User Stories)
- **Story 1 (老板)**：作为服装批发商老板，我希望输入一句指令即可得到完整的清货计划，以便快速回笼资金。
- **Story 2 (运营)**：作为运营人员，我希望系统识别滞销尺码并建议打包方案，以便腾出仓储空间。
- **Story 3 (销售)**：作为销售经理，我希望系统自动匹配适合大客户的清货套餐，以便快速推动大额成交。

---

## 6. 验收标准 (Acceptance Criteria)
1. 系统能准确识别冬季相关 SKU 及其库存/销量表现。
2. 针对「清库存」指令，能返回结构化的 Playbook，包含 2-3 个不同策略的行动模块。
3. 每个行动模块必须包含：涉及的 SKU 列表、建议折扣方案、预估 KPI 影响方向。
4. 提供一键生成对应业务草稿（如促销活动草稿）的功能入口。
