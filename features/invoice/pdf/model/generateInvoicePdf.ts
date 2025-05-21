import PDFDocument from 'pdfkit'
import { getInvoice } from '@/features/invoice/view/model/getInvoice'
import { getInvoiceItems } from '@/features/invoice/view/model/getInvoiceItems'

export async function generateInvoicePdf(invoiceId: string): Promise<{ buffer: Buffer; invoiceNumber: string }> {
  const invoice = await getInvoice(invoiceId)
  const items = await getInvoiceItems(invoiceId)

  const doc = new PDFDocument({ margin: 50 })
  const chunks: Buffer[] = []

  doc.on('data', (chunk) => chunks.push(chunk))

  const endPromise = new Promise<{ buffer: Buffer; invoiceNumber: string }>((resolve, reject) => {
    doc.on('end', () => resolve({ buffer: Buffer.concat(chunks), invoiceNumber: invoice.invoice_number }))
    doc.on('error', reject)
  })

  doc.fontSize(20).text(`Facture n° ${invoice.invoice_number}`, { align: 'center' })
  doc.moveDown()

  doc.fontSize(12)
  doc.text(`Client: ${invoice.client.name}`)
  doc.text(`Date: ${invoice.issue_date}`)
  doc.text(`Échéance: ${invoice.due_date}`)
  doc.moveDown()
  doc.text('Lignes:')
  items.forEach((item) => {
    doc.text(`${item.description} - ${item.quantity} x ${item.unit_price} = ${item.amount}`)
  })
  doc.moveDown()
  doc.text(`Total: ${invoice.total} ${invoice.currency}`)
  doc.moveDown()
  doc.text('Mentions légales: ...')

  doc.end()

  return endPromise
}
