'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { ActionResult } from '@/shared/types/api.types'
import { Organization } from '@/shared/types/organization.types'
import { revalidatePath } from 'next/cache'

interface CreateOrganizationData {
  name: string;
  slug: string;
}

export async function createOrganizationAction(data: CreateOrganizationData): Promise<ActionResult<Organization>> {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { success: false, error: "Non authentifié" }
    }
    
    // Check if organization with slug already exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', data.slug)
      .single()
      
    if (existingOrg) {
      return { success: false, error: "Une organisation avec ce nom court existe déjà" }
    }
    
    // Create the organization
    const { data: organization, error } = await supabase
      .from('organizations')
      .insert({
        name: data.name,
        slug: data.slug,
        owner_id: session.user.id,
        plan: 'free'
      })
      .select('*')
      .single()
      
    if (error) {
      console.error('Error creating organization:', error)
      return { success: false, error: "Erreur lors de la création de l'organisation" }
    }
    
    // Add the creator as an owner
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organization.id,
        user_id: session.user.id,
        role: 'owner'
      })
      
    if (memberError) {
      console.error('Error adding member:', memberError)
      return { success: false, error: "Erreur lors de l'ajout du membre" }
    }
    
    // Set the created organization as active
    const cookieStore = await import('next/headers').then(mod => mod.cookies())
    cookieStore.set('active_organization_id', organization.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax'
    })
    
    revalidatePath('/dashboard')
    
    return { success: true, data: organization }
  } catch (error) {
    console.error('Error in createOrganizationAction:', error)
    return { success: false, error: "Une erreur est survenue" }
  }
} 