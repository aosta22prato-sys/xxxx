-- =========================================================================
-- AI Commerce OS - Enterprise Trust & Governance Database Schema
-- Architecture Edition: Multi-Tenant SaaS, Europe-First
-- Covers: Truth Engine, Evidence Engine, Reasoning Chain, Constitution Rules,
-- and Blockchain-Style Unalterable Audit Chain.
-- =========================================================================

-- 1. DECISION EVIDENCE REPOSITORY (TRUTH & EVIDENCE ENGINE)
CREATE TABLE IF NOT EXISTS enterprise_decision_evidence (
    evidence_id VARCHAR(64) PRIMARY KEY,
    decision_id VARCHAR(64) NOT NULL,
    evidence_type VARCHAR(64) NOT NULL CHECK (evidence_type IN ('PHYSICAL_FACT', 'MODEL_INFERENCE', 'EXTERNAL_SIGNAL')),
    evidence_source VARCHAR(128) NOT NULL, -- e.g. WMS, CRM, ADS
    confidence NUMERIC(3,2) NOT NULL DEFAULT 1.00,
    fact_or_inference VARCHAR(32) NOT NULL CHECK (fact_or_inference IN ('FACT', 'INFERENCE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DYNAMIC REASONING CASCADE TRAIL
CREATE TABLE IF NOT EXISTS enterprise_reasoning_chain (
    chain_id VARCHAR(64) PRIMARY KEY,
    hypothesis TEXT NOT NULL,
    supporting_evidence TEXT[] DEFAULT '{}'::TEXT[],
    counter_evidence TEXT[] DEFAULT '{}'::TEXT[],
    confidence NUMERIC(3,2) NOT NULL,
    conclusion TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. EXPANDED BUSINESS CONSTITUTION RULES BOOK
CREATE TABLE IF NOT EXISTS business_constitution_rules (
    rule_id VARCHAR(64) PRIMARY KEY,
    rule_name VARCHAR(128) NOT NULL,
    rule_type VARCHAR(64) NOT NULL, -- e.g. MARGIN, STOCK, CASHFLOW
    threshold_value NUMERIC(12,2) NOT NULL,
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('P0_CRITICAL', 'P1_WARNING')),
    violation_action VARCHAR(64) NOT NULL CHECK (violation_action IN ('BLOCK_EXECUTION', 'TRIGGER_WARNING', 'FREEZE_STRATEGY')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. UNALTERABLE BLOCKCHAIN-STYLE AUDIT CHAIN
-- We expand upon the initial trace logs with previous_hash, record_hash, and digital signature verification metrics
CREATE TABLE IF NOT EXISTS unalterable_audit_chain (
    tracking_guid VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    decision_maker VARCHAR(128) NOT NULL,
    reasoning_basis TEXT NOT NULL,
    evidence_cited_keys VARCHAR(64)[] DEFAULT '{}'::VARCHAR[],
    action_target VARCHAR(128) NOT NULL,
    estimated_outcome_label VARCHAR(256) NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    record_hash VARCHAR(64) NOT NULL,
    digital_signature VARCHAR(128) NOT NULL,
    is_compromised BOOLEAN NOT NULL DEFAULT FALSE
);

-- 5. ADVANCED INDEX OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_dec_evidence_id ON enterprise_decision_evidence(decision_id);
CREATE INDEX IF NOT EXISTS idx_reasoning_hypothesis ON enterprise_reasoning_chain(hypothesis);
CREATE INDEX IF NOT EXISTS idx_blockchain_audit_prev_hash ON unalterable_audit_chain(previous_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_audit_hash ON unalterable_audit_chain(record_hash);
