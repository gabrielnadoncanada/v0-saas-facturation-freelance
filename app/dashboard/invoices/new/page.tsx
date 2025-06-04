import { InvoiceForm } from '@/features/invoice/shared/ui/InvoiceForm';
import { getClients } from '@/features/client/list/model/getClients';
import { getDefaultCurrency } from '@/features/invoice/view/model/getDefaultCurrency';
import FormPageLayout from '@/components/layout/FormPageLayout';

export default async function NewInvoicePage() {
  const clients = await getClients();
  const defaultCurrency = await getDefaultCurrency();

  return (
    <FormPageLayout
      title="Nouvelle facture"
      subtitle="Créez une nouvelle facture"
      backHref="/dashboard/invoices"
    >
      <InvoiceForm clients={clients} defaultCurrency={defaultCurrency} />
    </FormPageLayout>
  );
}
