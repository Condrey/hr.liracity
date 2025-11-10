import BodyContainer from "@/components/home/body-container";
import { getDepartmentAndEmployeesByDepartmentId } from "@/components/project/department/action";
import ListOfDepartmentStaffs from "@/components/project/department/list-of-department-staffs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ departmentId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { departmentId } = await params;
  const id = decodeURIComponent(departmentId);
  const { department } = await getDepartmentAndEmployeesByDepartmentId(id);
  if (!department) {
    return {
      title: "Department Not Found",
      description: `The department with id ${id} was not found.`,
    };
  }
  return {
    title: `${department.name} Department`,
    description: `Details and staff members of the ${department.name} department`,
  };
}

export default async function Page({ params }: PageProps) {
  const { departmentId } = await params;
  const id = decodeURIComponent(departmentId);
  const { department, staffs } = await getDepartmentAndEmployeesByDepartmentId(
    id
  );
  if (!department) notFound();
  return (
    <BodyContainer
      breadCrumbs={[
        { title: "Staff lists", href: "/staff-lists" },
        { title: "Departments", href: "/departments" },
        {
          title: `${department.name} Department`,
          href: `/departments/${department.id}`,
        },
      ]}
    >
      <h1 className="text-2xl font-bold mb-4">{department.name} Department</h1>
      <ListOfDepartmentStaffs
        departmentId={id}
        initialData={{ department, staffs }}
      />
    </BodyContainer>
  );
}
