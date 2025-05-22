'use server'

import { markAllNotificationsRead } from '@/features/notification/edit/model/markAllRead'
import { fail, Result, success } from '@/shared/utils/result'

export async function markAllNotificationsReadAction(): Promise<Result<null>> {
  try {
    await markAllNotificationsRead()
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
