# ECOS Feature Registry (全平台功能注册表)

## 1. 核心概述
功能注册表（Feature Registry）是 ECOS 在特定视图或子系统中嵌入的功能性模块目录。该表清晰注明每个核心特征在代码库中的具体文件定位（宿主位置），并声明其是否属于独立组件或父组件的嵌入功能。

---

## 2. 核心功能备案库

### 2.1 AI 决策与控制中心 (AI Decision Core)

#### [Feature-01] AI执行控制中心 (AI Execution Control Center)
- **关联路由 / 路径**: `AI中枢 -> 执行控制` (`/admin/ai/execution`)
- **文件宿主**: `src/components/admin/ai-brain-center/AIExecutionControlCenter.tsx`
- **状态 (Status)**: `ACTIVE`
- **独立组件/文件 (Stand-alone File)**: `YES`
- **负责人 (Owner)**: AI Brain Center / Tech Ops
- **职责**: 高管自动化运作审批、自愈执行控制、配代币清算审查。
- **最后更新时间**: 2026-06-10

#### [Feature-02] AI自愈验证层 (AI Autonomic Self-Healing Verification Layer)
- **关联路由 / 路径**: `AIExecutionControlCenter` 内嵌
- **文件宿主**: `src/components/admin/ai-brain-center/AIExecutionControlCenter.tsx [Embedded]`
- **状态 (Status)**: `ACTIVE`
- **独立组件/文件 (Stand-alone File)**: `NO`
- **负责人 (Owner)**: AI Autonomic Brain (自愈执行控制大脑)
- **职责**: 验证运行失败的触发指标、自恢复沙箱策略和事件自矫正重放。
- **最后更新时间**: 2026-06-10

---

### 2.2 战略与宏观风控域 (Strategic & Risk Control)

#### [Feature-03] ECOS 总裁主管驾驶舱 (AI CEO Dashboard)
- **关联路由 / 路径**: `AI中枢 -> 总裁驾驶舱` (`/admin/ai/ceo-dashboard`)
- **文件宿主**: `src/components/admin/ai-brain-center/EcosCEODashboard.tsx`
- **状态 (Status)**: `ACTIVE`
- **独立组件/文件 (Stand-alone File)**: `YES`
- **负责人 (Owner)**: Enterprise CEO Brain
- **职责**: 统计前四维度核心经营数据（今日销售额、今日利润、库存风险、广告风险、现金流预警）、展示AI正在做什么、AI学到了什么、AI董事会辩论记录等商家决策辅助大屏。
- **最后更新时间**: 2026-06-10

#### [Feature-04] ECOS 人工治理委员会 (Human Governance Console)
- **关联路由 / 路径**: `AI中枢 -> 安全治理 -> 人工宪法合规介入`
- **文件宿主**: `src/components/admin/ai-brain-center/EcosCognitiveGovernance.tsx`
- **状态 (Status)**: `ACTIVE`
- **独立组件/文件 (Stand-alone File)**: `NO`
- **负责人 (Owner)**: Platform Super Admin / Cognitive Governor
- **职责**: 主动调低AI权限、一票否决高风险高代币采购、配置智能体最高红线。
- **最后更新时间**: 2026-06-10

#### [Feature-05] 欧盟政策与 GDPR 合规网关 (EU GDPR Policy Guard)
- **关联路由 / 路径**: `系统设置 -> 安全与合规`
- **文件宿主**: `src/components/PoliciesManagement.tsx`
- **状态 (Status)**: `ACTIVE`
- **独立组件/文件 (Stand-alone File)**: `YES`
- **负责人 (Owner)**: Corporate Compliance Officer
- **职责**: 多语言条款模板配置、欧盟GDPR跨境信息拦截与免责声明声明合规审计。
- **最后更新时间**: 2026-06-10

---

### 2.3 自动诊断与探索域 (Discovery & Self-Repair)

#### [Feature-06] ECOS 盲点诊断中心 (Discovery Center)
- **关联路由 / 路径**: `AI中枢 -> 诊断发现`
- **文件宿主**: `src/components/admin/ai-brain-center/AIDiscoveryCenter.tsx`
- **状态 (Status)**: `ACTIVE`
- **独立组件/文件 (Stand-alone File)**: `YES`
- **负责人 (Owner)**: AI Discovery Agent
- **职责**: 主动探测业务盲点（例如冷热货流转化率突跌、爆品库存脱销等）自动发起补充知识库的学习任务。
- **最后更新时间**: 2026-06-10

---

## 3. 功能引入准则 (Feature Access & Merge Control)
任何新特性、非页面内嵌小功能，**必须**遵循以下开发流程：
1. **前期审核**: 查阅本 `FeatureRegistry.md` 是否有同类型已备案功能，防止功能重复开发。
2. **入库登记**: 在新功能合并前，在上面表格追加一条记录，注明宿主位置、负责人和关联接口。
3. **完成审核**: 完成 `compile_applet` 测试，登记状态标记为 `ACTIVE` 即可进行生产版本发布。
