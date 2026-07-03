# AI Commander OS 第二阶段：动作草稿执行计划 (Actionable Drafts)

## 一、核心理念
从「看得清」升级到「帮你动手做一半」。AI 不再只提供建议，而是直接生成可执行的业务操作草稿。
**原则**：AI 负责计算与提议，人类负责点击确认。严禁 AI 直接修改生产数据。

## 二、新增动作型 Tool Service
1. **折扣建议工具 (DiscountService)**
   - `suggestDiscountForProduct(productId, shopId)`
   - 返回：建议折扣规则 JSON（类型、面额、有效期、适用商品）。
2. **自动化流建议 (FlowService)**
   - `suggestRetentionFlow(shopId)`
   - 返回：唤醒/挽留 Flow 的触发条件与动作草稿。
3. **定价建议工具 (PricingService)**
   - `proposeNewPrice(productId, shopId)`
   - 返回：基于成本与市场竞争的调价建议及修改草稿。
4. **货品运营动作 (Inventory/Product Service)**
   - `suggestReplenishment(productId)`：补货建议草稿。
   - `suggestBundles(shopId)`：商品打包组合建议草稿。

## 三、UX 交互模式
- **侧边建议区**：在详情页中增加「AI 指挥官建议」模块。
- **草稿卡片**：展示建议详情 + 「一键生成草稿」按钮。
- **确认执行**：点击按钮后，自动填好表单或打开弹窗，用户只需点击「保存/发布」。

## 四、典型场景
1. **清库存促销**：AI 发现某商品库存积压，自动在详情页弹出「建议设置买二送一折扣卡片」，点击即生成折扣草稿。
2. **客户挽留**：AI 识别流失风险，建议「30天未下单发放 10% 优惠券」Flow，点击即配置好自动化引擎。
