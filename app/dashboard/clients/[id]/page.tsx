import { EditClientForm } from "@/features/client/edit/ui/EditClientForm"
import { getClientAction } from "@/features/client/shared/actions/getClient.action"

export default async function EditClientPage({ params, }: { params: { id: string } }) {
  const result = await getClientAction(params.id)

  if (!result.success) {
    return <div>{result.error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le client</h1>
        <p className="text-muted-foreground">Modifiez les informations du client</p>
      </div>

      <EditClientForm client={result.data} />
    </div>
  )
}
