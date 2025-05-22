'use server'

import { deleteTimeEntry } from '../model/deleteTimeEntry'
import { Result, success, fail } from '@/shared/utils/result'
import { revalidatePath } from 'next/cache'

export async function deleteTimeEntryAction(entryId: string): Promise<Result<null>> {
  try {
    await deleteTimeEntry(entryId)
    revalidatePath('/dashboard/time-tracking')
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
