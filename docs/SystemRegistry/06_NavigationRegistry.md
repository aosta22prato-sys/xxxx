# 寻路导航索引数据库 (Navigation Registry)

## 📌 商业价值与技术作用
全平台导航注册中心（Navigation Registry）是 ECOS 网络中唯一、权威、可信的路径检索树。
当用户在 AI 经营对话框（Sidekick）里输入诸如“带我去商品库”、“查看订单”、“开发文档在哪里”时，AI 寻路导航大脑会通过读取此注册中心的同义词库、别名数组进行多重匹配，并调用 `window.ECOS_NAVIGATE` 进行传送，杜绝代码内部产生复杂的 Hardcoded 跳转。

---

## 🗃️ 权威活跃注册节点列表 (Authority Live Nodes)

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
    "id": "pos",
    "name": "POS 渠道收银",
    "aliases": ["pos", "收银", "收银柜", "线下店"],
    "route": "pos",
    "component": "POSCenter",
    "parent": "operations",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "模拟柜台物理零售交易与实时极速库存扣除"
  },
  {
    "id": "ai_dashboard",
    "name": "总裁驾驶舱",
    "aliases": ["驾驶舱", "大盘", "业务大盘", "今日销售", "今日经营", "CEO大盘", "ai大脑"],
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
    "name": "系统地图",
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
    "aliases": ["注册中心", "三大注册中心", "系统注册表", "模块登记", "事实库", "系统注册"],
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
    "aliases": ["开发文档", "协议说明", "API规格", "Shopify API", "docs"],
    "route": "shopify_docs",
    "component": "ShopifyDocsFinder",
    "parent": "developer",
    "status": "LIVE",
    "permissions": ["Admin", "Developer"],
    "description": "整合了 REST/GraphQL 标准格式映射及多租户调用约束规范说明"
  },
  {
    "id": "enterprise_settings",
    "name": "企业设置",
    "aliases": ["企业设置", "首选项", "国家设置", "欧盟税率"],
    "route": "enterprise_settings",
    "component": "EnterpriseSettings",
    "parent": "system",
    "status": "LIVE",
    "permissions": ["Admin", "Merchant"],
    "description": "配置所属行业、欧盟地区税率、多重安全隔离规则与本位币首选项"
  }
]
```

---

## 🔍 AI 二维路由自愈路径对齐逻辑
1. 捕获输入 Query 纯文本。
2. 检索本配置节点 `name` 或 `id` 相同。
3. 若无匹配，迭代循环 `aliases` 组。如果 Query 文本中包含 alias，或 alias 包含 Query 文本，认定为强命中。
4. 返回对应 `route` 以及 `component` 标记，执行自动无感知传送。
