'use server'

import { deleteNotification } from '@/features/notification/delete/model/deleteNotification'
import { DbNotification } from '@/features/notification/shared/types/notification.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function deleteNotificationAction(id: string): Promise<Result<DbNotification>> {
  return withAction(async () => {
    const notification = await deleteNotification(id)
    return notification
  })
}
