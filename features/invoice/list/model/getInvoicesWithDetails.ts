import { getSessionUserDrizzle } from '@/shared/utils/getSessionUserDrizzle';
import { db } from '@/shared/lib/drizzle/db';
import { invoices, invoiceItems, payments, clients } from '@/shared/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import { InvoiceWithItems } from '@/shared/lib/drizzle/types';

export async function getInvoicesWithDetails(): Promise<InvoiceWithItems[]> {
  const { organization } = await getSessionUserDrizzle();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  // Using Drizzle's relational queries
  const invoicesWithDetails = await db.query.invoices.findMany({
    where: eq(invoices.organizationId, organization.id),
    with: {
      items: true,
      payments: true,
      client: true,
    },
    orderBy: (invoices, { desc }) => [desc(invoices.createdAt)],
  });

  return invoicesWithDetails as InvoiceWithItems[];
}
