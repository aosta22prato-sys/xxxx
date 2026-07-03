# 数据库地图与架构字典 (Database Registry)

## 📌 隔离底线
ECOS 支持对等的 Europe-First SaaS 模型。核心通过 `tenantId` (租户物理 ID) 以及 `storeId` (单租户国家门店 ID) 做联合硬防错校验。禁止任何跨库渗透查询。

---

## 🗃️ 核心物理存储表清单及其字段映射 (All Real Database Fields)

### 1. `users` (登录与用户权限认证表)
* **用途**: 多租户SAAS及总后台 super admin 的最高权限核对。
* **物理字段**:
  - `id`: `string` (主键，唯一 UUID / 邮箱映射)
  - `email`: `string` (用户邮箱)
  - `role`: `string` ("Admin" | "SuperAdmin" | "Merchant") (等级权限)
  - `tenantId`: `string` (对应租户，SuperAdmin 可为 'ALL')
* **读写实体**: Auth Modules, `dbEngine.users`

### 2. `tenants` (SAAS 多租户注册大表)
* **用途**: 多租户的基础开户底座，隔离公司物理环境。
* **物理字段**:
  - `id`: `string` (租户主键)
  - `name`: `string` (租户企业名称)
  - `domain`: `string` (绑定自定义子域名)
  - `status`: `string` ("ACTIVE" | "SUSPENDED") (运行状况)
  - `createdAt`: `string` (注册时间戳)
* **读写实体**: Provisioning Setup, `dbEngine.tenants`

### 3. `stores` (单租户下多门店与多语大表)
* **用途**: 单个企业下面针对不同语境国家店面的定义。
* **物理字段**:
  - `id`: `string` (门店主键)
  - `tenantId`: `string` (外键，归属租户)
  - `name`: `string` (门店名，如 “France Fashion Hub”)
  - `industry`: `string` (所属细分零售，如 Fashion, Cosmetics)
  - `currency`: `string` (默认币种，如 EUR, USD)
  - `country`: `string` (所属地理大区优势，如 France, Italy)
* **读写实体**: Sub-Store Workspace, `dbEngine.stores`

### 4. `products` (多仓多 variant 基础服装商品表)
* **用途**: 服装配饰多 variants 库存与物理货架同步记录。
* **物理字段**:
  - `id`: `string` (商品 Spu 唯一标记)
  - `tenantId`: `string` (隔离租户 ID)
  - `storeId`: `string` (所属国家店面 ID)
  - `name`: `string` (服装全名，如 “羊毛呢子大衣 Classic Coat”)
  - `price`: `number` (标价，联动结算国家币种)
  - `stock`: `number` (总余量，一键联动法国海外仓、国内现货仓)
  - `variants`: `array` (多尺码、多配色的二级 Sku 元组)
* **读写实体**: Product Center, Inventory Agent, `dbEngine.products`

### 5. `orders` (跨海多币种销售主订单表)
* **用途**: 记录跨国销售产生的流水。
* **物理字段**:
  - `id`: `string` (订单唯一索引)
  - `tenantId`: `string` (隔离租户 ID)
  - `storeId`: `string` (所属店面 ID)
  - `totalAmount`: `number` (最终成交额)
  - `status`: `string` ("PENDING" | "PAID" | "SHIPPED" | "REFUNDED") (履约流转)
  - `currency`: `string` (结算币种)
  - `items`: `array` (订单购买包含商品 Sku 及数量列表)
  - `createdAt`: `string` (落款时间)
* **读写实体**: Order Center, Sales Admin, `dbEngine.orders`

### 6. `customers` (CRM 全渠道意向买家追踪表)
* **用途**: 存储商家重点客户与挽留客户的基础详情页数据。
* **物理字段**:
  - `id`: `string` (客户主键)
  - `tenantId`: `string` (所属租户)
  - `name`: `string` (买家姓名)
  - `email`: `string` (买家邮箱)
  - `totalSpent`: `number` (历史累计消费总额)
  - `segments`: `string[]` (智能标签，如 VIP, At-Risk, New)
* **读写实体**: Customer Center, CRMAgent, `dbEngine.customers`

### 7. `campaigns` (多渠道广告与营销战表)
* **用途**: 营销增长大盘的核心数据载体，记录广告曝光。
* **物理字段**:
  - `id`: `string` (战役 UUID)
  - `tenantId`: `string` (归属租户)
  - `name`: `string` (战役别名物料，如 “2026年法国夏季大促”)
  - `platform`: `string` ("Facebook" | "Google" | "TikTok")
  - `budget`: `number` (日预算)
  - `spend`: `number` (历史累计花费)
  - `revenue`: `number` (带来的营业收益额)
  - `clicks`: `number` (获得高频点击总量)
  - `status`: `string` ("ACTIVE" | "PAUSED")
* **读写实体**: Marketing Center, Marketing Brain, `dbEngine.campaigns`

### 8. `promotions` (高毛利促销规则表)
* **用途**: 特惠活动触发方案定义。
* **物理字段**:
  - `id`: `string`
  - `tenantId`: `string`
  - `name`: `string`
  - `discount`: `number` (折扣百分比，在 0-100%)
  - `status`: `string` ("ACTIVE" | "INACTIVE")
* **读写实体**: Promotion Dashboard, `dbEngine.promotions`

### 9. `tasks` (AI 建议任务动作总中心表)
* **用途**: 承载商家待处理任务队列，对接 Sidekick 动作按钮。
* **物理字段**:
  - `id`: `string`
  - `tenantId`: `string`
  - `title`: `string` (任务大标题，如 “因断货风险需向法国仓补货 300 件”)
  - `reason`: `string` (深层因果，如 “预计 12 天售空，不采购将面临 €5,200 毛利流失”)
  - `impact`: `string` (预期增加利润收益，如 “+€5,200”)
  - `status`: `string` ("PENDING" | "APPROVED" | "REJECTED")
* **读写实体**: SaaS Merchant Workbench (AI Task Center)

### 10. `event_logs` (分布式自愈事件审计痕迹表)
* **用途**: 用于在总后台做 Enterprise Brain 神经突触大屏与故障追踪。
* **物理字段**:
  - `id`: `string`
  - `tenantId`: `string`
  - `source`: `string` (引发组件，如 "LogisticsEngine")
  - `eventType`: `string` (如 "StockoutWarning")
  - `detail`: `string` (如 "Sku Classic Coat is at high risk")
  - `timestamp`: `string`
* **读写实体**: Super Admin AI Board (Nervous/Cognitive)

### 11. `business_experiences` (企业经营长期学习经验库表)
* **用途**: 支撑“AI 学习到什么”板块的数据库。
* **物理字段**:
  - `id`: `string`
  - `tenantId`: `string`
  - `topic`: `string` (如 “法国市场客户倾向性”)
  - `insight`: `string` (如 “法国客户周四下午购买率最高 (+18%)”)
  - `verifiedPercentage`: `number` (可信度)
  - `createdAt`: `string`
* **读写实体**: Learning Engine, EcosCEODashboard, `dbEngine.business_experiences`
