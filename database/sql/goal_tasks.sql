-- Goal Sub-Agent Tasks Table Schema for AI Enterprise Brain goal decomposition and delegation
CREATE TABLE IF NOT EXISTS goal_tasks (
    id VARCHAR(50) PRIMARY KEY,
    mission_id VARCHAR(50) NOT NULL REFERENCES goal_missions(id) ON DELETE CASCADE,
    agent_type VARCHAR(100) NOT NULL, -- e.g., 'InventoryAgent', 'MarketingAgent', 'CustomerAgent', 'PriceAgent'
    task_name VARCHAR(255) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE NULL
);

-- Indexes for lightning fast lookups & analytical joins during goal updates
CREATE INDEX IF NOT EXISTS idx_goal_tasks_mission_id ON goal_tasks(mission_id);
CREATE INDEX IF NOT EXISTS idx_goal_tasks_agent_status ON goal_tasks(agent_type, status);
