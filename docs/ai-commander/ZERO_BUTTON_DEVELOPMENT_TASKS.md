# AI Commerce OS: 纯 AI 驱动「无按钮」架构开发任务拆分书 (Zero-Button Development Task Breakdown)

> **核心思想**：彻底告别冗繁的表单、固定流转的按钮与高成本的操作菜单。将传统 UI 的“按钮”本质还原为“动作指针”，由高智商的多智能体大脑（AI Agent）理解自然语言意图，自组装结构化命令并驱动底层工具包（Tool Connectors）完成落库写入与预测分析，提供真正的“商店自治副驾”体验。

---

## 🗺️ 架构全局透视图

```
┌────────────────────────────────────────────────────────┐
│                    商家自然语言输入 (输入端)            │
│  "库存低于 10 件的产品涨价 5%" | "帮我出个夏装 Banner"  │
└───────────────────────────┬────────────────────────────┘
                            │ (NLU Session Stream)
                            ▼
┌────────────────────────────────────────────────────────┐
│             AI Agent 核心意图解析与序列化层             │
│  - 词法过滤器提取 (提取阈值 10, 微调比例 +5%)            │
│  - 动作实体映射 (Action Mapping -> PRICE_ADJUST)        │
│  - 生成统一指令协议 (Compiler: JSON Execution Plan)    │
└───────────────────────────┬────────────────────────────┘
                            │ (Structured JSON Commands)
                            ▼
┌────────────────────────────────────────────────────────┐
│                多维度自治工具调配层 (Connectors)        │
│  ┌──────────────────┬────────────────┬─────────────────┐
│  │   商品与库存工具  │  图像生成工具  │  数据分析工具  │
│  │   (Product/WMS)  │  (SDXL/Flux)   │  (Pandas/SQL)   │
│  └────────┬─────────┴────────┬───────┴────────┬────────┘
            │                  │                │
            ▼                  ▼                ▼
┌────────────────────────────────────────────────────────┐
│                Shopify Core DB / 运行时持久化          │
│  - 物理更新 dbEngine.product_variants & dbEngine.campaigns│
│  - 实时同步后端 server_db.json 并向用户提供预测分析报告   │
└────────────────────────────────────────────────────────┘
```

---

## 📋 模块拆分与研发排线表

本任务拆分表分为 4 个核心 Epic（史诗级任务），共计 12 个细分 Task，每个 Task 均配有开发标准、技术选型建议与交付验证。

---

### 🎨 Epic 1: 纯极简 AI 交互界面层 (Pure Chat UI & Auto-Execution)
* **核心目标**：实现真正的“零按钮、非阻碍性”对话视窗，全面移除表单提交等繁难配置，将原本需要按钮触发的确定机制变为“自然语言核准”与“AI 自适应执行”。

#### 📝 Task 1.1: 界面精简化重构与去按钮化配置
* **技术方案**：
  * 在 `AICommandCenter.tsx` 中彻底移除冗余、分散的辅助设定按钮和手动表单。
  * 提炼出统一的聊天面板组件 `AutonomousChatWorkspace`。
  * 配合 `motion/react` 开发动效，使聊天内容根据 AI 输出的类型（图表、数据卡、大图、提示卡）进行平滑、渐进式过渡。
* **交付与验收标准 (DoD)**：
  * 界面不含繁杂的操作子菜单、无常设的点击保存按钮。
  * 默认布局以 100% 聊天对话流为视觉中心，文字与卡片加载提供高质感进场微动效（Fade Active）。
* **人日预估**：3.0 人日

#### 📝 Task 1.2: 自然语言自适应确认逻辑与快捷执行
* **技术方案**：
  * 在会话历史节点中，开发自然语言核准捕捉器。如果 AI 生成了调价草稿或优惠券草案（Pending Action），用户无需寻找操作按钮，输入“同意”、“好的”、“执行”、“ok”等，系统底层自动将 `lastAssistantMsg.suggestions` 中匹配的第一个方案作为首选项直接执行入库。
  * 支持输入数字 “1”、“2”、“3” 或 “第一个” 自动选中对应层级的建议并就地执行，达到“免鼠标触控”效果。
* **交付与验收标准 (DoD)**：
  * 当 AI 提出：“已为您锁定 3 款商品，建议调价 5%，是否执行？” 时
  * 商家直接在输入框打字：`“同意执行”` 或 `“1”` ➔ 屏幕不闪烁并立刻刷出绿色完成微标，触发价格覆写。
* **人日预估**：2.5 人日

#### 📝 Task 1.3: 智能结果反馈板 (Interactive Markdown & Dynamic Charts)
* **技术方案**：
  * 引入 `react-markdown` 进行报告的高级编排。
  * 集成 `recharts` / `d3`，当 AI 输出的 JSON Payload 中带有图表配置时，前端自研组件 `DynamicReportWidget` 支持在消息气泡中原地渲染条形图、折线图或对比表格（而非弹出额外大窗，影响视图焦点）。
