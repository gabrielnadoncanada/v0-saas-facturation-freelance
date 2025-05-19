import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, RegisterSchema } from "@/features/auth/shared/schema/auth.schema";
import { registerUserAction } from "@/features/auth/register/actions/registerUser.action";

export function useRegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    const res = await registerUserAction(formData);

    if (!res.success) {
      setServerError(res.error || "Erreur inconnue");
    } else {
      router.push("/register/confirmation");
    }
  };

  return { form, onSubmit, serverError };
} 