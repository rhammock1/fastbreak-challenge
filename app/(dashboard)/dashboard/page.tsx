import Link from "next/link";
import {EventsList} from "@/components/events/events-list";
import {Button} from "@/components/ui/button";
import {SportType} from "@/lib/types";
import {SearchBar} from "@/components/events/search-bar";

// Search params are passed by the browser when the user filters/searches.
// We pass them to the server action so the query is always server-side.
type DashboardPageProps = {
  searchParams: Promise<{
    search?: string;
    sport_type?: SportType;
    event_day?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { search, sport_type, event_day } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <div className="flex items-center gap-2">
          {/* TODO: implement search - add filters for sport type and calendar date */}
          <SearchBar />
          <Button asChild>
            <Link href="/events/new">New Event</Link>
          </Button>
        </div>
      </div>

      <EventsList search={search} sport_type={sport_type} event_day={event_day} />
    </div>
  );
}
