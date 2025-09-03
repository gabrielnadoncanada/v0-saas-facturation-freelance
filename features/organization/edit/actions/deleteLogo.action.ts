'use server';

import { getSessionUserAndOrganization } from '@/shared/lib/drizzle/queries/OrganizationHelpers';
import { OrganizationQueries } from '@/shared/lib/drizzle/queries/OrganizationQueries';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function deleteLogoAction(): Promise<Result<null>> {
  return withAction(async () => {
    const { supabase, organization } = await getSessionUserAndOrganization();

    if (!organization) {
      throw new Error('Aucune organisation active');
    }

    // If there's a current logo, delete it from storage
    if (organization.logoUrl) {
      // Extract the file path from the URL
      const url = new URL(organization.logoUrl);
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
    await OrganizationQueries.updateLogo(organization.id, null);

    return null;
  });
}
