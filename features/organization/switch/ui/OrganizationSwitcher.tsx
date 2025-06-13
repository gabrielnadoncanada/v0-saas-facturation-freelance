'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Organization } from '@/shared/types/organization.types';
import { useOrganizationSwitcher } from '../hooks/useOrganizationSwitcher';

interface OrganizationSwitcherProps {
  currentOrganization?: Organization;
  className?: string;
}

export function OrganizationSwitcher({ currentOrganization, className }: OrganizationSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { organizations, switching, switchOrganization } = useOrganizationSwitcher();


  const handleSwitchOrganization = async (organizationId: string) => {
    if (organizationId === currentOrganization?.id) {
      setOpen(false);
      return;
    }

    const success = await switchOrganization(organizationId);
    
    if (success) {
      setOpen(false);
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner':
        return 'default';
      case 'admin':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Propriétaire';
      case 'admin':
        return 'Admin';
      case 'member':
        return 'Membre';
      default:
        return role;
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Sélectionner une organisation"
            className={cn("w-full justify-between", className)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-5 w-5">
                <AvatarImage src={currentOrganization?.logo_url} alt={currentOrganization?.name} />
                <AvatarFallback className="text-xs">
                  {currentOrganization ? getInitials(currentOrganization.name) : <Building2 className="h-3 w-3" />}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">
                {currentOrganization?.name || 'Sélectionner une organisation'}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <Command>
            <CommandInput placeholder="Rechercher une organisation..." />
            <CommandList>
              <CommandEmpty>Aucune organisation trouvée.</CommandEmpty>
              {organizations.length > 0 && (
                <CommandGroup heading="Organisations">
                  {organizations.map((org) => (
                    <CommandItem
                      key={org.id}
                      value={org.name}
                      onSelect={() => handleSwitchOrganization(org.id)}
                    >
                      <Avatar className="mr-2 h-4 w-4">
                        <AvatarImage src={org.logo_url} alt={org.name} />
                        <AvatarFallback className="text-xs">
                          {getInitials(org.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{org.name}</span>
                      <Badge variant={getRoleBadgeVariant(org.role)} className="text-xs mr-2">
                        {getRoleLabel(org.role)}
                      </Badge>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          currentOrganization?.id === org.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
} 