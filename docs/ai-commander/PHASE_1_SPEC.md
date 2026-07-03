# AI Commander OS 第一阶段（生产版）开发任务说明文档

## 一、项目背景与目标
要在现有 SaaS 后台中，接入一个「上下文感知的 AI 指挥官」（AI Commander）。
本阶段目标：
在不修改现有布局、不增加新页面、不做调试功能的前提下，让 AI 能够：
- 自动感知当前租户 / 店铺 / 行业 / 页面 / 操作对象
- 自动读取真实经营数据（销售、订单、库存、支付等）
- 在用户随口提问时，基于真实上下文和数据给出运营建议

要求做到：
管理员登录总后台，打开任意模块，在已有的 AI 输入框里直接问话，AI 就能「带着上下文」给出有用的商业决策建议，而不是像一个脱离系统的泛用聊天机器人。

## 二、总体技术思路
整个 AI 流程拆成三层：
1. **Runtime Context（上下文服务）**
   - 负责统一收集：「当前租户 / 店铺 / 行业 / 页面 / 当前对象 / 国家 / 币种 / 关键经营指标」
2. **Tool Service（业务服务层）**
   - 按业务域拆分为：ProductService、OrderService、CustomerService、FinanceService、InventoryService、MarketingService、PaymentService
3. **LLM Orchestrator（AI 调度层）**
   - 从 Runtime Context 拿到上下文，调用 Tool Service 获取真实数据，交给 LLM 生成最终回答。

## 三、实现细节

### 1. AI Runtime Context (AIContextService)
提供统一的后台服务，构造完整的 AI 请求上下文。
- **ShopContext**: 租户、店铺、行业、国家、币种、生命周期。
- **UserContext**: 用户 ID、角色、权限、语言。
- **UIContext**: 页面类型（Dashboard, Products, Orders, etc.）、当前操作对象 ID。
- **MetricsContext**: 今日/本月销售额、订单数、利润、库存预警等。

### 2. Tool Service
封装真实的业务查询方法，禁止 LLM 编造数据。
- `ProductService`: 获取商品动效、库存。
- `OrderService`: 订单摘要、风控评分。
- `CustomerService`: 客户画像、流失分析。
- `FinanceService`: 销售统计、利润计算。

### 3. 系统级 Prompt 约束
在 System Prompt 中强制 AI：
- 自动识别当前页面和行业。
- 优先引用真实业务指标。
- 严禁生成假数据或脱离业务上下文。

## 四、当前进度（已完成）
- [x] 后端 `AIContextService.ts` 实现。
- [x] 后端 `ToolService.ts` 实现。
- [x] `server.ts` 中集成 `/api/ai/ask` 接口。
- [x] 前端 `MerchantDashboard.tsx` 切换到新的指挥官接口。
