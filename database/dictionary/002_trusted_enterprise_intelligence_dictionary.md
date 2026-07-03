# Trusted Enterprise Intelligence - Database Schema Dictionary

This document details the schema of the databases created in `002_trusted_enterprise_intelligence.sql` to support high-fidelity operations under Business Brain V3 with strict validation constraints.

---

## 1. Truth & Evidence Repositories

### `brain_truth_facts`
Maintains verified database facts observed from native modules (e.g., active orders/WMS stocks). No model guess is stored here.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `fact_id` | `VARCHAR(64)` | `PRIMARY KEY` | Identifier unique key. |
| `statement` | `TEXT` | `NOT NULL` | Description of observed reality. |
| `is_observable_fact`| `BOOLEAN` | `DEFAULT TRUE` | Always true for fully observable physical facts. |
| `source_module` | `VARCHAR(128)`| `NOT NULL` | The certifying engine code (e.g. `WMS_INVENTORY_METRICS`). |
| `verification_confidence`| `NUMERIC(3,2)`| `DEFAULT 1.00` | Fixed to 1.00 for verified physical data. |

### `brain_inference_foundations`
Tracks inferences made by predictive modules and lists the corresponding observable facts used as foundation references.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `inference_id` | `VARCHAR(64)` | `PRIMARY KEY` | Trace ID. |
| `statement` | `TEXT` | `NOT NULL` | Hypothesis or predicted occurrence. |
| `predictive_span_days`| `INT` | `DEFAULT 7` | Time horizon in days representing projection bounds. |
| `foundation_evidence_keys`| `VARCHAR(64)[]`| `DEFAULT '{}'` | Array of reference fact/telemetry keys. |

---

## 2. Business Constitution & Compliance Rules

### `business_constitution_clauses`
Defines Articles of the Corporate Constitution regulating what parameters all active strategies must adhere to.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `clause_code` | `VARCHAR(64)` | `PRIMARY KEY` | Code name (e.g. `CONSTITUTION_ART_1_MARGIN_FLOOR`). |
| `clause_title` | `VARCHAR(128)`| `NOT NULL` | Friendly natural language name. |
| `minimum_threshold_value` | `NUMERIC(12,2)`| `NOT NULL` | Safe minimum line allowed for compliance. |
| `severity_level` | `VARCHAR(32)` | `P0_CRITICAL`/`P1_WARNING` | P0 is hard rejection blocking, P1 triggers special warning override checks. |

---

## 3. Agent Governance & Auditing Logs

### `multi_agent_gatekeeper_runs`
Logs transactions processed through Multi-Agent Governance Gating. All proxies pass here before database commits occur.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `gate_run_id` | `VARCHAR(64)` | `PRIMARY KEY` | Run ID. |
| `agent_name` | `VARCHAR(64)` | `NOT NULL` | Name of requesting virtual staff. |
| `proposed_action`| `VARCHAR(256)`| `NOT NULL` | Intended execution action code. |
| `is_authorized` | `BOOLEAN` | `DEFAULT FALSE` | True if the action is fully greenlit. |
| `authorization_authority`| `VARCHAR(64)` | `BRAIN_GOVERNOR`/`REVIEW_BOARD`/`DENIED` | Authorization levels of governance. |

### `enterprise_audit_trail`
Persistent long-term logs recording strategic actions, reasoning grounds, and decision attribution indexes.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `tracking_guid` | `VARCHAR(64)` | `PRIMARY KEY` | Permanent audit token identifier. |
| `timestamp` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Occurred time index of execution. |
| `decision_maker`| `VARCHAR(128)`| `NOT NULL` | Origin entity who finalized the decision. |
| `reasoning_basis`| `TEXT` | `NOT NULL` | Qualitative reasoning grounds explaining WHY. |
| `evidence_cited_keys`| `VARCHAR(64)[]`| `DEFAULT '{}'` | References cited to back up the action. |
