# ECOS Module Ownership Registry (模块职责与所有权总纲)

## 1. 核心概述
为了彻底杜绝多智能体系统（ECOS）演进过程中出现同质化重叠、重复开发及业务职责判定冲突（Module Bloat），特制定本职责所有权注册表。任何开发代理或工程师在扩展 AI 功能包时，**严禁**越界设计，必须按照核心责任矩阵进行单一职责解耦。

---

## 2. 职责所有权定义

### [Ownership-01] 战略决策模块 (Strategic Intelligence Domain)
- **负责组件**: `src/components/admin/ai-brain-center/EcosStrategicIntelligence.tsx`
- **所有者 (Owner)**: `EcosStrategicIntelligence` (企业战略大脑)
- **核心职责 (What to do)**:
  - 核心跨店/多租户业务模拟与红线推演。
  - 单店/全站长周期 ROI 策略仿真与敏感度模拟。
  - 爆仓脱销供应链对冲推荐。
- **禁止边界 (What NOT to do - STRICTLY FORBIDDEN)**:
  - **禁止** 任何资金审批和实效性订单采购拨付动作。
  - **禁止** 拥有对策略执行方案的投票通过或否决权。
  - **禁止** 直接与底层 WMS 进行库存账目对账纠偏。

### [Ownership-02] 议事中心模块 (Boardroom Consensus Domain)
- **负责组件**: `src/components/admin/ai-brain-center/EcosMasterDirectory.tsx [Boardroom Tab]`
- **所有者 (Owner)**: `Boardroom` (多智体议事大厅)
- **核心职责 (What to do)**:
  - 跨职能 AI 高管共同体（安全、销售、财务、运维）对决策指令现场投票对质。
  - 形成统一董事会共识记录并交付备案。
  - 实现最高一票否决权（Veto）。
- **禁止边界 (What NOT to do - STRICTLY FORBIDDEN)**:
  - **禁止** 进行长达 24 个月的宏观趋势预测或经济背景模拟。
  - **禁止** 擅自创建具体的补货建议、单价变动方案。
  - **禁止** 自主更改数据库状态中的实际库存和采购明细。

### [Ownership-03] 安全与认知治理模块 (Governance Domain)
- **负责组件**: `src/components/admin/ai-brain-center/EcosCognitiveGovernance.tsx`
- **所有者 (Owner)**: `EcosCognitiveGovernance` (合规委员会大脑)
- **核心职责 (What to do)**:
  - 监测智能体自主运行的认知漂移与幻觉偏离系数。
  - 人工或自动触发降级、封锁智能体特权接口。
  - 建立 AI 与物理主权安全审查审计回放线。
- **禁止边界 (What NOT to do - STRICTLY FORBIDDEN)**:
  - **禁止** 参与业务获利策略编写。
  - **禁止** 提出任何带有营销拉新、商品上架性质的商业决策。
  - **禁止** 接管和修改任何账本汇率及单店记账财务规则。

### [Ownership-04] 执行与自愈验证模块 (Execution Service Domain)
- **负责组件**: `src/components/admin/ai-brain-center/AIExecutionControlCenter.tsx`
- **所有者 (Owner)**: `AIExecutionControlCenter` / `ExecutionVerificationLayer` (业务安全自愈引擎)
- **核心职责 (What to do)**:
  - 分析具体业务执行报错和 API 网络阻尼。
  - 申请并下放代币采购额度（Token Quota）。
  - 对正在执行的异常操作启动反重置、自愈策略和合规重试。
- **禁止边界 (What NOT to do - STRICTLY FORBIDDEN)**:
  - **禁止** 进行投票合议辩论、模拟董事会多轮质询。
  - **禁止** 主动起草长远的企业经营扩张五年规划（DNA）。
  - **禁止** 参与消费者画像分群与宏观广告算法调优。

---

## 3. 防重构和防止重复开发约束 (SSOT Rule)
1. **开发者自检**: 在创建任何新的 `ts / tsx` 功能文件时，必须核查本所有权总纲。如果要开发的功能落在现有 Owner 的职责内，该功能**必须**封装、集成进对应的 Owner 原生文件中，而不是创建类似的新文件。
2. **所有权扩充**: 只有当全新模块所属职责完全不与这 4 个核心领域冲突（如：新增 `数字孪生数字人` 模块），方可申请追加所有权备案，避免系统陷入自我失忆与功能冗余。
