import { createClient } from '@/shared/lib/supabase/server'

export async function getSessionUser() {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) throw new Error('Non authentifié')

    return { user: session.user, supabase }
}
