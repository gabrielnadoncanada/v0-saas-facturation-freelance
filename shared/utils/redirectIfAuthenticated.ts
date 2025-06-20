import { createClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function redirectIfAuthenticated(path = '/dashboard') {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(path);
  }
}
