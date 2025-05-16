import React from "react"
import { formatCurrency } from "@/shared/lib/utils"
import type { InvoiceItem } from "@/shared/types/invoices/invoice"

export function InvoiceLinesTable({ invoiceItems, currency }: { invoiceItems: InvoiceItem[]; currency: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-right">Quantité</th>
            <th className="px-4 py-2 text-right">Prix unitaire</th>
            <th className="px-4 py-2 text-right">TVA (%)</th>
            <th className="px-4 py-2 text-right">Montant</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="px-4 py-2">{item.description}</td>
              <td className="px-4 py-2 text-right">{item.quantity}</td>
              <td className="px-4 py-2 text-right">{formatCurrency(item.unit_price, currency)}</td>
              <td className="px-4 py-2 text-right">{item.tax_rate}%</td>
              <td className="px-4 py-2 text-right">{formatCurrency(item.amount, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 