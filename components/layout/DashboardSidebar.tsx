import type * as React from 'react';
import { DashboardSidebarClient } from './DashboardSidebarClient';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APP_NAME } from '@/shared/lib/constants';
import Image from 'next/image';
import { OrganizationSwitcherWrapper } from '@/features/organization/switch/ui/OrganizationSwitcherWrapper';

export async function DashboardSidebar() {
  return (
    <div className="flex h-full w-[280px] flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="flex h-16 items-center border-b px-6 py-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Image
              src="/logo.png"
              alt="Logo"
              width={24}
              height={24}
              className="h-5 w-5 object-contain"
            />
          </div>
          <span className="text-lg font-semibold tracking-tight text-primary">{APP_NAME}</span>
        </div>
      </div>

      <div className="px-4 py-4 border-b">
        <OrganizationSwitcherWrapper />
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <DashboardSidebarClient />
      </ScrollArea>
    </div>
  );
}
