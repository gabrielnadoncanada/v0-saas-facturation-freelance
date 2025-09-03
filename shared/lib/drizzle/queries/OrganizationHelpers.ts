import { createClient } from '@/shared/lib/supabase/server';

export async function getSessionUserAndOrganization() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Non authentifié');
  }

  // Get active organization from cookie
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const activeOrgId = cookieStore.get('active_organization_id')?.value;

  if (!activeOrgId) {
    throw new Error('Aucune organisation active');
  }

  // Get organization details
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', activeOrgId)
    .single();

  if (orgError || !organization) {
    throw new Error('Organisation non trouvée');
  }

  // Check if user is member
  const { data: membership, error: memberError } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', activeOrgId)
    .eq('user_id', user.id)
    .single();

  if (memberError || !membership) {
    throw new Error("Vous n'êtes pas membre de cette organisation");
  }

  const isOrgAdmin = ['owner', 'admin'].includes(membership.role);

  return {
    user,
    supabase,
    organization,
    isOrgAdmin,
  };
}
