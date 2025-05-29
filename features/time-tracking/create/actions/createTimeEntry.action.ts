'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createTimeEntry } from '@/features/time-tracking/create/model/createTimeEntry'
import { TimeEntryFormData, TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function createTimeEntryAction(
  formData: TimeEntryFormData,
): Promise<Result<TimeEntry>> {
  return withAction(async () => {
    const entry = await createTimeEntry(formData)
    return entry
  }, { revalidatePath: '/dashboard/time-tracking', redirect: '/dashboard/time-tracking' })
}
