'use client'

import { useForgotPasswordForm } from "./hooks/useForgotPasswordForm";
import { ForgotPasswordFormView } from "./ui/ForgotPasswordFormView";

export function ForgotPasswordForm() {
  const { form, onSubmit, serverError, sent } = useForgotPasswordForm();
  return (
    <ForgotPasswordFormView
      form={form}
      onSubmit={onSubmit}
      serverError={serverError}
      sent={sent}
    />
  );
}
