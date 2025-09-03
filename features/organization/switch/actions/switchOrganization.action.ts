'use server';

import { getAuthenticatedUser } from '@/shared/lib/drizzle/auth';
import { OrganizationQueries } from '@/shared/lib/drizzle/queries/OrganizationQueries';
import { switchOrganizationSchema } from '@/features/organization/shared/schema/organization.schema';
import { Result, fail } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function switchOrganizationAction(organizationId: string): Promise<Result<null>> {
  const parsed = switchOrganizationSchema.safeParse({ organizationId });
  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((err) => err.message).join(', ');
    return fail(errorMessage);
  }

  return withAction(
    async () => {
      const { userId } = await getAuthenticatedUser();

      // Check if user is a member of this organization
      const isMember = await OrganizationQueries.checkMembership(organizationId, userId);

      if (!isMember) {
        throw new Error("Vous n'êtes pas membre de cette organisation");
      }

      // Set the active organization in cookies
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      cookieStore.set('active_organization_id', organizationId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
      });

      return null;
    },
    { revalidatePath: '/dashboard' },
  );
}
