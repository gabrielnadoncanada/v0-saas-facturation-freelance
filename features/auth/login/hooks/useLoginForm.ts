import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/features/auth/shared/schema/auth.schema";
import { loginUserAction } from "@/features/auth/login/actions/loginUser.action";

export function useLoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setServerError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const res = await loginUserAction(formData);

    if (!res.success) {
      setServerError(res.error || "Erreur inconnue");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return { form, onSubmit, serverError };
}
