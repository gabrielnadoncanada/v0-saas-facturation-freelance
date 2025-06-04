'use server';

import { getTimeEntries } from '../model/getTimeEntries';
import { TimeEntry } from '@/features/time-tracking/shared/types/timeEntry.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getTimeEntriesAction(): Promise<Result<TimeEntry[]>> {
  return withAction(async () => {
    const entries = await getTimeEntries();
    return entries;
  });
}
