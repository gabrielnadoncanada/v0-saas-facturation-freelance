'use server';

import { updateProject } from '@/features/project/edit/model/updateProject';
import { ProjectFormData } from '@/features/project/shared/types/project.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function updateProjectAction(
  projectId: string,
  formData: ProjectFormData,
): Promise<Result<null>> {
  return withAction(async () => {
    await updateProject(projectId, formData);
    return null;
  });
}
