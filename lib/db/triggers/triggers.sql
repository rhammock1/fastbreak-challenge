CREATE OR REPLACE FUNCTION archive_event_venue() RETURNS TRIGGER AS $$
BEGIN
  -- Keeps event_venues table in sync with events and venues
  IF TG_TABLE_NAME = 'events' THEN
    UPDATE event_venues
    SET archived = NEW.archived
    WHERE event_id = NEW.event_id;
  ELSEIF TG_TABLE_NAME = 'venues' THEN
    UPDATE event_venues
    SET archived = NEW.archived
    WHERE venue_id = NEW.venue_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER archive_event_venue_by_event
AFTER UPDATE of archived ON events
FOR EACH ROW
WHEN (OLD.archived IS NULL AND NEW.archived IS NOT NULL)
EXECUTE PROCEDURE archive_event_venue();

CREATE OR REPLACE TRIGGER archive_event_venue_by_venue
AFTER UPDATE of archived ON venues
FOR EACH ROW
WHEN (OLD.archived IS NULL AND NEW.archived IS NOT NULL)
EXECUTE PROCEDURE archive_event_venue();
