# Database Registry (真实持久化数据段索引)

## Table: Users Profile (users)
- **用途描述**: 归档多租户以及超管管理员身份验证
- **核心字段**: `id`, `email`, `role` (Admin | SuperAdmin | User), `tenantId`
- **读写主体**: Auth, `dbEngine.users`

## Table: Tenants Registry (tenants)
- **用途描述**: 多租户SAAS底层隔离边界表
- **核心字段**: `id`, `name`, `domain`, `status`, `createdAt`
- **读写主体**: Multi-Tenant Provisioning, `dbEngine.tenants`

## Table: Enterprise Stores (stores)
- **用途描述**: 单租户下级所属的多门店或不同币种国家店面
- **核心字段**: `id`, `tenantId`, `name`, `industry`, `currency`, `country`
- **读写主体**: Store Management, `dbEngine.stores`

## Table: Unified Products (products)
- **用途描述**: 面向服装、电商等行业的基本商品库存表
- **核心字段**: `id`, `tenantId`, `storeId`, `name`, `price`, `stock`, `variants`
- **读写主体**: Product Center, Inventory Agent, `dbEngine.products`

## Table: Multi-Currency Orders (orders)
- **用途描述**: 全渠道销售及多租户跨国处理主单
- **核心字段**: `id`, `tenantId`, `storeId`, `totalAmount`, `status`, `currency`
- **读写主体**: Order Center, Sales Agent, `dbEngine.orders`

## Table: AI Agent Control Config (agents)
- **用途描述**: 注册智能体的热更指令、模型以及状态记录
- **核心字段**: `id`, `tenantId`, `name`, `role`, `state`, `systemPrompt`
- **读写主体**: Super Admin AI Registry, `dbEngine.agents`

## Table: Execution Proposals (execution_proposals)
- **用途描述**: 多智能体提出的待审核主动补货或打折对策记录
- **核心字段**: `id`, `tenantId`, `agentId`, `proposalType`, `status` (PENDING | APPROVED)
- **读写主体**: AI Execution Control Center, `dbEngine.execution_proposals`

## Table: Failure Prediction Logs (failure_prediction_logs)
- **用途描述**: 自动风控与断货高危链侦断记录
- **核心字段**: `id`, `tenantId`, `triggerTime`, `factor`, `severity` (HIGH | LOW)
- **读写主体**: EcosCEODashboard, `dbEngine.failure_prediction_logs`
