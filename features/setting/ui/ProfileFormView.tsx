"use client"

import type { ProfileFormValues } from "@/features/setting/hooks/useProfileForm"
import type { UseFormReturn } from "react-hook-form"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Check, Loader2, Trash, Upload } from "lucide-react"

interface ProfileFormViewProps {
  form: UseFormReturn<ProfileFormValues>
  isLoading: boolean
  isUploading: boolean
  logoUrl: string
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onSubmit: (data: ProfileFormValues) => Promise<void>
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleLogoDelete: () => Promise<void>
  profile: any
}

export function ProfileFormView({
  form,
  isLoading,
  isUploading,
  logoUrl,
  fileInputRef,
  onSubmit,
  handleLogoUpload,
  handleLogoDelete,
  profile,
}: ProfileFormViewProps) {
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