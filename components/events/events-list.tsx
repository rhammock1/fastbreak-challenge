import {EventCard} from "./event-card";
import {EventSummary} from "@/lib/types";

export async function EventsList({events}: {events: EventSummary[]}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={`event-${event.event_uuid}`} event={event} />
      ))}
    </div>
  )
}