"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  Loader2,
  Plus,
  Trash,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Package,
  DollarSign,
  Percent,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/shared/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import { ProductSelector } from "@/features/product/shared/ProductSelector"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/shared/lib/utils"
import { createInvoiceAction } from "@/features/invoice/create/createInvoice.action"
import { updateInvoiceAction } from "@/features/invoice/edit/updateInvoice.action"
import { InvoiceItem } from "@/shared/types/invoices/invoice"
import { Invoice } from "@/shared/types/invoices/invoice"
import { Client } from "@/shared/types/clients/client"

interface InvoiceFormProps {
  userId: string | undefined
  clients: Client[]
  invoice?: Invoice
  invoiceItems?: InvoiceItem[]
  defaultCurrency?: string
}

// Sortable Invoice Item Component
function SortableInvoiceItem({
  item,
  index,
  handleItemChange,
  removeItem,
  currency,
  isLast,
  userId,
  globalTaxRate,
}: {
  item: any
  index: number
  handleItemChange: (index: number, name: string, value: any) => void
  removeItem: (index: number) => void
  currency: string
  isLast: boolean
  userId: string | undefined
  globalTaxRate: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const itemAmount = Number(item.quantity) * Number(item.unit_price)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  const handleProductSelect = (product: any) => {
    handleItemChange(index, "description", product.name + (product.description ? ` - ${product.description}` : ""))
    handleItemChange(index, "unit_price", product.price)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border border-border rounded-lg mb-3 transition-all duration-200",
        isDragging ? "shadow-lg ring-2 ring-primary/20" : "hover:border-primary/30",
        item.description ? "" : "border-dashed",
      )}
    >
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center md:p-4">
        <div className="col-span-1 flex justify-center cursor-move" {...attributes} {...listeners}>
          <div className="p-2 rounded-md hover:bg-muted transition-colors">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="col-span-6">
          <div className="space-y-2">
            {userId && (
              <ProductSelector
                userId={userId}
                onSelect={handleProductSelect}
                buttonClassName="w-full mb-2 text-sm h-9 bg-background hover:bg-muted"
              />
            )}
            <div className="relative">
              <Input
                id={`desktop-item-${index}-description`}
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                placeholder="Description du produit ou service"
                className="pl-9 h-9 bg-background focus-visible:ring-primary/30"
                required
              />
              <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <Input
            id={`desktop-item-${index}-quantity`}
            type="number"
            min="0"
            step="0.01"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
            placeholder="Quantité"
            className="h-9 bg-background focus-visible:ring-primary/30 text-right"
            required
          />
        </div>

        <div className="col-span-2">
          <div className="relative">
            <Input
              id={`desktop-item-${index}-unit_price`}
              type="number"
              min="0"
              step="0.01"
              value={item.unit_price}
              onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
              placeholder="Prix unitaire"
              className="pl-9 h-9 bg-background focus-visible:ring-primary/30 text-right"
              required
            />
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="col-span-1 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            disabled={isLast}
            className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Supprimer</span>
          </Button>
        </div>
      </div>

      {/* Mobile View - Collapsible */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="cursor-move p-2 rounded-md hover:bg-muted transition-colors" {...attributes} {...listeners}>
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 truncate max-w-[180px] font-medium">{item.description || "Nouvelle ligne"}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">{formatCurrency(itemAmount, currency)}</div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-muted">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="px-4 pb-4 space-y-4 border-t border-border pt-4 bg-background/50 rounded-b-lg">
          <div className="space-y-2">
            {userId && (
              <ProductSelector
                userId={userId}
                onSelect={handleProductSelect}
                buttonClassName="w-full mb-2 text-sm h-10 bg-background hover:bg-muted"
              />
            )}
            <Label htmlFor={`mobile-item-${index}-description`} className="text-sm font-medium text-muted-foreground">
              Description
            </Label>
            <div className="relative">
              <Input
                id={`mobile-item-${index}-description`}
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                placeholder="Description du produit ou service"
                className="pl-9 h-10 bg-background focus-visible:ring-primary/30"
                required
              />
              <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`mobile-item-${index}-quantity`} className="text-sm font-medium text-muted-foreground">
                Quantité
              </Label>
              <Input
                id={`mobile-item-${index}-quantity`}
                type="number"
                min="0"
                step="0.01"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                placeholder="Quantité"
                className="h-10 bg-background focus-visible:ring-primary/30 text-right"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`mobile-item-${index}-unit_price`} className="text-sm font-medium text-muted-foreground">
                Prix unitaire
              </Label>
              <div className="relative">
                <Input
                  id={`mobile-item-${index}-unit_price`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                  placeholder="Prix unitaire"
                  className="pl-9 h-10 bg-background focus-visible:ring-primary/30 text-right"
                  required
                />
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(index)}
              disabled={isLast}
              className="h-9 rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>

          <div className="pt-3 border-t border-border mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Montant HT:</span>
              <span>{formatCurrency(itemAmount, currency)}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export function InvoiceForm({
  userId,
  clients,
  invoice,
  invoiceItems = [],
  defaultCurrency = "EUR",
}: InvoiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // État pour les détails de la facture
  const [formData, setFormData] = useState({
    client_id: invoice?.client_id || "",
    issue_date: invoice?.issue_date ? new Date(invoice.issue_date) : new Date(),
    due_date: invoice?.due_date ? new Date(invoice.due_date) : new Date(new Date().setDate(new Date().getDate() + 30)),
    status: invoice?.status || "draft",
    currency: invoice?.currency || defaultCurrency,
    language: invoice?.language || "fr",
    notes: invoice?.notes || "",
    tax_rate: invoice?.tax_rate || 20, // Taux de TVA global
  })

  // État pour les lignes de facture
  const [items, setItems] = useState<any[]>(
    invoiceItems.length > 0
      ? invoiceItems.map((item) => ({
          ...item,
          tax_rate: formData.tax_rate, // Utiliser le taux global pour la compatibilité
        }))
      : [
          {
            id: "new-item-" + Date.now(),
            description: "",
            quantity: 1,
            unit_price: 0,
            tax_rate: formData.tax_rate, // Utiliser le taux global pour la compatibilité
            amount: 0,
            isNew: true,
          },
        ],
  )

  // État pour les totaux
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  })

  // Configuration des capteurs pour le drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Gérer la fin du drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Mettre à jour les totaux lorsque les lignes ou le taux de TVA changent
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unit_price), 0)
    const tax = (subtotal * Number(formData.tax_rate)) / 100
    const total = subtotal + tax

    setTotals({
      subtotal,
      tax,
      total,
    })
  }, [items, formData.tax_rate])

  // Gérer les changements dans le formulaire principal
  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Si le taux de TVA global change, mettre à jour le taux de TVA de tous les éléments pour la compatibilité
    if (name === "tax_rate") {
      setItems(
        items.map((item) => ({
          ...item,
          tax_rate: value,
        })),
      )
    }
  }

  // Gérer les changements dans les lignes de facture
  const handleItemChange = (index: number, name: string, value: any) => {
    const newItems = [...items]
    newItems[index][name] = value

    // Calculer le montant automatiquement
    if (name === "quantity" || name === "unit_price") {
      newItems[index].amount = Number(newItems[index].quantity) * Number(newItems[index].unit_price)
    }

    setItems(newItems)
  }

  // Ajouter une nouvelle ligne
  const addItem = () => {
    setItems([
      ...items,
      {
        id: "new-item-" + Date.now(),
        description: "",
        quantity: 1,
        unit_price: 0,
        tax_rate: formData.tax_rate, // Utiliser le taux global pour la compatibilité
        amount: 0,
        isNew: true,
      },
    ])
  }

  // Supprimer une ligne
  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!userId || !formData.client_id) {
      setError("Informations manquantes")
      setIsLoading(false)
      return
    }

    try {
      // Utiliser les Server Actions pour créer ou mettre à jour la facture
      if (invoice) {
        // Mettre à jour la facture existante
        await updateInvoiceAction(invoice.id, formData, items, invoiceItems)
      } else {
        // Créer une nouvelle facture
        await createInvoiceAction(formData, items)
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client_id">Client *</Label>
              <Select value={formData.client_id} onValueChange={(value) => handleChange("client_id", value)} required>
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Date d'émission</Label>
                <DatePicker date={formData.issue_date} setDate={(date) => handleChange("issue_date", date)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Date d'échéance</Label>
                <DatePicker date={formData.due_date} setDate={(date) => handleChange("due_date", date)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyée</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="overdue">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar US ($)</SelectItem>
                    <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                    <SelectItem value="CAD">Dollar Canadien (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_rate">Taux de TVA global (%)</Label>
              <div className="relative">
                <Input
                  id="tax_rate"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.tax_rate}
                  onChange={(e) => handleChange("tax_rate", e.target.value)}
                  placeholder="Taux de TVA"
                  className="pl-9 h-10 bg-background focus-visible:ring-primary/30"
                />
                <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
                placeholder="Conditions de paiement, informations supplémentaires..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Récapitulatif</CardTitle>
            {invoice && <div className="text-lg font-semibold">{invoice.invoice_number}</div>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total HT</span>
                <span>{formatCurrency(totals.subtotal, formData.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">TVA ({formData.tax_rate}%)</span>
                <span>{formatCurrency(totals.tax, formData.currency)}</span>
              </div>
              <div className="flex justify-between font-semibold mt-4 text-lg">
                <span>Total TTC</span>
                <span>{formatCurrency(totals.total, formData.currency)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
          <CardTitle>Lignes de facture</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem} className="bg-card hover:bg-background">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 pb-0">
            {/* Desktop Header - Hidden on Mobile */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:mb-2 md:px-3">
              <div className="col-span-1"></div>
              <div className="col-span-6 text-sm font-medium text-muted-foreground">Description</div>
              <div className="col-span-2 text-sm font-medium text-muted-foreground">Quantité</div>
              <div className="col-span-2 text-sm font-medium text-muted-foreground">Prix unitaire</div>
              <div className="col-span-1"></div>
            </div>

            {/* Drag and Drop Context */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                <div>
                  {items.map((item, index) => (
                    <SortableInvoiceItem
                      key={item.id}
                      item={item}
                      index={index}
                      handleItemChange={handleItemChange}
                      removeItem={removeItem}
                      currency={formData.currency}
                      isLast={items.length === 1}
                      userId={userId}
                      globalTaxRate={Number(formData.tax_rate)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Mobile Add Button */}
            <div className="md:hidden mt-4 mb-4">
              <Button type="button" variant="outline" className="w-full bg-card hover:bg-background" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une ligne
              </Button>
            </div>
          </div>

          {/* Summary Footer */}
          <div className="border-t border-border bg-muted/30 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                {items.length} {items.length > 1 ? "lignes" : "ligne"} au total
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Total HT:</span>
                  <span className="font-medium">{formatCurrency(totals.subtotal, formData.currency)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">TVA ({formData.tax_rate}%):</span>
                  <span className="font-medium">{formatCurrency(totals.tax, formData.currency)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Total TTC:</span>
                  <span className="text-lg font-semibold">{formatCurrency(totals.total, formData.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/invoices")}
          className="w-full sm:w-auto"
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {invoice ? "Mettre à jour" : "Créer la facture"}
        </Button>
      </div>
    </form>
  )
}
