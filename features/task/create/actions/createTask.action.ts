'use server'

import { createTask } from "@/features/task/create/model/createTask"
import { Task, TaskFormData } from '@/features/task/shared/types/task.types'
import { revalidatePath } from 'next/cache'
import { fail, Result, success } from '@/shared/utils/result'

export async function createTaskAction(projectId: string, formData: TaskFormData): Promise<Result<Task>> {
  try {
    const task = await createTask(projectId, formData)
    revalidatePath(`/dashboard/projects/${projectId}`)
    return success(task)
  } catch (error) {
    return fail((error as Error).message)
  }
}
