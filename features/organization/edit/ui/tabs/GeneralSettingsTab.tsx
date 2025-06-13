'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { OrganizationSettingsFormValues } from '../../hooks/useOrganizationSettingsForm';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface GeneralSettingsTabProps {
  form: UseFormReturn<OrganizationSettingsFormValues>;
  currentLogoUrl?: string;
  onLogoUpload?: (file: File) => Promise<string>;
  onLogoDelete?: () => Promise<void>;
}

const currencies = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dollar américain ($)' },
  { value: 'GBP', label: 'Livre sterling (£)' },
  { value: 'CHF', label: 'Franc suisse (CHF)' },
  { value: 'CAD', label: 'Dollar canadien (CAD)' },
];

export function GeneralSettingsTab({ form, currentLogoUrl, onLogoUpload, onLogoDelete }: GeneralSettingsTabProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(currentLogoUrl || null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onLogoUpload) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Le fichier ne doit pas dépasser 2MB');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const logoUrl = await onLogoUpload(file);
      setLogoPreview(logoUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement du logo:', error);
      alert('Erreur lors du téléchargement du logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!onLogoDelete) return;
    
    try {
      await onLogoDelete();
      setLogoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du logo:', error);
      alert('Erreur lors de la suppression du logo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Logo de l'organisation</CardTitle>
          <CardDescription>
            Téléchargez le logo de votre organisation qui apparaîtra sur vos factures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {logoPreview ? (
                <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                  <Image
                    src={logoPreview}
                    alt="Logo de l'organisation"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploadingLogo ? 'Téléchargement...' : 'Télécharger'}
                </Button>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLogoDelete}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Formats acceptés: PNG, JPG, SVG. Taille max: 2MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
          <CardDescription>
            Configurez les paramètres de base de votre organisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="default_currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devise par défaut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une devise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="default_tax_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux de TVA par défaut (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="default_payment_terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conditions de paiement (jours)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="365"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="late_fee_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frais de retard (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 