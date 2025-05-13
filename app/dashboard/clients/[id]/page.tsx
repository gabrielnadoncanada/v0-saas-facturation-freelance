import { ClientForm } from "@/components/features/clients/client-form"
import { getClient } from "@/app/actions/clients"
import { notFound, redirect } from "next/navigation"

export default async function EditClientPage({
  params,
}: {
  params: { id: string }
}) {
  // Si l'ID est "new", rediriger vers la page de création
  if (params.id === "new") {
    redirect("/dashboard/clients/new")
  }

  // Récupérer les données du client
  const result = await getClient(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le client</h1>
        <p className="text-muted-foreground">Modifiez les informations du client</p>
      </div>

      <ClientForm client={result.data} isEdit={true} />
    </div>
  )
}
