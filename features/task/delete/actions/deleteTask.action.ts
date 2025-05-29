
'use server'

import { deleteTask } from "@/features/task/delete/model/deleteTask"
import { TaskActionResult } from '@/features/task/shared/types/task.types'
import { revalidatePath } from 'next/cache'
import { projectPath } from '@/shared/lib/routes'

export async function deleteTaskAction(taskId: string): Promise<TaskActionResult> {
  try {
    const { projectId } = await deleteTask(taskId)
    revalidatePath(projectPath(projectId))
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
