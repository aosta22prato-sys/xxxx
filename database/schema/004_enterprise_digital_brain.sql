-- =========================================================================
-- AI Commerce OS - Enterprise Digital Brain Database Schema
-- Architecture Edition: Multi-Tenant SaaS, Europe-First
-- Covers: Decision Quality, Forecast Accuracy, Goal Achievement, Strategy Evolution,
-- Digital Twin Experiential Simulation, and Meta-Learning Core.
-- =========================================================================

-- 1. DECISION QUALITY ENGINE LOGS
CREATE TABLE IF NOT EXISTS decision_quality_logs (
    decision_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    action_type VARCHAR(128) NOT NULL,
    scored_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expected_yield_value NUMERIC(15,2) NOT NULL,
    actual_realized_value NUMERIC(15,2),
    deviation_percentage NUMERIC(5,2),
    cognitive_depth_level INT NOT NULL DEFAULT 1,
    decision_quality_score NUMERIC(3,2) NOT NULL DEFAULT 1.00
);

-- 2. FORECAST ACCURACY RECORDS
CREATE TABLE IF NOT EXISTS forecast_accuracy_metrics (
    metric_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    metric_key VARCHAR(64) NOT NULL,
    forecast_target_date DATE NOT NULL,
    forecast_expected_value NUMERIC(15,2) NOT NULL,
    actual_realized_value NUMERIC(15,2),
    calculated_accuracy NUMERIC(5,2),
    adjusted_weights JSONB DEFAULT '{}'::JSONB,
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. GOAL ACHIEVEMENT TRACKER
CREATE TABLE IF NOT EXISTS goal_achievement_records (
    goal_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    goal_name VARCHAR(128) NOT NULL,
    target_value NUMERIC(15,2) NOT NULL,
    current_value NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    is_success BOOLEAN NOT NULL DEFAULT FALSE,
    estimated_delivery_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. AUTONOMOUS STRATEGY EVOLUTION WEIGHTS
CREATE TABLE IF NOT EXISTS strategy_evolution_weights (
    strategy_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    strategy_name VARCHAR(128) NOT NULL,
    success_count INT NOT NULL DEFAULT 0,
    failure_count INT NOT NULL DEFAULT 0,
    reinforcement_factor NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    is_retired BOOLEAN NOT NULL DEFAULT FALSE,
    last_evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BUSINESS DIGITAL TWIN EXPERIMENTAL RUNS
CREATE TABLE IF NOT EXISTS digital_twin_experiments (
    experiment_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    action_code VARCHAR(128) NOT NULL,
    simulation_runs_count INT NOT NULL DEFAULT 100,
    best_case_gain NUMERIC(15,2) NOT NULL,
    expected_case_gain NUMERIC(15,2) NOT NULL,
    worst_case_gain NUMERIC(15,2) NOT NULL,
    success_probability NUMERIC(3,2) NOT NULL,
    simulated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. META LEARNING MODEL RECTIFICATIONS
CREATE TABLE IF NOT EXISTS meta_learning_summaries (
    record_id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL,
    learning_factor VARCHAR(128) NOT NULL,
    measured_error NUMERIC(5,2) NOT NULL,
    correction_applied_factor NUMERIC(4,2) NOT NULL,
    rectified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ADVANCED INDEX OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_dec_quality_tenant ON decision_quality_logs(tenant_id, decision_quality_score);
CREATE INDEX IF NOT EXISTS idx_fc_accuracy_date ON forecast_accuracy_metrics(tenant_id, forecast_target_date);
CREATE INDEX IF NOT EXISTS idx_goal_ach_tenant ON goal_achievement_records(tenant_id, is_success);
CREATE INDEX IF NOT EXISTS idx_strategy_ev_retired ON strategy_evolution_weights(tenant_id, is_retired);
CREATE INDEX IF NOT EXISTS idx_digital_twin_action ON digital_twin_experiments(tenant_id, action_code);
