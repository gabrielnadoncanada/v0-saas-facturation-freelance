import { ResetPasswordForm } from '@/features/auth/reset/ui/ResetPasswordForm';
import { createClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Définir un nouveau mot de passe</h1>
          <p className="mt-2 text-sm text-gray-600">Entrez votre nouveau mot de passe ci-dessous</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
