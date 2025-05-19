'use server'

import { updateTask } from "@/features/task/edit/model/updateTask"
import { TaskFormData, TaskActionResult } from '@/features/task/shared/types/task.types'
import { revalidatePath } from 'next/cache'

export async function updateTaskAction(taskId: string, formData: TaskFormData): Promise<TaskActionResult> {
  try {
    const { projectId } = await updateTask(taskId, formData)
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
