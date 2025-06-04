import { getClientDetailAction } from '@/features/client/view/actions/getClientDetail.action';
import { ClientDetailView } from '@/features/client/view/ui/ClientDetailView';
import FormPageLayout from '@/components/layout/FormPageLayout';

export default async function ClientPage({ params }: { params: { id: string } }) {
  const data = await getClientDetailAction(params.id);
  return (
    <FormPageLayout
      title="Détails du client"
      subtitle="Informations, statistiques et factures du client"
      backHref="/dashboard/clients"
    >
      <ClientDetailView data={data} isLoading={false} error={null} />
    </FormPageLayout>
  );
}
