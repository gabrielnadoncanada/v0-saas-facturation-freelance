import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/shared/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import { Invoice } from "@/shared/types/invoices/invoice"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { PaymentFormSchema } from "../hooks/useNewPaymentForm"

interface NewPaymentFormViewProps {
  form: any
  isLoading: boolean
  error: string | null
  selectedInvoice: Invoice | null
  invoices: Invoice[]
  onCancel: () => void
  onSubmit: (values: PaymentFormSchema) => void
}

export function NewPaymentFormView({
  form,
  isLoading,
  error,
  selectedInvoice,
  invoices,
  onCancel,
  onSubmit,
}: NewPaymentFormViewProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="invoice_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facture <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="invoice_id">
                        <SelectValue placeholder="Sélectionner une facture" />
                      </SelectTrigger>
                      <SelectContent>
                        {invoices.map((invoice) => (
                          <SelectItem key={invoice.id} value={invoice.id || ""}>
                            {invoice.invoice_number} - {invoice.client.name} ({formatCurrency(invoice.total, invoice.currency)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      {...field}
                      value={field.value}
                      onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                      required
                    />
                  </FormControl>
                  {selectedInvoice && (
                    <p className="text-sm text-muted-foreground">
                      Montant total de la facture: {formatCurrency(selectedInvoice.total, selectedInvoice.currency)}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de paiement <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="payment_method">
                        <SelectValue placeholder="Sélectionner une méthode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Carte bancaire</SelectItem>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="transfer">Virement</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      id="notes"
                      {...field}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      placeholder="Informations supplémentaires..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel} disabled={isLoading} type="button">
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !form.watch("invoice_id")}> 
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer le paiement
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
} 