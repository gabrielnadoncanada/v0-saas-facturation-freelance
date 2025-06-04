import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import { Form } from '@/components/ui/form';
import { InvoiceGeneralFields } from '@/features/invoice/shared/ui/InvoiceGeneralFields';
import { InvoiceLineFields } from '@/features/invoice/shared/ui/InvoiceLineFields';

interface InvoiceFormViewProps {
  form: any;
  control: any;
  handleSubmit: any;
  onSubmit: any;
  error: string | null;
  isLoading: boolean;
  fields: any;
  append: any;
  remove: any;
  move: any;
  sensors: any;
  handleDragEnd: any;
  tax_rate: number;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  clients: any[];
  handleClientCreated: (client: any) => void;
  invoice?: any;
  onCancel: () => void;
}

export function InvoiceFormView(props: InvoiceFormViewProps) {
  return (
    <FormProvider {...props.form}>
      <Form {...props.form}>
        <form onSubmit={props.handleSubmit(props.onSubmit)} className="space-y-6">
          {props.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{props.error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InvoiceGeneralFields
                  control={props.control}
                  clients={props.clients}
                  onClientCreated={props.handleClientCreated}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Récapitulatif</CardTitle>
                {props.invoice && (
                  <div className="text-lg font-semibold">{props.invoice.invoice_number}</div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total HT</span>
                    <span>{formatCurrency(props.subtotal, props.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA ({props.tax_rate}%)</span>
                    <span>{formatCurrency(props.tax, props.currency)}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-4 text-lg">
                    <span>Total TTC</span>
                    <span>{formatCurrency(props.total, props.currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="overflow-hidden">
            <InvoiceLineFields
              fields={props.fields}
              control={props.control}
              append={props.append}
              remove={props.remove}
              move={props.move}
              sensors={props.sensors}
              handleDragEnd={props.handleDragEnd}
              tax_rate={props.tax_rate}
              currency={props.currency}
            />
            <div className="border-t border-border bg-muted/30 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  {props.fields.length} {props.fields.length > 1 ? 'lignes' : 'ligne'} au total
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Total HT:</span>
                    <span className="font-medium">
                      {formatCurrency(props.subtotal, props.currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">TVA ({props.tax_rate}%):</span>
                    <span className="font-medium">{formatCurrency(props.tax, props.currency)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Total TTC:</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(props.total, props.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={props.onCancel}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={props.isLoading} className="w-full sm:w-auto">
              {props.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {props.invoice ? 'Mettre à jour' : 'Créer la facture'}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
