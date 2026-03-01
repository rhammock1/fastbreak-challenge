UPDATE events
SET event_name = COALESCE(event_name, ${event_name}),
  event_description = COALESCE(event_description, ${event_description}),
  event_sport_type = COALESCE(event_sport_type, ${event_sport_type}),
  event_start_time = COALESCE(event_start_time, ${event_start_time}),
  event_end_time = COALESCE(event_end_time, ${event_end_time})
WHERE event_uuid = ${event_uuid}
RETURNING event_id;