* **交付与验收标准 (DoD)**：
  * 当用户搜索“分析最近30天大盘走势”时。
  * 会话流内直出一条带有漂亮折线图的气泡，数据点完全动态对齐，鼠标悬浮有高亮提示，完全嵌入对话河流。
* **人日预估**：3.5 人日

---

### 🧠 Epic 2: 自然语言意图解析与编译器层 (Intelligence NLU Router Engine)
* **核心目标**：将不规则的商户口头俗语，编译成不含歧义的、可供机器严格解析并代入工具执行的结构化命令流对象（Execution AST）。

#### 📝 Task 2.1: 模糊词义与多意图过滤抽取器 (NLU Token Extractor)
* **技术方案**：
  * 在 `/api/ai/orchestrate` 与 `intelligentFallback.ts` 拦截网关中，增强正则表达式与 LLM 词法分析。
  * 定义数字抓取器、条件描述器（如：“低于”、“大于”、“介于...之间”），自动抽离出参数 `threshold`。
  * 定义比例/数值变化计算器（如：“提高5%” ➔ `multiplier = 1.05`, “打八折” ➔ `multiplier = 0.8`）。
* **交付与验收标准 (DoD)**：
  * 以下非规范输入，底层能够完全等效转译：
    * `“把库存少于10个的品，价格上浮 5%”`
    * `“小于10库存的货物给我涨价 5 个点”`
    * `“若库存低于10 价格调高 1.05 倍”`
  * 三者解析出的 AST 统一无误地转化为：`{ threshold: 10, multiplier: 1.05 }`。
* **人日预估**：3.5 人日

#### 📝 Task 2.2: 结构化动作指令生成器 (Action Mapping Protocol)
* **技术方案**：
  * 定义可扩展的结构化命令输出协议（Unified Command Protocol）：
    ```typescript
    interface UnifiedCommand {
      tool: 'product_update' | 'create_discount' | 'generate_image' | 'customer_email' | 'data_analysis';
      filters: {
        inventory_lt?: number;
        inventory_gt?: number;
        sku_matches?: string;
        category?: string;
      };
      operation: {
        price_adjust_multiplier?: number; // 如 1.05
        discount_code?: string;
        discount_percent?: number;        // 如 10
        image_prompt?: string;
        analysis_metric?: 'sales' | 'profit' | 'inventory_risk';
      };
    }
    ```
  * 将此规范作为 Schema 写入 System Instruct，使后端大模型每次判定出执行倾向时，均通过 Structured Outputs (JSON Schema/Function Calling) 形式返回。
* **交付与验收标准 (DoD)**：
  * 在后端日志中输入调价指令，大语言模型成功吐出上述符合 Schema 规范的 JSON 配置块。
* **人日预估**：4.0 人日

#### 📝 Task 2.3: AI 经营底线宪法保障 (Governor Engine Enforcement)
* **技术方案**：
  * 为了防止 AI 在理解输入时“胡乱决策”导致毁灭性改价（如不小心把所有产品价格打 0.1 折），在工具链入口处部署 `GovernorEngine` 防线。
  * 设置硬性物理阈值安全阀（宪法门槛）：单次涨价/降价变动不得超过 40%，全店批量修改商品数一次不得超过 50 个。超出此范围必须输出“警备隔离确认”。
* **交付与验收标准 (DoD)**：
  * 商家输入：“把全店商品价格提高 10 倍” ➔ 拦截引擎强制熔断，返回安全提示：“出于财务政策合规建议，系统已自动拦截单次上浮超 40% 的敏感操作，已为您修正为上浮 20%，推荐您进行二次确认。”
* **人日预估**：3.0 人日

---

### 🔌 Epic 3: 多维度自治工具连接器 (Omnichannel Tool Connectors)
* **核心目标**：将经过审核的安全系统指令进行工程化包装，并调用目标 API，打通真实业务壁垒。

#### 📝 Task 3.1: 智能商品与库存工具接口补全 (Shopify Products Connector)
* **技术方案**：
  * 实现 `ProductTool.batchUpdatePrice(filters, multiplier)`：
    1. 根据 filters 检索多租户隔离商品库，筛选合格 SKU 列表；
    2. 计算每个 SKU 变体的新对应价格，通过 `dbEngine.product_variants.update` 覆写，并在后端持久化至 `server_db.json`。
* **交付与验收标准 (DoD)**：
  * 用户发出调价指令，底层日志真实打印出受影响商品的 ID 与前后变体金额对比，商品中心展示的所有项物理变动且永久保存。
* **人日预估**：3.0 人日

#### 📝 Task 3.2: 智能营销卡券直透工具 (Discounts/Campaigns Connector)
* **技术方案**：
  * 实现 `MarketingTool.createCoupon(promoCode, discountPercent)`：
    1. 将带有让利权能的纪录，原子化持久化录入 `dbEngine.campaigns`；
    2. 产生全新的 `discountDrafts`。
