# ECOS Navigation Registry (全平台导航注册中心)

## 1. 核心概述
全平台导航注册中心（Navigation Registry）是 ECOS 网络中唯一、权威、可信的路径检索树。无论是人类管理员、商家用户，还是任何自治 AI 智能体（如 CEOAgent、InventoryAgent），在进行页面跳转、功能指引或工具调用时，**必须**统一查阅本注册中心，禁止采用硬编码或臆测跳转路径。

## 2. 数据结构定义 (Database Schema)
对应的 `dbEngine.navigation_registry` 数据表记录包含以下定义：

| 字段 | 类型 | 说明 | 示例 |
|:---|:---|:---|:---|
| `id` | `VARCHAR` | 节点唯一标识符 | `"products"` |
| `name` | `VARCHAR` | 人类可读显示名称 | `"商品库"` |
| `aliases` | `ARRAY<VARCHAR>` | 中英文近义词、同义词别名列表 | `["产品", "商品", "产品库", "库存"]` |
| `route`| `VARCHAR` | 系统跳转 Tab 状态标识或相对路由 | `"products"` |
| `component` | `VARCHAR` | 对应前端 React 核心页面组件 | `"ProductCenter"` |
| `parent` | `VARCHAR` | 上级系统归属（`operations` \| `system` \| `ai` \| `developer`） | `"operations"` |
| `status` | `VARCHAR` | 当前节点生命周期状态 | `"LIVE"` |
| `permissions` | `ARRAY<VARCHAR>` | 角色访问授权控制（`Admin` \| `Merchant` \| `Developer`） | `["Admin", "Merchant"]` |
| `description` | `TEXT` | 节点业务职能与描述说明 | `"管理全谱 SKU 目录、库存预警与采购调度"` |

---

## 3. 生产环境活跃路由注册表
以下列表已经全面持久化于 ECOS 运行时。任何新模块的引入，必须严格按照本规范在 `/src/db/dbEngine.ts` 初始化种子中进行双向入库。

