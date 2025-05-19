import { LoginForm } from "@/features/auth/login/ui/LoginForm"
import { redirectIfAuthenticated } from "@/shared/utils/redirectIfAuthenticated"

export default async function LoginPage() {
  await redirectIfAuthenticated()

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte pour accéder à votre tableau de bord
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
