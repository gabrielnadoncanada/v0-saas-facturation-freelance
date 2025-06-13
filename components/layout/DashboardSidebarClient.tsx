'use client';

import type * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  UserCircle,
  Settings,
  Briefcase,
  Package,
  Building2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  isNew?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

export function DashboardSidebarClient() {
  const pathname = usePathname();

  const navSections: NavSection[] = [
    {
      title: 'Principal',
      items: [
        {
          title: 'Tableau de bord',
          href: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Clients',
          href: '/dashboard/clients',
          icon: Users,
        },
        {
          title: 'Projets',
          href: '/dashboard/projects',
          icon: Briefcase,
        },
        {
          title: 'Produits',
          href: '/dashboard/products',
          icon: Package,
        },
      ],
    },
    {
      title: 'Finance',
      items: [
        {
          title: 'Factures',
          href: '/dashboard/invoices',
          icon: FileText,
        },
        {
          title: 'Paiements',
          href: '/dashboard/payments',
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'Système',
      items: [
     
        {
          title: 'Organisations',
          href: '/dashboard/organizations',
          icon: Building2,
        },
        {
          title: 'Paramètres',
          href: '/dashboard/settings',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {navSections.map((section) => (
        <div key={section.title} className="space-y-3">
          <div className="flex items-center px-2">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <Separator className="ml-2 flex-1" />
          </div>
          <nav className="grid gap-1.5 px-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800/50',
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-foreground',
                    )}
                  />
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge !== undefined && item.badge !== 0 && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full p-0 px-1.5 text-xs font-medium',
                        isActive
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'border-muted bg-muted/50 text-muted-foreground',
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {item.isNew && (
                    <Badge className="ml-auto bg-green-500 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white dark:bg-green-600">
                      NEW
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
} 