'use server';

import { createTask } from '@/features/task/create/model/createTask';
import { Task, TaskFormData } from '@/features/task/shared/types/task.types';
import { revalidatePath } from 'next/cache';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { projectPath } from '@/shared/lib/routes';

export async function createTaskAction(
  projectId: string,
  formData: TaskFormData,
): Promise<Result<Task>> {
  return withAction(async () => {
    const task = await createTask(projectId, formData);
    revalidatePath(projectPath(projectId));
    return task;
  });
}
