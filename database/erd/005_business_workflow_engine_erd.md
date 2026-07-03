# AI Commerce OS - ERD (Entity Relationship Diagram)

ERD layout referencing the relationships between multi-tenant structural cores and the **Phase 195: Business Workflow Engine** entities.

```mermaid
erDiagram
    tenants ||--o{ workflow_templates : "owns"
    workflow_templates ||--o{ workflow_instances : "instantiates"
    workflow_instances ||--o{ workflow_steps : "comprises"
    workflow_instances ||--o{ workflow_results : "yields_results"
    workflow_instances ||--o{ workflow_execution_logs : "records_logs"
    workflow_steps ||--o{ workflow_execution_logs : "chronicles"

    tenants {
        varchar id PK
        varchar name
        varchar billing_plan
        varchar status
    }

    workflow_templates {
        varchar id PK
        varchar tenant_id FK
        varchar name
        varchar trigger_type
        text description
        boolean is_active
        timestamp created_at
    }

    workflow_instances {
        varchar id PK
        varchar tenant_id
        varchar template_id FK
        varchar name
        varchar status
        varchar current_step_id
        text trigger_reason
        timestamp created_at
        timestamp completed_at
    }

    workflow_steps {
        varchar id PK
        varchar workflow_id FK
        int step_number
        varchar name
        varchar action_type
        varchar status
        varchar assigned_agent
        text execution_response
        timestamp started_at
        timestamp completed_at
    }

    workflow_execution_logs {
        varchar id PK
        varchar tenant_id
        varchar workflow_instance_id FK
        varchar step_id FK
        varchar log_level
        text message
        timestamp timestamp
    }

    workflow_results {
        varchar id PK
        varchar tenant_id
        varchar workflow_instance_id FK
        varchar outcome
        numeric revenue_gained
        numeric cost_saved
        text metrics_impact
        timestamp verified_at
    }
```

## Architectural Decoupling Details
- **Multi-Tenant Integrity:** Every lookup in both шаблонах (templates) and instances checks tenancy via the foreign key `tenant_id` linked securely to `tenants(id)`.
- **Bilateral Relation Stability:** Deleting an orchestration template Cascades down to purge all spawned executions, chronological tracker steps, and financial outcomes to prevent orphan data pollution.
- **Set Null Log Protection:** Audit logs (`workflow_execution_logs`) reference individual steps via `ON DELETE SET NULL`, preserving the integrity of executive tracking journals even if low-level step records are cleared during database compression routines.
