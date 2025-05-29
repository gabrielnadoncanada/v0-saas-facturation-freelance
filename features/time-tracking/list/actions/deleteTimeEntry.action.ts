'use server'

import { deleteTimeEntry } from '../model/deleteTimeEntry'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { revalidatePath } from 'next/cache'
import { TIME_TRACKING_PATH } from '@/shared/lib/routes'

export async function deleteTimeEntryAction(entryId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deleteTimeEntry(entryId)
    revalidatePath(TIME_TRACKING_PATH)
    return null
  })
}
