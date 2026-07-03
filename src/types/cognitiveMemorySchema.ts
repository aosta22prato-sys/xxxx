/******************************************************************************
 * AI Commerce OS - Enterprise Operating Memory Layer Schema Definition (v1.0)
 * =========================================================================
 * 
 * This file declares the strict physical SQL configurations, relational keys,
 * column dictionaries, ERD mapping descriptions, migration workflows,
 * audit rules, and lifecycle designs for Phases 106 to 110.
 ******************************************************************************/

/**
 * =========================================================================
 * 1. ENTITY RELATIONSHIP DIAGRAM (ERD) & RELATIONAL KEY STRUCTURES
 * =========================================================================
 * 
 *   [tenants] 1 -------- 1/N [enterprise_identity_profiles] 
 *     |
 *     +--- N [enterprise_knowledge_memories] (Market, channel, discount rules)
 *     |
 *     +--- N [enterprise_decision_memories] (Decision log, rationale, simulations)
 *     |
 *     +--- N [enterprise_failure_memories] (Failures, waste indexes, guard rules)
 *     |
 *     +--- N [institutional_learning_logs] (Consolidated cross-memory auto-learning)
 *     |
 *     +--- 1 [executive_memory_priorities] (Owner preference locks & watermarks)
 *     |
 *     +--- N [digital_twin_accuracy_logs] (Actual vs Predicted alignment, bias retunes)
 * 
 * Strict Relational Isolation:
 * - Every table enforces mandatory index compound on (tenant_id, store_id)
 * - All primary keys are BigInt equivalents (emulated as number inside the TS memory engine)
 */

/**
 * Phase 106: Enterprise Knowledge Memory Table Schema
 * Represents stored domain configurations, market traits, and channel insights of the store.
 */
export interface EnterpriseKnowledgeMemoryRecord {
  id: number;                 // bigint PRIMARY KEY
  tenant_id: number;          // bigint REFERENCES tenants(id)
  store_id: number;           // bigint REFERENCES stores(id)
  knowledge_key: string;      // varchar(128) - Unique lookup key (e.g., 'MARKET_FR_SEASONAL')
  category: "MARKET_TRAIT" | "CHANNEL_INSIGHT" | "DISCOUNT_RULE" | "OPERATIONAL_TRICK";
  locale_scope: string;       // varchar(16) - e.g., 'FR', 'IT', 'GLOBAL'
  factual_content: string;    // text - Real, validated, non-hallucinated knowledge
  confidence_score: number;   // decimal(5,2) - Range 0.00 to 100.00
  source_evidence_link: string; // varchar(512) - Provenance url / audit reference
  
  // Strict Audit Fields
  configured_at: string;      // timestamp
  created_by: string;         // varchar(64) - Name of AI Agent / Exec setting this
  lifetime_score: number;     // int - Success-relevance multiplier score
  temporal_span: string;      // varchar(64) - e.g. '2026-Q1 to 2026-Q4'
  status: "ACTIVE" | "ARCHIVED" | "DEPRECATED";
  audit_hash: string;         // char(64) - Data integrity authentication token
}

/**
 * Phase 107: Decision Memory Table Schema
 * Logs historical senior executive decisions, the rationale behind them, estimated values, and actual outcomes.
 */
export interface EnterpriseDecisionMemoryRecord {
  id: number;                 // bigint PRIMARY KEY
  tenant_id: number;          // bigint REFERENCES tenants(id)
  store_id: number;           // bigint REFERENCES stores(id)
  decision_title: string;     // varchar(256)
  decision_type: "PRICING_ADJUSTMENT" | "INVENTORY_STOCKED" | "MARKETING_SHIFT" | "GATEWAY_DEPLOYMENT";
  proposed_at: string;        // timestamp
  executed_at: string;        // timestamp
  estimated_gmv_uplift: number;// decimal(15,2)
  estimated_net_profit: number;// decimal(15,2)
  actual_outcome_gmv: number | null; // decimal(15,2) - Filled retrospectively on accuracy audit
  actual_outcome_profit: number | null; // decimal(15,2)
  
  // Executive Context
  executive_rationale: string;  // text - Deep strategic reasons
  pushed_by: string;            // varchar(64) - e.g. 'CEO_AGENT_01'
  source_evidence_link: string; // varchar(512) - Referencing specific simulation IDs
  
  // Strict Audit Fields
  configured_at: string;
  created_by: string;
  lifetime_score: number;
  temporal_span: string;
  status: "APPROVED_EXECUTED" | "RETRACTED_STRATEGIC_CONFLICT" | "AUDITED_SUCCESS" | "AUDITED_DRIFTED";
  audit_hash: string;
}

/**
 * Phase 108: Failure Memory Table Schema
 * A definitive ledger representing strategy mismatches, bad ad networks, or overstock bottlenecks to prevent recidivism.
 */
