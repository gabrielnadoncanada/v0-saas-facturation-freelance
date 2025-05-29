'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TIME_TRACKING_PATH } from '@/shared/lib/routes'
import { createTimeEntry } from '@/features/time-tracking/create/model/createTimeEntry'
import { TimeEntryFormData, TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'
import { Result, fail } from '@/shared/utils/result'

export async function createTimeEntryAction(
  formData: TimeEntryFormData,
): Promise<Result<TimeEntry>> {
  try {
    const entry = await createTimeEntry(formData)
    revalidatePath(TIME_TRACKING_PATH)
    redirect(TIME_TRACKING_PATH)
  } catch (error) {
    return fail((error as Error).message)
  }
}
