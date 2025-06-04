'use client';

import { useForgotPasswordForm } from '@/features/auth/forgot/hooks/useForgotPasswordForm';
import { ForgotPasswordFormView } from '@/features/auth/forgot/ui/ForgotPasswordFormView';

export function ForgotPasswordForm() {
  const { form, onSubmit, serverError, sent } = useForgotPasswordForm();
  return (
    <ForgotPasswordFormView form={form} onSubmit={onSubmit} serverError={serverError} sent={sent} />
  );
}
