'use server'

import { revalidatePath } from 'next/cache'
import { updateTimeEntry } from '@/features/time-tracking/edit/model/updateTimeEntry'
import { TimeEntryFormData } from '@/features/time-tracking/shared/types/timeEntry.types'
import { Result, fail, success } from '@/shared/utils/result'

export async function updateTimeEntryAction(
  entryId: string,
  formData: TimeEntryFormData,
): Promise<Result<null>> {
  try {
    await updateTimeEntry(entryId, formData)
    revalidatePath('/dashboard/time-tracking')
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
