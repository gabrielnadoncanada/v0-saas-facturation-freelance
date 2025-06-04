import React, { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ClientForm } from '@/features/client/shared/ui/ClientForm';
import { useCreateClientInlineForm } from '@/features/client/create/hooks/useCreateClientInlineForm';
import { DatePicker } from '@/components/ui/date-picker';
import { Percent, Plus } from 'lucide-react';

import type { InvoiceFormValues } from '@/features/invoice/shared/hooks/useInvoiceForm';

interface Client {
  id: string;
  name: string;
}

type InvoiceGeneralFieldsProps<T extends FieldValues = InvoiceFormValues> = {
  control: Control<T>;
  clients: Client[];
  onClientCreated: (client: Client) => void;
};

export function InvoiceGeneralFields<T extends FieldValues = InvoiceFormValues>({
  control,
  clients,
  onClientCreated,
}: InvoiceGeneralFieldsProps<T>) {
  const [open, setOpen] = useState(false);
  const { isLoading, error, defaultValues, onSubmit } = useCreateClientInlineForm((client) => {
    onClientCreated(client);
    setOpen(false);
  });

  return (
    <>
      <FormField
        control={control}
        name={'client_id' as Path<T>}
        rules={{ required: 'Le client est requis' }}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel>Client *</FormLabel>
            </div>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange} required>
                <SelectTrigger id="client_id">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: Client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name={'issue_date' as Path<T>}
          rules={{ required: "Date d'émission requise" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'émission</FormLabel>
              <FormControl>
                <DatePicker date={field.value ?? new Date()} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={'due_date' as Path<T>}
          rules={{ required: "Date d'échéance requise" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'échéance</FormLabel>
              <FormControl>
                <DatePicker date={field.value ?? new Date()} setDate={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name={'status' as Path<T>}
          rules={{ required: 'Statut requis' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyée</SelectItem>
                    <SelectItem value="paid">Payée</SelectItem>
                    <SelectItem value="overdue">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={'currency' as Path<T>}
          rules={{ required: 'Devise requise' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Devise</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar US ($)</SelectItem>
                    <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                    <SelectItem value="CAD">Dollar Canadien (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={'tax_rate' as Path<T>}
        rules={{ required: 'Taux de TVA requis' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taux de TVA global (%)</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  {...field}
                  value={field.value}
                  placeholder="Taux de TVA"
                  className="pl-9 h-10 bg-background focus-visible:ring-primary/30"
                />
                <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={'notes' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={4}
                placeholder="Conditions de paiement, informations supplémentaires..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
