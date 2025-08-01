import { cookies } from 'next/headers';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';

export async function getSession() {
  const supabase = createServerActionClient({ cookies: () => cookies() });

  const { data } = await supabase.auth.getUser();
  return data.user;
}