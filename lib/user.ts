import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getUserAndRole() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { user: null, role: null };

  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return { user, role: userProfile?.role ?? null };
}
