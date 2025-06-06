import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Project } from '@/features/project/shared/types/project.types';
import { fetchList } from '@/shared/services/supabase/crud';

export async function getProjects(): Promise<Project[]> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    return [];
  }

  return await fetchList<Project>(
    supabase,
    'projects',
    '*, clients(name)',
    { organization_id: organization.id },
    { column: 'created_at', ascending: false },
  );
}
