import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { UseFormReturn } from 'react-hook-form'
import { ResendConfirmationSchema } from '@/features/auth/shared/schema/auth.schema'

interface ResendConfirmationFormViewProps {
  form: UseFormReturn<ResendConfirmationSchema>
  onSubmit: (data: ResendConfirmationSchema) => void
  serverError: string | null
  sent: boolean
}

export function ResendConfirmationFormView({ form, onSubmit, serverError, sent }: ResendConfirmationFormViewProps) {
  if (sent) {
    return (
      <Alert variant="default">
        📩 Si un compte existe avec cet email et n'est pas vérifié, un nouveau lien de confirmation a été envoyé.
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="mb-2 text-sm text-destructive font-medium">{serverError}</div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Envoi en cours...' : "Renvoyer l'email de confirmation"}
        </Button>
      </form>
    </Form>
  )
}
