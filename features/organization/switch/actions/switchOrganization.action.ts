'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { ActionResult } from '@/shared/types/api.types'
import { revalidatePath } from 'next/cache'

export async function switchOrganizationAction(organizationId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: "Non authentifié" }
    }
    
    // Check if user is a member of this organization
    const { data: membership, error } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('user_id', session.user.id)
      .single()
      
    if (error || !membership) {
      console.error('Error checking membership:', error)
      return { success: false, error: "Vous n'êtes pas membre de cette organisation" }
    }
    
    // Set the active organization in cookies
    const cookieStore = await import('next/headers').then(mod => mod.cookies())
    cookieStore.set('active_organization_id', organizationId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax'
    })
    
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error in switchOrganizationAction:', error)
    return { success: false, error: "Une erreur est survenue" }
  }
} 