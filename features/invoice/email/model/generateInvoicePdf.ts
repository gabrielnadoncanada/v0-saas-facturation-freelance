'use server'

// TODO: Implement proper PDF generation
export async function generateInvoicePdf(invoiceId: string): Promise<Buffer> {
  // Placeholder PDF content
  const content = `PDF for invoice ${invoiceId}`
  return Buffer.from(content)
}
