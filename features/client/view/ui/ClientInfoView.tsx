import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientInfoProps } from '../types/client-view.types';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Phone
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export function ClientInfoView({ client }: ClientInfoProps) {
  if (!client) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">{client.name}</CardTitle>
        <div className="flex gap-2">
          <Link 
            href={`/dashboard/clients/${client.id}/edit`} 
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Modifier
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email || "Non spécifié"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone || "Non spécifié"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>Taux horaire: {client.hourly_rate ? `${client.hourly_rate}€/h` : "Non spécifié"}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Adresse de facturation</div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  {client.billing_address ? (
                    <>
                      <div>{client.billing_address}</div>
                      <div>
                        {client.billing_postal_code} {client.billing_city}
                      </div>
                      <div>{client.billing_country}</div>
                    </>
                  ) : (
                    "Non spécifiée"
                  )}
                </div>
              </div>
            </div>

            {client.notes && (
              <div className="mt-4">
                <div className="text-sm font-medium">Notes</div>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {client.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 