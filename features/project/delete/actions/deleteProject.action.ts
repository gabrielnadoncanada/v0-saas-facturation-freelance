'use server';

import { deleteProject } from '@/features/project/delete/model/deleteProject';
import { PROJECTS_PATH } from '@/shared/lib/routes';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { revalidatePath } from 'next/cache';

export async function deleteProjectAction(projectId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deleteProject(projectId);
    revalidatePath(PROJECTS_PATH);
    return null;
  });
}
