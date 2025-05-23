"use client"

import React, { useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Search } from "lucide-react"

export type Column<T> = {
  header: string
  accessorKey: keyof T | ((item: T) => React.ReactNode)
  cell?: (item: T) => React.ReactNode
  className?: string
  hide?: "mobile" | "never" | "always"
}

export type Action<T> = {
  label: string
  icon?: React.ReactNode
  onClick?: (item: T) => void
  className?: string
}

export type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  idField?: keyof T
  onRowClick?: (item: T) => void
  searchPlaceholder?: string
  searchFields?: (keyof T)[]
  emptyState?: React.ReactNode
  deleteAction?: {
    title: string
    description: string
    onDelete: (id: string) => Promise<void> | void
    isDeleting?: boolean
    deleteError?: string | null
  }
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  idField = "id" as keyof T,
  onRowClick,
  searchPlaceholder = "Rechercher...",
  searchFields,
  emptyState,
  deleteAction,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const filteredData = searchTerm && searchFields
    ? data.filter((item) =>
        searchFields.some((field) => {
          const value = item[field]
          return value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    : data

  const handleDelete = async () => {
   
    if (!itemToDelete || !deleteAction) return

    await deleteAction.onDelete(itemToDelete)
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const renderActions = (item: T) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {actions?.map((action, index) => (
          <React.Fragment key={index}>
            <DropdownMenuItem
              className={action.className}
              onClick={(e) => {
                e.stopPropagation()
                if (action.label.toLowerCase() === "supprimer" && deleteAction) {
                  console.log(item)
                  setItemToDelete(String(item[idField]))
                  setDeleteDialogOpen(true)
                } else {
                  action.onClick?.(item)
                }
              }}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
            {index < actions.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (filteredData.length === 0) {
    return emptyState || (
      <div className="text-center py-8 text-muted-foreground">
        {searchTerm ? "Aucun résultat trouvé." : "Aucune donnée disponible."}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {searchFields && (
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-md border hidden md:block">
        <div className="inline-block min-w-full align-middle sm:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.filter(c => c.hide !== "always").map((column, i) => (
                  <TableHead key={i} className={column.className || "px-3 py-3.5 sm:px-6"}>
                    {column.header}
                  </TableHead>
                ))}
                {actions && <TableHead className="w-[100px] px-3 py-3.5 sm:px-6" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow
                  key={String(item[idField])}
                  className={onRowClick ? "cursor-pointer" : ""}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {columns.filter(c => c.hide !== "always").map((column, i) => (
                    <TableCell key={i} className={column.className || "px-3 py-4 sm:px-6"}>
                      {column.cell
                        ? column.cell(item)
                        : typeof column.accessorKey === "function"
                          ? column.accessorKey(item)
                          : item[column.accessorKey] || "-"}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="px-3 py-4 sm:px-6">
                      {renderActions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredData.map((item) => (
          <Card key={String(item[idField])} className={onRowClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">
                  {columns[0].cell
                    ? columns[0].cell(item)
                    : typeof columns[0].accessorKey === "function"
                      ? columns[0].accessorKey(item)
                      : item[columns[0].accessorKey] || "-"}
                </CardTitle>
                {actions && renderActions(item)}
              </div>
            </CardHeader>
            <CardContent className="pb-4 pt-0">
              <div className="text-sm space-y-1">
                {columns.slice(1)
                  .filter((col) => col.hide !== "always" && col.hide !== "mobile")
                  .map((column, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-muted-foreground">{column.header}:</span>
                      <span>
                        {column.cell
                          ? column.cell(item)
                          : typeof column.accessorKey === "function"
                            ? column.accessorKey(item)
                            : item[column.accessorKey] || "-"}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete modal */}
      {deleteAction && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteAction.title}</AlertDialogTitle>
              <AlertDialogDescription>{deleteAction.description}</AlertDialogDescription>
            </AlertDialogHeader>
            {deleteAction.deleteError && (
              <div className="text-red-600 text-sm mt-2">{deleteAction.deleteError}</div>
            )}
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel disabled={deleteAction.isDeleting}>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteAction.isDeleting}
              >
                {deleteAction.isDeleting ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
