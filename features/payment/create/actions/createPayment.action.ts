'use server'

import { revalidatePath } from 'next/cache'
import Stripe from 'stripe'
import { PaymentFormData } from '@/features/payment/shared/types/payment.types'
import { createPayment } from '@/features/payment/create/model/createPayment'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { PAYMENTS_PATH } from '@/shared/lib/routes'

export async function createPaymentAction(formData: PaymentFormData): Promise<Result<{ url: string | null }>> {
  return withAction(async () => {
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

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-04-30.basil' })

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

      return { url: session.url }
    }

    await createPayment(formData)
    revalidatePath(PAYMENTS_PATH)
    return { url: null }
  })
}
