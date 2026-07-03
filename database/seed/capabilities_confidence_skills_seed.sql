-- AI Commerce OS - Capability, Confidence, Skills, and Multi-Store Seeds (Architecture Lock v1.0)
-- Target: tenant_global_moda

-- 1. Capability Scores Seeds (Phase 203)
INSERT INTO capability_scores (id, tenant_id, name, category, score, trend, assessed_at, strengths, weaknesses)
VALUES 
('cap_fr_ops', 'tenant_global_moda', '法国市场经营能力', 'market_operation', 82, 'up', NOW(), '{"畅销品爆单捕获率高", "大衣退换货流控精准", "本地仓周转弹性强"}', '{"非大货时段的尺码缺损偏多", "客群转化仍存在高额退货摩擦"}'),
('cap_de_ops', 'tenant_global_moda', '德国市场经营能力', 'market_operation', 61, 'stable', NOW(), '{"法德中欧大仓仓储互通顺畅", "首单支付欺诈审核迅速"}', '{"德语区对直接改价的承受弹性差", "EDM 邀约唤回客群的触达漏洞损毁大"}'),
('cap_inv_opt', 'tenant_global_moda', '库存优化能力', 'inventory_opt', 91, 'up', NOW(), '{"在途补充在库锁定高度一致", "爆品安全库存警戒线自愈灵敏"}', '{"边缘细分 SKU 补给易占压流动资金"}'),
('cap_cust_rec', 'tenant_global_moda', '客户召回能力', 'customer_recall', 58, 'down', NOW(), '{"VVIP 标签归类对齐算法成熟", "复购归因漏斗清晰"}', '{"高净值流失 VIP 的挽留单兵话术略显僵硬", "送达转化率略微下滑"}')
ON CONFLICT (id) DO NOTHING;

-- 2. Decision Confidences Seeds (Phase 204)
INSERT INTO decision_confidences (id, tenant_id, decision_ref_id, decision_type, title, decision_confidence, strategy_confidence, forecast_confidence, requires_governor_approval, governor_status, analysis_breakdown, assessed_at)
VALUES
('conf_france_coat', 'tenant_global_moda', 'sp_france_15', 'strategy', '法国大衣降价与在途补货锁合战役', 93, 90, 95, FALSE, 'auto_passed', '模型高可信通过。大衣在温差多阶段具有强购买刚性，降价对冲机制与补货在途锁合完全符合大盘流控。', NOW()),
('conf_germany_pricing', 'tenant_global_moda', 'strategy_germany_v1', 'pricing', '德国德语区全品类全网降价 12% 方案', 51, 48, 54, TRUE, 'pending_review', '警告：置信度 (51%) 低于理智宪法阈值 (70%)。强行全局降价极易造成持久性毛利流失且无法有效唤醒购买力，必须由 SuperAdmin 审核人机复核。', NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Skill Graph Nodes Seeds (Phase 205)
INSERT INTO skill_graph_nodes (id, tenant_id, skill_key, name, level, success_rate, historical_revenue_gain, failure_rate, experience_count, last_used_at, updated_at)
VALUES
('skill_mkt_exp', 'tenant_global_moda', 'market_expansion', '市场扩张', 'Expert', 85, 154000.00, 15, 28, NOW(), NOW()),
('skill_inv_opt', 'tenant_global_moda', 'inventory_optimization', '库存优化', 'Master', 91, 125000.00, 9, 42, NOW(), NOW()),
('skill_dyn_prc', 'tenant_global_moda', 'dynamic_pricing', '动态定价', 'Advanced', 78, 84000.00, 22, 19, NOW(), NOW()),
('skill_cust_rec', 'tenant_global_moda', 'customer_recall', '客户召回', 'Competent', 58, 32000.00, 42, 11, NOW(), NOW()),
('skill_margin_mgt', 'tenant_global_moda', 'margin_management', '利润管理', 'Expert', 88, 98000.00, 12, 25, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Cross Store Experiences Seeds (Phase 206)
INSERT INTO cross_store_experiences (id, original_tenant_id_hash, market_country, product_category, strategy_type, action_detail, outcome_gmv_growth_pct, sample_size, avg_revenue_impact, confidence_rating, created_at)
VALUES
('cse_coat_fr', 'ba7816bf8f01cfea414140de5dae2223b', 'FR', 'clothing', 'reduction_percentage', '经典冬春大 coat 单价下调 8% ~ 10%，同步对冲库存安全在途数。', 18.20, 15, 14500.00, 91, NOW()),
('cse_access_de', '9f86d081884c7d659a2feaa0c55ad015a', 'DE', 'accessories', 'loyalty_edm', '配饰类季节专场 loyalty 激活发放 €15 ~ €30 面额券。', 11.50, 9, 8200.00, 84, NOW())
ON CONFLICT (id) DO NOTHING;
