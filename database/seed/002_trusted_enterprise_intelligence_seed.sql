-- =========================================================================
-- AI Commerce OS - Trusted Enterprise Intelligence System Seed Script
-- Architecture Edition: Multi-Tenant SaaS, Europe-First
-- =========================================================================

-- 1. SEED THE BUSINESS CONSTITUTION PRINCIPLES (ARTICLES 1-3)
INSERT INTO business_constitution_clauses (clause_code, clause_title, minimum_threshold_value, severity_level, description)
VALUES 
('CONSTITUTION_ART_1_MARGIN_FLOOR', '绝对毛利底线控制（15％毛利红线）', 15.00, 'P0_CRITICAL', '所有自主营销和定价变动均不得突破 15.00％ 的绝对毛利收益红线，防止低效放血销售损伤现金流底座。'),
('CONSTITUTION_ART_2_INVENTORY_SECURITY', 'WMS 主力供货保障线（7日安全天数）', 7.00, 'P1_WARNING', '高流量及爆推 SKU 预测可流周转天数在手量不得低于 7.00 天，若预警跌破需加急触发空寄或干线回补。'),
('CONSTITUTION_ART_3_LIQUIDITY_LOCK', '离岸结算可用流动资金弹性防振（€3,000）', 3000.00, 'P0_CRITICAL', '单次策略推荐调配、预算调用，或外币结汇垫付周转不得超限占用 €3,000 以上的结算净流动积蓄。')
ON CONFLICT (clause_code) DO NOTHING;

-- 2. SEED TRUTH FACTS
INSERT INTO brain_truth_facts (fact_id, statement, is_observable_fact, source_module, verification_confidence)
VALUES 
('FACT_001', 'WMS 实存商品 SKU 在库量与库架一一对齐。', TRUE, 'WMS_INVENTORY_METRICS', 1.00),
('FACT_002', '中法核心商圈本期日均订单积压量计入 15 笔。', TRUE, 'FINANCIALS_TRANSACTION_ENGINE', 1.00)
ON CONFLICT (fact_id) DO NOTHING;

-- 3. SEED MULTI-AGENT INVOCATION EXAMPLES WITH AUDITING
INSERT INTO multi_agent_gatekeeper_runs (gate_run_id, agent_name, proposed_action, is_authorized, authorization_authority, audit_trail_code, evaluation_log)
VALUES 
('GATE_001', 'WMS_INVENTORY_AGENT', 'AUTO_RESTOCK', TRUE, 'BRAIN_GOVERNOR', 'AUTH_GOVERNOR_PASS', 'WMS_INVENTORY_AGENT 申请对断款商品回灌 5 单位，全流程符合 7 天最高在库安全底线，自动放行。'),
('GATE_002', 'MARKETING_PROMO_AGENT', 'DISCOUNT_BLEED_60', FALSE, 'DENIED', 'AUTH_CONSTITUTION_REJECT', 'MARKETING_PROMO_AGENT 提议下发 60% 会员立减大券（综合毛利折合仅 8%），公然击中 CONSTITUTION_ART_1_MARGIN_FLOOR 绝对 15% 紅线，予以无条件拦截熔断。')
ON CONFLICT (gate_run_id) DO NOTHING;

-- 4. SEED INITIAL ENTERPRISE AUDIT ENTRIES
INSERT INTO enterprise_audit_trail (tracking_guid, decision_maker, reasoning_basis, evidence_cited_keys, action_target, estimated_outcome_label)
VALUES 
('TRK-AUD-8831', 'WMS_INVENTORY_AGENT', '检测到主力爆推 SKU 断缺至 0 单位危险阈值', ARRAY['WMS_RAW_STOCKS', 'ORDER_VOLUME_DELTA'], 'AUTO_RESTOCK', '安全水库对冲回补 5 单位')
ON CONFLICT (tracking_guid) DO NOTHING;
