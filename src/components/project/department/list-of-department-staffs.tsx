"use client";

import { DataTable } from "@/components/data-table/data-table";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { DepartmentData, EmployeeData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useStaffListColumn } from "../staffs/columns";
import { getDepartmentAndEmployeesByDepartmentId } from "./action";
import DepartmentContainer from "./department-container";

interface ListOfDepartmentStaffsProps {
  initialData: { department: DepartmentData; staffs: EmployeeData[] };
  departmentId: string;
}

export default function ListOfDepartmentStaffs({
  initialData,
  departmentId,
}: ListOfDepartmentStaffsProps) {
  const query = useQuery({
    queryKey: ["staff-list", "department", departmentId],
    queryFn: async () => getDepartmentAndEmployeesByDepartmentId(departmentId),
    initialData,
  });
  const { data, status } = query;
  if (status === "error")
    return (
      <ErrorContainer
        errorMessage="Failed to get department and its staff lists. Please try again"
        query={query}
      />
    );

  return (
    <>
      {!data.department ? (
        <EmptyContainer message="This department does not exist." />
      ) : (
        <DepartmentContainer
          department={data.department}
          staffs={data.staffs}
        />
      )}
      {!data.staffs.length ? (
        <EmptyContainer message="This department does not have any staff." />
      ) : (
        <DataTable
          data={data.staffs}
          columns={useStaffListColumn}
          filterColumn={{ id: "user_name" }}
          className="w-full  mx-auto"
        />
      )}
    </>
  );
}
