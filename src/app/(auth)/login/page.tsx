import { validateRequest } from "@/auth";
import { webName } from "@/lib/utils";
import { Metadata } from "next";
import UserTypes from "./user-types";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> => {
  const userType = (await searchParams)["user"] || "Civilian";
  return { title: "Login as a " + userType };
};

export default async function Page() {
  const user = await validateRequest();
  return (
    <main className="flex h-dvh items-center justify-center ">
      <div className="flex flex-row-reverse size-full   justify-center md:justify-end overflow-hidden ">
        <div className="w-full h-dvh flex flex-col sm:space-y-6 space-y-16 overflow-y-auto px-3 md:px-10 p-10 md:w-2/5 ">
          {/* <pre>{JSON.stringify(user,null,2)}</pre> */}
          <div className="space-y-1 text-center md:text-start ">
            <h1 className="text-3xl text-shadow font-bold uppercase">{`Login to ${webName}`}</h1>
          </div>

          <div className="space-y-3  max-w-md w-full mx-auto md:me-auto md:mx-0  ">
            <UserTypes />
          </div>
        </div>

        <div className=" hidden w-3/5  md:block h-dvh bg-gradient-to-bl from-primary dark:from-primary/50 ">
          <div className="   bg-cover mask-contain mask-no-repeat  h-dvh mask-[url(/uganda.png)] bg-[url(/hero.jpg)]" />
        </div>
      </div>
    </main>
  );
}
