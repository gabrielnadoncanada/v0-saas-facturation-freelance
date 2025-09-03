export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: OrganizationPlan;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  createdAt: string;
  updatedAt: string;
}

export type OrganizationRole = 'owner' | 'admin' | 'member';
export type OrganizationPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationRole;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}
