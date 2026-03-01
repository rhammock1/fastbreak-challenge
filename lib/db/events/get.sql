SELECT e.event_id,
  e.event_uuid,
  e.event_name,
  e.event_description,
  e.event_start_time,
  e.event_end_time,
  e.event_sport_type,
  e.event_created,
  e.create_user_id,
  COALESCE(
    jsonb_agg(jsonb_build_object(
      'venue_uuid', v.venue_uuid,
      'venue_name', v.venue_name
    )) FILTER (WHERE v.venue_id IS NOT NULL),
    '[]'::jsonb
  ) AS event_venues
FROM events e
LEFT JOIN event_venues ev ON ev.event_id = e.event_id AND ev.archived IS NULL
LEFT JOIN venues v ON v.venue_id = ev.venue_id AND v.archived IS NULL
WHERE e.archived IS NULL
GROUP BY e.event_id;
