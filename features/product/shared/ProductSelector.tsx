"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/shared/lib/supabase/client"
import { cn } from "@/shared/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductForm } from "./ProductForm"

interface ProductSelectorProps {
  userId: string
  onSelect: (product: any) => void
  buttonClassName?: string
}

export function ProductSelector({ userId, onSelect, buttonClassName }: ProductSelectorProps) {
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const supabase = createClient()

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true })

      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductCreated = () => {
    fetchProducts()
    setDialogOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", buttonClassName)}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sélectionner un produit
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]">
          <Command>
            <CommandInput placeholder="Rechercher un produit..." />
            <CommandList>
              <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
              <CommandGroup>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.id}
                    onSelect={() => {
                      onSelect(product)
                      setOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {product.price.toFixed(2)} € {product.is_service ? "(Service)" : "(Produit)"}
                      </span>
                    </div>
                    <Check className="ml-auto h-4 w-4 opacity-0" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="p-1 border-t">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nouveau produit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un produit</DialogTitle>
                  </DialogHeader>
                  <ProductForm product={null} />
                </DialogContent>
              </Dialog>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
