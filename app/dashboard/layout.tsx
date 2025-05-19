import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { createClient } from "@/shared/lib/supabase/server"
import { redirect } from "next/navigation"
import { TopNav } from "@/features/dashboard/view/ui/TopNav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden border-r border-slate-200 dark:border-slate-800 md:block">
        <DashboardNav />
      </aside>

      {/* Main Content */}
      <div className="flex w-full flex-1 flex-col">
        <TopNav user={session.user} profile={profile} />

        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="mx-auto max-w-7xl animate-fadeIn p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
