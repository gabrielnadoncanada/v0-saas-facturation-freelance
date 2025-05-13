"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Récupérer le profil de l'utilisateur
export async function getUserProfile() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
      data: null,
    }
  }

  try {
    // Récupérer le profil de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      return {
        success: false,
        error: profileError.message,
        data: null,
      }
    }

    return {
      success: true,
      data: profile,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération du profil",
      data: null,
    }
  }
}

// Mettre à jour le profil de l'utilisateur
export async function updateUserProfile(formData: FormData) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
    }
  }

  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company_name = formData.get("company_name") as string
    const address = formData.get("address") as string
    const phone = formData.get("phone") as string
    const default_currency = formData.get("default_currency") as string
    const tax_rate = Number.parseFloat(formData.get("tax_rate") as string) || 0
    const tax_id = formData.get("tax_id") as string
    const website = formData.get("website") as string

    // Mettre à jour le profil
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name,
        company_name,
        address,
        phone,
        default_currency,
        tax_rate,
        tax_id,
        website,
      })
      .eq("id", session.user.id)

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      }
    }

    // Mettre à jour l'email si nécessaire
    if (email !== session.user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email,
      })

      if (emailError) {
        return {
          success: false,
          error: emailError.message,
        }
      }
    }

    revalidatePath("/dashboard/settings")
    return {
      success: true,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du profil",
    }
  }
}

// Uploader un logo
export async function uploadLogo(formData: FormData) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
      logoUrl: null,
    }
  }

  try {
    const logoFile = formData.get("logo") as File

    if (!logoFile || logoFile.size === 0) {
      return {
        success: false,
        error: "Aucun fichier sélectionné",
        logoUrl: null,
      }
    }

    // Vérifier la taille du fichier (max 2MB)
    if (logoFile.size > 2 * 1024 * 1024) {
      return {
        success: false,
        error: "Le fichier est trop volumineux (max 2MB)",
        logoUrl: null,
      }
    }

    // Vérifier le type de fichier
    if (!logoFile.type.startsWith("image/")) {
      return {
        success: false,
        error: "Le fichier doit être une image",
        logoUrl: null,
      }
    }

    // Générer un nom de fichier unique
    const fileExt = logoFile.name.split(".").pop()
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`

    // Uploader le fichier
    const { data: uploadData, error: uploadError } = await supabase.storage.from("logos").upload(fileName, logoFile, {
      upsert: true,
    })

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message,
        logoUrl: null,
      }
    }

    // Récupérer l'URL publique du fichier
    const { data: publicUrlData } = supabase.storage.from("logos").getPublicUrl(fileName)

    // Mettre à jour le profil avec l'URL du logo
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        logo_url: publicUrlData.publicUrl,
      })
      .eq("id", session.user.id)

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
        logoUrl: null,
      }
    }

    revalidatePath("/dashboard/settings")
    return {
      success: true,
      error: null,
      logoUrl: publicUrlData.publicUrl,
    }
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de l'upload du logo",
      logoUrl: null,
    }
  }
}

// Supprimer le logo
export async function deleteLogo() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      error: "Non authentifié",
    }
  }

  try {
    // Récupérer l'URL du logo actuel
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("logo_url")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      return {
        success: false,
        error: profileError.message,
      }
    }

    if (profile.logo_url) {
      // Extraire le nom du fichier de l'URL
      const fileName = profile.logo_url.split("/").pop()

      // Supprimer le fichier du stockage
      const { error: deleteError } = await supabase.storage.from("logos").remove([fileName])

      if (deleteError) {
        return {
          success: false,
          error: deleteError.message,
        }
      }
    }

    // Mettre à jour le profil pour supprimer l'URL du logo
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        logo_url: null,
      })
      .eq("id", session.user.id)

    if (updateError) {
      return {
        success: false,
        error: updateError.message,
      }
    }

    revalidatePath("/dashboard/settings")
    return {
      success: true,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression du logo",
    }
  }
}
