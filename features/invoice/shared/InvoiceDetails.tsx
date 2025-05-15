"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/shared/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate, getInvoiceStatusColor } from "@/shared/lib/utils"
import { AlertCircle, ArrowLeft, Download, Edit, Send } from "lucide-react"
import Link from "next/link"
import { PaymentForm } from "@/features/payment/shared/PaymentForm"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Invoice, InvoiceItem } from "@/shared/types/invoices/invoice"

export function InvoiceDetails({ invoice, invoiceItems}: { invoice: Invoice, invoiceItems: InvoiceItem[]}) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  // Calculer le total payé
  const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0)
  const balanceDue = invoice.total ? invoice.total - totalPaid : 0


  console.log(invoice)
  // Mettre à jour le statut de la facture
  const updateInvoiceStatus = async (status: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase.from("invoices").update({ status }).eq("id", invoice.id)

      if (updateError) {
        setError(updateError.message)
        return
      }

      router.refresh()
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  // Obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Brouillon"
      case "sent":
        return "Envoyée"
      case "paid":
        return "Payée"
      case "overdue":
        return "En retard"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{invoice.invoice_number}</h1>
            <p className="text-muted-foreground">Client: {invoice.client.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getInvoiceStatusColor(invoice.status)}>{getStatusLabel(invoice.status)}</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Détails de la facture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date d'émission</p>
                <p>{formatDate(invoice.issue_date as string)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date d'échéance</p>
                <p>{formatDate(invoice.due_date as string)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Devise</p>
                <p>{invoice.currency}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Langue</p>
                <p>{invoice.language === "fr" ? "Français" : invoice.language}</p>
              </div>
            </div>

            {invoice.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA</span>
                <span>{formatCurrency(invoice.tax_total, invoice.currency)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span>Payé</span>
                <span>{formatCurrency(totalPaid, invoice.currency)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Solde dû</span>
                <span>{formatCurrency(balanceDue, invoice.currency)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={invoice.status === "paid" || balanceDue <= 0}>Enregistrer un paiement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enregistrer un paiement</DialogTitle>
                </DialogHeader>
                <PaymentForm
                  invoiceId={invoice.id}
                  balanceDue={balanceDue}
                  currency={invoice.currency}
                  onSuccess={() => {
                    setPaymentDialogOpen(false)
                    router.refresh()
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lignes de facture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right">Quantité</th>
                  <th className="px-4 py-2 text-right">Prix unitaire</th>
                  <th className="px-4 py-2 text-right">TVA (%)</th>
                  <th className="px-4 py-2 text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(item.unit_price, invoice.currency)}</td>
                    <td className="px-4 py-2 text-right">{item.tax_rate}%</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(item.amount, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {invoice.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Méthode</th>
                    <th className="px-4 py-2 text-right">Montant</th>
                    <th className="px-4 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="px-4 py-2">{formatDate(payment.payment_date as string)}</td>
                      <td className="px-4 py-2">
                        {payment.payment_method === "card" && "Carte bancaire"}
                        {payment.payment_method === "cash" && "Espèces"}
                        {payment.payment_method === "transfer" && "Virement"}
                        {payment.payment_method === "stripe" && "Stripe"}
                      </td>
                      <td className="px-4 py-2 text-right">{formatCurrency(payment.amount, invoice.currency)}</td>
                      <td className="px-4 py-2">{payment.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <div className="flex space-x-2">
          <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        </div>
        <div className="flex space-x-2">
          {invoice.status === "draft" && (
            <Button onClick={() => updateInvoiceStatus("sent")} disabled={isLoading}>
              <Send className="mr-2 h-4 w-4" />
              Marquer comme envoyée
            </Button>
          )}
          {invoice.status === "sent" && balanceDue <= 0 && (
            <Button onClick={() => updateInvoiceStatus("paid")} disabled={isLoading}>
              Marquer comme payée
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
