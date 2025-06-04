'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { ActionResult } from '@/shared/types/api.types'
import { OrganizationRole } from '@/shared/types/organization.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { randomUUID } from 'crypto'

interface InviteData {
  email: string;
  role: OrganizationRole;
}

export async function inviteToOrganizationAction(data: InviteData): Promise<ActionResult> {
  try {
    const { user, supabase, organization, isOrgAdmin } = await getSessionUser()
    
    if (!organization) {
      return { success: false, error: "Aucune organisation active" }
    }
    
    if (!isOrgAdmin) {
      return { success: false, error: "Vous n'avez pas les droits nécessaires" }
    }
    
    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organization.id)
      .eq('email', data.email)
      .maybeSingle()
      
    if (existingMember) {
      return { success: false, error: "Cet utilisateur est déjà membre de l'organisation" }
    }
    
    // Check if invitation already exists
    const { data: existingInvite } = await supabase
      .from('organization_invitations')
      .select('id')
      .eq('organization_id', organization.id)
      .eq('email', data.email)
      .maybeSingle()
      
    if (existingInvite) {
      return { success: false, error: "Une invitation a déjà été envoyée à cet email" }
    }
    
    // Create invitation
    const token = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days
    
    const { error } = await supabase
      .from('organization_invitations')
      .insert({
        organization_id: organization.id,
        email: data.email,
        role: data.role,
        token,
        expires_at: expiresAt.toISOString()
      })
      
    if (error) {
      console.error('Error creating invitation:', error)
      return { success: false, error: "Erreur lors de la création de l'invitation" }
    }
    
    // TODO: Send email with invitation link
    // This would typically use an email service like SendGrid, Postmark, etc.
    
    return { success: true }
  } catch (error) {
    console.error('Error in inviteToOrganizationAction:', error)
    return { success: false, error: "Une erreur est survenue" }
  }
} 