-- Seed dataset inserts for Phase 271-280: Fashion Demand Intelligence Engine

-- Phase 271: Demand Signal Sources
INSERT INTO demand_signal_sources (id, name, category, base_weight, is_active)
VALUES 
('dss_temp', 'Alps Frost Sensor (Regional Temp Drop)', 'Temperature', 85, TRUE),
('dss_wage', 'Eurozone Corporate Wage Dispersion Index', 'WageCycle', 70, TRUE),
('dss_tourism', 'Paris High-Street Footfall Index', 'Tourism', 65, TRUE),
('dss_social', 'Muted Luxury Aesthetic Social Spike', 'SocialHeat', 90, TRUE),
('dss_competitor', 'Zara Premium Cashmere Pricing markdown', 'Competitor', 75, TRUE)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, base_weight = EXCLUDED.base_weight;

-- Phase 271: Demand Signals
INSERT INTO demand_signals (id, source_id, signal_type, magnitude_score, recorded_at, status)
VALUES
('dsg_01', 'dss_temp', 'Severe Alpes Temperature Drop (-6.5°C Trend)', 88, NOW() - INTERVAL '2 days', 'Active'),
('dsg_02', 'dss_social', 'Old Money Wool-Overcoat Tiktok Spike (+140%)', 95, NOW() - INTERVAL '12 hours', 'Active'),
('dsg_03', 'dss_tourism', 'Milan Airport International Luxury Retail Boom', 72, NOW() - INTERVAL '4 days', 'Processed')
ON CONFLICT (id) DO UPDATE SET magnitude_score = EXCLUDED.magnitude_score, status = EXCLUDED.status;

-- Phase 271: Demand Signal Weights
INSERT INTO demand_signal_weights (id, source_id, country, applied_weight)
VALUES
('dsw_01', 'dss_temp', 'FR', 88),
('dsw_02', 'dss_temp', 'DE', 95),
('dsw_03', 'dss_social', 'FR', 92),
('dsw_04', 'dss_social', 'GB', 90)
ON CONFLICT (id) DO UPDATE SET applied_weight = EXCLUDED.applied_weight;

-- Phase 272: Regional Forecast Models
INSERT INTO regional_forecast_models (id, model_name, version, hyperparameters, accuracy_score)
VALUES
('rfm_01', 'Hybrid GRU-Attention Fashion Predictor', 'v2.42-Core', 'learning_rate=0.003, epochs=150, layers=[64, 128, 64]', 93.80),
('rfm_02', 'Bayesian Elasticity Demand Forecaster', 'v1.18-Beta', 'priors=conjugate_normal, iterations=5000', 89.20)
ON CONFLICT (id) DO UPDATE SET accuracy_score = EXCLUDED.accuracy_score;

-- Phase 272: Regional Forecasts V2
INSERT INTO regional_forecasts_v2 (id, country, category_name, time_horizon, forecasted_growth_pct, confidence_score, model_id, run_date)
VALUES
('rfv_01', 'FR', 'Cashmere Wool Coats', '30d', 18.50, 92, 'rfm_01', NOW()),
('rfv_02', 'DE', 'Heavy Knit Cardigans', '7d', 12.40, 94, 'rfm_01', NOW()),
('rfv_03', 'GB', 'Oversized Trenchcoats', '90d', 22.80, 89, 'rfm_01', NOW()),
('rfv_04', 'IT', 'Premium Silk Blouses', '30d', -4.20, 85, 'rfm_02', NOW())
ON CONFLICT (id) DO UPDATE SET forecasted_growth_pct = EXCLUDED.forecasted_growth_pct, confidence_score = EXCLUDED.confidence_score;

-- Phase 272: Regional Forecast Results V2
INSERT INTO regional_forecast_results_v2 (id, forecast_id, trend_direction, upper_bound_pct, lower_bound_pct)
VALUES
('rfr_01', 'rfv_01', 'UP', 22.10, 14.90),
('rfr_02', 'rfv_02', 'UP', 15.20, 9.60),
('rfr_03', 'rfv_03', 'UP', 27.50, 18.10),
('rfr_04', 'rfv_04', 'DOWN', -1.50, -6.90)
ON CONFLICT (id) DO UPDATE SET trend_direction = EXCLUDED.trend_direction, upper_bound_pct = EXCLUDED.upper_bound_pct;

