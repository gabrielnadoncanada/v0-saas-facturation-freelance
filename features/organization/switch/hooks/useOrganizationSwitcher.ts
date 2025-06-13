'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/client';
import { switchOrganizationAction } from '../actions/switchOrganization.action';
import { OrganizationWithRole } from '../../list/model/getOrganizations';

export function useOrganizationSwitcher() {
  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          role,
          organization:organizations(
            id,
            name,
            slug,
            owner_id,
            plan,
            logo_url,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching organizations:', error);
        return;
      }

      const transformedData = data?.map((item: any) => ({
        ...item.organization,
        role: item.role,
      })) || [];

      setOrganizations(transformedData);
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