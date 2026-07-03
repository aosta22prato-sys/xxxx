# Page Registry (全系统页面登记库)

## Page001: 登录与入口 (Landing Page)
- **文件路径**: `src/components/LandingPage.tsx`
- **挂载路由**: `/`
- **运行状态**: `[LIVE]`
- **功能描述**: 多租户与管理员公共极简入口。

## Page002: 注册与租户激活 (Register Page)
- **文件路径**: `src/components/RegisterPage.tsx`
- **挂载路由**: `/register`
- **运行状态**: `[LIVE]`
- **功能描述**: 收集租户、国家及默认商业模式。

## Page003: 空间初始化配置 (Provisioning Dashboard)
- **文件路径**: `src/components/ProvisioningPage.tsx`
- **挂载路由**: `/provision`
- **运行状态**: `[LIVE]`
- **功能描述**: 完成角色、应用、数据库表格构建初始化。

## Page004: 企业空间初始化 (Interactive Initialization Progress Card)
- **文件路径**: `src/components/ConfigPage.tsx`
- **挂载路由**: `/initialize`
- **运行状态**: `[LIVE]`
- **功能描述**: 动态展现AI员工、知识库、应用空间配置部署。

## Page005: 商家控制中心 (SaaS Merchant Workbench)
- **文件路径**: `src/components/SaaSMerchantWorkbench.tsx`
- **挂载路由**: `/workbench`
- **运行状态**: `[LIVE]`
- **功能描述**: 商家经营仪表盘。第一排为销售、订单、客户、利润关键指标；第二排为待处理及待审批任务；集成AI命令中心（右侧420px）。

## Page006: 商品库中心 (Product Center)
- **文件路径**: `src/components/ProductCenter.tsx`
- **挂载路由**: `/products`
- **运行状态**: `[LIVE]`
- **功能描述**: 多仓多币种商品发布、库存增删改查。

## Page007: 订单中枢面板 (Order Center)
- **文件路径**: `src/components/OrderCenter.tsx`
- **挂载路由**: `/orders`
- **运行状态**: `[LIVE]`
- **功能描述**: 订单状态流转与跨国支付审批。

## Page008: 客户关系中枢 (Customer Center / CRM)
- **文件路径**: `src/components/CustomerCenter.tsx`
- **挂载路由**: `/customers`
- **运行状态**: `[LIVE]`
- **功能描述**: 全网流量意向买家与核心采购商档案管理。

## Page009: 智运物流中枢 (Logistics Center)
- **文件路径**: `src/components/LogisticsCenter.tsx`
- **挂载路由**: `/logistics`
- **运行状态**: `[LIVE]`
- **功能描述**: 海外仓派件及尾程配送节点追溯。

## Page010: 超管AI中央决策中枢 (Super Admin AI Board)
- **文件路径**: `src/components/SuperAdminCenter.tsx`
- **挂载路由**: `/super-admin`
- **运行状态**: `[LIVE]`
- **功能描述**: 全网大盘资金、算力劫持率与多智能体合规面板。

## Page011: AI 导航与知识检索中心 (AI Navigation & Knowledge Center)
- **文件路径**: `src/components/AINavigationCenter.tsx`
- **挂载路由**: `/workbench` (Tab: `ai-navigator`)
- **运行状态**: `[LIVE]` [NEW]
- **功能描述**: 全生命周期的 ECOS 神经网络寻路与算效 RAG 知识脱离机制，阻断泛化混乱。
