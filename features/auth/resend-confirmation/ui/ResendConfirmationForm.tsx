'use client'

import { useResendConfirmationForm } from '@/features/auth/resend-confirmation/hooks/useResendConfirmationForm'
import { ResendConfirmationFormView } from '@/features/auth/resend-confirmation/ui/ResendConfirmationFormView'

export function ResendConfirmationForm() {
  const { form, onSubmit, serverError, sent } = useResendConfirmationForm()
  return (
    <ResendConfirmationFormView
      form={form}
      onSubmit={onSubmit}
      serverError={serverError}
      sent={sent}
    />
  )
}
