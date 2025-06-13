import { getOrganizationSettingsAction } from '@/features/organization/edit';
import { OrganizationSettingsForm } from '@/features/organization/edit';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const result = await getOrganizationSettingsAction();
  const { organization } = await getSessionUser();

  if (!result.success) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres de l'organisation</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre organisation, facturation et informations d'entreprise
        </p>
      </div>

      <OrganizationSettingsForm settings={result.data} organization={organization} />
    </div>
  );
}
