import React from "react"
import { formatCurrency, formatDate } from "@/shared/lib/utils"
import type { Payment } from "@/shared/types/payments/payment"

export function InvoicePaymentsTable({ payments, currency }: { payments: Payment[]; currency: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Méthode</th>
            <th className="px-4 py-2 text-right">Montant</th>
            <th className="px-4 py-2 text-left">Notes</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b">
              <td className="px-4 py-2">{formatDate(payment.payment_date as string)}</td>
              <td className="px-4 py-2">
                {payment.payment_method === "card" && "Carte bancaire"}
                {payment.payment_method === "cash" && "Espèces"}
                {payment.payment_method === "transfer" && "Virement"}
                {payment.payment_method === "stripe" && "Stripe"}
              </td>
              <td className="px-4 py-2 text-right">{formatCurrency(payment.amount, currency)}</td>
              <td className="px-4 py-2">{payment.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 