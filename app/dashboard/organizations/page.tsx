import { getSessionUser } from '@/shared/utils/getSessionUser';
import { getOrganizations, OrganizationCard } from '@/features/organization/list';
import { CreateOrganizationModal } from '@/features/organization/create';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default async function OrganizationsPage() {
  const { user, organization: currentOrganization } = await getSessionUser();
  const organizations = await getOrganizations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organisations</h1>
          <p className="text-muted-foreground">
            Gérez vos organisations et créez-en de nouvelles
          </p>
        </div>
        <CreateOrganizationModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <OrganizationCard
            key={org.id}
            organization={org}
            isCurrentOrganization={org.id === currentOrganization?.id}
          />
        ))}
      </div>

      {organizations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune organisation</h3>
            <p className="text-muted-foreground text-center mb-4">
              Vous n'êtes membre d'aucune organisation. Créez-en une pour commencer.
            </p>
            <CreateOrganizationModal />
          </CardContent>
        </Card>
      )}
    </div>
  );
} 