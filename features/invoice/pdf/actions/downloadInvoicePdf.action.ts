'use server';

import { generateInvoicePdf } from '@/features/invoice/pdf/model/generateInvoicePdf';

export async function downloadInvoicePdfAction(invoiceId: string): Promise<Response> {
  const { buffer, invoiceNumber } = await generateInvoicePdf(invoiceId);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${invoiceNumber}.pdf`,
    },
  });
}
