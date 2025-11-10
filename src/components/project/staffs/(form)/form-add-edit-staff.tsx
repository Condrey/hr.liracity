"use client";

import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DepartmentData, EmployeeData } from "@/lib/types";
import { employeeSchema, EmployeeSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Appointments from "./appointment/appointments";
import { upsertStaffEmployeeMutation } from "./mutations/mutation";
import PersonalInformation from "./personal-information";
import Statuses from "./status/statuses";
import WorkInformation from "./work-information";

interface FormAddEditStaffProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  departments: DepartmentData[];
  employee?: EmployeeData;
}

export default function FormAddEditStaff({
  open,
  setOpen,
  departments,
  employee,
}: FormAddEditStaffProps) {
  const currentYear = new Date().getFullYear();
  const id = (Date.now() + Math.random()).toString();
  const position = employee?.position;
  const user = employee?.user;
  const form = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      id: employee?.id || id,
      workInformation: {
        assumedOffice: employee?.assumedOffice || currentYear,
        dob: employee?.dob,
        fileNumber: employee?.fileNumber,
        id: employee?.id,
        ippsNumber: Number(employee?.ippsNumber),
        nationalIdNumber: employee?.nationalIdNumber,
        shortMessageToPublic: employee?.shortMessageToPublic,
        supplierNumber: employee?.supplierNumber,
        taxIdentificationNumber: employee?.taxIdentificationNumber,
        position: {
          ...position,
          duties: position?.duties.map((d) => ({ id: d, value: d })),
          reportsToId: position?.reportsToId!,
        },
      },
      personalInformation: {
        ...user,
        name: user?.name || "",
        telephone: user?.telephone!,
      },
      appointments: employee?.appointments.map((a) => ({
        ...a,
        position: {
          ...a.position,
          duties: a.position?.duties.map((d) => ({ id: d, value: d })),
          reportsToId: a.position?.reportsToId!,
        },
      })),
      employeeStatuses: employee?.employeeStatuses.map((e) => ({
        ...e,
        id: e.id,
        employeeId: e.employeeId || employee.id,
        minuteNumber: e.minuteNumber!,
      })),
    },
  });

  // const [croppedAvatar,setCroppedAvatar] = useState<Blob|null>(null)

  const { isPending, mutate } = upsertStaffEmployeeMutation();

  function submitInfo(input: EmployeeSchema) {
    mutate(input, { onSuccess: () => setOpen(false) });
  }

  const tabs: { id: string; label: string; content: React.ReactNode }[] = [
    {
      id: "personal-information",
      label: "Personal Information",
      content: <PersonalInformation form={form} />,
    },
    {
      id: "work-information",
      label: "Work Information",
      content: <WorkInformation form={form} />,
    },
    {
      id: "appointments",
      label: "Appointments",
      content: <Appointments form={form} />,
    },
    { id: "statuses", label: "Statuses", content: <Statuses form={form} /> },
  ];
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="p-4 h-svh overflow-auto px-0 " side="top">
        <div className="w-full max-w-9xl  h-full mx-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitInfo)}
              className="space-y-4"
            >
              <SheetHeader>
                <SheetTitle>{`${
                  employee ? "Update" : "Create new"
                } employee information`}</SheetTitle>
                <SheetDescription className="sr-only">
                  Customize staff here
                </SheetDescription>
              </SheetHeader>

              <Tabs
                defaultValue="personal-information"
                className="sticky top-0"
              >
                <div className="bg-muted px-3 py-1.5 overflow-y-auto border-y">
                  <TabsList className="">
                    {tabs.map(({ id, label }) => (
                      <TabsTrigger key={id} value={id}>
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                {tabs.map(({ id, content, label }) => (
                  <TabsContent
                    key={id}
                    value={id}
                    className="space-y-6 px-3 pb-12"
                  >
                    <h1 className="text-xl tracking-tight font-bold">
                      {label}
                    </h1>
                    {content}
                  </TabsContent>
                ))}
              </Tabs>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
