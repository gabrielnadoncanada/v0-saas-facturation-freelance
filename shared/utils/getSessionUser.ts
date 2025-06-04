import { createClient } from '@/shared/lib/supabase/server'
import { Organization } from '@/shared/types/organization.types'

export interface SessionContext {
    user: any;
    supabase: any;
    organization?: Organization;
    isOrgAdmin: boolean;
    isOrgOwner: boolean;
}

interface OrganizationMembership {
    role: string;
    organization: Organization;
}

export async function getSessionUser(): Promise<SessionContext> {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) throw new Error('Non authentifié')
    
    // Get active organization from cookies or default to first organization
    const cookieStore = await import('next/headers').then(mod => mod.cookies())
    const activeOrgId = cookieStore.get('active_organization_id')?.value
    
    // Fetch organizations for this user
    const { data: memberships } = await supabase
        .from('organization_members')
        .select('organization:organizations(*), role')
        .eq('user_id', session.user.id)
    
    let organization: Organization | undefined
    let isOrgAdmin = false
    let isOrgOwner = false
    
    if (memberships && memberships.length > 0) {
        // Convert to unknown first, then assert the type
        const typedMemberships = memberships as unknown as OrganizationMembership[]
        
        // If active org ID is set and user is a member, use that
        if (activeOrgId) {
            const membership = typedMemberships.find(m => m.organization.id === activeOrgId)
            if (membership) {
                organization = membership.organization
                isOrgAdmin = ['owner', 'admin'].includes(membership.role)
                isOrgOwner = membership.role === 'owner'
            }
        }
        
        // If no active org or user isn't a member of the active org, use first org
        if (!organization) {
            organization = typedMemberships[0].organization
            isOrgAdmin = ['owner', 'admin'].includes(typedMemberships[0].role)
            isOrgOwner = typedMemberships[0].role === 'owner'
        }
    }

    // Set the organization context in Supabase for RLS policies
    if (organization) {
        try {
            // Set the organization_id for RLS policies
            await supabase.rpc('set_current_organization', {
                org_id: organization.id
            });
        } catch (error: unknown) {
            // If the function doesn't exist yet, that's okay - we'll use client-side filtering
            console.warn('Unable to set current organization context', error);
        }
    }

    return { 
        user: session.user, 
        supabase,
        organization,
        isOrgAdmin,
        isOrgOwner
    }
}
