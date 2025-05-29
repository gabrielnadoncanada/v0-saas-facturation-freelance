'use server'

import { getInvoice } from '@/features/invoice/view/model/getInvoice'
import { generateInvoicePdf } from '@/features/invoice/pdf/model/generateInvoicePdf'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvoiceEmailAction(invoiceId: string, recipientEmail: string): Promise<Result<null>> {
  return withAction(async () => {
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

    return null
  })
}
