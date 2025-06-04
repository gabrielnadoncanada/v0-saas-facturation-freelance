'use client';

import { useResetPasswordForm } from '@/features/auth/reset/hooks/useResetPasswordForm';
import { ResetPasswordFormView } from '@/features/auth/reset/ui/ResetPasswordFormView';

export function ResetPasswordForm() {
  const { form, onSubmit, serverError } = useResetPasswordForm();
  return <ResetPasswordFormView form={form} onSubmit={onSubmit} serverError={serverError} />;
}
