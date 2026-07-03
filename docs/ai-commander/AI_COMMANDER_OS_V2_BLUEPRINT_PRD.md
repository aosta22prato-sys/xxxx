# AI Commander OS v2：多智能体 & 目标驱动终极蓝图 PRD

## 0. 概览
本规划旨在将 AI Commander OS 升级为一个由专职智能体组成的运营中枢。它不仅具备上下文感知能力，还能围绕业务目标（GMV、利润、库存等）进行多任务协同规划，并支持多模态输入（如报表截图、商品图分析）。

## 1. 背景与目标
- **现状**：v1 版本已实现单体 AI 顾问，具备基础数据查询和页面感知能力。
- **愿景**：构建一个「有记忆、有目标、有工具、有分工」的智能体 OS。
- **核心价值**：从“被动问答”进化为“主动监测、目标规划、辅助执行”。

## 2. 智能体矩阵 (Agents Layer)
系统由一个指挥官和多个专家智能体组成：

| 智能体角色 | 核心职责 | 核心工具 (Services) |
| :--- | :--- | :--- |
| **Ops Commander** | 总指挥，负责目标拆解、优先级排序与方案合成 | StoreKpiService, AIActionLogService |
| **Pricing Agent** | 定价策略、单品/品类利润优化、折扣设计 | ProductService, PricingService, DiscountService |
| **Inventory Agent** | 库存健康监控、补货预警、积压清理 | InventoryService, StockService |
| **Payment Agent** | 支付方式优化、结账转化率提升 | PaymentService, CheckoutService |
| **Marketing Agent** | 活动策划、营销节奏、渠道 ROI 优化 | MarketingService, CampaignService |
| **Risk Agent** | 订单安全评估、欺诈识别、退款防控 | OrderService, RiskService |
| **Content Agent** | 多模态文案生成、商品图分析与视觉建议 | ContentService, ImageService (Vision) |

## 3. 目标驱动模式 (Goal-driven)
支持商户设定明确的业务目标，AI 自动生成「作战计划 (Playbook)」。

### 3.1 典型目标
- **增长类**：「下月 GMV 提升 20%」
- **库存类**：「2 个月内清掉冬季外套库存 70%」
- **利润类**：「在不降 GMV 的前提下，毛利率提升 5%」
- **风控类**：「将退款率控制在 2% 以下」

### 3.2 协同流程
1. **目标解析**：Ops Commander 将自然语言目标结构化。
2. **现状诊断**：调用全店 KPI 工具评估当前缺口。
3. **任务派发**：指派子任务给相关专家智能体。
4. **方案合成**：Ops Commander 平衡各方建议（如平衡折扣力度与利润率），输出最终 Playbook。

## 4. 多模态增强 (Multi-modal)
- **视觉理解**：AI 能够“看懂”报表截图（发现异常趋势）、商品图片（视觉质量评估）、页面截图（优化 CTA 布局）。
- **交互方式**：支持用户直接上传后台截图，AI 自动提取关键数值并结合上下文分析。

## 5. 多目标博弈与协同
- **权重管理**：Ops Commander 接收带权重的目标（如 GMV 40%, 利润 30%）。
- **透明决策**：在输出建议时，显式展示该方案对不同指标的预期影响 (Trade-off)。

## 6. 演进路线
- **Phase 1 (Done)**：上下文感知 + 单体顾问。
- **Phase 2 (In-progress)**：角色化分工 + 动作草稿生成。
- **Phase 3 (Next)**：多智能体协同规划 + 目标驱动 Playbook。
- **Phase 4 (Future)**：多模态接入 + 主动风险雷达监控。

## 7. 验收标准
- **协同有效性**：面对复合目标，系统能给出包含 3 个以上维度的逻辑自洽计划。
- **数据一致性**：所有 AI 建议中的数字必须回溯至真实数据库。
- **安全可控**：所有执行动作必须以「草稿」形式存在，需用户手动确认。
