import type React from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { createClient } from "@/shared/lib/supabase/server"
import { redirect } from "next/navigation"
import { TopNav } from "@/features/dashboard/view/ui/TopNav"
import { Footer } from "@/components/layout/Footer"
import { countClients } from "@/features/client/shared/model/countClients"
import { countProjects } from "@/features/project/shared/model/countProjects"
import { countInvoices } from "@/features/invoice/shared/model/countInvoices"
import { countProducts } from "@/features/product/shared/model/countProducts"
import { countPayments } from "@/features/payment/shared/model/countPayments"

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

  // Fetch entity counts
  const [clientsCount, projectsCount, invoicesCount, productsCount, paymentsCount] = await Promise.all([
    countClients(),
    countProjects(),
    countInvoices(),
    countProducts(),
    countPayments(),
  ])

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden border-r border-slate-200 dark:border-slate-800 md:block">
        <DashboardSidebar
          clientsCount={clientsCount}
          projectsCount={projectsCount}
          invoicesCount={invoicesCount}
          productsCount={productsCount}
          paymentsCount={paymentsCount}
        />
      </aside>
      <div className="flex w-full flex-1 flex-col">
        <TopNav user={session.user} profile={profile} />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="mx-auto max-w-7xl animate-fadeIn p-4 md:p-6 lg:p-8">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
