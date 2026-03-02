import Link from "next/link";
import {EventsList} from "@/components/events/events-list";
import {Button} from "@/components/ui/button";
import {SportType} from "@/lib/types";
import {SearchBar} from "@/components/events/search-bar";
import {getEvents, searchEvents} from "@/lib/actions/events";

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

  const hasFilters = !!search || !!sport_type || !!event_day;
  const result = hasFilters ? await searchEvents({search, sport_type, event_day}) : await getEvents();

  let available_dates: string[] = [];
  if(result.success) {
    available_dates = result.data
      .map(event => new Date(event.event_start_time).toISOString().split('T')[0])
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }

  const dashboardHeader = (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl text-white font-semibold">Events</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchBar available_event_dates={available_dates} />
        <Button asChild className="w-full sm:w-auto">
          <Link href="/events/new">New Event</Link>
        </Button>
      </div>
    </div>
  );

  if(!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        {dashboardHeader}
        <p className="text-destructive">Failed to load events</p>
      </div>
    );
  }

  if(!result.data.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        {dashboardHeader}
        <p className="text-muted-foreground">
          No events found.
          {hasFilters && ' Try removing some filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {dashboardHeader}
      <EventsList events={result.data} />
    </div>
  );
}
