-- Goal Strategic Policy Adjustments Table Schema for closed-loop self-correction logs
CREATE TABLE IF NOT EXISTS goal_adjustments (
    id VARCHAR(50) PRIMARY KEY,
    mission_id VARCHAR(50) NOT NULL REFERENCES goal_missions(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    old_strategy TEXT NOT NULL,
    new_strategy TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for strategic audit trail auditing and boardroom tracking
CREATE INDEX IF NOT EXISTS idx_goal_adjustments_mission ON goal_adjustments(mission_id);
