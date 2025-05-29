'use server'

import { revalidatePath } from 'next/cache'
import { TIME_TRACKING_PATH } from '@/shared/lib/routes'
import { updateTimeEntry } from '@/features/time-tracking/edit/model/updateTimeEntry'
import { TimeEntryFormData } from '@/features/time-tracking/shared/types/timeEntry.types'
import { Result, fail, success } from '@/shared/utils/result'

export async function updateTimeEntryAction(
  entryId: string,
  formData: TimeEntryFormData,
): Promise<Result<null>> {
  try {
    await updateTimeEntry(entryId, formData)
    revalidatePath(TIME_TRACKING_PATH)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