export interface EnterpriseFailureMemoryRecord {
  id: number;                 // bigint PRIMARY KEY
  tenant_id: number;          // bigint REFERENCES tenants(id)
  store_id: number;           // bigint REFERENCES stores(id)
  failure_trigger: string;    // varchar(128) - Event key (e.g., 'TIKTOK_CPM_SPIKE_Q1')
  failure_scenario: string;   // varchar(256) - Short scene description
  root_cause: string;         // text - Grounded analysis
  financial_waste: number;    // decimal(15,2) - Quantified waste
  operational_delay_hours: number;
  veto_rules_asserted: string; // text - Constraint generated and dead-locked in compiled assets
  
  // Strict Audit Fields
  configured_at: string;
  created_by: string;
  source_evidence_link: string;
  lifetime_score: number;
  temporal_span: string;
  status: "LOCKED_PREVENTION" | "REVIEWED_PENDING_VETO" | "DEPRECATED";
  audit_hash: string;
}

/**
 * Phase 109: Institutional Learning Engine Logs Table Schema
 * Consolidates knowledge validation, cross-history reviews, or neural drift reconciliations.
 */
export interface InstitutionalLearningLogRecord {
  id: number;                 // bigint PRIMARY KEY
  tenant_id: number;          // bigint REFERENCES tenants(id)
  store_id: number;           // bigint REFERENCES stores(id)
  session_token: string;      // varchar(128)
  reconciliation_type: "CROSS_HISTORY_PATTERNING" | "DNA_EVOLUTION_SYNTH" | "OUTCOME_FEEDBACK_CALIBRATION";
  records_processed: number;
  unification_narrative: string; // text - AI learnings consolidated
  drift_recalibrated_bias: number; // decimal(5,3) - Adaptive bias shift multiplier
  
  // Strict Audit Fields
  configured_at: string;
  created_by: string;
  source_evidence_link: string;
  lifetime_score: number;
  temporal_span: string;
  status: "CALIBRATION_STABLE" | "HIGH_DRIFT_ALERT" | "RETRAINED";
  audit_hash: string;
}

/**
 * SQL MIGRATION MANIFEST (DDL REFERENCE)
 * -----------------------------------------------------------------------------
 * -- 106. Enterprise Knowledge Memories
 * CREATE TABLE enterprise_knowledge_memories (
 *   id BIGINT PRIMARY KEY,
 *   tenant_id BIGINT NOT NULL,
 *   store_id BIGINT NOT NULL,
 *   knowledge_key VARCHAR(128) NOT NULL,
 *   category VARCHAR(32) NOT NULL,
 *   locale_scope VARCHAR(16) NOT NULL,
 *   factual_content TEXT NOT NULL,
 *   confidence_score DECIMAL(5,2) NOT NULL DEFAULT 100.00,
 *   source_evidence_link VARCHAR(512),
 *   configured_at TIMESTAMP NOT NULL DEFAULT NOW(),
 *   created_by VARCHAR(64) NOT NULL,
 *   lifetime_score INT NOT NULL DEFAULT 50,
 *   temporal_span VARCHAR(64) NOT NULL,
 *   status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
 *   audit_hash CHAR(64) NOT NULL
 * );
 * CREATE INDEX idx_ekm_tenant_store ON enterprise_knowledge_memories(tenant_id, store_id);
 * CREATE UNIQUE INDEX idx_ekm_key_unique ON enterprise_knowledge_memories(tenant_id, store_id, knowledge_key);
 * 
 * -- 107. Enterprise Decision Memories
 * CREATE TABLE enterprise_decision_memories (
 *   id BIGINT PRIMARY KEY,
 *   tenant_id BIGINT NOT NULL,
 *   store_id BIGINT NOT NULL,
 *   decision_title VARCHAR(256) NOT NULL,
 *   decision_type VARCHAR(64) NOT NULL,
 *   proposed_at TIMESTAMP NOT NULL,
 *   executed_at TIMESTAMP NOT NULL,
 *   estimated_gmv_uplift DECIMAL(15,2) NOT NULL DEFAULT 0.00,
 *   estimated_net_profit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
 *   actual_outcome_gmv DECIMAL(15,2),
 *   actual_outcome_profit DECIMAL(15,2),
 *   executive_rationale TEXT NOT NULL,
 *   pushed_by VARCHAR(64) NOT NULL,
 *   source_evidence_link VARCHAR(512),
 *   configured_at TIMESTAMP NOT NULL DEFAULT NOW(),
 *   created_by VARCHAR(64) NOT NULL,
 *   lifetime_score INT NOT NULL DEFAULT 50,
 *   temporal_span VARCHAR(64) NOT NULL,
 *   status VARCHAR(32) NOT NULL DEFAULT 'APPROVED_EXECUTED',
 *   audit_hash CHAR(64) NOT NULL
 * );
 * CREATE INDEX idx_edm_tenant_store ON enterprise_decision_memories(tenant_id, store_id);
 * 
 * -- 108. Enterprise Failure Memories
 * CREATE TABLE enterprise_failure_memories (
 *   id BIGINT PRIMARY KEY,
 *   tenant_id BIGINT NOT NULL,
 *   store_id BIGINT NOT NULL,
 *   failure_trigger VARCHAR(128) NOT NULL,
 *   failure_scenario VARCHAR(256) NOT NULL,
 *   root_cause TEXT NOT NULL,
 *   financial_waste DECIMAL(15,2) NOT NULL DEFAULT 0.00,
 *   operational_delay_hours INT NOT NULL DEFAULT 0,
 *   veto_rules_asserted TEXT NOT NULL,
 *   configured_at TIMESTAMP NOT NULL DEFAULT NOW(),
 *   created_by VARCHAR(64) NOT NULL,
 *   source_evidence_link VARCHAR(512),
 *   lifetime_score INT NOT NULL DEFAULT 0,
 *   temporal_span VARCHAR(64) NOT NULL,
 *   status VARCHAR(32) NOT NULL DEFAULT 'LOCKED_PREVENTION',
 *   audit_hash CHAR(64) NOT NULL
 * );
 * CREATE INDEX idx_efm_tenant_store ON enterprise_failure_memories(tenant_id, store_id);
 * CREATE UNIQUE INDEX idx_efm_trigger_unique ON enterprise_failure_memories(tenant_id, store_id, failure_trigger);
 * 
 * -- 109. Institutional Learning Logs
 * CREATE TABLE institutional_learning_logs (
 *   id BIGINT PRIMARY KEY,
 *   tenant_id BIGINT NOT NULL,
 *   store_id BIGINT NOT NULL,
 *   session_token VARCHAR(128) NOT NULL,
 *   reconciliation_type VARCHAR(64) NOT NULL,
 *   records_processed INT NOT NULL DEFAULT 0,
 *   unification_narrative TEXT NOT NULL,
 *   drift_recalibrated_bias DECIMAL(5,3) NOT NULL DEFAULT 1.000,
 *   configured_at TIMESTAMP NOT NULL DEFAULT NOW(),
 *   created_by VARCHAR(64) NOT NULL,
 *   source_evidence_link VARCHAR(512),
 *   lifetime_score INT NOT NULL DEFAULT 50,
 *   temporal_span VARCHAR(64) NOT NULL,
 *   status VARCHAR(32) NOT NULL DEFAULT 'CALIBRATION_STABLE',
 *   audit_hash CHAR(64) NOT NULL
 * );
 * CREATE INDEX idx_ill_tenant_store ON institutional_learning_logs(tenant_id, store_id);
 * -----------------------------------------------------------------------------
 */

