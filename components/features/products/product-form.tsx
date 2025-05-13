"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CategoryForm } from "./category-form"

interface ProductFormProps {
  userId: string
  product?: any
  onSuccess?: () => void
}

export function ProductForm({ userId, product, onSuccess }: ProductFormProps) {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    tax_rate: product?.tax_rate || 20,
    is_service: product?.is_service || false,
    category_id: product?.category_id || "",
  })

  // Fetch categories when component mounts or after adding a new category
  const fetchCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true })

      if (error) {
        console.error("Error fetching categories:", error)
      } else {
        setCategories(data || [])
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [supabase, userId])

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategorySuccess = async () => {
    // Close the modal
    setIsCategoryModalOpen(false)

    // Refresh categories list
    await fetchCategories()

    // Show success message or notification if needed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validation
      if (!formData.name.trim()) {
        setError("Le nom du produit est requis")
        setIsLoading(false)
        return
      }

      if (formData.price < 0) {
        setError("Le prix ne peut pas être négatif")
        setIsLoading(false)
        return
      }

      const productData = {
        user_id: userId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price,
        tax_rate: formData.tax_rate,
        is_service: formData.is_service,
        category_id: formData.category_id === "none" ? null : formData.category_id || null,
        updated_at: new Date().toISOString(),
      }

      if (product) {
        // Update existing product
        const { error: updateError } = await supabase.from("products").update(productData).eq("id", product.id)

        if (updateError) {
          console.error("Error updating product:", updateError)
          setError(updateError.message || "Erreur lors de la mise à jour du produit")
          setIsLoading(false)
          return
        }
      } else {
        // Create new product
        productData.created_at = new Date().toISOString()

        const { error: insertError } = await supabase.from("products").insert(productData)

        if (insertError) {
          console.error("Error creating product:", insertError)
          setError(insertError.message || "Erreur lors de la création du produit")
          setIsLoading(false)
          return
        }
      }

      // Success handling
      setIsLoading(false)

      if (onSuccess) {
        onSuccess()
      } else {
        // If no onSuccess callback, redirect to products page
        router.push("/dashboard/products")
        router.refresh()
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("Une erreur inattendue est survenue")
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Nom *</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="category">Catégorie</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 px-2 text-xs"
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <Plus className="h-3 w-3" />
              Nouvelle catégorie
            </Button>
          </div>
          <Select value={formData.category_id} onValueChange={(value) => handleChange("category_id", value)}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Prix *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.1"
              value={formData.price ?? ""}
              onChange={(e) => {
                const raw = e.target.value
                handleChange("price", raw === "" ? "" : Number.parseFloat(e.target.value))
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax_rate">Taux de TVA (%)</Label>
            <Input
              id="tax_rate"
              type="number"
              min="0"
              step="0.1"
              value={formData.tax_rate ?? ""}
              onChange={(e) => {
                const raw = e.target.value
                handleChange("tax_rate", raw === "" ? "" : Number.parseFloat(raw))
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_service"
            checked={formData.is_service}
            onCheckedChange={(checked) => handleChange("is_service", checked)}
          />
          <Label htmlFor="is_service">C'est un service (et non un produit)</Label>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Mettre à jour" : "Ajouter"}
        </Button>
      </form>

      {/* Modal for adding a new category */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
          </DialogHeader>
          <CategoryForm userId={userId} onSuccess={handleCategorySuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
