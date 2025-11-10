"use client";

import ResponsiveDrawer from "@/components/responsive-drawer";
import { Button, ButtonProps } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import LoadingButton from "@/components/ui/loading-button";
import { AppointmentData } from "@/lib/types";
import { useState } from "react";
import { UseFieldArrayRemove } from "react-hook-form";
import { deleteStaffAppointmentMutation } from "../mutations/appointment";

interface ButtonDeleteAppointmentProps extends ButtonProps {
  appointment: AppointmentData;
  index: number;
  deleteItem: UseFieldArrayRemove;
}

export default function ButtonDeleteAppointment({
  appointment,
  deleteItem,
  index,
  ...props
}: ButtonDeleteAppointmentProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        title={appointment ? "Edit Appointment" : "Add Appointment"}
        onClick={() => setOpen(true)}
        {...props}
      />
      <DialogDeleteAppointment
        open={open}
        setOpen={setOpen}
        appointment={appointment}
        onDelete={() => deleteItem(index)}
      />
    </>
  );
}

interface DialogDeleteAppointmentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  appointment: AppointmentData;
  onDelete: () => void;
}
export function DialogDeleteAppointment({
  open,
  setOpen,
  appointment,
  onDelete,
}: DialogDeleteAppointmentProps) {
  const { mutate, isPending } = deleteStaffAppointmentMutation();
  function handleDelete() {
    mutate(appointment.id, {
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
      title={`Delete status type for ${appointment.appointmentType}`}
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
