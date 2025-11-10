"use client";

import LoadingButton from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyUserSchema, VerifyUserSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { verifyUser } from "./action";
import { User } from "@/generated/prisma";

interface VerificationFormProps {
  user: User;
}
export default function VerificationForm({ user }: VerificationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const form = useForm<VerifyUserSchema>({
    resolver: zodResolver(verifyUserSchema),
    defaultValues: {
      email: user.email || "",
      name: user.name || "",
      telephone: user.telephone || "",
      username: user.username || "",
      password: "",
      id: user.id || "",
    },
  });

  async function onSubmit(input: VerifyUserSchema) {
    setError(undefined);
    const error = await verifyUser(input);

    startTransition(() => {
      if (error) {
        setError(error.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <p className="rounded-md bg-red-500/70 px-2 py-1 text-destructive-foreground">
            {error}
          </p>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="enter your full name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="username goes here ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Please enter an email ..."
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telephone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="include your telephone number too"
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="Your password goes here ..."
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton className="w-full" loading={form.formState.isSubmitting}>
          Continue
        </LoadingButton>
      </form>
    </Form>
  );
}
