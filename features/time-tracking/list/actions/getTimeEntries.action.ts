'use server'

import { getTimeEntries } from '../model/getTimeEntries'
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types'
import { Result, success, fail } from '@/shared/utils/result'

export async function getTimeEntriesAction(): Promise<Result<TimeEntry[]>> {
  try {
    const entries = await getTimeEntries()
    return success(entries)
  } catch (error) {
    return fail((error as Error).message)
  }
}
