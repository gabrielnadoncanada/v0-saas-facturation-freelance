'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/client';

export function useOrganizationCheck() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkOrganization = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user has any organizations
        const { data: organizations } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
          .limit(1);

        if (!organizations || organizations.length === 0) {
          // User has no organizations, redirect to the no-organization page
          // Check we're not already on the no-organization page
          if (window.location.pathname !== '/no-organization') {
            router.push('/no-organization');
          }
        }
      }
    };

    checkOrganization();
  }, [router, supabase]);
} 