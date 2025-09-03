import { getAuthenticatedUser } from '@/shared/lib/drizzle/auth';
import { drizzle } from '@/shared/lib/drizzle/db';
import { organizationInvitations, organizationMembers } from '@/shared/lib/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export class OrganizationInvitationQueries {
  static async checkExistingMember(organizationId: string, email: string) {
    // Pour vérifier si un utilisateur avec cet email est déjà membre,
    // nous devons faire une jointure avec les profils/utilisateurs
    // Pour l'instant, on suppose que cette vérification sera faite côté business logic
    // ou nous pourrions ajouter une jointure avec la table des utilisateurs/profils

    // TODO: Implémenter la vérification avec jointure vers la table profiles/users
    // Pour l'instant, on retourne false pour éviter l'erreur
    return false;
  }

  static async checkExistingInvitation(organizationId: string, email: string) {
    const existing = await drizzle
      .select({ id: organizationInvitations.id })
      .from(organizationInvitations)
      .where(
        and(
          eq(organizationInvitations.organizationId, organizationId),
          eq(organizationInvitations.email, email),
        ),
      )
      .limit(1);

    return existing.length > 0;
  }

  static async create(organizationId: string, email: string, role: string) {
    const { userId } = await getAuthenticatedUser();

    // Verify user is admin of organization
    const membership = await drizzle
      .select({ role: organizationMembers.role })
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          eq(organizationMembers.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!membership.length || !['owner', 'admin'].includes(membership[0].role)) {
      throw new Error("Vous n'avez pas les droits nécessaires");
    }

    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    const [invitation] = await drizzle
      .insert(organizationInvitations)
      .values({
        organizationId,
        email,
        role,
        token,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return invitation;
  }
}
