import { Organization } from '@/shared/types/organization.types';
import { getSessionUser } from '@/shared/utils/getSessionUser';

export interface OrganizationWithRole extends Organization {
  role: string;
}

export async function getOrganizations(): Promise<OrganizationWithRole[]> {
  try {
    const { supabase, user } = await getSessionUser();

    const { data, error } = await supabase
      .from('organization_members')
      .select(
        `
        role,
        organization:organizations(
          id,
          name,
          slug,
          owner_id,
          plan,
          logo_url,
          created_at,
          updated_at
        )
      `,
      )
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }

    if (!data || !data.length) {
      return [];
    }

    // Transform the data to a more usable format
    return data.map((item: any) => ({
      ...item.organization,
      role: item.role,
    }));
  } catch (error) {
    console.error('Error in getOrganizations:', error);
    return [];
  }
}
