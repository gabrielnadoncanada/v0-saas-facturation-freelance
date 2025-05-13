"use server"

import { createClient as createSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type ClientFormData = {
  name: string
  email: string
  phone: string
  hourly_rate: string | number
  billing_address: string
  billing_city: string
  billing_postal_code: string
  billing_country: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  notes: string
  sameAsShipping: boolean
}

export async function getAllClients() {
  const supabase = createSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Utilisateur non authentifié" }
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", session.user.id)
    .order("name", { ascending: true })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function updateClient(clientId: string, data: ClientFormData) {
  const supabase = createSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Utilisateur non authentifié" }
  }

  // Préparer les données
  const finalData = { ...data }
  delete finalData.sameAsShipping

  // Copier l'adresse de facturation vers l'adresse de livraison si coché
  if (data.sameAsShipping) {
    finalData.shipping_address = data.billing_address
    finalData.shipping_city = data.billing_city
    finalData.shipping_postal_code = data.billing_postal_code
    finalData.shipping_country = data.billing_country
  }

  // Convertir le taux horaire en nombre
  if (finalData.hourly_rate) {
    finalData.hourly_rate = Number.parseFloat(finalData.hourly_rate as string)
  }

  // Mettre à jour le client
  const { error } = await supabase.from("clients").update(finalData).eq("id", clientId).eq("user_id", session.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/clients")
  redirect("/dashboard/clients")
}

export async function createClient(data: ClientFormData) {
  const supabase = createSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Utilisateur non authentifié" }
  }

  // Préparer les données
  const finalData = { ...data }
  delete finalData.sameAsShipping

  // Copier l'adresse de facturation vers l'adresse de livraison si coché
  if (data.sameAsShipping) {
    finalData.shipping_address = data.billing_address
    finalData.shipping_city = data.billing_city
    finalData.shipping_postal_code = data.billing_postal_code
    finalData.shipping_country = data.billing_country
  }

  // Convertir le taux horaire en nombre
  if (finalData.hourly_rate) {
    finalData.hourly_rate = Number.parseFloat(finalData.hourly_rate as string)
  }

  // Créer le client
  const { error } = await supabase.from("clients").insert({
    ...finalData,
    user_id: session.user.id,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/clients")
  redirect("/dashboard/clients")
}

export async function getClient(clientId: string) {
  const supabase = createSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, error: "Utilisateur non authentifié" }
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .eq("user_id", session.user.id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteClient(clientId: string) {
  const supabase = createSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { error: "Not authenticated", success: false }
  }

  // Delete the client
  const { error } = await supabase.from("clients").delete().eq("id", clientId).eq("user_id", session.user.id) // Ensure user can only delete their own clients

  if (error) {
    return { error: error.message, success: false }
  }

  // Revalidate the clients page to reflect changes
  revalidatePath("/dashboard/clients")
  return { success: true }
}
