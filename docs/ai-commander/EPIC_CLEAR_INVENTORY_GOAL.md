# EPIC：清空冬季库存目标链路 (EPIC_CLEAR_INVENTORY_GOAL.md)

## 1. 用户故事
**场景**：商户发现仓库中冬季外套库存严重积压，希望 AI 能够给出一份快速清货的计划。
**输入**：「我需要在这个月底前清掉 70% 的冬季外套库存。」

## 2. 智能体协同链路 (Workflow)

### Step 1: 目标解析 (Ops Commander)
- 识别关键词：`清库存`, `冬季外套`, `70%`, `月底前`。
- 构建 `BusinessGoal` 对象，设置优先级：`InventoryHealth: 0.8`, `Margin: 0.2`。

### Step 2: 现状诊断 (Inventory Agent)
- 调用 `InventoryService.getStockAlerts()`。
- 筛选类目：`Clothing > Jackets/Coats`。
- 输出：识别出 15 个高库存 SKU，总库存 X 件，过去 30 天销量 Y。

### Step 3: 策略制定 (Pricing Agent & Marketing Agent)
- **Pricing Agent**：
  - 基于毛利空间，建议 3 档折扣：爆款 20% off，滞销品 40% off，极度积压品 60% off。
- **Marketing Agent**：
  - 建议活动名称：「冬季清仓季末大促」。
  - 建议渠道：邮件通知老客户 + 官网首页 Banner 挂载。

### Step 4: 方案合成 (Ops Commander)
- 整合上述建议，生成一份包含 4 个步骤的 Playbook。
- 每个步骤提供「创建折扣草稿」或「创建营销活动草稿」的入口。

## 3. 后端接口需求
- `InventoryService.getCategoryInventory(categoryName)`
- `DiscountService.suggestTieredDiscounts(skuList, targetRate)`
- `MarketingService.createCampaignDraft(title, items)`

## 4. 验收标准
- AI 能准确锁定“冬季外套”类目的商品。
- 生成的折扣建议逻辑合理（滞销程度越高，折扣越大）。
- 用户点击「生成草稿」后，在后台折扣列表中能看到 `status: draft` 的记录。