/**
 * =========================================================================
 * 2. COMPREHENSIVE DATA DICTIONARY (数据字典)
 * =========================================================================
 * 
 * Table [enterprise_knowledge_memories]:
 * - id: Unique corporate asset auto-increment.
 * - knowledge_key: Human-readable mnemonic identifier. Use CAPS, e.g. 'FR_AUTOCALIB'.
 * - category: Direct operational cluster. Enforces distinct logic branch when AI queries.
 * - locale_scope: Geographic sovereignty. Helps multi-market targeting.
 * - confidence_score: Validated strength metric from true user inputs or historical runs.
 * 
 * Table [enterprise_decision_memories]:
 * - decision_type: Classification flag mapping downstream analytics pipelines.
 * - estimated_gmv_uplift: Core positive economic forecasting metric.
 * - actual_outcome_gmv: Verified reality metric populated in subsequent twin audits.
 * - executive_rationale: Grounded justification from CEO setting / constraints.
 * 
 * Table [enterprise_failure_memories]:
 * - failure_trigger: Safe preventing hook. Actively blocks conflicting campaigns.
 * - financial_waste: Core negative metric for feedback alignment.
 * - veto_rules_asserted: Code-enforceable constraint written directly into parameters.
 */

/**
 * =========================================================================
 * 3. BUSINESS RULES & DATA LIFECYCLE MANAGEMENT (数据生命周期设计)
 * =========================================================================
 * 
 * State Transitions:
 * - DRAFT/ACTIVE (Newly acquired or configured)
 * - AUDITING (Pending actual twin alignment audits)
 * - RE-EVALUATION (Triggered automatically on high metrics drift warnings)
 * - LOCKED/VETO (Specifically for failure preventions to completely physically block errors)
 * - ARCHIVED (Legacy records with low relevance or confidence < 40%)
 * 
 * Deletion Policy:
 * - Hard deletion of database rows is strictly prohibited in real enterprise context.
 * - Deletion requests trigger state transitions to "ARCHIVED" with a security hash stamp
 *   and record historical audit trail configuration, maintaining compliance audit logs.
 */

/**
 * =========================================================================
 * 4. PHASES 111 - 126 EXTENSION: OPERATING INTELLIGENCE CORE & PERSISTENCE
 * =========================================================================
 */

/**
 * Phase 111: Knowledge Evolution Tables
 */
export interface EnterpriseKnowledgeVersionRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  knowledge_key: string;
  version_number: number;
  factual_content: string;
  relevance_status: "ACTIVE_VALID" | "DRIFTED" | "SUPERSEDE" | "RETIRED";
  retire_reason: string | null;
  superseded_by_key: string | null;
  last_validated_at: string;
  audit_hash: string;
}

