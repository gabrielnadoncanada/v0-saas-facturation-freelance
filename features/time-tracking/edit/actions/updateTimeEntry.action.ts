'use server';

import { revalidatePath } from 'next/cache';
import { updateTimeEntry } from '@/features/time-tracking/edit/model/updateTimeEntry';
import { TimeEntryFormData } from '@/features/time-tracking/shared/types/timeEntry.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { TIME_TRACKING_PATH } from '@/shared/lib/routes';

export async function updateTimeEntryAction(
  entryId: string,
  formData: TimeEntryFormData,
): Promise<Result<null>> {
  return withAction(async () => {
    await updateTimeEntry(entryId, formData);
    revalidatePath(TIME_TRACKING_PATH);
    return null;
  });
}
