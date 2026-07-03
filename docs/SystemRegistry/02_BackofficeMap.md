# 商家管理大地图 (Backoffice Map)

## 📌 商业定位
针对普通店主的日常工作面板，界面追求极简实用，以 **“今日赚多少”、“哪里正在亏损”、“下一步做什么”** 3条主链驱动，无底层神经网络等认知垃圾。

---

## 🗂️ 全后台商户视图列表

### 1. `workbench` (商家经营总控 / SaaSMerchantWorkbench.tsx)
* **对应文件**: `src/components/SaaSMerchantWorkbench.tsx`
* **路由映射**: `/workbench` (Merchant 默认工作台)
* **日度高频功能**:
  1. **AI 今日经营报告**：销售额、日利润、现金流深度体感监控。
  2. **AI 高利润机会推荐**：发现品类溢价建议。
  3. **AI 任务中心**：提供“立即补货”、“联系大客户”的快捷原子审批大按钮。
  4. **AI 正在做什么**：展示正在进行的自动化批任务（如：[✓] 解析广告，[✓] 更新库存）。

### 2. `products` (多级商品中心 / ProductCenter.tsx)
* **对应文件**: `src/components/ProductCenter.tsx`
* **路由映射**: `/products`
* **日度高频功能**:
  - 服装配饰多 variant（Spu/Sku、尺码、颜色、原产地）维护。
  - 多仓物理库存扣增、多币种（EUR/USD/CNY）联动调整与一键发布同步。

### 3. `orders` (多币种跨国订单中心 / OrderCenter.tsx)
* **对应文件**: `src/components/OrderCenter.tsx`
* **路由映射**: `/orders`
* **日度高频功能**:
  - 监听跨国多币种订单，处理待放款订单、拦截高危嫌疑退款订单。
  - 提供人工确认或 AI 自动订单履约拦截器。

### 4. `customers` (CRM 客户关系中枢 / CustomerCenter.tsx)
* **对应文件**: `src/components/CustomerCenter.tsx`
* **路由映射**: `/customers`
* **日度高频功能**:
  - 汇聚全网活跃买家画像，重点记录 VIP 客户、常购款式与流失预警指标。

### 5. `marketing` (营销分流与增长大盘 / MarketingCenter.tsx)
* **对应文件**: `src/components/MarketingCenter.tsx`
* **路由映射**: `/marketing`
* **日度高频功能**:
  - 投放管理，监测法国、意大利等多市场 Facebook 、Google 广告 ROI 波形，允许一键暂停亏损广告或自动开启爆款补位。

### 6. `finance` (财务中心与损益度盘 / FinanceCenter.tsx)
* **对应文件**: `src/components/FinanceCenter.tsx`
* **路由映射**: `/finance`
* **日度高频功能**:
  - 真实账目流水与算效损益，展示扣除服务器 Token、物料与运费后的净利空间。

### 7. `logistics` (智运末端追踪物流 / LogisticsCenter.tsx)
* **对应文件**: `src/components/LogisticsCenter.tsx`
* **路由映射**: `/logistics`
* **日度高频功能**:
  - 监控海外仓与末端尾程时效，在退换率因物流偏高时自动报警并提示商家改签优质承运商。

### 8. `pos` (POS 渠道收银大厅 / POSCenter)
* **对应文件**: `src/components/POSCenter.tsx` (或者我们在初始化中注册的组件)
* **路由映射**: `pos`
* **运行状态**: `[LIVE]` (核心收银功能，一键模拟零售交易并实时入库库扣减)

---

## 🔍 AI 主寻路导航命令映射
当用户从 AI Sidekick 中输入查询时，系统会精准检索 [06_NavigationRegistry.md](06_NavigationRegistry.md)，直接实施物理传送跳转。
