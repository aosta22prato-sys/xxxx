-- Seed initial data for ECOS enterprise brain goal execution tracking
INSERT INTO goal_missions (id, tenant_id, goal_name, target_metric, target_value, current_value, deadline, status, created_at, updated_at)
VALUES (
    'gm_france_sales_20',
    'tenant_global_moda',
    '法国销售额提升20%',
    'FR_SALES_VOLUME',
    12000.00,
    10200.00,
    '2026-07-10 00:00:00+00',
    'active',
    '2026-06-01 00:00:00+00',
    '2026-06-09 21:30:00+00'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO goal_tasks (id, mission_id, agent_type, task_name, priority, status, assigned_at, completed_at)
VALUES 
(
    'gt_inv_01',
    'gm_france_sales_20',
    'InventoryAgent',
    '法国海外仓畅销SKU库存安全水线审计与补货预演',
    'high',
    'completed',
    '2026-06-01 08:00:00+00',
    '2026-06-02 12:00:00+00'
),
(
    'gt_mkt_01',
    'gm_france_sales_20',
    'MarketingAgent',
    '巴黎高意向客群个性化精细促销分拨',
    'medium',
    'running',
    '2026-06-02 14:00:00+00',
    NULL
),
(
    'gt_cust_01',
    'gm_france_sales_20',
    'CustomerAgent',
    '意向流失VIP法国客户挽回唤醒',
    'high',
    'completed',
    '2026-06-03 09:00:00+00',
    '2026-06-04 17:30:00+00'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO goal_progress (id, mission_id, date, metric_value, progress_percent, notes)
VALUES 
(
    'gp_p1',
    'gm_france_sales_20',
    '2026-06-02',
    10100.00,
    5.50,
    '第一天自动跟踪: InventoryAgent完成补水量检测，仓配正常履约中。'
),
(
    'gp_p2',
    'gm_france_sales_20',
    '2026-06-05',
    10200.00,
    11.10,
    '第五天监控: 销量有微幅增长，CustomerAgent完成VIP流失激活；但巴黎营销渠道ROI有走弱风险，偏离预订增长斜率。'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO goal_adjustments (id, mission_id, reason, old_strategy, new_strategy, created_at)
VALUES (
    'ga_adj1',
    'gm_france_sales_20',
    '法国站转化斜率低于预设基线7.5%：由于巴黎地区受非典型天气与投递摩擦扰动，渠道点击价格攀升14%。',
    '全域精准短词搜索竞价+Instagram巴黎专属贴片推荐',
    '对已降折法国热爆款开启Adwords长尾地理定向+加赠法国本土包邮礼品券',
    '2026-06-08 09:00:00+00'
) ON CONFLICT (id) DO NOTHING;
