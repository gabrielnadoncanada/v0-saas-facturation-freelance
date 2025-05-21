'use server'

import { getInvoice } from '@/features/invoice/view/model/getInvoice'
import { generateInvoicePdf } from '@/features/invoice/email/model/generateInvoicePdf'
import nodemailer from 'nodemailer'
import { Result, success, fail } from '@/shared/utils/result'

export async function sendInvoiceEmailAction(invoiceId: string, recipientEmail: string): Promise<Result<null>> {
  try {
    const invoice = await getInvoice(invoiceId)
    const pdfBuffer = await generateInvoicePdf(invoiceId)

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipientEmail,
      subject: `Facture ${invoice.invoice_number}`,
      text: `Veuillez trouver votre facture ${invoice.invoice_number} en pièce jointe.`,
      attachments: [
        {
          filename: `facture-${invoice.invoice_number}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
