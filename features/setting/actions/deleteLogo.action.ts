'use server'

import { deleteLogoFromStorage } from "@/features/setting/model/deleteLogoFromStorage"
import { LogoActionResult } from '@/shared/types/settings/profile'
import { revalidatePath } from 'next/cache'

export async function deleteLogoAction(): Promise<LogoActionResult> {
  try {
    await deleteLogoFromStorage()
    revalidatePath('/dashboard/settings')
    return { success: true, error: null, logoUrl: null }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      logoUrl: null,
    }
  }
}
