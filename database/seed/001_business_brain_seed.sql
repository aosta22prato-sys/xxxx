-- =========================================================================
-- AI Commerce OS - Business Brain V3 Seed Script
-- Architecture Edition: Multi-Tenant SaaS, Europe-First
-- =========================================================================

-- 1. INSTANTIATE FIRST SEED TENANT (MOCK-FREE DEFAULT CONTEXT)
INSERT INTO system_tenants (tenant_id, store_name, country_code, currency)
VALUES ('tenant-eur-central-1', 'AI Commerce Europe-First flagship store', 'FR', 'EUR')
ON CONFLICT (tenant_id) DO NOTHING;

-- 2. CREATE MERCHANT DEFAULT CONFIGURATION 
INSERT INTO merchant_configurations (tenant_id, low_stock_threshold, vat_rate_default, price_elasticity_scalar, is_promo_active)
VALUES ('tenant-eur-central-1', 5, 20.00, 1.05, FALSE)
ON CONFLICT DO NOTHING;

-- 3. PRIME WORKING MEMORY LAYER
INSERT INTO brain_working_memory (tenant_id, memory_key, memory_value, certainty_score)
VALUES 
('tenant-eur-central-1', 'GATEWAY_OVER_SOFORT', '由于近期西欧特定信用卡收款阻力增加，常备 Sofort 的购物车结账通畅率提升约 18%', 0.95),
('tenant-eur-central-1', 'FR_SUMMER_HOLIDAY_SCALE_DOWN', '法国在暑期（7月-8月）订单量出现约 22% 季节性滑坡，已向策略引擎配置对应的对冲缩量乘数', 0.88)
ON CONFLICT DO NOTHING;

-- 4. SEED BUSINESS EXPERIENCES (LEARNING WEIGHTS)
INSERT INTO brain_business_experience (tenant_id, action_category, success_count, failure_count, average_rating, weight_scalar, patterns_identified)
VALUES 
('tenant-eur-central-1', 'price_cut', 8, 2, 7.80, 1.02, ARRAY['降价虽然增加销量，但由于购物车单价减少 12%，综合毛利需要通过主推爆款 SKU 的 5 单位锁定来对冲']),
('tenant-eur-central-1', 'ad_spend_boost', 14, 1, 9.20, 1.15, ARRAY['在 Google Shopping Ads 追加 15% 预算可平顺推动点击 CTR 增长 2.4%，边际效率处于高位'])
ON CONFLICT DO NOTHING;

-- 5. RECORD MEMORY EVOLUTION PATHWAY
INSERT INTO brain_evolution_memory (tenant_id, phase, description, impact_metric, hash_signature)
VALUES 
('tenant-eur-central-1', 'V1_COGNITIVE', '初始化因果图谱与 12 行业实体链路。', '推理成功率: 68%', 'sha256:v1_init_signature'),
('tenant-eur-central-1', 'V2_PREDICTIVE', '提供精细中远期销量及库存归零时间轴模拟。', '决策置信度: 78%', 'sha256:v2_pred_signature'),
('tenant-eur-central-1', 'V3_BRAIN', '最终落子 Business Brain V3，支持多连锁因果推理与纠错批判。', '综合毛利提高: 12.8%', 'sha256:v3_brain_signature')
ON CONFLICT DO NOTHING;

-- 6. CAUSAL MODEL GEOMETRY DEFINITION
INSERT INTO causal_diagram_nodes (node_id, node_name, polarity, description)
VALUES 
('traffic_acquisition', 'Traffic Acquisition Channel', 'positive', '买商圈或流转流量入口（例如 SEO/Ads）'),
('click_ctr', 'Click CTR percentage', 'positive', '商品主图点击受众吸引比'),
('checkout_conversion', 'Checkout Gateway conversion rate', 'positive', '支付网关及购物车畅通率，负极表示摩擦断档'),
('order_volume', 'Captured clean orders count', 'positive', '全渠道净物理订单交易积压'),
('cashflow_net', 'Net available liquidity Cashflow', 'positive', '可调用离岸与本地可用结算净资金'),
('inventory_level', 'Inventory Stock availability', 'negative', '库存过低会断档，过高则积压流动资金')
ON CONFLICT (node_id) DO NOTHING;

-- 7. CAUSAL CONNECTIONS REGISTER
INSERT INTO causal_diagram_edges (source_node, target_node, directed_weight)
VALUES 
('traffic_acquisition', 'click_ctr', 0.85),
('click_ctr', 'checkout_conversion', 0.72),
('checkout_conversion', 'order_volume', 0.94),
('order_volume', 'cashflow_net', 0.88),
('inventory_level', 'checkout_conversion', -0.90)
ON CONFLICT DO NOTHING;
