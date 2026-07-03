-- AI Commerce OS - Business Workflow Engine Database Seeds (Architecture Lock v1.0)
-- Target: tenant_global_moda

-- 1. Workflow Templates
INSERT INTO workflow_templates (id, tenant_id, name, trigger_type, description, is_active, created_at)
VALUES 
('tmpl_replenishment', 'tenant_global_moda', '自动安全库存补货工作流', 'inventory_low', '当监测到商品库存低于安全水位时触发，自动生成补充进货单并通过风险审计与财务审批后自动跟进执行。', true, NOW()),
('tmpl_customer_recall', 'tenant_global_moda', '流失客户智能唤醒召回工作流', 'customer_churn', '当检测到高价值VIP会员超过30天未下单时触发，自动进行客户画像分层，匹配最佳优惠方案并执行召回触达。', true, NOW()),
('tmpl_price_optimization', 'tenant_global_moda', '商品毛利自适应定价优化工作流', 'pricing_anomaly', '当市占率、退货率或者供应链成本变动引发毛利倒挂时自动触发，运行定价模拟与收益预测，提交并执行定价更新。', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Workflow Instances
INSERT INTO workflow_instances (id, tenant_id, template_id, name, status, current_step_id, trigger_reason, created_at, completed_at)
VALUES
('inst_repl_01', 'tenant_global_moda', 'tmpl_replenishment', 'Classic Tailored Trench Coat 安全水位补充单', 'completed', 'step_repl_5', 'Classic Tailored Trench Coat (APP-TRNCH-01) 库存跌至 5 (安全水位 10)', NOW() - INTERVAL '48 hours', NOW() - INTERVAL '47 hours'),
('inst_recall_01', 'tenant_global_moda', 'tmpl_customer_recall', '高价值欧洲钻石VIP客户批量召回事件', 'running', 'step_recall_4', '12名钻石等级/消费>€1,000客户已连续45日未产生交互', NOW() - INTERVAL '12 hours', NULL),
('inst_price_01', 'tenant_global_moda', 'tmpl_price_optimization', 'Camel Trench Coat 尺寸缺陷高退款率价格下调校准', 'completed', 'step_price_5', '因尺码偏差导致退货率飙升至 24% 触发毛利警戒', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- 3. Workflow Steps
INSERT INTO workflow_steps (id, workflow_id, step_number, name, action_type, status, assigned_agent, execution_response, started_at, completed_at)
VALUES
('step_repl_1', 'inst_repl_01', 1, '库存安全线偏离检查', 'inventory_check', 'completed', 'InventoryAgent', '已查明：APP-TRNCH-01 实际物理库存剩5件（已背离安全配重）', NOW() - INTERVAL '48 hours', NOW() - INTERVAL '47 hours 54 minutes'),
('step_repl_2', 'inst_repl_01', 2, '精细采购补货计划生成', 'purchase_plan', 'completed', 'InventoryAgent', '已制定补货 50 Units（预估进价 $115/件），触发总计 $5,750 额度分拨', NOW() - INTERVAL '47 hours 54 minutes', NOW() - INTERVAL '47 hours 42 minutes'),
('step_repl_3', 'inst_repl_01', 3, '经营宪章与预算法规合规审计', 'risk_review', 'completed', 'FinanceAgent', '合规验证通过：已校验流控预算，未背离当前季度最大周转预算配额可能性。', NOW() - INTERVAL '47 hours 42 minutes', NOW() - INTERVAL '47 hours 30 minutes'),
('step_repl_4', 'inst_repl_01', 4, '自动签发采购并执行划转', 'execute', 'completed', 'FinanceAgent', '向一级工厂自动签发采购单 PO-2026-003841，执行 $5,750 进销差划扣。', NOW() - INTERVAL '47 hours 30 minutes', NOW() - INTERVAL '47 hours 12 minutes'),
('step_repl_5', 'inst_repl_01', 5, '供应链交期跟踪与交货校验', 'verify_results', 'completed', 'InventoryAgent', '工厂已确认排单，预计交期 7 天，系统自动入库监控已挂载。', NOW() - INTERVAL '47 hours 12 minutes', NOW() - INTERVAL '47 hours'),

('step_rec_1', 'inst_recall_01', 1, '高危流失客群静默发现与聚合', 'customer_segment', 'completed', 'CustomerAgent', '聚合找出12名历史消费>€1,000的欧洲高净值高留存高黏性VIP客户（超45日静默）。', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '11 hours 48 minutes'),
('step_rec_2', 'inst_recall_01', 2, '客群意向与消费生命周期分层', 'customer_segment', 'completed', 'CustomerAgent', '分层结果：8人为高价外套偏好客群，4人为高档丝织配饰偏好客群。', NOW() - INTERVAL '11 hours 48 minutes', NOW() - INTERVAL '11 hours 30 minutes'),
('step_rec_3', 'inst_recall_01', 3, '自适应精细召回话术与个性配券生成', 'generate_plan', 'completed', 'MarketingAgent', '匹配方案：针对外套客群派发 €30 春季真丝排他折扣，配饰客群匹配 €15 专属免邮免税礼品。', NOW() - INTERVAL '11 hours 30 minutes', NOW() - INTERVAL '11 hours 6 minutes'),
('step_rec_4', 'inst_recall_01', 4, '多通路（Email+SMS）召回触达派发', 'execute', 'running', 'MarketingAgent', '正通过 Sendgrid + Twilio 关联网关发送巴黎/伦敦双向特制信函与加密回购代码。', NOW() - INTERVAL '11 hours 6 minutes', NULL),
('step_rec_5', 'inst_recall_01', 5, '复购周期与回款归因验证', 'verify_results', 'pending', 'CustomerAgent', NULL, NULL, NULL),

('step_pri_1', 'inst_price_01', 1, '退货率偏离与毛利警戒诊断', 'inventory_check', 'completed', 'PricingAgent', '诊断明细：Classic Camel Trench Coat 尺码不合退款率超24%，直击经营毛利润。', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours 54 minutes'),
('step_pri_2', 'inst_price_01', 2, '价格弹性模拟与尺码修正分析', 'price_simulate', 'completed', 'PricingAgent', '价格模拟：将当前零售单价 $159.00 校准下调至 $144.50。增设页面尺码偏差预警。', NOW() - INTERVAL '5 hours 54 minutes', NOW() - INTERVAL '5 hours 42 minutes'),
('step_pri_3', 'inst_price_01', 3, '自适应GMV与利润回报预测', 'revenue_forecast', 'completed', 'FinanceAgent', '收益预测：尽管销售单价下跌9%，但由于更正尺码警示，预计退货率降至6%以下，实际综合结算净利润可实现+11.5%正向冲抵。', NOW() - INTERVAL '5 hours 42 minutes', NOW() - INTERVAL '5 hours 30 minutes'),
('step_pri_4', 'inst_price_01', 4, '跨平台销售价格核准执行与发布', 'execute', 'completed', 'PricingAgent', '已自动更新 Shopify 商品网关/各级定价 API 目录配置，由 $159 -> $144.50。', NOW() - INTERVAL '5 hours 30 minutes', NOW() - INTERVAL '5 hours 12 minutes'),
('step_pri_5', 'inst_price_01', 5, '退款漏斗回转监控与最终收益审计', 'verify_results', 'completed', 'FinanceAgent', '跟踪回溯：后续 24 小时内售出 5 件（降价成效高），新增销量未见因尺码退款，验证效果极其稳固。', NOW() - INTERVAL '5 hours 12 minutes', NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- 4. Workflow Execution Logs
INSERT INTO workflow_execution_logs (id, tenant_id, workflow_instance_id, step_id, log_level, message, timestamp)
VALUES
('log_01', 'tenant_global_moda', 'inst_repl_01', 'step_repl_1', 'info', '触发库存补水，当前安全水线严重偏离。', NOW() - INTERVAL '48 hours'),
('log_02', 'tenant_global_moda', 'inst_repl_01', 'step_repl_3', 'governance_audit', '大脑向决策宪章提出治理审计核验：采购估值 $5,750 满足可用流动资金合规底座。通过。', NOW() - INTERVAL '47 hours 42 minutes'),
('log_03', 'tenant_global_moda', 'inst_price_01', 'step_pri_3', 'governance_audit', '决策宪章授权自适应自愈 logic：由于价格微调能合理对冲高阶退换率损耗，触发执行。', NOW() - INTERVAL '5 hours 36 minutes')
ON CONFLICT (id) DO NOTHING;

-- 5. Workflow Results
INSERT INTO workflow_results (id, tenant_id, workflow_instance_id, outcome, revenue_gained, cost_saved, metrics_impact, verified_at)
VALUES
('res_repl_01', 'tenant_global_moda', 'inst_repl_01', 'success', 11000.00, 450.00, 'Classic Trench Coat 库存水位回落至 55 件。货架供应率维持在 100%。避免断货流失估值 $11,000。', NOW() - INTERVAL '47 hours'),
('res_price_01', 'tenant_global_moda', 'inst_price_01', 'success', 2450.00, 1200.00, '商铺日整体退货率由 24% 压缩至 3.8%；Camel Coat 销量爆发 +40%，实际锁死经营亏损约 $1,200。', NOW() - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;
