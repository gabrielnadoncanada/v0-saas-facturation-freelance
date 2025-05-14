import { TimeEntriesTable } from "@/components/time-tracking/time-entries-table"
import { TimeTracker } from "@/components/time-tracking/time-tracker"
import { createClient } from "@/lib/supabase/server"

export default async function TimeTrackingPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .eq("user_id", session?.user.id)
    .order("name", { ascending: true })

  const { data: timeEntries } = await supabase
    .from("time_entries")
    .select("*, clients(name), tasks(name, project_id, projects(name))")
    .eq("user_id", session?.user.id)
    .order("start_time", { ascending: false })
    .limit(50)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Suivi du temps</h1>
        <p className="text-muted-foreground">Enregistrez votre temps et convertissez-le en factures</p>
      </div>

      <TimeTracker clients={clients || []} userId={session?.user.id} />
      <TimeEntriesTable timeEntries={timeEntries || []} />
    </div>
  )
}
