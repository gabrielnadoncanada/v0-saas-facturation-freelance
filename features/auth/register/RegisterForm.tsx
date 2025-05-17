'use client'

import { useRegisterForm } from "./hooks/useRegisterForm";
import { RegisterFormView } from "./ui/RegisterFormView";

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
