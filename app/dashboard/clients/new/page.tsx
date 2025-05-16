import { CreateClientForm } from "@/features/client/create/CreateClientForm"

export default async function NewClientPage() {

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau client</h1>
        <p className="text-muted-foreground">Créez un nouveau client</p>
      </div>

      <CreateClientForm />
    </div>
  )
}
