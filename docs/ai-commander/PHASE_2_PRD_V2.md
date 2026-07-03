# AI Commander OS v2：多智能体 & 目标驱动 PRD 大纲

## 1. 项目背景与第二期目标
在第一阶段（眼睛+基础大脑）成功上线的基础上，第二期旨在将 AI Commander 升级为**主动协作的智能体矩阵**。
- **核心目标**：从“被动问答”转向“目标驱动”，从“口头建议”转向“半自动执行（草稿生成）”。

## 2. 智能体矩阵架构 (Multi-Agent Matrix)
系统不再由单一 LLM 驱动，而是根据任务类型自动调度 5 个专业智能体角色：

### 2.1 运营总监 (Ops Commander) - 核心枢纽
- **职责**：全局目标拆解、跨角色任务分发、优先级管理。
- **输入**：全店 KPI、商户年度/月度目标。
- **工具**：`StoreKpiService`, `AIActionLogService` (复盘用)。

### 2.2 定价与商品专家 (Pricing & Merch Agent)
- **职责**：动态调价建议、促销方案设计、单品动销分析。
- **工具**：`ProductService`, `PricingService`, `DiscountService` (生成折扣草稿)。

### 2.3 库存专家 (Inventory Agent)
- **职责**：缺货风险预测、积压库存清理计划、补货策略。
- **工具**：`InventoryService`, `SupplierService` (模拟)。

### 2.4 支付与结账专家 (Payments Agent)
- **职责**：提升结账转化率、优化本地化支付组合。
- **工具**：`PaymentService`, `ConversionService` (模拟)。

### 2.5 风控专家 (Risk Agent)
- **职责**：高风险订单识别、欺诈预防建议。
- **工具**：`OrderService`, `FraudDetectionService` (模拟)。

## 3. 核心功能需求

### 3.1 目标驱动规划 (Goal-to-Action)
- **用户输入**：自然语言设定目标（如：“下个月 GMV 提升 20%”）。
- **AI 动作**：
  1. 调用 `Ops Commander` 识别增长点（流量？转化率？客单价？）。
  2. 派发子任务给 `Pricing` 和 `Marketing` 角色。
  3. 输出一份包含时间线的「作战计划书 (Playbook)」。

### 3.2 动作草稿化 (Draft-based Execution)
- AI 的建议必须附带**配置草稿 (Actionable JSON)**。
- 前端渲染「建议卡片」，用户点击「确认生成」后，调用后端 API 写入数据库实体。
- **安全准则**：严禁 AI 自主修改生产环境配置，必须经过人类最后一次确认。

### 3.3 行为记忆与闭环复盘 (Action Memory)
- 记录所有 AI 提议及其执行后的业务数据变化。
- 支持复盘对话：“上周你让我搞的第二件半价活动，到底赚了多少钱？”

## 4. 协同方式 (Orchestration)
- **调度层**：基于用户 Input 的关键词和 `currentRoute` 进行意图路由。
- **上下文共享**：所有 Agent 共享 `AIContext`（店铺/用户/UI/指标）。
- **反馈环**：Agent A 的输出可以作为 Agent B 的输入（如库存压力大触发定价促销建议）。

## 5. 开发边界 (Scope)
- **本期做**：多角色 Prompt 路由、动作草稿 JSON 定义、行为日志存储、目标拆解初步逻辑。
- **本期不做**：完全自主的资金拨付、自动修改在线店铺主题代码、多模型分布式训练。

## 6. 验收标准
- **多角色切换**：提问支付问题，系统日志显示使用了 `Payments Agent` 的 Prompt。
- **草稿闭环**：AI 建议促销后，数据库中能查询到对应的 `status: 'draft'` 记录。
- **目标理解**：输入复合目标，AI 能给出 2 个以上不同维度的执行步骤。
