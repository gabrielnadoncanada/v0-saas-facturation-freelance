import { RegisterForm } from "@/features/auth/register/RegisterForm"
import { createClient } from "@/shared/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="mt-2 text-sm text-gray-600">
            Inscrivez-vous pour commencer à utiliser notre plateforme de facturation
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
