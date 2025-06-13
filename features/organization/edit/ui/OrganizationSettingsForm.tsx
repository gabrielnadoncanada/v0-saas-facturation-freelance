'use client';

import { useOrganizationSettingsForm } from '../hooks/useOrganizationSettingsForm';
import { OrganizationSettingsFormView } from './OrganizationSettingsFormView';
import { OrganizationSettings } from '../types/organization-settings.types';
import { uploadLogoAction } from '../actions/uploadLogo.action';
import { deleteLogoAction } from '../actions/deleteLogo.action';
import { useToast } from '@/shared/hooks/use-toast';
import { Organization } from '@/shared/types/organization.types';

interface OrganizationSettingsFormProps {
  settings: OrganizationSettings | null;
  organization?: Organization;
}

export function OrganizationSettingsForm({ settings, organization }: OrganizationSettingsFormProps) {
  const formProps = useOrganizationSettingsForm({ settings });
  const { toast } = useToast();

  const handleLogoUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const result = await uploadLogoAction(formData);
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors du téléchargement');
    }
    
    toast({
      title: 'Logo téléchargé',
      description: 'Le logo a été téléchargé avec succès.',
    });
    
    return result.data;
  };

  const handleLogoDelete = async (): Promise<void> => {
    const result = await deleteLogoAction();
    
    if (!result.success) {
      throw new Error(result.error || 'Erreur lors de la suppression');
    }
    
    toast({
      title: 'Logo supprimé',
      description: 'Le logo a été supprimé avec succès.',
    });
  };

  return (
    <OrganizationSettingsFormView 
      {...formProps} 
      currentLogoUrl={organization?.logo_url}
      onLogoUpload={handleLogoUpload}
      onLogoDelete={handleLogoDelete}
    />
  );
} 