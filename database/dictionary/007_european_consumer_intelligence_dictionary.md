# 007_european_consumer_intelligence_dictionary.md

## Data Dictionary for European Consumer Intelligence (Phase 261-270)

### 1. `consumer_personas`
Stores core high-level demographics, shopping budgets, and generic conversion scores for European fashion archetypes.

| Column Name | Type | Key | Description |
|---|---|---|---|
| `id` | VARCHAR(255) | PK | Unique identifier for the persona (e.g., `cp_fr_chic`) |
| `persona_name` | VARCHAR(255) | | Descriptive human name (e.g. "法国时尚白白领") |
| `country` | VARCHAR(10) | | Country code (e.g., 'FR', 'DE', 'IT', 'GB') |
| `gender` | VARCHAR(20) | | Demographic gender segment ('Female', 'Male', 'Unisex') |
| `age_segment` | VARCHAR(20) | | Demographic age bracket ('18-24', '25-34', '35-50', '50+') |
| `market_category` | VARCHAR(50) | | Category tier target ('Luxury', 'Premium', 'Pragmatic', 'Casual') |
| `preferred_channels` | TEXT | | JSON array string listing high affinity marketing channels |
| `monthly_fashion_budget` | DECIMAL(10,2) | | Average monthly purchase power in Euros |
| `conversion_probability` | DECIMAL(5,2) | | Percentage representation of average buy probability |

---

### 2. `purchase_motivations`
Stores driving factors and weight ratios for why that specific customer segment opens their wallet.

| Column Name | Type | Key | Description |
|---|---|---|---|
| `id` | VARCHAR(255) | PK | Unique locator |
| `persona_id` | VARCHAR(255) | FK | References `consumer_personas.id` |
| `primary_motivator` | VARCHAR(255) | | Key text reason for apparel purchases |
| `social_proof_weight` | INT | | Weight of peer reviews, influencer wear (0-100) |
| `quality_importance` | INT | | Importance of fabric craft and stitching durability (0-100) |
| `price_weight` | INT | | Price sensitivity importance (0-100) |
| `sustainability_score` | INT | | Value of eco labels/circular fashion credentials (0-100) |

---

### 3. `price_sensitivities`
Houses price tolerance indexes and discount sensitivity behaviors.

| Column Name | Type | Key | Description |
|---|---|---|---|
| `id` | VARCHAR(255) | PK | Unique ID |
| `persona_id` | VARCHAR(255) | FK | References `consumer_personas.id` |
| `price_tolerance_index` | INT | | Willingness to pay high price margins (0-100) |
| `promotion_buyer_flag` | INT | | Flag indicating discount hunter (0 = false, 1 = true) |
| `luxury_markup_acceptance_ratio` | DECIMAL(5,2) | | Multiplier limit above raw factory cost |

---

### 4. `lifestyle_clusters`
Records habits of everyday life, hybrid work environments, and brand trust index.

| Column Name | Type | Key | Description |
|---|---|---|---|
| `id` | VARCHAR(255) | PK | Unique ID |
| `persona_id` | VARCHAR(255) | FK | References `consumer_personas.id` |
| `cluster_name` | VARCHAR(255) | | Label e.g., 'Urban Minimalist' |
| `work_home_ratio` | INT | | Target percentage of hybrid work style (0-100) |
| `brand_loyalty_index` | INT | | Degree of repeat buying probability (0-100) |

---

### 5. `regional_preferences`
Tracks broad, country-level styling tastes for silhouette shaping, sizing patterns, and palette tones.

| Column Name | Type | Key | Description |
|---|---|---|---|
| `id` | VARCHAR(255) | PK | Unique ID |
| `country` | VARCHAR(10) | UNIQUE | Region code (e.g. 'FR') |
| `color_preference` | VARCHAR(255) | | Dominant preferred fabric base colors |
| `silhouette_preference` | VARCHAR(255) | | Shape (e.g., Slim, Straight, Oversized) |
| `average_size_preference` | VARCHAR(255) | | Typical size fit expectations of that population |

---

### 6. `age_segment_behaviors`
Stores life-stage trends describing seasonal speed and dynamic trend adoption patterns.

| Column Name | Type | Key | Description |
|---|---|---|---|
| `id` | VARCHAR(255) | PK | Unique ID |
| `age_segment` | VARCHAR(20) | UNIQUE | Age bracket key |
| `seasonal_switching_frequency` | INT | | Wardrobe cycles per year |
| `influencer_susceptibility_score` | INT | | Direct influencer persuasion sensitivity (0-100) |
