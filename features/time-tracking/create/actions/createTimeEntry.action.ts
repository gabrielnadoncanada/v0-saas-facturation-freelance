'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createTimeEntry } from '@/features/time-tracking/create/model/createTimeEntry'
import { TimeEntryFormData, TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'
import { Result, fail } from '@/shared/utils/result'

export async function createTimeEntryAction(
  formData: TimeEntryFormData,
): Promise<Result<TimeEntry>> {
  try {
    const entry = await createTimeEntry(formData)
    revalidatePath('/dashboard/time-tracking')
    redirect('/dashboard/time-tracking')
  } catch (error) {
    return fail((error as Error).message)
  }
}
