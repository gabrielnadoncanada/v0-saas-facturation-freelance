'use server';

import { markAllNotificationsRead } from '@/features/notification/edit/model/markAllRead';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function markAllNotificationsReadAction(): Promise<Result<null>> {
  return withAction(async () => {
    await markAllNotificationsRead();
    return null;
  });
}
