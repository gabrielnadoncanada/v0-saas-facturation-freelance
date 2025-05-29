"use client"

import Link from "next/link"
import { formatCurrency, formatDate, getInvoiceStatusColor } from "@/shared/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface Invoice {
  id: string
  invoice_number: string
  issue_date: string
  due_date: string
  total: number
  status: string
  client: {
    name: string
  }
}

interface RecentInvoicesProps {
  invoices: Invoice[] | null
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <div>
      {!invoices || invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FileText className="h-10 w-10 text-muted-foreground opacity-40" />
          <h3 className="mt-4 text-lg font-medium">Aucune facture trouvée</h3>
          <p className="mt-1 text-sm text-muted-foreground">Commencez par créer une nouvelle facture</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/invoices/new">Créer une facture</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/invoices/${invoice.id}`}
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {invoice.invoice_number}
                  </Link>
                  <Badge className={getInvoiceStatusColor(invoice.status)}>
                    {invoice.status === "draft" && "Brouillon"}
                    {invoice.status === "sent" && "Envoyée"}
                    {invoice.status === "paid" && "Payée"}
                    {invoice.status === "overdue" && "En retard"}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{invoice.client.name}</span>
                  <span>•</span>
                  <span>{formatDate(invoice.issue_date)}</span>
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="font-medium">{formatCurrency(invoice.total)}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {invoice.due_date && `Échéance: ${formatDate(invoice.due_date)}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
