'use server';

import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { getPayments } from '../model/getPayments';
import { Payment } from '@/features/payment/shared/types/payment.types';

export async function getPaymentsAction(): Promise<Result<Payment[]>> {
  return withAction(async () => {
    const payments = await getPayments();
    return payments;
  });
}
