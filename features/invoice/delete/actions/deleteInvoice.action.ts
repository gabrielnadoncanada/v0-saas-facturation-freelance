'use server';

import { deleteInvoice } from '@/features/invoice/delete/model/deleteInvoice';
import { INVOICES_PATH } from '@/shared/lib/routes';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
export async function deleteInvoiceAction(invoiceId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deleteInvoice(invoiceId);
    revalidatePath(INVOICES_PATH);
    redirect(INVOICES_PATH);
    return null;
  });
}
