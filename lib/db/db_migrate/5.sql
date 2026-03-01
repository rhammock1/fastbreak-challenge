CREATE UNIQUE INDEX idx_event_venues_name_start_end ON events (event_name, event_start_time, event_end_time);

ALTER TABLE events ADD CONSTRAINT unique_event_uuid UNIQUE (event_uuid);
ALTER TABLE venues ADD CONSTRAINT unique_venue_uuid UNIQUE (venue_uuid);
