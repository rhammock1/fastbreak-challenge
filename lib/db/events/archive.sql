UPDATE events
SET archived = NOW(),
  update_user_id = ${user_id}
WHERE event_id = ${event_id};
