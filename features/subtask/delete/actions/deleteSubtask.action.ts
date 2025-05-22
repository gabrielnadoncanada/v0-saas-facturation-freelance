'use server'

import { deleteSubtask } from '@/features/subtask/delete/model/deleteSubtask'
import { TaskActionResult } from '@/features/task/shared/types/task.types'
import { revalidatePath } from 'next/cache'

export async function deleteSubtaskAction(subtaskId: string): Promise<TaskActionResult> {
  try {
    const { projectId } = await deleteSubtask(subtaskId)
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