-- Phase 273: Trend Signals V2
INSERT INTO trend_signals_v2 (id, trend_name, signal_strength, source_platform, detection_date)
VALUES
('tsv_01', 'Quiet Luxury (Sober Minimalism)', 95, 'Vogue Pro Insights + Milan Retail Audit', NOW()),
('tsv_02', 'Old Money (Country Cable-Knit)', 88, 'Lyst Index Spikes', NOW()),
('tsv_03', 'Relaxed Oversized Drape Outfits', 78, 'TikTok Fast Spiker API', NOW())
ON CONFLICT (id) DO UPDATE SET signal_strength = EXCLUDED.signal_strength;

-- Phase 273: Trend Patterns
INSERT INTO trend_patterns (id, pattern_name, coherence_score, lifecycle_velocity)
VALUES
('tp_01', 'Inter-Seasonal Cashmere Wave pattern', 91, 'Accelerating'),
('tp_02', 'Classic Cable-Knit Legacy resurgence', 84, 'Steady')
ON CONFLICT (id) DO UPDATE SET coherence_score = EXCLUDED.coherence_score;

-- Phase 273: Trend Events
INSERT INTO trend_events_v2 (id, title, impact_factor, event_date)
VALUES
('tev_01', 'Paris Autumn Haute Couture Preview Weekend', 9, NOW() - INTERVAL '3 days'),
('tev_02', 'Milano Luxury Fair VIP Gala Red Carpet', 8, NOW() + INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET impact_factor = EXCLUDED.impact_factor;

-- Phase 273: Trend Alerts
INSERT INTO trend_alerts (id, title, severity, triggered_at, is_acknowledged)
VALUES
('ta_01', 'Critical Trend Gap: French Cashmere Coat demand rises but local inventory coverage < 10 days', 'High', NOW(), FALSE),
('ta_02', 'Overstock Risk Alert: Muted Beige Cardigan category slowing down in Germany', 'Medium', NOW(), FALSE)
ON CONFLICT (id) DO UPDATE SET is_acknowledged = EXCLUDED.is_acknowledged;

-- Phase 274: Lifecycle Stages
INSERT INTO lifecycle_stages (id, stage_name, typical_duration_days, target_margin_pct)
VALUES
('stg_intro', 'Introduction', 45, 65.00),
('stg_growth', 'Growth', 90, 58.00),
('stg_maturity', 'Maturity', 120, 45.00),
('stg_decline', 'Decline', 60, 25.00)
ON CONFLICT (id) DO UPDATE SET typical_duration_days = EXCLUDED.typical_duration_days;

-- Phase 275: Inventory Forecasts V2
INSERT INTO inventory_forecasts_v2 (id, product_id, country, days_to_stockout, predicted_overstock_units, recommended_safety_stock)
VALUES
('ifv_01', 'sku_coat_cashmere', 'FR', 11, 0, 140),
('ifv_02', 'sku_trench_oversized', 'GB', 14, 0, 100),
('ifv_03', 'sku_cardigan_beige', 'DE', 99, 180, 45)
ON CONFLICT (id) DO UPDATE SET days_to_stockout = EXCLUDED.days_to_stockout;

-- Phase 275: Inventory Recommendations
INSERT INTO inventory_recommendations (id, product_id, recommendation_type, recommended_qty, potential_profit_restored)
VALUES
('rec_01', 'sku_coat_cashmere', 'Replenish', 250, 24500.00),
('rec_02', 'sku_cardigan_beige', 'Mark Down', 120, 5400.00),
('rec_03', 'sku_trench_oversized', 'Reallocate', 80, 9800.00)
ON CONFLICT (id) DO UPDATE SET recommended_qty = EXCLUDED.recommended_qty;

-- Phase 275: Inventory Risk Alerts
INSERT INTO inventory_risk_alerts (id, product_id, risk_type, risk_severity, triggered_date)
VALUES
('ira_01', 'sku_coat_cashmere', 'Stockout', 'Critical', NOW()),
('ira_02', 'sku_cardigan_beige', 'Overstock', 'Medium', NOW())
ON CONFLICT (id) DO UPDATE SET risk_severity = EXCLUDED.risk_severity;

-- Phase 276: Price Elasticity Models
INSERT INTO price_elasticity_models (id, product_id, elasticity_coefficient, optimal_price, current_price)
VALUES
('pem_01', 'sku_coat_cashmere', -1.75, 465.00, 450.00),
('pem_02', 'sku_trench_oversized', -1.25, 395.00, 380.00),
('pem_03', 'sku_cardigan_beige', -2.35, 135.00, 150.00)
ON CONFLICT (id) DO UPDATE SET elasticity_coefficient = EXCLUDED.elasticity_coefficient;

-- Phase 276: Elasticity Observations
INSERT INTO elasticity_observations (id, product_id, price_point, observed_demand_units, observation_date)
VALUES
('elo_01', 'sku_coat_cashmere', 420.00, 165, NOW() - INTERVAL '30 days'),
('elo_02', 'sku_coat_cashmere', 450.00, 140, NOW() - INTERVAL '15 days'),
('elo_03', 'sku_coat_cashmere', 480.00, 105, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO UPDATE SET observed_demand_units = EXCLUDED.observed_demand_units;

-- Phase 276: Elasticity Predictions
INSERT INTO elasticity_predictions (id, product_id, simulated_price_change_pct, predicted_volume_change_pct, predicted_profit_change_pct)
VALUES
('elp_01', 'sku_coat_cashmere', 5.00, -8.70, 6.40),
('elp_02', 'sku_coat_cashmere', -10.00, 17.50, -3.20),
('elp_03', 'sku_cardigan_beige', 10.00, -23.50, -15.80)
ON CONFLICT (id) DO UPDATE SET predicted_volume_change_pct = EXCLUDED.predicted_volume_change_pct;

-- Phase 277: Promotion Models
INSERT INTO promotion_models (id, promo_type, expected_uplift_pct, historical_roi)
VALUES
('prm_01', 'Percentage', 42.00, 2.85),
('prm_02', 'BOGO', 58.00, 1.94),
('prm_03', 'GiftWithPurchase', 25.00, 3.42)
ON CONFLICT (id) DO UPDATE SET historical_roi = EXCLUDED.historical_roi;

-- Phase 277: Promotion Effectiveness
INSERT INTO promotion_effectiveness (id, campaign_name, conversion_rate_multiplier, margin_dilution_pct)
VALUES
('pme_01', 'Muted Luxury Autumn Exclusive VIP Week', 1.85, 12.00),
('pme_02', 'Mid-Season High-Street Bundle Deal', 2.15, 25.00)
ON CONFLICT (id) DO UPDATE SET conversion_rate_multiplier = EXCLUDED.conversion_rate_multiplier;

-- Phase 277: Promotion Predictions
INSERT INTO promotion_predictions (id, campaign_id, predicted_gmv_uplift, predicted_units_sold)
VALUES
('prp_01', 'pme_01', 85000.00, 450),
('prp_02', 'pme_02', 42000.00, 620)
ON CONFLICT (id) DO UPDATE SET predicted_gmv_uplift = EXCLUDED.predicted_gmv_uplift;

-- Phase 278: Demand Risks V2
INSERT INTO demand_risks_v2 (id, risk_category, risk_score, description, mitigation_playbook)
VALUES
('drk_01', 'DemandCrash', 74, 'Erratic Winter Heatwave in Western Germany', 'Accelerate markdown on transitional lightweight cardigans and shift budget allocation to Italian retail stores.'),
('drk_02', 'SupplyChainDelay', 82, 'Suez Canal shipping block impacting organic cashmere yarn arrivals', 'Activate Italian alternate spinning mills to bypass sea channels and pay air-freight emergency markup, protecting margins.')
ON CONFLICT (id) DO UPDATE SET risk_score = EXCLUDED.risk_score;

-- Phase 278: Market Risks
INSERT INTO market_risks (id, macro_variable, current_deviation_pct, risk_level)
VALUES
('mrk_01', 'EUR Fashion Retail Core Inflation Spot', 2.65, 'Warning'),
('mrk_02', 'French Consumer Sentiment Index', -1.20, 'Safe')
ON CONFLICT (id) DO UPDATE SET current_deviation_pct = EXCLUDED.current_deviation_pct;

-- Phase 278: Supply Risks V2
INSERT INTO supply_risks_v2 (id, supplier_id, delay_probability_pct, capacity_utilization_pct)
VALUES
('srk_01', 'sup_milan_textile', 35, 88),
('srk_02', 'sup_scottish_spinning', 15, 92)
ON CONFLICT (id) DO UPDATE SET delay_probability_pct = EXCLUDED.delay_probability_pct;

-- Phase 279: Opportunities V2
INSERT INTO opportunities_v2 (id, opportunity_title, niche_tag, country, demand_growth_pct, competition_index, profit_margin_space_pct)
VALUES
('opt_01', 'Premium French Cashmere Long Wool Coat Niche Spike', 'French Long Cashmere Wool Coat', 'FR', 24.50, 38, 64.00),
('opt_02', 'Oversized Rain Trench Coat Storm Surge', 'London Heavy Rain Oversized Trench', 'GB', 19.80, 45, 58.00)
ON CONFLICT (id) DO UPDATE SET competition_index = EXCLUDED.competition_index;

-- Phase 279: Opportunity Scores V2
INSERT INTO opportunity_scores_v2 (id, opportunity_id, viability_score, confidence_factor)
VALUES
('osc_01', 'opt_01', 92, 89),
('osc_02', 'opt_02', 84, 91)
ON CONFLICT (id) DO UPDATE SET viability_score = EXCLUDED.viability_score;

-- Phase 279: Opportunity Actions
INSERT INTO opportunity_actions (id, opportunity_id, suggested_action, action_status)
VALUES
('oac_01', 'opt_01', 'Bulk pre-purchase of Cashmere raw assets from Scottish mills to hedge costs', 'Executing'),
('oac_02', 'opt_02', 'Generate dedicated marketing campaign targeting London financial district professionals', 'Discovered')
ON CONFLICT (id) DO UPDATE SET action_status = EXCLUDED.action_status;

-- Phase 280: Forecast Board Reports
INSERT INTO forecast_board_reports (id, report_title, author_agent_id, summary_text, created_at)
VALUES
('fbr_01', 'Autonomous Q3 European Demand Signals & Strategic Positioning Advisory', 'DemandIntelligenceAgent', 'Summary: Absolute strong spike in Premium Long Cashmere Coats across France and Great Britain backed by real-time thermal drops of -6.5°C and 95% TikTok Old Money social signals. Recommending dynamic price markup (+5%) and immediate stock allocation.', NOW())
ON CONFLICT (id) DO UPDATE SET summary_text = EXCLUDED.summary_text;

-- Phase 280: Forecast Board Decisions
INSERT INTO forecast_board_decisions (id, report_id, subject, required_action, p_success, status)
VALUES
('fbd_01', 'fbr_01', 'Stock Redistribution of Cashmere Long Coats to Paris Hub', 'Dispatch 250 units from Rotterdam central node, taking €12K margin safeguard.', 94.00, 'Pending'),
('fbd_02', 'fbr_01', 'Dynamic Price Markup for SKU-COAT-CASH-M', 'Shift base price from €450 to €465, expected profit gain: +6.4% based on elasticity calculation.', 89.00, 'Pending')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- Phase 280: Forecast Board Actions
INSERT INTO forecast_board_actions (id, decision_id, task_executor_agent, execution_log_summary, execution_status)
VALUES
('fba_01', 'fbd_01', 'LogisticsOrchestratorAgent', 'Pending board approval. Rotterdam port holds cargo ready for priority express flight scheduling.', 'Scheduled')
ON CONFLICT (id) DO UPDATE SET execution_status = EXCLUDED.execution_status;
