-- Database Schema for Botble CMS & Laravel 12.x Multi-Agent Synergy Bridge
-- Reference: ECOS Architecture Lock v1.0 / Phase 521-540
-- Filename: 009_botble_laravel_bridge_schema.sql

-- 1. Botble Hook Connection Settings
CREATE TABLE IF NOT EXISTS `botble_sync_configurations` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tenant_id` VARCHAR(100) NOT NULL DEFAULT 'tenant_default',
    `store_id` VARCHAR(100) NOT NULL DEFAULT 'store_default',
    `botble_endpoint` VARCHAR(255) NOT NULL,
    `hmac_secret_key` VARCHAR(255) NOT NULL,
    `sync_status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, FAILING
    `last_checked_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `idx_tenant_store_botble_sync` (`tenant_id`, `store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. Incoming Webhook Event Tracker
CREATE TABLE IF NOT EXISTS `botble_webhook_events` (
    `id` VARCHAR(100) PRIMARY KEY, -- standard unique uuid/request_id
    `tenant_id` VARCHAR(100) NOT NULL,
    `store_id` VARCHAR(100) NOT NULL,
    `event_source` VARCHAR(100) NOT NULL DEFAULT 'BOTBLE_CMS_WEBHOOK',
    `event_type` VARCHAR(150) NOT NULL, -- e.g. ecommerce.product.low_inventory, ecommerce.product.created
    `payload` JSON NOT NULL,
    `signature_verified` TINYINT(1) NOT NULL DEFAULT 0,
    `processing_status` VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    `received_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `processed_at` TIMESTAMP NULL,
    INDEX `idx_processing_events` (`processing_status`),
    INDEX `idx_event_type` (`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. Collaborative Multi-Agent Synergy Runs
CREATE TABLE IF NOT EXISTS `botble_collab_synergy_runs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `event_id` VARCHAR(100) DEFAULT NULL, -- maps back to botble_webhook_events.id
    `tenant_id` VARCHAR(100) NOT NULL,
    `store_id` VARCHAR(100) NOT NULL,
    `scenario_code` VARCHAR(100) NOT NULL, -- low_inventory, new_product_raw, vip_silent
    `orchestrator` VARCHAR(50) NOT NULL DEFAULT 'CEO Sophia',
    `run_status` VARCHAR(50) NOT NULL DEFAULT 'RUNNING', -- RUNNING, SUCCEEDED, FAILED
    `timeline_steps` JSON NOT NULL, -- JSON array of steps completed by agent roles (Oliver, Fiona, Leo, Grace, Marcus)
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`event_id`) REFERENCES `botble_webhook_events` (`id`) ON DELETE SET NULL,
    INDEX `idx_run_scenario` (`scenario_code`),
    INDEX `idx_run_status` (`run_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. Secure Audited Agent Tasks Gateway Dispatch Log
CREATE TABLE IF NOT EXISTS `botble_agent_tasks` (
    `id` VARCHAR(100) PRIMARY KEY, -- maps to task_requests.id in ECOS Core
    `synergy_run_id` BIGINT UNSIGNED DEFAULT NULL,
    `tenant_id` VARCHAR(100) NOT NULL,
    `store_id` VARCHAR(100) NOT NULL,
    `agent_role` VARCHAR(100) NOT NULL, -- InventoryAgent, PricingAgent, MarketingAgent, CustomerAgent, FinanceAgent
    `action_type` VARCHAR(150) NOT NULL, -- REPLENISH_STOCK, ADJUST_PRICE, CREATE_COUPON, CREATE_MARKET
    `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING_RESOLVE, SUCCESSFUL, DENIED
    `estimated_cost_eur` DECIMAL(12, 4) DEFAULT '0.0000',
    `rule_signature` VARCHAR(120) NOT NULL, -- ECOS validation signature
    `denial_reason` TEXT DEFAULT NULL,
    `executed_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`synergy_run_id`) REFERENCES `botble_collab_synergy_runs` (`id`) ON DELETE SET NULL,
    INDEX `idx_task_gateway_auth` (`tenant_id`, `store_id`, `agent_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
