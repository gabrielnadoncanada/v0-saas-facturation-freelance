'use server'

import { deleteNotification } from '@/features/notification/delete/model/deleteNotification'
import { DbNotification } from '@/features/notification/shared/types/notification.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function deleteNotificationAction(id: string): Promise<Result<DbNotification>> {
  try {
    const notification = await deleteNotification(id)
    return success(notification)
  } catch (error) {
    return fail((error as Error).message)
  }
}
