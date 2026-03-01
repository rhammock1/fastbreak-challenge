INSERT INTO event_venues (event_id, venue_id)
SELECT ${event_id}, venue_id
FROM venues
WHERE venue_uuid = ANY(${venue_uuids});
