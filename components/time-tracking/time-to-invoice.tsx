"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/shared/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency, formatDate, formatDuration } from "@/shared/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"

interface TimeToInvoiceProps {
  timeEntries: any[]
  clients: { id: string; name: string }[]
  userId: string | undefined
}

export function TimeToInvoice({ timeEntries, clients, userId }: TimeToInvoiceProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Regrouper les entrées par client
  const entriesByClient = timeEntries.reduce(
    (acc, entry) => {
      const clientId = entry.client_id
      if (!acc[clientId]) {
        acc[clientId] = []
      }
      acc[clientId].push(entry)
      return acc
    },
    {} as Record<string, any[]>,
  )

  // État pour les entrées sélectionnées
  const [selectedEntries, setSelectedEntries] = useState<Record<string, boolean>>({})

  // État pour les détails de la facture
  const [invoiceDetails, setInvoiceDetails] = useState({
    client_id: Object.keys(entriesByClient)[0] || "",
    issue_date: new Date(),
    due_date: new Date(new Date().setDate(new Date().getDate() + 30)),
    status: "draft",
    currency: "EUR",
    language: "fr",
    notes: "",
  })

  // Gérer les changements dans le formulaire
  const handleChange = (name: string, value: any) => {
    setInvoiceDetails((prev) => ({ ...prev, [name]: value }))
  }

  // Sélectionner/désélectionner toutes les entrées d'un client
  const toggleClientEntries = (clientId: string, checked: boolean) => {
    const newSelectedEntries = { ...selectedEntries }

    entriesByClient[clientId].forEach((entry) => {
      newSelectedEntries[entry.id] = checked
    })

    setSelectedEntries(newSelectedEntries)
  }

  // Sélectionner/désélectionner une entrée
  const toggleEntry = (entryId: string, checked: boolean) => {
    setSelectedEntries((prev) => ({
      ...prev,
      [entryId]: checked,
    }))
  }

  // Calculer le total des entrées sélectionnées
  const calculateTotal = () => {
    let total = 0

    Object.entries(entriesByClient).forEach(([clientId, entries]) => {
      entries.forEach((entry) => {
        if (selectedEntries[entry.id]) {
          const hours = entry.duration / 3600
          total += hours * entry.hourly_rate
        }
      })
    })

    return total
  }

  // Créer la facture avec les entrées sélectionnées
  const createInvoice = async () => {
    setIsLoading(true)
    setError(null)

    // Vérifier si des entrées sont sélectionnées
    const hasSelectedEntries = Object.values(selectedEntries).some((selected) => selected)

    if (!hasSelectedEntries) {
      setError("Veuillez sélectionner au moins une entrée de temps")
      setIsLoading(false)
      return
    }

    if (!userId || !invoiceDetails.client_id) {
      setError("Informations manquantes")
      setIsLoading(false)
      return
    }

    try {
      // 1. Créer la facture
      const { data: newInvoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: userId,
          client_id: invoiceDetails.client_id,
          issue_date: invoiceDetails.issue_date.toISOString().split("T")[0],
          due_date: invoiceDetails.due_date.toISOString().split("T")[0],
          status: invoiceDetails.status,
          currency: invoiceDetails.currency,
          language: invoiceDetails.language,
          notes: invoiceDetails.notes,
          subtotal: 0, // Sera mis à jour par le trigger
          tax_total: 0, // Sera mis à jour par le trigger
          total: 0, // Sera mis à jour par le trigger
        })
        .select()

      if (invoiceError) {
        setError(invoiceError.message)
        return
      }

      const invoiceId = newInvoice?.[0]?.id

      if (!invoiceId) {
        setError("Erreur lors de la création de la facture")
        return
      }

      // 2. Créer les lignes de facture pour chaque entrée sélectionnée
      const selectedEntriesArray = Object.entries(selectedEntries)
        .filter(([_, selected]) => selected)
        .map(([entryId]) => entryId)

      for (const entryId of selectedEntriesArray) {
        const entry = timeEntries.find((e) => e.id === entryId)
        if (!entry) continue

        const hours = entry.duration / 3600
        const amount = hours * entry.hourly_rate

        // Créer la ligne de facture
        const { error: itemError } = await supabase.from("invoice_items").insert({
          invoice_id: invoiceId,
          description: `${entry.description} (${formatDuration(entry.duration)})`,
          quantity: hours,
          unit_price: entry.hourly_rate,
          tax_rate: 20, // Taux par défaut
          amount: amount,
          time_entry_id: entry.id,
        })

        if (itemError) {
          setError(itemError.message)
          return
        }

        // Marquer l'entrée de temps comme facturée
        const { error: updateError } = await supabase
          .from("time_entries")
          .update({
            billed: true,
            invoice_id: invoiceId,
          })
          .eq("id", entry.id)

        if (updateError) {
          setError(updateError.message)
          return
        }
      }

      // Rediriger vers la page de la facture
      router.push(`/dashboard/invoices/${invoiceId}`)
      router.refresh()
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
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

      {timeEntries.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p>Aucune entrée de temps non facturée trouvée.</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push("/dashboard/time-tracking")}>
              Retour au suivi du temps
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Détails de la facture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Client *</Label>
                  <Select
                    value={invoiceDetails.client_id}
                    onValueChange={(value) => handleChange("client_id", value)}
                    required
                  >
                    <SelectTrigger id="client_id">
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select value={invoiceDetails.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="sent">Envoyée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issue_date">Date d'émission</Label>
                  <DatePicker date={invoiceDetails.issue_date} setDate={(date) => handleChange("issue_date", date)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Date d'échéance</Label>
                  <DatePicker date={invoiceDetails.due_date} setDate={(date) => handleChange("due_date", date)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(entriesByClient).map(([clientId, entries]) => {
            const client = clients.find((c) => c.id === clientId)
            if (!client) return null

            // Vérifier si toutes les entrées du client sont sélectionnées
            const allSelected = entries.every((entry) => selectedEntries[entry.id])

            return (
              <Card key={clientId}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Checkbox
                      id={`client-${clientId}`}
                      checked={allSelected}
                      onCheckedChange={(checked) => toggleClientEntries(clientId, checked === true)}
                      className="mr-2"
                    />
                    <label htmlFor={`client-${clientId}`} className="cursor-pointer">
                      {client.name}
                    </label>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {entries.map((entry) => {
                      const hours = entry.duration / 3600
                      const amount = hours * entry.hourly_rate

                      return (
                        <div key={entry.id} className="flex items-center justify-between py-2 border-b">
                          <div className="flex items-center">
                            <Checkbox
                              id={`entry-${entry.id}`}
                              checked={selectedEntries[entry.id] || false}
                              onCheckedChange={(checked) => toggleEntry(entry.id, checked === true)}
                              className="mr-2"
                            />
                            <div>
                              <label htmlFor={`entry-${entry.id}`} className="font-medium cursor-pointer">
                                {entry.description}
                              </label>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(entry.start_time)} • {formatDuration(entry.duration)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div>{formatCurrency(amount)}</div>
                            <div className="text-sm text-muted-foreground">
                              {hours.toFixed(2)} h × {entry.hourly_rate} €/h
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Total: {formatCurrency(calculateTotal())}</div>
            <Button onClick={createInvoice} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer la facture
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
