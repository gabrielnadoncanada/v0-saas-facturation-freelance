'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { switchOrganizationAction } from '@/features/organization/switch/actions/switchOrganization.action';
import { getOrganizationsAction } from '@/features/organization/list/actions/getOrganizations.action';
import { OrganizationWithRole } from '@/shared/lib/drizzle/queries/OrganizationQueries';

export function useOrganizationSwitcher() {
  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const router = useRouter();

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const result = await getOrganizationsAction();
      if (result.success) {
        setOrganizations(result.data);
      } else {
        console.error('Error fetching organizations:', result.error);
      }
    } catch (error) {
      console.error('Error in fetchOrganizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchOrganization = async (organizationId: string) => {
    setSwitching(true);
    try {
      const result = await switchOrganizationAction(organizationId);
      if (result.success) {
        router.refresh();
        return true;
      } else {
        console.error('Failed to switch organization:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error switching organization:', error);
      return false;
    } finally {
      setSwitching(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    loading,
    switching,
    fetchOrganizations,
    switchOrganization,
  };
}
