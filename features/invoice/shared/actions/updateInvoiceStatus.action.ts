'use server';

import { revalidatePath } from 'next/cache';
import { updateInvoiceStatus } from '@/features/invoice/shared/model/updateInvoiceStatus';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { INVOICES_PATH } from '@/shared/lib/routes';
export async function updateInvoiceStatusAction(
  invoiceId: string,
  status: string,
): Promise<Result<Invoice>> {
  return withAction(async () => {
    const invoice = await updateInvoiceStatus(invoiceId, status);
    revalidatePath(INVOICES_PATH);
    return invoice;
  });
}
