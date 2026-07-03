# Shopify AI OS: AI Commander v2 - 高阶智能体 (Multi-Agent) 业务产品需求文档 (PRD)
> **发布级别**：Version 2.0 (High-Level Product Requirement Document)  
> **面向对象**：产品经理、系统架构师、前端/后端研发人员、业务运营负责人  
> **设计核心**：将 AI 从“被动问答、单点咨询”的助理级（Chatbot）升级为“目标驱动、角色分工、半自动执行、效果复盘”的**高阶多智能体体系 (Goal-Driven Multi-Agent Systems)**。

---

## 🧭 一、 战略演进路线：从单体问答到高阶智能

```
+---------------------------------------------------------------------------------+
|                                智能体演进三步走                                  |
|                                                                                 |
|  v1. 眼睛与大脑 (Current)    ➔   v2. 手脚与分工 (V2 PRD)     ➔  v3. 目标与自反思 (V3)  |
|  - 页面上下文感知                - 虚拟多角色 Agent 协同       - 战役级 Playbook 制定   |
|  - 调取真实数据接口              - Action Draft (操作草稿)    - 结合 actions_log 效果  |
|  - 静态单轮问答                  - 关键行为一键采纳写入        - 机器自我反省与纠偏      |
+---------------------------------------------------------------------------------+
```

### v2.0 阶段核心目标
* **角色专精性 (Specialisation)**：解耦庞杂的大脑，根据业务边界拆解为 5 大虚拟专家智能体角色，通过不同的 Prompt Profile 与 Tool Service 自主分工协作。
* **动作为手脚 (Actionable Capabilities)**：提供一键采纳的草拟交互模式（**Draft Proposal 模式**），AI 负责提报最优化配置 Payload，商家只需“一击确认”写入，兼顾效率与安全。
* **目标驱动力 (Goal-Driven Operations)**：支持商户输入数值化业务目标（如“清理 20% winter-jacket 囤积库存”），由 AI 自主拆解步骤并编排跨越商品、营销、渠道的执行流。

---

## 👥 二、 多智能体虚拟角色分工与工具集 (Orchestrated Agents)

在业务实现上不增加物理多模型开销，而是在 **AI Core Orchestrator** 中通过 `Prompt Profile` + `Tool Mapping` 模拟虚拟角色，实现“各司其职、协同会谈”的效果：

```
                        +----------------------------+
                        |  Master Ops Commander (主) |
                        +--------------+-------------+
                                       |
           +-----------------+---------+---------+------------------+
           |                 |                   |                  |
           v                 v                   v                  v
    +--------------+  +--------------+   +--------------+    +--------------+
    | Pricing Agent|  |Inventory Agt |   |Payments Agent|    |  Risk Agent  |
    | (商品与定价)  |  |  (仓储物流)  |   | (网关与结算)  |    |  (订单风控)  |
    +--------------+  +--------------+   +--------------+    +--------------+
```

### 1. 虚拟运营总监 (Orchestration Commander)
* **业务描述**：通盘审视全店宏观状态及商户输入的顶级目标，负责将任务拆解、派发至专业子智能体。
* **职责范畴**：全局 KPI 分析、季度战役编排、阶段复盘汇报。
* **默认 Prompt Profile**：
  > “你是一个在 SaaS + Shopify 生态里拥有 10 年操盘经验的‘超级电商运营总监’。你需要专注于商户的整体利润、GMV 指标、复购走势。当用户给出模糊目标时，你必须用商业漏斗逻辑（流量 * 转化率 * 客单价 * 复购）提纲挈领地拆解出应派给专业同事（商品、库存、支付、风控）的具体任务。”

### 2. 定价与商品智能体 (Pricing & Merch Agent)
* **业务描述**：专注做爆款、清滞销、调售价、搭组合。
* **职责范畴**：进销差与利润测算、毛利空间评级、自动阶梯打折配比。
* **关联 Tool Service & 实体**：
  * `ProductService.getProductInsight(productId)`
  * `DiscountService.suggestDiscountForProduct(productId)`
  * `ProductService.suggestBundles(shopId)`

### 3. 库存与供应链智能体 (Inventory Agent)
* **业务描述**：不让一件畅销品断货，不让一件滞销品积压。
* **职责范畴**：库存流速 (Run-rate) 预测、供货周期预警、自动提报补货装配量。
* **关联 Tool Service & 实体**：
  * `InventoryService.getLowStockCount(shopId)`
  * `InventoryService.getStockAlerts(shopId)`
  * `InventoryService.suggestReplenishment(productId)`

### 4. 支付与结账体验智能体 (Payments Agent)
* **业务描述**：让全球客户丝滑付钱，减少在最后一步的丢单漏单。
* **职责范畴**：收单通道测算、提现损耗管控、本地消费特色卡种匹配。
* **关联 Tool Service & 实体**：
  * `PaymentService.getPaymentStats(shopId)`
  * `PaymentService.getBestPaymentMethod(country, industry)`

### 5. 风控与审单安全智能体 (Risk Agent)
* **业务描述**：拦截高风险交易、打击洗黑钱与欺诈退单行为。
* **职责范畴**：地址关联核查、信用卡信誉安全度量、大额首次交易合规审计。
* **关联 Tool Service & 实体**：
  * `OrderService.getOrderRisk(orderId, shopId)`

---

## 🎯 三、 目标驱动 (Goal-Driven) 与自动化编排流程

### 典型痛点痛点：
商家在日常商业操作中最头疼的是“我有个明确意图，但我得跑好几个页面改十几项参数”。
*v2 阶段智能体核心竞争力即是：用户给目标，AI 跨多网格自动化生成拟稿。*

