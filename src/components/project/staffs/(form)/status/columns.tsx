"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { EmployeeStatusData } from "@/lib/types";
import { EmployeeSchema } from "@/lib/validation";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { Edit3Icon, Trash2Icon } from "lucide-react";
import {
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
} from "react-hook-form";
import ButtonAddEditEmployeeStatus from "./button-add-edit-status";
import ButtonDeleteEmployeeStatus from "./button-delete-status";

export const useEmployeeStatusColumns = ({
  append,
  employeeId,
  update,
  remove,
}: {
  append: UseFieldArrayAppend<EmployeeSchema>;
  update: UseFieldArrayUpdate<EmployeeSchema>;
  remove: UseFieldArrayRemove;
  employeeId: string;
}): ColumnDef<EmployeeStatusData>[] => [
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
    accessorKey: "statusType",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Status type" />;
    },
    cell({ row }) {
      const employeeStatus = row.original;
      return (
        <div>
          <div>{employeeStatus.statusType}</div>
          <div className="text-xs text-muted-foreground">
            {formatDate(employeeStatus.date, "PPP")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "minuteNumber",
    header({ column }) {
      return <DataTableColumnHeader column={column} title="Minute Number" />;
    },
    cell({ row }) {
      const employeeStatus = row.original;
      return <div>{employeeStatus.minuteNumber || "N/A"}</div>;
    },
  },
  {
    accessorKey: "reason",
    header({ column }) {
      return (
        <DataTableColumnHeader column={column} title="Reason for status" />
      );
    },
    cell({ row }) {
      const employeeStatus = row.original;
      return (
        <div>
          <TipTapViewer
            content={employeeStatus.reason || "N/A"}
            className="line-clamp-1 max-w-md"
          />
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
      return (
        <div className="flex gap-2">
          <ButtonAddEditEmployeeStatus
            variant={"secondary"}
            employeeStatus={row.original}
            append={append}
            employeeId={employeeId}
            update={update}
            index={row.index}
          >
            <Edit3Icon />
          </ButtonAddEditEmployeeStatus>
          <ButtonDeleteEmployeeStatus
            variant={"destructive"}
            employeeStatus={row.original}
            deleteItem={remove}
            index={row.index}
          >
            <Trash2Icon />
          </ButtonDeleteEmployeeStatus>
        </div>
      );
    },
  },
];
