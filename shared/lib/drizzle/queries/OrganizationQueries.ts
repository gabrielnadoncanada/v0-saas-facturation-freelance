import { getAuthenticatedUser } from '@/shared/lib/drizzle/auth';
import { drizzle } from '@/shared/lib/drizzle/db';
import { organizations, organizationMembers } from '@/shared/lib/drizzle/schema';
import { eq, and } from 'drizzle-orm';

export interface OrganizationWithRole {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: string;
  logoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

export class OrganizationQueries {
  static async getUserOrganizations(): Promise<OrganizationWithRole[]> {
    const { userId } = await getAuthenticatedUser();

    const result = await drizzle
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        ownerId: organizations.ownerId,
        plan: organizations.plan,
        logoUrl: organizations.logoUrl,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
        role: organizationMembers.role,
      })
      .from(organizationMembers)
      .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
      .where(eq(organizationMembers.userId, userId));

    return result;
  }

  static async getById(organizationId: string) {
    const { userId } = await getAuthenticatedUser();

    // Verify user is member of organization
    const membership = await drizzle
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          eq(organizationMembers.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!membership.length) {
      throw new Error("Vous n'êtes pas membre de cette organisation");
    }

    const result = await drizzle
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    return result[0] || null;
  }

  static async checkMembership(organizationId: string, userId: string) {
    const membership = await drizzle
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          eq(organizationMembers.organizationId, organizationId),
        ),
      )
      .limit(1);

    return membership.length > 0;
  }

  static async create(data: { name: string; slug: string; ownerId: string; plan?: string }) {
    const [organization] = await drizzle
      .insert(organizations)
      .values({
        name: data.name,
        slug: data.slug,
        ownerId: data.ownerId,
        plan: data.plan || 'free',
      })
      .returning();

    // Add creator as owner
    await drizzle.insert(organizationMembers).values({
      organizationId: organization.id,
      userId: data.ownerId,
      role: 'owner',
    });

    return organization;
  }

  static async updateLogo(organizationId: string, logoUrl: string | null) {
    const { userId } = await getAuthenticatedUser();

    // Verify user is member of organization
    const membership = await drizzle
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          eq(organizationMembers.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!membership.length) {
      throw new Error("Vous n'êtes pas membre de cette organisation");
    }

    const [updated] = await drizzle
      .update(organizations)
      .set({
        logoUrl,
      })
      .where(eq(organizations.id, organizationId))
      .returning();

    return updated;
  }
}
