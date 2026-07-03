-- Database Seeds for Botble CMS & Laravel 12.x Multi-Agent Synergy Bridge
-- Reference: ECOS Architecture Lock v1.0
-- Filename: 009_botble_laravel_bridge_seed.sql

-- 1. Bootstrap default Botble Sync Configurations
INSERT INTO `botble_sync_configurations` 
    (`id`, `tenant_id`, `store_id`, `botble_endpoint`, `hmac_secret_key`, `sync_status`, `last_checked_at`)
VALUES 
    (1, 'tenant_default', 'store_default', 'https://your-botble-site.dev/api/v1/ecos-bridge', 'ecos_secret_hmac_default_validation_token_2026', 'ACTIVE', NOW())
ON DUPLICATE KEY UPDATE 
    `botble_endpoint` = VALUES(`botble_endpoint`),
    `hmac_secret_key` = VALUES(`hmac_secret_key`),
    `sync_status` = VALUES(`sync_status`);


-- 2. Seed Mock Incoming Webhook Events representing Botble occurrences
INSERT INTO `botble_webhook_events`
    (`id`, `tenant_id`, `store_id`, `event_source`, `event_type`, `payload`, `signature_verified`, `processing_status`, `processed_at`)
VALUES
    ('evt_botble_001_low_inventory', 'tenant_default', 'store_default', 'BOTBLE_CMS_WEBHOOK', 'ecommerce.product.low_inventory', 
     '{"sku": "COAT-WINTER-99", "name": "Minimalist Cashmere Wool Overcoat", "available_stock": 3, "safety_threshold": 10}', 
     1, 'COMPLIANCE_APPROVED', NOW()),
    
    ('evt_botble_002_new_product', 'tenant_default', 'store_default', 'BOTBLE_CMS_WEBHOOK', 'ecommerce.product.created', 
     '{"raw_title": "韩版宽松羊毛大衣秋冬新款", "raw_description": "高端手工双面呢羊毛大衣，修身保暖多色。售价150欧元。", "currency": "EUR"}', 
     1, 'COMPLIANCE_APPROVED', NOW()),
    
    ('evt_botble_003_customer_silent', 'tenant_default', 'store_default', 'BOTBLE_CMS_WEBHOOK', 'ecommerce.customer.inactive_loyalty', 
     '{"customer_email": "sophie.dubois@paris.fr", "ltv_eur": 1245.50, "days_since_last_order": 92}', 
     1, 'COMPLIANCE_APPROVED', NOW())
ON DUPLICATE KEY UPDATE 
    `processing_status` = VALUES(`processing_status`);


-- 3. Seed Multi-Agent Synergy Run Logs responding to Botble Webhooks
INSERT INTO `botble_collab_synergy_runs`
    (`id`, `event_id`, `tenant_id`, `store_id`, `scenario_code`, `orchestrator`, `run_status`, `timeline_steps`)
VALUES
    (1, 'evt_botble_001_low_inventory', 'tenant_default', 'store_default', 'low_inventory', 'CEO Sophia', 'SUCCEEDED',
     '[
        {"agent": "CEO Sophia", "stamp": "09:00:01", "role": "Orchestrator", "detail": "Discovered low stock for cashmere coat on Botble. Triggered low_inventory synergy thread."},
        {"agent": "WMS Oliver", "stamp": "09:02:15", "role": "Inventory Tracker", "detail": "Audited local supplier catalog. Initiated replenishing procurement request of 300 wool items."},
        {"agent": "精算师 Fiona", "stamp": "09:04:30", "role": "Pricing actuary", "detail": "Calculated raw-supply exchange coefficients. Recommended winter加价 to 195 EUR, boosting margin +3.6%."},
        {"agent": "编排官 Leo", "stamp": "09:06:45", "role": "SEO Architect", "detail": "Refined the English, French, and German SEO tags, improving keyword visibility index by +12.4%."}
     ]'),
     
    (2, 'evt_botble_002_new_product', 'tenant_default', 'store_default', 'new_product_raw', 'CEO Sophia', 'SUCCEEDED',
     '[
        {"agent": "CEO Sophia", "stamp": "10:15:00", "role": "Orchestrator", "detail": "Raw product added structure detected. Handed over draft to translation and pricing board."},
        {"agent": "编排官 Leo", "stamp": "10:17:10", "role": "SEO Architect", "detail": "Rewrote title to: ''Classic Double-Breasted Woolen Trench Coat - Parisian Editorial Series''. Embedded metadata."},
        {"agent": "精算师 Fiona", "stamp": "10:19:40", "role": "Pricing actuary", "detail": "Analyzed competitor price elasticity. Structured direct tier discounts for boutique loyalty tiers."}
     ]'),
     
    (3, 'evt_botble_003_customer_silent', 'tenant_default', 'store_default', 'vip_silent', 'CEO Sophia', 'SUCCEEDED',
     '[
        {"agent": "CEO Sophia", "stamp": "11:30:10", "role": "Orchestrator", "detail": "High-value customer Sophie Dubois has been silent for 92 days. Commissioning loyalty recall campaign."},
        {"agent": "CRM Grace", "stamp": "11:32:05", "role": "Customer Relationship Expert", "detail": "Constructed segment profile. Verified customer purchase history prefers warm neutral and beige silk outerwear."},
        {"agent": "营销官 Marcus", "stamp": "11:34:50", "role": "Marketing Campaign Director", "detail": "Generated and approved a 15% custom voucher with priority delivery. Queued transactional call."}
     ]')
ON DUPLICATE KEY UPDATE 
    `run_status` = VALUES(`run_status`),
    `timeline_steps` = VALUES(`timeline_steps`);


-- 4. Seed Audited Agent Gateway Transactions Log
INSERT INTO `botble_agent_tasks`
    (`id`, `synergy_run_id`, `tenant_id`, `store_id`, `agent_role`, `action_type`, `status`, `estimated_cost_eur`, `rule_signature`, `executed_at`)
VALUES
    ('task_req_botble_010', 1, 'tenant_default', 'store_default', 'InventoryAgent', 'REPLENISH_STOCK', 'SUCCESSFUL', 1500.00, 'gov_sig_7f8ee390', NOW()),
    ('task_req_botble_011', 1, 'tenant_default', 'store_default', 'PricingAgent', 'ADJUST_PRICE', 'SUCCESSFUL', 0.00, 'gov_sig_ab8cc910', NOW()),
    ('task_req_botble_012', 2, 'tenant_default', 'store_default', 'PricingAgent', 'ADJUST_PRICE', 'SUCCESSFUL', 0.00, 'gov_sig_ca41b290', NOW()),
    ('task_req_botble_013', 3, 'tenant_default', 'store_default', 'MarketingAgent', 'CREATE_COUPON', 'SUCCESSFUL', 150.00, 'gov_sig_fd89100c', NOW())
ON DUPLICATE KEY UPDATE 
    `status` = VALUES(`status`),
    `executed_at` = VALUES(`executed_at`);
