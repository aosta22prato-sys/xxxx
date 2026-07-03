# Business Brain V3 - Database Schema Dictionary

This document describes the relational database structure configured to support high-fidelity, multi-tenant tracking of working memories, causal chains, predictive telemetry, scenarios, and executive board digests with enterprise accuracy.

---

## 1. System Tenancy & Config Entities

### `system_tenants`
Tracks subscription workspaces on the platform. All transactional operations require association with a physical `tenant_id`.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `tenant_id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique workspace identifier. |
| `store_name` | `VARCHAR(128)` | `NOT NULL` | Registered retail merchant outlet brand name. |
| `country_code`| `VARCHAR(16)` | `NOT NULL DEFAULT 'DE'` | Two-letter ISO country reference. |
| `currency` | `VARCHAR(8)` | `NOT NULL DEFAULT 'EUR'` | Preferred billing and payout settlement. |

### `merchant_configurations`
Merchant-specific custom parameters for the cognitive engine.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `config_id` | `VARCHAR(64)` | `PRIMARY KEY` | Auto-generated UUID. |
| `tenant_id` | `VARCHAR(64)` | `FOREIGN KEY` | Reference to `system_tenants(tenant_id)`. |
| `low_stock_threshold`| `INT` | `DEFAULT 5` | Under-stock threshold representing warning lines. |
| `vat_rate_default` | `NUMERIC(5,2)`| `DEFAULT 19.00` | Current localized value-added tax profile. |

---

## 2. Three-Tier System Memory Layer

### `brain_working_memory`
Stores live session variables, transaction-level cache parameters, and volatile checkout buffers.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `memory_id` | `VARCHAR(64)` | `PRIMARY KEY` | Entry ID. |
| `tenant_id` | `VARCHAR(64)` | `FOREIGN KEY` | Reference to `system_tenants(tenant_id)`. |
| `memory_key` | `VARCHAR(64)` | `NOT NULL` | Session lookup key identifier. |
| `memory_value`| `TEXT` | `NOT NULL` | Stringified binary store or instructions. |

### `brain_business_experience`
Captures reinforcement learning metrics from automated actions back into the graph weights.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `experience_id` | `VARCHAR(64)` | `PRIMARY KEY` | Event ID. |
| `action_category`| `VARCHAR(64)` | `NOT NULL` | Action classification (e.g. `price_cut`). |
| `success_count` | `INT` | `DEFAULT 0` | Total positive executions verified. |
| `average_rating`| `NUMERIC(4,2)`| `DEFAULT 5.00` | Moving average satisfaction rating (0-10 scale). |

### `brain_evolution_memory`
Read-only historical benchmarks of total system growth and cognitive capability tiers.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `evolution_id` | `VARCHAR(64)` | `PRIMARY KEY` | Entry ID. |
| `phase` | `VARCHAR(32)` | `NOT NULL` | System phase name (e.g. `V3_BRAIN`). |
| `description` | `TEXT` | `NOT NULL` | System upgrade narrative details. |
| `impact_metric`| `VARCHAR(128)`| `NOT NULL` | Quantified performance uplift reference. |

---

## 3. Propagation & Causal Modelling

### `causal_diagram_nodes`
Stores nodes representing variables affecting other nodes in the structural world model.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `node_id` | `VARCHAR(64)` | `PRIMARY KEY` | Node key identifier. |
| `node_name` | `VARCHAR(128)`| `NOT NULL` | Natural language label for the causal node. |
| `polarity` | `VARCHAR(16)` | `positive`/`negative`| Directional correlation behavior flag. |

### `causal_propagation_steps`
Historical recording of how cause-and-effect propagations cascade down consecutive nodes.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `step_id` | `VARCHAR(64)` | `PRIMARY KEY` | Step ID. |
| `run_id` | `VARCHAR(64)` | `FOREIGN KEY` | Reference to `causal_reasoning_runs(run_id)`. |
| `step_sequence`| `INT` | `NOT NULL`| Step number in the cascade path. |
| `consequence_text`| `TEXT` | `NOT NULL`| Predicted secondary or secondary outcome text. |

---

## 4. Financial Forecasts, Critique & Executive Reports

*All strategic tables (`brain_forecast_telemetry`, `brain_growth_strategies`, `brain_investigation_cases`, `brain_decision_critiques`, and `executive_board_reports`) are strictly partitioned by `tenant_id` allowing optimized multi-tenant index isolation.*
