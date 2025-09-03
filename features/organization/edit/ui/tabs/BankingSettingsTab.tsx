'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { OrganizationSettingsFormValues } from '@/features/organization/edit/hooks/useOrganizationSettingsForm';

interface BankingSettingsTabProps {
  form: UseFormReturn<OrganizationSettingsFormValues>;
}

export function BankingSettingsTab({ form }: BankingSettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations bancaires</CardTitle>
        <CardDescription>Configurez vos informations bancaires pour les factures</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la banque</FormLabel>
              <FormControl>
                <Input placeholder="Banque Populaire" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bankAccountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de compte</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bankIban"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IBAN</FormLabel>
                <FormControl>
                  <Input placeholder="FR76 1234 5678 9012 3456 7890 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bankSwift"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code SWIFT/BIC</FormLabel>
              <FormControl>
                <Input placeholder="CCBPFRPPXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">💡 Conseil</h4>
          <p className="text-sm text-muted-foreground">
            Ces informations bancaires apparaîtront sur vos factures pour faciliter les paiements de
            vos clients. Assurez-vous qu'elles sont correctes et à jour.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
