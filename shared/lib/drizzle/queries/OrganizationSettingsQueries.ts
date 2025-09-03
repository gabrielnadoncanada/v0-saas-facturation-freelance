import { getAuthenticatedUser } from '@/shared/lib/drizzle/auth';
import { drizzle } from '@/shared/lib/drizzle/db';
import { organizationSettings, organizationMembers } from '@/shared/lib/drizzle/schema';
import { eq, and } from 'drizzle-orm';

export class OrganizationSettingsQueries {
  static async getByOrganizationId(organizationId: string) {
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

    const settings = await drizzle
      .select()
      .from(organizationSettings)
      .where(eq(organizationSettings.organizationId, organizationId))
      .limit(1);

    return settings[0] || null;
  }

  static async upsert(organizationId: string, data: any) {
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

    // Check if settings exist
    const existingSettings = await drizzle
      .select({ id: organizationSettings.id })
      .from(organizationSettings)
      .where(eq(organizationSettings.organizationId, organizationId))
      .limit(1);

    const now = new Date().toISOString();

    if (existingSettings.length) {
      // Update existing settings
      const [updated] = await drizzle
        .update(organizationSettings)
        .set({
          ...data,
          updatedAt: now,
        })
        .where(eq(organizationSettings.organizationId, organizationId))
        .returning();

      return updated;
    } else {
      // Create new settings
      const [created] = await drizzle
        .insert(organizationSettings)
        .values({
          ...data,
          organizationId,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return created;
    }
  }
}
