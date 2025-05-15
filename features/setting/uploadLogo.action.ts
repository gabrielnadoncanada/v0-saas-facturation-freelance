'use server'

import { uploadLogoToStorage } from './uploadLogoToStorage'
import { LogoActionResult } from '@/shared/types/settings/profile'
import { revalidatePath } from 'next/cache'

export async function uploadLogoAction(formData: FormData): Promise<LogoActionResult> {
  try {
    const logoFile = formData.get("logo") as File
    const publicUrl = await uploadLogoToStorage(logoFile)
    revalidatePath("/dashboard/settings")
    return { success: true, error: null, logoUrl: publicUrl }
  } catch (error) {
    return { success: false, error: (error as Error).message, logoUrl: null }
  }
}
