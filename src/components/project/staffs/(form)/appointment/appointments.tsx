import { DataTable } from "@/components/data-table/data-table";
import EmptyContainer from "@/components/query-containers/empty-container";
import { EmployeeSchema } from "@/lib/validation";
import cuid from "cuid";
import { PlusIcon } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import ButtonAddEditAppointment from "./button-add-edit-appointment";
import { useAppointmentColumns } from "./columns";

interface AppointmentsProps {
  form: UseFormReturn<EmployeeSchema>;
}

export default function Appointments({ form }: AppointmentsProps) {
  const {
    fields: appointments,
    append,
    remove,
    update,
  } = useFieldArray({ control: form.control, name: "appointments" });
  const watchedAppointments = form.watch("appointments");

  return (
    <div className="flex flex-col max-w-7xl md:justify-between md:flex-row gap-4">
      <div className="space-y-4 w-full">
        {!appointments.length ? (
          <EmptyContainer message="This officer has not been assigned any appointment yet. Assign new appointment">
            <ButtonAddEditAppointment
              variant={"secondary"}
              append={append}
              update={update}
              employeeId={form.watch("id")!}
            >
              Add appointment
            </ButtonAddEditAppointment>
          </EmptyContainer>
        ) : (
          <DataTable
            data={watchedAppointments?.map((a) => ({
              ...a,
              position: {
                ...a.position,
                id: a.position?.id!,
                reportsToId: a.position?.reportsToId!,
                jobTitle: a.position?.jobTitle!,
                departmentalMandate: a.position?.departmentalMandate!,
                salaryScale: a.position?.salaryScale!,
                duties: a.position?.duties.map((d) => d.value)!,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              id: a.id || cuid(),
              employeeId: "",
              positionId: a.position?.id!,
              basicSalary: a.basicSalary!,
            }))}
            columns={useAppointmentColumns({ update, append, remove })}
            filterColumn={{ id: "position_jobTitle", label: "position" }}
            ROWS_PER_TABLE={5}
          >
            <ButtonAddEditAppointment
              append={append}
              update={update}
              employeeId={form.watch("id")!}
            >
              <PlusIcon /> appointment
            </ButtonAddEditAppointment>
          </DataTable>
        )}
      </div>
    </div>
  );
}
