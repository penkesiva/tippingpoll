-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create polls table
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    total_votes INTEGER DEFAULT 0
);

-- Create state_votes table
CREATE TABLE state_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    state_code VARCHAR(2) NOT NULL,
    yes_votes INTEGER DEFAULT 0,
    no_votes INTEGER DEFAULT 0,
    depends_votes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, state_code)
);

-- Create user_votes table for analytics
CREATE TABLE user_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    state_code VARCHAR(2),
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('yes', 'no', 'depends')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial poll
INSERT INTO polls (question, is_active) VALUES 
('Is a 20% tip justified for a simple drip coffee?', true);

-- Insert initial state data for all 50 states
INSERT INTO state_votes (poll_id, state_code, yes_votes, no_votes, depends_votes, total_votes) VALUES
(1, 'AL', 0, 0, 0, 0), (1, 'AK', 0, 0, 0, 0), (1, 'AZ', 0, 0, 0, 0),
(1, 'AR', 0, 0, 0, 0), (1, 'CA', 0, 0, 0, 0), (1, 'CO', 0, 0, 0, 0),
(1, 'CT', 0, 0, 0, 0), (1, 'DE', 0, 0, 0, 0), (1, 'FL', 0, 0, 0, 0),
(1, 'GA', 0, 0, 0, 0), (1, 'HI', 0, 0, 0, 0), (1, 'ID', 0, 0, 0, 0),
(1, 'IL', 0, 0, 0, 0), (1, 'IN', 0, 0, 0, 0), (1, 'IA', 0, 0, 0, 0),
(1, 'KS', 0, 0, 0, 0), (1, 'KY', 0, 0, 0, 0), (1, 'LA', 0, 0, 0, 0),
(1, 'ME', 0, 0, 0, 0), (1, 'MD', 0, 0, 0, 0), (1, 'MA', 0, 0, 0, 0),
(1, 'MI', 0, 0, 0, 0), (1, 'MN', 0, 0, 0, 0), (1, 'MS', 0, 0, 0, 0),
(1, 'MO', 0, 0, 0, 0), (1, 'MT', 0, 0, 0, 0), (1, 'NE', 0, 0, 0, 0),
(1, 'NV', 0, 0, 0, 0), (1, 'NH', 0, 0, 0, 0), (1, 'NJ', 0, 0, 0, 0),
(1, 'NM', 0, 0, 0, 0), (1, 'NY', 0, 0, 0, 0), (1, 'NC', 0, 0, 0, 0),
(1, 'ND', 0, 0, 0, 0), (1, 'OH', 0, 0, 0, 0), (1, 'OK', 0, 0, 0, 0),
(1, 'OR', 0, 0, 0, 0), (1, 'PA', 0, 0, 0, 0), (1, 'RI', 0, 0, 0, 0),
(1, 'SC', 0, 0, 0, 0), (1, 'SD', 0, 0, 0, 0), (1, 'TN', 0, 0, 0, 0),
(1, 'TX', 0, 0, 0, 0), (1, 'UT', 0, 0, 0, 0), (1, 'VT', 0, 0, 0, 0),
(1, 'VA', 0, 0, 0, 0), (1, 'WA', 0, 0, 0, 0), (1, 'WV', 0, 0, 0, 0),
(1, 'WI', 0, 0, 0, 0), (1, 'WY', 0, 0, 0, 0);

-- Create indexes for performance
CREATE INDEX idx_state_votes_poll_state ON state_votes(poll_id, state_code);
CREATE INDEX idx_user_votes_poll_state ON user_votes(poll_id, state_code);
CREATE INDEX idx_user_votes_created_at ON user_votes(created_at);

-- Enable Row Level Security (optional, for production)
-- ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE state_votes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_votes ENABLE ROW LEVEL SECURITY;
