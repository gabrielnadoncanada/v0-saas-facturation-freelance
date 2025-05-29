'use server'

import { deleteTimeEntry } from '../model/deleteTimeEntry'
import { Result, success, fail } from '@/shared/utils/result'
import { revalidatePath } from 'next/cache'
import { TIME_TRACKING_PATH } from '@/shared/lib/routes'

export async function deleteTimeEntryAction(entryId: string): Promise<Result<null>> {
  try {
    await deleteTimeEntry(entryId)
    revalidatePath(TIME_TRACKING_PATH)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
