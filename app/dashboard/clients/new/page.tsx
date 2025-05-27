import { ClientForm } from "@/features/client/shared/ui/ClientForm";
import FormPageLayout from "@/shared/ui/FormPageLayout";

export default async function NewClientPage() {
  return (
    <FormPageLayout
      title="Nouveau client"
      subtitle="Créez un nouveau client"
      backHref="/dashboard/clients"
    >
      <ClientForm client={null} />
    </FormPageLayout>
  )
}