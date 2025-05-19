import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Package, MoreHorizontal, Pencil, Trash2, Tag } from "lucide-react"
import { formatCurrency } from "@/shared/lib/utils"
import { Product } from "@/features/product/shared/types/product.types"

interface ProductsTableViewProps {
  products: Product[]
  deleteId: string | null
  setDeleteId: (id: string | null) => void
  isDeleting: boolean
  handleDelete: () => void
  router: any
}

export function ProductsTableView({
  products,
  deleteId,
  setDeleteId,
  isDeleting,
  handleDelete,
  router,
}: ProductsTableViewProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Package className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Aucun produit</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Vous n'avez pas encore ajouté de produits ou services à votre catalogue.
        </p>
        <Link href="/dashboard/products/new">
          <Button>Ajouter un produit</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Catégorie</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  {product.is_service ? (
                    <span className="flex items-center text-blue-600">
                      <Tag className="mr-1 h-4 w-4" />
                      Service
                    </span>
                  ) : (
                    <span className="flex items-center text-green-600">
                      <Package className="mr-1 h-4 w-4" />
                      Produit
                    </span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {"category" in product && product.category ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: (product.category as any).color || "#94a3b8" }}
                      />
                      <span>{(product.category as any).name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                <TableCell className="text-right">{product.tax_rate}%</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(product.id || "")}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera définitivement supprimé de votre catalogue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 