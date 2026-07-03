-- ==========================================
-- ECOS AI Commerce OS (Architecture Lock v1.0)
-- 006_fashion_ontology_seed.sql
-- Seed data for Global Fashion Knowledge Network Ontology
-- ==========================================

-- 1. Insert Core Fashion Entities
INSERT INTO fashion_entities (id, type, name, code) VALUES
('ent_cat_coat', 'category', 'Premium Heavy Coats', 'CTG_COAT'),
('ent_cat_dress', 'category', 'Seamless Knitted Dresses', 'CTG_DRESS'),
('ent_cat_tote', 'category', 'Avenue Luxury Tote Bags', 'CTG_TOTE'),
('ent_mat_cashmere', 'material', 'Loro Piana Cashmere', 'MAT_CSHM'),
('ent_mat_silk', 'material', 'Mulberry Silk Blend', 'MAT_SILK'),
('ent_mat_wool', 'material', 'Fine Merino Wool', 'MAT_WOOL'),
('ent_sea_winter', 'season', 'Alpine Ridge Winter', 'SEA_WNTR'),
('ent_sea_autumn', 'season', 'Cote d''Azur Fall', 'SEA_AUTM'),
('ent_occ_galas', 'occasion', 'Milan Evening Galas', 'OCC_GALA'),
('ent_occ_resort', 'occasion', 'Saint-Tropez Resort Dining', 'OCC_RSRT'),
('ent_style_quiet', 'style', 'Quiet Luxury Elegance', 'STY_QLUX'),
('ent_style_chime', 'style', 'Parisian Chic Accent', 'STY_CHIC')
ON CONFLICT (id) DO UPDATE SET
    type = EXCLUDED.type,
    name = EXCLUDED.name,
    code = EXCLUDED.code;

-- 2. Insert Inter-Entity Relationships
INSERT INTO fashion_relations (id, source_id, target_id, relation_type) VALUES
('rel_1', 'ent_mat_cashmere', 'ent_sea_winter', 'requires'),
('rel_2', 'ent_style_quiet', 'ent_mat_cashmere', 'pairs_with'),
('rel_3', 'ent_mat_silk', 'ent_occ_resort', 'season_fit'),
('rel_4', 'ent_cat_coat', 'ent_style_quiet', 'pairs_with'),
('rel_5', 'ent_cat_dress', 'ent_style_chime', 'pairs_with')
ON CONFLICT (id) DO UPDATE SET
    source_id = EXCLUDED.source_id,
    target_id = EXCLUDED.target_id,
    relation_type = EXCLUDED.relation_type;

-- 3. Insert Fine-Grained Multilevel Taxonomies
INSERT INTO fashion_taxonomy (id, entity_id, taxonomy_tree_path, level) VALUES
('tax_1', 'ent_cat_coat', 'Outerwear > Tailored > Premium Heavy Coats', 3),
('tax_2', 'ent_cat_dress', 'Womenswear > Knitted Wear > Seamless Dresses', 3),
('tax_3', 'ent_cat_tote', 'Leather Goods > Bags > Travel Tote Bags', 3)
ON CONFLICT (id) DO UPDATE SET
    entity_id = EXCLUDED.entity_id,
    taxonomy_tree_path = EXCLUDED.taxonomy_tree_path,
    level = EXCLUDED.level;
