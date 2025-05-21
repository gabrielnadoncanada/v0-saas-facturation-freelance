import { NextRequest } from 'next/server'
import { generateInvoicePdf } from '@/features/invoice/pdf/model/generateInvoicePdf'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { buffer, invoiceNumber } = await generateInvoicePdf(params.id)

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${invoiceNumber}.pdf`,
    },
  })
}
