-- AI Commerce OS - Business Workflow Engine Database Schema (Architecture Lock v1.0)
-- Target Platform: PostgreSQL (SaaS-Ready, Europe-First)

CREATE TABLE IF NOT EXISTS workflow_templates (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL, -- inventory_low, customer_churn, pricing_anomaly
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS workflow_instances (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    template_id VARCHAR(50) NOT NULL REFERENCES workflow_templates(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    status VARCHAR(30) DEFAULT 'running' NOT NULL, -- running, completed, failed, suspended
    current_step_id VARCHAR(50),
    trigger_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS workflow_steps (
    id VARCHAR(50) PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- inventory_check, purchase_plan, risk_review, execute, verify_results
    status VARCHAR(30) DEFAULT 'pending' NOT NULL, -- pending, running, completed, failed
    assigned_agent VARCHAR(100), -- InventoryAgent, MarketingAgent, CustomerAgent, PricingAgent, FinanceAgent
    execution_response TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS workflow_execution_logs (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    workflow_instance_id VARCHAR(50) REFERENCES workflow_instances(id) ON DELETE CASCADE,
    step_id VARCHAR(50) REFERENCES workflow_steps(id) ON DELETE SET NULL,
    log_level VARCHAR(20) DEFAULT 'info' NOT NULL, -- info, warning, error, governance_audit
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS workflow_results (
    id VARCHAR(50) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL,
    workflow_instance_id VARCHAR(50) UNIQUE REFERENCES workflow_instances(id) ON DELETE CASCADE,
    outcome VARCHAR(20) NOT NULL, -- success, failure
    revenue_gained DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    cost_saved DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    metrics_impact TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
