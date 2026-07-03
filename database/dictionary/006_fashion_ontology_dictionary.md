# Global Fashion Ontology - Database Schema Dictionary

This document describes the database tables representing the Global Fashion Ontology configured inside the ECOS Enterprise Brain. This knowledge net acts as the long-term semantic layer allowing AI-driven decision systems to understand materials, style pairings, categories, and luxury signals natively rather than simply parsing string values.

---

## 1. Ontology Entities & Taxonomy Layer

### `fashion_entities`
Defines the specialized nodes of the fashion taxonomy graphs, including fabrics, winter/summer seasons, luxury/minimal design formats, and formal contexts.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Entry unique reference. |
| `type` | `VARCHAR(32)` | `NOT NULL` | One of `category`, `material`, `season`, `occasion`, `customer_segment`, `style`, `color_family`. |
| `name` | `VARCHAR(128)` | `NOT NULL` | Normalized human label (e.g. 'Loro Piana Cashmere'). |
| `code` | `VARCHAR(64)` | `UNIQUE` | Machine-readable unique key (e.g. `MAT_CSHM`). |

### `fashion_relations`
Represents the semantic links mapping physical dependencies, optimal seasons, and aesthetic pair recommendations across fashion nodes.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Connection entry ID. |
| `source_id` | `VARCHAR(64)` | `FOREIGN KEY` | Reference to `fashion_entities(id)` under cascaded deletion. |
| `target_id` | `VARCHAR(64)` | `FOREIGN KEY` | Reference to `fashion_entities(id)` under cascaded deletion. |
| `relation_type`| `VARCHAR(32)` | `NOT NULL` | One of `requires`, `pairs_with`, `popular_in`, `season_fit`, `segment_default`. |

### `fashion_taxonomy`
Detailed hierarchic tree path representations of the operational catalog mapped strictly to core entities for depth-based AI recommendation routing.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Hierarchy ID. |
| `entity_id` | `VARCHAR(64)` | `FOREIGN KEY` | Reference to `fashion_entities(id)` under cascaded deletion. |
| `taxonomy_tree_path`| `VARCHAR(255)`| `NOT NULL` | Human and machine parseable breadcrumb string (e.g., `'Outerwear > Coat > Wool Coat'`). |
| `level` | `INT` | `DEFAULT 1` | Depth level of the breadcrumb hierarchy (1 to 5). |
