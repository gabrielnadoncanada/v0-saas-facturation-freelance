"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Type pour les données de facture
interface InvoiceData {
  client_id: string
  issue_date: Date
  due_date: Date
  status: string
  currency: string
  language: string
  notes: string
  tax_rate: number
}

// Type pour les lignes de facture
interface InvoiceItem {
  id?: string
  description: string
  quantity: number
  unit_price: number
  tax_rate: number
  amount: number
  position: number
  isNew?: boolean
}

// Récupérer toutes les factures
export async function getAllInvoices() {
  const supabase = createClient()

  // Vérifier l'authentification
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Récupérer toutes les factures
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*, clients(name)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: invoices || [] }
  } catch (error) {
    return { success: false, error: "Une erreur est survenue" }
  }
}

// Récupérer toutes les données nécessaires pour l'édition d'une facture
export async function getInvoiceData(invoiceId: string) {
  const supabase = createClient()

  // Vérifier l'authentification
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Récupérer la facture
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .eq("user_id", session.user.id)
      .single()

    if (error || !invoice) {
      return { success: false, error: "Facture non trouvée" }
    }

    // Récupérer les lignes de facture
    const { data: invoiceItems, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("position", { ascending: true })

    if (itemsError) {
      return { success: false, error: itemsError.message }
    }

    // Récupérer la liste des clients pour le formulaire
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", session.user.id)
      .order("name", { ascending: true })

    if (clientsError) {
      return { success: false, error: clientsError.message }
    }

    // Récupérer le profil de l'utilisateur pour obtenir la devise par défaut
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("default_currency")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    const defaultCurrency = profile?.default_currency || "EUR"

    return {
      success: true,
      data: {
        invoice,
        invoiceItems: invoiceItems || [],
        clients: clients || [],
        defaultCurrency,
        userId: session.user.id,
      },
    }
  } catch (error) {
    return { success: false, error: "Une erreur est survenue" }
  }
}

// Récupérer les données nécessaires pour créer une nouvelle facture
export async function getNewInvoiceData() {
  const supabase = createClient()

  // Vérifier l'authentification
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Récupérer la liste des clients pour le formulaire
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", session.user.id)
      .order("name", { ascending: true })

    if (clientsError) {
      return { success: false, error: clientsError.message }
    }

    // Récupérer le profil de l'utilisateur pour obtenir la devise par défaut
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("default_currency")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    const defaultCurrency = profile?.default_currency || "EUR"

    return {
      success: true,
      data: {
        clients: clients || [],
        defaultCurrency,
        userId: session.user.id,
      },
    }
  } catch (error) {
    return { success: false, error: "Une erreur est survenue" }
  }
}

// Créer une nouvelle facture
export async function createInvoice(formData: InvoiceData, items: InvoiceItem[]) {
  const supabase = createClient()

  // Vérifier l'authentification
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Créer la facture
    const { data: newInvoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        user_id: session.user.id,
        client_id: formData.client_id,
        issue_date: formData.issue_date.toISOString().split("T")[0],
        due_date: formData.due_date.toISOString().split("T")[0],
        status: formData.status,
        currency: formData.currency,
        language: formData.language,
        notes: formData.notes,
        tax_rate: formData.tax_rate,
        subtotal: 0, // Sera mis à jour par le trigger
        tax_total: 0, // Sera mis à jour par le trigger
        total: 0, // Sera mis à jour par le trigger
      })
      .select()

    if (invoiceError) {
      return { success: false, error: invoiceError.message }
    }

    const invoiceId = newInvoice[0].id

    // Ajouter les lignes de facture
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const position = i + 1 // Position starts at 1

      const { error: insertItemError } = await supabase.from("invoice_items").insert({
        invoice_id: invoiceId,
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        tax_rate: Number(formData.tax_rate), // Utiliser le taux global
        amount: Number(item.quantity) * Number(item.unit_price),
        position: position,
      })

      if (insertItemError) {
        return { success: false, error: insertItemError.message }
      }
    }

    // Révalidation et redirection
    revalidatePath("/dashboard/invoices")
    redirect(`/dashboard/invoices/${invoiceId}`)
  } catch (error) {
    return { success: false, error: "Une erreur est survenue" }
  }
}

