'use server'

import { getNotifications } from '@/features/notification/list/model/getNotifications'
import { DbNotification } from '@/features/notification/shared/types/notification.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function getNotificationsAction(): Promise<Result<DbNotification[]>> {
  return withAction(async () => {
    const notifications = await getNotifications()
    return notifications
  })
}
