import { validateRequest } from "@/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { AppSidebar } from "../../components/home/app-sidebar";
import Footer from "../../components/home/footer";
import TopAppBar from "../../components/project/staffs/top-app-bar";
import SessionProvider from "../session-provider";

export const iframeHeight = "800px";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await validateRequest();
  if (!!user && !user.isVerified) {
    redirect(`/user-verification/${user.id}`);
  }

  return (
    <SessionProvider value={{ session, user }}>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col ">
          <header className="sticky top-0 z-50  w-full dark:bg-card bg-primary text-primary-foreground dark:text-card-foreground  dark:border-b">
            <TopAppBar className="w-full max-w-9xl   py-2 mx-auto  px-3 " />
          </header>
          <div className="flex flex-1 size-full ">
            <AppSidebar />
            <SidebarInset>
              <div className=" mx-auto h-full overflow-hidden pt-2 flex flex-col  w-full">
                <main className=" flex-1   overflow-y-auto scroll-auto flex flex-col gap-4 ">
                  {children}
                  <footer className="w-full">
                    <Footer className="bg-black/80 dark:bg-white/20 *:px-4 w-full  text-background dark:text-foreground " />
                  </footer>
                </main>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </SessionProvider>
  );
}
