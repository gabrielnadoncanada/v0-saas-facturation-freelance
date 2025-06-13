'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { CreateOrganizationForm } from './CreateOrganizationForm';

interface CreateOrganizationModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function CreateOrganizationModal({ 
  trigger, 
  onSuccess, 
  onError 
}: CreateOrganizationModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleError = (message: string) => {
    if (onError) {
      onError(message);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus className="mr-2 h-4 w-4" />
      Nouvelle organisation
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle organisation</DialogTitle>
          <DialogDescription>
            Créez une nouvelle organisation pour gérer vos projets et clients séparément.
          </DialogDescription>
        </DialogHeader>
        <CreateOrganizationForm
          onCancel={() => setOpen(false)}
          onError={handleError}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
} 