```json
[
  {
    "id": "products",
    "name": "商品库",
    "aliases": ["产品", "商品", "产品库", "商品列表", "库存", "SKU"],
    "route": "products",
    "component": "ProductCenter",
    "parent": "operations",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "管理商铺 SKU 资产、编辑售价和监控低库存预警"
  },
  {
    "id": "orders",
    "name": "订单中心",
    "aliases": ["订单", "订单列表", "未处理订单", "客单", "买单"],
    "route": "orders",
    "component": "OrderCenter",
    "parent": "operations",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "多租户跨国销售订单跟踪履约及自动发运审批"
  },
  {
    "id": "customers",
    "name": "客户中心",
    "aliases": ["客户", "买家", "意向买家", "会员", "CRM", "画像"],
    "route": "customers",
    "component": "CustomerCenter",
    "parent": "operations",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "欧洲消费者行为监测、CRM 客户分群及行为透镜"
  },
  {
    "id": "marketing",
    "name": "营销中心",
    "aliases": ["促销", "优惠券", "营销活动", "推广", "折扣", "广告"],
    "route": "marketing",
    "component": "MarketingCenter",
    "parent": "operations",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "拼盘优惠券发行、多渠道广告分流评估与 ROI 跟踪"
  },
  {
    "id": "finance",
    "name": "财务中心",
    "aliases": ["财务", "利润", "记账", "算效明细", "成本", "资金流"],
    "route": "finance",
    "component": "FinanceCenter",
    "parent": "operations",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "全店财务账目结算、单品利润核查与算力代币划扣记录"
  },
  {
    "id": "logistics",
    "name": "物流智运",
    "aliases": ["物流", "发货", "运单", "海外仓", "智运", "快递"],
    "route": "logistics",
    "component": "LogisticsCenter",
    "parent": "operations",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "欧盟全境物流时效监控、运费矩阵计算与分发海外仓策略"
  },
  {
    "id": "online-store",
    "name": "自建主题",
    "aliases": ["主题", "模板", "自建站", "店铺装修", "页面模板"],
    "route": "online-store",
    "component": "OnlineStore",
    "parent": "operations",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "商家可定制化前台、主题模版设计与即时生效的独立站网店"
  },
  {
    "id": "ai_dashboard",
    "name": "总裁驾驶舱",
    "aliases": ["驾驶舱", "大盘", "业务大盘", "今日销售", "今日经营", "CEO大盘"],
    "route": "ai_dashboard",
    "component": "EcosCEODashboard",
    "parent": "ai",
    "status": "LIVE",
    "permissions": ["Admin"],
    "description": "AI CEO 经营状态大盘，提供每日销售、利润、风险、任务、学习、记忆多维大汇总"
  },
  {
    "id": "ai_execution",
    "name": "AI 执行控制",
    "aliases": ["执行控制", "审批控制", "自愈验证", "任务中心", "AI执行", "审计中心"],
    "route": "ai_execution",
    "component": "AIExecutionControlCenter",
    "parent": "ai",
    "status": "LIVE",
    "permissions": ["Admin"],
    "description": "高管代币配给、自主执行提案、人类授权审核决策自愈层"
  },
  {
    "id": "ai_discovery",
    "name": "自动诊断中心",
    "aliases": ["诊断发现", "盲点诊断", "知识缺口", "决策自诊断"],
    "route": "ai_discovery",
    "component": "AIDiscoveryCenter",
    "parent": "ai",
    "status": "LIVE",
    "permissions": ["Admin"],
    "description": "主动探测业务认知漂移、外部供给冲突与决策谦逊自我修补"
  },
  {
    "id": "system_map",
    "name": "系统架构地图",
    "aliases": ["架构图", "系统地图", "大盘地图", "系统拓扑"],
    "route": "system_map",
    "component": "EcosMasterDirectory",
    "parent": "developer",
    "status": "LIVE",
    "permissions": ["Admin", "Developer"],
    "description": "全栈 React 文件管理器与数据库表索引、Playbook 快速上线中心"
  },
  {
    "id": "system_registry",
    "name": "主注册中心",
    "aliases": ["注册中心", "三大注册中心", "系统注册表", "模块登记", "事实库"],
    "route": "system_registry",
    "component": "EcosMasterDirectory",
    "parent": "developer",
    "status": "LIVE",
    "permissions": ["Admin", "Developer"],
    "description": "底层导航树、全系统功能注册表及模块职责所有权总纲"
  },
  {
    "id": "shopify_docs",
    "name": "Shopify 开发者文档",
    "aliases": ["开发文档", "协议说明", "API规格", "Shopify API"],
    "route": "shopify_docs",
    "component": "ShopifyDocsFinder",
    "parent": "developer",
    "status": "LIVE",
    "permissions": ["Admin", "Developer"],
    "description": "整合了 REST/GraphQL 标准格式映射及多租户调用约束规范说明"
  },
  {
    "id": "enterprise_settings",
    "name": "企业首选项设置",
    "aliases": ["企业设置", "首选项", "国家设置", "欧盟税率"],
    "route": "enterprise_settings",
    "component": "EnterpriseSettings",
    "parent": "system",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "配置所属行业、欧元代扣代缴税率、多重安全隔离规则与本位币首选项"
  }
]
```

## 4. 路由自愈解析链路 (Self-Healing Router Resolution Code Pattern)
```typescript
export function resolveNavigationTarget(query: string, registry: NavigationRegistryItem[]): NavigationRegistryItem | null {
  const cleanQuery = query.trim().toLowerCase();
  
  // 第一步: 严格名称匹配
  let target = registry.find(item => item.name.toLowerCase() === cleanQuery || item.id.toLowerCase() === cleanQuery);
  if (target) return target;
  
  // 第二步: 同义别名模糊匹配
  target = registry.find(item => 
    item.aliases.some(alias => alias.toLowerCase().includes(cleanQuery) || cleanQuery.includes(alias.toLowerCase()))
  );
  
  return target || null;
}
```
通过上述标准规则，AI 代理得以在完全不泄露底层逻辑、完全无硬编码跳转的前提下自主操作路由跳转。
