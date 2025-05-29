'use server'

import { revalidatePath } from 'next/cache'
import { createTimeEntry } from '@/features/time-tracking/create/model/createTimeEntry'
import { TimeEntryFormData } from '@/features/time-tracking/shared/types/timeEntry.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { TIME_TRACKING_PATH } from '@/shared/lib/routes'
import { redirect } from 'next/navigation'

export async function createTimeEntryAction(formData: TimeEntryFormData): Promise<Result<null>> {
  return withAction(async () => {
    await createTimeEntry(formData)
    revalidatePath(TIME_TRACKING_PATH)
    redirect(TIME_TRACKING_PATH)
    return null
  })
}
