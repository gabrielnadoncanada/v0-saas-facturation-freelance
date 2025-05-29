'use server'

import { revalidatePath } from 'next/cache'
import { updateTimeEntry } from '@/features/time-tracking/edit/model/updateTimeEntry'
import { TimeEntryFormData } from '@/features/time-tracking/shared/types/timeEntry.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function updateTimeEntryAction(
  entryId: string,
  formData: TimeEntryFormData,
): Promise<Result<null>> {
  return withAction(async () => {
    await updateTimeEntry(entryId, formData)
    return null
  }, { revalidatePath: '/dashboard/time-tracking' })
}
