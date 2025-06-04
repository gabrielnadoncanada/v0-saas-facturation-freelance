'use server';

import { createInvoice } from '@/features/invoice/create/model/createInvoice';
import { createInvoiceItems } from '@/features/invoice/create/model/createInvoiceItems';
import { Invoice, InvoiceItem } from '@/features/invoice/shared/types/invoice.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { INVOICES_PATH } from '@/shared/lib/routes';
import { revalidatePath } from 'next/cache';

export async function createInvoiceAction(
  formData: Invoice,
  items: InvoiceItem[],
): Promise<Result<null>> {
  return withAction(async () => {
    const invoiceId = await createInvoice(formData);
    await createInvoiceItems(invoiceId, items, formData.tax_rate);
    revalidatePath(INVOICES_PATH);
    return null;
  });
}
