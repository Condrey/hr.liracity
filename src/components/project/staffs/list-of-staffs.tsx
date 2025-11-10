"use client";

import { DataTable } from "@/components/data-table/data-table";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import { EmployeeData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAllStaffs } from "./action";
import { useStaffListColumn } from "./columns";

interface ListOfStaffsProps {
  initialData: EmployeeData[];
}

export default function ListOfStaffs({ initialData }: ListOfStaffsProps) {
  const query = useQuery({
    queryKey: ["staff-lists"],
    queryFn: getAllStaffs,
    initialData,
  });
  const { data, status } = query;
  if (status === "error")
    return (
      <ErrorContainer
        errorMessage="Failed to get staff lists. Please try again"
        query={query}
      />
    );
  if (status === "success" && !data.length)
    return <EmptyContainer message="There are no staffs in the system yet" />;
  return <DataTable data={data} columns={useStaffListColumn} filterColumn={{id:'user_name',label:'name'}} className="w-full max-w-7xl mx-auto" />;
}
