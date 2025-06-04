'use server';

import { getTimeEntry } from '../model/getTimeEntry';
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getTimeEntryAction(entryId: string): Promise<Result<TimeEntry>> {
  return withAction(async () => {
    const entry = await getTimeEntry(entryId);
    return entry;
  });
}
