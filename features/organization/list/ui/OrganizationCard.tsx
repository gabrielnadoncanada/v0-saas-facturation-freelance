'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Crown, Shield, User, Loader2 } from 'lucide-react';
import { switchOrganizationAction } from '../../switch/actions/switchOrganization.action';
import { OrganizationWithRole } from '../model/getOrganizations';
import { cn } from '@/shared/lib/utils';

interface OrganizationCardProps {
  organization: OrganizationWithRole;
  isCurrentOrganization: boolean;
}

export function OrganizationCard({ organization, isCurrentOrganization }: OrganizationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Propriétaire';
      case 'admin':
        return 'Administrateur';
      case 'member':
        return 'Membre';
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default' as const;
      case 'admin':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSwitchOrganization = async () => {
    if (isCurrentOrganization || isLoading) return;

    setIsLoading(true);
    try {
      const result = await switchOrganizationAction(organization.id);
      if (result.success) {
        router.refresh();
      } else {
        console.error('Failed to switch organization:', result.error);
      }
    } catch (error) {
      console.error('Error switching organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        isCurrentOrganization ? 'ring-2 ring-primary' : 'cursor-pointer hover:ring-1 hover:ring-muted-foreground/20',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
      onClick={handleSwitchOrganization}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={organization.logo_url} alt={organization.name} />
            <AvatarFallback>
              {organization.logo_url ? getInitials(organization.name) : <Building2 className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{organization.name}</CardTitle>
            <CardDescription className="truncate">@{organization.slug}</CardDescription>
          </div>
          {isCurrentOrganization && (
            <Badge variant="default" className="text-xs">
              Actuelle
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getRoleIcon(organization.role)}
            <Badge variant={getRoleBadgeVariant(organization.role)} className="text-xs">
              {getRoleLabel(organization.role)}
            </Badge>
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            {organization.plan}
          </Badge>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Créée le {new Date(organization.created_at).toLocaleDateString('fr-FR')}
        </div>

        {!isCurrentOrganization && !isLoading && (
          <div className="mt-3 text-xs text-muted-foreground/80">
            Cliquez pour basculer vers cette organisation
          </div>
        )}

        {isLoading && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Basculement en cours...
          </div>
        )}
      </CardContent>
    </Card>
  );
} 