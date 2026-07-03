-- ==========================================
-- ECOS AI Commerce OS (Architecture Lock v1.0)
-- 006_fashion_ontology.sql
-- Global Fashion Ontology Relational Database Structure
-- ==========================================

CREATE TABLE IF NOT EXISTS fashion_entities (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(32) NOT NULL CHECK (type IN ('category', 'material', 'season', 'occasion', 'customer_segment', 'style', 'color_family')),
    name VARCHAR(128) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS fashion_relations (
    id VARCHAR(64) PRIMARY KEY,
    source_id VARCHAR(64) NOT NULL REFERENCES fashion_entities(id) ON DELETE CASCADE,
    target_id VARCHAR(64) NOT NULL REFERENCES fashion_entities(id) ON DELETE CASCADE,
    relation_type VARCHAR(32) NOT NULL CHECK (relation_type IN ('requires', 'pairs_with', 'popular_in', 'season_fit', 'segment_default'))
);

CREATE TABLE IF NOT EXISTS fashion_taxonomy (
    id VARCHAR(64) PRIMARY KEY,
    entity_id VARCHAR(64) NOT NULL REFERENCES fashion_entities(id) ON DELETE CASCADE,
    taxonomy_tree_path VARCHAR(255) NOT NULL, -- e.g., 'Outerwear > Coat > Wool Coat'
    level INT NOT NULL DEFAULT 1
);
