'use server';

import { OrganizationInvitationQueries } from '@/shared/lib/drizzle/queries/OrganizationInvitationQueries';
import {
  inviteToOrganizationSchema,
  InviteToOrganizationSchema,
} from '@/features/organization/shared/schema/organization.schema';
import { getSessionUserAndOrganization } from '@/shared/lib/drizzle/queries/OrganizationHelpers';
import { Result, fail } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function inviteToOrganizationAction(
  data: InviteToOrganizationSchema,
): Promise<Result<null>> {
  const parsed = inviteToOrganizationSchema.safeParse(data);
  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((err) => err.message).join(', ');
    return fail(errorMessage);
  }

  return withAction(async () => {
    const { organization } = await getSessionUserAndOrganization();

    if (!organization) {
      throw new Error('Aucune organisation active');
    }

    // Check if user is already a member
    const isMember = await OrganizationInvitationQueries.checkExistingMember(
      organization.id,
      parsed.data.email,
    );

    if (isMember) {
      throw new Error("Cet utilisateur est déjà membre de l'organisation");
    }

    // Check if invitation already exists
    const hasInvitation = await OrganizationInvitationQueries.checkExistingInvitation(
      organization.id,
      parsed.data.email,
    );

    if (hasInvitation) {
      throw new Error('Une invitation a déjà été envoyée à cet email');
    }

    // Create invitation
    await OrganizationInvitationQueries.create(
      organization.id,
      parsed.data.email,
      parsed.data.role,
    );

    // TODO: Send email with invitation link
    // This would typically use an email service like SendGrid, Postmark, etc.

    return null;
  });
}
