# Enterprise Trust & Governance - Database Schema Dictionary

This dictionary contains details of the highly secure systems configured as part of the Enterprise Trust Layer (Phases 61 to 65) of the Business Brain V3 system.

---

## 1. Decision Evidence & Reasoning Chain Details

### `enterprise_decision_evidence`
Links specific business decisions directly to physical observable facts or statistical inferences.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `evidence_id` | `VARCHAR(64)` | `PRIMARY KEY` | Globally unique ID. |
| `decision_id` | `VARCHAR(64)` | `NOT NULL` | Associated transaction-level decision trace. |
| `evidence_type`| `VARCHAR(64)` | `FACT`/`INFERENCE` | Origin of resource categorization. |
| `confidence` | `NUMERIC(3,2)`| `DEFAULT 1.00` | Statistical confidence boundary (0.00 - 1.00). |

### `enterprise_reasoning_chain`
Documents the systematic reasoning cascade supporting diagnostic conclusions.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `chain_id` | `VARCHAR(64)` | `PRIMARY KEY` | Event timeline trace node. |
| `hypothesis` | `TEXT` | `NOT NULL` | The initial business hypothesis. |
| `supporting_evidence` | `TEXT[]` | `DEFAULT '{}'` | Citations of observable factual anchors. |
| `counter_evidence` | `TEXT[]` | `DEFAULT '{}'` | Potential counterfactual or risk signals discovered. |
| `confidence` | `NUMERIC(3,2)`| `NOT NULL` | Probability after self-critique adjustments. |

---

## 2. Business Constitution & Blockchain Audit Blocks

### `business_constitution_rules`
Primary rules governing automated staff authorization, protecting critical corporate parameters.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `rule_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique rule identifier. |
| `rule_name` | `VARCHAR(128)`| `NOT NULL` | Human-legible clause title. |
| `violation_action`| `VARCHAR(64)` | See enum constraints| Consequence path (e.g. `BLOCK_EXECUTION`). |

### `unalterable_audit_chain`
A cryptographically secure linear block register tracking system actions. Each block holds a hash of the previous state to guarantee immutability.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `tracking_guid` | `VARCHAR(64)` | `PRIMARY KEY` | Verification tracking token. |
| `previous_hash` | `VARCHAR(64)` | `NOT NULL` | SHA-256 state signature of the parent block. |
| `record_hash` | `VARCHAR(64)` | `NOT NULL` | Computed checksum representing the integrity of this record. |
| `digital_signature`| `VARCHAR(128)`| `NOT NULL` | Private-key verification token of the Gating Governor. |
