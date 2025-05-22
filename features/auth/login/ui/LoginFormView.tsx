"use client";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { LoginSchema } from "@/features/auth/shared/schema/auth.schema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { getPasswordStrength } from "@/shared/lib/utils";

interface LoginFormViewProps {
  form: UseFormReturn<LoginSchema>;
  onSubmit: (data: LoginSchema) => void;
  serverError: string | null;
  isLoading: boolean;
}

export function LoginFormView({ form, onSubmit, serverError, isLoading }: LoginFormViewProps) {
  const [showPassword, setShowPassword] = useState(false)
  const passwordValue = form.watch("password")
  const strength = getPasswordStrength(passwordValue || "")

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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...field}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                    </span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
              {passwordValue && (
                <div className="space-y-1 pt-1">
                  <Progress
                    value={strength}
                    className="h-1"
                    indicatorClassName={
                      strength < 40 ? "bg-destructive" : strength < 70 ? "bg-yellow-500" : "bg-green-500"
                    }
                  />
                  <div className="text-xs text-muted-foreground font-medium">
                    {strength < 40 ? "Faible" : strength < 70 ? "Moyen" : "Fort"}
                  </div>
                </div>
              )}
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