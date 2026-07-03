# AI Commerce OS - Data Dictionary (Goal Execution Engine Tables)

Documents the relational database schemas for **Phase 191: Goal Execution Engine v1** located in the platform's Enterprise Brain system.

---

## 1. Table: `goal_missions`
Stores the high-level business missions/goals set by super-admins, e.g., increasing regional sales, improving profit margins.

| Column Name | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | Primary key of the mission, prefixed with `gm_` |
| `tenant_id` | `VARCHAR(50)` | NO | Foreign key reference identifier of the tenant owning the mission |
| `goal_name` | `VARCHAR(255)` | NO | Display name/description of the business objective (e.g., "法国销售额提升20%") |
| `target_metric` | `VARCHAR(100)` | NO | Canonical metric name targeted for monitoring (e.g., `FR_SALES_VOLUME`) |
| `target_value` | `NUMERIC(15, 2)` | NO | Target quantitative threshold intended to satisfy the goal |
| `current_value`| `NUMERIC(15, 2)` | NO | Curated current quantitative value of the metric |
| `deadline` | `TIMESTAMP` | NO | Expiration timestamp specifying target achievement deadline |
| `status` | `VARCHAR(50)` | NO | Current fulfillment status (`active`, `completed`, `failed`, `adjusted`) |
| `created_at` | `TIMESTAMP` | NO | Record insertion timestamp |
| `updated_at` | `TIMESTAMP` | NO | Record modification timestamp |

### Indexes
- `idx_goal_missions_tenant` ON (`tenant_id`) - Standard multi-tenant partition lookup.

---

## 2. Table: `goal_tasks`
Decomposes high-level missions into sub-tasks delegated to autonomous agents (Inventory, Marketing, Customer, Pricing, etc.).

| Column Name | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | Primary key of the sub-task, prefixed with `gt_` |
| `mission_id` | `VARCHAR(50)` | NO | Reference identifier pointing to the owning `goal_missions` entry |
| `agent_type` | `VARCHAR(100)` | NO | Canonical name of targeted responder type (e.g., `InventoryAgent`, `MarketingAgent`) |
| `task_name` | `VARCHAR(255)` | NO | Natural human-language label for the delegated task |
| `priority` | `VARCHAR(20)` | NO | Sub-task urgency category (`high`, `medium`, `low`) |
| `status` | `VARCHAR(50)` | NO | Pipeline state of execution (`pending`, `running`, `completed`, `failed`) |
| `assigned_at` | `TIMESTAMP` | NO | Timestamp of dispatch |
| `completed_at`| `TIMESTAMP` | YES | Completion timestamp or NULL if pending / running |

### Indexes
- `idx_goal_tasks_mission_id` ON (`mission_id`) - Cascade retrieval of mission sub-components.
- `idx_goal_tasks_agent_status` ON (`agent_type`, `status`) - Agent task queue routing audits.

---

## 3. Table: `goal_progress`
Maintains daily temporal progress checkpoints logged automatically by background tracking routines.

| Column Name | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | Primary key of the tracker log, prefixed with `gp_` |
| `mission_id` | `VARCHAR(50)` | NO | Reference identifier pointing to the owning `goal_missions` entry |
| `date` | `DATE` | NO | Tracking date |
| `metric_value` | `NUMERIC(15, 2)` | NO | Current state value logged on the given timestamp |
| `progress_percent`| `NUMERIC(5, 2)` | NO | Percentage of achievement completion (current vs. original start vs. target) |
| `notes` | `TEXT` | NO | Curated observations, anomalies, or logs from agents |

### Indexes
- `idx_goal_progress_mission_date` ON (`mission_id`, `date`) - Time-series plot plotting cascades.

---

## 4. Table: `goal_adjustments`
Documents self-correction interventions when metric deviation drops below acceptable progress slopes.

| Column Name | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | Primary key of the adjustment record, prefixed with `ga_` |
| `mission_id` | `VARCHAR(50)` | NO | Reference identifier pointing to the owning `goal_missions` entry |
| `reason` | `TEXT` | NO | Structured diagnosis explaining why drift occurred and triggered correction |
| `old_strategy` | `TEXT` | NO | Superseded strategic configuration description |
| `new_strategy` | `TEXT` | NO | Substituted policy / strategy configuration |
| `created_at` | `TIMESTAMP` | NO | Insertion timestamp corresponding to self-critique deployment |

### Indexes
- `idx_goal_adjustments_mission` ON (`mission_id`) - Audit history evaluation.
