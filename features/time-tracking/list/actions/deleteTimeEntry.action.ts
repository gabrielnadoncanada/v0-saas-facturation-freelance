'use server'

import { deleteTimeEntry } from '../model/deleteTimeEntry'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { revalidatePath } from 'next/cache'

export async function deleteTimeEntryAction(entryId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deleteTimeEntry(entryId)
    return null
  }, { revalidatePath: '/dashboard/time-tracking' })
}
