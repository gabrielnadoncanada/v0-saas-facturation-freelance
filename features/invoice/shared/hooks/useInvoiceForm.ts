import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { arrayMove } from "@dnd-kit/sortable"
import { useSensors, useSensor, PointerSensor, KeyboardSensor } from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { createInvoiceAction } from "@/features/invoice/create/createInvoice.action"
import { updateInvoiceAction } from "@/features/invoice/edit/updateInvoice.action"

export function useInvoiceForm({ clients, invoice, invoiceItems = [], defaultCurrency = "EUR", userId }: any) {
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
  const handleDragEnd = (event: any) => {
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
      if (invoice) {
        await updateInvoiceAction(invoice.id, formData, items, invoiceItems)
      } else {
        await createInvoiceAction(formData, items)
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
      setIsLoading(false)
    }
  }

  return {
    router,
    isLoading,
    error,
    formData,
    setFormData,
    items,
    setItems,
    totals,
    sensors,
    handleDragEnd,
    handleChange,
    handleItemChange,
    addItem,
    removeItem,
    handleSubmit,
  }
} 