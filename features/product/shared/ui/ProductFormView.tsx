import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { ProductFormSchema } from "../hooks/useProductForm"
import { UseFormReturn } from "react-hook-form"
import React from "react"

interface ProductFormViewProps {
  form: UseFormReturn<ProductFormSchema>
  isLoading: boolean
  error: string | null
  categories: { id: string; name: string; color?: string }[]
  isLoadingCategories: boolean
  onSubmit: (values: ProductFormSchema) => void
  onOpenCategoryModal: () => void
}

export const ProductFormView: React.FC<ProductFormViewProps> = ({
  form,
  isLoading,
  error,
  categories,
  isLoadingCategories,
  onSubmit,
  onOpenCategoryModal,
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom *</FormLabel>
            <FormControl>
              <Input placeholder="Nom du produit" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Description du produit" rows={3} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FormLabel>Catégorie</FormLabel>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-2 text-xs"
            type="button"
            onClick={onOpenCategoryModal}
          >
            <Plus className="h-3 w-3" />
            Nouvelle catégorie
          </Button>
        </div>
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <Select
                value={field.value ?? ""}
                onValueChange={(value) => field.onChange(value === "none" ? null : value)}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Aucune catégorie</SelectItem>
                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color || "#94a3b8" }} />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Prix du produit"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? "" : Number.parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tax_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taux de TVA (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Taux de TVA"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? "" : Number.parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="is_service"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="is_service"
              />
            </FormControl>
            <FormLabel htmlFor="is_service">C'est un service (et non un produit)</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Ajouter / Mettre à jour
      </Button>
    </form>
  </Form>
) 