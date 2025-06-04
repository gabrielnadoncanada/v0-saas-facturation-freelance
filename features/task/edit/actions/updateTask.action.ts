'use server';

import { updateTask } from '@/features/task/edit/model/updateTask';
import { TaskFormData } from '@/features/task/shared/types/task.types';
import { revalidatePath } from 'next/cache';
import { withAction } from '@/shared/utils/withAction';
import { projectPath } from '@/shared/lib/routes';
import { Result } from '@/shared/utils/result';

export async function updateTaskAction(
  taskId: string,
  formData: TaskFormData,
): Promise<Result<null>> {
  return withAction(async () => {
    const { projectId } = await updateTask(taskId, formData);
    revalidatePath(projectPath(projectId));
    return null;
  });
}
