import {redirect} from 'next/navigation'
import {getEvent} from '@/lib/actions/events'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import Link from 'next/link'
import {DeleteEventButton} from '@/components/events/delete-event-button'

type Props = {
  params: Promise<{event_uuid: string}>
}

export default async function EventPage({ params }: Props) {
  const {event_uuid} = await params
  const result = await getEvent(event_uuid)

  if (!result.success) {
    redirect('/dashboard')
    return;
  }

  const event = result.data

  return (
    <div className="container text-white mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{event.event_name}</h1>
          <Badge className="mt-2">{event.event_sport_type}</Badge>
        </div>
        <div className="flex gap-2">
          <Button className="text-black" asChild variant="outline" size="sm">
            <Link href={`/events/${event.event_uuid}/edit`}>Edit</Link>
          </Button>
          <DeleteEventButton event_uuid={event.event_uuid} />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Start</p>
          <p>{new Date(event.event_start_time).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">End</p>
          <p>{new Date(event.event_end_time).toLocaleString()}</p>
        </div>

        {event.event_description && (
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p>{event.event_description}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground mb-2">Venues</p>
          <div className="space-y-3">
            {event.event_venues.map(({venue_uuid, venue_name}) => (
              <div key={venue_uuid} className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  {venue_name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button asChild variant="ghost">
          <Link href="/dashboard">← Back to Events</Link>
        </Button>
      </div>
    </div>
  )
}