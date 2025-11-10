"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { AppointmentData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { EmployeeSchema } from "@/lib/validation";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { DotIcon, Edit3Icon, Trash2Icon } from "lucide-react";
import {
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
} from "react-hook-form";
import ButtonAddEditAppointment from "./button-add-edit-appointment";
import ButtonDeleteAppointment from "./button-delete-appointment";

export const useAppointmentColumns = ({
  append,
  update,
  remove,
}: {
  append: UseFieldArrayAppend<EmployeeSchema>;
  update: UseFieldArrayUpdate<EmployeeSchema>;
  remove: UseFieldArrayRemove;
}): ColumnDef<AppointmentData>[] => [
  {
    id: "index",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="#" />;
    },
    cell({ row }) {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "position.jobTitle",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Position" />;
    },
    cell({ row }) {
      const appointment = row.original;
      return (
        <div>
          <div>{appointment.position.jobTitle}</div>
          <div className="text-muted-foreground flex items-center text-xs">
            {appointment.position.salaryScale} <DotIcon />
            {formatCurrency(appointment.basicSalary || 0)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dateOfAppointment",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Appointment date" />;
    },
    cell({ row }) {
      const appointment = row.original;
      return (
        <div>
          <div>{formatDate(appointment.dateOfAppointment, "PPP")}</div>
          <div className="text-xs text-muted-foreground">
            Appointment {appointment.number}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "organization",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="organization" />;
    },
    cell({ row }) {
      const appointment = row.original;
      return (
        <div>
          <div>{appointment.organization}</div>
          <div className="text-xs text-muted-foreground line-clamp-1 ">
            {appointment.dutyStation}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "minuteNumber",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Minute number" />;
    },
    cell({ row }) {
      const appointment = row.original;
      return (
        <div>
          <div>{appointment.minuteNumber}</div>
          <div className="text-xs text-muted-foreground">
            {appointment.appointmentType}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dateOfAssumptionOfDuty",
    header({ column }) {
      return (
        <DataTableColumnHeader
          column={column}
          title="Assumption of duty date"
        />
      );
    },
    cell({ row }) {
      const appointment = row.original;
      return <div>{formatDate(appointment.dateOfAssumptionOfDuty, "PPP")}</div>;
    },
  },
  {
    id: "action",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Action" />;
    },
    cell({ row }) {
      const appointment = row.original;
      return (
        <div className="flex gap-2">
          <ButtonAddEditAppointment
            variant={"secondary"}
            appointment={appointment}
            append={append}
            update={update}
            employeeId={appointment.employeeId!}
            index={row.index}
          >
            <Edit3Icon />
          </ButtonAddEditAppointment>
          <ButtonDeleteAppointment
            variant={"destructive"}
            appointment={row.original}
            deleteItem={remove}
            index={row.index}
          >
            <Trash2Icon />
          </ButtonDeleteAppointment>
        </div>
      );
    },
  },
];
