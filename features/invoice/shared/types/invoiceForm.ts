export interface InvoiceFormProps {
  clients: any[]
  invoice?: any
  invoiceItems?: any[]
  defaultCurrency?: string
}

export interface SortableInvoiceItemProps {
  item: any
  index: number
  handleItemChange: (index: number, name: string, value: any) => void
  removeItem: (index: number) => void
  currency: string
  isLast: boolean
  userId: string | undefined
  globalTaxRate: number
} 