'use server';

import { deletePayment } from '@/features/payment/delete/model/deletePayment';
import { revalidatePath } from 'next/cache';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { PAYMENTS_PATH, INVOICES_PATH } from '@/shared/lib/routes';
export async function deletePaymentAndUpdateInvoiceAction(
  paymentId: string,
): Promise<Result<null>> {
  return withAction(async () => {
    await deletePayment(paymentId);
    revalidatePath(PAYMENTS_PATH);
    revalidatePath(INVOICES_PATH);
    return null;
  });
}
