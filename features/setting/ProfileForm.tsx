"use client"

import type React from "react"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Check, Loader2, Trash, Upload } from "lucide-react"
import { updateUserProfileAction } from "@/features/setting/updateUserProfile.action"
import { uploadLogoAction } from "@/features/setting/uploadLogo.action"
import { deleteLogoAction } from "@/features/setting/deleteLogo.action"
import { useToast } from "@/shared/hooks/use-toast"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  company_name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  default_currency: z.string(),
  tax_rate: z.coerce.number().min(0).max(100).optional(),
  tax_id: z.string().optional(),
  website: z.string().url({ message: "Veuillez entrer une URL valide" }).optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  profile: any
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [logoUrl, setLogoUrl] = useState(profile?.logo_url || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const defaultValues: Partial<ProfileFormValues> = {
    name: profile?.name || "",
    email: profile?.email || "",
    company_name: profile?.company_name || "",
    address: profile?.address || "",
    phone: profile?.phone || "",
    default_currency: profile?.default_currency || "EUR",
    tax_rate: profile?.tax_rate || 0,
    tax_id: profile?.tax_id || "",
    website: profile?.website || "",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString())
      }
    })

    const result = await updateUserProfileAction(formData)

    setIsLoading(false)

    if (result.success) {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      })
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    setIsUploading(true)

    const formData = new FormData()
    formData.append("logo", e.target.files[0])

    const result = await uploadLogoAction(formData)

    setIsUploading(false)

    if (result.success && result.logoUrl) {
      setLogoUrl(result.logoUrl)
      toast({
        title: "Logo mis à jour",
        description: "Votre logo a été mis à jour avec succès.",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue lors de l'upload du logo.",
        variant: "destructive",
      })
    }
  }

  const handleLogoDelete = async () => {
    setIsUploading(true)

    const result = await deleteLogoAction()

    setIsUploading(false)

    if (result.success) {
      setLogoUrl("")
      toast({
        title: "Logo supprimé",
        description: "Votre logo a été supprimé avec succès.",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Une erreur est survenue lors de la suppression du logo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
        <TabsTrigger value="business">Informations professionnelles</TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Gérez vos informations personnelles. Ces informations seront affichées publiquement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={logoUrl || "/placeholder.svg"} alt="Logo" />
                      <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          Changer le logo
                        </Button>
                        {logoUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={handleLogoDelete}
                            disabled={isUploading}
                          >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                            Supprimer
                          </Button>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleLogoUpload}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. 2MB maximum.</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="exemple@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="+33 6 12 34 56 78" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="business">
        <Card>
          <CardHeader>
            <CardTitle>Informations professionnelles</CardTitle>
            <CardDescription>
              Gérez les informations de votre entreprise. Ces informations apparaîtront sur vos factures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l&apos;entreprise</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de votre entreprise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse de votre entreprise" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site web</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="tax_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de TVA</FormLabel>
                        <FormControl>
                          <Input placeholder="FR12345678901" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="default_currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Devise par défaut</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une devise" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="CAD">CAD ($)</SelectItem>
                              <SelectItem value="CHF">CHF (Fr)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tax_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Taux de TVA par défaut (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" max="100" {...field} />
                          </FormControl>
                          <FormDescription>Taux de TVA appliqué par défaut sur vos factures.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
