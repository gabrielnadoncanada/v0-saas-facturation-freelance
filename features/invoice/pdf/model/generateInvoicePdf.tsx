import { renderToStream } from '@react-pdf/renderer';
import InvoicePdfView from '../ui/InvoicePdfView';
import { getInvoice } from '@/features/invoice/view/model/getInvoice';
import { getInvoiceItems } from '@/features/invoice/view/model/getInvoiceItems';

export async function generateInvoicePdf(
  invoiceId: string,
): Promise<{ buffer: Buffer; invoiceNumber: string }> {
  const invoice = await getInvoice(invoiceId);
  const items = await getInvoiceItems(invoiceId);

  // Ensure dates are strings
  const issue_date =
    typeof invoice.issue_date === 'string'
      ? invoice.issue_date
      : invoice.issue_date.toISOString().slice(0, 10);
  const due_date =
    typeof invoice.due_date === 'string'
      ? invoice.due_date
      : invoice.due_date.toISOString().slice(0, 10);

  // Use renderToStream for Node.js
  const stream = await renderToStream(
    <InvoicePdfView invoice={{ ...invoice, issue_date, due_date }} items={items} />,
  );
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });

  return { buffer, invoiceNumber: invoice.invoice_number };
}
