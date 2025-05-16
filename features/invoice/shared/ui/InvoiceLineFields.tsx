import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Plus } from "lucide-react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

interface InvoiceLineFieldsProps {
  fields: any[]
  control: any
  append: (item: any) => void
  remove: (index: number) => void
  move: (from: number, to: number) => void
  sensors: any
  handleDragEnd: (event: any) => void
  tax_rate: number
  currency: string
}

export function InvoiceLineFields({ fields, control, append, remove, move, sensors, handleDragEnd, tax_rate, currency }: InvoiceLineFieldsProps) {
  return (
    <div className="overflow-hidden">
      <div className="flex flex-row items-center justify-between bg-muted/30 p-4">
        <div className="font-semibold">Lignes de facture</div>
        <Button type="button" variant="outline" size="sm" onClick={() => append({ id: "new-item-" + Date.now(), description: "", quantity: 1, unit_price: 0, tax_rate, amount: 0, isNew: true })} className="bg-card hover:bg-background">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une ligne
        </Button>
      </div>
      <div className="p-4 pb-0">
        <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:mb-2 md:px-3">
          <div className="col-span-1"></div>
          <div className="col-span-6 text-sm font-medium text-muted-foreground">Description</div>
          <div className="col-span-2 text-sm font-medium text-muted-foreground">Quantité</div>
          <div className="col-span-2 text-sm font-medium text-muted-foreground">Prix unitaire</div>
          <div className="col-span-1"></div>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <div>
              {fields.map((item, index) => (
                <div key={item.id} className="mb-2">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <FormField
                        control={control}
                        name={`items.${index}.description`}
                        rules={{ required: "Description requise" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={control}
                        name={`items.${index}.quantity`}
                        rules={{ required: "Quantité requise", min: { value: 1, message: "Min 1" } }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantité</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={control}
                        name={`items.${index}.unit_price`}
                        rules={{ required: "Prix unitaire requis", min: { value: 0, message: "Min 0" } }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prix unitaire</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} step={0.01} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <Button type="button" variant="ghost" onClick={() => remove(index)} disabled={fields.length === 1}>
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="md:hidden mt-4 mb-4">
          <Button type="button" variant="outline" className="w-full bg-card hover:bg-background" onClick={() => append({ id: "new-item-" + Date.now(), description: "", quantity: 1, unit_price: 0, tax_rate, amount: 0, isNew: true })}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne
          </Button>
        </div>
      </div>
    </div>
  )
} 