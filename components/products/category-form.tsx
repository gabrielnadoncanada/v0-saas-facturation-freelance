"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

// Liste de couleurs prédéfinies pour les catégories
const PREDEFINED_COLORS = [
  "#f87171", // red
  "#fb923c", // orange
  "#facc15", // yellow
  "#4ade80", // green
  "#60a5fa", // blue
  "#a78bfa", // purple
  "#f472b6", // pink
  "#94a3b8", // slate
]

interface CategoryFormUIProps {
  userId: string
  category?: any
  isModal?: boolean
  onSuccess?: (categoryId: string | null) => void
  createCategoryAction: (formData: any) => Promise<{ error: string | null; success: boolean; id: string | null }>
  updateCategoryAction?: (id: string, formData: any) => Promise<{ error: string | null; success: boolean }>
}

export function CategoryForm({
  userId,
  category,
  isModal = false,
  onSuccess,
  createCategoryAction,
  updateCategoryAction,
}: CategoryFormUIProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    color: category?.color || PREDEFINED_COLORS[0],
  })

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result =
        category && updateCategoryAction
          ? await updateCategoryAction(category.id, formData)
          : await createCategoryAction(formData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      // Success handling
      setIsLoading(false)

      if (isModal) {
        setSuccess("Catégorie créée avec succès!")
        // Reset form if in modal
        setFormData({
          name: "",
          description: "",
          color: PREDEFINED_COLORS[0],
        })

        // Call onSuccess after a short delay to allow the user to see the success message
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result.id || null)
          }
        }, 500)
      } else if (onSuccess) {
        onSuccess(result.id || null)
      } else {
        // Use router.push instead of redirect
        router.push("/dashboard/products/categories")
        router.refresh()
      }
    } catch (err: any) {
      console.error("Unexpected error:", err)
      setError(err.message || "Une erreur inattendue est survenue")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
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
        <Label>Couleur</Label>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`h-8 w-8 rounded-full border-2 ${
                formData.color === color ? "border-black dark:border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleChange("color", color)}
              aria-label={`Couleur ${color}`}
            />
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {category ? "Mettre à jour" : "Ajouter"}
      </Button>
    </form>
  )
}
