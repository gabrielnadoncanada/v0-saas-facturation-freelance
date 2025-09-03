'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrganizationsAction } from '@/features/organization/list/actions/getOrganizations.action';

export function useOrganizationCheck() {
  const router = useRouter();

  useEffect(() => {
    const checkOrganization = async () => {
      try {
        const result = await getOrganizationsAction();

        if (result.success && result.data.length === 0) {
          // User has no organizations, redirect to the no-organization page
          // Check we're not already on the no-organization page
          if (window.location.pathname !== '/no-organization') {
            router.push('/no-organization');
          }
        }
      } catch (error) {
        // If there's an error (like user not authenticated), we don't redirect
        console.error('Error checking organizations:', error);
      }
    };

    checkOrganization();
  }, [router]);
}