export interface KnowledgeDriftLogRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  knowledge_key: string;
  measured_drift_pct: number;
  drift_trigger: string;
  actions_taken: string;
  logged_at: string;
}

export interface KnowledgeConfidenceHistoryRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  knowledge_key: string;
  old_score: number;
  new_score: number;
  confidence_delta: number;
  adjustment_rationale: string;
  configured_at: string;
}

/**
 * Phase 112: Causal Discovery Structures
 */
export interface CausalInfluenceNode {
  factor: string;
  influence_strength_pct: number; // positive or negative
  confidence_pct: number;
}

export interface BusinessCausalTreeRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  outcome_metric: string; // e.g. "GMV_DROP"
  period_label: string;
  computed_nodes: CausalInfluenceNode[];
  root_cause_explanation: string;
  logged_at: string;
}

/**
 * Phase 113: Executive Decision Memory Network
 */
export interface ExecutiveDecisionMemoryRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  decision_key: string; // e.g. "FR_PRICE_RAISE_Q2"
  decision_title: string;
  executing_ceo_style: string; // "Conservative", "Aggressive", etc.
  rationale_json: string;
  estimated_outcomes_json: string;
  actual_outcome_json: string | null;
  outcome_match_rating_pct: number | null;
  approved_by_signer: string;
  configured_at: string;
  status: "EXECUTED" | "BLOCKED_BY_CONSISTENCY" | "ROLLBACKED";
}

export interface DecisionOutcomeLinkRecord {
  id: number;
  decision_id: number;
  associated_metric: string;
  pre_execution_val: number;
  post_execution_val: number;
}

export interface DecisionReasoningSnapshotRecord {
  id: number;
  decision_id: number;
  neural_prompt_version: string;
  p_value_confidence: number;
  simulation_run_id: string;
}

/**
 * Phase 114: Failure Prevention Intelligence
 */
export interface FailurePatternRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  pattern_key: string;
  situation_type: string;
  correlation_strength_pct: number;
  derived_veto_code: string;
  description: string;
}

export interface FailurePreventionRuleRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  rule_code: string;
  rule_expression: string; // e.g. "DISCOUNT > 25 && TARGET_MARGIN < 15"
  failure_triggered_ref_id: number;
  activation_status: "ACTIVE_LOCK" | "ALERT_ONLY" | "SUSPENDED";
  created_by: string;
}

export interface HistoricalRiskClusterRecord {
  id: number;
  tenant_id: number;
  risk_dimension: string;
  severity_level_pct: number;
  triggering_events_summary: string;
  last_analyzed_at: string;
}

/**
 * Phase 115: Institutional Wisdom Engine
 */
export interface InstitutionalWisdomPrincipleRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  principle_key: string;
  dimension: "PRICING" | "RISK" | "GROWTH" | "OPERATIONS";
  core_rule_narrative: string;
  empirical_confidence_score: number;
  historical_events_referenced_json: string;
  configured_at: string;
}

/**
 * Phase 116: Enterprise Operating Memory V2 Graphs
 */
export interface OperatingMemoryGraphNodeRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  node_key: string;
  node_type: "KNOWLEDGE" | "DECISION" | "FAILURE" | "DNA";
  node_label: string;
}

export interface OperatingMemoryRelationshipRecord {
  id: number;
  tenant_id: number;
  source_node_key: string;
  target_node_key: string;
  relationship_nature: string; // e.g. "VETOES", "CORROBORATES", "DERIVED_FROM"
  temporal_span: string;
}

/**
 * Phase 117: Business Strategic Narratives
 */
export interface BusinessStrategicNarrativeRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  period_label: string;
  unification_narrative: string;
  growth_contribution_pcts_json: string;
  critical_turning_points: string;
  logged_at: string;
}

/**
 * Phase 118: Enterprise Wisdom Validation
 */
export interface WisdomValidationLogRecord {
  id: number;
  tenant_id: number;
  wisdom_key: string;
  validation_period: string;
  measured_success_pct: number;
  underlying_roi_eur: number;
  status: "VALIDATED" | "DRIFTED_DOWNGRADE" | "SUSPENDED";
  logged_at: string;
}

export interface WisdomRoiTrackingRecord {
  id: number;
  wisdom_key: string;
  initial_investment: number;
  accumulative_gain: number;
  computed_roi_pct: number;
}

/**
 * Phase 119: Enterprise Time Machine & Alternate Sandbox
 */
export interface TimeMachineReconstructionLog {
  id: number;
  tenant_id: number;
  store_id: number;
  historical_timestamp: string;
  reconstructed_variables_json: string;
  rebuilt_by: string;
}

/**
 * Phase 120: Counterfactual Intelligence Analyzer
 */
export interface CounterfactualAnalysisRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  reality_decision_id: number;
  counterfactual_scenario_title: string;
  reality_outcome_profit: number;
  simulated_counterfactual_profit: number;
  opportunity_cost_eur: number;
  causal_implication: string;
  analyzed_at: string;
}

