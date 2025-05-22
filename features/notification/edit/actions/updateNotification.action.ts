'use server'

import { updateNotification } from '@/features/notification/edit/model/updateNotification'
import { DbNotification } from '@/features/notification/shared/types/notification.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function updateNotificationAction(
  id: string,
  data: Partial<DbNotification>,
): Promise<Result<DbNotification>> {
  try {
    const notification = await updateNotification(id, data)
    return success(notification)
  } catch (error) {
    return fail((error as Error).message)
  }
}
