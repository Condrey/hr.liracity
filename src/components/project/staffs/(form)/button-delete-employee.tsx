"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { EmployeeData } from "@/lib/types";
import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";
import { useDeleteEmployeeMutation } from "./mutations/mutation";

interface ButtonDeleteEmployeeProps extends ButtonProps {
  employee: EmployeeData;
}

export default function ButtonDeleteEmployee({
  employee,
  variant,
  ...props
}: ButtonDeleteEmployeeProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant || "destructive"}
        {...props}
      />
      <DeleteEmployeeDialog open={open} setOpen={setOpen} employee={employee} />
    </>
  );
}

interface DeleteEmployeeDialogProps {
  employee: EmployeeData;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export function DeleteEmployeeDialog({
  employee,
  open,
  setOpen,
}: DeleteEmployeeDialogProps) {
  const { mutate, isPending } = useDeleteEmployeeMutation();
  function handleDelete() {
    mutate(employee.id, { onSuccess: () => setOpen(false) });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive ">
            <AlertTriangleIcon
              className="inline mr-2 size-10 fill-destructive text-destructive-foreground  "
              strokeWidth={0.8}
            />
            <span className="uppercase">Delete {employee.user.name}</span>
          </DialogTitle>
          <DialogDescription>
            Dangerous! Please note that this action is irreversible
          </DialogDescription>
        </DialogHeader>
        <p>
          This will delete <strong>{employee.user.name}</strong> employee and
          all their related data from the database. Continue with caution.
        </p>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton
            loading={isPending}
            variant={"destructive"}
            onClick={handleDelete}
          >
            Continue
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