/**
 * Phase 121: Strategic DNA Evolution
 */
export interface BusinessDnaEvolutionRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  trait_name: string;
  mutation_direction: string; // e.g. "Conservative -> Highly Conservative"
  driver_reason: string;
  measured_weight_pct: number;
  mutated_at: string;
}

/**
 * Phase 122: Executive Cognitive Profile (CEO Style & Risk Anchors)
 */
export interface ExecutiveCognitiveProfileRecord {
  id: number;
  tenant_id: number;
  ceo_personality_style: "PRAGMATIC_SOVEREIGN" | "EXPANSIVE_ACQUISITIVE" | "CONSERVATIVE_SHIELD";
  risk_bias_rating: number; // 1-10
  allowed_utilization_ratio_pct: number;
  minimum_acceptable_conversion_rate: number;
  configured_at: string;
}

/**
 * Phase 123: Autonomous Investigation Engine
 */
export interface AutonomousInvestigationRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  anomaly_trigger: string; // e.g. "MARGIN_DRAIN"
  systemic_investigation_log_json: string;
  evidence_collected_sources_json: string;
  concluding_verdict: string;
  remedial_patch_executed_code: string;
  investigated_at: string;
}

/**
 * Phase 124: Business Reality Verification
 */
export interface BusinessRealityVerificationRecord {
  id: number;
  tenant_id: number;
  assumption_text: string;
  reality_matched_pct: number;
  drift_remedied: boolean;
  auditor_signature: string;
  audited_at: string;
}

/**
 * SQL MIGRATION MANIFEST (PHASES 111-126 DDL REFERENCE)
 * -----------------------------------------------------------------------------
 * -- CREATE TABLE enterprise_knowledge_versions (...);
 * -- CREATE TABLE knowledge_drift_logs (...);
 * -- CREATE TABLE knowledge_confidence_history (...);
 * -- CREATE TABLE business_causal_trees (...);
 * -- CREATE TABLE executive_decision_memory (...);
 * -- CREATE TABLE decision_outcome_links (...);
 * -- CREATE TABLE decision_reasoning_snapshots (...);
 * -- CREATE TABLE failure_patterns (...);
 * -- CREATE TABLE failure_prevention_rules (...);
 * -- CREATE TABLE historical_risk_clusters (...);
 * -- CREATE TABLE institutional_wisdom_principles (...);
 * -- CREATE TABLE operating_memory_graph (...);
 * -- CREATE TABLE memory_relationships (...);
 * -- CREATE TABLE business_strategic_narratives (...);
 * -- CREATE TABLE wisdom_validation_logs (...);
 * -- CREATE TABLE wisdom_roi_tracking (...);
 * -- CREATE TABLE time_machine_reconstructions (...);
 * -- CREATE TABLE counterfactual_analyses (...);
 * -- CREATE TABLE business_dna_evolution (...);
 * -- CREATE TABLE executive_cognitive_profiles (...);
 * -- CREATE TABLE autonomous_investigations (...);
 * -- CREATE TABLE business_reality_verifications (...);
 * -----------------------------------------------------------------------------
 */

/**
 * =========================================================================
 * 5. PHASES 127 - 142 EXTENSION: ENTERPRISE COGNITIVE OPERATING SYSTEM (ECOS)
 * =========================================================================
 */

/**
 * Phase 127: Knowledge Conflict Logs & Authority Rankings
 */
export interface KnowledgeConflictLogRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  conflicting_key_a: string;
  conflicting_key_b: string;
  detected_contradiction_desc: string;
  severity_level: "CRITICAL_OVERLAPPING" | "TEMPORAL_DRIFT_WAR" | "MINOR_INCONSISTENCY";
  resolved_at: string | null;
  resolution_decision_log: string | null;
}

export interface KnowledgeAuthorityRankingRecord {
  id: number;
  tenant_id: number;
  source_name: string; // e.g., "MEMBER_RETENTION_COGNITION", "TIKTOK_CPC_AUTO_AUDITOR"
  authority_tier: number; // 1 to 5 (1 being supreme)
  measured_reliability_pct: number;
  last_validated_at: string;
}

export interface KnowledgeResolutionHistoryRecord {
  id: number;
  tenant_id: number;
  conflict_id: number;
  applied_winner_key: string;
  applied_loser_key: string;
  discard_or_demote_flag: "DEMOTED" | "SUPERSEDED_RETIRED";
  audited_by: string;
  resolved_at: string;
}

/**
 * Phase 128: Cognitive Consistency Engine
 */
export interface CognitiveConsistencyLogRecord {
  id: number;
  tenant_id: number;
  evaluated_at: string;
  consistency_score: number; // 0-100
  evaluated_aspects_count: number;
  system_verdict: "CONSISTENT_STABLE" | "WARNING_MISMATCH_DETECTED" | "CRITICAL_MUTATION_BLOCK";
  detailed_audit_json: string;
}

