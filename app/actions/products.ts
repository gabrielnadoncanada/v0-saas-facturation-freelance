"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// Types
interface ProductData {
  name: string
  description: string
  price: number
  tax_rate: number
  is_service: boolean
  category_id: string | null
}

// Server Actions pour les produits
export async function getProducts() {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", data: null }
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, category:category_id(id, name, color)")
    .eq("user_id", session.session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function getProduct(id: string) {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", data: null }
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.session.user.id)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function createProduct(formData: ProductData) {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", success: false }
  }

  // Validation
  if (!formData.name.trim()) {
    return { error: "Le nom du produit est requis", success: false }
  }

  if (formData.price < 0) {
    return { error: "Le prix ne peut pas être négatif", success: false }
  }

  const productData = {
    user_id: session.session.user.id,
    name: formData.name.trim(),
    description: formData.description.trim(),
    price: formData.price,
    tax_rate: formData.tax_rate,
    is_service: formData.is_service,
    category_id: formData.category_id === "none" ? null : formData.category_id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("products").insert(productData)

  if (error) {
    console.error("Error creating product:", error)
    return { error: error.message, success: false }
  }

  // Revalidate the products page
  revalidatePath("/dashboard/products")

  return { error: null, success: true }
}

export async function updateProduct(id: string, formData: ProductData) {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", success: false }
  }

  // Validation
  if (!formData.name.trim()) {
    return { error: "Le nom du produit est requis", success: false }
  }

  if (formData.price < 0) {
    return { error: "Le prix ne peut pas être négatif", success: false }
  }

  const productData = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    price: formData.price,
    tax_rate: formData.tax_rate,
    is_service: formData.is_service,
    category_id: formData.category_id === "none" ? null : formData.category_id,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .eq("user_id", session.session.user.id)

  if (error) {
    console.error("Error updating product:", error)
    return { error: error.message, success: false }
  }

  // Revalidate the products page
  revalidatePath("/dashboard/products")
  revalidatePath(`/dashboard/products/${id}`)

  return { error: null, success: true }
}

export async function deleteProduct(id: string) {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", success: false }
  }

  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", session.session.user.id)

  if (error) {
    console.error("Error deleting product:", error)
    return { error: error.message, success: false }
  }

  // Revalidate the products page
  revalidatePath("/dashboard/products")

  return { error: null, success: true }
}

export async function getCategories() {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", data: null }
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", session.session.user.id)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}
