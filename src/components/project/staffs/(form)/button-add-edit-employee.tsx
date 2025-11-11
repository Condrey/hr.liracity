"use client";

import { useSession } from "@/app/session-provider";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@/generated/prisma";
import { myPrivileges } from "@/lib/enums";
import { EmployeeData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllDepartments } from "../action";
import FormAddEditStaff from "./form-add-edit-staff";

interface ButtonAddEditEmployeeProps extends ButtonProps {
  employee?: EmployeeData;
}

export default function ButtonAddEditEmployee({
  employee,
  size,
  ...props
}: ButtonAddEditEmployeeProps) {
  const [open, setOpen] = useState(false);
  const { user } = useSession();
  const query = useQuery({
    queryKey: ["All departments"],
    queryFn: getAllDepartments,
  });
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) return null;
  const { data, status } = query;
  return (
    <>
      {status === "pending" ? (
        <Skeleton
          className={cn("ms-auto max-w-56", buttonVariants({ size }))}
        />
      ) : status === "error" ? (
        <ErrorContainer
          query={query}
          errorMessage="Failed to fetch departments"
        />
      ) : status === "success" && !data.length ? (
        <EmptyContainer message={""}></EmptyContainer>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          size={size}
          title={
            employee
              ? `Update ${employee.user.name!.split(" ").pop()}'s information`
              : "Create new staff"
          }
          {...props}
        />
      )}

      <FormAddEditStaff
        open={open}
        setOpen={setOpen}
        employee={employee}
        departments={data!}
      />
    </>
  );
}
