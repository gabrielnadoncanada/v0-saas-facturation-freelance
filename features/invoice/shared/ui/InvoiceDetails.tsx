'use client'

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate, getInvoiceStatusColor } from "@/shared/lib/utils"
import { AlertCircle, ArrowLeft, Download, Edit, Send, Mail, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NewPaymentFormView } from "@/features/payment/create/ui/NewPaymentFormView"
import { useInvoiceDetails } from "@/features/invoice/shared/hooks/useInvoiceDetails"
import { InvoiceLinesTable } from "@/features/invoice/shared/ui/InvoiceLinesTable"
import { InvoicePaymentsTable } from "@/features/invoice/shared/ui/InvoicePaymentsTable"
import { Invoice, InvoiceDetailsProps } from "@/features/invoice/shared/types/invoice.types"
import { useRouter } from "next/navigation"
import PaymentForm from "@/features/payment/shared/ui/PaymentForm"
import { sendInvoiceEmailAction } from "@/features/invoice/email"
import { useTransition } from "react"
import { useToast } from "@/shared/hooks/use-toast"

export function InvoiceDetails({ invoice, invoiceItems }: InvoiceDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    isLoading,
    error,
    setError,
    paymentDialogOpen,
    setPaymentDialogOpen,
    updateInvoiceStatus,
    getStatusLabel,
  } = useInvoiceDetails(invoice.id)
  const [isSending, startSending] = useTransition()
  const sendEmail = () => {
    if (!invoice.client.email) return
    setError(null)
    startSending(async () => {
      const res = await sendInvoiceEmailAction(invoice.id, invoice.client.email as string)
      if (!res.success) {
        setError(res.error || 'Une erreur est survenue')
      } else {
        toast({
          title: 'Email envoyé',
          description: 'La facture a été envoyée avec succès.',
        })
      }
    })
  }

  // Calculer le total payé
  const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0)
  const balanceDue = invoice.total ? invoice.total - totalPaid : 0

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
          <InvoiceLinesTable invoiceItems={invoiceItems} currency={invoice.currency} />
        </CardContent>
      </Card>
      {invoice.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoicePaymentsTable payments={invoice.payments} currency={invoice.currency} />
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
          <Button variant="outline" asChild>
            <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </a>
          </Button>
          <Button variant="outline" onClick={sendEmail} disabled={isSending || !invoice.client.email}>
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Envoyer par email
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