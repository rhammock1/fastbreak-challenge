import {getEvents, searchEvents} from "@/lib/actions/events";
import {SportType} from "@/lib/types";
import {EventCard} from "./event-card";

type SearchParams = {
  search?: string;
  sport_type?: SportType;
  event_day?: string;
}

export async function EventsList({search, sport_type, event_day}: SearchParams) {
  const hasFilters = !!search || !!sport_type || !!event_day;
  const result = hasFilters ? await searchEvents({search, sport_type, event_day}) : await getEvents();
  if(!result.success) {
    return <p className="text-destructive">Failed to load events</p>
  }
  const events = result.data;
  if(!events.length) {
    return <p className="text-muted-foreground">No events found</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={`event-${event.event_uuid}`} event={event} />
      ))}
    </div>
  )
}