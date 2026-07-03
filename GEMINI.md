# AI Commerce OS - Coding Guidelines & System Instructions

You MUST adhere to the architecture rules defined in `/AGENTS.md`.

## 关键要点 
1. **彻底的商家端 (Merchant Workbench) 与平台后大脑 (Enterprise Brain) 隔离**。
   - 任何 `Knowledge Graph`, `World Model`, `Reasoning Chain`, `Evidence Hierarchy`, `Enterprise Nervous System`, `Cognitive Governance` 等人工智能底层推理大屏与内核参数展示，**绝对禁止**出现在商家端。
   - 商家端（`SaaSMerchantWorkbench.tsx`）已被清理为纯粹的结果、订单、商品管理和轻量级 `AI 经营助手` 交互界面。不允许任何人在此界面加入底层算法演示。
2. **AI中枢 (Enterprise Brain)**：
   - 所有的 AI 内核、推理图谱、世界模型、审计、治理和神经系统监视组件，现在全部收纳在 `src/components/admin/ai-brain-center/` 文件夹中。
   - 该部分只在 **平台总后台/超级管理员中心 (SuperAdminCenter / SuperAdminConsole)** 下的“AI中枢”中进行渲染。
3. **真实性原则**：
   - 禁止任何 Demo 页面、模拟数据和假按钮。所有的指标评分、事件跟踪、审计日志必须有真实的数据结构（例如 `./src/db/dbEngine` 或 Firestore）承载并落库持久化，能真正起到决策自愈与业务调配的作用。
   - 保证完整的数据库描述文件同步交付（`/database/` 目录）。
