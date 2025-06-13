'use server';

import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { updateRecord } from '@/shared/services/supabase/crud';

export async function deleteLogoAction(): Promise<Result<null>> {
  return withAction(async () => {
    const { supabase, organization } = await getSessionUser();

    if (!organization) {
      throw new Error('Aucune organisation active');
    }

    // If there's a current logo, delete it from storage
    if (organization.logo_url) {
      // Extract the file path from the URL
      const url = new URL(organization.logo_url);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${organization.id}/${fileName}`;

      // Delete from Supabase Storage
      const { error: deleteError } = await supabase.storage
        .from('organization-logos')
        .remove([filePath]);

      if (deleteError) {
        console.warn('Erreur lors de la suppression du fichier:', deleteError.message);
        // Continue anyway to clear the URL from the database
      }
    }

    // Update organization to remove logo URL
    await updateRecord(
      supabase,
      'organizations',
      organization.id,
      { logo_url: null },
      '*',
      { id: organization.id }
    );

    return null;
  });
} 