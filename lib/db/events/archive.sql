UPDATE events
SET archived = NOW()
WHERE event_id = ${event_id};
