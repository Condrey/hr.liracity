import BodyContainer from "@/components/home/body-container";
import { getStaffById } from "@/components/project/staffs/action";
import StaffInfoClient from "@/components/project/staffs/staff/staff-info-client";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import prisma from "@/lib/prisma";
import { formatDate } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";

interface PageProps {
  params: Promise<{ employeeId: string; departmentId: string }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || [];
  const { employeeId } = await params;
  const id = decodeURIComponent(employeeId);
  const staff = await getStaffById(id);
  if (!staff) {
    return {
      title: "Unknown staff",
      description:
        "The staff you are looking for does not exist, or has been deleted.",
    };
  }
  return {
    title: staff?.user.name,
    description: `${
      staff.user.name
    } is a staff at Lira City Council, holding the position of ${
      staff.position?.jobTitle || "Unknown Position"
    }. The duty began on ${formatDate(
      staff.assumedOffice,
      "PPPP"
    )} to ${formatDate(staff.endedOffice || new Date(), "PPPP")}.`,
    openGraph: {
      images: [staff.user.avatarUrl!, ...previousImages],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { employeeId, departmentId } = await params;
  const id = decodeURIComponent(employeeId);
  const [staff, department] = await Promise.all([
    await getStaffById(id),
    await prisma.departMent.findUnique({
      where: { id: decodeURIComponent(departmentId) },
    }),
  ]);
  if (!staff) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>This staff does not exist</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <BodyContainer
      breadCrumbs={[
        { title: "Staff lists", href: "/staff-lists" },
        { title: "Departments", href: "/departments" },
        {
          title: `${department?.name || "N/A"} Department`,
          href: `/departments/${department?.id}`,
        },
        {
          title: staff.user.name ?? "Unknown staff",
          href: `/staff-lists/${department?.id}/staff/${staff.id}`,
        },
      ]}
    >
      <StaffInfoClient initialData={staff} id={id} />
    </BodyContainer>
  );
}
