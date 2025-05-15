'use server'

import { updateTaskInDb } from './updateTaskInDb'
import { TaskFormData, TaskActionResult } from '@/shared/types/tasks/task'
import { revalidatePath } from 'next/cache'

export async function updateTaskAction(taskId: string, formData: TaskFormData): Promise<TaskActionResult> {
  try {
    const { projectId } = await updateTaskInDb(taskId, formData)
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
