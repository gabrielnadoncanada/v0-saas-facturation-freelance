'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { forgotPasswordSchema, ForgotPasswordSchema } from '@/features/auth/shared/auth.schema'
import { forgotPasswordAction } from './forgotPassword.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setServerError(null)
    const formData = new FormData()
    formData.append('email', data.email)

    const res = await forgotPasswordAction(formData)

    if (!res.success) {
      setServerError(res.error || 'Erreur inconnue')
    } else {
      setSent(true)
    }
  }

  return sent ? (
    <Alert variant="default">
      📩 Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.
    </Alert>
  ) : (
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
          {form.formState.isSubmitting ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
        </Button>
      </form>
    </Form>
  )
}
