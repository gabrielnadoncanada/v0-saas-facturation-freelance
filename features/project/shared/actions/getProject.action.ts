'use server';

import { getProjectDetails } from '@/features/project/edit/model/getProjectDetails';
import { Project } from '@/features/project/shared/types/project.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getProjectAction(projectId: string): Promise<Result<Project>> {
  return withAction(async () => {
    const project = await getProjectDetails(projectId);
    return project;
  });
}
