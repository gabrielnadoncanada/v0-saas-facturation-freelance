'use server'

import { getSessionUser } from '@/shared/utils/getSessionUser'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/shared/types/api.types'

export async function updateInvoiceStatusAction(
  invoiceId: string,
  status: string
): Promise<ActionResult> {
  const { supabase, user } = await getSessionUser()

  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/invoices')
  return { success: true }
}
