"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { AppointmentData } from "@/lib/types";
import { EmployeeSchema } from "@/lib/validation";
import { useState } from "react";
import { UseFieldArrayAppend, UseFieldArrayUpdate } from "react-hook-form";
import FormAddEditAppointment from "./form-add-edit-appointment";

interface ButtonAddEditAppointmentProps extends ButtonProps {
  append: UseFieldArrayAppend<EmployeeSchema>;
  update: UseFieldArrayUpdate<EmployeeSchema>;
  appointment?: AppointmentData;
  employeeId: string;
  index?: number;
}

export default function ButtonAddEditAppointment({
  append,
  update,
  appointment,
  index,
  employeeId,
  ...props
}: ButtonAddEditAppointmentProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        title={appointment ? "Edit Appointment" : "Add Appointment"}
        onClick={() => setOpen(true)}
        {...props}
      />
      <FormAddEditAppointment
        open={open}
        setOpen={setOpen}
        append={append}
        update={update}
        appointment={appointment}
        index={index}
        employeeId={employeeId}
      />
    </>
  );
}
