import { APP_NAME } from '@/shared/lib/constants';

export function Footer() {
  return (
    <footer className="p-4">
      <div className="text-center text-xs text-muted-foreground">
        <p className="font-medium">{APP_NAME} v1.0 - Tous droits réservés</p>
      </div>
    </footer>
  );
}
