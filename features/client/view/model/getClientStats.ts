import { Invoice } from '@/features/invoice/shared/types/invoice.types';

export interface ClientStats {
  totalInvoiced: number;
  totalPaid: number;
  totalUnpaid: number;
  paidPercentage: number;
  averageInvoiceAmount: number;
  invoiceCount: number;
  paidInvoiceCount: number;
  unpaidInvoiceCount: number;
}

export function calculateClientStats(invoices: Invoice[]): ClientStats {
  // Si aucune facture, retourner des statistiques à zéro
  if (!invoices || invoices.length === 0) {
    return {
      totalInvoiced: 0,
      totalPaid: 0,
      totalUnpaid: 0,
      paidPercentage: 0,
      averageInvoiceAmount: 0,
      invoiceCount: 0,
      paidInvoiceCount: 0,
      unpaidInvoiceCount: 0,
    };
  }

  const invoiceCount = invoices.length;
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.total, 0);

  // Calculer le montant total payé en additionnant tous les paiements
  const totalPaid = invoices.reduce((sum, invoice) => {
    const invoicePayments = invoice.payments || [];
    return sum + invoicePayments.reduce((paymentSum, payment) => paymentSum + payment.amount, 0);
  }, 0);

  const totalUnpaid = totalInvoiced - totalPaid;

  // Compter le nombre de factures payées (où le total des paiements égale le total de la facture)
  const paidInvoiceCount = invoices.filter((invoice) => {
    const invoicePayments = invoice.payments || [];
    const invoiceTotalPaid = invoicePayments.reduce((sum, payment) => sum + payment.amount, 0);
    return Math.abs(invoiceTotalPaid - invoice.total) < 0.01; // Tolérance pour les erreurs d'arrondi
  }).length;

  const unpaidInvoiceCount = invoiceCount - paidInvoiceCount;
  const paidPercentage = invoiceCount ? (paidInvoiceCount / invoiceCount) * 100 : 0;
  const averageInvoiceAmount = invoiceCount ? totalInvoiced / invoiceCount : 0;

  return {
    totalInvoiced,
    totalPaid,
    totalUnpaid,
    paidPercentage,
    averageInvoiceAmount,
    invoiceCount,
    paidInvoiceCount,
    unpaidInvoiceCount,
  };
}
