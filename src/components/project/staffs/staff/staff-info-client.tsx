"use client";

import { getStaffById } from "@/components/project/staffs/action";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import ButtonAddEditEmployee from "../(form)/button-add-edit-employee";
import Appointments from "./appointments";
import PersonalInformation from "./personal-information";
import Statuses from "./statuses";
import WorkInformation from "./work-information";

interface StaffInfoClientProps {
  initialData: EmployeeData;
  id: string;
}

export default function StaffInfoClient({
  initialData,
  id,
}: StaffInfoClientProps) {
  const query = useQuery({
    queryKey: ["staff", "id", id],
    queryFn: async () => getStaffById(id),
    initialData,
  });
  const { data, status } = query;
  if (status === "error")
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch staff. Please try again"
      />
    );
  if (!data) return <EmptyContainer message="Staff not found" />;
  const { user } = data;
  return (
    <div>
      <Tabs defaultValue="work-information" className="space-y-6">
        <ButtonAddEditEmployee
          employee={data}
          variant={"destructive"}
          className='max-w-fit me-3 ms-auto md:after:content-["_information"]'
        >
          Edit Staff
        </ButtonAddEditEmployee>
        <div className="border-y py-1 bg-muted">
          <TabsList>
            <TabsTrigger value="personal-information">
              Personal Information
            </TabsTrigger>
            <TabsTrigger value="work-information">Work Information</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="statuses">Statuses</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal-information">
          <PersonalInformation user={user} />
        </TabsContent>
        <TabsContent value="work-information">
          <WorkInformation employee={data} />
        </TabsContent>
        <TabsContent value="appointments">
          <Appointments employeeId={data.id} appointments={data.appointments} />
        </TabsContent>
        <TabsContent value="statuses">
          <Statuses employeeId={data.id} statuses={data.employeeStatuses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
