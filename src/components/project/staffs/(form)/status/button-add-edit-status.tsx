"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { EmployeeStatusData } from "@/lib/types";
import { EmployeeSchema } from "@/lib/validation";
import { useState } from "react";
import { UseFieldArrayAppend, UseFieldArrayUpdate } from "react-hook-form";
import FormAddEditEmployeeStatus from "./form-add-edit-status";

interface ButtonAddEditEmployeeStatusProps extends ButtonProps {
  append: UseFieldArrayAppend<EmployeeSchema>;
  update: UseFieldArrayUpdate<EmployeeSchema>;
  employeeId: string;
  employeeStatus?: EmployeeStatusData;
  index?: number;
}

export default function ButtonAddEditEmployeeStatus({
  append,
  update,
  employeeStatus,
  employeeId,
  index,
  ...props
}: ButtonAddEditEmployeeStatusProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        title={employeeStatus ? "Edit Employee Status" : "Add Employee Status"}
        onClick={() => setOpen(true)}
        {...props}
      />
      <FormAddEditEmployeeStatus
        employeeId={employeeId}
        open={open}
        setOpen={setOpen}
        append={append}
        update={update}
        index={index}
        employeeStatus={employeeStatus}
      />
    </>
  );
}
