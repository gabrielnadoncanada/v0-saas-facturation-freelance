'use client';

import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { organizationSettingsSchema, OrganizationSettingsSchema } from '../schema/organization-settings.schema';
import { updateOrganizationSettingsAction } from '../actions/updateOrganizationSettings.action';
import { useToast } from '@/shared/hooks/use-toast';
import type { OrganizationSettings } from '../types/organization-settings.types';

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
    default_currency: 'EUR',
    default_tax_rate: 20,
    invoice_prefix: 'INV',
    invoice_number_format: '{prefix}-{year}-{number:4}',
    next_invoice_number: 1,
    default_payment_terms: 30,
    late_fee_percentage: 0,
    company_address: '',
    company_city: '',
    company_postal_code: '',
    company_country: '',
    company_phone: '',
    company_email: '',
    company_website: '',
    company_tax_number: '',
  };

  const form = useForm<OrganizationSettingsFormValues>({
    resolver: zodResolver(organizationSettingsSchema),
    defaultValues: settings ? {
      default_currency: settings.default_currency,
      default_tax_rate: settings.default_tax_rate,
      invoice_prefix: settings.invoice_prefix,
      invoice_number_format: settings.invoice_number_format,
      next_invoice_number: settings.next_invoice_number,
      default_payment_terms: settings.default_payment_terms,
      late_fee_percentage: settings.late_fee_percentage,
      company_address: settings.company_address || '',
      company_city: settings.company_city || '',
      company_postal_code: settings.company_postal_code || '',
      company_country: settings.company_country || '',
      company_phone: settings.company_phone || '',
      company_email: settings.company_email || '',
      company_website: settings.company_website || '',
      company_tax_number: settings.company_tax_number || '',
    } : defaultValues,
  });

  const handleSubmit = async (data: OrganizationSettingsFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await updateOrganizationSettingsAction(data);

      if (result.success) {
        toast({
          title: 'Paramètres mis à jour',
          description: 'Les paramètres de l\'organisation ont été mis à jour avec succès.',
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