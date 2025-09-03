'use server';

import { getAuthenticatedUser } from '@/shared/lib/drizzle/auth';
import { drizzle } from '@/shared/lib/drizzle/db';
import { organizations } from '@/shared/lib/drizzle/schema';
import { OrganizationQueries } from '@/shared/lib/drizzle/queries/OrganizationQueries';
import {
  createOrganizationSchema,
  CreateOrganizationSchema,
} from '../../shared/schema/organization.schema';
import { Result, fail } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { eq } from 'drizzle-orm';

export async function createOrganizationAction(
  data: CreateOrganizationSchema,
): Promise<Result<any>> {
  const parsed = createOrganizationSchema.safeParse(data);
  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((err) => err.message).join(', ');
    return fail(errorMessage);
  }

  return withAction(
    async () => {
      const { userId } = await getAuthenticatedUser();

      // Check if organization with slug already exists
      const existingOrg = await drizzle
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.slug, parsed.data.slug))
        .limit(1);

      if (existingOrg.length > 0) {
        throw new Error('Une organisation avec ce nom court existe déjà');
      }

      // Create the organization
      const organization = await OrganizationQueries.create({
        name: parsed.data.name,
        slug: parsed.data.slug,
        ownerId: userId,
        plan: 'free',
      });

      // Set the created organization as active
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      cookieStore.set('active_organization_id', organization.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
      });

      return organization;
    },
    { revalidatePath: '/dashboard' },
  );
}
