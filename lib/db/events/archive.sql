UPDATE events
SET archived = NOW(),
  update_user_id = ${user_id}
WHERE event_uuid = ${event_uuid};
