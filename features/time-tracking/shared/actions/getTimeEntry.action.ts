'use server'

import { getTimeEntry } from '../model/getTimeEntry'
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'
import { Result, success, fail } from '@/shared/utils/result'

export async function getTimeEntryAction(entryId: string): Promise<Result<TimeEntry>> {
  try {
    const entry = await getTimeEntry(entryId)
    return success(entry)
  } catch (error) {
    return fail((error as Error).message)
  }
}
