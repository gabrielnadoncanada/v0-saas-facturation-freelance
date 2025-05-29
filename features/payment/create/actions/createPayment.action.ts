'use server'

import { revalidatePath } from 'next/cache'
import { PAYMENTS_PATH } from '@/shared/lib/routes'
import Stripe from 'stripe'
import { PaymentFormData } from '@/features/payment/shared/types/payment.types'
import { createPayment } from '@/features/payment/create/model/createPayment'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { fail, Result, success } from '@/shared/utils/result'

export async function createPaymentAction(formData: PaymentFormData): Promise<Result<{ url: string | null }>> {
  try {
    if (formData.payment_method === 'stripe') {
      const { supabase, user } = await getSessionUser()

      // Vérifier que la facture appartient à l'utilisateur et récupérer la devise
      const res = await supabase
        .from('invoices')
        .select('*, client:clients(name)')
        .eq('id', formData.invoice_id)
        .single()
      const invoice = extractDataOrThrow<any>(res)
      if (invoice.user_id !== user.id) throw new Error('Facture non trouvée ou non autorisée')

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: invoice.currency,
              unit_amount: Math.round(formData.amount * 100),
              product_data: { name: invoice.invoice_number },
            },
            quantity: 1,
          },
        ],
        metadata: {
          invoice_id: formData.invoice_id,
        },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payments`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payments`,
      })

      return success({ url: session.url })
    }

    await createPayment(formData)
    revalidatePath(PAYMENTS_PATH)
    return success({ url: null })
  } catch (error) {
    return fail((error as Error).message)
  }
}
