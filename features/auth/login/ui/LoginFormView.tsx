import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { LoginSchema } from "@/features/auth/shared/auth.schema";

interface LoginFormViewProps {
  form: UseFormReturn<LoginSchema>;
  onSubmit: (data: LoginSchema) => void;
  serverError: string | null;
  isLoading: boolean;
}

export function LoginFormView({ form, onSubmit, serverError, isLoading }: LoginFormViewProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="mb-2 text-sm text-destructive font-medium">{serverError}</div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Mot de passe</FormLabel>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>

        <div className="text-center text-sm">
          Pas encore de compte?{" "}
          <Link href="/register" className="text-primary hover:underline">
            S'inscrire
          </Link>
        </div>
      </form>
    </Form>
  );
} 