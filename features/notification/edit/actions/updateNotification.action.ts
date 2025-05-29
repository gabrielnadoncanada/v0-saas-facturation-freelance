'use server'

import { updateNotification } from '@/features/notification/edit/model/updateNotification'
import { DbNotification } from '@/features/notification/shared/types/notification.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function updateNotificationAction(
  id: string,
  data: Partial<DbNotification>,
): Promise<Result<DbNotification>> {
  return withAction(async () => {
    const notification = await updateNotification(id, data)
    return notification
  })
}
