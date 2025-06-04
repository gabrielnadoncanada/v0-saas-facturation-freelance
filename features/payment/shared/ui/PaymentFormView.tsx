import type React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/shared/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';

interface PaymentFormViewProps {
  formData: {
    amount: number;
    payment_date: Date;
    payment_method: string;
    notes: string;
  };
  balanceDue: number;
  currency: string;
  isLoading: boolean;
  error: string | null;
  handleChange: (name: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function PaymentFormView({
  formData,
  balanceDue,
  currency,
  isLoading,
  error,
  handleChange,
  handleSubmit,
}: PaymentFormViewProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">Montant</Label>
        <Input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          max={balanceDue}
          value={formData.amount}
          onChange={(e) => handleChange('amount', Number.parseFloat(e.target.value))}
          required
        />
        <p className="text-sm text-muted-foreground">
          Solde dû: {formatCurrency(balanceDue, currency)}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_date">Date de paiement</Label>
        <DatePicker
          date={formData.payment_date}
          setDate={(date) => handleChange('payment_date', date)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_method">Méthode de paiement</Label>
        <Select
          value={formData.payment_method}
          onValueChange={(value) => handleChange('payment_method', value)}
        >
          <SelectTrigger id="payment_method">
            <SelectValue placeholder="Sélectionner une méthode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card">Carte bancaire</SelectItem>
            <SelectItem value="cash">Espèces</SelectItem>
            <SelectItem value="transfer">Virement</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Informations supplémentaires..."
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer le paiement
        </Button>
      </div>
    </form>
  );
}
