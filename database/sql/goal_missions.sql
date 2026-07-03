-- Goal Missions Database Table Schema for AI Enterprise Brain
CREATE TABLE IF NOT EXISTS goal_missions (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    goal_name VARCHAR(255) NOT NULL,
    target_metric VARCHAR(100) NOT NULL,
    target_value NUMERIC(15, 2) NOT NULL,
    current_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed', 'adjusted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for multi-tenant isolation and security boundary enforcement
CREATE INDEX IF NOT EXISTS idx_goal_missions_tenant ON goal_missions(tenant_id);
