"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// Types
interface CategoryData {
  name: string
  description: string
  color: string
}

// Server Actions pour les catégories
export async function getCategories() {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", data: null }
  }

  const { data, error } = await supabase
    .from("product_categories")
    .select("*, products:products(count)")
    .eq("user_id", session.session.user.id)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function getCategory(id: string) {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", data: null }
  }

  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.session.user.id)
    .single()

  if (error) {
    console.error("Error fetching category:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function createCategory(formData: CategoryData) {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", success: false, id: null }
  }

  // Validation
  if (!formData.name.trim()) {
    return { error: "Le nom de la catégorie est requis", success: false, id: null }
  }

  const categoryData = {
    user_id: session.session.user.id,
    name: formData.name.trim(),
    description: formData.description.trim(),
    color: formData.color,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("product_categories").insert(categoryData).select()

  if (error) {
    console.error("Error creating category:", error)
    return { error: error.message, success: false, id: null }
  }

  // Revalidate the categories page
  revalidatePath("/dashboard/products/categories")
  revalidatePath("/dashboard/products")

  return { error: null, success: true, id: data?.[0]?.id || null }
}

export async function updateCategory(id: string, formData: CategoryData) {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", success: false }
  }

  // Validation
  if (!formData.name.trim()) {
    return { error: "Le nom de la catégorie est requis", success: false }
  }

  const categoryData = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    color: formData.color,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("product_categories")
    .update(categoryData)
    .eq("id", id)
    .eq("user_id", session.session.user.id)

  if (error) {
    console.error("Error updating category:", error)
    return { error: error.message, success: false }
  }

  // Revalidate the categories page
  revalidatePath("/dashboard/products/categories")
  revalidatePath("/dashboard/products")

  return { error: null, success: true }
}

export async function deleteCategory(id: string) {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    return { error: "Non autorisé", success: false }
  }

  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("id", id)
    .eq("user_id", session.session.user.id)

  if (error) {
    console.error("Error deleting category:", error)
    return { error: error.message, success: false }
  }

  // Revalidate the categories page
  revalidatePath("/dashboard/products/categories")
  revalidatePath("/dashboard/products")

  return { error: null, success: true }
}
