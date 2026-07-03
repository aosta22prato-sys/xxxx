# AI Commander OS 第一阶段开发计划 (Roadmap)

## Sprint 1：打地基 (Runtime Context + StoreKpiService)
**目标**：AI 先能回答「今天怎么样 / 运营情况」，在智能大盘页面表现出“带脑子的报表讲解员”。

### 开发项：
1. **实现 AIContext (精简版)**：
   - `shop`: tenantId / shopId / country / currency / industry / lifecycleStage
   - `user`: userId / role / language
   - `ui`: pageType (至少支持 dashboard)
   - `metrics`: `StoreKpiService.getStoreKpis(shopId)` 返回的数据
2. **实现 StoreKpiService.getStoreKpis(shopId)**：
   - 今日销售额 / 今日订单数 / 今日客单价
   - 本月销售额 / 本月订单数 / 本月利润
   - 退款率 / 支付成功率
   - 库存预警数 / 流失客户数
3. **实现 /api/ai/ask 最简通路**：
   - 只在 dashboard 页支持问题匹配
   - 构造 AIContext + 调 StoreKpiService + 调 LLM

---

## Sprint 2：场景扩展 (商品详情 + 订单详情)
**目标**：AI 在「商品详情」「订单详情」能说人话，自动识别当前对象。

### 开发项：
1. **UI 上下文解析**：
   - `productId` / `orderId` 自动从 `currentRoute` 解析。
2. **实现 ProductService.getProductInsight**：
   - 最近 30 天：销售额 / 订单数 / 销量 / 退货率
   - 成本价 / 当前价格 / 毛利率
   - 当前库存 / 库存状态 (healthy / low / overstock)
3. **实现 OrderService.getOrderRisk**：
   - 风险等级 (low / medium / high) + 原因分析
4. **调度逻辑分支**：
   - 在详情页询问时，自动调用对应的 Insight 工具。

---

## Sprint 3：支付推荐 + 自然语言入口丰富
**目标**：支持「哪个支付最好」建议，丰富自然语言入口。

### 开发项：
1. **实现 PaymentService**：
   - `getPaymentStats`: 支付方式占比与成功率。
   - `recommendPayments`: 基于国家/行业/数据的智能推荐。
2. **自然语言匹配扩展**：
   - 支持更多模糊提问：「支付怎么配置」、「最近涨得最快的是什么」。
3. **Prompt 最终强化**：
   - 严格执行 7 大行为准则，确保不编造数据，引导用户回到业务。
