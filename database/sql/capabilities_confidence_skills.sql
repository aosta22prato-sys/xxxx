-- AI Commerce OS - Capability, Confidence, Skills, and Multi-Store Intelligence Tables (Architecture Lock v1.0)
-- Target: Postgresql Relational Storage

-- 1. Capability Scores Table (Phase 203)
CREATE TABLE IF NOT EXISTS capability_scores (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    trend VARCHAR(20) NOT NULL DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}'
);

-- 2. Decision Confidences Table (Phase 204)
CREATE TABLE IF NOT EXISTS decision_confidences (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    decision_ref_id VARCHAR(50) NOT NULL,
    decision_type VARCHAR(55) NOT NULL,
    title VARCHAR(200) NOT NULL,
    decision_confidence INTEGER NOT NULL CHECK (decision_confidence >= 0 AND decision_confidence <= 100),
    strategy_confidence INTEGER NOT NULL CHECK (strategy_confidence >= 0 AND strategy_confidence <= 100),
    forecast_confidence INTEGER NOT NULL CHECK (forecast_confidence >= 0 AND forecast_confidence <= 100),
    requires_governor_approval BOOLEAN NOT NULL DEFAULT FALSE,
    governor_status VARCHAR(35) NOT NULL DEFAULT 'auto_passed' CHECK (governor_status IN ('pending_review', 'approved', 'rejected', 'auto_passed')),
    analysis_breakdown TEXT NOT NULL,
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Skill Graph Nodes Table (Phase 205)
CREATE TABLE IF NOT EXISTS skill_graph_nodes (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    skill_key VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    level VARCHAR(30) NOT NULL DEFAULT 'Novice' CHECK (level IN ('Novice', 'Competent', 'Advanced', 'Expert', 'Master')),
    success_rate INTEGER NOT NULL CHECK (success_rate >= 0 AND success_rate <= 100),
    historical_revenue_gain NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    failure_rate INTEGER NOT NULL CHECK (failure_rate >= 0 AND failure_rate <= 100),
    experience_count INTEGER NOT NULL DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Cross Store Experiences Table (Phase 206)
CREATE TABLE IF NOT EXISTS cross_store_experiences (
    id VARCHAR(50) PRIMARY KEY,
    original_tenant_id_hash VARCHAR(100) NOT NULL,
    market_country VARCHAR(10) NOT NULL,
    product_category VARCHAR(100) NOT NULL,
    strategy_type VARCHAR(100) NOT NULL,
    action_detail TEXT NOT NULL,
    outcome_gmv_growth_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    sample_size INTEGER NOT NULL DEFAULT 1,
    avg_revenue_impact NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    confidence_rating INTEGER NOT NULL CHECK (confidence_rating >= 0 AND confidence_rating <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
