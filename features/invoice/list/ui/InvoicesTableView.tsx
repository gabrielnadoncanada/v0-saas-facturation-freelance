import { DataTable, Column } from "@/components/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Eye, MoreHorizontal, Trash, Download } from "lucide-react"
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
import { formatCurrency, formatDate, getInvoiceStatusColor } from "@/shared/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Invoice } from "@/features/invoice/shared/types/invoice.types"

interface InvoicesTableViewProps {
  filteredInvoices: Invoice[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (open: boolean) => void
  invoiceToDelete: string | null
  setInvoiceToDelete: (id: string | null) => void
  handleDelete: () => void
  getStatusLabel: (status: string) => string
  router: any
}

export function InvoicesTableView({
  filteredInvoices,
  searchTerm,
  setSearchTerm,
  deleteDialogOpen,
  setDeleteDialogOpen,
  invoiceToDelete,
  setInvoiceToDelete,
  handleDelete,
  getStatusLabel,
  router,
}: InvoicesTableViewProps) {
  const columns: Column<Invoice>[] = [
    {
      header: "Numéro",
      className: "px-3 py-3.5 sm:px-6",
      cell: (invoice) => invoice.invoice_number,
    },
    {
      header: "Client",
      className: "px-3 py-3.5 sm:px-6",
      cell: (invoice) => invoice.client.name,
    },
    {
      header: "Date",
      className: "px-3 py-3.5 sm:px-6",
      cell: (invoice) => formatDate(invoice.issue_date as string),
    },
    {
      header: "Échéance",
      className: "px-3 py-3.5 sm:px-6",
      cell: (invoice) => formatDate(invoice.due_date as string),
    },
    {
      header: "Montant",
      className: "px-3 py-3.5 sm:px-6",
      cell: (invoice) => formatCurrency(invoice.total, invoice.currency),
    },
    {
      header: "Statut",
      className: "px-3 py-3.5 sm:px-6",
      cell: (invoice) => (
        <Badge className={getInvoiceStatusColor(invoice.status)}>
          {getStatusLabel(invoice.status)}
        </Badge>
      ),
    },
    {
      header: "",
      className: "w-[100px] px-3 py-3.5 sm:px-6",
      cell: (invoice) => (
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
                router.push(`/dashboard/invoices/${invoice.id}`)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/dashboard/invoices/${invoice.id}/edit`)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={`/api/invoices/${invoice.id}/pdf`}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                setInvoiceToDelete(invoice.id)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        items={filteredInvoices}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        searchPlaceholder="Rechercher des factures..."
        noDataText="Aucune facture trouvée."
        columns={columns}
        getRowProps={(invoice) => ({
          className: "cursor-pointer",
          onClick: () => router.push(`/dashboard/invoices/${invoice.id}`),
        })}
      />
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Aucune facture trouvée.</div>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card
              key={invoice.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{invoice.invoice_number}</CardTitle>
                    <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
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
                          router.push(`/dashboard/invoices/${invoice.id}`)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/invoices/${invoice.id}/edit`)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={`/api/invoices/${invoice.id}/pdf`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger PDF
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          setInvoiceToDelete(invoice.id)
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
                  <Badge className={getInvoiceStatusColor(invoice.status)}>{getStatusLabel(invoice.status)}</Badge>
                  <span className="font-medium">{formatCurrency(invoice.total, invoice.currency)}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{formatDate(invoice.issue_date as string)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Échéance:</span>
                    <span>{formatDate(invoice.due_date as string)}</span>
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
              Cette action ne peut pas être annulée. Cela supprimera définitivement la facture et toutes les données
              associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 