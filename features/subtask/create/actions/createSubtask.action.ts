'use server';

import { createSubtask } from '@/features/subtask/create/model/createSubtask';
import { Task, TaskFormData } from '@/features/task/shared/types/task.types';
import { projectPath } from '@/shared/lib/routes';
import { fail, Result, success } from '@/shared/utils/result';
import { revalidatePath } from 'next/cache';

export async function createSubtaskAction(
  taskId: string,
  formData: TaskFormData,
): Promise<Result<Task>> {
  try {
    const { subtask, projectId } = await createSubtask(taskId, formData);
    revalidatePath(projectPath(projectId));
    return success(subtask);
  } catch (error) {
    return fail((error as Error).message);
  }
}
