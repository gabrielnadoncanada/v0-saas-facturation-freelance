import type React from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { createClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopNav } from '@/features/dashboard/view/ui/TopNav';
import { Footer } from '@/components/layout/Footer';


export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();


  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden border-r border-slate-200 dark:border-slate-800 md:block">
        <DashboardSidebar
      
        />
      </aside>
      <div className="flex w-full flex-1 flex-col">
        <TopNav user={user} profile={profile} />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="mx-auto max-w-7xl animate-fadeIn p-4 md:p-6 lg:p-8">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
