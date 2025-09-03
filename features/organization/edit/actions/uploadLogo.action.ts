'use server';

import { getSessionUserAndOrganization } from '@/shared/lib/drizzle/queries/OrganizationHelpers';
import { OrganizationQueries } from '@/shared/lib/drizzle/queries/OrganizationQueries';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function uploadLogoAction(formData: FormData): Promise<Result<string>> {
  return withAction(async () => {
    const { supabase, organization } = await getSessionUserAndOrganization();

    if (!organization) throw new Error('Aucune organisation active');

    const file = formData.get('logo') as File;
    if (!file) throw new Error('Aucun fichier fourni');
    if (!file.type.startsWith('image/')) throw new Error('Le fichier doit être une image');
    if (file.size > 2 * 1024 * 1024) throw new Error('Le fichier ne doit pas dépasser 2MB');

    const fileExt = file.name.split('.').pop();
    const fileName = `${organization.id}/logo-${Date.now()}.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('organization-logos')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw new Error(`Erreur upload: ${uploadError.message}`);

    // Get public URL
    const { data: urlData } = supabase.storage.from('organization-logos').getPublicUrl(fileName);

    const logoUrl = urlData.publicUrl;

    // Update organization in database
    await OrganizationQueries.updateLogo(organization.id, logoUrl);

    return logoUrl;
  });
}
