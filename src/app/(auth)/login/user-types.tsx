"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { useSearchParams } from "next/navigation";
import StaffLogin from "./(staff-login)/staff-login";
import UserLogin from "./(user-login)/user-login";

export default function UserTypes() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  const { updateSearchParamsAndNavigate } = useCustomSearchParams();
  const users: { user: string; label: string }[] = [
    { user: "civilian", label: "Civilian Login" },
    { user: "staff", label: "Staff Member Login" },
  ];
  return (
    <Tabs defaultValue={user || "civilian"}>
      <TabsList className="w-full *:flex-1 ">
        {users.map((u) => {
          return (
            <TabsTrigger
              value={u.user}
              key={u.user}
              onClick={() => updateSearchParamsAndNavigate(`user`, u.user)}
            >
              {u.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      <p className="text-muted-foreground text-start w-full text-xs italic">
        Choose the kind of user type below, either staff or civilian
      </p>
      <TabsContent
        value="civilian"
        className="md:bg-primary/5 dark:md:bg-secondary mt-6 md:backdrop-blur-2xl dark:md:border md:px-3 md:py-5 rounded-md"
      >
        <h1 className="text-muted-foreground text-xl w-full text-center  hidden sm:block">
          Civilian Login
        </h1>
        <UserLogin />
      </TabsContent>
      <TabsContent
        value="staff"
        className="md:bg-primary/5 dark:md:bg-secondary mt-6 md:backdrop-blur-2xl dark:md:border md:px-3 md:py-5 rounded-md"
      >
        <h1 className="text-muted-foreground text-xl w-full text-center hidden sm:block">
          Staff Member Login
        </h1>
        <StaffLogin />
      </TabsContent>
    </Tabs>
  );
}
