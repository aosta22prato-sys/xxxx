-- =========================================================================
-- AI Commerce OS - Trusted Enterprise Intelligence System Database Schema
-- Architecture Edition: Multi-Tenant SaaS, Europe-First
-- Covers: Truth Engine, Evidence Engine, Business Constitution, Multi-Agent Governance & Enterprise Audit
-- =========================================================================

-- 1. TRUTH & EVIDENCE ENGINE INDEX REPOSITORY
CREATE TABLE IF NOT EXISTS brain_truth_facts (
    fact_id VARCHAR(64) PRIMARY KEY,
    statement TEXT NOT NULL,
    is_observable_fact BOOLEAN NOT NULL DEFAULT TRUE,
    source_module VARCHAR(128) NOT NULL,
    verification_confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brain_inference_foundations (
    inference_id VARCHAR(64) PRIMARY KEY,
    statement TEXT NOT NULL,
    predictive_span_days INT NOT NULL DEFAULT 7,
    foundation_evidence_keys VARCHAR(64)[] DEFAULT '{}'::VARCHAR[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brain_evidence_graph_edges (
    edge_id VARCHAR(64) PRIMARY KEY,
    source_node VARCHAR(64) NOT NULL,
    target_node VARCHAR(64) NOT NULL,
    correlation_scalar NUMERIC(4,2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BUSINESS CONSTITUTION RULE BOOK & CLAUSE ENFORCEMENT
CREATE TABLE IF NOT EXISTS business_constitution_clauses (
    clause_code VARCHAR(64) PRIMARY KEY,
    clause_title VARCHAR(128) NOT NULL,
    minimum_threshold_value NUMERIC(12,2) NOT NULL,
    severity_level VARCHAR(32) NOT NULL CHECK (severity_level IN ('P0_CRITICAL', 'P1_WARNING')),
    description TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS constitution_compliance_checks (
    check_id VARCHAR(64) PRIMARY KEY,
    strategy_name VARCHAR(128) NOT NULL,
    clause_code VARCHAR(64) REFERENCES business_constitution_clauses(clause_code) ON DELETE CASCADE,
    is_compliant BOOLEAN NOT NULL DEFAULT TRUE,
    violation_notes TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. MULTI-AGENT GOVERNOR GATING & AUTHORIZATION LAWS
CREATE TABLE IF NOT EXISTS multi_agent_gatekeeper_runs (
    gate_run_id VARCHAR(64) PRIMARY KEY,
    agent_name VARCHAR(64) NOT NULL,
    proposed_action VARCHAR(256) NOT NULL,
    is_authorized BOOLEAN NOT NULL DEFAULT FALSE,
    authorization_authority VARCHAR(64) NOT NULL CHECK (authorization_authority IN ('BRAIN_GOVERNOR', 'REVIEW_BOARD', 'DENIED')),
    audit_trail_code VARCHAR(64) NOT NULL,
    evaluation_log TEXT NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ENTERPRISE AUDIT SYSTEM TRACE LOGS (LONG TERM)
CREATE TABLE IF NOT EXISTS enterprise_audit_trail (
    tracking_guid VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    decision_maker VARCHAR(128) NOT NULL,
    reasoning_basis TEXT NOT NULL,
    evidence_cited_keys VARCHAR(64)[] DEFAULT '{}'::VARCHAR[],
    action_target VARCHAR(128) NOT NULL,
    estimated_outcome_label VARCHAR(256) NOT NULL
);

-- 5. RELATIONAL DATA INDEXES
CREATE INDEX IF NOT EXISTS idx_truth_fact_source ON brain_truth_facts(source_module);
CREATE INDEX IF NOT EXISTS idx_constitution_compliance ON constitution_compliance_checks(clause_code, is_compliant);
CREATE INDEX IF NOT EXISTS idx_agent_gate_authority ON multi_agent_gatekeeper_runs(agent_name, authorization_authority);
CREATE INDEX IF NOT EXISTS idx_audit_trace ON enterprise_audit_trail(decision_maker, timestamp DESC);
