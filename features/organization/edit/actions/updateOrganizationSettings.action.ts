'use server';

import { OrganizationSettingsQueries } from '@/shared/lib/drizzle/queries/OrganizationSettingsQueries';
import {
  organizationSettingsSchema,
  OrganizationSettingsSchema,
} from '@/features/organization/edit/schema/organization-settings.schema';
import { Result, fail } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { getSessionUserAndOrganization } from '@/shared/lib/drizzle/queries/OrganizationHelpers';

export async function updateOrganizationSettingsAction(
  data: OrganizationSettingsSchema,
): Promise<Result<null>> {
  const parsed = organizationSettingsSchema.safeParse(data);
  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((err) => err.message).join(', ');
    return fail(errorMessage);
  }

  return withAction(
    async () => {
      const { organization } = await getSessionUserAndOrganization();

      if (!organization) {
        throw new Error('Aucune organisation active');
      }

      await OrganizationSettingsQueries.upsert(organization.id, parsed.data);
      return null;
    },
    { revalidatePath: '/dashboard/settings' },
  );
}
