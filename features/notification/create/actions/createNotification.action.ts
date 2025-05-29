'use server'

import { createNotification } from '@/features/notification/create/model/createNotification'
import { NotificationFormData, DbNotification } from '@/features/notification/shared/types/notification.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function createNotificationAction(
  data: NotificationFormData,
): Promise<Result<DbNotification>> {
  return withAction(async () => {
    const notification = await createNotification(data)
    return notification
  })
}
