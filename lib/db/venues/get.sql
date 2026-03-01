SELECT v.venue_id,
  v.venue_uuid,
  v.venue_name,
  v.venue_description,
  format_address(v.venue_street_1, v.venue_street_2, v.venue_city, v.venue_state, v.venue_zip, v.venue_country) AS venue_address
FROM venues v
WHERE v.archived IS NULL;
