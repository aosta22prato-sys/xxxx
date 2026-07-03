# Trusted Enterprise Intelligence - Entity Relationship Diagram

This file defines the physical and logical relationships holding the system truth engine, constitution rule enforcement, and multi-agent authorization governance.

```mermaid
erDiagram
    business_constitution_clauses ||--o{ constitution_compliance_checks : "guarantees compliance"
    brain_truth_facts ||--o{ brain_inference_foundations : "provides foundations"
    multi_agent_gatekeeper_runs ||--o{ enterprise_audit_trail : "authors trace logs"

    business_constitution_clauses {
        VARCHAR clause_code PK
        VARCHAR clause_title
        NUMERIC minimum_threshold_value
        VARCHAR severity_level
        TEXT description
    }

    constitution_compliance_checks {
        VARCHAR check_id PK
        VARCHAR strategy_name
        VARCHAR clause_code FK
        BOOLEAN is_compliant
        TEXT violation_notes
    }

    brain_truth_facts {
        VARCHAR fact_id PK
        TEXT statement
        BOOLEAN is_observable_fact
        VARCHAR source_module
        NUMERIC verification_confidence
    }

    brain_inference_foundations {
        VARCHAR inference_id PK
        TEXT statement
        INT predictive_span_days
        VARCHAR_ARRAY foundation_evidence_keys
    }

    multi_agent_gatekeeper_runs {
        VARCHAR gate_run_id PK
        VARCHAR agent_name
        VARCHAR proposed_action
        BOOLEAN is_authorized
        VARCHAR authorization_authority
        TEXT evaluation_log
    }

    enterprise_audit_trail {
        VARCHAR tracking_guid PK
        TIMESTAMP timestamp
        VARCHAR decision_maker
        TEXT reasoning_basis
        VARCHAR_ARRAY evidence_cited_keys
        VARCHAR action_target
        VARCHAR estimated_outcome_label
    }
```
