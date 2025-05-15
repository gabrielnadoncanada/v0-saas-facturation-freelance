"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { createClientAction } from "@/features/client/create/createClient.action"
import { updateClientAction } from "@/features/client/edit/updateClient.action"
import { Client } from "@/shared/types/clients/client"


export function ClientForm({ client, isEdit = false }: { client: Client | null, isEdit: boolean }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<Client>({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    hourly_rate: client?.hourly_rate || "",
    billing_address: client?.billing_address || "",
    billing_city: client?.billing_city || "",
    billing_postal_code: client?.billing_postal_code || "",
    billing_country: client?.billing_country || "",
    shipping_address: client?.shipping_address || "",
    shipping_city: client?.shipping_city || "",
    shipping_postal_code: client?.shipping_postal_code || "",
    shipping_country: client?.shipping_country || "",
    notes: client?.notes || "",
    sameAsShipping: client
      ? client.shipping_address === client.billing_address &&
        client.shipping_city === client.billing_city &&
        client.shipping_postal_code === client.billing_postal_code &&
        client.shipping_country === client.billing_country
      : true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isEdit && client) {
        // Mettre à jour un client existant
        const result = await updateClientAction(client.id, formData)
        if (!result.success) {
          setError(result.error || "Une erreur est survenue")
        }
      } else {
        // Créer un nouveau client
        const result = await createClientAction(formData)
        if (!result.success) {
          setError(result.error || "Une erreur est survenue")
        }
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du client *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Taux horaire (€)</Label>
              <Input
                id="hourly_rate"
                name="hourly_rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.hourly_rate}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Adresse de facturation</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="billing_address">Adresse</Label>
              <Input
                id="billing_address"
                name="billing_address"
                value={formData.billing_address}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_city">Ville</Label>
              <Input id="billing_city" name="billing_city" value={formData.billing_city} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_postal_code">Code postal</Label>
              <Input
                id="billing_postal_code"
                name="billing_postal_code"
                value={formData.billing_postal_code}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="billing_country">Pays</Label>
              <Input
                id="billing_country"
                name="billing_country"
                value={formData.billing_country}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Adresse de livraison</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sameAsShipping"
                checked={formData.sameAsShipping}
                onChange={() => setFormData((prev) => ({ ...prev, sameAsShipping: !prev.sameAsShipping }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="sameAsShipping">Identique à l'adresse de facturation</Label>
            </div>
          </div>

          {!formData.sameAsShipping && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="shipping_address">Adresse</Label>
                <Input
                  id="shipping_address"
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_city">Ville</Label>
                <Input id="shipping_city" name="shipping_city" value={formData.shipping_city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_postal_code">Code postal</Label>
                <Input
                  id="shipping_postal_code"
                  name="shipping_postal_code"
                  value={formData.shipping_postal_code}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="shipping_country">Pays</Label>
                <Input
                  id="shipping_country"
                  name="shipping_country"
                  value={formData.shipping_country}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={4} />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/clients")}
          className="w-full sm:w-auto"
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Mettre à jour" : "Créer le client"}
        </Button>
      </div>
    </form>
  )
}