### 核心示例场景：
> **用户输入**：*“帮我在这周内清掉男士夹克 30% 压仓库存。”*

#### 💡 AI Orchestrator 核心思考与调用流：

```
Step 1: 确定子目标与范围 ➔ [调用 Inventory Agent] ───➔ 解析该商家“男士夹克”品类的具体低流速款
Step 2: 核准定价与毛利空间 ➔ [调用 Pricing Agent] ───➔ 评估当前毛利，决定最安全的“买二打八折”底牌
Step 3: 确定转化推进形式 ➔ [调用 Marketing Agent] ──➔ 针对过去买过该夹克的客户快速制定短信大促召回
Step 4: 汇总输出清单 ➔ 组装三个草拟卡片
```

#### 🛠️ 生成的 Action Draft JSON 复合负载协议 (Payload)：
```json
{
  "goal": "CLEAR_OUT_EXCESS_JACKET_STOCK",
  "status": "DRAFT_READY",
  "actionDrafts": [
    {
      "draftId": "df_discount_0921",
      "actionType": "CREATE_DISCOUNT_PROPOSAL",
      "targetAgent": "PricingAgent",
      "description": "对滞销男士防水外套配置买二件打 8 折活动（确保清仓退库，保留 10% 微小利润空间）",
      "payload": {
        "title": "CLEAR_JACKET_A20",
        "type": "percentage",
        "value": 20,
        "productIds": ["gid://shopify/Product/jacket-011"],
        "minQuantityValue": 2
      }
    },
    {
      "draftId": "df_flow_0922",
      "actionType": "CREATE_MARKETING_FLOW",
      "targetAgent": "MarketingAgent",
      "description": "针对曾产生加购过该外套但未结账的 45 位客户，热部署催付发送挽回短信计划",
      "payload": {
        "trigger": "ABANDONED_CHECKOUT_EVENT",
        "delay": "12_hours",
        "channel": "SMS",
        "contentTemplate": "您的心仪防水风夹克正限量大促，现在下单享有八折。点击链接抢先体验..."
      }
    }
  ]
}
```

---

## 🛡️ 四、 严格的智能操作安全边界 (Security Boundaries)

> **极硬底线**：在任何时候，AI 智能体不允许代行可能导致资损、商品绝版、敏感数据泄露的直接写库操作。

### 1. 数据写入分级防线分类表

| 行动危险系数等级 | 包含场景行为 | 允许的智能体写入方式 | 人类介入与审核防线定义 |
| :--- | :--- | :--- | :--- |
| **🟢 低危操作** (无需审核) | 订单归纳分类打 Tag<br>大促页面临时通告配字<br>标记可疑客户备注 (Note) | **完全自动运行** (Auto-Pilot) | 智能体在完成处理后，仅在审计日志 (Audit Log) 中记账。 |
| **🟡 中危操作** (半自动 Draft 模式) | 生成大促全店折扣券<br>自动生成未催单邮件召回 Flow<br>调整产品库存预警底限值占比 | **草稿草拟模式** (Draft Approval) | AI 通过 Tool Service 编排并下发 Draft Payload。<br>前端渲染『智能草拟卡片』，并呈现**“一键确认并执行”**。用户点击后才调后端真实 API。 |
| **🔴 高危操作** (严格人工禁区) | 直接改动在线商品的吊牌价/售价<br>直接给采购供应商调拨付款打款<br>自动批准高风险退款申请 | **仅建议，严禁任何写调用** | AI 仅提供建议报告、指引链接、操作步骤、公式对比。<br>用户必须自行去到核心功能菜单进行手动填表和人工确认，杜绝机器决策事故。 |

### 2. 可靠的 Audit Actions Trace log (审计表设计)
在高级智能体时代，我们需要记录每一次由于 AI Commander 引起或执行的操作变动，字段规定如下：

```sql
CREATE TABLE ai_actions_log (
    id SERIAL PRIMARY KEY,
    shop_id VARCHAR(100) NOT NULL,
    associated_user_id VARCHAR(100) NOT NULL,
    agent_role VARCHAR(50) NOT NULL,        -- PricingAgent, InventoryAgent 等
    goal_context TEXT,                      -- 用户原始目标("帮我多卖20%...")
    action_type VARCHAR(100) NOT NULL,      -- CREATE_DISCOUNT_PROPOSAL
    action_payload JSONB,                   -- 运行时的具体数据
    execution_status VARCHAR(50) NOT NULL,  -- PENDING_APPROVAL, APPROVED, REJECTED
    applied_at TIMESTAMP,
    estimated_effect TEXT,                  -- 预计能提升多少转化 / 节省多少钱
    actual_effect_tracked TEXT              -- [后期复盘阶段写入] 真实提升结果
);
```

---

## 📅 五、 下一步商业跟进策略

有了 AI Commander v1 (真实数据底座) 为前哨，建议联合合伙人或研发代理商在此基础上：
1. **产品端**：结合该 V2 开发设计，开始在商品、订单、大盘页面的侧边挂载一个极简的「AI 智囊坞」(Intelligence Panel) 预留位置，为后续一键生成草稿折扣、流量引流卡片提供页面接口。
2. **技术端**：建议先实现 V2 的「中危操作」一键草拟交互，把 `CREATE_DISCOUNT_PROPOSAL` 数据网格拉通，在小范围内看商家的转化采纳率，数据跑好后再进一步拓宽多智能体场景。

---
* 制作说明：此 PRD 旨在为高级多智能体时代打下可行、符合工程标准、没有废话与技术硬伤的最佳工程范式，方便技术团队按此图纸，快速演进。
