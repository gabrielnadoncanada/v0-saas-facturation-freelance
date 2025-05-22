import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/features/auth/shared/schema/auth.schema";
import { loginUserAction } from "@/features/auth/login/actions/loginUser.action";

export function useLoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null)
    setIsLoading(true)
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const res = await loginUserAction(formData)
    setIsLoading(false)

    if (!res.success) {
      setServerError(res.error || "Erreur inconnue")
      return false
    }
    return true
  };

  return { form, onSubmit, serverError, isLoading };
} 