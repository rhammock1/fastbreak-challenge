import {EventForm} from "@/components/events/event-form";
import {notFound} from "next/navigation";
import {getEvent, getVenues} from "@/lib/actions/events";

type EditEventPageProps = {
  params: Promise<{event_uuid: string}>;
};

export default async function EditEventPage({params}: EditEventPageProps) {
  const {event_uuid} = await params;
  const [eventResult, venueResult] = await Promise.all([
    getEvent(event_uuid),
    getVenues(),
  ]);
  if (!eventResult.success || !venueResult.success) {
    return notFound();
  }
  const event = eventResult.data;
  const venues = venueResult.data;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Edit Event</h1>
      <EventForm event={event} venues={venues} />
    </div>
  );
}
