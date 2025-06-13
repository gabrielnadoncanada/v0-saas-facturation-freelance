'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save, Settings, FileText, Building } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { OrganizationSettingsFormValues } from '../hooks/useOrganizationSettingsForm';
import { GeneralSettingsTab, InvoicingSettingsTab, CompanySettingsTab } from './tabs';

interface OrganizationSettingsFormViewProps {
  form: UseFormReturn<OrganizationSettingsFormValues>;
  formRef: React.RefObject<HTMLFormElement | null>;
  isSubmitting: boolean;
  handleSubmit: () => void;
  currentLogoUrl?: string;
  onLogoUpload?: (file: File) => Promise<string>;
  onLogoDelete?: () => Promise<void>;
}

export function OrganizationSettingsFormView({
  form,
  formRef,
  isSubmitting,
  handleSubmit,
  currentLogoUrl,
  onLogoUpload,
  onLogoDelete,
}: OrganizationSettingsFormViewProps) {
  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="invoicing" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Facturation
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Entreprise
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <GeneralSettingsTab 
              form={form} 
              currentLogoUrl={currentLogoUrl}
              onLogoUpload={onLogoUpload}
              onLogoDelete={onLogoDelete}
            />
          </TabsContent>

          {/* Invoice Settings Tab */}
          <TabsContent value="invoicing" className="space-y-6">
            <InvoicingSettingsTab form={form} />
          </TabsContent>

          {/* Company Information Tab */}
          <TabsContent value="company" className="space-y-6">
            <CompanySettingsTab form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les paramètres
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
} 