'use server';

import { updateOrganizationSettings } from '../model/updateOrganizationSettings';
import { organizationSettingsSchema, OrganizationSettingsSchema } from '../schema/organization-settings.schema';
import { revalidatePath } from 'next/cache';
import { Result, fail } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { safeParseForm } from '@/shared/utils/safeParseForm';

export async function updateOrganizationSettingsAction(data: OrganizationSettingsSchema): Promise<Result<null>> {
  const parsed = organizationSettingsSchema.safeParse(data);
  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map(err => err.message).join(', ');
    return fail(errorMessage);
  }

  return withAction(
    async () => {
      await updateOrganizationSettings(parsed.data);
      return null;
    },
    { revalidatePath: '/dashboard/settings' },
  );
} 