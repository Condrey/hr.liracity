import BodyContainer from "@/components/home/body-container";
import ListOfDepartments from "@/components/project/department/list-of-departments";
import { getAllDepartments } from "@/components/project/staffs/action";
import EmptyContainer from "@/components/query-containers/empty-container";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function Page() {
  return (
    <BodyContainer
      breadCrumbs={[
        { title: "Staff lists", href: "/staff-lists" },
        { title: "Departments" },
      ]}
      className="space-y-6"
    >
      <h1 className="text-xl md:text-2xl font-bold">
        Please select a department
      </h1>
      <Suspense
        fallback={
          <EmptyContainer message="Fetching departments...">
            <Spinner />
          </EmptyContainer>
        }
      >
        <SuspenseDepartmentsList />
      </Suspense>
    </BodyContainer>
  );
}

async function SuspenseDepartmentsList() {
  const departments = await getAllDepartments();
  return <ListOfDepartments initialData={departments} />;
}
