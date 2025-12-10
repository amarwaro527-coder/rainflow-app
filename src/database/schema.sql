-- Accounts Table: Stores Google OAuth2 credentials
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    refresh_token TEXT NOT NULL,
    daily_quota_used INTEGER DEFAULT 0,
    quota_limit INTEGER DEFAULT 10000,
    -- Default YouTube quota
    last_reset_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Jobs Table: Tracks the status of every video generation task
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    bull_job_id VARCHAR(255),
    type VARCHAR(50),
    -- 'audio', 'video', 'upload'
    status VARCHAR(50) DEFAULT 'PENDING',
    -- PENDING, PROCESSING, COMPLETED, FAILED
    metadata JSONB,
    logs TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);