-- European Consumer Intelligence SQL Schemas
-- Business-logical definitions for Euro-centric market intelligence profiling.

CREATE TABLE IF NOT EXISTS consumer_personas (
    id VARCHAR(255) PRIMARY KEY,
    persona_name VARCHAR(255) NOT NULL,
    country VARCHAR(10) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    age_segment VARCHAR(20) NOT NULL,
    market_category VARCHAR(50) NOT NULL,
    preferred_channels TEXT NOT NULL, -- JSON array string
    monthly_fashion_budget DECIMAL(10,2) NOT NULL,
    conversion_probability DECIMAL(5,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase_motivations (
    id VARCHAR(255) PRIMARY KEY,
    persona_id VARCHAR(255) NOT NULL,
    primary_motivator VARCHAR(255) NOT NULL,
    social_proof_weight INT NOT NULL,
    quality_importance INT NOT NULL,
    price_weight INT NOT NULL,
    sustainability_score INT NOT NULL,
    FOREIGN KEY (persona_id) REFERENCES consumer_personas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS price_sensitivities (
    id VARCHAR(255) PRIMARY KEY,
    persona_id VARCHAR(255) NOT NULL,
    price_tolerance_index INT NOT NULL,
    promotion_buyer_flag INT NOT NULL, -- 0 or 1
    luxury_markup_acceptance_ratio DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (persona_id) REFERENCES consumer_personas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lifestyle_clusters (
    id VARCHAR(255) PRIMARY KEY,
    persona_id VARCHAR(255) NOT NULL,
    cluster_name VARCHAR(255) NOT NULL,
    work_home_ratio INT NOT NULL,
    brand_loyalty_index INT NOT NULL,
    FOREIGN KEY (persona_id) REFERENCES consumer_personas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS regional_preferences (
    id VARCHAR(255) PRIMARY KEY,
    country VARCHAR(10) NOT NULL UNIQUE,
    color_preference VARCHAR(255) NOT NULL,
    silhouette_preference VARCHAR(255) NOT NULL,
    average_size_preference VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS age_segment_behaviors (
    id VARCHAR(255) PRIMARY KEY,
    age_segment VARCHAR(20) NOT NULL UNIQUE,
    seasonal_switching_frequency INT NOT NULL,
    influencer_susceptibility_score INT NOT NULL
);
