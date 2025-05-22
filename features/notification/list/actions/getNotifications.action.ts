'use server'

import { getNotifications } from '@/features/notification/list/model/getNotifications'
import { DbNotification } from '@/features/notification/shared/types/notification.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function getNotificationsAction(): Promise<Result<DbNotification[]>> {
  try {
    const notifications = await getNotifications()
    return success(notifications)
  } catch (error) {
    return fail((error as Error).message)
  }
}
