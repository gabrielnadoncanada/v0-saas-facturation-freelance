'use server';

import { getOrganizationSettings } from '../model/getOrganizationSettings';
import { OrganizationSettings } from '../types/organization-settings.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getOrganizationSettingsAction(): Promise<Result<OrganizationSettings | null>> {
  return withAction(async () => {
    const settings = await getOrganizationSettings();
    return settings;
  });
} 