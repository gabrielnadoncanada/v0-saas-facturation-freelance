'use server';

import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { updateRecord } from '@/shared/services/supabase/crud';

export async function uploadLogoAction(formData: FormData): Promise<Result<string>> {
  return withAction(async () => {
    const { supabase, organization } = await getSessionUser();

    if (!organization) throw new Error('Aucune organisation active');

    const file = formData.get('logo') as File;
    if (!file) throw new Error('Aucun fichier fourni');
    if (!file.type.startsWith('image/')) throw new Error('Le fichier doit être une image');
    if (file.size > 10 * 1024 * 1024) throw new Error('Le fichier ne doit pas dépasser 10MB');

    const fileExt = file.name.split('.').pop();
    const fileName = `${organization.id}/logo-${Date.now()}.${fileExt}`;

    // Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('organization-logos')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });


      console.log(uploadData)
    // Get public URL (utilise fileName au lieu de uploadData.path)
    const { data: urlData, error: urlError } = supabase.storage
      .from('organization-logos')
      .getPublicUrl(fileName);
    if (urlError) throw new Error(`Erreur génération URL: ${urlError.message}`);

    const logoUrl = urlData.publicUrl;

    // Update en base
    const updateRes = await updateRecord(
      supabase,
      'organizations',
      organization.id,
      { logo_url: logoUrl },
      '*',
      { id: organization.id }
    );
    console.log('UpdateResult:', updateRes);

    return logoUrl;
  });
}
