import { EventForm } from "@/components/events/event-form";
import { getVenues } from "@/lib/actions/events";

export default async function NewEventPage() {
  const result = await getVenues();
  const venues = result.success ? result.data : [];
  return (
    <div className="container text-white mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Create Event</h1>
      <EventForm venues={venues} />
    </div>
  );
}
