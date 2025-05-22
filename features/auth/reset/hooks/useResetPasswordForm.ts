import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resetPasswordSchema, ResetPasswordSchema } from '@/features/auth/shared/schema/auth.schema'
import { resetPasswordAction } from '@/features/auth/reset/actions/resetPassword.action'

export function useResetPasswordForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  })

  const onSubmit = async (data: ResetPasswordSchema) => {
    setServerError(null)
    const formData = new FormData()
    formData.append('password', data.password)

    const res = await resetPasswordAction(formData)

    if (!res.success) {
      setServerError(res.error || 'Erreur inconnue')
    } else {
      router.push('/login')
    }
  }

  return { form, onSubmit, serverError }
}
