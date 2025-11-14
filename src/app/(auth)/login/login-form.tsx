"use client";

import { NumberInput } from "@/components/number-input/number-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import { PasswordInput } from "@/components/ui/password-input";
import { REDIRECT_TO_URL_SEARCH_PARAMS } from "@/lib/constants";
import { staffLoginSchema, StaffLoginValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginAction } from "./actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const loginRedirectUrl =
    searchParams.get(REDIRECT_TO_URL_SEARCH_PARAMS) || "/";

  const [isPending, startTransition] = useTransition();
  const form = useForm<StaffLoginValues>({
    resolver: zodResolver(staffLoginSchema),
    defaultValues: {
      ippsNumber: undefined,
      password: "",
    },
  });

  async function onSubmit(values: StaffLoginValues) {
    startTransition(async () => {
      const { error } = await loginAction(values!, loginRedirectUrl);
      if (error) {
        toast.error("LOGIN ERROR", {
          position: "top-center",
          description: error,
        });
      }
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="last:pt-6 space-y-4"
      >
        <FormField
          control={form.control}
          name="ippsNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee Number</FormLabel>
              <FormControl>
                <NumberInput placeholder="e.g., 13578 or 00013578" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="type here your password"
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Log in
        </LoadingButton>
        <Link
          href={`/forgot-password/${form.watch("ippsNumber")}?user=staff`}
          className="block text-center underline group/link hover:text-primary"
        >
          <span>Forgot your password?</span>
          <MoveRightIcon className="inline group-hover/link:visible transition-all ease-linear delay-200 ms-2 invisible  " />
        </Link>
      </form>
    </Form>
  );
}
