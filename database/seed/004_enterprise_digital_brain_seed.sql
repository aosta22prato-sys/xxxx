-- =========================================================================
-- AI Commerce OS - Enterprise Digital Brain Seed Script
-- Architecture Edition: Multi-Tenant SaaS, Europe-First
-- =========================================================================

-- 1. SEED DECISION QUALITY METRICS
INSERT INTO decision_quality_logs (decision_id, tenant_id, action_type, expected_yield_value, actual_realized_value, deviation_percentage, cognitive_depth_level, decision_quality_score)
VALUES 
('DEC-Q-001', 'tenant-eur-central-1', 'AUTO_RESTOCK', 1800.00, 1850.00, 2.78, 4, 0.98),
('DEC-Q-002', 'tenant-eur-central-1', 'AD_BUDGET_BOOST', 3200.00, 2800.00, -12.50, 3, 0.85)
ON CONFLICT (decision_id) DO NOTHING;

-- 2. SEED FORECAST ACCURACY RECORDS
INSERT INTO forecast_accuracy_metrics (metric_id, tenant_id, metric_key, forecast_target_date, forecast_expected_value, actual_realized_value, calculated_accuracy, adjusted_weights)
VALUES 
('FCA-001', 'tenant-eur-central-1', 'WMS_SALES_VOLUME', '2026-06-10', 450.00, 442.00, 98.22, '{"weight_smoothing": 1.02}'),
('FCA-002', 'tenant-eur-central-1', 'WMS_SALES_VOLUME', '2026-06-11', 480.00, 465.00, 96.88, '{"weight_smoothing": 1.05}')
ON CONFLICT (metric_id) DO NOTHING;

-- 3. SEED GOAL PROGRESS RECORDS
INSERT INTO goal_achievement_records (goal_id, tenant_id, goal_name, target_value, current_value, progress_percentage, is_success, estimated_delivery_date)
VALUES 
('GOA-001', 'tenant-eur-central-1', '西欧本季度经营毛利突破 €15,000', 15000.00, 12450.00, 83.00, FALSE, '2026-06-30T23:59:59Z'),
('GOA-002', 'tenant-eur-central-1', '缩减主力爆货爆推 SKU 零库存警戒线频率至 0%', 100.00, 100.00, 100.00, TRUE, '2026-06-09T12:00:00Z')
ON CONFLICT (goal_id) DO NOTHING;

-- 4. SEED STRATEGY EVOLUTION ENTRIES
INSERT INTO strategy_evolution_weights (strategy_id, tenant_id, strategy_name, success_count, failure_count, reinforcement_factor, is_retired)
VALUES 
('STR-EV-001', 'tenant-eur-central-1', '利用 Google Product Ads 拦截降价断流', 15, 1, 1.12, FALSE),
('STR-EV-002', 'tenant-eur-central-1', '针对法国假期采购硬性强制放血 45% 大折扣', 2, 8, 0.44, TRUE)
ON CONFLICT (strategy_id) DO NOTHING;

-- 5. SEED DIGITAL TWIN SIMULATIONS
INSERT INTO digital_twin_experiments (experiment_id, tenant_id, action_code, simulation_runs_count, best_case_gain, expected_case_gain, worst_case_gain, success_probability)
VALUES 
('TWN-EXP-001', 'tenant-eur-central-1', 'PROV_AD_SCALE_15', 500, 4500.00, 3100.00, -800.00, 0.82),
('TWN-EXP-002', 'tenant-eur-central-1', 'PRICE_CUT_SKU_DE', 500, 2200.00, 1500.00, -500.00, 0.74)
ON CONFLICT (experiment_id) DO NOTHING;

-- 6. SEED META LEARNING RECTIFICATIONS
INSERT INTO meta_learning_summaries (record_id, tenant_id, learning_factor, measured_error, correction_applied_factor)
VALUES 
('MLN-001', 'tenant-eur-central-1', 'PROMO_CALENDAR_SHRINK', 14.50, 0.92)
ON CONFLICT (record_id) DO NOTHING;
