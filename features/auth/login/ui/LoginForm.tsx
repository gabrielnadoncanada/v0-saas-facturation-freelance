"use client"

import { useLoginForm } from "@/features/auth/login/hooks/useLoginForm"
import { LoginFormView } from "@/features/auth/login/ui/LoginFormView"

export function LoginForm() {
  const { form, onSubmit, serverError, isLoading } = useLoginForm();
  return (
    <LoginFormView
      form={form}
      onSubmit={onSubmit}
      serverError={serverError}
      isLoading={isLoading}
    />
  );
}