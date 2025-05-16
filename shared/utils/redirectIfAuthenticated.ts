import { createClient } from '@/shared/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function redirectIfAuthenticated(path = '/dashboard') {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect(path)
  }
}
