import { createClient } from '@/shared/lib/supabase/server';
import { Organization } from '@/shared/types/organization.types';
import { redirect } from 'next/navigation';

export interface SessionContext {
  user: any;
  supabase: any;
  organization?: Organization;
  isOrgAdmin: boolean;
  isOrgOwner: boolean;
  hasOrganization: boolean;
}

interface OrganizationMembership {
  role: string;
  organization: Organization;
}

export async function getSessionUser(): Promise<SessionContext> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error('Non authentifié');
  // Get active organization from cookies or default to first organization
  const cookieStore = await import('next/headers').then((mod) => mod.cookies());
  const activeOrgId = cookieStore.get('active_organization_id')?.value;

  // Fetch organizations for this user
  const { data: memberships } = await supabase
    .from('organization_members')
    .select('organization:organizations(*), role')
    .eq('user_id', user.id);

  let organization: Organization | undefined;
  let isOrgAdmin = false;
  let isOrgOwner = false;
  let hasOrganization = !!(memberships && memberships.length > 0);

  if (hasOrganization) {
    // Convert to unknown first, then assert the type
    const typedMemberships = memberships as unknown as OrganizationMembership[];

    // If active org ID is set and user is a member, use that
    if (activeOrgId) {
      const membership = typedMemberships.find((m) => m.organization.id === activeOrgId);
      if (membership) {
        organization = membership.organization;
        isOrgAdmin = ['owner', 'admin'].includes(membership.role);
        isOrgOwner = membership.role === 'owner';
      }
    }

    // If no active org or user isn't a member of the active org, use first org
    if (!organization) {
      organization = typedMemberships[0].organization;
      isOrgAdmin = ['owner', 'admin'].includes(typedMemberships[0].role);
      isOrgOwner = typedMemberships[0].role === 'owner';

      // Set the active organization cookie to the first organization
      cookieStore.set('active_organization_id', organization.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
      });
    }
  } else {
    // If no organizations and not on the no-organization page, redirect
    const isServerComponent = typeof window === 'undefined';
    
    if (isServerComponent) {
      // Only redirect on server components (to avoid client-side errors)
      // Check if we're not already on the no-organization page
      const headers = new Headers();
      headers.set('x-pathname', '/');

      try {
        const pathname = headers.get('x-pathname');
        const isNoOrgPage = pathname === '/no-organization';
        
        if (!isNoOrgPage) {
          redirect('/no-organization');
        }
      } catch (e) {
        // Ignore error, we'll handle the redirect in middleware
      }
    }
  }

  // Set the organization context in Supabase for RLS policies
  if (organization) {
    try {
      // Set the organization_id for RLS policies
      await supabase.rpc('set_current_organization', {
        org_id: organization.id,
      });
    } catch (error: unknown) {
      // If the function doesn't exist yet, that's okay - we'll use client-side filtering
      console.warn('Unable to set current organization context', error);
    }
  }

  return {
    user: user,
    supabase,
    organization,
    isOrgAdmin,
    isOrgOwner,
    hasOrganization,
  };
}
