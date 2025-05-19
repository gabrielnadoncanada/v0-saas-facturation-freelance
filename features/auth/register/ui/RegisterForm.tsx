'use client'

import { useRegisterForm } from "@/features/auth/register/hooks/useRegisterForm";
import { RegisterFormView } from "@/features/auth/register/ui/RegisterFormView";

export function RegisterForm() {
  const { form, onSubmit, serverError } = useRegisterForm();
  return (
    <RegisterFormView
      form={form}
      onSubmit={onSubmit}
      serverError={serverError}
    />
  );
}
