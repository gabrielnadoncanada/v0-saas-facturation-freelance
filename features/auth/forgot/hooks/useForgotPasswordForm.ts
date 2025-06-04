import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from '@/features/auth/shared/schema/auth.schema';
import { forgotPasswordAction } from '@/features/auth/forgot/actions/forgotPassword.action';

export function useForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setServerError(null);
    const formData = new FormData();
    formData.append('email', data.email);

    const res = await forgotPasswordAction(formData);

    if (!res.success) {
      setServerError(res.error || 'Erreur inconnue');
    } else {
      setSent(true);
    }
  };

  return { form, onSubmit, serverError, sent };
}
