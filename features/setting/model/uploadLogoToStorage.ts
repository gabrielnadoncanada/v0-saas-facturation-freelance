import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function uploadLogoToStorage(logoFile: File): Promise<string> {
  const { supabase, user } = await getSessionUser()

  if (!logoFile || logoFile.size === 0) {
    throw new Error("Aucun fichier sélectionné")
  }

  if (logoFile.size > 2 * 1024 * 1024) {
    throw new Error("Le fichier est trop volumineux (max 2MB)")
  }

  if (!logoFile.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image")
  }

  const fileExt = logoFile.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase
    .storage
    .from("logos")
    .upload(fileName, logoFile, { upsert: true })

  if (uploadError) throw new Error(uploadError.message)

  const { data: publicUrlData } = supabase
    .storage
    .from("logos")
    .getPublicUrl(fileName)

  const publicUrl = publicUrlData.publicUrl

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ logo_url: publicUrl })
    .eq("id", user.id)

  if (updateError) throw new Error(updateError.message)

  return publicUrl
}
