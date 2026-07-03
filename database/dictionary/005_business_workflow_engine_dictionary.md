# AI Commerce OS - Data Dictionary (Business Workflow Engine Tables)

Documents the relational database schemas for **Phase 195: Business Workflow Engine** located in the platform's Enterprise Brain system.

---

## 1. Table: `workflow_templates`
Stores predefined adaptive business workflow templates available within the Enterprise Brain.

| Column Name | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | Primary key of the workflow template, prefixed with `tmpl_` |
| `tenant_id` | `VARCHAR(50)` | NO | Foreign key reference identifier of the tenant owning the template |
| `name` | `VARCHAR(100)` | NO | Display name of the workflow template (e.g. "自动安全库存补货工作流") |
| `trigger_type` | `VARCHAR(50)` | NO | Event trigger classification (`inventory_low`, `customer_churn`, `pricing_anomaly`) |
| `description` | `TEXT` | YES | Natural-language explanation of the autonomous intent |
| `is_active` | `BOOLEAN` | NO | Active enabled flag status of the template |
| `created_at` | `TIMESTAMP` | NO | Insertion and initialization timestamp |

### Indexes
- `idx_workflow_templates_tenant` ON (`tenant_id`) - Standard multi-tenant partition lookup.

---

## 2. Table: `workflow_instances`
Represents the orchestrated live execution runs triggered by store operational events.

| Column Name | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | Primary key of the execution instance, prefixed with `inst_` |
| `tenant_id` | `VARCHAR(50)` | NO | Partition safety tenant reference |
| `template_id` | `VARCHAR(50)` | NO | Target relation reference pointing to `workflow_templates(id)` |
| `name` | `VARCHAR(150)` | NO | Concrete runtime instance descriptive name |
| `status` | `VARCHAR(30)` | NO | Lifecycle state of current instance (`running`, `completed`, `failed`, `suspended`) |
| `current_step_id` | `VARCHAR(50)` | YES | Active running workspace workflow step ID |
| `trigger_reason` | `TEXT` | YES | Event logs explaining why the workflow was initially dispatched |
| `created_at` | `TIMESTAMP` | NO | Bootstrapping execution timestamp |
| `completed_at` | `TIMESTAMP` | YES | Completion date marking closure or NULL if active |

### Indexes
- `idx_workflow_id_tenant_status` ON (`tenant_id`, `status`) - Auditing analytics indexing.

---

## 3. Table: `workflow_steps`
Represents sequentially mapped stages processed by assigned agents.

| Column Name | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | Primary key of the workflow step, prefixed with `step_` |
| `workflow_id` | `VARCHAR(50)` | NO | Owning workflow run identifier referencing `workflow_instances(id)` |
| `step_number` | `INT` | NO | Sequencing sorting index starting at 1 |
| `name` | `VARCHAR(100)` | NO | Local execution descriptive name of the step stage |
| `action_type` | `VARCHAR(50)` | NO | Standardized action model category (e.g. `inventory_check`, `purchase_plan`, `risk_review`) |
| `status` | `VARCHAR(30)` | NO | Current step lifecycle status (`pending`, `running`, `completed`, `failed`) |
| `assigned_agent` | `VARCHAR(100)` | YES | Associated autonomous agent role dispatched (e.g. `InventoryAgent`, `FinanceAgent`) |
| `execution_response`| `TEXT` | YES | Response payload / action feedback from agent |
| `started_at` | `TIMESTAMP` | YES | Timestamp of step execution start |
| `completed_at` | `TIMESTAMP` | YES | Timestamp of step validation termination |

### Indexes
- `idx_workflow_steps_wf` ON (`workflow_id`, `step_number`) - Fetch execution pipelines.

---

## 4. Table: `workflow_execution_logs`
Deep auditing database tracking logs to verify constitutional adherence.

| Column Name | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | Primary key of the log record, prefixed with `log_` |
| `tenant_id` | `VARCHAR(50)` | NO | Parent tenant identifier |
| `workflow_instance_id`| `VARCHAR(50)`| YES | Pointer referencing target execution instance |
| `step_id` | `VARCHAR(50)` | YES | Precise step context reference |
| `log_level` | `VARCHAR(20)` | NO | Gravity tracking category (`info`, `warning`, `error`, `governance_audit`) |
| `message` | `TEXT` | NO | Structured logging description payload |
| `timestamp` | `TIMESTAMP` | NO | Exact event firing atomic time |

---

## 5. Table: `workflow_results`
Consolidates quantifiable outcomes, including earned revenue (GMV) or costs saved.

| Column Name | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | `VARCHAR(50)` | NO | Primary key of the result outcome tracker, prefixed with `res_` |
| `tenant_id` | `VARCHAR(50)` | NO | Multi-tenant separator code |
| `workflow_instance_id`| `VARCHAR(50)`| NO | High-integrity pointer (unique) referencing parent instance |
| `outcome` | `VARCHAR(20)` | NO | Evaluation state of the final execute outcome (`success`, `failure`) |
| `revenue_gained` | `DECIMAL(15,2)` | NO | Actual incremental GMV recovered by the self-healing pipeline |
| `cost_saved` | `DECIMAL(15,2)` | NO | Factory invoice or refund cost saved |
| `metrics_impact` | `TEXT` | YES | Summary stating quantitative changes in tracking variables |
| `verified_at` | `TIMESTAMP` | NO | Auditing verification timestamp |
