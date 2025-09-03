import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db';
import { invoices, payments } from '../schema';
import type { Invoice, Payment } from '../types';
import { getSessionUserAndOrganization } from '@/shared/lib/drizzle/queries/OrganizationHelpers';

export class InvoiceQueries {
  // Get invoice by ID
  static async getById(id: string): Promise<Invoice | null> {
    const result = await db.select().from(invoices).where(eq(invoices.id, id));
    return result[0] || null;
  }

  // Get invoices by client ID with payments
  static async getByClientId(clientId: string) {
    const { organization } = await getSessionUserAndOrganization();

    if (!organization) {
      return [];
    }

    return await db.query.invoices.findMany({
      where: and(eq(invoices.clientId, clientId), eq(invoices.organizationId, organization.id)),
      with: {
        payments: true,
      },
      orderBy: desc(invoices.issueDate),
    });
  }

  // Update invoice by ID
  static async update(
    id: string,
    values: Partial<
      Pick<
        Invoice,
        'status' | 'notes' | 'dueDate' | 'issueDate' | 'total' | 'subtotal' | 'taxTotal' | 'taxRate'
      >
    >,
  ): Promise<Invoice | null> {
    const result = await db
      .update(invoices)
      .set(values as any)
      .where(eq(invoices.id, id))
      .returning();
    return result[0] || null;
  }
}
