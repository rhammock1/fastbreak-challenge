UPDATE event_venues
SET archived = NOW()
WHERE event_id = ${event_id};
