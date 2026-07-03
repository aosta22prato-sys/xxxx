# AI Commander OS 开发路线图 (Roadmap Table)

| 阶段 | Sprint | 核心任务 | 关键功能点 | 预估人日 | 验收标准 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **第一阶段：眼睛 + 大脑** | **Sprint 1** | 打地基 | AIContext, StoreKpiService, /api/ai/ask 通路 | 5d | 智能大盘能基于真实数据回答今日业绩 |
| | **Sprint 2** | 场景扩展 | 商品/订单详情页自动解析, ProductInsight, OrderRisk | 5d | 详情页能自动识别对象并给出洞察建议 |
| | **Sprint 3** | 支付与入口丰富 | PaymentService 推荐, 模糊自然语言匹配扩展 | 4d | 支持“哪个支付最好”等全局决策建议 |
| **第二阶段：手 + 动作型** | **Sprint 4** | 动作草稿工具 | DiscountService 建议, FlowService 唤醒建议 | 7d | AI 给出建议后，页面显示“生成草稿”按钮 |
| | **Sprint 5** | 交互集成 | 侧边建议区 UI 挂载, 弹窗表单自动填充逻辑 | 5d | 点击按钮能自动调起已填好的业务操作表单 |
| **第三阶段：战役级规划** | **Sprint 6** | 策略 Playbook | 组合决策逻辑, 战役级 Playbook 模板生成 | 10d | AI 能产出“下周运营计划”并提供批量入口 |
| **知识与安全增强** | **Sprint 7** | 专家规则与安全 | 成本红线校验, 最小知识库 (FAQ/SOP), 失败案例记录 | 5d | AI 建议不再出现亏本情况，能准确回答系统功能 |

---

## 行业 EPIC 样板 (Industry EPIC Blueprints)

为了加速代理团队的开发，我们提供了针对特定行业的高质量 EPIC 样板：

- **👕 服装设计批发**：[季末库存清理智能体 EPIC](file:///www/wwwroot/modaui.com/docs/ai-commander/EPIC_FASHION_WHOLESALE_CLEARANCE.md)
- **🍔 餐馆外卖**：[客单价提升 & 复购智能体 EPIC](file:///www/wwwroot/modaui.com/docs/ai-commander/EPIC_RESTAURANT_TAKEOUT_GROWTH.md)
- **⚙️ 通用配置**：[行业策略配置中心](file:///www/wwwroot/modaui.com/docs/ai-commander/INDUSTRY_STRATEGY_CONFIG.md)

这些文档可以直接作为 Jira Story 或 Sprint 任务的拆解依据。

**说明**：以上预估基于当前 MODAUI 架构，实际排期需由代理团队根据人员配置进行最终确认。
