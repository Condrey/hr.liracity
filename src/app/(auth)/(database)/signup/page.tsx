import { webName } from "@/lib/utils";
import { Metadata } from "next";
import SignUpForm from "./signup-form";
export const metadata: Metadata = {
  title: "Self registration",
};
export default function Page() {
  return (
    <main className="flex h-dvh items-center justify-center ">
      <div className="flex flex-row-reverse size-full   justify-center md:justify-end overflow-hidden ">
        <div className="w-full h-dvh flex flex-col sm:space-y-6 space-y-16 overflow-y-auto px-3 md:px-10 p-10 md:w-2/5 ">
          <div className="space-y-1 text-center md:text-start ">
            <h1 className="text-3xl text-shadow font-bold uppercase">{`Sign in to ${webName}`}</h1>
            {/* <p className="text-muted-foreground">school motto here </p> */}
          </div>
          <div className="space-y-2 max-w-md md:bg-secondary/50 dark:md:bg-secondary md:backdrop-blur-2xl dark:md:border md:px-3 md:py-5 rounded-md">
            <SignUpForm />
          </div>
        </div>
        <div className=" hidden w-3/5  md:block h-dvh bg-gradient-to-bl from-black dark:from-black/20 via-yellow-500 dark:via-yellow-500/20 to-red-500 dark:to-red-500/20 ">
          <div className="   bg-cover mask-contain mask-no-repeat  h-dvh mask-[url(/uganda.png)] bg-[url(/hero.jpg)]" />
        </div>
        {/* <Image
          src={SignUpImage}
          alt=""
          className="hidden w-1/2 bg-foreground object-cover md:block"
        /> */}
      </div>
    </main>
  );
}
