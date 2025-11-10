"use client";

import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { cn } from "@/lib/utils";
import { MoveRightIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import GoogleSignInButton from "../google/google-signin-button";
import LoginForm from "./login-form";

export default function UserLogin() {
  const [isPending, startTransition] = useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();

  return (
    <>
      <div className="flex justify-center gap-3 w-full items-center pt-3">
        <GoogleSignInButton />
      </div>
      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-muted-foreground" />
        <span className="text-muted-foreground uppercase">Or use Email</span>
        <div className="h-px flex-1 bg-muted-foreground" />
      </div>
      <LoginForm />

      <Link
        href={getNavigationLinkWithPathnameWithoutUpdate(`/signup`)}
        className="block text-center underline group/link hover:text-primary mt-4"
        onClick={() => startTransition(() => {})}
      >
        <span>
          {`Don't have an account?`} <strong>SignUp</strong>
        </span>
        <MoveRightIcon
          className={cn(
            "inline group-hover/link:visible transition-all ease-linear delay-200 ms-2 invisible  ",
            isPending && " visible animate-caret-blink",
          )}
        />
      </Link>
    </>
  );
}
