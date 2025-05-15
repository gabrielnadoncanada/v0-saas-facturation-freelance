import { TimeToInvoice } from "@/components/time-tracking/time-to-invoice"
import { createClient } from "@/shared/lib/supabase/server"

export default async function TimeToInvoicePage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Récupérer les entrées de temps non facturées
  const { data: timeEntries } = await supabase
    .from("time_entries")
    .select("*, clients(id, name)")
    .eq("user_id", session?.user.id)
    .eq("billable", true)
    .eq("billed", false)
    .is("end_time", "not.null")
    .order("start_time", { ascending: false })

  // Récupérer la liste des clients
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .eq("user_id", session?.user.id)
    .order("name", { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Convertir le temps en facture</h1>
        <p className="text-muted-foreground">Sélectionnez les entrées de temps à convertir en lignes de facture</p>
      </div>

      <TimeToInvoice timeEntries={timeEntries || []} clients={clients || []} userId={session?.user.id} />
    </div>
  )
}
