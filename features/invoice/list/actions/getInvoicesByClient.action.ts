'use server';

import { getInvoicesByClient } from '../model/getInvoicesByClient';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getInvoicesByClientAction(clientId: string): Promise<Result<Invoice[]>> {
  return withAction(async () => {
    const invoices = await getInvoicesByClient(clientId);
    return invoices;
  });
}
