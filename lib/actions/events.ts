'use server';

import * as db from "../db";
import {actionClient} from "./action-client";
import {createClient} from '../supabase/server';

import type {Event, EventSummary, SportType} from '../types';

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