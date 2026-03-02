'use server';

import {redirect} from 'next/navigation';
import {createClient} from '@/lib/supabase/server';
import {actionClient} from '@/lib/actions/action-client';

export async function login(values: {email: string, password: string}) {
  return actionClient(async () => {
    const sb = await createClient();
    const {error} = await sb.auth.signInWithPassword(values);
    if(error) {
      throw error;
    }
    redirect('/dashboard');
  });
}

export async function signup(values: {email: string, password: string}) {
  return actionClient(async () => {
    const sb = await createClient();
    const {error} = await sb.auth.signUp(values);
    if(error) {
      throw error;
    }
    redirect('/dashboard');
  });
}

export async function logout() {
  return actionClient(async () => {
    const sb = await createClient();
    await sb.auth.signOut();
    redirect('/login');
  });
}