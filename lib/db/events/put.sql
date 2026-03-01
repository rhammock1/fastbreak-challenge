WITH event_insert AS (
  INSERT INTO events (
    event_name,
    event_description,
    event_sport_type,
    event_start_time,
    event_end_time,
    create_user_id,
    update_user_id
  ) VALUES (
    ${event_name},
    ${event_description},
    ${event_sport_type},
    ${event_start_time},
    ${event_end_time},
    ${create_user_id},
    ${create_user_id}
  )
  RETURNING event_id
), event_venue_insert AS (
  INSERT INTO event_venues (event_id, venue_id)
  SELECT (SELECT event_id FROM event_insert), venue_id
  FROM venues
  WHERE venue_uuid = ANY(${event_venues})
) SELECT event_id FROM event_insert;