export interface IdentityViolationEventRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  vandalized_trait: string; // e.g. "BRAND_PREMIUM_PROTECTION"
  violating_proposition_text: string; // e.g. "Attempting to issue 70% store-wide discount coupons"
  calculated_rejection_veto_code: string;
  logged_at: string;
}

/**
 * Phase 129: Business Reality Model Nodes & Edges
 */
export interface BusinessRealityNodeRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  metric_name: string; // "TRAFFIC", "CONVERSION_RATE", "ORDER_COUNT", "GROSS_PROFIT", "CASH_FLOW", "HEALTH_SCORE"
  current_raw_value: number;
  last_updated_at: string;
}

export interface BusinessDependencyEdgeRecord {
  id: number;
  tenant_id: number;
  source_metric: string;
  target_metric: string;
  influence_coefficient: number; // positive or negative modifier
  lag_days_expected: number;
}

/**
 * Phase 130: Executive Reasoning Archives
 */
export interface ExecutiveReasoningArchiveRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  reasoning_key: string;
  target_decision_key: string;
  strategic_prompt_context_json: string;
  simulated_payoffs_json: string;
  selected_path_code: string;
  logic_chain_trace_json: string; // Full step-by-step logic proofs
  archived_at: string;
}

export interface ReasoningEvidenceSnapshotRecord {
  id: number;
  reasoning_id: number;
  evidence_type: "KNOWLEDGE" | "METRIC" | "WISDOM_PRINCIPLE" | "HISTORICAL_FAILURE";
  referenced_record_id: number;
  evidence_weight_pct: number;
}

export interface ReasoningOutcomeLinkRecord {
  id: number;
  reasoning_id: number;
  gained_empirical_accuracy_pct: number;
  outcome_delta_net_profit: number;
  verified_at: string;
}

/**
 * Phase 131: Institutional Memory Compression Leads
 */
export interface InstitutionalPatternRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  compressed_rule_narrative: string; // "10000 records compressed down to: Avoid high CPA during regional Holidays"
  compression_ratio_pct: number;
  supporting_historical_count: number;
  confidence_rating: number;
  created_at: string;
}

export interface MemoryCompressionHistoryRecord {
  id: number;
  tenant_id: number;
  records_processed: number;
  output_patterns_count: number;
  compressed_at: string;
}

/**
 * Phase 132: Enterprise Wisdom Graph Configuration
 */
export interface WisdomNodeRecord {
  id: number;
  tenant_id: number;
  node_key: string;
  node_type: "LESSON" | "DECISION" | "FAILURE" | "PRINCIPLE";
  weight_factor_pct: number;
}

export interface WisdomEdgeRecord {
  id: number;
  tenant_id: number;
  source_wisdom_key: string;
  target_wisdom_key: string;
  relationship_type: "STRENGTHENS" | "VETOES" | "MUTUALLY_EXCLUSIVE" | "SEQUENTIAL_TRIGGER";
}

/**
 * Phase 133: Autonomous Hypothesis Engine
 */
export interface BusinessHypothesisRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  hypothesis_title: string;
  implied_cause: string;
  implied_effect: string;
  confidence_prob_pct: number;
  validation_status: "PROPOSED" | "VERIFYING" | "PROVEN_TRUE" | "FALSIFIED";
  proposed_at: string;
}

export interface HypothesisValidationLogRecord {
  id: number;
  hypothesis_id: number;
  evidence_keys_referenced_json: string;
  falsification_score: number; // 0-100
  evaluated_at: string;
}

/**
 * Phase 134: Enterprise Cognitive Stability Engine
 */
export interface EcosCognitiveDriftLogRecord {
  id: number;
  tenant_id: number;
  stability_dimension: "IDENTITY_STABILITY" | "RULE_STABILITY" | "DECISION_VARIATION_LIMIT";
  measured_deviation_pct: number;
  trigger_action_taken: string;
  logged_at: string;
}

export interface StabilityAssessmentRecord {
  id: number;
  tenant_id: number;
  health_rating_pct: number;
  active_rules_relevance_pct: number;
  assessed_at: string;
}

export interface BiasCorrectionHistoryRecord {
  id: number;
  tenant_id: number;
  identified_bias_type: string; // e.g. "OVEROPTIMISTIC_CONVERSION_BIAS"
  variance_remedy_description: string;
  p_value_confidence_pre: number;
  p_value_confidence_post: number;
  corrected_at: string;
}

/**
 * Phase 135: Business Law Discovery Engine
 */
export interface BusinessLawRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  law_name: string;
  law_expression: string; // Mathematical correlation
  empirical_confidence_pct: number;
  is_valid: boolean;
  discovered_at: string;
}

export interface LawValidationLogRecord {
  id: number;
  law_id: number;
  sample_size_days: number;
  accuracy_score_pct: number;
  logged_at: string;
}

/**
 * Phase 136: Executive Cognitive Twin
 */
export interface ExecutiveTwinRecord {
  id: number;
  tenant_id: number;
  twin_name: string;
  cognitive_style_json: string;
  alignment_score_pct: number;
  updated_at: string;
}

