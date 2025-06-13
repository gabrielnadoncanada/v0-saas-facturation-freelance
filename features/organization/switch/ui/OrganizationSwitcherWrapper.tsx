import { getSessionUser } from '@/shared/utils/getSessionUser';
import { OrganizationSwitcher } from './OrganizationSwitcher';

interface OrganizationSwitcherWrapperProps {
  className?: string;
}

export async function OrganizationSwitcherWrapper({ className }: OrganizationSwitcherWrapperProps) {
  try {
    const { organization } = await getSessionUser();
    
    return (
      <OrganizationSwitcher 
        currentOrganization={organization} 
        className={className}
      />
    );
  } catch (error) {
    // If there's an error getting the session (e.g., user not authenticated),
    // return null or a fallback component
    return null;
  }
} 