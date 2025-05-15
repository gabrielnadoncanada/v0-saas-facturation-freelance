"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Eye, MoreHorizontal, Search, Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatCurrency, formatDate } from "@/shared/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { deletePaymentAction } from "@/features/payment/delete/deletePayment.action"
import { Payment } from "@/shared/types/payments/payment"

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredPayments = payments.filter(
    (payment) =>
      payment.invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async () => {
    if (!paymentToDelete) return

    setIsDeleting(true)

    try {
      const result = await deletePaymentAction(paymentToDelete)

      if (result.success) {
        router.refresh()
      } else {
        // Handle error - could add toast notification here
        console.error(result.error)
      }
    } catch (error) {
      console.error("Failed to delete payment:", error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setPaymentToDelete(null)
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "card":
        return "Carte bancaire"
      case "cash":
        return "Espèces"
      case "transfer":
        return "Virement"
      case "stripe":
        return "Stripe"
      default:
        return method
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des paiements..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucun paiement trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/payments/${payment.id}`)}
                >
                  <TableCell className="font-medium">{payment.invoice.invoice_number}</TableCell>
                  <TableCell>{payment.invoice.client.name}</TableCell>
                  <TableCell>{formatDate(payment.payment_date as string)}</TableCell>
                  <TableCell>{formatCurrency(payment.amount, payment.invoice.currency)}</TableCell>
                  <TableCell>{getPaymentMethodLabel(payment.payment_method)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/payments/${payment.id}`)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/payments/${payment.id}/edit`)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPaymentToDelete(payment.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Aucun paiement trouvé.</div>
        ) : (
          filteredPayments.map((payment) => (
            <Card
              key={payment.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/dashboard/payments/${payment.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{payment.invoice.invoice_number}</CardTitle>
                    <p className="text-sm text-muted-foreground">{payment.invoice.client.name}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/payments/${payment.id}`)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/payments/${payment.id}/edit`)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPaymentToDelete(payment.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-4 pt-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{getPaymentMethodLabel(payment.payment_method)}</span>
                  <span className="font-medium">{formatCurrency(payment.amount, payment.invoice.currency)}</span>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{formatDate(payment.payment_date as string)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement ce paiement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
