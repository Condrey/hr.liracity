import { DataTable } from "@/components/data-table/data-table";
import EmptyContainer from "@/components/query-containers/empty-container";
import { EmployeeSchema } from "@/lib/validation";
import cuid from "cuid";
import { PlusIcon } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import ButtonAddEditStatus from "./button-add-edit-status";
import { useEmployeeStatusColumns } from "./columns";

interface StatusesProps {
  form: UseFormReturn<EmployeeSchema>;
}

export default function Statuses({ form }: StatusesProps) {
  const {
    fields: statuses,
    append,
    remove,
    update,
  } = useFieldArray({ control: form.control, name: "employeeStatuses" });
  const watchedStatuses = form.watch("employeeStatuses");

  return (
    <div className="flex flex-col max-w-7xl md:justify-between md:flex-row gap-4">
      <div className="space-y-4 w-full">
        {!statuses.length ? (
          <EmptyContainer message="This officer has not been assigned any status yet. Assign new status">
            <ButtonAddEditStatus
              employeeId={form.getValues("id")!}
              variant={"secondary"}
              append={append}
              update={update}
            >
              Add status
            </ButtonAddEditStatus>
          </EmptyContainer>
        ) : (
          <DataTable
            data={watchedStatuses?.map((a) => ({
              ...a,
              id: a.id || cuid(),
              employeeId: "",
              reason: a.reason!,
              minuteNumber: a.minuteNumber!,
            }))}
            columns={useEmployeeStatusColumns({
              append,
              update,
              remove,
              employeeId: form.watch("id")!,
            })}
            filterColumn={{ id: "statusType", label: "status type" }}
            ROWS_PER_TABLE={5}
          >
            <ButtonAddEditStatus
              append={append}
              update={update}
              employeeId={form.watch("id")!}
            >
              <PlusIcon /> status
            </ButtonAddEditStatus>
          </DataTable>
        )}
      </div>
    </div>
  );
}
