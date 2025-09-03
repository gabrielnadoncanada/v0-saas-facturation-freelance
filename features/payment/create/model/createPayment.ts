import { getSessionUserDrizzle } from '@/shared/utils/getSessionUserDrizzle';
import { PaymentFormData } from '@/features/payment/shared/types/payment.types';
import { Invoice } from '@/features/invoice/shared/types/invoice.types';
import { InvoiceQueries } from '@/shared/lib/drizzle/queries/InvoiceQueries';
import { PaymentQueries } from '@/shared/lib/drizzle/queries/PaymentQueries';
import { NewPayment } from '@/shared/lib/drizzle/types';
import { db } from '@/shared/lib/drizzle/db';
import { payments } from '@/shared/lib/drizzle/schema';
import { eq, sum } from 'drizzle-orm';

export async function createPayment(formData: PaymentFormData): Promise<void> {
  const { organization } = await getSessionUserDrizzle();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  // 1. Vérifier que la facture appartient bien à l'utilisateur
  const invoice = (await InvoiceQueries.getById(formData.invoice_id)) as Invoice | null;

  if (!invoice || invoice.organizationId !== organization.id) {
    throw new Error('Facture introuvable ou non autorisée');
  }

  // 2. Créer le paiement
  const paymentData: NewPayment = {
    invoiceId: formData.invoice_id,
    amount: formData.amount.toString(),
    paymentDate: formData.payment_date.toISOString().split('T')[0],
    paymentMethod: formData.payment_method,
    notes: formData.notes,
    organizationId: organization.id,
  };

  await PaymentQueries.create(paymentData);

  // 3. Calculer le total payé avec Drizzle
  const [totalPaidResult] = await db
    .select({ total: sum(payments.amount) })
    .from(payments)
    .where(eq(payments.invoiceId, formData.invoice_id));

  const totalPaid = Number(totalPaidResult?.total || 0);

  // 4. Si la facture est payée, update le statut en "paid" (sinon ne fais rien)
  if (totalPaid >= Number(invoice.total)) {
    await InvoiceQueries.update(formData.invoice_id, { status: 'paid' });
  }
}
