import { buttonVariants } from "@/components/ui/button";
import { webName } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Not found",
  description: `The resource was not found in ${webName}`,
};
export default function Loading() {
  return (
    <div className="flex flex-col h-dvh gap-4 justify-center items-center">
      <h1 className="text-2xl font-black md:text-3xl uppercase slashed-zero oldstyle-nums  first-letter:text-warning">
        <span>404 |</span> <span>Not found</span>
      </h1>
      <p className="max-w-sm  text-center">
        The resource you are looking for wasn't found. Please, check the url and
        try again
      </p>
      <Link href={"/"} className={buttonVariants({ variant: "default" })}>
        Go to home page
      </Link>
    </div>
  );
}
