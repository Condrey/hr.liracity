"use client";

import { useSession } from "@/app/session-provider";
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
import { Role } from "@/generated/prisma";
import { myPrivileges } from "@/lib/enums";
import { DepartmentData } from "@/lib/types";
import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";
import { useDeleteDepartmentMutation } from "./mutation";

interface ButtonDeleteDepartmentProps extends ButtonProps {
  department: DepartmentData;
}

export default function ButtonDeleteDepartment({
  department,
  variant,
  ...props
}: ButtonDeleteDepartmentProps) {
  const [open, setOpen] = useState(false);
  const { user } = useSession();
  const isAuthorized =
    !!user && myPrivileges[user.role].includes(Role.MODERATOR);
  if (!isAuthorized) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant || "destructive"}
        {...props}
      />
      <DeleteDepartmentDialog
        open={open}
        setOpen={setOpen}
        department={department}
      />
    </>
  );
}

interface DeleteDepartmentDialogProps {
  department: DepartmentData;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export function DeleteDepartmentDialog({
  department,
  open,
  setOpen,
}: DeleteDepartmentDialogProps) {
  const { mutate, isPending } = useDeleteDepartmentMutation();
  function handleDelete() {
    mutate(department.id, { onSuccess: () => setOpen(false) });
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
            <span className="uppercase">
              Delete {department.name} department
            </span>
          </DialogTitle>
          <DialogDescription>
            Dangerous! Please note that this action is irreversible
          </DialogDescription>
        </DialogHeader>
        <p>
          This will delete <strong>{department.name}</strong> department and all
          its <strong>sections</strong> from the database. Continue with
          caution.
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
