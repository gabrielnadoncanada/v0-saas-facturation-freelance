'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { OrganizationSettingsFormValues } from '../../hooks/useOrganizationSettingsForm';

interface InvoicingSettingsTabProps {
  form: UseFormReturn<OrganizationSettingsFormValues>;
}

export function InvoicingSettingsTab({ form }: InvoicingSettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de facturation</CardTitle>
        <CardDescription>
          Configurez la numérotation et le format de vos factures
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="invoice_prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Préfixe des factures</FormLabel>
                <FormControl>
                  <Input placeholder="INV" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoice_number_format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format de numérotation</FormLabel>
                <FormControl>
                  <Input placeholder="{prefix}-{year}-{number:4}" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="next_invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prochain numéro</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Aperçu du format</h4>
          <p className="text-sm text-muted-foreground">
            Exemple: {form.watch('invoice_prefix') || 'INV'}-2024-{String(form.watch('next_invoice_number') || 1).padStart(4, '0')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Variables disponibles: {'{prefix}'}, {'{year}'}, {'{month}'}, {'{number:X}'} (X = nombre de chiffres)
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 