// Mettre à jour une facture existante
export async function updateInvoice(
  invoiceId: string,
  formData: InvoiceData,
  items: InvoiceItem[],
  originalItems: InvoiceItem[] = [],
) {
  const supabase = createClient()

  // Vérifier l'authentification
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Mettre à jour la facture
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        client_id: formData.client_id,
        issue_date: formData.issue_date.toISOString().split("T")[0],
        due_date: formData.due_date.toISOString().split("T")[0],
        status: formData.status,
        currency: formData.currency,
        language: formData.language,
        notes: formData.notes,
        tax_rate: formData.tax_rate,
      })
      .eq("id", invoiceId)
      .eq("user_id", session.user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Supprimer les lignes qui ne sont plus présentes
    const itemsToDelete = originalItems
      .filter((item) => !items.some((newItem) => newItem.id === item.id))
      .map((item) => item.id)

    if (itemsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("invoice_items")
        .delete()
        .in("id", itemsToDelete as string[])

      if (deleteError) {
        return { success: false, error: deleteError.message }
      }
    }

    // Ajouter ou mettre à jour les lignes
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const position = i + 1 // Position starts at 1

      if (item.isNew || !item.id) {
        // Nouvelle ligne
        const { error: insertItemError } = await supabase.from("invoice_items").insert({
          invoice_id: invoiceId,
          description: item.description,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          tax_rate: Number(formData.tax_rate), // Utiliser le taux global
          amount: Number(item.quantity) * Number(item.unit_price),
          position: position,
        })

        if (insertItemError) {
          return { success: false, error: insertItemError.message }
        }
      } else {
        // Mettre à jour une ligne existante
        const { error: updateItemError } = await supabase
          .from("invoice_items")
          .update({
            description: item.description,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
            tax_rate: Number(formData.tax_rate), // Utiliser le taux global
            amount: Number(item.quantity) * Number(item.unit_price),
            position: position,
          })
          .eq("id", item.id)

        if (updateItemError) {
          return { success: false, error: updateItemError.message }
        }
      }
    }

    // Révalidation et redirection
    revalidatePath("/dashboard/invoices")
    redirect(`/dashboard/invoices/${invoiceId}`)
  } catch (error) {
    return { success: false, error: "Une erreur est survenue" }
  }
}

// Supprimer une facture
export async function deleteInvoice(invoiceId: string) {
  const supabase = createClient()

  // Vérifier l'authentification
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Supprimer les lignes de facture d'abord (contrainte de clé étrangère)
    const { error: deleteItemsError } = await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId)

    if (deleteItemsError) {
      return { success: false, error: deleteItemsError.message }
    }

    // Supprimer la facture
    const { error: deleteInvoiceError } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId)
      .eq("user_id", session.user.id)

    if (deleteInvoiceError) {
      return { success: false, error: deleteInvoiceError.message }
    }

    // Révalidation et redirection
    revalidatePath("/dashboard/invoices")
    redirect("/dashboard/invoices")
  } catch (error) {
    return { success: false, error: "Une erreur est survenue" }
  }
}

export async function getInvoiceDetails(invoiceId: string) {
  const supabase = createClient()

  // Vérifier l'authentification
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Récupérer la facture
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("*, clients(id, name, email, address, phone, company)")
      .eq("id", invoiceId)
      .eq("user_id", session.user.id)
      .single()

    if (error || !invoice) {
      return { success: false, error: "Facture non trouvée" }
    }

    // Récupérer les lignes de facture
    const { data: invoiceItems, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("position", { ascending: true })

    if (itemsError) {
      return { success: false, error: itemsError.message }
    }

    // Récupérer les paiements liés à cette facture
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("payment_date", { ascending: false })

    if (paymentsError) {
      console.error("Erreur lors de la récupération des paiements:", paymentsError)
    }

    // Récupérer le profil de l'utilisateur pour les informations de l'entreprise
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      console.error("Erreur lors de la récupération du profil:", profileError)
    }

    return {
      success: true,
      data: {
        invoice,
        invoiceItems: invoiceItems || [],
        payments: payments || [],
        profile: profile || {},
      },
    }
  } catch (error) {
    return { success: false, error: "Une erreur est survenue" }
  }
}