export interface TwinSimulationRecord {
  id: number;
  twin_id: number;
  scenario_keys_json: string;
  simulated_revenue_eur: number;
  twin_approval_rating_pct: number;
  simulated_at: string;
}

/**
 * Phase 137: Multi-Year Strategic Memory Logs
 */
export interface StrategicEvolutionHistoryRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  fiscal_year_label: string;
  overall_strategic_posture: string; // e.g., "DEFENSIVE_BRAND_FORTRESS"
  dna_mutation_summary: string;
  historical_lessons_summary: string;
  recorded_at: string;
}

/**
 * Phase 138: Enterprise Cause-And-Effect Atlas
 */
export interface CausalAtlasNodeRecord {
  id: number;
  tenant_id: number;
  node_name: string;
  node_description: string;
}

export interface CausalAtlasEdgeRecord {
  id: number;
  tenant_id: number;
  source_node_name: string;
  target_node_name: string;
  influence_strength_pct: number;
  lag_days: number;
}

/**
 * Phase 139: Institutional Intelligence Score Card
 */
export interface InstitutionalIntelligenceScoreRecord {
  id: number;
  tenant_id: number;
  overall_score: number; // 0-100
  knowledge_score: number;
  wisdom_score: number;
  experience_score: number;
  reasoning_score: number;
  decision_score: number;
  measured_at: string;
}

/**
 * Phase 140: Adaptive Enterprise Constitution
 */
export interface EnterpriseConstitutionRecord {
  id: number;
  tenant_id: number;
  core_constitution_json: string;
  current_version: number;
  is_active: boolean;
  amended_at: string;
}

export interface ConstitutionEvolutionLogRecord {
  id: number;
  tenant_id: number;
  previous_version: number;
  new_version: number;
  amendment_rationale: string;
  falsification_evidence_keys_json: string;
  approved_by_auditor: string;
  evolved_at: string;
}

/**
 * Phase 141 & 142: Enterprise Cognitive Kernel Complete Hub
 */
export interface CognitiveKernelRecord {
  id: number;
  tenant_id: number;
  store_id: number;
  kernel_mode: "SUPREME_MIND_ACTIVE" | "CONSTRAINED_GOVERNANCE" | "RECOVERY_POSTURE";
  collective_intelligence_weight: number;
  overall_cognitive_power_rating: number; // 0-100
  last_kernel_heartbeat: string;
}

export interface KernelEvidenceChainRecord {
  id: number;
  kernel_id: number;
  evidence_narrative: string;
  success_attribution_json: string;
  failure_attribution_json: string;
  growth_recommendation_proof: string;
  logged_at: string;
}

/**
 * SQL MIGRATION MANIFEST (PHASES 127-142 DDL REFERENCE)
 * -----------------------------------------------------------------------------
 * -- CREATE TABLE knowledge_conflict_logs (...);
 * -- CREATE TABLE knowledge_authority_ranking (...);
 * -- CREATE TABLE knowledge_resolution_history (...);
 * -- CREATE TABLE cognitive_consistency_logs (...);
 * -- CREATE TABLE identity_violation_events (...);
 * -- CREATE TABLE business_reality_nodes (...);
 * -- CREATE TABLE business_dependency_edges (...);
 * -- CREATE TABLE executive_reasoning_archive (...);
 * -- CREATE TABLE reasoning_evidence_snapshot (...);
 * -- CREATE TABLE reasoning_outcome_link (...);
 * -- CREATE TABLE institutional_patterns (...);
 * -- CREATE TABLE memory_compression_history (...);
 * -- CREATE TABLE wisdom_nodes (...);
 * -- CREATE TABLE wisdom_edges (...);
 * -- CREATE TABLE business_hypotheses (...);
 * -- CREATE TABLE hypothesis_validation_logs (...);
 * -- CREATE TABLE ecos_cognitive_drift_logs (...);
 * -- CREATE TABLE stability_assessments (...);
 * -- CREATE TABLE bias_correction_history (...);
 * -- CREATE TABLE business_laws (...);
 * -- CREATE TABLE law_validation_logs (...);
 * -- CREATE TABLE executive_twins (...);
 * -- CREATE TABLE twin_simulations (...);
 * -- CREATE TABLE strategic_evolution_history (...);
 * -- CREATE TABLE causal_atlas_nodes (...);
 * -- CREATE TABLE causal_atlas_edges (...);
 * -- CREATE TABLE institutional_intelligence_scores (...);
 * -- CREATE TABLE enterprise_constitutions (...);
 * -- CREATE TABLE constitution_evolution_logs (...);
/**
 * SQL MIGRATION MANIFEST (PHASES 127-142 DDL REFERENCE)
 * -----------------------------------------------------------------------------
 * -- CREATE TABLE knowledge_conflict_logs (...);
 * -- CREATE TABLE knowledge_authority_ranking (...);
 * -- CREATE TABLE knowledge_resolution_history (...);
 * -- CREATE TABLE cognitive_consistency_logs (...);
 * -- CREATE TABLE identity_violation_events (...);
 * -- CREATE TABLE business_reality_nodes (...);
 * -- CREATE TABLE business_dependency_edges (...);
 * -- CREATE TABLE executive_reasoning_archive (...);
 * -- CREATE TABLE reasoning_evidence_snapshot (...);
 * -- CREATE TABLE reasoning_outcome_link (...);
 * -- CREATE TABLE institutional_patterns (...);
 * -- CREATE TABLE memory_compression_history (...);
 * -- CREATE TABLE wisdom_nodes (...);
 * -- CREATE TABLE wisdom_edges (...);
 * -- CREATE TABLE business_hypotheses (...);
 * -- CREATE TABLE hypothesis_validation_logs (...);
 * -- CREATE TABLE ecos_cognitive_drift_logs (...);
 * -- CREATE TABLE stability_assessments (...);
 * -- CREATE TABLE bias_correction_history (...);
 * -- CREATE TABLE business_laws (...);
 * -- CREATE TABLE law_validation_logs (...);
 * -- CREATE TABLE executive_twins (...);
 * -- CREATE TABLE twin_simulations (...);
 * -- CREATE TABLE strategic_evolution_history (...);
 * -- CREATE TABLE causal_atlas_nodes (...);
 * -- CREATE TABLE causal_atlas_edges (...);
 * -- CREATE TABLE institutional_intelligence_scores (...);
 * -- CREATE TABLE enterprise_constitutions (...);
 * -- CREATE TABLE constitution_evolution_logs (...);
 * -- CREATE TABLE cognitive_kernels (...);
 * -- CREATE TABLE kernel_evidence_chains (...);
 * -----------------------------------------------------------------------------
 */

