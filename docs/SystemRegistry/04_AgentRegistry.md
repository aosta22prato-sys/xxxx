# Agent Registry (智能体元角色签名库)

## Agent: Sales Conversion Catalyst (销售转换智能体)
- **注册编码**: `sales_agent`
- **默认版本**: `v4.1.2`
- **解析内核**: `gemini-2.5-pro` (高精确度推理)
- **关联特权**: `products` (只读), `orders` (只读), `customers` (读写)
- **运行状态**: `[LIVE / ONLINE]`
- **核心职能**: 分析意向意图弃单买家并自动投送补偿折扣券。

## Agent: Supply Chain Safeguard (供应链库存智能体)
- **注册编码**: `inventory_agent`
- **默认版本**: `v3.2.1`
- **解析内核**: `gemini-1.5-flash` (极速计算与边缘分析)
- **关联特权**: `products` (读写), `inventory_records` (读写)
- **运行状态**: `[LIVE / ONLINE]`
- **核心职能**: 自动评估补货周转期、拦截异仓断货异常。

## Agent: Marketing Optimization Agent (全球营销智能体)
- **注册编码**: `marketing_agent`
- **默认版本**: `v2.8.5`
- **解析内核**: `gemini-1.5-flash` (多语言自适应)
- **关联特权**: `marketing_campaigns` (读写), `customers` (只读)
- **运行状态**: `[LIVE / ONLINE]`
- **核心职能**: 自动调拨季节性活动引流。

## Agent: Financial Audit Sentinel (财务审计智能体)
- **注册编码**: `finance_agent`
- **默认版本**: `v3.0.1`
- **解析内核**: `gemini-2.5-pro` (强财务合规)
- **关联特权**: `finance` (读写), `orders` (只读)
- **运行状态**: `[LIVE / ONLINE]`
- **核心职能**: 自动核算算力消耗与对冲，对不合规大额账目阻断预警。
 pocket_audits
