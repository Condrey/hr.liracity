"use client";
import { useSession } from "@/app/session-provider";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import LoadingButton from "@/components/ui/loading-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UserAvatar from "@/components/ui/user-avatar";
import { Role } from "@/generated/prisma";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { myPrivileges } from "@/lib/enums";
import { EmployeeData } from "@/lib/types";
import { getTitle } from "@/lib/utils";
import UserTooltip from "@/utils/user-tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { DotIcon, VerifiedIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

export const useStaffListColumn: ColumnDef<EmployeeData>[] = [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="#" />;
    },
    cell({ row }) {
      return (
        <span className="text-muted-foreground slashed-zero  proportional-nums ">
          {row.index + 1}
        </span>
      );
    },
  },
  {
    accessorKey: "user.name",
    header({ column }) {
      return (
        <DataTableColumnHeader
          column={column}
          title="Employee bio-information"
        />
      );
    },
    cell({ row }) {
      const employee = row.original;
      const user = employee.user;
      const currentYear = new Date().getFullYear();
      return (
        <div className="flex items-center gap-2">
          <UserAvatar avatarUrl={user.avatarUrl} />
          <div className="flex flex-col justify-center">
            <div>
              <Badge
                className=""
                variant={
                  (employee.endedOffice || 0) < currentYear &&
                  employee.assumedOffice !== currentYear
                    ? "destructive"
                    : "success"
                }
              >
                {getTitle(employee.position?.jobTitle!)}
              </Badge>{" "}
              <UserTooltip user={user}>
                <span>{user.name}</span>
              </UserTooltip>{" "}
              {user.isVerified && (
                <VerifiedIcon className="inline size-4 fill-success text-success-foreground" />
              )}
            </div>
            {user.telephone && user.email ? (
              <div className="flex text-muted-foreground items-center text-xs ">
                <Link
                  href={`mailto:${user.email}`}
                  className="hover:text-primary underline"
                >
                  {user.email}
                </Link>
                <DotIcon />
                <Link
                  href={`tel:${user.telephone}`}
                  className="hover:text-primary underline"
                >
                  {user.telephone}
                </Link>
              </div>
            ) : (
              <em className="text-xs text-muted-foreground">
                --Missing contact--
              </em>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header({ column }) {
      return (
        <DataTableColumnHeader
          column={column}
          title="Employee Staff Information"
          className="hidden sm:flex"
        />
      );
    },
    cell({ row }) {
      const { position, assumedOffice, endedOffice, ippsNumber } = row.original;
      const { user } = useSession();
      const isAuthorized =
        !!user && myPrivileges[user.role].includes(Role.MODERATOR);
      return (
        <div className="hidden sm:flex flex-col ">
          <div>{position?.jobTitle}</div>
          <div className="text-muted-foreground text-xs">
            {assumedOffice} - {endedOffice || "Now"}
          </div>
          {isAuthorized && (
            <div className="text-muted-foreground text-xs">
              IPPS NUMBER:{" "}
              <strong>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(ippsNumber);
                          toast.success("Copied IPPS number to clipboard");
                        }}
                        className="slashed-zero cursor-pointer proportional-nums text-card-foreground underline hover:text-primary"
                      >
                        {ippsNumber}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to copy staff IPPS number</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </strong>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "departMentalSector.departMent.name ",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Department" />;
    },
    cell({ row }) {
      const section = row.original.departMentalSector;

      if (!section) return "N/A";

      return (
        <div>
          <div className="uppercase">{section.departMent?.name ?? "N/A"}</div>
          <div>{row.original.position?.jobTitle}</div>
        </div>
      );
    },
  },
  {
    id: "action",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Action" />;
    },
    cell({ row }) {
      const { user } = useSession();
      const [isPending, startTransition] = useTransition();
      const isAuthorized =
        !!user && myPrivileges[user.role].includes(Role.MODERATOR);
      const { getNavigationLinkWithoutUpdate } = useCustomSearchParams();
      const employee = row.original;
      const url = getNavigationLinkWithoutUpdate("/staff/" + employee.id);
      return (
        <div className="flex gap-2 items-center">
          <Link href={url} /*target="_blank" rel="noopener noreferrer"*/>
            <LoadingButton
              onClick={() => startTransition(() => {})}
              loading={isPending}
              variant={isAuthorized ? "ghost" : "default"}
              size={"sm"}
              asChild
            >
              <span className='sm:after:content-["_more"]'>View</span>{" "}
            </LoadingButton>
          </Link>
        </div>
      );
    },
  },
];
