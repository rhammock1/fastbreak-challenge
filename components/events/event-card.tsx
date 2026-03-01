import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {DeleteEventButton} from "./delete-event-button";

import type {EventSummary} from "@/lib/types";

export function EventCard({event}: {event: EventSummary}) {
  return (
    <Card>
      <CardHeader>
        <div className="flx items-start justify-between">
          <CardTitle>{event.event_name}</CardTitle>
          <Badge variant="default">{event.event_sport_type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>
          {new Date(event.event_start_time).toLocaleDateString()}
          {
            event.event_end_time && (
              <span> - {new Date(event.event_end_time).toLocaleDateString()}</span>
            )
          }
        </p>
        <p className="flex flex-wrap gap-2">
          {event.event_venues.length} venue{event.event_venues.length === 1 ? '' : 's'}
          {/* TODO: create venue cards and link to them */}
          {event.event_venues.map((venue) => (
            <Badge key={venue.venue_uuid}>{venue.venue_name}</Badge>
          ))}
        </p>
        <p>{event.event_description}</p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm">
            <Link href={`/events/${event.event_uuid}`}>View</Link>
          </Button>
          <DeleteEventButton event_uuid={event.event_uuid} />
        </div>
      </CardContent>
    </Card>
  )
}