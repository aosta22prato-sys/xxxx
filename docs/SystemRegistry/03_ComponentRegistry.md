# Component Registry (核心技术组件登记表)

## Component: EcosCEODashboard
- **技术路径**: `src/components/admin/ai-brain-center/EcosCEODashboard.tsx`
- **上级容器**: `SuperAdminCenter` (AI中枢 ➔ CEO驾驶舱)
- **是否可见**: 仅 Super Admin 可见
- **状态编码**: `[LIVE]`
- **功能描述**: 宏观算效评估、异常指标及智能决策调配。

## Component: AIDiscoveryCenter
- **技术路径**: `src/components/admin/ai-brain-center/AIDiscoveryCenter.tsx`
- **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 探索盲点)
- **是否可见**: 仅 Super Admin 可见
- **状态编码**: `[LIVE]`
- **功能描述**: 自动感知系统数据漂移及行业未覆盖空白热区。

## Component: AIExecutionControlCenter
- **技术路径**: `src/components/admin/ai-brain-center/AIExecutionControlCenter.tsx`
- **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 决策链)
- **是否可见**: 仅 Super Admin 可见
- **状态编码**: `[LIVE]`
- **功能描述**: 展现AI计划决策并提供手动驳回、重试或强行热变更机制。

## Component: EcosPerformanceOptimizer
- **技术路径**: `src/components/admin/ai-brain-center/EcosPerformanceOptimizer.tsx`
- **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 算效调优)
- **是否可见**: 仅 Super Admin 可见
- **状态编码**: `[LIVE]`
- **功能描述**: 用于优化智能引擎Token消耗，防止并发调用雪崩。

## Component: EcosCognitiveGovernance
- **技术路径**: `src/components/admin/ai-brain-center/EcosCognitiveGovernance.tsx`
- **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 认知审计)
- **是否可见**: 仅 Super Admin 可见
- **状态编码**: `[LIVE]`
- **功能描述**: 多智能体合规校验、宪法边界检测。

## Component: EcosEnterpriseNervousSystem
- **技术路径**: `src/components/admin/ai-brain-center/EcosEnterpriseNervousSystem.tsx`
- **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 数据突触)
- **是否可见**: 仅 Super Admin 可见
- **状态编码**: `[LIVE]`
- **功能描述**: 侦测底层多租户跨库高频底层日志波形。

## Component: EcosMasterDirectory
- **技术路径**: `src/components/admin/ai-brain-center/EcosMasterDirectory.tsx`
- **上级容器**: `SuperAdminCenter` (AI中枢 ➔ 系统地图 / 注册表)
- **是否可见**: 双端公共 (管理及超管)
- **状态编码**: `[LIVE]`
- **功能描述**: 本系统元注册大盘核心交互看板。

## Component: AINavigationCenter
- **技术路径**: `src/components/AINavigationCenter.tsx`
- **上级容器**: `SaaSMerchantWorkbench` (AI 导航中心 ➔ 算力及 RAG 多轨中枢)
- **是否可见**: 商家端 & 超管端公共
- **状态编码**: `[LIVE]` [NEW]
- **功能描述**: 独立分离于知识库的 ECOS 寻路大脑、Page/Component 注册查询及 RAG Grounding 精准解析中心。
