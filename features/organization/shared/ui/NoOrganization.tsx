'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { CreateOrganizationForm } from '../../create/ui/CreateOrganizationForm';

export function NoOrganization() {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bienvenue!</CardTitle>
          <CardDescription>
            Vous n&apos;avez pas encore d&apos;organisation. Créez-en une pour commencer à utiliser l&apos;application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {showForm ? (
            <CreateOrganizationForm 
              onCancel={() => setShowForm(false)}
              onError={(message) => setError(message)} 
            />
          ) : (
            <p className="text-sm text-muted-foreground mb-4">
              Une organisation vous permet de gérer vos clients, projets, factures et plus encore.
            </p>
          )}
        </CardContent>
        {!showForm && (
          <CardFooter>
            <Button onClick={() => setShowForm(true)} className="w-full">
              Créer mon organisation
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
} 