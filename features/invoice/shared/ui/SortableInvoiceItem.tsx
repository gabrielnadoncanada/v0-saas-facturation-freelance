import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { GripVertical, Package, DollarSign, Trash, ChevronUp, ChevronDown } from "lucide-react"
import { ProductSelector } from "@/features/product/shared/ProductSelector"
import { formatCurrency, cn } from "@/shared/lib/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface SortableInvoiceItemProps {
  item: any
  index: number
  handleItemChange: (index: number, name: string, value: any) => void
  removeItem: (index: number) => void
  currency: string
  isLast: boolean
  userId: string | undefined
  globalTaxRate: number
}

export function SortableInvoiceItem({
  item,
  index,
  handleItemChange,
  removeItem,
  currency,
  isLast,
  userId,
  globalTaxRate,
}: SortableInvoiceItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const itemAmount = Number(item.quantity) * Number(item.unit_price)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  const handleProductSelect = (product: any) => {
    handleItemChange(index, "description", product.name + (product.description ? ` - ${product.description}` : ""))
    handleItemChange(index, "unit_price", product.price)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border border-border rounded-lg mb-3 transition-all duration-200",
        isDragging ? "shadow-lg ring-2 ring-primary/20" : "hover:border-primary/30",
        item.description ? "" : "border-dashed",
      )}
    >
      {/* Desktop View */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center md:p-4">
        <div className="col-span-1 flex justify-center cursor-move" {...attributes} {...listeners}>
          <div className="p-2 rounded-md hover:bg-muted transition-colors">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <div className="col-span-6">
          <div className="space-y-2">
            {userId && (
              <ProductSelector
                userId={userId}
                onSelect={handleProductSelect}
                buttonClassName="w-full mb-2 text-sm h-9 bg-background hover:bg-muted"
              />
            )}
            <div className="relative">
              <Input
                id={`desktop-item-${index}-description`}
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                placeholder="Description du produit ou service"
                className="pl-9 h-9 bg-background focus-visible:ring-primary/30"
                required
              />
              <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <Input
            id={`desktop-item-${index}-quantity`}
            type="number"
            min="0"
            step="0.01"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
            placeholder="Quantité"
            className="h-9 bg-background focus-visible:ring-primary/30 text-right"
            required
          />
        </div>

        <div className="col-span-2">
          <div className="relative">
            <Input
              id={`desktop-item-${index}-unit_price`}
              type="number"
              min="0"
              step="0.01"
              value={item.unit_price}
              onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
              placeholder="Prix unitaire"
              className="pl-9 h-9 bg-background focus-visible:ring-primary/30 text-right"
              required
            />
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="col-span-1 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            disabled={isLast}
            className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Supprimer</span>
          </Button>
        </div>
      </div>

      {/* Mobile View - Collapsible */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="cursor-move p-2 rounded-md hover:bg-muted transition-colors" {...attributes} {...listeners}>
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 truncate max-w-[180px] font-medium">{item.description || "Nouvelle ligne"}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">{formatCurrency(itemAmount, currency)}</div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-muted">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="px-4 pb-4 space-y-4 border-t border-border pt-4 bg-background/50 rounded-b-lg">
          <div className="space-y-2">
            {userId && (
              <ProductSelector
                userId={userId}
                onSelect={handleProductSelect}
                buttonClassName="w-full mb-2 text-sm h-10 bg-background hover:bg-muted"
              />
            )}
            <Label htmlFor={`mobile-item-${index}-description`} className="text-sm font-medium text-muted-foreground">
              Description
            </Label>
            <div className="relative">
              <Input
                id={`mobile-item-${index}-description`}
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                placeholder="Description du produit ou service"
                className="pl-9 h-10 bg-background focus-visible:ring-primary/30"
                required
              />
              <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`mobile-item-${index}-quantity`} className="text-sm font-medium text-muted-foreground">
                Quantité
              </Label>
              <Input
                id={`mobile-item-${index}-quantity`}
                type="number"
                min="0"
                step="0.01"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                placeholder="Quantité"
                className="h-10 bg-background focus-visible:ring-primary/30 text-right"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`mobile-item-${index}-unit_price`} className="text-sm font-medium text-muted-foreground">
                Prix unitaire
              </Label>
              <div className="relative">
                <Input
                  id={`mobile-item-${index}-unit_price`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                  placeholder="Prix unitaire"
                  className="pl-9 h-10 bg-background focus-visible:ring-primary/30 text-right"
                  required
                />
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(index)}
              disabled={isLast}
              className="h-9 rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>

          <div className="pt-3 border-t border-border mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Montant HT:</span>
              <span>{formatCurrency(itemAmount, currency)}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
} 