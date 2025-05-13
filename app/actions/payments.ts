"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Payment {
  id: string
  invoice_id: string
  amount: number
  payment_date: string
  payment_method: string
  notes: string | null
  invoices: {
    id: string
    invoice_number: string
    total: number
    user_id: string
    clients: {
      name: string
    }
  }
}

export interface Invoice {
  id: string
  invoice_number: string
  total: number
  clients: {
    name: string
  }
}

export async function getAllPayments() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { payments: [], error: "Non authentifié" }
  }

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*, invoices(invoice_number, client_id, clients(name))")
    .eq("invoices.user_id", session.user.id)
    .order("payment_date", { ascending: false })

  if (error) {
    return { payments: [], error: "Erreur lors de la récupération des paiements" }
  }

  return { payments: payments || [], error: null }
}

export async function getPendingInvoices() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { invoices: [], error: "Non authentifié" }
  }

  // Récupérer la liste des factures en attente de paiement
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, client_id, total, clients(name)")
    .eq("user_id", session.user.id)
    .eq("status", "sent")
    .order("due_date", { ascending: false })

  if (error) {
    return { invoices: [], error: "Erreur lors de la récupération des factures" }
  }

  return { invoices: invoices || [], error: null }
}

export async function getPaymentData(paymentId: string) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "Non authentifié", payment: null, invoices: [] }
  }

  // Récupérer les détails du paiement
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("*, invoices(id, invoice_number, client_id, total, user_id, clients(name))")
    .eq("id", paymentId)
    .single()

  if (paymentError || !payment || payment.invoices.user_id !== session.user.id) {
    return { error: "Paiement non trouvé", payment: null, invoices: [] }
  }

  // Récupérer la liste des factures pour le sélecteur
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("id, invoice_number, client_id, total, clients(name)")
    .eq("user_id", session.user.id)
    .or(`status.eq.sent,id.eq.${payment.invoice_id}`)
    .order("due_date", { ascending: false })

  if (invoicesError) {
    return { error: "Erreur lors de la récupération des factures", payment, invoices: [] }
  }

  return { error: null, payment, invoices: invoices || [] }
}

export async function updatePayment(
  paymentId: string,
  formData: {
    invoice_id: string
    amount: number
    payment_date: Date
    payment_method: string
    notes: string
  },
) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Vérifier que tous les champs requis sont remplis
    if (!formData.invoice_id || !formData.amount) {
      return { success: false, error: "Veuillez remplir tous les champs obligatoires" }
    }

    // Récupérer les détails du paiement actuel
    const { data: currentPayment } = await supabase
      .from("payments")
      .select("*, invoices(id, total, user_id)")
      .eq("id", paymentId)
      .single()

    if (!currentPayment || currentPayment.invoices.user_id !== session.user.id) {
      return { success: false, error: "Paiement non trouvé" }
    }

    // Mettre à jour le paiement
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        invoice_id: formData.invoice_id,
        amount: formData.amount,
        payment_date: formData.payment_date.toISOString().split("T")[0],
        payment_method: formData.payment_method,
        notes: formData.notes,
      })
      .eq("id", paymentId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // Si la facture a changé, vérifier les statuts des deux factures
    if (formData.invoice_id !== currentPayment.invoice_id) {
      // Vérifier les paiements pour l'ancienne facture
      const { data: oldInvoicePayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("invoice_id", currentPayment.invoice_id)

      const oldTotalPaid = oldInvoicePayments?.reduce((sum, p) => sum + p.amount, 0) || 0

      // Mettre à jour le statut de l'ancienne facture si nécessaire
      if (oldTotalPaid < currentPayment.invoices.total) {
        await supabase.from("invoices").update({ status: "sent" }).eq("id", currentPayment.invoice_id)
      }
    }

    // Vérifier si le paiement couvre le montant total de la nouvelle facture
    const { data: newInvoicePayments } = await supabase
      .from("payments")
      .select("amount")
      .eq("invoice_id", formData.invoice_id)

    const { data: selectedInvoice } = await supabase
      .from("invoices")
      .select("total")
      .eq("id", formData.invoice_id)
      .single()

    if (selectedInvoice) {
      const newTotalPaid = newInvoicePayments?.reduce((sum, p) => sum + p.amount, 0) || 0

      // Mettre à jour le statut de la nouvelle facture si nécessaire
      if (newTotalPaid >= selectedInvoice.total) {
        await supabase.from("invoices").update({ status: "paid" }).eq("id", formData.invoice_id)
      } else {
        await supabase.from("invoices").update({ status: "sent" }).eq("id", formData.invoice_id)
      }
    }

    revalidatePath("/dashboard/payments")
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: "Une erreur est survenue lors de la modification du paiement" }
  }
}

export async function createPayment(formData: {
  invoice_id: string
  amount: number
  payment_date: Date
  payment_method: string
  notes: string
}) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Vérifier que tous les champs requis sont remplis
    if (!formData.invoice_id || !formData.amount) {
      return { success: false, error: "Veuillez remplir tous les champs obligatoires" }
    }

    // Vérifier que la facture existe et appartient à l'utilisateur
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("id, total, user_id")
      .eq("id", formData.invoice_id)
      .single()

    if (invoiceError || !invoice || invoice.user_id !== session.user.id) {
      return { success: false, error: "Facture non trouvée" }
    }

    // Créer le paiement
    const { error: createError } = await supabase.from("payments").insert({
      invoice_id: formData.invoice_id,
      amount: formData.amount,
      payment_date: formData.payment_date.toISOString().split("T")[0],
      payment_method: formData.payment_method,
      notes: formData.notes,
    })

    if (createError) {
      return { success: false, error: createError.message }
    }

    // Vérifier si le paiement couvre le montant total de la facture
    const { data: invoicePayments } = await supabase
      .from("payments")
      .select("amount")
      .eq("invoice_id", formData.invoice_id)

    const totalPaid = invoicePayments?.reduce((sum, p) => sum + p.amount, 0) || 0

    // Mettre à jour le statut de la facture si nécessaire
    if (totalPaid >= invoice.total) {
      await supabase.from("invoices").update({ status: "paid" }).eq("id", formData.invoice_id)
    }

    revalidatePath("/dashboard/payments")
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: "Une erreur est survenue lors de la création du paiement" }
  }
}

export async function deletePayment(paymentId: string) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Non authentifié" }
  }

  try {
    // Récupérer les détails du paiement
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*, invoices(id, total, user_id)")
      .eq("id", paymentId)
      .single()

    if (paymentError || !payment || payment.invoices.user_id !== session.user.id) {
      return { success: false, error: "Paiement non trouvé" }
    }

    // Supprimer le paiement
    const { error: deleteError } = await supabase.from("payments").delete().eq("id", paymentId)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    // Vérifier les paiements restants pour la facture
    const { data: remainingPayments } = await supabase
      .from("payments")
      .select("amount")
      .eq("invoice_id", payment.invoice_id)

    const totalPaid = remainingPayments?.reduce((sum, p) => sum + p.amount, 0) || 0

    // Mettre à jour le statut de la facture si nécessaire
    if (totalPaid < payment.invoices.total) {
      await supabase.from("invoices").update({ status: "sent" }).eq("id", payment.invoice_id)
    }

    revalidatePath("/dashboard/payments")
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: "Une erreur est survenue lors de la suppression du paiement" }
  }
}
