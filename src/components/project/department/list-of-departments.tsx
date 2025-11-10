"use client";

import { getAllDepartments } from "@/components/project/staffs/action";
import EmptyContainer from "@/components/query-containers/empty-container";
import ErrorContainer from "@/components/query-containers/error-container";
import {
  Item,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { DepartMent } from "@/generated/prisma";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTransition } from "react";

export default function ListOfDepartments({
  initialData,
}: {
  initialData: DepartMent[];
}) {
  const query = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
    initialData,
  });
  const { status, data } = query;
  if (status === "error") {
    return (
      <ErrorContainer
        query={query}
        errorMessage="Failed to fetch departments. Please try again."
      />
    );
  }
  if (status === "success" && !data.length) {
    return (
      <EmptyContainer message="There are no departments in the database yet." />
    );
  }
  return (
    <ItemGroup className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
      {data.map((department) => (
        <DepartmentItem key={department.id} department={department} />
      ))}
    </ItemGroup>
  );
}

function DepartmentItem({ department }: { department: DepartMent }) {
  const [isPending, startTransition] = useTransition();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  return (
    <Item variant={"outline"} onClick={() => startTransition(() => {})} asChild>
      <Link
        href={getNavigationLinkWithPathnameWithoutUpdate(
          `/departments/${department.id}`
        )}
      >
        <ItemHeader>
          <ItemTitle className="text-lg font-medium">
            {department.name}
          </ItemTitle>
          <ItemDescription>{isPending && <Spinner />}</ItemDescription>
        </ItemHeader>
      </Link>
    </Item>
  );
}
