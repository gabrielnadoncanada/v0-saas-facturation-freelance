'use server';

import { getInvoice } from '@/features/invoice/view/model/getInvoice';
import { getInvoiceItems } from '@/features/invoice/view/model/getInvoiceItems';
import { getClientsList } from '@/features/invoice/view/model/getClients';
import { getDefaultCurrency } from '@/features/invoice/view/model/getDefaultCurrency';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';
import { InvoiceDetailsProps } from '@/features/invoice/shared/types/invoice.types';

export async function getInvoiceAction(invoiceId: string): Promise<Result<InvoiceDetailsProps>> {
  return withAction(async () => {
    const invoice = await getInvoice(invoiceId);
    const invoiceItems = await getInvoiceItems(invoiceId);
    const clients = await getClientsList();
    const defaultCurrency = await getDefaultCurrency();

    return { invoice, invoiceItems, clients, defaultCurrency };
  });
}
