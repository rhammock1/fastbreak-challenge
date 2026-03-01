ALTER TABLE events
ADD COLUMN event_uuid TEXT DEFAULT 'evt_' || gen_random_uuid();

ALTER TABLE venues
ADD COLUMN venue_uuid TEXT DEFAULT 'ven_' || gen_random_uuid();
