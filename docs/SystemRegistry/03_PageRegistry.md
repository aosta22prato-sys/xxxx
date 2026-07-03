# 视图页面注册中心 (Page Registry)

## 📌 技术目的
记录全系统所有顶层视图框架页面（SPA 挂载点或子级路由卡片），作为 AI 导航与开发审计的核心档案库。

---

## 📋 顶级视图框架备案记录

### Page001: 登录验证与入口 (Landing Page)
* **文件路径**: `src/components/LandingPage.tsx`
* **应用路由**: `/` (根端)
* **主组件名**: `LandingPage`
* **所属模块**: `Auth System`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 支持多租户一键切换与超管密码接入。

### Page002: 商家新租户注册页 (Register Page)
* **文件路径**: `src/components/RegisterPage.tsx`
* **应用路由**: `/register`
* **主组件名**: `RegisterPage`
* **所属模块**: `Tenant System`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 用户租户开户、店铺开天辟地自愈。

### Page003: 基础功能部署站 (Provisioning Page)
* **文件路径**: `src/components/ProvisioningPage.tsx`
* **应用路由**: `/provision`
* **主组件名**: `ProvisioningPage`
* **所属模块**: `Database & Infra`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 提供一键自动建表与初始数据预置。

### Page004: 企业空间交互初始化进程 (Config Page)
* **文件路径**: `src/components/ConfigPage.tsx`
* **应用路由**: `/initialize`
* **主组件名**: `ConfigPage`
* **所属模块**: `Infra setup`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 支持 AI 员工、预制知识库等微服务初始化激活进程。

### Page005: 极简商家控制中心 (SaaS Merchant Workbench)
* **文件路径**: `src/components/SaaSMerchantWorkbench.tsx`
* **应用路由**: `/workbench`
* **主组件名**: `SaaSMerchantWorkbench`
* **所属模块**: `Operations`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 商家经营仪表盘。第一排为销售、订单、客户、利润关键指标；第二排为待处理及待审批任务；集成AI命令中心（右侧420px）。

### Page006: 多级商品中心 (Product Center)
* **文件路径**: `src/components/ProductCenter.tsx`
* **应用路由**: `/products`
* **主组件名**: `ProductCenter`
* **所属模块**: `Operations`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 负责 Spu / Sku 级别的商品价格策略、库存对齐与分仓管理。

### Page007: 跨国交易订单中枢 (Order Center)
* **文件路径**: `src/components/OrderCenter.tsx`
* **应用路由**: `/orders`
* **主组件名**: `OrderCenter`
* **所属模块**: `Operations`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 处理订单多状态卡流转与高危拦截对决。

### Page008: 意向意愿买家CRM关系库 (Customer Center)
* **文件路径**: `src/components/CustomerCenter.tsx`
* **应用路由**: `/customers`
* **主组件名**: `CustomerCenter`
* **所属模块**: `Operations`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 大买家的常顾品类标签以及挽留管理面板。

### Page009: 尾端时效物流追踪站 (Logistics Center)
* **文件路径**: `src/components/LogisticsCenter.tsx`
* **应用路由**: `/logistics`
* **主组件名**: `LogisticsCenter`
* **所属模块**: `Logistics`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 国际智运与海外自囤货运输动态跟踪。

### Page010: 超管AI中央大盘 (Super Admin Console)
* **文件路径**: `src/components/SuperAdminCenter.tsx`
* **应用路由**: `/super-admin`
* **主组件名**: `SuperAdminCenter`
* **所属模块**: `AI Brain & Master`
* **完成状态**: `[LIVE]` (100%)
* **功能描述**: 管理员AI大脑与算力控制中枢，包含 10 大脑部组件、服务网关及自愈日志。

### Page011: POS 渠道终端收银台 (POS Center)
* **文件路径**: `src/components/POSCenter.tsx`
* **应用路由**: `pos`
* **主组件名**: `POSCenter`
* **所属模块**: `Operations`
* **完成状态**: `[LIVE]` (100%) (全量真实本地交易模拟)

### Page012: Shopify 开发者协议规格中心 (Shopify Docs Finder)
* **文件路径**: `src/components/ShopifyDocsFinder.tsx`
* **应用路由**: `shopify_docs`
* **主组件名**: `ShopifyDocsFinder`
* **所属模块**: `Developer`
* **完成状态**: `[LIVE]` (100%) (支持 Shopify 官方协议实时搜索查找)
