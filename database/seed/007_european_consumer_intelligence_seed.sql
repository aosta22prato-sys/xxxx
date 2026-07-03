-- European Consumer Intelligence Seed values
-- Real data seeds for France, Germany, Italy, and UK consumer demographics.

INSERT INTO consumer_personas (id, persona_name, country, gender, age_segment, market_category, preferred_channels, monthly_fashion_budget, conversion_probability) VALUES
('cp_fr_chic', '法国时尚精英白领 (Parisian Chic Elite)', 'FR', 'Female', '25-34', 'Luxury', '["Instagram", "Direct Store", "Vogue"]', 350.00, 72.5),
('cp_de_pragmatic', '德国理性商务人士 (German Biz Pragmatic)', 'DE', 'Male', '35-50', 'Premium', '["Linkedin", "Email", "Direct Store"]', 180.00, 45.2),
('cp_it_luxury', '意大利经典西装美学爱好者 (Classic Milan Sartorialist)', 'IT', 'Male', '35-50', 'Luxury', '["Direct Store", "Instagram", "Showcase"]', 420.00, 68.0),
('cp_uk_street', '伦敦高街复古先锋 (London Street Trailblazer)', 'GB', 'Unisex', '18-24', 'Casual', '["TikTok", "Instagram", "Pinterest"]', 120.00, 58.4);

INSERT INTO purchase_motivations (id, persona_id, primary_motivator, social_proof_weight, quality_importance, price_weight, sustainability_score) VALUES
('pm_fr_chic', 'cp_fr_chic', 'Social Status & Heritage', 85, 90, 40, 75),
('pm_de_pragmatic', 'cp_de_pragmatic', 'Durability & Fabric Quality', 30, 95, 75, 60),
('pm_it_luxury', 'cp_it_luxury', 'Artisanship & Tailoring Aesthetics', 75, 98, 30, 50),
('pm_uk_street', 'cp_uk_street', 'Trend Expressiveness', 90, 50, 85, 80);

INSERT INTO price_sensitivities (id, persona_id, price_tolerance_index, promotion_buyer_flag, luxury_markup_acceptance_ratio) VALUES
('ps_fr_chic', 'cp_fr_chic', 85, 0, 2.40),
('ps_de_pragmatic', 'cp_de_pragmatic', 45, 1, 1.25),
('ps_it_luxury', 'cp_it_luxury', 92, 0, 2.85),
('ps_uk_street', 'cp_uk_street', 35, 1, 1.10);

INSERT INTO lifestyle_clusters (id, persona_id, cluster_name, work_home_ratio, brand_loyalty_index) VALUES
('lc_fr_chic', 'cp_fr_chic', 'Urban Luxury Minimalist', 80, 75),
('lc_de_pragmatic', 'cp_de_pragmatic', 'Corporate Functionalist', 90, 85),
('lc_it_luxury', 'cp_it_luxury', 'Heritage Enthusiast', 70, 90),
('lc_uk_street', 'cp_uk_street', 'Creative Freelancer Nomad', 30, 40);

INSERT INTO regional_preferences (id, country, color_preference, silhouette_preference, average_size_preference) VALUES
('rp_fr', 'FR', 'Navy, Beige, Charcoal', 'Slim Tailored Fit', '36-38 (S to M)'),
('rp_de', 'DE', 'Black, Dark Grey, Midnight', 'Straight Classic', '40-42 (M to L)'),
('rp_it', 'IT', 'Warm Earth tones, Cream, Beige', 'Soft Deconstructed', '38-40 (M)'),
('rp_uk', 'GB', 'Patterned Plaid, Forest Green', 'Boxy Oversized', '38-40 (M)');

INSERT INTO age_segment_behaviors (id, age_segment, seasonal_switching_frequency, influencer_susceptibility_score) VALUES
('as_young', '18-24', 6, 85),
('as_mid', '25-34', 4, 60),
('as_mature', '35-50', 3, 35),
('as_senior', '50+', 2, 15);
