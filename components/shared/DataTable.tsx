import { ReactNode } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface Column<T> {
  header: ReactNode
  cell: (item: T) => ReactNode
  className?: string
}

export interface DataTableProps<T> {
  items: T[]
  searchTerm: string
  onSearchTermChange: (term: string) => void
  columns: Column<T>[]
  searchPlaceholder?: string
  noDataText?: string
  getRowProps?: (item: T) => React.HTMLAttributes<HTMLTableRowElement>
}

export function DataTable<T>({
  items,
  searchTerm,
  onSearchTermChange,
  columns,
  searchPlaceholder = "Search...",
  noDataText = "No data found.",
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className={col.className}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {noDataText}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, rowIdx) => (
                <TableRow key={rowIdx} {...(getRowProps ? getRowProps(item) : {})}>
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx} className={col.className}>{col.cell(item)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
