# 禁止重复开发检测中心 (Duplicate Guard)

## 📌 防核增工程铁规
在开发任何核心辅助工具、通用拦截层、弹出窗体或数据模型前，**必须**首先通读本规程。
一旦发生功能或代码文件重复建设，将受到系统自愈程序的强制注销（Deprecated）。

---

## 🚫 已存在的高认知/技术机制一览表 (Avoid Rebuilding)

### 1. 自动执行控制与风险拦截层 (ExecutionVerificationLayer)
* **已存在位置**: `src/components/admin/ai-brain-center/AIExecutionControlCenter.tsx`
* **底层机制**: 拦截 AI 自主决策方案。凡是自动提出的金额大于阈值或具有降级逻辑的决策，必须在这里先获得人类批准。
* **规避说明**: **不要**在商家端工作台、营销中心或订单中心内重新编写相同的 AI 审核流或弹出弹窗！需要批准直接将 Proposal 的 `status` 变更为 `PENDING`，用户会统一在工作台和执行控制中心看到。

### 2. 人类安全治理及合规面板 (HumanGovernanceCenter)
* **已存在位置**: `src/components/admin/ai-brain-center/EcosCognitiveGovernance.tsx`
* **底层机制**: 控制和纠错 AI 超限度运作、记录违反基因底线的智能案例。
* **规避说明**: **不要**试图再次编写名为 `AIComplianceChecker` 或 `ModelReferee` 的组件。直接调用认知审计中心对事件进行落库追踪。

### 3. 主系统主目录检索器 (EcosMasterDirectory)
* **已存在位置**: `src/components/admin/ai-brain-center/EcosMasterDirectory.tsx`
* **底层机制**: 整合了系统页面、代码组件、Playbooks 的检索及动态别名导航跳转。
* **规避说明**: **不要**自行编写名为 `SystemMap`、`PageSearcher` 或 `RouteRedirector` 的重复代码！有任何导航功能统一通过 `window.ECOS_NAVIGATE(route)` 或注册在主目录表格中。

### 4. 实时响应式多租户关系数据库模型 (dbEngine)
* **已存在位置**: `src/db/dbEngine.ts`
* **底层机制**: 持久化及多租户物理硬防错读写驱动层（`localStorage` 驱动，秒级落库且支持 pub-sub `subscribe` 方法联动视图更变）。
* **规避说明**: **不要**引入任何诸如 `mockDatabase.ts`、`localDataStore.ts` 或临时本地静态 State 来搞伪装演示！全系统必须且只能读写 `dbEngine`，做到物理数据的一元化。
