-- Postgres schema for Phase 271-280: Fashion Demand Intelligence Engine

-- Phase 271: Demand Signal Engine
CREATE TABLE IF NOT EXISTS demand_signal_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Weather', 'Temperature', 'Holiday', 'WageCycle', 'Tourism', 'SocialHeat', 'Competitor')),
    base_weight INT NOT NULL CHECK (base_weight BETWEEN 0 AND 100),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS demand_signals (
    id VARCHAR(50) PRIMARY KEY,
    source_id VARCHAR(50) NOT NULL REFERENCES demand_signal_sources(id),
    signal_type VARCHAR(255) NOT NULL,
    magnitude_score INT NOT NULL CHECK (magnitude_score BETWEEN 0 AND 100),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Processed', 'Suppressed'))
);

CREATE TABLE IF NOT EXISTS demand_signal_weights (
    id VARCHAR(50) PRIMARY KEY,
    source_id VARCHAR(50) NOT NULL REFERENCES demand_signal_sources(id),
    country VARCHAR(10) NOT NULL,
    applied_weight INT NOT NULL CHECK (applied_weight BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS demand_signal_history (
    id VARCHAR(50) PRIMARY KEY,
    signal_id VARCHAR(50) NOT NULL REFERENCES demand_signals(id),
    date_logged TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    previous_value NUMERIC(10, 2) NOT NULL,
    new_value NUMERIC(10, 2) NOT NULL
);

-- Phase 272: Regional Demand Forecast
CREATE TABLE IF NOT EXISTS regional_forecast_models (
    id VARCHAR(50) PRIMARY KEY,
    model_name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    hyperparameters TEXT,
    accuracy_score NUMERIC(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS regional_forecasts_v2 (
    id VARCHAR(50) PRIMARY KEY,
    country VARCHAR(10) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    time_horizon VARCHAR(10) NOT NULL CHECK (time_horizon IN ('7d', '30d', '90d')),
    forecasted_growth_pct NUMERIC(5, 2) NOT NULL,
    confidence_score INT NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
    model_id VARCHAR(50) NOT NULL REFERENCES regional_forecast_models(id),
    run_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS regional_forecast_results_v2 (
    id VARCHAR(50) PRIMARY KEY,
    forecast_id VARCHAR(50) NOT NULL REFERENCES regional_forecasts_v2(id) ON DELETE CASCADE,
    trend_direction VARCHAR(10) NOT NULL CHECK (trend_direction IN ('UP', 'DOWN', 'STABLE')),
    upper_bound_pct NUMERIC(5, 2) NOT NULL,
    lower_bound_pct NUMERIC(5, 2) NOT NULL
);

-- Phase 273: Trend Detection Engine
CREATE TABLE IF NOT EXISTS trend_signals_v2 (
    id VARCHAR(50) PRIMARY KEY,
    trend_name VARCHAR(255) NOT NULL,
    signal_strength INT NOT NULL CHECK (signal_strength BETWEEN 0 AND 100),
    source_platform VARCHAR(100) NOT NULL,
    detection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trend_patterns (
    id VARCHAR(50) PRIMARY KEY,
    pattern_name VARCHAR(255) NOT NULL,
    coherence_score INT NOT NULL CHECK (coherence_score BETWEEN 0 AND 100),
    lifecycle_velocity VARCHAR(20) NOT NULL CHECK (lifecycle_velocity IN ('Accelerating', 'Steady', 'Decelerating'))
);

CREATE TABLE IF NOT EXISTS trend_events_v2 (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    impact_factor INT NOT NULL CHECK (impact_factor BETWEEN 1 AND 10),
    event_date TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS trend_alerts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_acknowledged BOOLEAN DEFAULT FALSE
);

-- Phase 274: Fashion Lifecycle Engine
CREATE TABLE IF NOT EXISTS lifecycle_stages (
    id VARCHAR(50) PRIMARY KEY,
    stage_name VARCHAR(50) NOT NULL CHECK (stage_name IN ('Introduction', 'Growth', 'Maturity', 'Decline')),
    typical_duration_days INT NOT NULL,
    target_margin_pct NUMERIC(5, 2) NOT NULL
);

-- Phase 275: Inventory Demand Intelligence
CREATE TABLE IF NOT EXISTS inventory_forecasts_v2 (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    country VARCHAR(10) NOT NULL,
    days_to_stockout INT NOT NULL,
    predicted_overstock_units INT NOT NULL,
    recommended_safety_stock INT NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_recommendations (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL CHECK (recommendation_type IN ('Replenish', 'Mark Down', 'Reallocate', 'Hold')),
    recommended_qty INT NOT NULL,
    potential_profit_restored DECIMAL(12, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_risk_alerts (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    risk_type VARCHAR(50) NOT NULL CHECK (risk_type IN ('Stockout', 'Overstock', 'Supply Delay')),
    risk_severity VARCHAR(20) NOT NULL CHECK (risk_severity IN ('Medium', 'High', 'Critical')),
    triggered_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Phase 276: Price Elasticity AI
CREATE TABLE IF NOT EXISTS price_elasticity_models (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) UNIQUE NOT NULL,
    elasticity_coefficient NUMERIC(6, 3) NOT NULL,
    optimal_price NUMERIC(10, 2) NOT NULL,
    current_price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS elasticity_observations (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    price_point NUMERIC(10, 2) NOT NULL,
    observed_demand_units INT NOT NULL,
    observation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS elasticity_predictions (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    simulated_price_change_pct NUMERIC(5, 2) NOT NULL,
    predicted_volume_change_pct NUMERIC(5, 2) NOT NULL,
    predicted_profit_change_pct NUMERIC(5, 2) NOT NULL
);

-- Phase 277: Promotion Intelligence Engine
CREATE TABLE IF NOT EXISTS promotion_models (
    id VARCHAR(50) PRIMARY KEY,
    promo_type VARCHAR(50) NOT NULL CHECK (promo_type IN ('Percentage', 'FixedAmount', 'BOGO', 'GiftWithPurchase')),
    expected_uplift_pct NUMERIC(5, 2) NOT NULL,
    historical_roi NUMERIC(6, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS promotion_effectiveness (
    id VARCHAR(50) PRIMARY KEY,
    campaign_name VARCHAR(255) NOT NULL,
    conversion_rate_multiplier NUMERIC(5, 2) NOT NULL,
    margin_dilution_pct NUMERIC(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS promotion_predictions (
    id VARCHAR(50) PRIMARY KEY,
    campaign_id VARCHAR(50) NOT NULL,
    predicted_gmv_uplift NUMERIC(15, 2) NOT NULL,
    predicted_units_sold INT NOT NULL
);

-- Phase 278: Demand Risk Engine
CREATE TABLE IF NOT EXISTS demand_risks_v2 (
    id VARCHAR(50) PRIMARY KEY,
    risk_category VARCHAR(50) NOT NULL CHECK (risk_category IN ('DemandCrash', 'Overstock', 'SupplyChainDelay', 'MarketVolatility')),
    risk_score INT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    description TEXT,
    mitigation_playbook TEXT
);

CREATE TABLE IF NOT EXISTS market_risks (
    id VARCHAR(50) PRIMARY KEY,
    macro_variable VARCHAR(255) NOT NULL,
    current_deviation_pct NUMERIC(5, 2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Safe', 'Warning', 'Hazard'))
);

CREATE TABLE IF NOT EXISTS supply_risks_v2 (
    id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50) NOT NULL,
    delay_probability_pct INT NOT NULL CHECK (delay_probability_pct BETWEEN 0 AND 100),
    capacity_utilization_pct INT NOT NULL CHECK (capacity_utilization_pct BETWEEN 0 AND 100)
);

-- Phase 279: Opportunity Discovery Engine
CREATE TABLE IF NOT EXISTS opportunities_v2 (
    id VARCHAR(50) PRIMARY KEY,
    opportunity_title VARCHAR(255) NOT NULL,
    niche_tag VARCHAR(100) NOT NULL,
    country VARCHAR(10) NOT NULL,
    demand_growth_pct NUMERIC(5, 2) NOT NULL,
    competition_index INT NOT NULL CHECK (competition_index BETWEEN 0 AND 100),
    profit_margin_space_pct NUMERIC(5, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS opportunity_scores_v2 (
    id VARCHAR(50) PRIMARY KEY,
    opportunity_id VARCHAR(50) NOT NULL REFERENCES opportunities_v2(id) ON DELETE CASCADE,
    viability_score INT NOT NULL CHECK (viability_score BETWEEN 0 AND 100),
    confidence_factor INT NOT NULL CHECK (confidence_factor BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS opportunity_actions (
    id VARCHAR(50) PRIMARY KEY,
    opportunity_id VARCHAR(50) NOT NULL REFERENCES opportunities_v2(id) ON DELETE CASCADE,
    suggested_action TEXT NOT NULL,
    action_status VARCHAR(20) NOT NULL CHECK (action_status IN ('Discovered', 'Executing', 'Completed'))
);

-- Phase 280: Autonomous Forecast Board
CREATE TABLE IF NOT EXISTS forecast_board_reports (
    id VARCHAR(50) PRIMARY KEY,
    report_title VARCHAR(255) NOT NULL,
    author_agent_id VARCHAR(100) NOT NULL,
    summary_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forecast_board_decisions (
    id VARCHAR(50) PRIMARY KEY,
    report_id VARCHAR(50) NOT NULL REFERENCES forecast_board_reports(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    required_action TEXT NOT NULL,
    p_success NUMERIC(5, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

CREATE TABLE IF NOT EXISTS forecast_board_actions (
    id VARCHAR(50) PRIMARY KEY,
    decision_id VARCHAR(50) NOT NULL REFERENCES forecast_board_decisions(id) ON DELETE CASCADE,
    task_executor_agent VARCHAR(100) NOT NULL,
    execution_log_summary TEXT NOT NULL,
    execution_status VARCHAR(20) NOT NULL CHECK (execution_status IN ('Scheduled', 'In Progress', 'Success', 'Failed'))
);
