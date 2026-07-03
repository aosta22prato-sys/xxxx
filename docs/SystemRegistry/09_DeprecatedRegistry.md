# Deprecated Registry (废弃及冗余历史组件隔离库)

## File: IntelligenceCenter.tsx
- **历史归属**: SaaS 统计汇报中心
- **废弃时间**: 2026-06-10
- **代替方案**: `SaaSMerchantWorkbench.tsx` (统一合并为极简第一排纯数据看盘，防止大段 AI 废话对商家侵占)。
- **隔离级别**: 已断开所有 UI 入口。

## File: EpicBlueprints.tsx
- **历史归属**: 脑中枢拓扑展示
- **废弃时间**: 2026-06-10
- **代替方案**: `EcosMasterDirectory.tsx` - 包括“ECOS 统一导航地图”和“Decision Graph”。
- **隔离级别**: 已从 Super Admin 主看盘中物理屏蔽。

## File: SuperAdminConsole.tsx
- **历史归属**: 历史版总后台大盘
- **废弃时间**: 2026-06-08
- **代替方案**: `SuperAdminCenter.tsx` - 拥有真正的多租户数据库同步读写，完全取代旧版静态模板。
- **隔离级别**: 完全废置。
