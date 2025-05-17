
'use server'

import { deleteTaskInDb } from './deleteTaskInDb'
import { TaskActionResult } from '@/shared/types/tasks/task'
import { revalidatePath } from 'next/cache'

export async function deleteTaskAction(taskId: string): Promise<TaskActionResult> {
  try {
    const { projectId } = await deleteTaskInDb(taskId)
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
