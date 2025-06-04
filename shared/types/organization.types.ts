export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: OrganizationPlan;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  created_at: string;
  updated_at: string;
}

export type OrganizationRole = 'owner' | 'admin' | 'member';
export type OrganizationPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export interface OrganizationInvitation {
  id: string;
  organization_id: string;
  email: string;
  role: OrganizationRole;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
} 