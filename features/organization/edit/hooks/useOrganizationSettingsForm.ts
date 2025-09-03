'use client';

import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  organizationSettingsSchema,
  OrganizationSettingsSchema,
} from '@/features/organization/edit/schema/organization-settings.schema';
import { updateOrganizationSettingsAction } from '@/features/organization/edit/actions/updateOrganizationSettings.action';
import { useToast } from '@/shared/hooks/use-toast';
import type { OrganizationSettings } from '@/shared/lib/drizzle/types';

export type OrganizationSettingsFormValues = OrganizationSettingsSchema;

interface UseOrganizationSettingsFormProps {
  settings: OrganizationSettings | null;
}

export function useOrganizationSettingsForm({ settings }: UseOrganizationSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  // Default values for new organization settings
  const defaultValues: OrganizationSettingsFormValues = {
    defaultCurrency: 'EUR',
    defaultTaxRate: 20,
    invoicePrefix: 'INV',
    invoiceNumberFormat: '{prefix}-{year}-{number:4}',
    nextInvoiceNumber: 1,
    defaultPaymentTerms: 30,
    lateFeePercentage: 0,
    companyAddress: '',
    companyCity: '',
    companyPostalCode: '',
    companyCountry: '',
    companyPhone: '',
    companyEmail: '',
    companyWebsite: '',
    companyTaxNumber: '',
  };

  const form = useForm<OrganizationSettingsFormValues>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: settings
      ? {
          defaultCurrency: settings.defaultCurrency,
          defaultTaxRate:
            typeof settings.defaultTaxRate === 'string'
              ? parseFloat(settings.defaultTaxRate)
              : settings.defaultTaxRate,
          invoicePrefix: settings.invoicePrefix,
          invoiceNumberFormat: settings.invoiceNumberFormat,
          nextInvoiceNumber: settings.nextInvoiceNumber,
          defaultPaymentTerms: settings.defaultPaymentTerms,
          lateFeePercentage:
            typeof settings.lateFeePercentage === 'string'
              ? parseFloat(settings.lateFeePercentage)
              : settings.lateFeePercentage,
          companyAddress: settings.companyAddress || '',
          companyCity: settings.companyCity || '',
          companyPostalCode: settings.companyPostalCode || '',
          companyCountry: settings.companyCountry || '',
          companyPhone: settings.companyPhone || '',
          companyEmail: settings.companyEmail || '',
          companyWebsite: settings.companyWebsite || '',
          companyTaxNumber: settings.companyTaxNumber || '',
        }
      : defaultValues,
  });

  const handleSubmit = async (data: OrganizationSettingsFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await updateOrganizationSettingsAction(data);

      if (result.success) {
        toast({
          title: 'Paramètres mis à jour',
          description: "Les paramètres de l'organisation ont été mis à jour avec succès.",
        });
      } else {
        toast({
          title: 'Erreur',
          description: result.error || 'Une erreur est survenue lors de la mise à jour.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    formRef,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
