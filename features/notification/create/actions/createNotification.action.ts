'use server'

import { createNotification } from '@/features/notification/create/model/createNotification'
import { NotificationFormData, DbNotification } from '@/features/notification/shared/types/notification.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function createNotificationAction(
  data: NotificationFormData,
): Promise<Result<DbNotification>> {
  try {
    const notification = await createNotification(data)
    return success(notification)
  } catch (error) {
    return fail((error as Error).message)
  }
}
