"use client";

import { useSession } from "@/app/session-provider";
import { Button, ButtonProps } from "@/components/ui/button";
import { Role } from "@/generated/prisma";
import { myPrivileges } from "@/lib/enums";
import { DepartmentData } from "@/lib/types";
import { useState } from "react";
import FormAddEditDepartment from "./form-add-edit-department";

interface ButtonAddEditDepartmentProps extends ButtonProps {
  department?: DepartmentData;
  children: React.ReactNode;
}
export default function ButtonAddEditDepartment({
  department,
  children,
  ...props
}: ButtonAddEditDepartmentProps) {
  const { user } = useSession();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) return null;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        title={
          department
            ? `Update ${department.name} department's value`
            : "Create a new department"
        }
        {...props}
      >
        {children}
      </Button>
      <FormAddEditDepartment
        open={open}
        setOpen={setOpen}
        departmentToEdit={department}
      />
    </>
  );
}
