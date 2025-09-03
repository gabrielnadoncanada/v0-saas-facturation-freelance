import { getSessionUserAndOrganization } from '@/shared/lib/drizzle/queries/OrganizationHelpers';
import { OrganizationSwitcher } from '@/features/organization/switch/ui/OrganizationSwitcher';

interface OrganizationSwitcherWrapperProps {
  className?: string;
}

export async function OrganizationSwitcherWrapper({ className }: OrganizationSwitcherWrapperProps) {
  try {
    const { organization } = await getSessionUserAndOrganization();

    return <OrganizationSwitcher currentOrganization={organization} className={className} />;
  } catch (error) {
    // If there's an error getting the session (e.g., user not authenticated),
    // return null or a fallback component
    return null;
  }
}
