-- For this small codebase we will need to sync these manually 
-- with the types in lib/types.ts

CREATE TYPE sport_types AS ENUM (
  'Soccer',
  'Basketball',
  'Tennis',
  'Baseball',
  'Football',
  'Hockey',
  'Volleyball',
  'Handball',
  'Rugby',
  'Golf',
  'Other'
);

CREATE TABLE IF NOT EXISTS venues (
  venue_id BIGSERIAL PRIMARY KEY,
  venue_name TEXT NOT NULL,
  venue_description TEXT,
  venue_street_1 TEXT,
  venue_street_2 TEXT,
  venue_city TEXT,
  venue_state TEXT,
  venue_zip TEXT,
  venue_created TIMESTAMPTZ DEFAULT NOW(),
  venue_updated TIMESTAMPTZ DEFAULT NOW(),
  create_user_id TEXT NOT NULL,
  update_user_id TEXT NOT NULL,
  archived TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS events (
  event_id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_description TEXT,
  event_start_time TIMESTAMPTZ NOT NULL,
  event_end_time TIMESTAMPTZ NOT NULL,
  event_sport_type sport_types NOT NULL,
  event_created TIMESTAMPTZ DEFAULT NOW(),
  event_updated TIMESTAMPTZ DEFAULT NOW(),
  create_user_id TEXT NOT NULL,
  update_user_id TEXT NOT NULL,
  archived TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS event_venues (
  event_venue_id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL,
  venue_id BIGINT NOT NULL,
  archived TIMESTAMPTZ DEFAULT NULL
);
