-- RepID scores per identity
CREATE TABLE IF NOT EXISTS repid_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identity_address TEXT NOT NULL UNIQUE,
  identity_type TEXT NOT NULL CHECK (identity_type IN ('SBT', 'DBT')),
  display_name TEXT,
  rep_score NUMERIC DEFAULT 50,
  score_breakdown JSONB DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Vouching relationships
CREATE TABLE IF NOT EXISTS vouch_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_address TEXT NOT NULL,
  agent_address TEXT NOT NULL,
  vouch_type TEXT NOT NULL CHECK (vouch_type IN ('revocable', 'time_locked')),
  lock_duration_days INTEGER,
  lock_expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'removed', 'expired', 'blocked')),
  sponsor_rep_delta NUMERIC DEFAULT 0,
  agent_rep_delta NUMERIC DEFAULT 0,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  removed_at TIMESTAMPTZ
);

-- Audit log for demo visibility
CREATE TABLE IF NOT EXISTS trust_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  actor_address TEXT NOT NULL,
  target_address TEXT,
  details JSONB DEFAULT '{}',
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed demo data
INSERT INTO repid_scores (identity_address, identity_type, display_name, rep_score)
VALUES 
  ('sean.sbt', 'SBT', 'Sean (Sponsor)', 75),
  ('mel.agent', 'DBT', 'MEL Agent', 45),
  ('sophia.agent', 'DBT', 'SOPHIA Agent', 52)
ON CONFLICT (identity_address) DO NOTHING;
