'use server'

import { getInvoice } from '@/features/invoice/view/model/getInvoice'
import { generateInvoicePdf } from '@/features/invoice/pdf/model/generateInvoicePdf'
import { Result, success, fail } from '@/shared/utils/result'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvoiceEmailAction(invoiceId: string, recipientEmail: string): Promise<Result<null>> {
  try {
    const invoice = await getInvoice(invoiceId)
    const { buffer } = await generateInvoicePdf(invoiceId)

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: recipientEmail,
      subject: `Facture ${invoice.invoice_number}`,
      text: `Veuillez trouver votre facture ${invoice.invoice_number} en pièce jointe.`,
      attachments: [
        {
          filename: `facture-${invoice.invoice_number}.pdf`,
          content: buffer.toString('base64'),
        },
      ],
    })

    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
