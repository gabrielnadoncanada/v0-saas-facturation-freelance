import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { profileFormSchema, ProfileFormSchema } from "@/features/setting/schema/profile.schema"
import { updateUserProfileAction } from "@/features/setting/actions/updateUserProfile.action"
import { uploadLogoAction } from "@/features/setting/actions/uploadLogo.action"
import { deleteLogoAction } from "@/features/setting/actions/deleteLogo.action"
import { useToast } from "@/shared/hooks/use-toast"
import type { UserProfile } from "@/features/setting/types/profile.types"

export type ProfileFormValues = ProfileFormSchema

export function useProfileForm(profile: UserProfile | null) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [logoUrl, setLogoUrl] = useState(profile?.logo_url ?? "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const defaultValues: Partial<ProfileFormValues> = {
    name: profile?.name || "",
    email: profile?.email || "",
    company_name: profile?.company_name || "",
    address: profile?.address || "",
    phone: profile?.phone || "",
    default_currency: profile?.default_currency || "EUR",
    tax_rate: profile?.tax_rate || 0,
    tax_id: profile?.tax_id || "",
    website: profile?.website || "",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString())
      }
    })
    const result = await updateUserProfileAction(formData)
    setIsLoading(false)
    if (result.success) {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      })
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    setIsUploading(true)
    const formData = new FormData()
    formData.append("logo", e.target.files[0])
    const result = await uploadLogoAction(formData)
    setIsUploading(false)
    if (result.success && result.logoUrl) {
      setLogoUrl(result.logoUrl)
      toast({
        title: "Logo mis à jour",
        description: "Votre logo a été mis à jour avec succès.",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue lors de l'upload du logo.",
        variant: "destructive",
      })
    }
  }

  const handleLogoDelete = async () => {
    setIsUploading(true)
    const result = await deleteLogoAction()
    setIsUploading(false)
    if (result.success) {
      setLogoUrl("")
      toast({
        title: "Logo supprimé",
        description: "Votre logo a été supprimé avec succès.",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue lors de la suppression du logo.",
        variant: "destructive",
      })
    }
  }

  return {
    form,
    isLoading,
    isUploading,
    logoUrl,
    fileInputRef,
    onSubmit,
    handleLogoUpload,
    handleLogoDelete,
  }
} 