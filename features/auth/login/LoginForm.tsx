"use client"

import { useLoginForm } from "./hooks/useLoginForm"
import { LoginFormView } from "./ui/LoginFormView"

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