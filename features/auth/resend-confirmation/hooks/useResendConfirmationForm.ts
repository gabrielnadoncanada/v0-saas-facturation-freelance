import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { resendConfirmationSchema, ResendConfirmationSchema } from '@/features/auth/shared/schema/auth.schema'
import { resendConfirmationAction } from '@/features/auth/resend-confirmation/actions/resendConfirmation.action'

export function useResendConfirmationForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const form = useForm<ResendConfirmationSchema>({
    resolver: zodResolver(resendConfirmationSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ResendConfirmationSchema) => {
    setServerError(null)
    const formData = new FormData()
    formData.append('email', data.email)

    const res = await resendConfirmationAction(formData)

    if (!res.success) {
      setServerError(res.error || 'Erreur inconnue')
    } else {
      setSent(true)
    }
  }

  return { form, onSubmit, serverError, sent }
}
