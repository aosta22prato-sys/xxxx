-- Goal Progress logs Table Schema for autonomous metric tracking and drift index evaluation
CREATE TABLE IF NOT EXISTS goal_progress (
    id VARCHAR(50) PRIMARY KEY,
    mission_id VARCHAR(50) NOT NULL REFERENCES goal_missions(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    metric_value NUMERIC(15, 2) NOT NULL,
    progress_percent NUMERIC(5, 2) NOT NULL, -- percentage of progress against target
    notes TEXT NOT NULL
);

-- Index for temporal analysis and progression plotting
CREATE INDEX IF NOT EXISTS idx_goal_progress_mission_date ON goal_progress(mission_id, date);
