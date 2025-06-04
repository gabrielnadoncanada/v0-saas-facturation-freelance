'use server';

import { createProject } from '@/features/project/create/model/createProject';
import { Project, ProjectFormData } from '@/features/project/shared/types/project.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function createProjectAction(formData: ProjectFormData): Promise<Result<Project>> {
  return withAction(async () => {
    const project = await createProject(formData);
    return project;
  });
}
