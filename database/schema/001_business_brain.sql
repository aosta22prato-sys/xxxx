-- =========================================================================
-- AI Commerce OS - Business Brain V3 Database Schema
-- Architecture Edition: Multi-Tenant SaaS, Europe-First
-- Target Runtime: PostgreSQL 15+ / Cloud SQL Developer Edition
-- =========================================================================

-- 1. EXTENSIONS & SYSTEM CAPABILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TENANT & CONFIGURATION ROOT
CREATE TABLE IF NOT EXISTS system_tenants (
    tenant_id VARCHAR(64) PRIMARY KEY,
    store_name VARCHAR(128) NOT NULL,
    country_code VARCHAR(16) NOT NULL DEFAULT 'DE',
    currency VARCHAR(8) NOT NULL DEFAULT 'EUR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS merchant_configurations (
    config_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    vat_rate_default NUMERIC(5,2) NOT NULL DEFAULT 19.00,
    price_elasticity_scalar NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    is_promo_active BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. THREE-TIER SYSTEM MEMORY REPOSITORY
CREATE TABLE IF NOT EXISTS brain_working_memory (
    memory_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    memory_key VARCHAR(64) NOT NULL,
    memory_value TEXT NOT NULL,
    certainty_score NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    ttl_timestamp TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brain_business_experience (
    experience_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    action_category VARCHAR(64) NOT NULL,
    success_count INT NOT NULL DEFAULT 0,
    failure_count INT NOT NULL DEFAULT 0,
    average_rating NUMERIC(4,2) NOT NULL DEFAULT 5.00,
    weight_scalar NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    patterns_identified TEXT[] DEFAULT '{}'::TEXT[],
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brain_evolution_memory (
    evolution_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    phase VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    impact_metric VARCHAR(128) NOT NULL,
    hash_signature VARCHAR(64) NOT NULL
);

-- 4. COMMERCE WORLD MODEL & CAUSAL REASONING TELEMETRY
CREATE TABLE IF NOT EXISTS causal_diagram_nodes (
    node_id VARCHAR(64) PRIMARY KEY,
    node_name VARCHAR(128) NOT NULL,
    polarity VARCHAR(16) NOT NULL CHECK (polarity IN ('positive', 'negative')),
    description TEXT
);

CREATE TABLE IF NOT EXISTS causal_diagram_edges (
    edge_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    source_node VARCHAR(64) NOT NULL REFERENCES causal_diagram_nodes(node_id),
    target_node VARCHAR(64) NOT NULL REFERENCES causal_diagram_nodes(node_id),
    directed_weight NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    UNIQUE(source_node, target_node)
);

CREATE TABLE IF NOT EXISTS causal_reasoning_runs (
    run_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    trigger_event TEXT NOT NULL,
    calculated_cascade_score INT NOT NULL,
    max_affected_modules VARCHAR(64)[] DEFAULT '{}'::VARCHAR[],
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS causal_propagation_steps (
    step_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    run_id VARCHAR(64) NOT NULL REFERENCES causal_reasoning_runs(run_id) ON DELETE CASCADE,
    step_sequence INT NOT NULL,
    node_name VARCHAR(128) NOT NULL,
    consequence_text TEXT NOT NULL,
    propagation_probability NUMERIC(3,2) NOT NULL
);

-- 5. BUSINESS FORECASTS & STRATEGY OUTCOMES
CREATE TABLE IF NOT EXISTS brain_forecast_telemetry (
    forecast_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    metric_key VARCHAR(32) NOT NULL,
    forecast_date DATE NOT NULL,
    expected_value NUMERIC(12,2) NOT NULL,
    upper_confidence NUMERIC(12,2) NOT NULL,
    lower_confidence NUMERIC(12,2) NOT NULL,
    ad_spend_multiplier NUMERIC(4,2) DEFAULT 1.00,
    is_promo_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, metric_key, forecast_date)
);

CREATE TABLE IF NOT EXISTS brain_growth_strategies (
    strategy_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    strategic_goal TEXT NOT NULL,
    required_budget_eur NUMERIC(12,2) NOT NULL,
    expected_roi_multiplier NUMERIC(5,2) NOT NULL,
    targeted_channels TEXT[] DEFAULT '{}'::TEXT[],
    direct_tasks TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. AUTONOMOUS INVESTIGATION & DECISION SELF-CRITIQUE AUDITING
CREATE TABLE IF NOT EXISTS brain_investigation_cases (
    case_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    incident_code VARCHAR(64) NOT NULL,
    hypothesis_checked VARCHAR(64)[] DEFAULT '{}'::VARCHAR[],
    evidence_collected TEXT[] DEFAULT '{}'::TEXT[],
    final_verdict TEXT NOT NULL,
    investigated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brain_decision_critiques (
    critique_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    original_conclusion TEXT NOT NULL,
    challenge_conclusion TEXT NOT NULL,
    probability_adjustment NUMERIC(4,2) NOT NULL DEFAULT 0.00,
    counter_evidence TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS executive_board_reports (
    report_id VARCHAR(64) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(64) NOT NULL REFERENCES system_tenants(tenant_id) ON DELETE CASCADE,
    report_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_financial_health VARCHAR(128) NOT NULL,
    board_overview TEXT NOT NULL,
    primary_threat_code VARCHAR(64) NOT NULL,
    primary_opportunity TEXT NOT NULL,
    confidence_index NUMERIC(3,2) NOT NULL
);

-- 7. PHYSICAL INDEX TUNING FOR OPTIMIZED COMPACTION & MULTI-TENANCY
CREATE INDEX IF NOT EXISTS idx_tenants_country ON system_tenants(country_code);
CREATE INDEX IF NOT EXISTS idx_working_mem_tenant_key ON brain_working_memory(tenant_id, memory_key);
CREATE INDEX IF NOT EXISTS idx_exp_tenant_cat ON brain_business_experience(tenant_id, action_category);
CREATE INDEX IF NOT EXISTS idx_evolution_tenant_time ON brain_evolution_memory(tenant_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_causal_run_tenant ON causal_reasoning_runs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_causal_step_run ON causal_propagation_steps(run_id);
CREATE INDEX IF NOT EXISTS idx_forecast_metrics ON brain_forecast_telemetry(tenant_id, metric_key, forecast_date);
CREATE INDEX IF NOT EXISTS idx_investigation_tenant ON brain_investigation_cases(tenant_id, incident_code);
CREATE INDEX IF NOT EXISTS idx_board_report_time ON executive_board_reports(tenant_id, report_timestamp DESC);
