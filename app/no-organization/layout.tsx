import type { Metadata } from 'next';
import { getSessionUser } from '@/shared/utils/getSessionUser';

export const metadata: Metadata = {
  title: 'Créez votre organisation',
  description: 'Créez votre première organisation pour commencer',
};

export default async function NoOrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the session to make sure the user is authenticated
  const { user } = await getSessionUser();

  return (
    <div className="h-full flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Bienvenue {user.email}</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-6">{children}</main>
    </div>
  );
} 