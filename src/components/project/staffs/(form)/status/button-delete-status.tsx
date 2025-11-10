"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { EmployeeStatusData } from "@/lib/types";
import { useState } from "react";
import { UseFieldArrayRemove } from "react-hook-form";
import { deleteStaffStatusMutation } from "../mutations/status";

interface ButtonDeleteEmployeeStatusProps extends ButtonProps {
  employeeStatus: EmployeeStatusData;
  index: number;
  deleteItem: UseFieldArrayRemove;
}

export default function ButtonDeleteEmployeeStatus({
  employeeStatus,
  deleteItem,
  index,
  ...props
}: ButtonDeleteEmployeeStatusProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        title={employeeStatus ? "Edit EmployeeStatus" : "Add EmployeeStatus"}
        onClick={() => setOpen(true)}
        {...props}
      />
      <DialogDeleteEmployeeStatus
        open={open}
        setOpen={setOpen}
        employeeStatus={employeeStatus}
        onDelete={() => deleteItem(index)}
      />
    </>
  );
}

interface DialogDeleteEmployeeStatusProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  employeeStatus: EmployeeStatusData;
  onDelete: () => void;
}
export function DialogDeleteEmployeeStatus({
  open,
  setOpen,
  employeeStatus,
  onDelete,
}: DialogDeleteEmployeeStatusProps) {
  const { mutate, isPending } = deleteStaffStatusMutation();
  function handleDelete() {
    mutate(employeeStatus.id, {
      onSuccess: () => {
        onDelete();
        setOpen(false);
      },
    });
  }
  return (
    <ResponsiveDrawer
      open={open}
      setOpen={setOpen}
      title={`Delete status type for ${employeeStatus.statusType}`}
      description="Please know that this action can not be undone, proceed with caution."
    >
      <DialogFooter>
        <Button
          type="button"
          variant={"outline"}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <LoadingButton
          type="button"
          loading={isPending}
          variant={"destructive"}
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
      </DialogFooter>
    </ResponsiveDrawer>
  );
}
