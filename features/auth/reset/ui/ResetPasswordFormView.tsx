import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ResetPasswordSchema } from '@/features/auth/shared/schema/auth.schema';

interface ResetPasswordFormViewProps {
  form: UseFormReturn<ResetPasswordSchema>;
  onSubmit: (data: ResetPasswordSchema) => void;
  serverError: string | null;
}

export function ResetPasswordFormView({ form, onSubmit, serverError }: ResetPasswordFormViewProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="mb-2 text-sm text-destructive font-medium">{serverError}</div>
        )}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
        </Button>
      </form>
    </Form>
  );
}
