import { getSessionUser } from '@/shared/utils/getSessionUser';
import { OrganizationSettings } from '../types/organization-settings.types';

export async function getOrganizationSettings(): Promise<OrganizationSettings | null> {
  try {
    const { supabase, organization } = await getSessionUser();

    if (!organization) {
      throw new Error('Aucune organisation active');
    }

    const { data, error } = await supabase
      .from('organization_settings')
      .select('*')
      .eq('organization_id', organization.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching organization settings:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getOrganizationSettings:', error);
    return null;
  }
} 