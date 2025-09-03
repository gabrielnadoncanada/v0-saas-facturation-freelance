'use server';

import { OrganizationQueries } from '@/shared/lib/drizzle/queries/OrganizationQueries';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getOrganizationsAction() {
  return withAction(async () => {
    const organizations = await OrganizationQueries.getUserOrganizations();
    return organizations;
  });
}
