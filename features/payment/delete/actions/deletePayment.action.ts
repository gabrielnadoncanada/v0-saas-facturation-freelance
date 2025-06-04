'use server';

import { deletePayment } from '@/features/payment/delete/model/deletePayment';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { revalidatePath } from 'next/cache';
import { PAYMENTS_PATH } from '@/shared/lib/routes';

export async function deletePaymentAction(paymentId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deletePayment(paymentId);
    revalidatePath(PAYMENTS_PATH);
    return null;
  });
}
