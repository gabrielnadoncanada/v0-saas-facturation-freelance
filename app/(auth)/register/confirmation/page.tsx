import { ResendConfirmationForm } from '@/features/auth/resend-confirmation/ui/ResendConfirmationForm';
import { redirectIfAuthenticated } from '@/shared/utils/redirectIfAuthenticated';

export default async function RegisterConfirmationPage() {
  await redirectIfAuthenticated();

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-2xl font-bold">Confirmez votre email</h1>
        <p className="mt-2 text-sm text-gray-600">
          Nous vous avons envoyé un email de confirmation. Cliquez sur le lien contenu dans cet
          email pour activer votre compte.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Pas reçu l'email ? Vous pouvez le renvoyer ci-dessous.
        </p>
        <ResendConfirmationForm />
      </div>
    </div>
  );
}
