import EmptyContainer from "@/components/query-containers/empty-container";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { AppointmentData } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { formatDate } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface AppointmentsProps {
  employeeId: string;
  appointments: AppointmentData[];
}

export default function Appointments({
  employeeId,
  appointments,
}: AppointmentsProps) {
  return (
    <Item variant={"default"} className="px-0">
      <ItemContent className="px-0 space-y-6">
        <div>
          {!appointments.length ? (
            <EmptyContainer message="The staff has no appointment registered yet" />
          ) : (
            <ItemGroup className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentItem
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </ItemGroup>
          )}
        </div>{" "}
      </ItemContent>
    </Item>
  );
}

const AppointmentItem = ({ appointment }: { appointment: AppointmentData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Item
      variant={!isExpanded ? "outline" : "muted"}
      className="max-w-5xl transition-colors"
    >
      <ItemHeader className="flex-wrap">
        <span>
          {` ${formatDate(
            appointment.dateOfAppointment,
            "PPP"
          )} - Appointment ${appointment.number}`}
        </span>
        <Button
          variant={"secondary"}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon />
            </>
          ) : (
            <>
              Show more
              <ChevronDownIcon />
            </>
          )}
        </Button>
      </ItemHeader>
      <ItemContent>
        <ItemTitle className="uppercase">
          {appointment.position.jobTitle}{" "}
          <strong className="text-primary inline-flex">
            ( {appointment.appointmentType})
          </strong>
        </ItemTitle>
        <ItemTitle>
          {appointment.position.salaryScale} (
          {formatCurrency(appointment.basicSalary)})
        </ItemTitle>
        <ItemDescription>
          {appointment.dutyStation} - {appointment.organization}
        </ItemDescription>
      </ItemContent>
      <ItemFooter
        className={cn(
          "transition-all border-t py-4 gap-1.5 flex-col items-start",
          isExpanded ? "flex animate-in" : "hidden animate-out"
        )}
      >
        <p>
          <strong> Date of appointment:</strong>{" "}
          {formatDate(appointment.dateOfAppointment, "PPP")}
        </p>
        <p>
          <strong> Date of Assumption of duty:</strong>{" "}
          {formatDate(appointment.dateOfAssumptionOfDuty, "PPP")}
        </p>
        <p>
          <strong> Minute number:</strong> {appointment.minuteNumber}
        </p>
        <p className="pt-3">
          <strong className="block uppercase"> Job Purpose:</strong>{" "}
          {appointment.position.departmentalMandate}
        </p>
        <div className="pt-3">
          <strong className="block uppercase"> Duties/Responsibilities:</strong>{" "}
          <ul className=" list-inside gap-1 space-y-1.5 list-[lower-roman]">
            {appointment.position.duties.map((d, index) => (
              <li key={index} className="max-w-4xl">
                {d}
              </li>
            ))}
          </ul>
        </div>
        <Button
          variant={"secondary"}
          onClick={() => setIsExpanded(!isExpanded)}
          className="max-w-fit mx-auto"
        >
          Show less <ChevronUpIcon />
        </Button>
      </ItemFooter>
    </Item>
  );
};
