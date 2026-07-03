# Enterprise Digital Brain V4 - Database Schema Dictionary

This dictionary defines the high-level cognitive telemetry tables configured under `/database/schema/004_enterprise_digital_brain.sql`.

---

## 1. Decision Quality & Feedback Loop

### `decision_quality_logs`
Logs performance records of executed strategies, measuring the delta between target and outcome, and scoring the final decision quality.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `decision_id` | `VARCHAR(64)` | `PRIMARY KEY` | Trace ID. |
| `tenant_id` | `VARCHAR(64)` | `NOT NULL` | Associated tenant workspace. |
| `expected_yield_value`| `NUMERIC(15,2)`| `NOT NULL` | Projected monetary value or conversion units expected. |
| `actual_realized_value`| `NUMERIC(15,2)`| `NULLABLE` | Verified real-world output realized. |
| `decision_quality_score`| `NUMERIC(3,2)`| `DEFAULT 1.00` | Final verified coefficient (0.00 to 1.00). |

### `forecast_accuracy_metrics`
Monitors forecast error margins over time, feeding back to retrain and calibrate predictive parameters.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `metric_id` | `VARCHAR(64)` | `PRIMARY KEY` | Metric run instance. |
| `metric_key` | `VARCHAR(64)` | `NOT NULL` | The forecasted stream parameter (e.g. WMS SKU sales). |
| `calculated_accuracy` | `NUMERIC(5,2)`| `NULLABLE` | Accuracy percentage benchmark (0-100%). |

---

## 2. Strategic Objectives & Dynamic Strategy Evolution 

### `goal_achievement_records`
Keeps track of primary target milestones and objectives set within the system.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `goal_id` | `VARCHAR(64)` | `PRIMARY KEY` | Milestone ID. |
| `goal_name` | `VARCHAR(128)`| `NOT NULL` | Target label text describing the strategic objective. |
| `progress_percentage`| `NUMERIC(5,2)`| `DEFAULT 0.00` | Completed percentage coefficient. |

### `strategy_evolution_weights`
Captures historical actions, modifying weight factors to favor successful playbook strategies.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `strategy_id` | `VARCHAR(64)` | `PRIMARY KEY` | Playbook template reference. |
| `reinforcement_factor`| `NUMERIC(4,2)`| `DEFAULT 1.00` | Reinforcement feedback scalar used to weight playbooks. |
| `is_retired` | `BOOLEAN` | `DEFAULT FALSE` | Flag used to completely black out ineffective strategies. |

---

## 3. Digital Twin Simulation & Meta Learning Calibration

### `digital_twin_experiments`
Simulates alternative runs of a proposed strategy beforehand across best-case, expected, and worst-case outcomes.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `experiment_id` | `VARCHAR(64)` | `PRIMARY KEY` | Simulation instance ID. |
| `best_case_gain` | `NUMERIC(15,2)`| `NOT NULL` | Simulated return on perfect conversion and clear path. |
| `expected_case_gain` | `NUMERIC(15,2)`| `NOT NULL` | Normal trajectory simulated output return. |
| `worst_case_gain` | `NUMERIC(15,2)`| `NOT NULL` | Severe friction or drop-off simulation result. |
| `success_probability`| `NUMERIC(3,2)`| `NOT NULL` | Statistical likelihood of success calculated. |
