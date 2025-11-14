import { organization, webName } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login",
};
export default async function Page() {
  return (
    <main className="flex flex-col pb-12 h-dvh items-center gap-12 sm:gap-6  ">
      <header className="px-3 w-full uppercase min-h-20 flex flex-row justify-center-safe gap-4 items-center  bg-secondary ">
        <Image
          alt="coat-of-arms"
          src={"/coat-of-arms.png"}
          height={50}
          width={50}
          className="hidden sm:flex"
        />
        <h1 className="text-xl sm:text-2xl">
          {webName}: &nbsp;<strong>{organization}</strong>
        </h1>
        <Image
          alt="logo"
          src={"/logo.png"}
          height={50}
          width={50}
          className="hidden sm:flex"
        />
      </header>
      <div className=" flex-1 max-h-fit sm:m-auto w-full max-w-sm sm:bg-muted rounded-md sm:border p-4">
        <h1 className="text-center sm:text-xl text-lg uppercase font-bold text-primary">
          Administrator Login
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
