import { getClientAction } from '@/features/client/shared/actions/getClient.action';
import { ClientForm } from '@/features/client/shared/ui/ClientForm';
import FormPageLayout from '@/components/layout/FormPageLayout';

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const result = await getClientAction(params.id);

  if (!result.success) {
    return <div>{result.error}</div>;
  }

  return (
    <FormPageLayout
      title="Modifier le client"
      subtitle="Modifiez les informations du client"
      backHref="/dashboard/clients"
    >
      <ClientForm client={result.data} />
    </FormPageLayout>
  );
}
