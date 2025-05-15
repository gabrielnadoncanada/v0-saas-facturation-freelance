'use server'

import { createTaskInDb } from './createTaskInDb'
import { TaskFormData, TaskActionResult } from '@/shared/types/tasks/task'
import { revalidatePath } from 'next/cache'

export async function createTaskAction(projectId: string, formData: TaskFormData): Promise<TaskActionResult> {
  try {
    const task = await createTaskInDb(projectId, formData)
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, task }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
