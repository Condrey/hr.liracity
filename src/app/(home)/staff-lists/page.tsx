import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import BodyContainer from "@/components/home/body-container";
import { getAllStaffs } from "@/components/project/staffs/action";
import ListOfStaffs from "@/components/project/staffs/list-of-staffs";
import { staffListLinks } from "@/lib/constants";
import { Metadata } from "next";
import { Suspense } from "react";

const { title, description } = staffListLinks.find(
  (val) => val.href === "/staff-lists"
)!;

export const metadata: Metadata = {
  title,
  description,
};

export default function Page() {
  return (
    <BodyContainer breadCrumbs={[{ title: "Staff Lists" }]}>
      <Suspense fallback={<DataTableLoadingSkeleton />}>
        <ListOfStaffsContainer />
      </Suspense>
    </BodyContainer>
  );
}

async function ListOfStaffsContainer() {
  const allStaffs = await getAllStaffs();
  return <ListOfStaffs initialData={allStaffs} />;
}
