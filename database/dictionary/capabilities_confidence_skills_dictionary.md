# AI Commerce OS - 数据字典 (核心脑力与技能共享表 Phase 203 - Phase 206)

本文档面向 **Enterprise Brain（系统后台经营大脑）** 下的 Phase 203 至 Phase 206 核心关系型表进行详细的数据结构描述。这些表旨在支持系统自主审计、置信度流控限制、核心技能升级以及多店之间物理隔离、逻辑匿名的经验共享网络。

---

## 1. 数据表：`capability_scores` (Phase 203)
自研测度工具，用于脑在各个局部市场和核心职能范畴内，自我评估其绝对经营能力的打分数据库。

| 字段名称 (Column Name) | 数据类型 (Data Type) | 允许空值 (Nullable) | 描述 (Description) |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 (NO) | 经营能力核心主键 (如 `cap_fr_ops` 等) |
| `tenant_id` | `VARCHAR(50)` | 否 (NO) | 归属的租户唯一标识符 |
| `name` | `VARCHAR(150)` | 否 (NO) | 能力项目具体描述性名称 (如“法国市场经营能力”) |
| `category` | `VARCHAR(100)` | 否 (NO) | 能力范畴划分 (`market_operation`, `inventory_opt`, `customer_recall`, `pricing_model`) |
| `score` | `INTEGER` | 否 (NO) | 理智得分评价，区间为 $0 - 100$ 之间的整数 |
| `trend` | `VARCHAR(20)` | 否 (NO) | 近一阶段理智涨跌倾向 (`up`, `down`, `stable`) |
| `assessed_at` | `TIMESTAMP` | 否 (NO) | 最新一次执行对账诊断审计的更新时间 |
| `strengths` | `TEXT[]` | 是 (YES) | 大脑自我沉淀的经营优势要点文本数组 |
| `weaknesses` | `TEXT[]` | 是 (YES) | 大脑自我审视的不足及流动资产流失的短板数组 |

---

## 2. 数据表：`decision_confidences` (Phase 204)
置信度引擎核心对账与授权自愈控制表。系统做出任何重要经营动作前，都需要对此表参数进行检验。**若存在分项指标低于 $70\%$，自动将要求 manual 宪法复核标记置为 TRUE！**

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 主键，前缀 `conf_` |
| `tenant_id` | `VARCHAR(50)` | 否 | 多租户账户 ID |
| `decision_ref_id` | `VARCHAR(50)` | 否 | 归纳关联的某具体行动方案或者假设 / 策略 ID (级联 `strategy_plans(id)`) |
| `decision_type` | `VARCHAR(55)` | 否 | 决策类型分类 (`replenishment`, `pricing`, `recall`, `strategy`) |
| `title` | `VARCHAR(200)` | 否| 本次要做出置信度计算和控制的战役名称 |
| `decision_confidence` | `INTEGER` | 否 | 核心定价/补货模型本身自愈可信度打分 (0-100) |
| `strategy_confidence` | `INTEGER` | 否 | 当前策略在 A/B 实验和证伪系统下的理论自洽得分 (0-100) |
| `forecast_confidence` | `INTEGER` | 否 | 未来周转营收预期趋势精确度评分 (0-100) |
| `requires_governor_approval`| `BOOLEAN`| 否 | 是否低于置信阈值 (70%)。如是则强制冻结自动执行，进入超级后台 Governor 人机审核链条 |
| `governor_status` | `VARCHAR(35)` | 否 | 治理状态项 (`pending_review`, `approved`, `rejected`, `auto_passed`) |
| `analysis_breakdown` | `TEXT` | 否 | 评估审计报告详细 breakdown Markdown 或 JSON |
| `assessed_at` | `TIMESTAMP` | 否 | 评估执行时刻 |

---

## 3. 数据表：`skill_graph_nodes` (Phase 205)
经营技能图谱核心关联表。代替单纯存留数据，现在系统能够对本大脑本身的五大行业维度技能进行“经验等级”升级。

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 主键，前缀 `skill_` |
| `tenant_id` | `VARCHAR(50)` | 否 | 租户隔离标识 |
| `skill_key` | `VARCHAR(100)`| 否 | 技能内核注册 Key (比如 `market_expansion`, `inventory_optimization` 等) |
| `name` | `VARCHAR(150)`| 否 | 人类可读名称 (如“动态定价”、“亏损阻断”) |
| `level` | `VARCHAR(30)` | 否 | 技能综合熟练度评估等级 (`Novice`, `Competent`, `Advanced`, `Expert`, `Master`) |
| `success_rate` | `INTEGER` | 否 | 历史所有搭载此项技能的战役中对账判定成功的胜率百分数 (0-100) |
| `historical_revenue_gain` | `NUMERIC(15,2)`| 否 | 历史累计帮助租户店面提升并且结网实收的历史营收回流总金量 (USD) |
| `failure_rate` | `INTEGER` | 否 | 失败百分率 (0-100) |
| `experience_count` | `INTEGER` | 否 | 调取该引擎深度学习和参与事务决策的历史累计总次数 |
| `last_used_at` | `TIMESTAMP` | 否 | 最近一次投入战斗并记录其 outcome 的时间点 |
| `updated_at` | `TIMESTAMP` | 否 | 节点经验校准修正时间撮 |

---

## 4. 数据表：`cross_store_experiences` (Phase 206)
跨店铺匿名的核心经验共享资源池。**在这里任何 Tenant 信息都已单向不可逆彻底散列哈希，没有任何销售数额，只有“相对增长比率”和“平均效果得分”**，以此搭建 Shopify Sidekick 级对冲共享网。

| 字段名称 | 类型 | 允许空值 | 描述 |
|---|---|---|---|
| `id` | `VARCHAR(50)` | 否 | 核心主键，前缀 `cse_` |
| `original_tenant_id_hash`| `VARCHAR(100)`| 否 | 被单向加密的来源租户 Hash，绝无泄漏可能。用作统计排重 |
| `market_country` | `VARCHAR(10)` | 否 | 商业起效的区域板块码 (如 FR, DE, UK 等) |
| `product_category` | `VARCHAR(100)`| 否 | 实装商品分类 (如 `clothing`, `shoes`, `decor`) |
| `strategy_type` | `VARCHAR(100)`| 否 | 策略抽象战术分类 (`reduction_percentage`, `loyalty_edm` 等) |
| `action_detail` | `TEXT` | 否 | 脱敏脱店后的具体行动细节经验描述 |
| `outcome_gmv_growth_pct` | `NUMERIC(5,2)`| 否 | 录得的实际 GMV 百分比环比增幅 (如 +18.20%) |
| `sample_size` | `INTEGER` | 否 | 该类案例统计大群组重叠累加分析样本集基数规模 |
| `avg_revenue_impact` | `NUMERIC(15,2)`| 否 | 脱敏评估折合的平均直接资金回流水平 (USD) |
| `confidence_rating` | `INTEGER` | 否 | 经验可复用可复现置信度评析 (0-100) |
| `created_at` | `TIMESTAMP` | 否 | 脱密共享时刻 |
