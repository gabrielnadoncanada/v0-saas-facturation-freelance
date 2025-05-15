import { ClientForm } from "@/features/client/shared/ClientForm"
import { getClientAction } from "@/features/client/edit/getClient.action"

export default async function EditClientPage({ params, }: { params: { id: string } }) {
  const result = await getClientAction(params.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le client</h1>
        <p className="text-muted-foreground">Modifiez les informations du client</p>
      </div>

      <ClientForm client={result} isEdit={true} />
    </div>
  )
}
