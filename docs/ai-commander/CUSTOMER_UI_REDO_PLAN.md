# 客户端 UI 重做：现代 SaaS 客户中心 Dashboard

## 一、问题诊断 (Current Shopify-style Issues)
1. **信息密度低**：大量留白，关键数据不可见。
2. **价值感缺失**：看不到 LTV、订单频率、标签。
3. **操作路径长**：核心操作入口过深。
4. **AI 布局不合理**：侧边聊天抢占过多空间，不直接产出结果。
5. **视觉老旧**：表格风格像后台数据库，缺少 CRM 现代感。

## 二、重做目标 (Target: Linear × Stripe × Attio Style)

### 1. 客户中心 Dashboard (Header)
- 实时概览：今日新增、活跃客户、预计营收。
- 情感化问候：👋 早上好，Alex。

### 2. 分析卡片 (Metric Cards)
- 样式：蓝紫渐变、毛玻璃效果、hover 浮起。
- 指标：总客户数、本月新增、复购率、流失率。

### 3. AI 客户洞察 (AI Insights)
- **非侧边聊天**：直接在页面展示结果。
- 示例：“78位客户30天未下单，建议发送优惠券”、“23位高价值客户可能复购”。

### 4. 卡片式客户列表 (Smart Cards)
- 替换表格，展示：👤 姓名、等级（VIP/Gold）、地区、订单数、总贡献额、最近下单时间。
- 快捷入口：[View] [Message] [Coupon]。

### 5. 客户等级与健康度 (Loyalty & Health)
- **等级系统**：🥇 VIP, 🥈 Gold, 🥉 Silver, ⚪ Normal。
- **健康度评分**：Health Score (0-100)，基于频率、客单价、访问次数。

### 6. 销售漏斗 (Funnel)
- Leads → Registered → First Purchase → Repeat Purchase → VIP。

### 7. 全局搜索 (Command Bar)
- `⌘K Search Customer`：支持姓名、邮箱、电话、订单号、标签等。

## 三、视觉规范
- **背景**: `#F8FAFC`
- **主色**: `#6366F1`
- **圆角**: `20px`
- **阴影**: `0 8px 32px rgba(0,0,0,.08)`
