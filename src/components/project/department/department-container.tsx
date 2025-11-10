"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import UserAvatar from "@/components/ui/user-avatar";

import EmptyContainer from "@/components/query-containers/empty-container";
import TipTapViewer from "@/components/tip-tap-editor/tip-tap-viewer";
import { DepartmentData, EmployeeData } from "@/lib/types";
import { Edit3Icon, Trash2Icon } from "lucide-react";
import ButtonAddEditDepartment from "./button-add-edit-department";
import ButtonAssignHod from "./button-assign-hod";
import ButtonDeleteDepartment from "./button-delete-department";

interface DepartmentContainerProps {
  department: DepartmentData;
  staffs: EmployeeData[];
}

export default function DepartmentContainer({
  department,
  staffs,
}: DepartmentContainerProps) {
  return (
    <Item variant={"muted"}>
      {!!department.headOfDepartment ? (
        <ItemHeader className="justify-start">
          <ItemMedia variant={"image"}>
            <UserAvatar
              avatarUrl={department.headOfDepartment?.user.avatarUrl}
              size={200}
              className="size-[200px]"
            />
          </ItemMedia>
          <div>
            <ItemTitle>
              HOD:{" "}
              {department.headOfDepartment?.user.name || "Not assigned name"}
            </ItemTitle>
            <ItemDescription>
              {department.headOfDepartment?.ippsNumber ||
                "Not assigned IPPS number"}
            </ItemDescription>
          </div>
        </ItemHeader>
      ) : (
        <ItemHeader>
          <EmptyContainer
            message="No Head of Department assigned"
            className="min-h-fit"
          />
        </ItemHeader>
      )}
      <ItemContent>
        <ItemDescription className="line-clamp-2 max-w-prose">
          <TipTapViewer content={department.about} />
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <ButtonAssignHod
          staffs={staffs}
          department={department}
          variant={"secondary"}
        >
          {`${!department.headOfDepartment ? "Assign" : "Update"} HOD`}
        </ButtonAssignHod>
        <ButtonAddEditDepartment department={department}>
          <Edit3Icon />
        </ButtonAddEditDepartment>
        <ButtonDeleteDepartment department={department} variant={"destructive"}>
          <Trash2Icon />
        </ButtonDeleteDepartment>
      </ItemActions>
    </Item>
  );
}
