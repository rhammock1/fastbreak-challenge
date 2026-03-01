'use server';

import * as db from "../db";
import {actionClient} from "./action-client";
import {createClient} from '../supabase/server';
import type {EventFormValues} from '../validations/events';

import type {Event, EventSummary, SportType, Venue} from '../types';

async function confirmUser() {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();
  if(!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function getEvent(event_id: string) {
  return actionClient<Event>(async () => {
    const {rows: [event]} = await db.file('db/events/get_by_id_with_venues.sql', {event_id});
    if(!event) {
      throw new Error('Event not found');
    }
    return event;
  });
}

export async function getEvents() {
  return actionClient<EventSummary[]>(async () => {
    const {rows: events} = await db.file('db/events/get.sql');
    return events;
  });
}

export async function getUserCreatedEvents() {
  return actionClient<EventSummary[]>(async () => {
    const user = await confirmUser();
    const {rows: events} = await db.file('db/events/get_by_user_id.sql', {user_id: user.id});
    return events;
  });
}

export async function searchEvents({search, sport_type, event_day}: {search?: string, sport_type?: SportType, event_day?: string}) {
  return actionClient<EventSummary[]>(async () => {
    const {rows: events} = await db.file('db/events/search.sql', {
      search: search ?? null,
      sport_type: sport_type ?? null,
      event_day: event_day ?? null,
    });
    return events;
  });
}

export async function archiveEvent(event_uuid: string) {
  return actionClient<void>(async () => {
    const user = await confirmUser();
    await db.file('db/events/archive.sql', {event_uuid, user_id: user.id});
  });
}

export async function createEvent({event_name, event_description, event_sport_type, event_start_time, event_end_time, event_venues}: EventFormValues) {
  return actionClient<Event>(async () => {
    const user = await confirmUser();
    console.log('event_venues', event_venues);
    const {rows: [event]} = await db.file('db/events/put.sql', {
      event_name,
      event_description,
      event_sport_type,
      event_start_time,
      event_end_time,
      event_venues,
      create_user_id: user.id,
    });
    if(!event) {
      throw new Error('Failed to create event');
    }
    return event;
  });
}

export async function updateEvent(event_id: string, values: EventFormValues) {
  return actionClient<Event>(async () => {
    const user = await confirmUser();
    const {rows: [event]} = await db.file('db/events/patch.sql', {
      event_id,
      update_user_id: user.id,
      ...values,
    });
    if(!event) {
      throw new Error('Failed to update event');
    }
    return event;
  });
}

export async function getVenues() {
  return actionClient<Venue[]>(async () => {
    const {rows: venues} = await db.file('db/venues/get.sql');
    return venues;
  });
}