* **交付与验收标准 (DoD)**：
  * 运行“生成折扣码 15%”，无按钮直接提示指令成功。打开 “Promotion / Campaigns” 面板核准，可见该活动已完美创建在列表中，且优惠码与输入值严密对齐。
* **人日预估**：2.5 人日

#### 📝 Task 3.3: 智能多模态视觉生成与绑定工具 (Image Gen Connector)
* **技术方案**：
  * 连接 Flux/SDXL 图片服务。
  * 实现 `ImageTool.generateProductBanner(prompt, targetProductId)`。
  * 生成的新图像 URL 自适应持久化到商品属性 `image_url` 中，并在 UI 对话框中提供即时大图对比预览。
* **交付与验收标准 (DoD)**：
  * 发出指令：“给商品 Sample Jacket 做个复古色调的 Facebook 广告主图”。
  * 聊天框原地生成并渲染出该画幅，图片自动挂在其对应的图库栏位（且 referrerPolicy="no-referrer" 安全，不产生破损图）。
* **人日预估**：3.5 人日

#### 📝 Task 3.4: 智能数据透视分析与预测工具 (Analytics Predicates Connector)
* **技术方案**：
  * 封装财务/销量分析计算。
  * 实现 `AnalysisTool.predictPriceOptimizeProfit(products, multiplier)`。
  * 根据历史近 30 天的买家客单购买率，采用微观经济弹性算法，反向拟合并预估价格调整 5% 后产生的财务溢损影响：
    $$\text{Expected Monthly Profit Change} = \sum (\text{Price}_{\text{new}} - \text{Cost}) \times \text{Sales}_{\text{new}} - \sum (\text{Price}_{\text{old}} - \text{Cost}) \times \text{Sales}_{\text{old}}$$
* **交付与验收标准 (DoD)**：
  * AI 在回复大盘价格修改结果时，最后能跟随输出一段严密推导出来的精确利润变动数据报告（拒绝套路空话，数据需自恰）。
* **人日预估**：4.0 人日

---

### 💾 Epic 4: 数据库底座、两端隔离与最终总装上线 (Platform Release & Security Hardening)
* **核心目标**：在物理隔离的干净底座（dbEngine / server_db.json）中运转此套 zero-button 大脑，确保商家不越权、不污染，并完成全链路联调打包上线。

#### 📝 Task 4.1: 多租户隔离持久化落库与发布状态同步 (Multi-Tenant State Sync)
* **技术方案**：
  * 为所有通过 NLU 指令写入的变更，显式注入 `tenant_id`、`store_id`。
  * 更新 `server.ts` 中的 POST 保存端口，防止改写过程中的跨商家碰撞越权威胁。
  * 每次 AI 做出调整后，主动发射 PubSub 广播给前端 App 组件以刷新 React 各个 Center 的内存 State，使其他相关的只读业务卡片物理实时对齐最新的数值。
* **交付与验收标准 (DoD)**：
  * A 商家发起的调价行为绝对不会泄露、或不小心修改 B 商家商品库。
  * 界面聊天改价后，若手动点到只读的商品管理小部件，商品单价也同时变动。
* **人日预估**：3.5 人日

#### 📝 Task 4.2: 系统总集成与端到端压力测试 (End-to-End System Integration)
* **技术方案**：
  * 打通 AI 聊天端与 Node.js 生产 bundle 的配合关系。若 Gemini client 存在，则直接走大语言模型原生识别分支；无 Gemini key 时，在 `intelligentFallback.ts` 中无缝热回滚到高性能端上 NLP 编译解析沙箱。
  * 执行 `npm run build && npm run lint` 的深度审查。
* **交付与验收标准 (DoD)**：
  * 编译无 type type-checking 报错。
  * 在测试套件中，自动/手动完成 [Checkout / Setup / Read / Write / Command Routing] 的连续大满贯高保真测试运转。
* **人日预估**：4.5 人日

---

## 📈 项目总人日与交付排期概览

| 史诗阶段 (Epics) | 建议人日数 (Man-Days) | 核心里程碑交付状态 (Milestone Delivery Status) |
| :--- | :--- | :--- |
| **Epic 1: 纯极简 AI 交互界面层** | **9.0 人日** | 完成 Chat 窗口的无按钮化改造，支持数字/文字无痛交互执行 |
| **Epic 2: 自然语言意图解析层**| **10.5 人日** | 完成 NLU 提取、Schema 排版设计与改价合规安全阀 (Governor) 交付 |
| **Epic 3: 多核自治工具连接器**| **12.5 人日** | 连通商品、优惠码、生图与多变量模拟利润预估公式等 API 适配包 |
| **Epic 4: 数据库底座与全网总装**| **8.0 人日** | 达成多租户 100% 数据流物理隔离，顺利合流通过 lint 并一期正式发表 |
| **🌟 整体预估** | **40.0 人日** | **Shopify Magic 级别的完全零界免配置、纯口语、一键核签的高维 OS** |

---
*编撰人：AI Commerce OS 核心开发架构组 (Architecture Lock v1.0)*
