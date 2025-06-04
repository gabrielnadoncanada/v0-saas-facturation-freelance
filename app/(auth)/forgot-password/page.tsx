import { ForgotPasswordForm } from '@/features/auth/forgot/ui/ForgotPasswordForm';
import { redirectIfAuthenticated } from '@/shared/utils/redirectIfAuthenticated';

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
          <p className="mt-2 text-sm text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
