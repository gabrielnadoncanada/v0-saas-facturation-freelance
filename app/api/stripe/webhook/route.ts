import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/shared/lib/supabase/server'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature') as string

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const invoiceId = session.metadata?.invoice_id

    if (invoiceId) {
      const supabase = await createClient()
      const res = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single()
      const invoice = extractDataOrThrow<Invoice>(res)

      await supabase.from('payments').insert({
        invoice_id: invoiceId,
        amount: (session.amount_total || 0) / 100,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'stripe',
        notes: 'Stripe Checkout',
      })

      const { data: sumData } = await supabase.rpc('sum_payments_by_invoice', { invoiceid: invoiceId })
      const totalPaid = sumData ?? 0
      if (totalPaid >= Number(invoice.total)) {
        await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId)
      }
    }
  }

  return new Response(null, { status: 200 })
}