/**
 * =========================================================================
 * 6. ECOS VALIDATION PROGRAM SCHEMAS (VALIDATIONS 01 - 08)
 * =========================================================================
 */

export interface EcosKnowledgeValidationRecord {
  id: number;
  tenant_id: number;
  evaluated_at: string;
  total_elements_checked: number;
  accuracy_rate_pct: number;
  failures_count: number;
  expiration_rate_pct: number;
  conflict_rate_pct: number;
  drift_rate_pct: number;
  measured_source_distribution_json: string;
}

export interface EcosDecisionValidationRecord {
  id: number;
  tenant_id: number;
  evaluated_at: string;
  total_decisions_tracked: number;
  win_rate_pct: number;
  total_measured_roi_pct: number;
  average_profit_gain_eur: number;
  average_loss_avoided_eur: number;
  success_attribution_summary_json: string;
}

export interface EcosForecastValidationRecord {
  id: number;
  tenant_id: number;
  evaluated_at: string;
  forecast_window_days: number;
  mape_pct: number; // Mean Absolute Percentage Error
  rmse: number; // Root Mean Square Error
  system_drift_pct: number;
  calculated_system_bias: "OVERESTIMATION" | "UNDERESTIMATION" | "UNBIASED";
  underlying_points_checked: number;
}

export interface EcosWisdomValidationRecord {
  id: number;
  tenant_id: number;
  evaluated_at: string;
  total_principles_cataloged: number;
  actual_hit_rate_pct: number;
  estimated_roi_contribution_eur: number;
  long_term_retention_effectiveness_pct: number;
  proven_business_laws_count: number;
}

export interface EcosHypothesisValidationRecord {
  id: number;
  tenant_id: number;
  evaluated_at: string;
  total_hypotheses_proposed: number;
  validation_success_rate_pct: number;
  false_alarm_rate_pct: number;
  miss_rate_pct: number;
  evidence_richness_rating_pct: number;
}

export interface EcosExecutiveTwinValidationRecord {
  id: number;
  tenant_id: number;
  evaluated_at: string;
  twin_id: number;
  twin_real_decisions_compared: number;
  simulation_outcome_accuracy_pct: number;
  mean_variance_rating_pct: number;
  cognitive_alignment_deviation: number;
}

export interface EcosConstitutionValidationRecord {
  id: number;
  tenant_id: number;
  evaluated_at: string;
  constitution_version: number;
  successful_blocks_count: number;
  false_blocks_count: number;
  missed_violations_count: number;
  block_precision_pct: number;
  governance_leakage_pct: number;
}

export interface EcosOverallOperatingIntelligenceValidationRecord {
  id: number;
  tenant_id: number;
  evaluated_at: string;
  overall_ecos_health_score: number;       // 0 - 100
  overall_ecos_reliability_score: number;  // 0 - 100
  overall_ecos_trust_score: number;        // 0 - 100
  overall_ecos_effectiveness_score: number;  // 0 - 100
  knowledge_validation_reference_id: number;
  decision_validation_reference_id: number;
  forecast_validation_reference_id: number;
  wisdom_validation_reference_id: number;
  hypothesis_validation_reference_id: number;
  twin_validation_reference_id: number;
  constitution_validation_reference_id: number;
  audit_signature: string;
}

