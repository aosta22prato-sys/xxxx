-- =========================================================================
-- AI Commerce OS - Enterprise Trust Seed Script
-- Architecture Edition: Multi-Tenant SaaS, Europe-First
-- =========================================================================

-- 1. SEED DECISION EVIDENCE
INSERT INTO enterprise_decision_evidence (evidence_id, decision_id, evidence_type, evidence_source, confidence, fact_or_inference)
VALUES 
('EVI-001', 'DEC-FR-RESTOCK-101', 'PHYSICAL_FACT', 'WMS_INVENTORY_METRICS', 1.00, 'FACT'),
('EVI-002', 'DEC-FR-RESTOCK-101', 'MODEL_INFERENCE', 'PREDICTIVE_CORRELATION_WORKSPACE', 0.85, 'INFERENCE')
ON CONFLICT (evidence_id) DO NOTHING;

-- 2. SEED REASONING CHAIN TRAIL
INSERT INTO enterprise_reasoning_chain (chain_id, hypothesis, supporting_evidence, counter_evidence, confidence, conclusion)
VALUES 
('RC-001', '由于 WMS 主力库存归参考零线，应该即刻启动 €1,800 加急空邮补回。', ARRAY['WMS 在手现货量已经归 0', '48小时流失潜在订单约 15 笔'], ARRAY['法国暑期采购季复购走低约 15%'], 0.83, '决定执行 AUTO_RESTOCK_INTENSE，符合宪法 15% 边际毛利限额。')
ON CONFLICT (chain_id) DO NOTHING;

-- 3. SEED THE BUSINESS CONSTITUTION RULES BOOK
INSERT INTO business_constitution_rules (rule_id, rule_name, rule_type, threshold_value, severity, violation_action)
VALUES 
('RULE-1', '绝对净毛利底盘防线', 'MARGIN', 15.00, 'P0_CRITICAL', 'BLOCK_EXECUTION'),
('RULE-2', 'WMS 核心货位水位高底线', 'STOCK', 7.00, 'P1_WARNING', 'TRIGGER_WARNING'),
('RULE-3', '流动资金池过度挪用警戒', 'CASHFLOW', 3000.00, 'P0_CRITICAL', 'BLOCK_EXECUTION')
ON CONFLICT (rule_id) DO NOTHING;

-- 4. SEED SECURE BLOCKCHAIN-STYLE AUDIT TRAIL
INSERT INTO unalterable_audit_chain (tracking_guid, decision_maker, reasoning_basis, evidence_cited_keys, action_target, estimated_outcome_label, previous_hash, record_hash, digital_signature)
VALUES 
('TRK-AUD-8831', 'WMS_INVENTORY_AGENT', '检测到主力爆推 SKU 断缺至 0 单位危险阈值', ARRAY['EVI-001','EVI-002'], 'AUTO_RESTOCK', '安全水库对冲回补 5 单位', '0000000000000000000000000000000000000000000000000000000000000000', 'a7f8582d972b2257be913075dcd5a8a18edf9629b19e2fbcc8708d74ca29b1be', 'secp256k1:sig_001_verification_provenance_hash')
ON CONFLICT (tracking_guid) DO NOTHING;
