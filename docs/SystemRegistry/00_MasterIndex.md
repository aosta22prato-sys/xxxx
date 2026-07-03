# ECOS Master Index (系统总索引)

## 研发最高准则 / Architecture Lock v1.0
任何新页面、非独立通用组件、数据表、接口开发前，**必须**在此注册中心进行备案。
未登记即视为不存在，禁止进行无备案代码合并与测试运转。

## 平台业务与核心决策中枢树状拓扑
```text
ECOS Platform (AI Commerce OS)
├── Super Admin (平台超级大盘 & AI 决策控制台)
│   └── AI Brain Center (多智能体决策大脑内核)
├── Shop Controls (商家管理大盘)
│   ├── Sales Center (销售大盘)
│   ├── Product Center (商品库管理)
│   ├── Order Center (多币种跨国订单处理)
│   ├── Customer Center (CRM 客户关系中枢)
│   ├── Marketing Center (营销与增长分流)
│   ├── Finance Center (财务统计与算效损益)
│   ├── Logistics Center (跨境智运物流)
│   └── AI Navigation Center (AI 导航与知识检索中枢) [NEW]
├── Platform Infra (核心基础设施)
│   ├── POS (Sales Channels > Point Of Sale [PLANNED])
│   ├── CMS (Content Management System [PLANNED])
│   ├── Settings Center (租户、店铺及角色授权设置)
│   └── Apps Marketplace (应用与扩展插件市场)
```

## 全站模块状态字典说明
- `[DEV]` : 开发进行中，尚未转入发布
- `[TEST]` : 已在沙箱或边缘进行合规测试中
- `[LIVE]` : 已经进入生产环境，冻结任意修改
- `[DEPRECATED]` : 冗余废弃历史组件，已作硬防错隔离

## 现存核心主注册表 (System Registries)
- [01_SystemMap.md](01_SystemMap.md) - 全平台主系统地图架构
- [02_PageRegistry.md](02_PageRegistry.md) - 前提应用页面及子模块备案记录
- [03_ComponentRegistry.md](03_ComponentRegistry.md) - 核心模块微组件与功能备案
- [04_AgentRegistry.md](04_AgentRegistry.md) - 多宿主 AI 智能体/角色配置说明
- [05_PlaybookRegistry.md](05_PlaybookRegistry.md) - 自动连带经验法则（Playbook）定义
- [06_DatabaseRegistry.md](06_DatabaseRegistry.md) - 核心 dbEngine 的数据表与隔离逻辑
- [07_APIsRegistry.md](07_APIsRegistry.md) - 边缘调用与 SDK 通道定义
- [08_DevelopmentLedger.md](08_DevelopmentLedger.md) - 历史迭代与开发账目流水
- [09_DeprecatedRegistry.md](09_DeprecatedRegistry.md) - 淘汰旧代码与隔离防错机制记录
- [10_TodoRegistry.md](10_TodoRegistry.md) - 持续存活待办工作面板 

## 新增核心运行注册表 (Added Core Registries v1.1)
- [11_NavigationRegistry.md](11_NavigationRegistry.md) - 全局寻路路由地图与同义词别名注册中心 (P0)
- [12_FeatureRegistry.md](12_FeatureRegistry.md) - 核心特征组件嵌入以及微系统功能备案表 (P0)
- [13_ModuleOwnershipRegistry.md](13_ModuleOwnershipRegistry.md) - AI 高管职责分工与所有权划分红线矩阵 (P0)
