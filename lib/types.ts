// ─── Action Result ────────────────────────────────────────────────────────────
// Generic wrapper for all server action return values.
// Use this to enforce consistent success/error shape across the app.

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Domain Types ─────────────────────────────────────────────────────────────

export const SPORT_TYPES = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Baseball",
  "Football",
  "Hockey",
  "Volleyball",
  "Handball",
  "Rugby",
  "Golf",
  "Other",
] as const;

export type SportType = typeof SPORT_TYPES[number];

export type Venue = {
  venue_id: string;
  venue_name: string;
  venue_description: string | null;
  venue_street_1: string;
  venue_street_2: string | null;
  venue_city: string;
  venue_state: string;
  venue_zip: string;
  venue_created: string;
  venue_updated: string;
  create_user_id: string;
  update_user_id: string; // really only tracks the last person to modify
  archived: string | null;
};

export type Event = {
  event_id: string;
  event_name: string;
  event_description: string | null;
  event_start_time: string;
  event_end_time: string;
  event_sport_type: SportType;
  event_created: string;
  event_updated: string;
  create_user_id: string;
  update_user_id: string; // really only tracks the last person to modify
  event_venues: Venue[];
  archived: string | null;
};

// Lighter shape used on the dashboard list (no full venue details needed)
export type EventSummary = Omit<Event, "event_venues"> & {
  event_venues: Pick<Venue, "venue_id" | "venue_name">[];
};
