import { getSessionUser } from '@/shared/utils/getSessionUser';
import { OrganizationSettingsSchema } from '../schema/organization-settings.schema';

export async function updateOrganizationSettings(formData: OrganizationSettingsSchema): Promise<void> {
  try {
    const { supabase, organization } = await getSessionUser();

    if (!organization) {
      throw new Error('Aucune organisation active');
    }

    // Check if settings exist
    const { data: existingSettings } = await supabase
      .from('organization_settings')
      .select('id')
      .eq('organization_id', organization.id)
      .maybeSingle();

    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from('organization_settings')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('organization_id', organization.id);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      // Create new settings
      const { error } = await supabase
        .from('organization_settings')
        .insert({
          ...formData,
          organization_id: organization.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    console.error('Error in updateOrganizationSettings:', error);
    throw error;
  }
} 