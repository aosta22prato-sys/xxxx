# AI Commerce OS - ERD (Entity Relationship Diagram)

ERD layout referencing the relationships between multi-tenant structural cores and the **Phase 191: Goal Execution Engine v1** entities.

```mermaid
erDiagram
    tenants ||--o{ goal_missions : "hosts"
    goal_missions ||--o{ goal_tasks : "decomposes_into"
    goal_missions ||--o{ goal_progress : "tracks_daily"
    goal_missions ||--o{ goal_adjustments : "triggers_self_correction"

    tenants {
        varchar id PK
        varchar name
        varchar billing_plan
        varchar status
    }

    goal_missions {
        varchar id PK
        varchar tenant_id FK
        varchar goal_name
        varchar target_metric
        numeric target_value
        numeric current_value
        timestamp deadline
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    goal_tasks {
        varchar id PK
        varchar mission_id FK
        varchar agent_type
        varchar task_name
        varchar priority
        varchar status
        timestamp assigned_at
        timestamp completed_at
    }

    goal_progress {
        varchar id PK
        varchar mission_id FK
        date date
        numeric metric_value
        numeric progress_percent
        text notes
    }

    goal_adjustments {
        varchar id PK
        varchar mission_id FK
        text reason
        text old_strategy
        text new_strategy
        timestamp created_at
    }
```

## Architectural Decoupling details
- **Multi-tenant Integrity:** Every lookup in `goal_missions` checks tenancy via the foreign key `tenant_id` linked securely to `tenants(id)`.
- **Relational Integrity:** Restricting Cascade constraints at database-engine and schema levels so that deleting a high-level mission purges associated sub-tasks, telemetry records, and corrections instantly to prevent orphan pollution.
