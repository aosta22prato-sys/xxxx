# 代码组件注册中心 (Component Registry)

## 📌 技术目的
记录全站核心技术组件（并非一页一页的顶层路由，而是嵌套在顶层页面内的元器件、独立插件或微架构系统），以便开发时秒级检索，绝不进行二次造轮子。

---

## 🏗️ 核心技术二级/三级组件清单

### 1. Component: EcosCEODashboard
* **物理路径**: `src/components/admin/ai-brain-center/EcosCEODashboard.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ CEO驾驶舱)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: ECOS Kernel Group
* **最近修改时间**: 2026-06-10
* **功能描述**: 用于向平台超级管理员展示今日实时的大盘宏观损益、高利润品类机会发现、自动进行高危告警。

### 2. Component: AIExecutionControlCenter
* **物理路径**: `src/components/admin/ai-brain-center/AIExecutionControlCenter.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 决策链)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: Core Execution Devs
* **最近修改时间**: 2026-06-10
* **功能描述**: 执行决策自愈与手动干预中心。允许管理员对 AI 发起的营销短信、自动对齐法国仓补货订单进行“一键批准”、“一键驳回”或“执行重试”。

### 3. Component: AIDiscoveryCenter
* **物理路径**: `src/components/admin/ai-brain-center/AIDiscoveryCenter.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 探索盲点)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: AI Discovery Team
* **最近修改时间**: 2026-06-10
* **功能描述**: 自动感知全网络数据空缺、热点及法国市场 SKU 流速高点，协助总后台进行供应链扩招决策。

### 4. Component: EcosPerformanceOptimizer
* **物理路径**: `src/components/admin/ai-brain-center/EcosPerformanceOptimizer.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 算效调优)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: Token Optimization Ops
* **最近修改时间**: 2026-06-10
* **功能描述**: Token 算力最大化监控与防调用雪崩保障。可视化追踪由于 HMR 触发或由于过度思考产生的无谓 Token 代币泄露。

### 5. Component: EcosCognitiveGovernance
* **物理路径**: `src/components/admin/ai-brain-center/EcosCognitiveGovernance.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 认知审计)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: AI Safety & Audit Group
* **最近修改时间**: 2026-06-10
* **功能描述**: 多智能体底层宪章审查。当决策脑做出违反毛利率限度的补货行为或打折幅度超过20%时，触发治理级红线拦截。

### 6. Component: EcosEnterpriseNervousSystem
* **物理路径**: `src/components/admin/ai-brain-center/EcosEnterpriseNervousSystem.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 数据突触)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: Database Synchronizer Staff
* **最近修改时间**: 2026-06-10
* **功能描述**: 跨多租户大并发调用边缘网关监控。实时输出租户库读写响应时间与微服务心跳。

### 7. Component: EcosMasterDirectory
* **物理路径**: `src/components/admin/ai-brain-center/EcosMasterDirectory.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 系统地图/系统注册表)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: Platform Master Group
* **最近修改时间**: 2026-06-10
* **功能描述**: 全系统的唯一主注册表总控看板。支持 AI 高清导航寻路模糊搜索测试、以及手动提交路由登记、清仓注销，保障物理及语意路由顺畅。

### 8. Component: EcosGovernanceConsole
* **物理路径**: `src/components/admin/ai-brain-center/EcosGovernanceConsole.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 规则宪章)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: Core Memory Devs
* **最近修改时间**: 2026-06-10
* **功能描述**: 记忆引擎的核心维护端。允许管理员直接输入或修改商户底层基因、品牌中高端调性判定规则、毛利红线等。

### 9. Component: EcosAdvancedLayers
* **物理路径**: `src/components/admin/ai-brain-center/EcosAdvancedLayers.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 议事中心)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: Advanced Cognitive Team
* **最近修改时间**: 2026-06-10
* **功能描述**: 承载财务脑、物流脑、营销脑、风控脑的多智能体董事会博弈争论辩论模块，展示从矛盾异议到最终妥协自愈的思考深度。

### 10. Component: EcosStrategicIntelligence
* **物理路径**: `src/components/admin/ai-brain-center/EcosStrategicIntelligence.tsx`
* **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 战略模拟)
* **状态编码**: `[LIVE]` (100%)
* **主要负责人**: Gamification & Simulation Group
* **最近修改时间**: 2026-06-10
* **功能描述**: 逆事實、多因果模擬演算卡片。提供商户长周期经营可能出现的黑天鹅场景演习。
