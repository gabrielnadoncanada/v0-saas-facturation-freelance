'use client';

interface NoOrganizationLayoutProps {
  children: React.ReactNode;
}

export function NoOrganizationLayout({ children }: NoOrganizationLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Facturation Freelance
      </footer>
    </div>
  );
} 