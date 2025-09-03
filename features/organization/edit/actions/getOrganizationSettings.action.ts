'use server';

import { OrganizationSettingsQueries } from '@/shared/lib/drizzle/queries/OrganizationSettingsQueries';
import { getSessionUserAndOrganization } from '@/shared/lib/drizzle/queries/OrganizationHelpers';
import { withAction } from '@/shared/utils/withAction';

export async function getOrganizationSettingsAction() {
  return withAction(async () => {
    const { organization } = await getSessionUserAndOrganization();

    const settings = await OrganizationSettingsQueries.getByOrganizationId(organization.id);
    return settings;
  });
}
