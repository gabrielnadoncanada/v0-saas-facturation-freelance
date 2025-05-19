'use server'

import { createTask } from "@/features/task/create/model/createTask"
import { TaskFormData, TaskActionResult } from '@/features/task/shared/types/task.types'
import { revalidatePath } from 'next/cache'

export async function createTaskAction(projectId: string, formData: TaskFormData): Promise<TaskActionResult> {
  try {
    const task = await createTask(projectId, formData)
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, task }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
