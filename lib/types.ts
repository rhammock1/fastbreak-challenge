// ─── Action Result ────────────────────────────────────────────────────────────
// Generic wrapper for all server action return values.
// Use this to enforce consistent success/error shape across the app.

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type SportType =
  | "Soccer"
  | "Basketball"
  | "Tennis"
  | "Baseball"
  | "Football"
  | "Hockey"
  | "Volleyball"
  | "Other";

export const SPORT_TYPES: SportType[] = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Baseball",
  "Football",
  "Hockey",
  "Volleyball",
  "Other",
];

export type Venue = {
  id: string;
  event_id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
};

export type Event = {
  id: string;
  user_id: string;
  name: string;
  sport_type: SportType;
  date_time: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  venues: Venue[];
};

// Lighter shape used on the dashboard list (no full venue details needed)
export type EventSummary = Omit<Event, "venues"> & {
  venues: Pick<Venue, "id" | "name">[];
};
